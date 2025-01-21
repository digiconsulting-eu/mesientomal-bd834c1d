import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";
import { execSync } from 'child_process';

// Plugin personalizzato per generare i sitemap durante il build
const generateSitemapsPlugin = () => ({
  name: 'generate-sitemaps',
  buildStart: async () => {
    console.log('Inizio della generazione dei sitemap...');
    try {
      execSync('node scripts/generateSitemaps.js', { 
        stdio: 'inherit',
        env: {
          ...process.env,
          SUPABASE_URL: 'https://igulwzwituvozwneguky.supabase.co',
          SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlndWx3endpdHV2b3p3bmVndWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMzEwMzQsImV4cCI6MjA1MTkwNzAzNH0.dgmg0NtpfbcZm4SoS2rbEiWKC4PpgqkNghTdsqZCavA'
        }
      });
      console.log('Generazione dei sitemap completata con successo!');
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
    outDir: 'dist',
    assetsDir: 'assets',
  }
}));