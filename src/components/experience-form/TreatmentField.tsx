import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./schema";

type TreatmentFieldProps = {
  form: UseFormReturn<FormSchema>;
};

export function TreatmentField({ form }: TreatmentFieldProps) {
  return (
    <FormField
      control={form.control}
      name="pharmacological_treatment"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Hai fatto o stai facendo una cura farmacologica? *</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex space-x-4"
            >
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="Si" />
                </FormControl>
                <FormLabel className="font-normal">Si</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="No" />
                </FormControl>
                <FormLabel className="font-normal">No</FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}