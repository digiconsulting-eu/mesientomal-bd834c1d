import { supabase } from "@/integrations/supabase/client";
import fs from 'fs';
import path from 'path';

async function fetchPathologies() {
  const { data, error } = await supabase
    .from("PATOLOGIE")
    .select("Patologia")
    .order('Patologia');
    
  if (error) {
    console.error("Error fetching pathologies:", error);
    throw error;
  }
  console.log("Total pathologies for sitemap:", data?.length);
  return data?.filter(p => p.Patologia != null) || [];
}

async function fetchReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, title, patologia_id, PATOLOGIE(Patologia)")
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
  console.log("Total reviews for sitemap:", data?.length);
  return data || [];
}

function formatUrl(str: string) {
  return str.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function generateStaticSitemap() {
  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mesientomal.info</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mesientomal.info/patologias</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mesientomal.info/cuenta-tu-experiencia</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap-static.xml'), content);
  console.log('Generated static sitemap');
}

function generatePathologySitemap(pathologies: { Patologia: string | null }[], fileIndex: number) {
  const urls = pathologies.map(p => {
    if (!p.Patologia) return '';
    const formattedUrl = formatUrl(p.Patologia);
    
    return `  <url>
    <loc>https://mesientomal.info/patologia/${formattedUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  fs.writeFileSync(
    path.join(process.cwd(), 'public', `sitemap-patologias-${fileIndex}.xml`),
    content
  );
  console.log(`Generated pathology sitemap ${fileIndex}`);
}

function generateReviewsSitemap(reviews: any[]) {
  const urls = reviews.map(review => {
    const pathologyName = review.PATOLOGIE?.Patologia;
    if (!pathologyName) return '';
    
    const formattedPathology = formatUrl(pathologyName);
    const formattedTitle = formatUrl(review.title);
    
    return `  <url>
    <loc>https://mesientomal.info/${formattedPathology}/esperienza/${formattedTitle}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.6</priority>
  </url>`;
  }).join('\n');

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap-reviews.xml'), content);
  console.log('Generated reviews sitemap');
}

function generateIndexSitemap(totalPathologyFiles: number) {
  let sitemaps = `  <sitemap>
    <loc>https://mesientomal.info/sitemap-static.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`;

  // Add pathology sitemaps
  for (let i = 1; i <= totalPathologyFiles; i++) {
    sitemaps += `\n  <sitemap>
    <loc>https://mesientomal.info/sitemap-patologias-${i}.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`;
  }

  // Add reviews sitemap
  sitemaps += `\n  <sitemap>
    <loc>https://mesientomal.info/sitemap-reviews.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`;

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), content);
  console.log('Generated sitemap index');
}

export async function generateAllSitemaps() {
  try {
    console.log('Starting sitemap generation...');
    
    // Fetch all data
    const pathologies = await fetchPathologies();
    const reviews = await fetchReviews();

    // Generate static sitemap
    generateStaticSitemap();

    // Generate pathology sitemaps (140 URLs per file)
    const URLS_PER_FILE = 140;
    const totalPathologyFiles = Math.ceil(pathologies.length / URLS_PER_FILE);

    for (let i = 0; i < totalPathologyFiles; i++) {
      const startIndex = i * URLS_PER_FILE;
      const endIndex = startIndex + URLS_PER_FILE;
      const pathologiesForFile = pathologies.slice(startIndex, endIndex);
      generatePathologySitemap(pathologiesForFile, i + 1);
    }

    // Generate reviews sitemap
    generateReviewsSitemap(reviews);

    // Generate index sitemap
    generateIndexSitemap(totalPathologyFiles);

    console.log(`\nSitemap Generation Summary:`);
    console.log(`Total pathologies: ${pathologies.length}`);
    console.log(`Total reviews: ${reviews.length}`);
    console.log(`Total sitemap files: ${totalPathologyFiles + 2}`); // +2 for static and reviews sitemaps
  } catch (error) {
    console.error('Error generating sitemaps:', error);
    throw error;
  }
}