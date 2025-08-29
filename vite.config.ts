// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // 프론트(기본 5173) → 백엔드(8080) 프록시
    proxy: {
      // ① 프론트에서 '/api/...' 로 호출하면
      '/api': {
        target: 'http://localhost:8080', // 백엔드 주소
        changeOrigin: true,
        secure: false,
        // ② 백엔드가 '/api' 없이 라우팅한다면 주석 해제
        // rewrite: (path) => path.replace(/^\/api/, ''),
        // 웹소켓도 쓰면 주석 해제
        // ws: true,
      },
    },
  },
})