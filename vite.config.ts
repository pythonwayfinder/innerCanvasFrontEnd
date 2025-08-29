// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // 프론트(기본 5173) → 백엔드(8080) 프록시
    proxy: {
      // 1. '/api'로 시작하는 모든 API 요청을 백엔드로 전달
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // 2. '/oauth2'로 시작하는 소셜 로그인 요청을 백엔드로 전달
      '/oauth2': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // 3. Spring Security의 기타 로그인 관련 경로를 백엔드로 전달
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    },
  },
})