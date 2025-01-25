import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const SITE_URL = 'https://mesientomal.info'
const ITEMS_PER_SITEMAP = 200

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

console.log('Supabase URL:', process.env.SUPABASE_URL)
console.log('Supabase Anon Key length:', process.env.SUPABASE_ANON_KEY?.length)

// Normalize text for URLs
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, '')         // Remove leading/trailing hyphens
}

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

  console.log('Generating static sitemap with pages:', staticPages)

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
  console.log('Generated static sitemap successfully')
}

// Generate sitemap for pathologies
const generatePathologySitemaps = async () => {
  try {
    console.log('Starting pathology sitemap generation...')
    
    const { data: pathologies, error, count } = await supabase
      .from('PATOLOGIE')
      .select('Patologia', { count: 'exact' })
      .order('Patologia')
      .not('Patologia', 'is', null)

    if (error) {
      console.error('Error fetching pathologies:', error)
      throw error
    }

    console.log('Total pathologies count from DB:', count)
    console.log('Actual pathologies data length:', pathologies?.length)
    console.log('First 5 pathologies:', pathologies?.slice(0, 5))

    // Filter out any null or empty pathologies and normalize URLs
    const validPathologies = pathologies
      .filter(p => p.Patologia && p.Patologia.trim() !== '')
      .map(p => ({
        ...p,
        normalizedUrl: normalizeText(p.Patologia.trim())
      }))

    console.log(`Total valid pathologies after filtering: ${validPathologies.length}`)
    console.log('First 5 normalized pathologies:', validPathologies.slice(0, 5))

    const totalSitemaps = Math.ceil(validPathologies.length / ITEMS_PER_SITEMAP)
    console.log(`Creating ${totalSitemaps} sitemap files`)
    
    for (let i = 0; i < totalSitemaps; i++) {
      const start = i * ITEMS_PER_SITEMAP
      const end = start + ITEMS_PER_SITEMAP
      const chunk = validPathologies.slice(start, end)
      const currentDate = new Date().toISOString().split('T')[0]

      console.log(`Generating sitemap ${i + 1} with ${chunk.length} entries`)

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${chunk.map(p => `
  <url>
    <loc>${SITE_URL}/patologia/${p.normalizedUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`

      const fileName = `sitemap-patologias-${i + 1}.xml`
      const filePath = path.join(process.cwd(), `public/${fileName}`)
      fs.writeFileSync(filePath, sitemap)
      
      console.log(`Generated ${fileName} with ${chunk.length} entries`)
      console.log(`File size: ${fs.statSync(filePath).size} bytes`)
    }

    return totalSitemaps
  } catch (error) {
    console.error('Error generating pathology sitemaps:', error)
    throw error
  }
}

// Generate sitemap for reviews
const generateReviewsSitemap = async () => {
  try {
    console.log('Starting reviews sitemap generation...')
    
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
      throw error
    }

    console.log(`Total reviews found: ${reviews?.length}`)
    console.log('First 5 reviews:', reviews?.slice(0, 5))

    const currentDate = new Date().toISOString().split('T')[0]
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${reviews.map(review => `
  <url>
    <loc>${SITE_URL}/patologia/${normalizeText(review.PATOLOGIE.Patologia)}/esperienza/${encodeURIComponent(review.title)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`

    const filePath = path.join(process.cwd(), 'public/sitemap-reviews.xml')
    fs.writeFileSync(filePath, sitemap)
    
    console.log('Generated reviews sitemap')
    console.log(`Reviews sitemap file size: ${fs.statSync(filePath).size} bytes`)
  } catch (error) {
    console.error('Error generating reviews sitemap:', error)
    throw error
  }
}

// Generate sitemap index
const generateSitemapIndex = (totalPathologySitemaps) => {
  console.log('Generating sitemap index...')
  
  const currentDate = new Date().toISOString().split('T')[0]
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-static.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  ${Array.from({ length: totalPathologySitemaps }, (_, i) => `
  <sitemap>
    <loc>${SITE_URL}/sitemap-patologias-${i + 1}.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`).join('')}
  <sitemap>
    <loc>${SITE_URL}/sitemap-reviews.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`

  const filePath = path.join(process.cwd(), 'public/sitemap.xml')
  fs.writeFileSync(filePath, sitemapIndex)
  
  console.log('Generated sitemap index')
  console.log(`Sitemap index file size: ${fs.statSync(filePath).size} bytes`)
}

// Main execution
const main = async () => {
  try {
    console.log('Starting sitemap generation process...')
    console.log('Current working directory:', process.cwd())
    
    // Create public directory if it doesn't exist
    const publicDir = path.join(process.cwd(), 'public')
    if (!fs.existsSync(publicDir)) {
      console.log('Creating public directory...')
      fs.mkdirSync(publicDir)
    }

    // Generate all sitemaps
    console.log('Generating static sitemap...')
    generateStaticSitemap()
    
    console.log('Generating pathology sitemaps...')
    const totalPathologySitemaps = await generatePathologySitemaps()
    
    console.log('Generating reviews sitemap...')
    await generateReviewsSitemap()
    
    console.log('Generating sitemap index...')
    generateSitemapIndex(totalPathologySitemaps)

    console.log('Sitemap generation completed successfully')
    
    // List all generated files
    console.log('\nGenerated files in public directory:')
    const files = fs.readdirSync(publicDir)
    files.filter(f => f.includes('sitemap')).forEach(file => {
      const stats = fs.statSync(path.join(publicDir, file))
      console.log(`${file}: ${stats.size} bytes`)
    })
  } catch (error) {
    console.error('Error in main execution:', error)
    process.exit(1)
  }
}

main()