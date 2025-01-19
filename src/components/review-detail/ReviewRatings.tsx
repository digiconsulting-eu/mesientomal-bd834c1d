interface ReviewRatingsProps {
  diagnosisDifficulty: number | null;
  symptomSeverity: number | null;
  healingPossibility: number | null;
  socialDiscomfort: number | null;
}

export const ReviewRatings = ({ 
  diagnosisDifficulty,
  symptomSeverity,
  healingPossibility,
  socialDiscomfort 
}: ReviewRatingsProps) => {
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
    <div className="space-y-6">
      <section>
        <h3 className="font-medium text-gray-900 mb-2">Dificultad de Diagnóstico</h3>
        {renderRatingBar(diagnosisDifficulty)}
      </section>

      <section>
        <h3 className="font-medium text-gray-900 mb-2">Gravedad de los Síntomas</h3>
        {renderRatingBar(symptomSeverity)}
      </section>

      <section>
        <h3 className="font-medium text-gray-900 mb-2">Posibilidad de Curación</h3>
        {renderRatingBar(healingPossibility)}
      </section>

      <section>
        <h3 className="font-medium text-gray-900 mb-2">Malestar Social</h3>
        {renderRatingBar(socialDiscomfort)}
      </section>
    </div>
  );
};