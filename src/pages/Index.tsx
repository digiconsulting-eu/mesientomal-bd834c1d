
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReviewCard } from '@/components/ReviewCard';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const { data: reviews, isLoading, isError } = useQuery({
    queryKey: ['reviews'],
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
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching reviews:', error);
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
        <title>MeSientoMal.info - Comparte y encuentra experiencias sobre enfermedades</title>
        <meta 
          name="description" 
          content="Encuentra y comparte experiencias sobre enfermedades. Ayuda a otros compartiendo tu historia." 
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Encuentra experiencias sobre enfermedades
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Ayuda a otros compartiendo tu historia
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/patologias"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Buscar patología
            </a>
            <a
              href="/cuenta-tu-experiencia"
              className="bg-white text-primary px-6 py-3 rounded-lg border-2 border-primary hover:bg-primary/10 transition-colors"
            >
              Cuenta tu experiencia
            </a>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Últimas reseñas
          </h2>
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Cargando reseñas...</p>
            </div>
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
        </section>
      </div>
    </>
  );
};

export default Index;
