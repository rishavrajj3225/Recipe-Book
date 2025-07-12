import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://recipe-book-backend-fhh3.onrender.com/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
