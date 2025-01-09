import { ReviewCard } from "@/components/ReviewCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Index = () => {
  const reviews = [
    {
      title: "mal di schiena",
      author: "Anonimo1027",
      tag: "STENOSI LOMBARE",
      content: "mal di schiena"
    },
    {
      title: "forte dolore all'ovaio dopo l'operazione",
      author: "Anonimo1024",
      tag: "FIBROTECOMA OVARICO",
      content: "nel 2011 mi hanno tolto un fibrotecoma ovarico di 4 cm, togliendomi il 60% dell'ovaio. Se prima di operarmi avevo..."
    },
    {
      title: "La difficoltà di vivere con il dolore articolare",
      author: "Anonimo745",
      tag: "ENTESITE",
      content: "Il dolore articolare causato dall'entesite è stato insopportabile. Il gonfiore e la rigidità mi rendevano..."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Condividi la tua esperienza</h1>
        <p className="text-xl text-gray-600">Aiuta altri pazienti condividendo la tua storia</p>
        
        <div className="max-w-2xl mx-auto mt-8 flex gap-2">
          <Input 
            placeholder="Cerca una patologia..." 
            className="h-12"
          />
          <Button size="lg">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Recensioni in evidenza</h2>
        <Button variant="link">Mostra tutte le recensioni</Button>
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