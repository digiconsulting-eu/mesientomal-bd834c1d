import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

const StatisticCard = ({ label, value }: { label: string; value: number }) => (
  <div className="mb-4">
    <div className="text-gray-600">{label}</div>
    <div className="flex items-center gap-2">
      <span className="text-3xl font-bold">{value.toFixed(1)}</span>
      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm">Alto</span>
    </div>
  </div>
);

export default function PathologyDetail() {
  const { id } = useParams();

  const { data: pathology, isLoading } = useQuery({
    queryKey: ["pathology", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("PATOLOGIE")
        .select("*")
        .eq("Patologia", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="p-8">Caricamento...</div>;
  }

  if (!pathology) {
    return <div className="p-8">Patologia non trovata</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-500">{pathology.Patologia}</h1>
        <Button variant="outline">Segui</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Statistics Card */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Statistiche</h2>
            <StatisticCard label="Difficoltà di Diagnosi" value={4.0} />
            <StatisticCard label="Fastidio Sintomi" value={4.0} />
            <StatisticCard label="Efficacia Cura Farmacologica" value={4.0} />
            <StatisticCard label="Possibilità di Guarigione" value={4.0} />
            <StatisticCard label="Disagio Sociale" value={4.0} />
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          {/* Links */}
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <Button variant="link" className="w-full justify-start text-lg font-medium text-blue-500">
                Panoramica
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <Button variant="link" className="w-full justify-start text-lg font-medium text-blue-500">
                Leggi Esperienze
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <Button variant="link" className="w-full justify-start text-lg font-medium text-blue-500">
                Racconta la tua Esperienza
              </Button>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Cos'è {pathology.Patologia}?</h2>
              <p className="text-gray-700">{pathology.Descrizione}</p>
            </CardContent>
          </Card>

          {/* Experiences */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Esperienze (1)</h2>
              
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-medium">mal di schiena</h3>
                <div className="mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-gray-600">Anonimo1027</span>
                </div>
                <div className="mb-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm">
                    {pathology.Patologia.toLowerCase()}
                  </span>
                </div>
                <p className="mb-2 text-gray-700">mal di schiena</p>
                <Button variant="default" className="w-full bg-blue-500">
                  Leggi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}