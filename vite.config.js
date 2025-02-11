import { defineConfig } from 'vite';

export default defineConfig({
  root: './public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html', // Ensure this path is correct
    },
  },
});
