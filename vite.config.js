import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public', // Tell Vite that index.html is in public/
  build: {
    outDir: '../dist', // Output folder (one level up to avoid putting it inside public)
    rollupOptions: {
      input: 'public/index.html', // Ensure the correct path
    },
  },
});
