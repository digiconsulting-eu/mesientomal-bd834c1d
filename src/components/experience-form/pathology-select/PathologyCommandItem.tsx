import { Check } from "lucide-react";
import { CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

type PathologyCommandItemProps = {
  pathology: { Patologia: string };
  currentValue: string;
  onSelect: (value: string) => void;
};

export function PathologyCommandItem({ pathology, currentValue, onSelect }: PathologyCommandItemProps) {
  return (
    <CommandItem
      key={pathology.Patologia}
      value={pathology.Patologia}
      onSelect={() => onSelect(pathology.Patologia)}
    >
      <Check
        className={cn(
          "mr-2 h-4 w-4",
          currentValue === pathology.Patologia 
            ? "opacity-100"
            : "opacity-0"
        )}
      />
      {pathology.Patologia.toUpperCase()}
    </CommandItem>
  );
}