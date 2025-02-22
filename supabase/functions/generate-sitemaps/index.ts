
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SITE_URL = "https://mesientomal.info";
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

console.log('Edge Function starting...');
console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('Service role key exists:', !!SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function generatePatologiasSitemap(): Promise<string> {
  console.log('Starting to generate pathologies sitemap...');
  
  try {
    console.log('Querying PATOLOGIE table...');
    const { data: pathologies, error, count } = await supabase
      .from('PATOLOGIE')
      .select('Patologia', { count: 'exact' });
    
    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log(`Found ${count} total pathologies`);
    console.log('Sample pathologies:', pathologies?.slice(0, 3));
    
    if (!pathologies || pathologies.length === 0) {
      console.warn('No pathologies found in database');
      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- No pathologies found in database -->
</urlset>`;
    }

    console.log('Starting to generate URLs...');
    const urls = pathologies
      .filter(p => p.Patologia) // Filter out null values
      .map(p => {
        const formattedPathology = p.Patologia.replace(/\s+/g, '-').toUpperCase();
        console.log(`Processing: ${p.Patologia} -> ${formattedPathology}`);
        return `  <url>
    <loc>${SITE_URL}/patologia/${encodeURIComponent(formattedPathology)}</loc>
    <priority>0.7</priority>
  </url>`;
      })
      .join('\n');

    console.log(`Generated ${pathologies.length} URLs`);
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    console.log('Sitemap generation completed successfully');
    return sitemap;

  } catch (error) {
    console.error('Error in generatePatologiasSitemap:', error);
    throw error;
  }
}

serve(async (req) => {
  const requestStart = new Date().toISOString();
  console.log(`[${requestStart}] Request received:`, req.method, new URL(req.url).pathname);
  
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    console.log('Requested sitemap:', path);

    if (path === 'sitemap-patologias.xml') {
      console.log('Starting sitemap generation process...');
      try {
        const content = await generatePatologiasSitemap();
        console.log('Sitemap generation completed, length:', content.length);
        return new Response(content, { headers: corsHeaders });
      } catch (error) {
        console.error('Error during sitemap generation:', error);
        throw error;
      }
    }

    console.log('Sitemap not found:', path);
    return new Response('Not found', { 
      status: 404, 
      headers: corsHeaders 
    });
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(`Error: ${error.message}`, { 
      status: 500, 
      headers: corsHeaders 
    });
  } finally {
    const requestEnd = new Date().toISOString();
    console.log(`[${requestEnd}] Request completed`);
  }
});
