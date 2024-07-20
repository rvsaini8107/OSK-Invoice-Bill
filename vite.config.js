// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
// vite.config.js

export default {
  build: {
    rollupOptions: {
      external: ['jspdf', 'jspdf-autotable'], // Specify the external module(s) here
    },
  },
  plugins: [
    react(),
    // Other plugins you're using (e.g., @vitejs/plugin-react)
  ],
};
