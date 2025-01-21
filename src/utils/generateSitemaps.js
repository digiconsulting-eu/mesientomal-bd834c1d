import { supabase } from "../integrations/supabase/client.js";
import fs from 'fs';
import path from 'path';

async function fetchPathologies() {
  const { data, error } = await supabase
    .from("PATOLOGIE")
    .select("Patologia")
    .order('Patologia');
    
  if (error) {
    console.error("Errore nel recupero delle patologie:", error);
    throw error;
  }
  console.log("Totale patologie per il sitemap:", data?.length);
  return data?.filter(p => p.Patologia != null) || [];
}

async function fetchReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, title, patologia_id, PATOLOGIE(Patologia)")
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Errore nel recupero delle recensioni:", error);
    throw error;
  }
  console.log("Totale recensioni per il sitemap:", data?.length);
  return data || [];
}

function formatUrl(str) {
  return str.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function generateStaticSitemap() {
  console.log("Generazione del sitemap statico...");
  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mesientomal.info</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mesientomal.info/patologias</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mesientomal.info/cuenta-tu-experiencia</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap-static.xml'), content);
  console.log('Sitemap statico generato con successo');
}

function generatePathologySitemap(pathologies, fileIndex) {
  console.log(`Generazione del sitemap delle patologie ${fileIndex}...`);
  const urls = pathologies.map(p => {
    if (!p.Patologia) return '';
    const formattedUrl = formatUrl(p.Patologia);
    
    return `  <url>
    <loc>https://mesientomal.info/patologia/${formattedUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  fs.writeFileSync(
    path.join(process.cwd(), 'public', `sitemap-patologias-${fileIndex}.xml`),
    content
  );
  console.log(`Sitemap delle patologie ${fileIndex} generato con successo`);
}

function generateReviewsSitemap(reviews) {
  console.log("Generazione del sitemap delle recensioni...");
  const urls = reviews.map(review => {
    const pathologyName = review.PATOLOGIE?.Patologia;
    if (!pathologyName) return '';
    
    const formattedPathology = formatUrl(pathologyName);
    const formattedTitle = formatUrl(review.title);
    
    return `  <url>
    <loc>https://mesientomal.info/${formattedPathology}/esperienza/${formattedTitle}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.6</priority>
  </url>`;
  }).join('\n');

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap-reviews.xml'), content);
  console.log('Sitemap delle recensioni generato con successo');
}

function generateIndexSitemap(totalPathologyFiles) {
  console.log("Generazione del sitemap index...");
  let sitemaps = `  <sitemap>
    <loc>https://mesientomal.info/sitemap-static.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`;

  // Aggiungi i sitemap delle patologie
  for (let i = 1; i <= totalPathologyFiles; i++) {
    sitemaps += `\n  <sitemap>
    <loc>https://mesientomal.info/sitemap-patologias-${i}.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`;
  }

  // Aggiungi il sitemap delle recensioni
  sitemaps += `\n  <sitemap>
    <loc>https://mesientomal.info/sitemap-reviews.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`;

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), content);
  console.log('Sitemap index generato con successo');
}

export async function generateAllSitemaps() {
  try {
    console.log('Inizio della generazione dei sitemap...');
    
    // Recupera tutti i dati
    const pathologies = await fetchPathologies();
    const reviews = await fetchReviews();

    // Genera il sitemap statico
    generateStaticSitemap();

    // Genera i sitemap delle patologie (140 URL per file)
    const URLS_PER_FILE = 140;
    const totalPathologyFiles = Math.ceil(pathologies.length / URLS_PER_FILE);

    for (let i = 0; i < totalPathologyFiles; i++) {
      const startIndex = i * URLS_PER_FILE;
      const endIndex = startIndex + URLS_PER_FILE;
      const pathologiesForFile = pathologies.slice(startIndex, endIndex);
      generatePathologySitemap(pathologiesForFile, i + 1);
    }

    // Genera il sitemap delle recensioni
    generateReviewsSitemap(reviews);

    // Genera il sitemap index
    generateIndexSitemap(totalPathologyFiles);

    console.log(`\nRiepilogo della generazione dei sitemap:`);
    console.log(`Totale patologie: ${pathologies.length}`);
    console.log(`Totale recensioni: ${reviews.length}`);
    console.log(`Totale file sitemap: ${totalPathologyFiles + 2}`); // +2 per i sitemap statico e delle recensioni
  } catch (error) {
    console.error('Errore durante la generazione dei sitemap:', error);
    throw error;
  }
}