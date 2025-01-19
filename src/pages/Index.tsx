import { ReviewCard } from "@/components/ReviewCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Helmet } from 'react-helmet-async';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: reviews } = useQuery({
    queryKey: ['featured-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          patologia:PATOLOGIE(Patologia)
        `)
        .limit(6);
      
      if (error) throw error;
      return data.map(review => ({
        title: review.title,
        author_username: review.author_username,
        patologia: review.patologia?.Patologia || 'Desconocida',
        content: review.experience || ''
      }));
    }
  });

  return (
    <>
      <Helmet>
        <title>MeSientoMal.info - Experiencias médicas compartidas</title>
        <meta name="description" content="Descubre experiencias reales de pacientes. Una comunidad donde compartir y encontrar información sobre diferentes patologías y tratamientos." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Comparte tu experiencia</h1>
          <p className="text-xl text-gray-600">Ayuda a otros pacientes compartiendo tu historia</p>
          
          <div className="max-w-2xl mx-auto mt-8 flex gap-2">
            <Input 
              placeholder="Buscar una patología..." 
              className="h-12 text-base"
            />
            <Button size="lg">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Reseñas destacadas</h2>
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/10"
          >
            Ver todas las reseñas
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews?.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Index;