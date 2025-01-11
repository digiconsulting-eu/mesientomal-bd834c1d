import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

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
          <Badge variant="secondary" className="bg-[#33A9E0]/10 text-[#33A9E0] hover:bg-[#33A9E0]/20">
            {tag}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 line-clamp-3">{content}</p>
        <button className="mt-4 text-[#33A9E0] hover:underline">Leer</button>
      </CardContent>
    </Card>
  );
};