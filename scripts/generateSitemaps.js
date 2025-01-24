import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const SITE_URL = 'https://mesientomal.info'
const ITEMS_PER_SITEMAP = 100 // Reduced from 140 to 100 for better file sizes

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Create static sitemap
const generateStaticSitemap = () => {
  const staticPages = [
    '',
    '/patologias',
    '/ultimas-resenas',
    '/cuenta-tu-experiencia',
    '/iniciar-sesion',
    '/registro',
    '/reset-password',
    '/update-password'
  ]

  const staticSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${SITE_URL}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`

  fs.writeFileSync(path.join(process.cwd(), 'public/sitemap-static.xml'), staticSitemap)
  console.log('Generated static sitemap')
}

// Generate sitemap for pathologies
const generatePathologySitemaps = async () => {
  const { data: pathologies, error } = await supabase
    .from('PATOLOGIE')
    .select('Patologia')
    .order('Patologia')
    .not('Patologia', 'is', null)

  if (error) {
    console.error('Error fetching pathologies:', error)
    process.exit(1)
  }

  // Filter out any null or empty pathologies
  const validPathologies = pathologies.filter(p => p.Patologia && p.Patologia.trim() !== '')
  console.log(`Total valid pathologies: ${validPathologies.length}`)

  const totalSitemaps = Math.ceil(validPathologies.length / ITEMS_PER_SITEMAP)
  console.log(`Creating ${totalSitemaps} sitemap files`)
  
  for (let i = 0; i < totalSitemaps; i++) {
    const start = i * ITEMS_PER_SITEMAP
    const end = start + ITEMS_PER_SITEMAP
    const chunk = validPathologies.slice(start, end)
    const currentDate = new Date().toISOString().split('T')[0]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${chunk.map(p => `
  <url>
    <loc>${SITE_URL}/patologia/${encodeURIComponent(p.Patologia.toLowerCase())}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`

    const fileName = i === 0 ? 'sitemap-patologias.xml' : `sitemap-patologias-${i + 1}.xml`
    fs.writeFileSync(
      path.join(process.cwd(), `public/${fileName}`),
      sitemap
    )
    console.log(`Generated pathology sitemap ${fileName} with ${chunk.length} entries`)
  }

  return totalSitemaps
}

// Generate sitemap for reviews
const generateReviewsSitemap = async () => {
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      title,
      PATOLOGIE (
        Patologia
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    process.exit(1)
  }

  const currentDate = new Date().toISOString().split('T')[0]
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${reviews.map(review => `
  <url>
    <loc>${SITE_URL}/${encodeURIComponent(review.PATOLOGIE.Patologia.toLowerCase())}/esperienza/${encodeURIComponent(review.title)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`

  fs.writeFileSync(path.join(process.cwd(), 'public/sitemap-reviews.xml'), sitemap)
  console.log('Generated reviews sitemap')
}

// Generate sitemap index
const generateSitemapIndex = (totalPathologySitemaps) => {
  const currentDate = new Date().toISOString().split('T')[0]
  const sitemaps = [
    'sitemap-static.xml',
    ...Array.from({ length: totalPathologySitemaps }, (_, i) => 
      i === 0 ? 'sitemap-patologias.xml' : `sitemap-patologias-${i + 1}.xml`
    ),
    'sitemap-reviews.xml'
  ]

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.map(sitemap => `
  <sitemap>
    <loc>${SITE_URL}/${sitemap}</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`).join('')}
</sitemapindex>`

  fs.writeFileSync(path.join(process.cwd(), 'public/sitemap.xml'), sitemapIndex)
  console.log('Generated sitemap index')
}

// Main execution
const main = async () => {
  try {
    console.log('Starting sitemap generation...')
    
    // Create public directory if it doesn't exist
    const publicDir = path.join(process.cwd(), 'public')
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir)
    }

    // Generate all sitemaps
    generateStaticSitemap()
    const totalPathologySitemaps = await generatePathologySitemaps()
    await generateReviewsSitemap()
    generateSitemapIndex(totalPathologySitemaps)

    console.log('Sitemap generation completed successfully')
  } catch (error) {
    console.error('Error generating sitemaps:', error)
    process.exit(1)
  }
}

main()