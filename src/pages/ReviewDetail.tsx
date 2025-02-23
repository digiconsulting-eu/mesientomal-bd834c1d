
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import { ReviewHeader } from "@/components/review-detail/ReviewHeader";
import { ReviewContent } from "@/components/review-detail/ReviewContent";
import { ReviewRatings } from "@/components/review-detail/ReviewRatings";
import { PathologyInfo } from "@/components/review-detail/PathologyInfo";
import { RelatedReviews } from "@/components/review-detail/RelatedReviews";

const ReviewDetail = () => {
  const { reviewTitle } = useParams();
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
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{review?.title} - MeSientoMal.info</title>
        <meta name="description" content={review?.experience?.substring(0, 155)} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ReviewHeader
              title={review.title}
              patologia={review.patologia?.Patologia || ''}
              author={review.author || ''}
              createdAt={review.created_at}
            />

            <div className="space-y-8">
              <ReviewContent
                symptoms={review.symptoms || ''}
                experience={review.experience || ''}
              />

              <ReviewRatings
                diagnosisDifficulty={review.diagnosis_difficulty}
                symptomSeverity={review.symptom_severity}
                healingPossibility={review.healing_possibility}
                socialDiscomfort={review.social_discomfort}
              />

              <PathologyInfo patologiaName={review.patologia?.Patologia || ''} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <RelatedReviews
              reviews={relatedReviews || []}
              patologiaName={review.patologia?.Patologia || ''}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewDetail;
