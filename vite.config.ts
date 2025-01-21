import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { execSync } from 'child_process';

// Plugin personalizzato per generare i sitemap durante il build
const generateSitemapsPlugin = () => ({
  name: 'generate-sitemaps',
  buildStart: async () => {
    console.log('Generazione sitemap prima del build...');
    try {
      // Usa node invece di bun per compatibilità con Netlify
      execSync('node scripts/generateSitemaps.js', { stdio: 'inherit' });
    } catch (error) {
      console.error('Errore durante la generazione dei sitemap:', error);
      throw error;
    }
  },
});

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), generateSitemapsPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Assicurati che i file sitemap vengano copiati nella cartella di build
    copyPublicDir: true,
  }
});