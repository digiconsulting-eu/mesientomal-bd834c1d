
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight } from "lucide-react";

interface ReviewCardProps {
  title: string;
  patologia: string;
  content: string;
  author: string;
}

export const ReviewCard = ({ title, patologia, content, author }: ReviewCardProps) => {
  const formattedPatologia = patologia.replace(/\s+/g, '-').toLowerCase();
  const formattedTitle = title.replace(/\s+/g, '-').toLowerCase();

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow border-primary">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1 truncate">{title}</h3>
          <p className="text-sm text-gray-500">{author}</p>
        </div>

        <Badge 
          variant="secondary" 
          className="bg-primary/10 text-primary hover:bg-primary/20 border-0"
        >
          {patologia}
        </Badge>

        <p className="text-gray-600 line-clamp-2">{content}</p>

        <a 
          className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-[#0284C7] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          href={`/patologia/${encodeURIComponent(formattedPatologia)}/esperienza/${encodeURIComponent(formattedTitle)}`}
        >
          Leer experiencia completa
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </Card>
  );
}
