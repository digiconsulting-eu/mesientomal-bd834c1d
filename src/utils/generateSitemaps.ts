import { supabase } from "@/integrations/supabase/client";

async function fetchPathologies() {
  const { data, error } = await supabase
    .from("PATOLOGIE")
    .select("Patologia")
    .order("Patologia");
    
  if (error) throw error;
  return data?.filter(p => p.Patologia != null) || [];
}

function generateSitemapContent(pathologies: { Patologia: string | null }[], startIndex: number, endIndex: number) {
  const urls = pathologies.slice(startIndex, endIndex)
    .map(p => {
      if (!p.Patologia) return '';
      const formattedUrl = p.Patologia.toLowerCase().replace(/\s+/g, '-');
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

function generateIndexSitemap(totalFiles: number) {
  const sitemaps = Array.from({ length: totalFiles }, (_, i) => `
  <sitemap>
    <loc>https://mesientomal.info/sitemap-patologias-${i + 1}.xml</loc>
    <lastmod>2024-03-21</lastmod>
  </sitemap>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemaps}
</sitemapindex>`;
}

export async function generateAllSitemaps() {
  try {
    const pathologies = await fetchPathologies();
    const URLS_PER_FILE = 150;
    const totalFiles = Math.ceil(pathologies.length / URLS_PER_FILE);

    // Generate individual sitemap files
    for (let i = 0; i < totalFiles; i++) {
      const startIndex = i * URLS_PER_FILE;
      const endIndex = startIndex + URLS_PER_FILE;
      const content = generateSitemapContent(pathologies, startIndex, endIndex);
      
      // In a real environment, you would write these files to the filesystem
      console.log(`Generated sitemap-patologias-${i + 1}.xml`);
      console.log(content);
    }

    // Generate index sitemap
    const indexContent = generateIndexSitemap(totalFiles);
    console.log('Generated sitemap index file');
    console.log(indexContent);

  } catch (error) {
    console.error('Error generating sitemaps:', error);
  }
}