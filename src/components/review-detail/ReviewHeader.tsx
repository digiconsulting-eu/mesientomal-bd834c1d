import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ReviewHeaderProps {
  title: string;
  patologia: string;
  author: string;
  createdAt: string;
}

export const ReviewHeader = ({ title, patologia, author, createdAt }: ReviewHeaderProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <Button
        variant="ghost"
        className="mb-6 -ml-4"
        onClick={() => navigate(`/pathology/${encodeURIComponent(patologia)}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Leer todas las experiencias sobre {patologia}
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <Badge 
          variant="secondary" 
          className="mb-2 bg-[#0EA5E9]/10 text-[#0EA5E9] hover:bg-[#0EA5E9]/20 border-0"
        >
          {patologia}
        </Badge>
        <div className="flex items-center gap-2 text-gray-600">
          <span>{author}</span>
          <span>•</span>
          <span>{formatDate(createdAt)}</span>
        </div>
      </div>
    </div>
  );
};