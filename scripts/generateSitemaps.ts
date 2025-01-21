import { generateAllSitemaps } from "../src/utils/generateSitemaps";

console.log("Iniziando la generazione dei sitemap...");

// Esegui il generatore di sitemap
generateAllSitemaps()
  .then(() => {
    console.log("Generazione dei sitemap completata con successo!");
  })
  .catch((error) => {
    console.error("Errore durante la generazione dei sitemap:", error);
    process.exit(1);
  });