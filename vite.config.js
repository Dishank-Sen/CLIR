import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    rollupOptions: {
      input: './public/index.html'
    }
  },
  server: {
    historyApiFallback: true
  }
});
