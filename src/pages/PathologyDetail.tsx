import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Microscope, Pill, Stethoscope } from "lucide-react";

type Pathology = Tables<"PATOLOGIE">;

const PathologyDetail = () => {
  const { name } = useParams();
  const [pathology, setPathology] = useState<Pathology | null>(null);
  const [activeTab, setActiveTab] = useState<'panoramica' | 'esperienze'>('panoramica');

  useEffect(() => {
    const fetchPathology = async () => {
      const { data, error } = await supabase
        .from("PATOLOGIE")
        .select("*")
        .eq("Patologia", decodeURIComponent(name || ''))
        .single();

      if (error) {
        console.error("Error al cargar la patología:", error);
        return;
      }

      setPathology(data);
    };

    fetchPathology();
  }, [name]);

  if (!pathology) {
    return <div className="container mx-auto px-4 py-8">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{pathology.Patologia}</h1>
        <Button variant="outline">Seguir</Button>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'panoramica' ? 'default' : 'outline'}
          onClick={() => setActiveTab('panoramica')}
        >
          Descripción General
        </Button>
        <Button
          variant={activeTab === 'esperienze' ? 'default' : 'outline'}
          onClick={() => setActiveTab('esperienze')}
        >
          Leer Experiencias
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Dificultad de Diagnóstico</p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">4.0</span>
                    <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Alta</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Severidad de Síntomas</p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">4.0</span>
                    <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Alta</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Tratamientos Disponibles</p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">3.5</span>
                    <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Media</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Riesgo de Complicaciones</p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">2.0</span>
                    <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Bajo</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {activeTab === 'panoramica' && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">¿Qué es {pathology.Patologia}?</h2>
                <p className="text-gray-700">{pathology.Descrizione}</p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'esperienze' && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Experiencias</h2>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">Anónimo1027</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {pathology.Patologia?.toLowerCase()}
                      </span>
                    </div>
                    <p className="text-gray-700">dolor de espalda</p>
                    <Button variant="default" className="mt-4">
                      Leer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PathologyDetail;