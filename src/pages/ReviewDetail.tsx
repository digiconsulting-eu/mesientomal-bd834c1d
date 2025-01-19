import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const ReviewDetail = () => {
  const { reviewTitle } = useParams();
  const navigate = useNavigate();
  const decodedTitle = decodeURIComponent(reviewTitle || "");

  const { data: review, isError } = useQuery({
    queryKey: ['review', reviewTitle],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          patologia:PATOLOGIE(Patologia),
          author:author_username
        `)
        .eq('title', decodedTitle)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Review not found');
      return data;
    }
  });

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Review not found</h1>
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Button>
      </div>
    );
  }

  if (!review) return null;

  const renderRatingBar = (value: number | null, maxValue: number = 5) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: maxValue }).map((_, index) => (
          <div
            key={index}
            className={`h-2 w-8 rounded ${
              index < (value || 0) ? 'bg-primary' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>{review.title} - MeSientoMal.info</title>
        <meta name="description" content={review.experience?.substring(0, 155)} />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6 -ml-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="space-y-8">
          <div>
            <Badge 
              variant="secondary" 
              className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-0"
            >
              {review.patologia?.Patologia}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {review.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <span>{review.author}</span>
              <span>•</span>
              <span>{formatDate(review.created_at)}</span>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Síntomas</h2>
              <p className="text-gray-600">{review.symptoms}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Experiencia</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{review.experience}</p>
            </section>

            <div className="grid md:grid-cols-2 gap-6">
              <section>
                <h3 className="font-medium text-gray-900 mb-2">Dificultad de Diagnóstico</h3>
                {renderRatingBar(review.diagnosis_difficulty)}
              </section>

              <section>
                <h3 className="font-medium text-gray-900 mb-2">Gravedad de los Síntomas</h3>
                {renderRatingBar(review.symptom_severity)}
              </section>

              <section>
                <h3 className="font-medium text-gray-900 mb-2">Posibilidad de Curación</h3>
                {renderRatingBar(review.healing_possibility)}
              </section>

              <section>
                <h3 className="font-medium text-gray-900 mb-2">Malestar Social</h3>
                {renderRatingBar(review.social_discomfort)}
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewDetail;