
import { Button } from "@/components/ui/button";

interface PathologyDescriptionProps {
  name: string;
  description: string;
}

export const PathologyDescription = ({ name, description }: PathologyDescriptionProps) => {
  return (
    <div id="description" className="bg-white rounded-lg p-6 border border-sky-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">¿Qué es {name?.toUpperCase()}?</h2>
        <Button variant="ghost" size="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
        </Button>
      </div>
      <p className="text-gray-700">
        {description || 'Descripción no disponible.'}
      </p>
    </div>
  );
};
