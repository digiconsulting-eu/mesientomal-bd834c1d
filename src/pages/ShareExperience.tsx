import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExperienceForm } from "@/components/ExperienceForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

const ShareExperience = () => {
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredPathologies = pathologies?.filter(p => 
    p.Patologia?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cuenta tu experiencia</h1>
        
        <div className="mb-8">
          <Input
            type="search"
            placeholder="Cerca una patologia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="space-y-4">
          {filteredPathologies?.map((pathology) => (
            <Card key={pathology.Patologia}>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">{pathology.Patologia}</h2>
                {pathology.Patologia && <ExperienceForm name={pathology.Patologia} />}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareExperience;