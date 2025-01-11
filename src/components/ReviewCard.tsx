import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface ReviewCardProps {
  title: string;
  author: string;
  tag: string;
  content: string;
}

export const ReviewCard = ({ title, author, tag, content }: ReviewCardProps) => {
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
        <p className="text-gray-600 line-clamp-3">{content}</p>
        <Button 
          variant="ghost" 
          className="mt-4 text-[#3B9EE3] hover:text-[#3B9EE3] hover:bg-[#3B9EE3]/10"
        >
          Leer
        </Button>
      </CardContent>
    </Card>
  );
};