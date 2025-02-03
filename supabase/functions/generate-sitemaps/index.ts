import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SITE_URL = "https://mesientomal.info";
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function generateSitemapIndex(sitemaps: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.map(sitemap => `
  <sitemap>
    <loc>${SITE_URL}/${sitemap}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`).join('')}
</sitemapindex>`;
}

function generateUrlSet(urls: Array<{ loc: string; lastmod?: string }>): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(({ loc, lastmod }) => `
  <url>
    <loc>${SITE_URL}${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
  </url>`).join('')}
</urlset>`;
}

async function generateStaticSitemap(): Promise<string> {
  const staticUrls = [
    { loc: '/' },
    { loc: '/patologias' },
    { loc: '/cuenta-tu-experiencia' },
    { loc: '/ultimas-resenas' },
    { loc: '/login' },
    { loc: '/register' },
  ];
  return generateUrlSet(staticUrls);
}

async function generatePathologySitemaps(): Promise<string[]> {
  const { data: pathologies } = await supabase
    .from('PATOLOGIE')
    .select('Patologia');

  if (!pathologies) return [];

  // Split pathologies into chunks of 1000 URLs each
  const chunkSize = 1000;
  const chunks = [];
  
  for (let i = 0; i < pathologies.length; i += chunkSize) {
    const chunk = pathologies.slice(i, i + chunkSize);
    const urls = chunk.map(p => ({
      loc: `/patologia/${encodeURIComponent(p.Patologia || '')}`,
    }));
    chunks.push(generateUrlSet(urls));
  }

  return chunks;
}

async function generateReviewsSitemap(): Promise<string> {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('title, created_at');

  if (!reviews) return generateUrlSet([]);

  const urls = reviews.map(review => ({
    loc: `/resena/${encodeURIComponent(review.title)}`,
    lastmod: review.created_at?.split('T')[0],
  }));

  return generateUrlSet(urls);
}

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    let content = '';
    let contentType = 'application/xml';

    if (path === 'sitemap.xml') {
      const sitemaps = [
        'sitemap-static.xml',
        'sitemap-reviews.xml',
      ];

      const pathologySitemaps = await generatePathologySitemaps();
      for (let i = 0; i < pathologySitemaps.length; i++) {
        sitemaps.push(`sitemap-patologias-${i + 1}.xml`);
      }

      content = generateSitemapIndex(sitemaps);
    } else if (path === 'sitemap-static.xml') {
      content = await generateStaticSitemap();
    } else if (path === 'sitemap-reviews.xml') {
      content = await generateReviewsSitemap();
    } else if (path?.startsWith('sitemap-patologias-')) {
      const index = parseInt(path.split('-')[2]) - 1;
      const pathologySitemaps = await generatePathologySitemaps();
      content = pathologySitemaps[index] || generateUrlSet([]);
    }

    return new Response(content, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
});