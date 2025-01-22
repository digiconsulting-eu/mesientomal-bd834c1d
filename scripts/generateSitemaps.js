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
const ITEMS_PER_SITEMAP = 100; // Split sitemaps into chunks of 100 items

async function generateSitemaps() {
  try {
    console.log('Starting sitemap generation...');
    
    // Fetch all pathologies ordered alphabetically
    const { data: pathologies, error: pathologiesError } = await supabase
      .from('PATOLOGIE')
      .select('*')
      .order('Patologia');

    if (pathologiesError) {
      console.error('Error fetching pathologies:', pathologiesError);
      throw pathologiesError;
    }

    if (!pathologies || pathologies.length === 0) {
      console.error('No pathologies found in the database');
      throw new Error('No pathologies found');
    }

    console.log(`Found ${pathologies.length} pathologies`);

    // Split pathologies into chunks
    const chunks = [];
    for (let i = 0; i < pathologies.length; i += ITEMS_PER_SITEMAP) {
      chunks.push(pathologies.slice(i, i + ITEMS_PER_SITEMAP));
    }

    console.log(`Creating ${chunks.length} sitemap files`);

    // Generate individual sitemap files
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunk.map(p => {
  if (!p.Patologia) {
    console.warn('Found pathology with null or undefined name:', p);
    return '';
  }
  const url = `${PUBLIC_URL}/patologia/${encodeURIComponent(p.Patologia.toLowerCase().replace(/\s+/g, '-'))}`;
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
}).filter(Boolean).join('\n')}
</urlset>`;

      const filename = `sitemap-patologias-${i + 1}.xml`;
      await writeFile(join(OUTPUT_DIR, filename), sitemapContent);
      console.log(`Generated ${filename} with ${chunk.length} entries`);
    }

    // Generate sitemap index
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunks.map((_, index) => `  <sitemap>
    <loc>${PUBLIC_URL}/sitemap-patologias-${index + 1}.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    await writeFile(join(OUTPUT_DIR, 'sitemap.xml'), sitemapIndex);
    console.log('Generated sitemap index');

    console.log('\nSitemap Generation Summary:');
    console.log(`Total pathologies processed: ${pathologies.length}`);
    console.log(`Number of sitemap files: ${chunks.length}`);
    console.log('Generation completed successfully!');

  } catch (error) {
    console.error('Fatal error during sitemap generation:', error);
    process.exit(1);
  }
}

generateSitemaps().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});