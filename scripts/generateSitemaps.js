import fs from 'fs'
import path from 'path'

const SITE_URL = 'https://mesientomal.info'

// Lista completa delle patologie
const pathologies = [
  "absceso-cerebral", "absceso-dental", "absceso-hepatico", "absceso-perianal",
  "acidosis", "adenitis", "alergia", "alzheimer", "anemia", "angina-de-pecho",
  "ansiedad", "artritis", "asma", "ateroesclerosis", "autismo", "bipolaridad", 
  "bronquitis", "cancer", "cancer-de-mama", "cancer-de-pulmon", "cancer-de-prostata", 
  "cancer-de-piel", "cancer-de-rinon", "cancer-de-testiculo", "cancer-gastrico", 
  "cancer-hepatico", "cancer-intestinal", "cancer-oral", "cancer-uterino", 
  "cancer-vesical", "cefalea", "cistitis", "colitis", "conjuntivitis", "depresion",
  "diabetes", "diarrea", "dislexia", "epilepsia", "esclerosis-multiple", 
  "esquizofrenia", "estres", "faringitis", "fibromialgia", "gastritis", "gingivitis", 
  "gripe", "hepatitis", "hernia", "hipertension", "hipotiroidismo", "insomnio",
  "infeccion-urinaria", "insuficiencia-renal", "insuficiencia-respiratoria", 
  "lupus", "migrana", "neumonia", "obesidad", "osteoporosis", "psoriasis", 
  "rinitis", "sinusitis", "tension-arterial", "trombosis", "tuberculosis", 
  "virus-del-papiloma", "zika", "menopausia", "mesotelioma-pleurico", "miastenia-gravis", 
  "mielitis", "mielofibrosis", "mieloma-multiple", "mielopatia", "miliaria", 
  "miocarditis", "miopia", "miringitis", "mixoma", "mollusco-contagioso", 
  "mononucleosis", "narcolepsia", "nefritis", "nefropatia-diabetica", 
  "neumonia-por-aspiracion", "neurinoma-acustico", "neuritis-optica", 
  "neuroblastoma", "neurofibromatosis", "neuroma-de-morton", "neuronitis-vestibular", 
  "neuropatia-diabetica", "nevo-de-spitz", "nevus-nevo", "nodulo-tiroideo", 
  "obstruccion-intestinal", "oclusion-intestinal", "ojo-de-pernice", "ombalitis", 
  "onicofagia", "onicomicosis", "orquitis", "orzuelo", "osteitis", "osteocondoresis", 
  "osteocondritis", "osteogenesis-imperfecta", "osteoma-osteoide", "osteomielitis", 
  "osteonecrosis", "osteopenia", "osteopetrosis", "osteosarcoma", "otitis", 
  "otitis-aguda", "otitis-barotraumatica", "otitis-bollosa", "otitis-media", 
  "otoesclerosis", "ovario-polquistico", "oxiuriasis", "palatosquisis", "panaricio", 
  "pancreatitis", "pancreatitis-aguda", "panicolitis", "parafimosis", 
  "paralisis-cerebral-infantil", "paraparesia-espastica", "paro-cardiaco", "paroniquia", 
  "parotitis", "patereco", "pediculosis", "pelagra", "pericarditis", "periodontitis", 
  "peritonitis", "permigoide-bulloso", "permigoide-gestacional", "permigo-vulgar", 
  "pfapa", "pie-cavo", "pie-de-atleta", "pie-diabetico", "pielonefritis", "pie-plano", 
  "pinguecola", "pitiriasis-alba", "pitiriasis-rosa", "placenta-accreta", 
  "placenta-previa", "pleuritis", "policitemia-vera", "polidipsia-psicogena", 
  "polimialgia-reumatica", "polimiositis", "poliomielitis", "polipos-intestinales", 
  "poliposis-nasales-polipos-en-la-nariz", "polipos-uterinos", "porfiria", 
  "porfiria-cutanea-tarda", "pre-eclampsia", "presbiopia", "proctitis", "progeria", 
  "prostatitis", "psicosis-de-korsakoff", "pubalgia", "pulpitis", "quemadura", "rabia", 
  "radiculopatia", "rafaga-anal", "reflujo-gastroesofagico", "resfriado", 
  "retinitis-pigmentosa", "retinoblastoma", "retinopatia-diabetica", "rinitis-alergica", 
  "rizoartrosis", "rosacea", "rubeola", "sacroilitis", "salmonella", "salpingitis", 
  "sarcoma-de-kaposi", "sarna", "sepsis", "sexta-enfermedad", "shigellosis", 
  "shock-septico", "sialoadenitis", "sida", "sifilis", "silicosis", 
  "sindrome-compartimental", "sindrome-de-asperger", "sindrome-de-aspiracion-de-meconio", 
  "sindrome-de-brugada", "sindrome-de-colon-irritable", "sindrome-de-de-quervain", 
  "sindrome-de-descompresion", "sindrome-de-down", "sindrome-de-ehlers-danlos", 
  "sindrome-de-fanconi", "sindrome-de-fatiga-cronica", "sindrome-de-horner", 
  "sindrome-de-intestino-irritable", "sindrome-de-klinefelter", "sindrome-de-la-boca-ardiente", 
  "sindrome-de-la-cola-de-caballo", "sindrome-de-las-piernas-sin-descanso", 
  "sindrome-del-estrecho-toracico", "sindrome-del-ojo-seco", "sindrome-del-piriforme", 
  "sindrome-del-tunel-carpal", "sindrome-de-mallory-weiss", "sindrome-de-marfan", 
  "sindrome-de-meniere", "sindrome-de-ovario-policistico", "sindrome-de-pickwick", 
  "sindrome-de-prader-willi", "sindrome-de-reiter", "sindrome-de-reye", 
  "sindrome-de-sjogren", "sindrome-de-tourette", "sindrome-de-turner", "sindrome-de-zieve", 
  "sindrome-de-zollinger-ellison", "sindrome-emolitico-uremico", "sindrome-fetal-alcoholico", 
  "sindrome-metabolico", "sindrome-parainfluenzal", "sindrome-premenstrual", 
  "sindrome-serotoninergico", "sinovitis", "sintomas-de-ganglios-o-quistes-sinoviales", 
  "sintomas-de-insuficiencia-cardiaca", "siringomielia", "sprue-tropical", "talasemia", 
  "talonitis", "tdah-sindrome-de-deficit-de-atencion-e-hiperactividad", "tendinitis", 
  "tenosinovitis", "tetanos", "tifoidea", "timoma", "tina-capitis", "tina-versicolor", 
  "tiroiditis-subaguda", "torsion-anexial", "torsion-testicular", "tos-ferina", 
  "toxoplasmosis", "tracoma", "traqueitis", "trastorno-bipolar", "trastorno-ciclotimico", 
  "trastorno-de-estres-postraumatico", "trastorno-de-la-alimentacion-incontrolada", 
  "trastorno-evitativo-de-la-personalidad", "trastorno-limite-de-la-personalidad", 
  "trastorno-narcisista-de-la-personalidad", "trastorno-obsesivo-compulsivo", 
  "trastornos-de-la-coagulacion", "trichinosis", "trichomonas", "tripanosomiasis-africana", 
  "trisomia-13", "trisomia-18", "trombocitemia-esencial", "trombofilia", "tromboflebitis", 
  "trombosis-venosa-profunda", "trombosis-venosa-superficial", "tumor-de-hipofisis", 
  "tumor-de-wilms", "ulcera-corneal", "ulcera-duodenal", "ulcera-gastrica", 
  "ulcera-peptica", "una-encarnada", "uretritis", "uveitis", "vaginitis", 
  "vaginosis-bacteriana", "varicela", "varices-esofagicas", "varicocele", 
  "vejiga-neurologica", "venas-varicosas", "verrugas", "vih", "viruela", "virus-zika", 
  "vitiligo", "zigomicosis", "zoantropia"
].sort();

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

    fs.writeFileSync(path.join(process.cwd(), 'public/sitemap-static.xml'), staticSitemap);
    console.log('Static sitemap generated successfully');
  } catch (error) {
    console.error('Error generating static sitemap:', error);
    throw error;
  }
}

