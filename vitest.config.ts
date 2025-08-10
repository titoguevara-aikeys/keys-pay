import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env.VITE_ADMIN_API_SECRET': JSON.stringify('test-secret'),
    'import.meta.env.FORCE_FULL_MONITORING': JSON.stringify('true'),
    'import.meta.env.FLAG_STORE': JSON.stringify('supabase'),
  }
})