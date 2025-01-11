import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const PathologySearch = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">Buscar Patologías</h1>
        
        <div className="flex gap-2 mb-8">
          <Input 
            placeholder="Buscar una patología..." 
            className="h-12"
          />
          <Button size="lg">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        <Card className="p-6">
          <p className="text-center text-gray-500">
            Lista de patologías en construcción...
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PathologySearch;