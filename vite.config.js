import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
  },
  loaders: [
    {
      test: /plugin\.css$/,
      loaders: ['style-loader', 'css'],
    },
  ],
  optimizeDeps: {
    include: ['draft-js-import-markdown'],
  },
})
