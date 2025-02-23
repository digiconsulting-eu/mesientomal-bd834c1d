
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/xml'
};

serve(async (req) => {
  console.log('Starting function execution...');

  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request received');
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  console.log('Main request handling started');

  try {
    const supabaseUrl = 'https://igulwzwituvozwneguky.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlndWx3endpdHV2b3p3bmVndWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjMzMTAzNCwiZXhwIjoyMDUxOTA3MDM0fQ.uvdDS20jw_Y_EXiHE_24QeHHRcH7DIzGLJ2ZQ8ssJFM';

    console.log('Initializing Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Executing test query...');
    const { data: testData, error: testError } = await supabase
      .from('reviews')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('Test query failed:', testError);
      throw new Error(`Test query failed: ${testError.message}`);
    }

    console.log('Test query successful, found', testData?.length || 0, 'rows');

    console.log('Executing main query...');
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        id,
        title,
        PATOLOGIE!inner (
          Patologia
        )
      `);

    if (error) {
      console.error('Main query failed:', error);
      throw new Error(`Main query failed: ${error.message}`);
    }

    console.log('Main query successful, processing', reviews?.length || 0, 'reviews');

    const urls = (reviews || [])
      .filter(r => {
        const isValid = r.title && r.PATOLOGIE?.Patologia;
        console.log('Processing review:', r.id, 'valid:', isValid);
        return isValid;
      })
      .map(r => {
        const patologiaPath = r.PATOLOGIE?.Patologia.toLowerCase();
        const titlePath = encodeURIComponent(r.title);
        return `  <url>
    <loc>https://mesientomal.info/${encodeURIComponent(patologiaPath)}/esperienza/${titlePath}</loc>
    <priority>0.7</priority>
  </url>`;
      })
      .join('\n');

    console.log('Generated', (urls.match(/<url>/g) || []).length, 'URLs');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    console.log('Sitemap generation complete');

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Fatal error occurred:', error);
    console.error('Stack trace:', error.stack);
    
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
