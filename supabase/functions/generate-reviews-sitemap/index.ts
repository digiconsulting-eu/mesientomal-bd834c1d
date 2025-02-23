
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/xml'
};

serve(async (req) => {
  console.log('Request received:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    console.log('Initializing Supabase client...');
    const supabase = createClient(
      'https://igulwzwituvozwneguky.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlndWx3endpdHV2b3p3bmVndWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMzEwMzQsImV4cCI6MjA1MTkwNzAzNH0.dgmg0NtpfbcZm4SoS2rbEiWKC4PpgqkNghTdsqZCavA'
    );

    console.log('Fetching reviews...');
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        id,
        title,
        patologia_id,
        PATOLOGIE!inner (
          id,
          Patologia
        )
      `);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Reviews fetched:', reviews?.length || 0);
    console.log('Sample review:', reviews?.[0]);

    const urls = reviews
      ?.filter(r => {
        const isValid = r.title && r.PATOLOGIE?.Patologia;
        if (!isValid) {
          console.log('Filtered out review:', r);
        }
        return isValid;
      })
      .map(r => {
        const patologiaPath = r.PATOLOGIE?.Patologia.toLowerCase();
        const titlePath = encodeURIComponent(r.title);
        console.log(`Generating URL for: ${patologiaPath}/esperienza/${titlePath}`);
        return `  <url>
    <loc>https://mesientomal.info/${encodeURIComponent(patologiaPath)}/esperienza/${titlePath}</loc>
    <priority>0.7</priority>
  </url>`;
      })
      .join('\n') || '';

    console.log('URLs generated');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    console.log('Sitemap generated, length:', sitemap.length);

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
