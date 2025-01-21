import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";

// Plugin personalizzato per generare i sitemap durante il build
const generateSitemapsPlugin = () => ({
  name: 'generate-sitemaps',
  buildStart: async () => {
    if (process.env.NODE_ENV === 'production') {
      console.log('Generazione sitemap prima del build...');
      try {
        // Instead of using node directly, use the node executable with the --loader flag
        const { execSync } = require('child_process');
        execSync('node --loader ts-node/esm scripts/generateSitemaps.js', { stdio: 'inherit' });
      } catch (error) {
        console.error('Errore durante la generazione dei sitemap:', error);
        throw error;
      }
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