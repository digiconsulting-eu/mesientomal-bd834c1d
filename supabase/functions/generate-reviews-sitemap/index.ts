
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/xml'
};

console.log('Edge Function starting...');

serve(async (req) => {
  console.log('Request received:', req.method, req.url);

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    console.log('Checking environment variables...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables');
    }

    console.log('Environment variables found, initializing Supabase client...');
    const supabase = createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    );

    console.log('Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('reviews')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('Test query failed:', testError);
      throw testError;
    }

    console.log('Test query successful, proceeding with main query...');
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
      console.error('Main query error:', error);
      throw error;
    }

    console.log('Reviews fetched:', reviews?.length || 0);
    if (reviews?.length > 0) {
      console.log('Sample review:', JSON.stringify(reviews[0], null, 2));
    } else {
      console.log('No reviews found');
    }

    const urls = reviews
      ?.filter(r => {
        const isValid = r.title && r.PATOLOGIE?.Patologia;
        console.log('Processing review:', {
          id: r.id,
          title: r.title,
          patologia: r.PATOLOGIE?.Patologia,
          isValid
        });
        return isValid;
      })
      .map(r => {
        const patologiaPath = r.PATOLOGIE?.Patologia.toLowerCase();
        const titlePath = encodeURIComponent(r.title);
        const url = `  <url>
    <loc>https://mesientomal.info/${encodeURIComponent(patologiaPath)}/esperienza/${titlePath}</loc>
    <priority>0.7</priority>
  </url>`;
        console.log('Generated URL entry:', url);
        return url;
      })
      .join('\n') || '';

    console.log('Generated URLs count:', urls.split('\n').length);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    console.log('Final sitemap length:', sitemap.length);

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Fatal error:', error);
    console.error('Error stack:', error.stack);
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
