
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SITE_URL = "https://mesientomal.info";
const SUPABASE_URL = "https://igulwzwituvozwneguky.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlndWx3endpdHV2b3p3bmVndWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMzEwMzQsImV4cCI6MjA1MTkwNzAzNH0.dgmg0NtpfbcZm4SoS2rbEiWKC4PpgqkNghTdsqZCavA";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function generateReviewsSitemap(): Promise<string> {
  console.log('Starting to generate reviews sitemap...');
  
  try {
    console.log('Querying reviews table...');
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        title,
        PATOLOGIE (
          Patologia
        )
      `);
    
    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Found reviews:', reviews?.length);
    
    if (!reviews || reviews.length === 0) {
      console.warn('No reviews found in database');
      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- No reviews found in database -->
</urlset>`;
    }

    console.log('Starting to generate URLs...');
    const urls = reviews
      .filter(r => r.title && r.PATOLOGIE?.Patologia) // Filter out null values
      .map(r => {
        const patologiaPath = r.PATOLOGIE?.Patologia.toLowerCase();
        const titlePath = encodeURIComponent(r.title);
        console.log(`Processing: ${patologiaPath}/${titlePath}`);
        return `  <url>
    <loc>${SITE_URL}/${encodeURIComponent(patologiaPath)}/esperienza/${titlePath}</loc>
    <priority>0.7</priority>
  </url>`;
      })
      .join('\n');

    console.log(`Generated ${reviews.length} URLs`);
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    console.log('Sitemap generation completed successfully');
    return sitemap;

  } catch (error) {
    console.error('Error in generateReviewsSitemap:', error);
    throw error;
  }
}

serve(async (req) => {
  console.log('Request received:', req.method, req.url);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting sitemap generation process...');
    const content = await generateReviewsSitemap();
    console.log('Sitemap generation completed, length:', content.length);
    
    // Return the response with CORS headers
    return new Response(content, {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
