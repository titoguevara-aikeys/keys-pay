import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Ensure environment variables are available
    'import.meta.env.VITE_ADMIN_API_SECRET': JSON.stringify(process.env.VITE_ADMIN_API_SECRET || 'temp-admin-secret'),
    'import.meta.env.FORCE_FULL_MONITORING': JSON.stringify(process.env.FORCE_FULL_MONITORING || 'true'),
    'import.meta.env.FLAG_STORE': JSON.stringify(process.env.FLAG_STORE || 'supabase'),
  }
}));
