import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch all pathologies
    const { data: pathologies, error: pathologiesError } = await supabase
      .from('PATOLOGIE')
      .select('Patologia')
    
    if (pathologiesError) throw pathologiesError

    // Fetch all reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('title, PATOLOGIE(Patologia)')
    
    if (reviewsError) throw reviewsError

    // Base URL of the site
    const baseUrl = 'https://mesientomal.info'

    // Start building the XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    // Add static routes
    const staticRoutes = [
      '',
      '/patologias',
      '/ultimas-resenas',
      '/cuenta-tu-experiencia',
      '/iniciar-sesion',
      '/registro'
    ]

    for (const route of staticRoutes) {
      xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n  </url>\n`
    }

    // Add pathology routes
    for (const pathology of pathologies) {
      if (pathology.Patologia) {
        const formattedUrl = pathology.Patologia.replace(/\s+/g, '-').toUpperCase()
        xml += `  <url>\n    <loc>${baseUrl}/patologia/${encodeURIComponent(formattedUrl)}</loc>\n  </url>\n`
      }
    }

    // Add review routes
    for (const review of reviews) {
      if (review.title && review.PATOLOGIE?.Patologia) {
        const formattedPathology = review.PATOLOGIE.Patologia.toLowerCase()
        xml += `  <url>\n    <loc>${baseUrl}/${encodeURIComponent(formattedPathology)}/esperienza/${encodeURIComponent(review.title)}</loc>\n  </url>\n`
      }
    }

    xml += '</urlset>'

    // Return the XML with appropriate headers
    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    })

  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new Response(JSON.stringify({ error: 'Failed to generate sitemap' }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
})