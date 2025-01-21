import { generateAllSitemaps } from "../src/utils/generateSitemaps.js";
import { readdir } from 'fs/promises';
import { join } from 'path';

console.log("Iniziando la generazione dei sitemap...");
console.log("Directory corrente:", process.cwd());

generateAllSitemaps()
  .then(async () => {
    console.log("Generazione dei sitemap completata con successo!");
    console.log("Verifica i file generati nella cartella public/:");
    console.log("- sitemap.xml (indice principale)");
    console.log("- sitemap-static.xml");
    console.log("- sitemap-patologias-[1-5].xml");
    console.log("- sitemap-reviews.xml");
    
    const publicDir = join(process.cwd(), 'public');
    console.log("\nFile presenti nella cartella public/:");
    
    try {
      const files = await readdir(publicDir);
      files
        .filter(file => file.includes('sitemap'))
        .forEach(file => {
          console.log(`- ${file}`);
        });
    } catch (error) {
      console.error("Errore nella lettura della directory:", error);
    }
  })
  .catch((error) => {
    console.error("Errore durante la generazione dei sitemap:", error);
    process.exit(1);
  });