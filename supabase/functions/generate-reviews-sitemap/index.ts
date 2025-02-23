
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
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
    const supabase = createClient(
      'https://igulwzwituvozwneguky.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlndWx3endpdHV2b3p3bmVndWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMzEwMzQsImV4cCI6MjA1MTkwNzAzNH0.dgmg0NtpfbcZm4SoS2rbEiWKC4PpgqkNghTdsqZCavA'
    );

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('title, PATOLOGIE (Patologia)');

    if (error) throw error;

    const urls = reviews
      ?.filter(r => r.title && r.PATOLOGIE?.Patologia)
      .map(r => {
        const patologiaPath = r.PATOLOGIE?.Patologia.toLowerCase();
        const titlePath = encodeURIComponent(r.title);
        return `  <url>
    <loc>https://mesientomal.info/${encodeURIComponent(patologiaPath)}/esperienza/${titlePath}</loc>
    <priority>0.7</priority>
  </url>`;
      })
      .join('\n') || '';

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

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
