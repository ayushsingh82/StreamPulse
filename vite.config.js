import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable JSX in .tsx files
      include: '**/*.{jsx,tsx}',
    }),
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
        // Suppress Rollup warnings about comments in dependencies
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' ||
          warning.message?.includes('__PURE__') ||
          warning.message?.includes('sourcemap') ||
          warning.code === 'SOURCEMAP_ERROR'
        ) {
          return
        }
        warn(warning)
      },
      external: (id) => {
        // Don't externalize these - they need to be bundled
        return false
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
