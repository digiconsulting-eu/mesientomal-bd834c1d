import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const PathologyDetail = () => {
  const { name } = useParams();
  
  return (
    <>
      <Helmet>
        <title>{name} - Información y Experiencias | MeSientoMal.info</title>
        <meta name="description" content={`Información detallada y experiencias de pacientes sobre ${name}. Conoce síntomas, tratamientos y testimonios reales.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{name}</h1>
          
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Descripción</h2>
            <p className="text-gray-700">
              Información detallada sobre la patología estará disponible pronto.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Experiencias de pacientes</h2>
            <p className="text-gray-700">
              No hay experiencias compartidas todavía para esta patología.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PathologyDetail;