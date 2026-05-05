// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://kairos.co.jp',
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      host: true,
      port: 4321,
      strictPort: true,
      watch: {
        usePolling: true,
      },
      hmr: {
        clientPort: 3013,
      },
    },
  },
});
