import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PathologyDetail = () => {
  const { name } = useParams();
  
  const { data: pathologyData } = useQuery({
    queryKey: ['pathology', name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('PATOLOGIE')
        .select('*')
        .eq('Patologia', name)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: reviews } = useQuery({
    queryKey: ['pathology-reviews', name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('patologia', name);
      
      if (error) throw error;
      return data;
    }
  });

  // Calculate averages from reviews
  const averages = reviews?.reduce((acc, review) => {
    if (review.diagnosis_difficulty) acc.diagnosisDifficulty += review.diagnosis_difficulty;
    if (review.symptom_severity) acc.symptomSeverity += review.symptom_severity;
    if (review.healing_possibility) acc.healingPossibility += review.healing_possibility;
    if (review.social_discomfort) acc.socialDiscomfort += review.social_discomfort;
    return acc;
  }, {
    diagnosisDifficulty: 0,
    symptomSeverity: 0,
    healingPossibility: 0,
    socialDiscomfort: 0
  });

  if (reviews?.length) {
    Object.keys(averages).forEach(key => {
      averages[key] = (averages[key] / reviews.length).toFixed(1);
    });
  }

  const getLevelBadge = (value: number) => {
    if (value >= 4) return "Alto";
    if (value >= 2) return "Medio";
    return "Bajo";
  };
  
  return (
    <>
      <Helmet>
        <title>{name} - Información y Experiencias | MeSientoMal.info</title>
        <meta name="description" content={`Información detallada y experiencias de pacientes sobre ${name}. Conoce síntomas, tratamientos y testimonios reales.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-sky-500">{name}</h1>
            <Button variant="outline" className="border-sky-500 text-sky-500 hover:bg-sky-50">
              Seguir
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Statistics Column */}
            <div className="bg-white rounded-lg p-6 border border-sky-500">
              <h2 className="text-xl font-semibold mb-6">Estadísticas</h2>
              
              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-2">Dificultad de Diagnóstico</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">{averages?.diagnosisDifficulty || '0.0'}</span>
                    <Badge variant="secondary">{getLevelBadge(averages?.diagnosisDifficulty || 0)}</Badge>
                  </div>
                </div>

                <div>
                  <p className="text-gray-600 mb-2">Gravedad de los Síntomas</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">{averages?.symptomSeverity || '0.0'}</span>
                    <Badge variant="secondary">{getLevelBadge(averages?.symptomSeverity || 0)}</Badge>
                  </div>
                </div>

                <div>
                  <p className="text-gray-600 mb-2">Eficacia del Tratamiento</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">{averages?.healingPossibility || '0.0'}</span>
                    <Badge variant="secondary">{getLevelBadge(averages?.healingPossibility || 0)}</Badge>
                  </div>
                </div>

                <div>
                  <p className="text-gray-600 mb-2">Posibilidad de Curación</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">{averages?.healingPossibility || '0.0'}</span>
                    <Badge variant="secondary">{getLevelBadge(averages?.healingPossibility || 0)}</Badge>
                  </div>
                </div>

                <div>
                  <p className="text-gray-600 mb-2">Malestar Social</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">{averages?.socialDiscomfort || '0.0'}</span>
                    <Badge variant="secondary">{getLevelBadge(averages?.socialDiscomfort || 0)}</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Column */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-sky-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-sky-500 mb-2">Resumen</h2>
              </div>

              <div className="bg-sky-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-sky-500 mb-2">Leer Experiencias</h2>
              </div>

              <div className="bg-sky-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-sky-500 mb-2">Comparte tu Experiencia</h2>
              </div>

              <div className="bg-white rounded-lg p-6 border border-sky-500">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">¿Qué es {name}?</h2>
                  <Button variant="ghost" size="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                  </Button>
                </div>
                <p className="text-gray-700">
                  {pathologyData?.Descrizione || 'Descripción no disponible.'}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-sky-500">
                <h2 className="text-xl font-semibold mb-4">Experiencias ({reviews?.length || 0})</h2>
                {reviews?.length === 0 ? (
                  <p className="text-gray-600">Aún no hay experiencias para esta patología.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews?.map((review) => (
                      <div key={review.id} className="p-4 bg-white rounded-lg border">
                        <h3 className="font-semibold mb-2">{review.title}</h3>
                        <Badge className="mb-2" variant="secondary">{review.patologia}</Badge>
                        <p className="text-gray-700">{review.experience}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PathologyDetail;