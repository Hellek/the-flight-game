import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'mobx', 'mobx-react-lite'],
  },
  build: {
    // Увеличиваем лимит предупреждения о размере чанка
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: id => {
          // Three.js и связанные библиотеки в отдельный chunk
          if (
            id.includes('/three/') ||
            id.includes('/@react-three/fiber/') ||
            id.includes('/@react-three/drei/')
          ) {
            return 'three'
          }
          // React и React DOM в отдельный chunk (но не react-three, который уже обработан)
          if (
            (id.includes('/react/') || id.includes('/react-dom/')) &&
            !id.includes('react-three')
          ) {
            return 'react-vendor'
          }
          // React Router в react-vendor chunk
          if (id.includes('/react-router')) {
            return 'react-vendor'
          }
          // MobX в отдельный chunk
          if (id.includes('/mobx/')) {
            return 'mobx'
          }
        },
      },
    },
    // Включаем sourcemaps для production (опционально, можно отключить для меньшего размера)
    sourcemap: false,
    // Минификация уже включена по умолчанию (oxc)
  },
})
