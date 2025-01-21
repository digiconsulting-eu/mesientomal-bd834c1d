import { generateAllSitemaps } from "../src/utils/generateSitemaps.js";

console.log("Iniziando la generazione dei sitemap...");
console.log("Directory corrente:", process.cwd());

generateAllSitemaps()
  .then(() => {
    console.log("Generazione dei sitemap completata con successo!");
    console.log("Verifica i file generati nella cartella public/:");
    console.log("- sitemap.xml (indice principale)");
    console.log("- sitemap-static.xml");
    console.log("- sitemap-patologias-[1-5].xml");
    console.log("- sitemap-reviews.xml");
    
    const fs = require('fs');
    const path = require('path');
    const publicDir = path.join(process.cwd(), 'public');
    console.log("\nFile presenti nella cartella public/:");
    fs.readdirSync(publicDir)
      .filter(file => file.includes('sitemap'))
      .forEach(file => {
        console.log(`- ${file}`);
      });
  })
  .catch((error) => {
    console.error("Errore durante la generazione dei sitemap:", error);
    process.exit(1);
  });