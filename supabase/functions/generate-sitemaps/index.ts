import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SITE_URL = "https://mesientomal.info";
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

console.log('Edge Function starting...');
console.log('SUPABASE_URL configured:', !!SUPABASE_URL);
console.log('SUPABASE_ANON_KEY configured:', !!SUPABASE_ANON_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function generateSitemapIndex(sitemaps: string[]): string {
  console.log('Generating sitemap index for:', sitemaps);
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.map(sitemap => `
  <sitemap>
    <loc>${SITE_URL}/${sitemap}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`).join('')}
</sitemapindex>`;
}

function generateUrlSet(urls: Array<{ loc: string; lastmod?: string; priority?: string }>): string {
  console.log('Generating URL set for:', urls.length, 'URLs');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(({ loc, lastmod, priority }) => `
  <url>
    <loc>${SITE_URL}${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    ${priority ? `<priority>${priority}</priority>` : ''}
  </url>`).join('')}
</urlset>`;
}

async function generateStaticSitemap(): Promise<string> {
  console.log('Generating static sitemap');
  const staticUrls = [
    { loc: '/', priority: '1.0' },
    { loc: '/patologias', priority: '0.8' },
    { loc: '/cuenta-tu-experiencia', priority: '0.8' },
    { loc: '/ultimas-resenas', priority: '0.8' },
    { loc: '/iniciar-sesion', priority: '0.5' },
    { loc: '/registro', priority: '0.5' }
  ];
  return generateUrlSet(staticUrls);
}

async function generatePathologySitemaps(): Promise<string[]> {
  console.log('Fetching pathologies from database...');
  const { data: pathologies, error } = await supabase
    .from('PATOLOGIE')
    .select('Patologia');

  if (error) {
    console.error('Error fetching pathologies:', error);
    return [];
  }

  console.log(`Found ${pathologies?.length || 0} pathologies`);
  if (!pathologies) return [];

  // Split pathologies into chunks of 1000 URLs each
  const chunkSize = 1000;
  const chunks = [];
  
  for (let i = 0; i < pathologies.length; i += chunkSize) {
    const chunk = pathologies.slice(i, i + chunkSize);
    const urls = chunk.map(p => ({
      loc: `/patologia/${encodeURIComponent(p.Patologia?.toUpperCase() || '')}`,
      priority: '0.7'
    }));
    chunks.push(generateUrlSet(urls));
  }

  return chunks;
}

async function generateReviewsSitemap(): Promise<string> {
  console.log('Fetching reviews from database...');
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      title,
      created_at,
      PATOLOGIE (
        Patologia
      )
    `);

  if (error) {
    console.error('Error fetching reviews:', error);
    return generateUrlSet([]);
  }

  console.log(`Found ${reviews?.length || 0} reviews`);
  const urls = reviews?.map(review => ({
    loc: `/patologia/${review.PATOLOGIE?.Patologia?.toLowerCase()}/experiencia/${encodeURIComponent(review.title)}`,
    lastmod: review.created_at?.split('T')[0],
    priority: '0.6'
  })) || [];

  return generateUrlSet(urls);
}

serve(async (req) => {
  try {
    console.log('Received request:', req.method, new URL(req.url).pathname);
    
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    console.log('Requested sitemap path:', path);

    let content = '';

    if (path === 'sitemap.xml') {
      const sitemaps = [
        'sitemap-static.xml',
        'sitemap-reviews.xml'
      ];

      const pathologySitemaps = await generatePathologySitemaps();
      for (let i = 0; i < pathologySitemaps.length; i++) {
        sitemaps.push(`sitemap-patologias-${i + 1}.xml`);
      }

      content = generateSitemapIndex(sitemaps);
      console.log('Generated sitemap index with sitemaps:', sitemaps);
    } else if (path === 'sitemap-static.xml') {
      content = await generateStaticSitemap();
      console.log('Generated static sitemap');
    } else if (path === 'sitemap-reviews.xml') {
      content = await generateReviewsSitemap();
      console.log('Generated reviews sitemap');
    } else if (path?.startsWith('sitemap-patologias-')) {
      const index = parseInt(path.split('-')[2]) - 1;
      const pathologySitemaps = await generatePathologySitemaps();
      content = pathologySitemaps[index] || generateUrlSet([]);
      console.log(`Generated pathology sitemap ${index + 1}`);
    }

    if (!content) {
      console.error('No content generated for path:', path);
      return new Response('Not found', { status: 404, headers: corsHeaders });
    }

    return new Response(content, {
      headers: {
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(`Error generating sitemap: ${error.message}`, { 
      status: 500,
      headers: corsHeaders
    });
  }
});