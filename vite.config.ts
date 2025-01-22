import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";
import { execSync } from 'child_process';

const generateSitemapsPlugin = () => ({
  name: 'generate-sitemaps',
  buildStart: async () => {
    console.log('Starting sitemap generation...');
    try {
      execSync('node scripts/generateSitemaps.js', { 
        stdio: 'inherit',
        env: {
          ...process.env,
          SUPABASE_URL: 'https://igulwzwituvozwneguky.supabase.co',
          SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlndWx3endpdHV2b3p3bmVndWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMzEwMzQsImV4cCI6MjA1MTkwNzAzNH0.dgmg0NtpfbcZm4SoS2rbEiWKC4PpgqkNghTdsqZCavA'
        }
      });
      console.log('Sitemap generation completed successfully!');
    } catch (error) {
      console.error('Error during sitemap generation:', error);
      throw error; // This will cause the build to fail if sitemap generation fails
    }
  },
  writeBundle: {
    sequential: true,
    order: 'post',
    handler() {
      // Ensure the sitemap files are copied after the build
      console.log('Copying sitemap files to dist directory...');
      try {
        execSync('cp public/sitemap*.xml dist/', { stdio: 'inherit' });
        console.log('Sitemap files copied successfully!');
      } catch (error) {
        console.error('Error copying sitemap files:', error);
        throw error;
      }
    }
  }
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