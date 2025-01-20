import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./schema";
import { useState } from "react";
import { PathologyButton } from "./pathology-select/PathologyButton";
import { PathologyCommandItem } from "./pathology-select/PathologyCommandItem";

type PathologySelectProps = {
  form: UseFormReturn<FormSchema>;
};

export function PathologySelect({ form }: PathologySelectProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { data: pathologies = [], isLoading } = useQuery({
    queryKey: ['pathologies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("PATOLOGIE")
        .select("Patologia")
        .order("Patologia");
      
      if (error) throw error;
      console.log("Total number of pathologies:", data?.length);
      return data?.filter(p => p.Patologia != null && p.Patologia.trim() !== '') || [];
    }
  });

  const filteredPathologies = pathologies.filter((pathology) => {
    if (!pathology.Patologia) return false;
    if (!searchValue) return true;
    return pathology.Patologia.toLowerCase().includes(searchValue.toLowerCase());
  });

  return (
    <FormField
      control={form.control}
      name="patologia"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Patología *</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <PathologyButton 
                  value={field.value}
                  open={open}
                  isLoading={isLoading}
                  pathologyName={pathologies.find(
                    (pathology) => pathology.Patologia === field.value
                  )?.Patologia}
                />
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput 
                  placeholder="Buscar patología..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                  className="h-9"
                />
                <CommandEmpty>
                  {isLoading ? "Cargando..." : "No se encontraron patologías."}
                </CommandEmpty>
                <CommandGroup>
                  {!isLoading && filteredPathologies.map((pathology) => (
                    pathology.Patologia && (
                      <PathologyCommandItem
                        key={pathology.Patologia}
                        pathology={pathology}
                        currentValue={field.value}
                        onSelect={(value) => {
                          form.setValue("patologia", value);
                          setSearchValue("");
                          setOpen(false);
                        }}
                      />
                    )
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}