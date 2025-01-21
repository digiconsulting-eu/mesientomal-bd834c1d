import { supabase } from "@/integrations/supabase/client";

async function fetchPathologies() {
  const { data, error } = await supabase
    .from("PATOLOGIE")
    .select("Patologia")
    .order("Patologia");
    
  if (error) throw error;
  console.log("Total pathologies for sitemap:", data?.length);
  return data?.filter(p => p.Patologia != null) || [];
}

async function fetchReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, title")
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  console.log("Total reviews for sitemap:", data?.length);
  return data || [];
}

function generateStaticSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mesientomal.info/</loc>
    <lastmod>2024-03-21</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mesientomal.info/patologias</loc>
    <lastmod>2024-03-21</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://mesientomal.info/cuenta-tu-experiencia</loc>
    <lastmod>2024-03-21</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mesientomal.info/login</loc>
    <lastmod>2024-03-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://mesientomal.info/register</loc>
    <lastmod>2024-03-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;
}

function generatePathologySitemap(pathologies: { Patologia: string | null }[], startIndex: number, endIndex: number) {
  const urls = pathologies.slice(startIndex, endIndex)
    .map(p => {
      if (!p.Patologia) return '';
      const formattedUrl = p.Patologia.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      
      return `
  <url>
    <loc>https://mesientomal.info/patologia/${formattedUrl}</loc>
    <lastmod>2024-03-21</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
}

function generateReviewsSitemap(reviews: { id: number, title: string }[]) {
  const urls = reviews.map(review => `
  <url>
    <loc>https://mesientomal.info/experiencia/${review.id}</loc>
    <lastmod>2024-03-21</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
}

function generateIndexSitemap(totalPathologyFiles: number) {
  let sitemaps = `
  <sitemap>
    <loc>https://mesientomal.info/sitemap-static.xml</loc>
    <lastmod>2024-03-21</lastmod>
  </sitemap>`;

  // Add pathology sitemaps
  for (let i = 1; i <= totalPathologyFiles; i++) {
    sitemaps += `
  <sitemap>
    <loc>https://mesientomal.info/sitemap-patologias-${i}.xml</loc>
    <lastmod>2024-03-21</lastmod>
  </sitemap>`;
  }

  // Add reviews sitemap
  sitemaps += `
  <sitemap>
    <loc>https://mesientomal.info/sitemap-reviews.xml</loc>
    <lastmod>2024-03-21</lastmod>
  </sitemap>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemaps}
</sitemapindex>`;
}

export async function generateAllSitemaps() {
  try {
    // Fetch all data
    const pathologies = await fetchPathologies();
    const reviews = await fetchReviews();

    // Generate static sitemap
    const staticSitemap = generateStaticSitemap();
    console.log('Generated static sitemap');
    console.log(staticSitemap);

    // Generate pathology sitemaps
    const URLS_PER_FILE = 140;
    const totalPathologyFiles = Math.ceil(pathologies.length / URLS_PER_FILE);

    // Generate individual pathology sitemap files
    for (let i = 0; i < totalPathologyFiles; i++) {
      const startIndex = i * URLS_PER_FILE;
      const endIndex = startIndex + URLS_PER_FILE;
      const content = generatePathologySitemap(pathologies, startIndex, endIndex);
      
      console.log(`Generated sitemap-patologias-${i + 1}.xml with URLs from ${startIndex + 1} to ${Math.min(endIndex, pathologies.length)}`);
      console.log(content);
    }

    // Generate reviews sitemap
    const reviewsSitemap = generateReviewsSitemap(reviews);
    console.log('Generated reviews sitemap');
    console.log(reviewsSitemap);

    // Generate index sitemap
    const indexSitemap = generateIndexSitemap(totalPathologyFiles);
    console.log('Generated sitemap index file');
    console.log(indexSitemap);

    // Log summary
    console.log(`Total number of pathologies: ${pathologies.length}`);
    console.log(`Total number of reviews: ${reviews.length}`);
    console.log(`Total number of sitemap files: ${totalPathologyFiles + 2}`); // +2 for static and reviews sitemaps
  } catch (error) {
    console.error('Error generating sitemaps:', error);
    throw error;
  }
}