
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SITE_URL = "https://mesientomal.info";
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}

// Utilizziamo la service role key per assicurarci di avere accesso completo ai dati
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function generatePatologiasSitemap(): Promise<string> {
  console.log('Fetching all pathologies from database...');
  
  try {
    // Fetch ALL pathologies without limits using service role
    const { data: pathologies, error, count } = await supabase
      .from('PATOLOGIE')
      .select('Patologia', { count: 'exact' });
    
    if (error) {
      console.error('Error fetching pathologies:', error);
      throw error;
    }

    console.log('Total number of pathologies:', count);
    console.log('First few pathologies:', pathologies?.slice(0, 5));
    
    if (!pathologies || pathologies.length === 0) {
      console.warn('No pathologies found in database');
      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- No pathologies found in database -->
</urlset>`;
    }

    const urls = pathologies
      .filter(p => p.Patologia) // Filter out null values
      .map(p => {
        const formattedPathology = p.Patologia.replace(/\s+/g, '-').toUpperCase();
        console.log('Processing pathology:', p.Patologia, '→', formattedPathology);
        return `  <url>
    <loc>${SITE_URL}/patologia/${encodeURIComponent(formattedPathology)}</loc>
    <priority>0.7</priority>
  </url>`;
      })
      .join('\n');

    console.log(`Generated ${pathologies.length} URLs for sitemap`);

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  } catch (error) {
    console.error('Error generating pathologies sitemap:', error);
    throw error;
  }
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

    if (path === 'sitemap-patologias.xml') {
      console.log('Generating pathologies sitemap...');
      try {
        const content = await generatePatologiasSitemap();
        console.log('Sitemap generated successfully');
        return new Response(content, { headers: corsHeaders });
      } catch (error) {
        console.error('Error generating sitemap:', error);
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
  }
});
