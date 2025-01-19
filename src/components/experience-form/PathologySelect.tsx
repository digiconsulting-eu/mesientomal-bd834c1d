import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./schema";
import { useState } from "react";

type PathologySelectProps = {
  form: UseFormReturn<FormSchema>;
};

export function PathologySelect({ form }: PathologySelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: pathologies, isLoading } = useQuery({
    queryKey: ['pathologies', searchTerm],
    queryFn: async () => {
      const query = supabase
        .from("PATOLOGIE")
        .select("Patologia")
        .order("Patologia");
      
      if (searchTerm) {
        query.ilike('Patologia', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    initialData: [] // Ensure we always have an array
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
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  {field.value
                    ? pathologies.find(
                        (pathology) => pathology.Patologia === field.value
                      )?.Patologia
                    : "Selecciona una patología"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            {open && ( // Only render content when popover is open
              <PopoverContent className="w-full p-0" align="start">
                <Command shouldFilter={false}> {/* Disable internal filtering */}
                  <CommandInput 
                    placeholder="Buscar patología..." 
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  <CommandEmpty>No se encontraron patologías.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-auto">
                    {pathologies.map((pathology) => (
                      <CommandItem
                        key={pathology.Patologia}
                        value={pathology.Patologia}
                        onSelect={() => {
                          form.setValue("patologia", pathology.Patologia);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === pathology.Patologia ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {pathology.Patologia}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            )}
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}