import { defineConfig } from 'vite';

export default defineConfig({
  root: './', // Keep this if your root is public
  build: {
    rollupOptions: {
      input: './public/index.html'
    }
  },
  server: {
    historyApiFallback: true
  }
});
