import { ReviewCard } from "@/components/ReviewCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Index = () => {
  const reviews = [
    {
      title: "dolor de espalda",
      author: "Anónimo1027",
      tag: "ESTENOSIS LUMBAR",
      content: "dolor de espalda"
    },
    {
      title: "fuerte dolor en el ovario después de la operación",
      author: "Anónimo1024",
      tag: "FIBROTECOMA OVÁRICO",
      content: "en 2011 me extirparon un fibrotecoma ovárico de 4 cm, quitándome el 60% del ovario. Si antes de operarme tenía..."
    },
    {
      title: "La dificultad de vivir con dolor articular",
      author: "Anónimo745",
      tag: "ENTESITE",
      content: "El dolor articular causado por la entesitis ha sido insoportable. La hinchazón y la rigidez me hacían..."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Comparte tu experiencia</h1>
        <p className="text-xl text-gray-600">Ayuda a otros pacientes compartiendo tu historia</p>
        
        <div className="max-w-2xl mx-auto mt-8 flex gap-2">
          <Input 
            placeholder="Buscar una patología..." 
            className="h-12"
          />
          <Button size="lg">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reseñas destacadas</h2>
        <Button variant="link">Ver todas las reseñas</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>
    </div>
  );
};

export default Index;