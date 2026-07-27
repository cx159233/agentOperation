import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: '/agentOperation/',
  plugins: [vue()],
  server: {
    host: true,
    port: 5210,
    strictPort: true,
  },
});
