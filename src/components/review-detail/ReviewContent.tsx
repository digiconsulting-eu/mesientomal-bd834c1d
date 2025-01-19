interface ReviewContentProps {
  symptoms: string;
  experience: string;
}

export const ReviewContent = ({ symptoms, experience }: ReviewContentProps) => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Síntomas</h2>
        <p className="text-gray-600">{symptoms}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Experiencia</h2>
        <p className="text-gray-600 whitespace-pre-wrap">{experience}</p>
      </section>
    </div>
  );
};