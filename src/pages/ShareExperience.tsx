import { useState } from "react";
import { ExperienceForm } from "@/components/ExperienceForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ShareExperience = () => {
  const [selectedPathology, setSelectedPathology] = useState<string>("");

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">Racconta la tua Esperienza</h1>
        
        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-medium">Patologia *</label>
            <Select value={selectedPathology} onValueChange={setSelectedPathology}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona una patologia" />
              </SelectTrigger>
              <SelectContent>
                {pathologies?.map((pathology) => (
                  pathology.Patologia && (
                    <SelectItem key={pathology.Patologia} value={pathology.Patologia}>
                      {pathology.Patologia}
                    </SelectItem>
                  )
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPathology && <ExperienceForm name={selectedPathology} />}
        </div>
      </div>
    </div>
  );
};

export default ShareExperience;