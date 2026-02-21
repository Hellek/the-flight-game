/// <reference types="vitest/config" />
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react-swc';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      tsDecorators: true,
      useAtYourOwnRisk_mutateSwcOptions(options) {
        options.jsc ??= {};
        options.jsc.transform ??= {};
        options.jsc.transform.legacyDecorator = true;
        options.jsc.transform.decoratorMetadata = true;
        options.jsc.transform.useDefineForClassFields = false;
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      manifest: {
        name: 'Авиа магнат',
        short_name: 'Авиа магнат',
        description: 'The Flight Game',
        start_url: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        icons: [
          { src: '/favicon.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/favicon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['src/core/di/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    pool: 'forks',
    isolate: true,
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@core/*': path.resolve(__dirname, 'src/core/*'),
      '@layout': path.resolve(__dirname, 'src/layout'),
      '@models': path.resolve(__dirname, 'src/models'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@services/*': path.resolve(__dirname, 'src/services/*'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@routes/*': path.resolve(__dirname, 'src/routes/*'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@shared/*': path.resolve(__dirname, 'src/shared/*'),
      '@widgets': path.resolve(__dirname, 'src/widgets'),
      '@widgets/*': path.resolve(__dirname, 'src/widgets/*'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@hooks/*': path.resolve(__dirname, 'src/hooks/*'),
    },
  },
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
            return 'three';
          }
          // React и React DOM в отдельный chunk (но не react-three, который уже обработан)
          if (
            (id.includes('/react/') || id.includes('/react-dom/')) &&
            !id.includes('react-three')
          ) {
            return 'react-vendor';
          }
          // React Router в react-vendor chunk
          if (id.includes('/react-router')) {
            return 'react-vendor';
          }
          // MobX в отдельный chunk
          if (id.includes('/mobx/')) {
            return 'mobx';
          }
        },
      },
    },
    // Включаем sourcemaps для production (опционально, можно отключить для меньшего размера)
    sourcemap: false,
    // Минификация уже включена по умолчанию (oxc)
  },
});
