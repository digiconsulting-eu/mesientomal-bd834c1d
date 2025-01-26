import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";

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
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    copyPublicDir: true,
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let fileName = assetInfo.name || '';
          // Skip sitemap files by returning an empty string
          if (fileName.includes('sitemap') || fileName === 'sitemap.xml') {
            return ''; // This will effectively skip the file
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  }
}));