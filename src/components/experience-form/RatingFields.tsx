import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./schema";

type RatingFieldsProps = {
  form: UseFormReturn<FormSchema>;
};

export function RatingFields({ form }: RatingFieldsProps) {
  const ratingFields = [
    {
      name: "diagnosis_difficulty" as const,
      label: "Difficoltà di Diagnosi *"
    },
    {
      name: "symptom_severity" as const,
      label: "Quanto sono fastidiosi i sintomi? *"
    },
    {
      name: "healing_possibility" as const,
      label: "Possibilità di guarigione *"
    },
    {
      name: "social_discomfort" as const,
      label: "Disagio sociale *"
    }
  ];

  return (
    <>
      {ratingFields.map((field) => (
        <FormField
          key={field.name}
          control={form.control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                  className="flex space-x-4"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <FormItem key={value} className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value={value.toString()} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {value}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </>
  );
}