import { Helmet } from 'react-helmet-async';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ReviewCard } from "@/components/ReviewCard";

const PathologySearch = () => {
  const reviews = [
    {
      title: "Mi experiencia con la migraña crónica",
      author: "Anónimo238",
      tag: "MIGRAÑA",
      content: "He sufrido de migrañas durante más de 10 años. Los episodios suelen durar..."
    },
    {
      title: "Viviendo con artritis reumatoide",
      author: "Anónimo456",
      tag: "ARTRITIS REUMATOIDE",
      content: "Fui diagnosticada con artritis reumatoide hace 5 años. Al principio fue muy difícil..."
    },
    {
      title: "Mi lucha contra la fibromialgia",
      author: "Anónimo789",
      tag: "FIBROMIALGIA",
      content: "La fibromialgia ha cambiado completamente mi vida. Los dolores constantes..."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Buscar Patologías - MeSientoMal.info</title>
        <meta name="description" content="Explora nuestra base de datos de patologías y encuentra experiencias de pacientes con condiciones similares a la tuya." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Buscar Patologías</h1>
          <p className="text-xl text-gray-600">Encuentra experiencias de otros pacientes</p>
          
          <div className="max-w-2xl mx-auto mt-8 flex gap-2">
            <Input 
              placeholder="Buscar una patología..." 
              className="h-12"
            />
            <Button size="lg">
              <Search className="h-5 w-5" />
            </Button>
          </div>
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

export default PathologySearch;