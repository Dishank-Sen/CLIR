import { defineConfig } from 'vite';

export default defineConfig({
  root: './public', // Vite should use 'public' as the root
  build: {
    outDir: '../dist', // Ensure build output is outside 'public'
    rollupOptions: {
      input: 'index.html' // This works since root is 'public'
    }
  },
  server: {
    historyApiFallback: true
  }
});
