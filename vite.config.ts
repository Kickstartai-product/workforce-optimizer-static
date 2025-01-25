import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import compression from 'vite-plugin-compression';
import { resolve } from 'path'

export default defineConfig({
base: process.env.NODE_ENV === 'production' ? '/' : '/',
plugins: [react(),     
compression({
   algorithm: 'gzip',
   ext: '.gz',
   filter: /\.(js|mjs|json|css|html)$/i,
   threshold: 1024,
   deleteOriginFile: false,
   verbose: true,
})],
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},
build: {
  minify: 'terser',
  rollupOptions: {
    input: {
      app: resolve(__dirname, 'index.html')
    },
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'recharts-vendor': ['recharts'],
        'shadcn': [
          '@/components/ui/button',
          '@/components/ui/card',
          '@/components/ui/drawer',
          '@/components/ui/slider'
        ]
      }
    }
  },
  copyPublicDir: true,
  chunkSizeWarningLimit: 1000,
},
})