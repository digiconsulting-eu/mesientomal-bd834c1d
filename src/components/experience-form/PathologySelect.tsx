import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./schema";

type PathologySelectProps = {
  form: UseFormReturn<FormSchema>;
};

export function PathologySelect({ form }: PathologySelectProps) {
  const { data: pathologies } = useQuery({
    queryKey: ["pathologies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("PATOLOGIE")
        .select("Patologia")
        .order("Patologia");
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <FormField
      control={form.control}
      name="patologia"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Patología *</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una patología" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {pathologies?.map((pathology) => (
                pathology.Patologia && (
                  <SelectItem key={pathology.Patologia} value={pathology.Patologia}>
                    {pathology.Patologia}
                  </SelectItem>
                )
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}