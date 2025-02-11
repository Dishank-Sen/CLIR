import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'public/index.html', // Ensure this path is correct
    },
  },
});
