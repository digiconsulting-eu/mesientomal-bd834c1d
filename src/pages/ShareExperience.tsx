
import { ExperienceForm } from "@/components/ExperienceForm";
import { Helmet } from 'react-helmet-async';

const ShareExperience = () => {
  return (
    <>
      <Helmet>
        <title>Compartir Experiencia - MeSientoMal.info</title>
        <meta name="description" content="Comparte tu experiencia médica para ayudar a otros pacientes. Tu historia puede hacer la diferencia." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto border border-primary rounded-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Cuenta tu Experiencia</h1>
          <ExperienceForm />
        </div>
      </div>
    </>
  );
};

export default ShareExperience;
