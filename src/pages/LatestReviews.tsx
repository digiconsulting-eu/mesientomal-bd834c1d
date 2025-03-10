
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReviewCard } from '@/components/ReviewCard';
import { toast } from '@/components/ui/use-toast';

const LatestReviews = () => {
  const { data: reviews, isLoading, isError } = useQuery({
    queryKey: ['latest-reviews'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            *,
            PATOLOGIE (
              Patologia
            )
          `)
          .order('created_at', { ascending: false })
          .limit(12);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching latest reviews:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 3,
  });

  if (isError) {
    toast({
      title: "Error",
      description: "Hubo un problema al cargar las reseñas. Por favor, intenta nuevamente.",
      variant: "destructive",
    });
  }

  return (
    <>
      <Helmet>
        <title>Últimas Reseñas - MeSientoMal.info</title>
        <meta 
          name="description" 
          content="Descubre las experiencias más recientes compartidas por otros pacientes." 
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Últimas Reseñas
        </h1>

        {isLoading ? (
          <div className="text-center text-gray-600">Cargando reseñas...</div>
        ) : reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                title={review.title}
                patologia={review.PATOLOGIE?.Patologia || ''}
                content={review.experience || ''}
                author={review.author_username || 'Anónimo'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No hay reseñas disponibles en este momento.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default LatestReviews;
