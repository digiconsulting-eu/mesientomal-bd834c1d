import { generateAllSitemaps } from "../src/utils/generateSitemaps";

console.log("Iniziando la generazione dei sitemap...");

// Esegui il generatore di sitemap
generateAllSitemaps()
  .then(() => {
    console.log("Generazione dei sitemap completata con successo!");
    // Aggiungi più dettagli nel log
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