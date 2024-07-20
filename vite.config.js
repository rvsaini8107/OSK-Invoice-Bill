// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// import React from "react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
// vite.config.js

export default {
  build: {
    rollupOptions: {
      external: ['jspdf'],
    },
  },
};
