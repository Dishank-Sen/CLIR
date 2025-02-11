import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './public/index.html', // Ensure this path is correct
    },
  },
});
