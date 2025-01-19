import { Helmet } from 'react-helmet-async';
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { AlphabetFilter } from "@/components/AlphabetFilter";
import { PathologyItem } from "@/components/PathologyItem";

const PathologySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("TUTTE");

  const { data: pathologies } = useQuery({
    queryKey: ["pathologies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("PATOLOGIE")
        .select("Patologia")
        .order("Patologia");
      
      if (error) throw error;
      return data;
    }
  });

  const filteredPathologies = pathologies?.filter(p => {
    if (!p.Patologia) return false;
    
    const matchesSearch = p.Patologia.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLetter = selectedLetter === "TUTTE" || p.Patologia.startsWith(selectedLetter);
    
    return matchesSearch && matchesLetter;
  });

  return (
    <>
      <Helmet>
        <title>Cerca Patologia - MeSientoMal.info</title>
        <meta name="description" content="Cerca tra le patologie e scopri le esperienze di altri pazienti." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Cerca Patologia</h1>
          
          <div className="max-w-3xl mx-auto">
            <Input 
              placeholder="Cerca una patologia..." 
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
      </div>
    </>
  );
};

export default PathologySearch;