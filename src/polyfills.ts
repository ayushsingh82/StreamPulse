// Polyfills for Node.js globals in browser
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof window !== 'undefined') {
  (window as any).global = (window as any).global ?? window;
  (window as any).Buffer = (window as any).Buffer ?? Buffer;
  (window as any).process = (window as any).process ?? { env: {} };
  
  // Also set on globalThis for broader compatibility
  (globalThis as any).Buffer = Buffer;
  (globalThis as any).global = globalThis;
  (globalThis as any).process = (globalThis as any).process ?? { env: {} };
}

export {};