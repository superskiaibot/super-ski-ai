import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@/components": path.resolve(__dirname, "./components"),
      "@/lib": path.resolve(__dirname, "./lib"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/constants": path.resolve(__dirname, "./src/constants"),
    },
  },
  define: {
    // Replace process.env in client code
    'process.env': process.env,
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'motion/react', 
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-tabs',
      '@radix-ui/react-progress',
      'recharts',
      'clsx',
      'tailwind-merge'
    ]
  },
  server: {
    port: 5173,
    open: true,
    host: true,
    hmr: {
      overlay: false
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['motion/react'],
          ui: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-button'],
          charts: ['recharts'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  css: {
    devSourcemap: true
  },
  // Enable legacy browser support if needed
  legacy: {
    buildSsrCjsExternalHeuristics: true,
  }
})