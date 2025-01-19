import { ReviewCard } from "@/components/ReviewCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Helmet } from 'react-helmet-async';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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

  const { data: searchResults } = useQuery({
    queryKey: ['search-patologies', searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      
      const { data, error } = await supabase
        .from('PATOLOGIE')
        .select('Patologia')
        .ilike('Patologia', `%${searchTerm}%`)
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: searchTerm.length > 2
  });

  const handleSearch = () => {
    if (searchTerm) {
      navigate(`/pathology-search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
          
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <div className="flex gap-2">
                <Input 
                  placeholder="Buscar una patología..." 
                  className="h-12 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button size="lg" onClick={handleSearch}>
                  <Search className="h-5 w-5" />
                </Button>
              </div>
              
              {searchResults && searchResults.length > 0 && searchTerm.length > 2 && (
                <div className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg border border-gray-200">
                  {searchResults.map((result) => (
                    <button
                      key={result.Patologia}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        navigate(`/pathology/${encodeURIComponent(result.Patologia)}`);
                      }}
                    >
                      {result.Patologia}
                    </button>
                  ))}
                </div>
              )}
            </div>
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