
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SITE_URL = "https://mesientomal.info";
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

console.log('Edge Function starting...');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const staticRoutes = [
  { loc: '/', priority: '1.0' },
  { loc: '/patologias', priority: '0.8' },
  { loc: '/cuenta-tu-experiencia', priority: '0.8' },
  { loc: '/ultimas-resenas', priority: '0.8' },
  { loc: '/iniciar-sesion', priority: '0.5' },
  { loc: '/registro', priority: '0.5' }
];

function generateSitemapIndex(): string {
  const today = new Date().toISOString().split('T')[0];
  console.log('Generating sitemap index');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-static.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-patologias.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-reviews.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
}

function generateUrlSet(urls: Array<{ loc: string; lastmod?: string; priority?: string }>, isFullUrl = false): string {
  console.log(`Generating URL set with ${urls.length} URLs`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ loc, lastmod, priority }) => `  <url>
    <loc>${isFullUrl ? loc : SITE_URL + loc}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ''}${priority ? `
    <priority>${priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;
}

async function generateStaticSitemap(): Promise<string> {
  console.log('Generating static sitemap');
  return generateUrlSet(staticRoutes);
}

async function generatePatologiasSitemap(): Promise<string> {
  console.log('Fetching pathologies from database...');
  const { data: pathologies, error } = await supabase
    .from('PATOLOGIE')
    .select('Patologia');

  if (error) {
    console.error('Error fetching pathologies:', error);
    return generateUrlSet([]);
  }

  console.log(`Found ${pathologies?.length || 0} pathologies`);
  const urls = pathologies?.map(p => ({
    loc: `/patologia/${encodeURIComponent((p.Patologia || '').toUpperCase())}`,
    priority: '0.7'
  })) || [];

  return generateUrlSet(urls);
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
    loc: `/patologia/${encodeURIComponent((review.PATOLOGIE?.Patologia || '').toLowerCase())}/experiencia/${encodeURIComponent(review.title)}`,
    lastmod: review.created_at?.split('T')[0],
    priority: '0.6'
  })) || [];

  return generateUrlSet(urls);
}

serve(async (req) => {
  try {
    console.log('Request received:', req.method, new URL(req.url).pathname);
    
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    console.log('Requested sitemap:', path);

    let content = '';

    switch (path) {
      case 'sitemap.xml':
        content = generateSitemapIndex();
        break;
      case 'sitemap-static.xml':
        content = await generateStaticSitemap();
        break;
      case 'sitemap-patologias.xml':
        content = await generatePatologiasSitemap();
        break;
      case 'sitemap-reviews.xml':
        content = await generateReviewsSitemap();
        break;
      default:
        console.error('Unknown sitemap requested:', path);
        return new Response('Not found', { status: 404, headers: corsHeaders });
    }

    return new Response(content, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(`Error generating sitemap: ${error.message}`, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});
