import { defineConfig } from 'vite';

export default defineConfig({
  root: './public', // Set root to public since index.html is there
  build: {
    outDir: '../dist', // Ensure build output is outside 'public'
    emptyOutDir: true, // Cleans the output directory before building
    rollupOptions: {
      input: 'index.html' // Ensure index.html is inside public
    }
  },
  server: {
    historyApiFallback: true
  }
});
