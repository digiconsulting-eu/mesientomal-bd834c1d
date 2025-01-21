import { Helmet } from 'react-helmet-async';
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { AlphabetFilter } from "@/components/AlphabetFilter";
import { PathologyItem } from "@/components/PathologyItem";
import { Skeleton } from "@/components/ui/skeleton";
import { generateAllSitemaps } from "@/utils/generateSitemaps";

const PathologySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("TUTTE");

  const { data: pathologies, isLoading } = useQuery({
    queryKey: ["pathologies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("PATOLOGIE")
        .select("Patologia")
        .order("Patologia");
      
      if (error) throw error;
      console.log("Total number of pathologies:", data?.length);
      return data;
    }
  });

  const filteredPathologies = pathologies?.filter(p => {
    if (!p.Patologia) return false;
    
    // If there's a search term, filter by it
    if (searchTerm) {
      return p.Patologia.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    // If a letter is selected (and it's not "TUTTE"), filter by that letter
    if (selectedLetter !== "TUTTE") {
      return p.Patologia.toUpperCase().startsWith(selectedLetter);
    }
    
    // If no filters are active, return all pathologies
    return true;
  });

  useEffect(() => {
    // Generate sitemaps when component mounts
    generateAllSitemaps();
  }, []);

  return (
    <>
      <Helmet>
        <title>Buscar Patología - MeSientoMal.info</title>
        <meta name="description" content="Busca entre todas las patologías y descubre las experiencias de otros pacientes." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Buscar Patología</h1>
          
          <div className="max-w-3xl mx-auto">
            <Input 
              placeholder="Buscar una patología..." 
              className="h-12 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <AlphabetFilter 
          selectedLetter={selectedLetter} 
          onLetterSelect={setSelectedLetter}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPathologies?.map((pathology) => (
              pathology.Patologia && (
                <PathologyItem 
                  key={pathology.Patologia} 
                  name={pathology.Patologia} 
                />
              )
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PathologySearch;