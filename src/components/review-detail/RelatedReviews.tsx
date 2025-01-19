import { ReviewCard } from "@/components/ReviewCard";

interface RelatedReview {
  id: number;
  title: string;
  experience: string | null;
  author: string | null;
  patologia?: {
    Patologia: string;
  };
}

interface RelatedReviewsProps {
  reviews: RelatedReview[];
  patologiaName: string;
}

export const RelatedReviews = ({ reviews, patologiaName }: RelatedReviewsProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Otras experiencias sobre {patologiaName}
      </h2>
      <div className="space-y-4">
        {reviews?.map((review) => (
          <ReviewCard
            key={review.id}
            title={review.title}
            patologia={review.patologia?.Patologia || ''}
            content={review.experience || ''}
            author={review.author || ''}
          />
        ))}
      </div>
    </div>
  );
};