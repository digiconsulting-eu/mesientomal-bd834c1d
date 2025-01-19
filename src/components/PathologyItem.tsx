import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

type PathologyItemProps = {
  name: string;
};

export function PathologyItem({ name }: PathologyItemProps) {
  return (
    <Link to={`/patologia/${encodeURIComponent(name)}`}>
      <Card className="p-4 hover:shadow-md transition-shadow border-primary">
        <h3 className="text-primary font-medium">{name.toUpperCase()}</h3>
      </Card>
    </Link>
  );
}