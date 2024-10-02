import react from '@vitejs/plugin-react';
import { config } from 'dotenv'; // dotenv 임포트 추가
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// dotenv 설정
config(); // .env 파일의 환경 변수를 로드합니다.

export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BACK_URL, // .env.production의 VITE_BACK_URL 사용
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
