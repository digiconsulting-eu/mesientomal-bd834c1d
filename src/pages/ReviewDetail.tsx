import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Review = Tables<"reviews">;

const ReviewDetail = () => {
  const { id } = useParams();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      if (!id) return;
      
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        console.error("Invalid review ID");
        return;
      }
      
      const { data, error } = await supabase
        .from("reviews")
        .select("*, PATOLOGIE(Patologia)")
        .eq("id", numericId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching review:", error);
        return;
      }

      setReview(data);
      setLoading(false);
    };

    fetchReview();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Reseña no encontrada</p>
      </div>
    );
  }

  const renderRatingSection = (label: string, value: number | null) => {
    if (value === null) return null;
    
    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{label}</h3>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`w-5 h-5 ${
                index < value
                  ? "fill-[#3B9EE3] text-[#3B9EE3]"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">{review.title}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
            <Badge variant="secondary" className="bg-[#3B9EE3]/10 text-[#3B9EE3] hover:bg-[#3B9EE3]/20 border-0">
              {review.patologia}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {review.symptoms && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Síntomas</h3>
              <p className="text-gray-700">{review.symptoms}</p>
            </div>
          )}

          {review.experience && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Experiencia</h3>
              <p className="text-gray-700 whitespace-pre-line">{review.experience}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {renderRatingSection("Dificultad de diagnóstico", review.diagnosis_difficulty)}
              {renderRatingSection("Severidad de síntomas", review.symptom_severity)}
              {renderRatingSection("Posibilidad de curación", review.healing_possibility)}
            </div>
            <div>
              {renderRatingSection("Malestar social", review.social_discomfort)}
              {review.pharmacological_treatment !== null && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Tratamiento farmacológico</h3>
                  <div className="flex items-center gap-2">
                    {review.pharmacological_treatment ? (
                      <ThumbsUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <ThumbsDown className="w-5 h-5 text-red-500" />
                    )}
                    <span>
                      {review.pharmacological_treatment ? "Sí" : "No"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewDetail;