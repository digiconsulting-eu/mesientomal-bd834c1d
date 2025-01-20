import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type PathologyButtonProps = {
  value: string | undefined;
  open: boolean;
  isLoading: boolean;
  pathologyName?: string;
};

export function PathologyButton({ value, open, isLoading, pathologyName }: PathologyButtonProps) {
  return (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className={cn(
        "w-full justify-between",
        !value && "text-muted-foreground"
      )}
      disabled={isLoading}
    >
      {pathologyName?.toUpperCase() || "Selecciona una patología"}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );
}