import { writeFile } from 'fs/promises';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://mesientomal.info';
const SITEMAP_PATH = 'public';

// Create a new Supabase client specifically for the script
const supabase = createClient(
  "https://igulwzwituvozwneguky.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlndWx3endpdHV2b3p3bmVndWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMzEwMzQsImV4cCI6MjA1MTkwNzAzNH0.dgmg0NtpfbcZm4SoS2rbEiWKC4PpgqkNghTdsqZCavA"
);

async function writeXMLFile(filename, content) {
  const filePath = join(process.cwd(), SITEMAP_PATH, filename);
  await writeFile(filePath, content, 'utf8');
  console.log(`${filename} generato con successo`);
}

function generateSitemapXML(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('\n  ')}
</urlset>`;
}

function generateSitemapIndexXML(sitemaps) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.join('\n  ')}
</sitemapindex>`;
}

async function generateAllSitemaps() {
  console.log("Inizio della generazione dei sitemap...");

  // Fetch data from Supabase
  const { data: pathologies, error: pathologiesError, count: pathologiesCount } = await supabase
    .from('PATOLOGIE')
    .select('Patologia', { count: 'exact' });

  if (pathologiesError) throw pathologiesError;
  console.log("Totale patologie per il sitemap:", pathologiesCount);

  const { data: reviews, error: reviewsError, count: reviewsCount } = await supabase
    .from('reviews')
    .select('title, patologia_id, PATOLOGIE(Patologia)', { count: 'exact' });

  if (reviewsError) throw reviewsError;
  console.log("Totale recensioni per il sitemap:", reviewsCount);

  // Generate static sitemap
  console.log("Generazione del sitemap statico...");
  const staticUrls = [
    `<url><loc>${SITE_URL}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${SITE_URL}/patologias</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${SITE_URL}/ultimas-resenas</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${SITE_URL}/cuenta-tu-experiencia</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`,
  ];
  await writeXMLFile('sitemap-static.xml', generateSitemapXML(staticUrls));

  // Generate pathology sitemaps
  const ITEMS_PER_SITEMAP = 150;
  const totalPathologySitemaps = Math.ceil(pathologiesCount / ITEMS_PER_SITEMAP);

  for (let i = 0; i < totalPathologySitemaps; i++) {
    console.log(`Generazione del sitemap delle patologie ${i + 1}...`);
    const start = i * ITEMS_PER_SITEMAP;
    const end = start + ITEMS_PER_SITEMAP;
    const currentPathologies = pathologies.slice(start, end);

    const pathologyUrls = currentPathologies.map(p => 
      `<url><loc>${SITE_URL}/patologia/${encodeURIComponent(p.Patologia)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
    );

    await writeXMLFile(`sitemap-patologias-${i + 1}.xml`, generateSitemapXML(pathologyUrls));
  }

  // Generate reviews sitemap
  console.log("Generazione del sitemap delle recensioni...");
  const reviewUrls = reviews.map(review => {
    const pathologyName = review.PATOLOGIE?.Patologia;
    if (!pathologyName) return null;
    return `<url><loc>${SITE_URL}/${encodeURIComponent(pathologyName)}/esperienza/${encodeURIComponent(review.title)}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`;
  }).filter(Boolean);

  await writeXMLFile('sitemap-reviews.xml', generateSitemapXML(reviewUrls));

  // Generate sitemap index
  console.log("Generazione del sitemap index...");
  const sitemaps = [
    `<sitemap><loc>${SITE_URL}/sitemap-static.xml</loc></sitemap>`,
    ...Array.from({ length: totalPathologySitemaps }, (_, i) => 
      `<sitemap><loc>${SITE_URL}/sitemap-patologias-${i + 1}.xml</loc></sitemap>`
    ),
    `<sitemap><loc>${SITE_URL}/sitemap-reviews.xml</loc></sitemap>`,
  ];

  await writeXMLFile('sitemap.xml', generateSitemapIndexXML(sitemaps));

  console.log("\nRiepilogo della generazione dei sitemap:");
  console.log(`Totale patologie: ${pathologiesCount}`);
  console.log(`Totale recensioni: ${reviewsCount}`);
  console.log(`Totale file sitemap: ${sitemaps.length}`);
}

// Execute the sitemap generation
generateAllSitemaps()
  .then(() => {
    console.log("Generazione dei sitemap completata con successo!");
    console.log("Verifica i file generati nella cartella public/:");
    console.log("- sitemap.xml (indice principale)");
    console.log("- sitemap-static.xml");
    console.log("- sitemap-patologias-[1-5].xml");
    console.log("- sitemap-reviews.xml");
  })
  .catch((error) => {
    console.error("Errore durante la generazione dei sitemap:", error);
    process.exit(1);
  });