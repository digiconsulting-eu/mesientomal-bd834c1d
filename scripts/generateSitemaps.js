import fs from 'fs'
import path from 'path'

const SITE_URL = 'https://mesientomal.info'
const ITEMS_PER_SITEMAP = 200

// Lista completa delle patologie
const pathologies = [
  "Absceso cerebral", "Absceso dental", "Absceso hepatico", "Absceso perianal",
  "Acidosis", "Adenitis", "Alergia", "Alzheimer", "Anemia", "Angina de pecho",
  "Artritis", "Asma", "Ateroesclerosis", "Autismo", "Bipolaridad", "Bronquitis",
  "Cáncer", "Cáncer de mama", "Cáncer de pulmón", "Cáncer de próstata", "Cáncer de piel",
  "Cáncer de riñón", "Cáncer de testículo", "Cáncer gástrico", "Cáncer hepático",
  "Cáncer intestinal", "Cáncer oral", "Cáncer uterino", "Cáncer vesical", "Cefalea",
  "Cistitis", "Colitis", "Conjuntivitis", "Diabetes", "Diarrea", "Dislexia",
  "Epilepsia", "Esclerosis múltiple", "Esquizofrenia", "Faringitis", "Fibromialgia",
  "Gastritis", "Gingivitis", "Gripe", "Hepatitis", "Hernia", "Hipertensión",
  "Hipotiroidismo", "Infección urinaria", "Insuficiencia renal", "Insuficiencia respiratoria",
  "Lupus", "Migraña", "Neumonía", "Obesidad", "Osteoporosis", "Psoriasis",
  "Rinitis", "Sinusitis", "Tensión arterial", "Trombosis", "Tuberculosis", "Virus del papiloma",
  "Zika"
];

// Normalize text for URLs
const normalizeText = (text) => {
  if (!text) {
    console.warn('Received empty or null text to normalize');
    return '';
  }
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Create static sitemap
const generateStaticSitemap = () => {
  try {
    console.log('Generating static sitemap...');
    const staticPages = [
      '',
      '/patologias',
      '/ultimas-resenas',
      '/cuenta-tu-experiencia',
      '/iniciar-sesion',
      '/registro',
      '/restablecer-contrasena'
    ];

    const staticSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${SITE_URL}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

    const filePath = path.join(process.cwd(), 'public/sitemap-static.xml');
    fs.writeFileSync(filePath, staticSitemap);
    console.log('Static sitemap generated successfully');
  } catch (error) {
    console.error('Error generating static sitemap:', error);
    throw error;
  }
}

// Generate sitemap for pathologies
const generatePathologySitemaps = () => {
  try {
    console.log('Starting pathology sitemap generation...');
    
    const totalSitemaps = Math.ceil(pathologies.length / ITEMS_PER_SITEMAP);
    console.log(`Creating ${totalSitemaps} sitemap files`);
    
    for (let i = 0; i < totalSitemaps; i++) {
      const start = i * ITEMS_PER_SITEMAP;
      const end = start + ITEMS_PER_SITEMAP;
      const chunk = pathologies.slice(start, end);
      const currentDate = new Date().toISOString().split('T')[0];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${chunk.map(pathology => `
  <url>
    <loc>${SITE_URL}/patologia/${normalizeText(pathology)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

      const fileName = `sitemap-patologias-${i + 1}.xml`;
      const filePath = path.join(process.cwd(), `public/${fileName}`);
      fs.writeFileSync(filePath, sitemap);
      
      console.log(`Generated ${fileName} with ${chunk.length} entries`);
    }

    return totalSitemaps;
  } catch (error) {
    console.error('Error in generatePathologySitemaps:', error);
    throw error;
  }
}

// Generate sitemap index
const generateSitemapIndex = (totalPathologySitemaps) => {
  try {
    console.log('Generating sitemap index...');
    
    const currentDate = new Date().toISOString().split('T')[0];
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
</sitemapindex>`;

    const filePath = path.join(process.cwd(), 'public/sitemap.xml');
    fs.writeFileSync(filePath, sitemapIndex);
    console.log('Sitemap index generated successfully');
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    throw error;
  }
}

// Main execution
const main = async () => {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      console.log('Creating public directory...');
      fs.mkdirSync(publicDir);
    }

    generateStaticSitemap();
    const totalPathologySitemaps = generatePathologySitemaps();
    generateSitemapIndex(totalPathologySitemaps);

    console.log('All sitemaps generated successfully');
  } catch (error) {
    console.error('Fatal error in main execution:', error);
    process.exit(1);
  }
}

main();
