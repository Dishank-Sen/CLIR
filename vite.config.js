import { defineConfig } from 'vite';

export default defineConfig({
  root: './public', // Keep this if your root is public
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: 'index.html'
    }
  },
  server: {
    historyApiFallback: true
  }
});
