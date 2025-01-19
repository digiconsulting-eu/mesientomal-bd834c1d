import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { ReviewCard } from "@/components/ReviewCard";

const ReviewDetail = () => {
  const { patologia, reviewTitle } = useParams();
  const navigate = useNavigate();
  const decodedTitle = decodeURIComponent(reviewTitle || "");

  const { data: review, isError, isLoading } = useQuery({
    queryKey: ['review', reviewTitle],
    queryFn: async () => {
      if (!decodedTitle) throw new Error('Review title is required');
      
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
    },
    retry: false
  });

  const { data: relatedReviews } = useQuery({
    queryKey: ['related-reviews', review?.patologia?.Patologia],
    queryFn: async () => {
      if (!review?.patologia?.Patologia) return [];
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          patologia:PATOLOGIE(Patologia),
          author:author_username
        `)
        .eq('patologia.Patologia', review.patologia.Patologia)
        .neq('title', decodedTitle)
        .limit(3);

      if (error) throw error;
      return data || [];
    },
    enabled: !!review?.patologia?.Patologia
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Caricamento...</p>
      </div>
    );
  }

  if (isError || !review) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Recensione non trovata</h1>
        <p className="text-gray-600 mb-6">
          La recensione che stai cercando non esiste o è stata rimossa.
        </p>
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna alla home
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderRatingBar = (value: number | null, maxValue: number = 5) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: maxValue }).map((_, index) => (
          <div
            key={index}
            className={`h-2 w-8 rounded ${
              index < (value || 0) ? 'bg-[#0EA5E9]' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>{review.title} - MeSientoMal.info</title>
        <meta name="description" content={review.experience?.substring(0, 155)} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Button
              variant="ghost"
              className="mb-6 -ml-4"
              onClick={() => navigate(`/pathology/${encodeURIComponent(review.patologia?.Patologia || '')}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Leggi tutte le esperienze su {review.patologia?.Patologia}
            </Button>

            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {review.title}
                </h1>
                <Badge 
                  variant="secondary" 
                  className="mb-2 bg-[#0EA5E9]/10 text-[#0EA5E9] hover:bg-[#0EA5E9]/20 border-0"
                >
                  {review.patologia?.Patologia}
                </Badge>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>{review.author}</span>
                  <span>•</span>
                  <span>{formatDate(review.created_at)}</span>
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Sintomi</h2>
                  <p className="text-gray-600">{review.symptoms}</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Esperienza</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{review.experience}</p>
                </section>

                <div className="space-y-6">
                  <section>
                    <h3 className="font-medium text-gray-900 mb-2">Difficoltà di Diagnosi</h3>
                    {renderRatingBar(review.diagnosis_difficulty)}
                  </section>

                  <section>
                    <h3 className="font-medium text-gray-900 mb-2">Gravità dei Sintomi</h3>
                    {renderRatingBar(review.symptom_severity)}
                  </section>

                  <section>
                    <h3 className="font-medium text-gray-900 mb-2">Possibilità di Guarigione</h3>
                    {renderRatingBar(review.healing_possibility)}
                  </section>

                  <section>
                    <h3 className="font-medium text-gray-900 mb-2">Disagio Sociale</h3>
                    {renderRatingBar(review.social_discomfort)}
                  </section>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Altre esperienze su {review.patologia?.Patologia}
            </h2>
            <div className="space-y-4">
              {relatedReviews?.map((relatedReview) => (
                <ReviewCard
                  key={relatedReview.id}
                  title={relatedReview.title}
                  patologia={relatedReview.patologia?.Patologia || ''}
                  content={relatedReview.experience || ''}
                  author={relatedReview.author || ''}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewDetail;