import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface ReviewCardProps {
  id: number;
  title: string;
  author: string;
  tag: string;
  content: string;
}

export const ReviewCard = ({ id, title, author, tag, content }: ReviewCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{author}</p>
          </div>
          <Badge variant="secondary" className="bg-[#3B9EE3]/10 text-[#3B9EE3] hover:bg-[#3B9EE3]/20 border-0">
            {tag}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end">
          <p className="text-gray-600 line-clamp-3 flex-1 mr-4">{content}</p>
          <Link to={`/review/${id}`}>
            <Button 
              variant="default"
              className="bg-[#3B9EE3] text-white hover:bg-[#3B9EE3]/90 shrink-0"
            >
              Leer
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};