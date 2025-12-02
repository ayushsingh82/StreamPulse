import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin to fix sendCallsSync import issue by providing it from viem
const fixSendCallsSync = () => {
  return {
    name: 'fix-sendCallsSync',
    enforce: 'pre',
    resolveId(id, importer) {
      // When sendCallsSync.js tries to import sendCallsSync from viem/actions
      if (importer?.includes('sendCallsSync.js') && id === 'viem/actions') {
        // Return a virtual module that we'll provide
        return '\0viem-actions-patch'
      }
      return null
    },
    load(id) {
      if (id === '\0viem-actions-patch') {
        // Re-export everything from viem/actions and add sendCallsSync stub
        return `
          export * from 'viem/actions';
          // sendCallsSync is not available in viem ~2.37.8, provide undefined
          export const sendCallsSync = undefined;
        `
      }
      return null
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable JSX in .tsx files
      include: '**/*.{jsx,tsx}',
    }),
    fixSendCallsSync(),
  ],
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
  build: {
    sourcemap: false, // Disable sourcemaps to avoid sourcemap errors
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress Rollup warnings about comments in dependencies and missing exports
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' ||
          warning.message?.includes('__PURE__') ||
          warning.message?.includes('sourcemap') ||
          warning.code === 'SOURCEMAP_ERROR' ||
          warning.code === 'UNRESOLVED_IMPORT' ||
          (warning.message && warning.message.includes('sendCallsSync'))
        ) {
          return
        }
        warn(warning)
      },
    },
    // Increase chunk size limit to avoid warnings
    chunkSizeWarningLimit: 1000,
    // Common chunk splitting
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ['buffer', 'viem', '@wagmi/core'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
})
