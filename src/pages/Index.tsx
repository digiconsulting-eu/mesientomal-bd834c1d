import { ReviewCard } from "@/components/ReviewCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const reviews = [
    {
      title: "miglioramenti delle reazioni con dieta detox",
      author: "Anonimo1028",
      tag: "ALLERGIA AL NICHEL E SNAS",
      content: "ci ho messo molto a capire cosa mi causasse dermatiti ed eczema a chiazze.. che non..."
    },
    {
      title: "mal di schiena",
      author: "Anonimo1027",
      tag: "STENOSI LOMBARE",
      content: "mal di schiena..."
    },
    {
      title: "forte dolore all'ovaio dopo l'operazione",
      author: "Anonimo1024",
      tag: "FIBROTECOMA OVARICO",
      content: "nel 2011 mi hanno tolto un fibrotecoma ovarico di 4 cm, tagliendomi il 60% dell'ovaio. Se prima di..."
    },
    {
      title: "La difficoltà di vivere con il dolore articolare",
      author: "Anonimo745",
      tag: "ENTESITE",
      content: "Il dolore articolare causato dall'entesitis è stato insopportabile. Il gonfiore e la rigidità mi rendeva..."
    },
    {
      title: "Indispensabile il dentista",
      author: "Anonimo245",
      tag: "ASCESSO GENGIVALE",
      content: "L'ascesso gengivale è stato devastante, con un dolore forte che non passava con nessun..."
    },
    {
      title: "Da adolescente, l'acne mi ha rovinato l'autostima",
      author: "Anonimo850",
      tag: "ACNE",
      content: "L'acne è stata una battaglia lunga per me. Quando ero più giovane, mi sentivo vergognato e isolato..."
    }
  ];

  return (
    <>
      <Helmet>
        <title>MeSientoMal.info - Experiencias médicas compartidas</title>
        <meta name="description" content="Descubre experiencias reales de pacientes. Una comunidad donde compartir y encontrar información sobre diferentes patologías y tratamientos." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#3B9EE3] mb-4">Condividi la tua esperienza</h1>
          <p className="text-xl text-gray-600">Aiuta altri pazienti condividendo la tua storia</p>
          
          <div className="max-w-2xl mx-auto mt-8 flex gap-2">
            <Input 
              placeholder="Cerca una patologia..." 
              className="h-12 text-base"
            />
            <Button size="lg" className="bg-[#3B9EE3] hover:bg-[#3B9EE3]/90">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Recensioni in evidenza</h2>
          <Button 
            variant="outline" 
            className="border-[#3B9EE3] text-[#3B9EE3] hover:bg-[#3B9EE3]/10"
          >
            Mostra tutte le recensioni
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Index;