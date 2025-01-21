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
      execSync('bun run scripts/generateSitemaps.ts', { stdio: 'inherit' });
    } catch (error) {
      console.error('Errore durante la generazione dei sitemap:', error);
      throw error;
    }
  },
});

export default defineConfig({
  plugins: [react(), generateSitemapsPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});