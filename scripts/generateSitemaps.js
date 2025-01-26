import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const SITE_URL = 'https://mesientomal.info'
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Generate static sitemap
const generateStaticSitemap = () => {
  try {
    console.log('Generating static sitemap...');
    const staticPages = [
      '',
      '/patologias',
      '/ultimas-resenas',
      '/cuenta-tu-experiencia',
      '/iniciar-sesion',
      '/registro',
      '/restablecer-contrasena'
    ];

    const staticSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${SITE_URL}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

    fs.writeFileSync(path.join(process.cwd(), 'public/sitemap-static.xml'), staticSitemap);
    console.log('Static sitemap generated successfully');
  } catch (error) {
    console.error('Error generating static sitemap:', error);
    throw error;
  }
}

// Generate sitemap for pathologies
const generatePathologySitemap = async () => {
  try {
    console.log('Generating pathology sitemap...');
    
    // Fetch all pathologies from Supabase
    const { data: pathologies, error } = await supabase
      .from('PATOLOGIE')
      .select('Patologia')
      .order('Patologia');

    if (error) throw error;

    console.log(`Found ${pathologies.length} pathologies`);

    const currentDate = new Date().toISOString().split('T')[0];
    
    const pathologySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pathologies.map(p => p.Patologia ? `
  <url>
    <loc>${SITE_URL}/patologia/${p.Patologia.toLowerCase().replace(/ /g, '-')}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>` : '').join('')}
</urlset>`;

    fs.writeFileSync(path.join(process.cwd(), 'public/sitemap-patologias.xml'), pathologySitemap);
    console.log('Pathology sitemap generated successfully');
  } catch (error) {
    console.error('Error generating pathology sitemap:', error);
    throw error;
  }
}

// Generate sitemap index
const generateSitemapIndex = () => {
  try {
    console.log('Generating sitemap index...');
    const currentDate = new Date().toISOString().split('T')[0];
    
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-static.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-patologias.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

    fs.writeFileSync(path.join(process.cwd(), 'public/sitemap.xml'), sitemapIndex);
    console.log('Sitemap index generated successfully');
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    throw error;
  }
}

// Main execution
const main = async () => {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      console.log('Creating public directory...');
      fs.mkdirSync(publicDir);
    }

    await generateStaticSitemap();
    await generatePathologySitemap();
    await generateSitemapIndex();

    // Remove old sitemap files
    const oldSitemaps = [
      'sitemap-patologias-1.xml',
      'sitemap-patologias-2.xml',
      'sitemap-patologias-3.xml',
      'sitemap-patologias-4.xml',
      'sitemap-patologias-5.xml'
    ];

    oldSitemaps.forEach(file => {
      const filePath = path.join(process.cwd(), 'public', file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Removed old sitemap: ${file}`);
      }
    });

    console.log('All sitemaps generated successfully');
  } catch (error) {
    console.error('Fatal error in main execution:', error);
    process.exit(1);
  }
}

main();