// Generate sitemap for pathologies
const generatePathologySitemap = () => {
  try {
    console.log('Generating pathology sitemap...');
    const currentDate = new Date().toISOString().split('T')[0];
    
    const pathologySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pathologies.map(pathology => `
  <url>
    <loc>${SITE_URL}/patologia/${pathology}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

    fs.writeFileSync(path.join(process.cwd(), 'public/sitemap-patologias.xml'), pathologySitemap);
    console.log('Pathology sitemap generated successfully');
  } catch (error) {
    console.error('Error generating pathology sitemap:', error);
    throw error;
  }
}

// Generate sitemap index
const generateSitemapIndex = () => {
  try {
    console.log('Generating sitemap index...');
    const currentDate = new Date().toISOString().split('T')[0];
    
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-static.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-patologias.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

    fs.writeFileSync(path.join(process.cwd(), 'public/sitemap.xml'), sitemapIndex);
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
    generatePathologySitemap();
    generateSitemapIndex();

    // Rimuovi i vecchi file sitemap non più necessari
    const oldSitemaps = [
      'sitemap-patologias-1.xml',
      'sitemap-patologias-2.xml',
      'sitemap-patologias-3.xml',
      'sitemap-patologias-4.xml',
      'sitemap-patologias-5.xml'
    ];

    oldSitemaps.forEach(file => {
      const filePath = path.join(process.cwd(), 'public', file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Removed old sitemap: ${file}`);
      }
    });

    console.log('All sitemaps generated successfully');
  } catch (error) {
    console.error('Fatal error in main execution:', error);
    process.exit(1);
  }
}

main();
