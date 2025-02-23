
import { Link } from 'react-router-dom';

interface PathologyNavigationProps {
  pathologyName: string;
  onSectionClick: (id: string) => void;
}

export const PathologyNavigation = ({ pathologyName, onSectionClick }: PathologyNavigationProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-sky-50 rounded-lg p-6">
        <h2 
          className="text-xl font-semibold text-sky-500 mb-2 hover:cursor-pointer hover:text-sky-600"
          onClick={() => onSectionClick('description')}
        >
          Resumen
        </h2>
      </div>

      <div className="bg-sky-50 rounded-lg p-6">
        <h2 
          className="text-xl font-semibold text-sky-500 mb-2 hover:cursor-pointer hover:text-sky-600"
          onClick={() => onSectionClick('experiences')}
        >
          Leer Experiencias
        </h2>
      </div>

      <div className="bg-sky-50 rounded-lg p-6">
        <Link to={`/cuenta-tu-experiencia?patologia=${encodeURIComponent(pathologyName)}`}>
          <h2 className="text-xl font-semibold text-sky-500 mb-2 hover:text-sky-600">
            Comparte tu Experiencia
          </h2>
        </Link>
      </div>
    </div>
  );
};
