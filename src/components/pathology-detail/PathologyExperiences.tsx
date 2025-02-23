
import { Badge } from "@/components/ui/badge";

interface Review {
  id: number;
  title: string;
  experience: string;
  PATOLOGIE?: {
    Patologia?: string;
  };
}

interface PathologyExperiencesProps {
  reviews: Review[];
}

export const PathologyExperiences = ({ reviews }: PathologyExperiencesProps) => {
  return (
    <div id="experiences" className="bg-white rounded-lg p-6 border border-sky-500">
      <h2 className="text-xl font-semibold mb-4">Experiencias ({reviews?.length || 0})</h2>
      {reviews?.length === 0 ? (
        <p className="text-gray-600">Aún no hay experiencias para esta patología.</p>
      ) : (
        <div className="space-y-4">
          {reviews?.map((review) => (
            <div key={review.id} className="p-4 bg-white rounded-lg border">
              <h3 className="font-semibold mb-2">{review.title}</h3>
              <Badge className="mb-2" variant="secondary">
                {review.PATOLOGIE?.Patologia?.toUpperCase()}
              </Badge>
              <p className="text-gray-700">{review.experience}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
