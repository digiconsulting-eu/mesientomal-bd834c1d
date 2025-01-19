interface PathologyInfoProps {
  patologiaName: string;
}

export const PathologyInfo = ({ patologiaName }: PathologyInfoProps) => {
  return (
    <div className="mt-12 space-y-6 border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-900">{patologiaName}</h2>
      <p className="text-gray-700">
        Descubre la experiencia de quienes padecen {patologiaName} a través de las reseñas y experiencias de otros usuarios.
      </p>
      <p className="text-gray-700">
        En MeSientoMal.info puedes leer las experiencias de usuarios que tienen o han tenido que lidiar con esta patología. 
        Puedes leer sus experiencias, comentarlas o hacer preguntas y descubrir qué síntomas tiene o cómo se está tratando quien padece {patologiaName}. 
        También puedes consultar sobre expertos y tratamientos, preguntando sobre efectos positivos o efectos secundarios y reacciones, 
        teniendo en cuenta que se trata de experiencias individuales y que siempre deberás consultar con tu médico para el diagnóstico y tratamiento.
      </p>
      <p className="text-gray-700">
        Lee las experiencias de los usuarios que padecen {patologiaName} y descubre cómo están.
      </p>
      <p className="text-gray-600 text-sm mt-8">
        Los usuarios escriben reseñas basadas en su experiencia personal y bajo diagnóstico y consejo médico, 
        por lo tanto este sitio NO está destinado a consultas médicas, diagnósticos o tratamientos y NO debe en ningún caso reemplazar 
        una consulta médica, una visita especializada u otro. MeSientoMal.info y DigiConsulting no asumen responsabilidad 
        por la libre interpretación del contenido escrito por otros usuarios. Es necesario contactar a tu médico y/o especialista 
        para el diagnóstico de enfermedades y para la prescripción y administración de medicamentos.
      </p>
    </div>
  );
};