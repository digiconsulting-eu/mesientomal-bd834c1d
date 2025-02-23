
import { Badge } from "@/components/ui/badge";

interface PathologyStatsProps {
  averages: {
    diagnosisDifficulty: number;
    symptomSeverity: number;
    healingPossibility: number;
    socialDiscomfort: number;
  };
}

export const PathologyStats = ({ averages }: PathologyStatsProps) => {
  const getLevelBadge = (value: number) => {
    if (value >= 4) return "Alto";
    if (value >= 2) return "Medio";
    return "Bajo";
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-sky-500">
      <h2 className="text-xl font-semibold mb-6">Estadísticas</h2>
      
      <div className="space-y-6">
        <div>
          <p className="text-gray-600 mb-2">Dificultad de Diagnóstico</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{averages?.diagnosisDifficulty || '0.0'}</span>
            <Badge variant="secondary">{getLevelBadge(averages?.diagnosisDifficulty || 0)}</Badge>
          </div>
        </div>

        <div>
          <p className="text-gray-600 mb-2">Gravedad de los Síntomas</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{averages?.symptomSeverity || '0.0'}</span>
            <Badge variant="secondary">{getLevelBadge(averages?.symptomSeverity || 0)}</Badge>
          </div>
        </div>

        <div>
          <p className="text-gray-600 mb-2">Eficacia del Tratamiento</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{averages?.healingPossibility || '0.0'}</span>
            <Badge variant="secondary">{getLevelBadge(averages?.healingPossibility || 0)}</Badge>
          </div>
        </div>

        <div>
          <p className="text-gray-600 mb-2">Posibilidad de Curación</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{averages?.healingPossibility || '0.0'}</span>
            <Badge variant="secondary">{getLevelBadge(averages?.healingPossibility || 0)}</Badge>
          </div>
        </div>

        <div>
          <p className="text-gray-600 mb-2">Malestar Social</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{averages?.socialDiscomfort || '0.0'}</span>
            <Badge variant="secondary">{getLevelBadge(averages?.socialDiscomfort || 0)}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
