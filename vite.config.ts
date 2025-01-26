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
          // Exclude sitemap files completely
          if (fileName.includes('sitemap') || fileName === 'sitemap.xml') {
            return null; // This will prevent the file from being generated
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  }
}));