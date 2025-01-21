import { writeFile } from 'fs/promises';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const PUBLIC_URL = 'https://mesientomal.info';
const OUTPUT_DIR = './public';

async function generateSitemaps() {
  try {
    console.log('Inizio della generazione dei sitemap...');

    // Fetch data from Supabase with error handling
    const { data: pathologies, error: pathologiesError } = await supabase
      .from('PATOLOGIE')
      .select('Patologia');

    if (pathologiesError) {
      console.error('Error fetching pathologies:', pathologiesError);
      throw pathologiesError;
    }

    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*');

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      throw reviewsError;
    }

    console.log(`Fetched ${pathologies.length} pathologies and ${reviews.length} reviews`);

    // Generate static sitemap
    const staticSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${PUBLIC_URL}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${PUBLIC_URL}/patologias</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

    await writeFile(join(OUTPUT_DIR, 'sitemap-static.xml'), staticSitemap);
    console.log('Generated sitemap-static.xml');

    // Split pathologies into chunks of 100 for multiple sitemaps
    const CHUNK_SIZE = 100;
    const pathologyChunks = [];
    for (let i = 0; i < pathologies.length; i += CHUNK_SIZE) {
      pathologyChunks.push(pathologies.slice(i, i + CHUNK_SIZE));
    }

    // Generate pathology sitemaps
    for (let i = 0; i < pathologyChunks.length; i++) {
      const chunk = pathologyChunks[i];
      const pathologySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunk.map(p => `  <url>
    <loc>${PUBLIC_URL}/patologia/${encodeURIComponent(p.Patologia?.toLowerCase().replace(/\s+/g, '-'))}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

      await writeFile(join(OUTPUT_DIR, `sitemap-patologias-${i + 1}.xml`), pathologySitemap);
      console.log(`Generated sitemap-patologias-${i + 1}.xml`);
    }

    // Generate reviews sitemap
    const reviewsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${reviews.map(review => `  <url>
    <loc>${PUBLIC_URL}/review/${encodeURIComponent(review.id)}</loc>
    <lastmod>${new Date(review.created_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

    await writeFile(join(OUTPUT_DIR, 'sitemap-reviews.xml'), reviewsSitemap);
    console.log('Generated sitemap-reviews.xml');

    // Generate sitemap index
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${PUBLIC_URL}/sitemap-static.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
${pathologyChunks.map((_, i) => `  <sitemap>
    <loc>${PUBLIC_URL}/sitemap-patologias-${i + 1}.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`).join('\n')}
  <sitemap>
    <loc>${PUBLIC_URL}/sitemap-reviews.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;

    await writeFile(join(OUTPUT_DIR, 'sitemap.xml'), sitemapIndex);
    console.log('Generated sitemap.xml');

    // Print summary
    console.log('\nSitemap Generation Summary:');
    console.log(`Total pathologies: ${pathologies.length}`);
    console.log(`Total reviews: ${reviews.length}`);
    console.log(`Total sitemap files: ${pathologyChunks.length + 2}`);
    console.log('\nGenerated files in public/:');
    console.log('- sitemap.xml (main index)');
    console.log('- sitemap-static.xml');
    console.log(`- sitemap-patologias-[1-${pathologyChunks.length}].xml`);
    console.log('- sitemap-reviews.xml');

  } catch (error) {
    console.error('Error generating sitemaps:', error);
    throw error;
  }
}

generateSitemaps().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});