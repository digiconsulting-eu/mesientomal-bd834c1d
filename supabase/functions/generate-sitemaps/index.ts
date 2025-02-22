
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SITE_URL = "https://mesientomal.info";
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function generatePatologiasSitemap(): Promise<string> {
  console.log('Fetching all pathologies from database...');
  
  // Fetch ALL pathologies without limits
  const { data: pathologies, error } = await supabase
    .from('PATOLOGIE')
    .select('Patologia')
    .order('Patologia');

  if (error) {
    console.error('Error fetching pathologies:', error);
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
  }

  console.log(`Found ${pathologies?.length || 0} pathologies`);
  
  const urls = pathologies?.map(p => {
    if (!p.Patologia) return null;
    const formattedPathology = p.Patologia.replace(/\s+/g, '-').toUpperCase();
    return `  <url>
    <loc>${SITE_URL}/patologia/${encodeURIComponent(formattedPathology)}</loc>
    <priority>0.7</priority>
  </url>`;
  }).filter(Boolean).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    if (path === 'sitemap-patologias.xml') {
      console.log('Generating pathologies sitemap...');
      const content = await generatePatologiasSitemap();
      return new Response(content, { headers: corsHeaders });
    }

    return new Response('Not found', { 
      status: 404, 
      headers: corsHeaders 
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(`Error: ${error.message}`, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});
