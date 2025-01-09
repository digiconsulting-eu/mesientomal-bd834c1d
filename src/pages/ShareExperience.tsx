import { ExperienceForm } from "@/components/ExperienceForm";

const ShareExperience = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">Racconta la tua Esperienza</h1>
        <ExperienceForm />
      </div>
    </div>
  );
};

export default ShareExperience;