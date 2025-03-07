
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PathologyStats } from '@/components/pathology-detail/PathologyStats';
import { PathologyNavigation } from '@/components/pathology-detail/PathologyNavigation';
import { PathologyDescription } from '@/components/pathology-detail/PathologyDescription';
import { PathologyExperiences } from '@/components/pathology-detail/PathologyExperiences';

const PathologyDetail = () => {
  const { name } = useParams();
  
  // Format name for case-insensitive comparison
  const formattedName = name?.replace(/-/g, ' ');
  
  const { data: pathologyData, isLoading: pathologyLoading } = useQuery({
    queryKey: ['pathology', formattedName],
    queryFn: async () => {
      // Case insensitive search
      const { data, error } = await supabase
        .from('PATOLOGIE')
        .select('*')
        .ilike('Patologia', formattedName || '')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['pathology-reviews', pathologyData?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          PATOLOGIE (
            Patologia
          )
        `)
        .eq('patologia_id', pathologyData?.id);
      
      if (error) throw error;
      console.log("Reviews data:", data);
      return data;
    },
    enabled: !!pathologyData?.id
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
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <>
      <Helmet>
        <title>{pathologyData?.Patologia?.toUpperCase() || name?.toUpperCase()} - Información y Experiencias | MeSientoMal.info</title>
        <meta name="description" content={`Información detallada y experiencias de pacientes sobre ${pathologyData?.Patologia || name}. Conoce síntomas, tratamientos y testimonios reales.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-sky-500">{pathologyData?.Patologia?.toUpperCase() || name?.toUpperCase()}</h1>
            <Button variant="outline" className="border-sky-500 text-sky-500 hover:bg-sky-50">
              Seguir
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Statistics Column */}
            <PathologyStats averages={averages} />

            {/* Main Content Column */}
            <div className="md:col-span-2 space-y-6">
              <PathologyNavigation 
                pathologyName={pathologyData?.Patologia || name || ''} 
                onSectionClick={scrollToSection}
              />
              
              <PathologyDescription 
                name={pathologyData?.Patologia || name || ''} 
                description={pathologyData?.Descrizione || ''}
              />
              
              <PathologyExperiences reviews={reviews || []} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PathologyDetail;
