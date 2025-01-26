import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const SITE_URL = 'https://mesientomal.info'
const ITEMS_PER_SITEMAP = 200

// Initialize Supabase client with explicit error handling and validation
const initSupabase = () => {
  console.log('Starting Supabase initialization...');
  
  if (!process.env.SUPABASE_URL) {
    throw new Error('SUPABASE_URL is not defined in environment variables');
  }
  if (!process.env.SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_ANON_KEY is not defined in environment variables');
  }
  
  console.log('Supabase URL:', process.env.SUPABASE_URL);
  console.log('Supabase Anon Key length:', process.env.SUPABASE_ANON_KEY.length);
  
  const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  
  // Test the connection
  return client;
}

// Normalize text for URLs
const normalizeText = (text) => {
  if (!text) {
    console.warn('Received empty or null text to normalize');
    return '';
  }
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Create static sitemap with improved error handling
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
      '/reset-password',
      '/update-password'
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

    const filePath = path.join(process.cwd(), 'public/sitemap-static.xml');
    fs.writeFileSync(filePath, staticSitemap);
    console.log('Static sitemap generated successfully at:', filePath);
    
    // Verify file was created
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log('Static sitemap file size:', stats.size, 'bytes');
    }
  } catch (error) {
    console.error('Error generating static sitemap:', error);
    throw error;
  }
}

// Generate sitemap for pathologies with improved error handling and validation
const generatePathologySitemaps = async () => {
  try {
    console.log('Starting pathology sitemap generation...');
    
    const { data: pathologies, error } = await supabase
      .from('PATOLOGIE')
      .select('Patologia')
      .order('Patologia');

    if (error) {
      console.error('Supabase error fetching pathologies:', error);
      throw error;
    }

    if (!pathologies || !Array.isArray(pathologies)) {
      console.error('Invalid pathologies data received:', pathologies);
      throw new Error('Invalid pathologies data received from Supabase');
    }

    console.log(`Retrieved ${pathologies.length} pathologies from database`);

    const validPathologies = pathologies
      .filter(p => p && p.Patologia && typeof p.Patologia === 'string' && p.Patologia.trim() !== '')
      .map(p => ({
        ...p,
        normalizedUrl: normalizeText(p.Patologia.trim())
      }));

    console.log(`Found ${validPathologies.length} valid pathologies after filtering`);
    console.log('Sample pathology:', validPathologies[0]);

    const totalSitemaps = Math.ceil(validPathologies.length / ITEMS_PER_SITEMAP);
    console.log(`Creating ${totalSitemaps} sitemap files`);
    
    for (let i = 0; i < totalSitemaps; i++) {
      const start = i * ITEMS_PER_SITEMAP;
      const end = start + ITEMS_PER_SITEMAP;
      const chunk = validPathologies.slice(start, end);
      const currentDate = new Date().toISOString().split('T')[0];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${chunk.map(p => `
  <url>
    <loc>${SITE_URL}/patologia/${p.normalizedUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

      const fileName = `sitemap-patologias-${i + 1}.xml`;
      const filePath = path.join(process.cwd(), `public/${fileName}`);
      fs.writeFileSync(filePath, sitemap);
      
      console.log(`Generated ${fileName} with ${chunk.length} entries`);
      
      // Verify file was created
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log(`${fileName} file size:`, stats.size, 'bytes');
      }
    }

    return totalSitemaps;
  } catch (error) {
    console.error('Error in generatePathologySitemaps:', error);
    throw error;
  }
}

// Generate sitemap for reviews with improved error handling
const generateReviewsSitemap = async () => {
  try {
    console.log('Starting reviews sitemap generation...');
    
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        title,
        PATOLOGIE (
          Patologia
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching reviews:', error);
      throw error;
    }

    if (!reviews || !Array.isArray(reviews)) {
      console.error('Invalid reviews data received:', reviews);
      throw new Error('Invalid reviews data received from Supabase');
    }

    console.log(`Retrieved ${reviews.length} reviews from database`);

    const currentDate = new Date().toISOString().split('T')[0];
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${reviews.map(review => {
    if (!review.PATOLOGIE || !review.PATOLOGIE.Patologia) {
      console.warn('Review with missing pathology data:', review);
      return '';
    }
    return `
  <url>
    <loc>${SITE_URL}/patologia/${normalizeText(review.PATOLOGIE.Patologia)}/esperienza/${encodeURIComponent(review.title)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
  }).join('')}
</urlset>`;

    const filePath = path.join(process.cwd(), 'public/sitemap-reviews.xml');
    fs.writeFileSync(filePath, sitemap);
    
    console.log('Reviews sitemap generated successfully');
    
    // Verify file was created
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log('Reviews sitemap file size:', stats.size, 'bytes');
    }
  } catch (error) {
    console.error('Error in generateReviewsSitemap:', error);
    throw error;
  }
}

// Generate sitemap index with improved error handling
const generateSitemapIndex = (totalPathologySitemaps) => {
  try {
    console.log('Generating sitemap index...');
    
    const currentDate = new Date().toISOString().split('T')[0];
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-static.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  ${Array.from({ length: totalPathologySitemaps }, (_, i) => `
  <sitemap>
    <loc>${SITE_URL}/sitemap-patologias-${i + 1}.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`).join('')}
  <sitemap>
    <loc>${SITE_URL}/sitemap-reviews.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

    const filePath = path.join(process.cwd(), 'public/sitemap.xml');
    fs.writeFileSync(filePath, sitemapIndex);
    
    console.log('Sitemap index generated successfully');
    
    // Verify file was created
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log('Sitemap index file size:', stats.size, 'bytes');
    }
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    throw error;
  }
}

// Main execution with improved error handling
const main = async () => {
  console.log('Starting sitemap generation process...');
  console.log('Current working directory:', process.cwd());
  console.log('Node version:', process.version);
  console.log('Environment variables present:', {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY
  });
  
  try {
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      console.log('Creating public directory...');
      fs.mkdirSync(publicDir);
    }

    // Initialize Supabase client
    const supabase = initSupabase();
    console.log('Supabase client initialized successfully');

    // Generate all sitemaps
    generateStaticSitemap();
    const totalPathologySitemaps = await generatePathologySitemaps();
    await generateReviewsSitemap();
    generateSitemapIndex(totalPathologySitemaps);

    console.log('All sitemaps generated successfully');
    
    // List generated files
    console.log('\nGenerated files in public directory:');
    const files = fs.readdirSync(publicDir);
    files.filter(f => f.includes('sitemap')).forEach(file => {
      const stats = fs.statSync(path.join(publicDir, file));
      console.log(`${file}: ${stats.size} bytes`);
    });
  } catch (error) {
    console.error('Fatal error in main execution:', error);
    process.exit(1);
  }
}

main();