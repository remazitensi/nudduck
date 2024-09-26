import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite 설정
export default defineConfig({
  // 플러그인 설정
  plugins: [react()],

  // 경로 별칭 설정
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },

  // 서버 설정
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 백엔드 서버 URL
        changeOrigin: true, // CORS 문제 해결을 위해 origin 변경
        rewrite: (path) => path.replace(/^\/api/, ''), // 요청 경로에서 /api 제거
      },
    },
  },
});
