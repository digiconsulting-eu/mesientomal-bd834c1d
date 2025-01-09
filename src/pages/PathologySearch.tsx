import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function PathologySearch() {
  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const { data: pathologies } = useQuery({
    queryKey: ["pathologies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("PATOLOGIE")
        .select("*")
        .order("Patologia");
      
      if (error) throw error;
      return data;
    },
  });

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const filteredPathologies = pathologies?.filter(
    (p) =>
      (!selectedLetter ||
        p.Patologia?.toUpperCase().startsWith(selectedLetter)) &&
      (!search ||
        p.Patologia?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
          <Input
            type="search"
            placeholder="Cerca patologia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
            className={`h-8 w-8 rounded-full ${
              selectedLetter === letter
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPathologies?.map((pathology) => (
          <Link key={pathology.id} to={`/pathology/${pathology.Patologia}`}>
            <Card className="transition-transform hover:scale-105">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium">{pathology.Patologia}</h3>
                <p className="line-clamp-2 text-sm text-gray-600">
                  {pathology.Descrizione}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}