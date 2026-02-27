/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
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
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
      manifest: {
        name: 'Авиа магнат',
        short_name: 'Авиа магнат',
        description: 'The Flight Game',
        start_url: '/',
        scope: '/',
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
