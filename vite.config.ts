import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { execSync } from 'child_process';
import { componentTagger } from "lovable-tagger";

// Plugin personalizzato per generare i sitemap durante il build
const generateSitemapsPlugin = () => ({
  name: 'generate-sitemaps',
  buildStart: async () => {
    console.log('Generazione sitemap prima del build...');
    try {
      execSync('node scripts/generateSitemaps.js', { stdio: 'inherit' });
    } catch (error) {
      console.error('Errore durante la generazione dei sitemap:', error);
      throw error;
    }
  },
});

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    generateSitemapsPlugin()
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    copyPublicDir: true,
  }
}));