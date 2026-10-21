import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        apresentacao: fileURLToPath(new URL('./index.html', import.meta.url)),
        comercial: fileURLToPath(new URL('./conheca/index.html', import.meta.url)),
      },
    },
  },
});
