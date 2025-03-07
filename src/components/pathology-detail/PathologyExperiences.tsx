
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Review {
  id: number;
  title: string;
  experience: string;
  author_username?: string;
  PATOLOGIE?: {
    Patologia?: string;
  };
}

interface PathologyExperiencesProps {
  reviews: Review[];
}

export const PathologyExperiences = ({ reviews }: PathologyExperiencesProps) => {
  const formatUrl = (text: string) => text.replace(/\s+/g, '-').toLowerCase();

  return (
    <div id="experiences" className="bg-white rounded-lg p-6 border border-sky-500">
      <h2 className="text-xl font-semibold mb-4">Experiencias ({reviews?.length || 0})</h2>
      {!reviews || reviews.length === 0 ? (
        <p className="text-gray-600">Aún no hay experiencias para esta patología.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const patologiaName = review.PATOLOGIE?.Patologia || '';
            const formattedPatologia = formatUrl(patologiaName);
            const formattedTitle = formatUrl(review.title);
            
            return (
              <Link 
                key={review.id} 
                to={`/patologia/${encodeURIComponent(formattedPatologia)}/esperienza/${encodeURIComponent(formattedTitle)}`}
                className="block"
              >
                <div className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2">{review.title}</h3>
                  <div className="flex items-center mb-2">
                    <Badge className="mr-2" variant="secondary">
                      {review.PATOLOGIE?.Patologia?.toUpperCase()}
                    </Badge>
                    {review.author_username && <span className="text-sm text-gray-500">{review.author_username}</span>}
                  </div>
                  <p className="text-gray-700 line-clamp-2">{review.experience}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
