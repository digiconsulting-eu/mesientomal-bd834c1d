import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Pathology = Tables<"PATOLOGIE">;

const PathologySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pathologies, setPathologies] = useState<Pathology[]>([]);
  const [selectedLetter, setSelectedLetter] = useState("TUTTE");

  const alphabet = "ABCDEFGHIJLMNOPQRSTUVZ".split("");

  useEffect(() => {
    fetchPathologies();
  }, []);

  const fetchPathologies = async () => {
    const { data, error } = await supabase
      .from("PATOLOGIE")
      .select("*")
      .order("Patologia");

    if (error) {
      console.error("Error fetching pathologies:", error);
      return;
    }

    setPathologies(data || []);
  };

  const filteredPathologies = pathologies.filter((pathology) => {
    const matchesSearch = pathology.Patologia?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLetter =
      selectedLetter === "TUTTE" ||
      pathology.Patologia?.startsWith(selectedLetter);
    return matchesSearch && matchesLetter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Buscar Patología</h1>
      
      <Input
        type="text"
        placeholder="Buscar una patología..."
        className="w-full mb-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedLetter("TUTTE")}
          className={`px-4 py-2 rounded ${
            selectedLetter === "TUTTE"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          TODAS
        </button>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`px-4 py-2 rounded ${
              selectedLetter === letter
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredPathologies.map((pathology) => (
          <div
            key={pathology.id}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="text-blue-500 font-medium">
              {pathology.Patologia}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PathologySearch;