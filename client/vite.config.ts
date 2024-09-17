import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:7000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/socket.io/, ''),
      },
    },
  },
});
