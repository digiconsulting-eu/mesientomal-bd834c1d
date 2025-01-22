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
    console.log('Starting sitemap generation...');
    console.log('Using Supabase URL:', supabaseUrl);
    console.log('Output directory:', OUTPUT_DIR);

    // Fetch all pathologies ordered alphabetically
    console.log('Fetching pathologies from Supabase...');
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

    console.log(`Successfully fetched ${pathologies.length} pathologies`);

    // Generate pathologies sitemap (all pathologies)
    console.log('Generating sitemap content...');
    const pathologySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pathologies.map(p => `  <url>
    <loc>${PUBLIC_URL}/patologia/${encodeURIComponent(p.Patologia?.toLowerCase().replace(/\s+/g, '-'))}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

    console.log('Writing sitemap file...');
    const sitemapPath = join(OUTPUT_DIR, 'sitemap-patologias-1.xml');
    await writeFile(sitemapPath, pathologySitemap);
    console.log(`Successfully wrote sitemap to ${sitemapPath} with ${pathologies.length} pathologies`);

    // Generate sitemap index
    console.log('Generating sitemap index...');
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${PUBLIC_URL}/sitemap-patologias-1.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;

    const indexPath = join(OUTPUT_DIR, 'sitemap.xml');
    await writeFile(indexPath, sitemapIndex);
    console.log(`Successfully wrote sitemap index to ${indexPath}`);

    console.log('\nSitemap Generation Summary:');
    console.log(`Total pathologies processed: ${pathologies.length}`);
    console.log('Output files:');
    console.log(`- ${sitemapPath}`);
    console.log(`- ${indexPath}`);
    console.log('\nAll sitemaps have been generated successfully!');

  } catch (error) {
    console.error('Fatal error during sitemap generation:', error);
    process.exit(1); // Exit with error code to ensure the build fails if sitemap generation fails
  }
}

generateSitemaps().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});