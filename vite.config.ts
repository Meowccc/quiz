import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/quiz/',
  build: {
    assetsInlineLimit: 100000000, // 極限提高，避免生成外部資源
  },
})
