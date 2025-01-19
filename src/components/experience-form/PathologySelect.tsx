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
  const [searchValue, setSearchValue] = useState("");

  const { data: pathologies = [] } = useQuery({
    queryKey: ['pathologies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("PATOLOGIE")
        .select("Patologia")
        .order("Patologia");
      
      if (error) throw error;
      return data?.filter(p => p.Patologia != null) || [];
    },
    initialData: []
  });

  const filteredPathologies = searchValue === "" 
    ? pathologies 
    : pathologies.filter(
        (pathology) => pathology.Patologia?.toLowerCase().includes(searchValue.toLowerCase())
      );

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
            <PopoverContent 
              className="w-[var(--radix-popover-trigger-width)] p-0" 
              align="start"
              side="bottom"
            >
              <Command shouldFilter={false}>
                <CommandInput 
                  placeholder="Buscar patología..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                {filteredPathologies.length === 0 ? (
                  <CommandEmpty>No se encontraron patologías.</CommandEmpty>
                ) : (
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {filteredPathologies.map((pathology) => (
                      <CommandItem
                        key={pathology.Patologia}
                        value={pathology.Patologia || ""}
                        onSelect={() => {
                          form.setValue("patologia", pathology.Patologia || "");
                          setOpen(false);
                          setSearchValue("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === pathology.Patologia 
                              ? "opacity-100" 
                              : "opacity-0"
                          )}
                        />
                        {pathology.Patologia}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}