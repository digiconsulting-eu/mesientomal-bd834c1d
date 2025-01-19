import { Button } from "@/components/ui/button";

type AlphabetFilterProps = {
  selectedLetter: string;
  onLetterSelect: (letter: string) => void;
};

export function AlphabetFilter({ selectedLetter, onLetterSelect }: AlphabetFilterProps) {
  const letters = ["TUTTE", "A", "B", "C", "D", "E", "F", "G", "H", "I", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "Z"];

  return (
    <div className="flex flex-wrap gap-2 my-8">
      {letters.map((letter) => (
        <Button
          key={letter}
          variant={selectedLetter === letter ? "default" : "outline"}
          className={`min-w-12 ${selectedLetter === letter ? "bg-primary hover:bg-primary/90" : ""}`}
          onClick={() => onLetterSelect(letter)}
        >
          {letter}
        </Button>
      ))}
    </div>
  );
}