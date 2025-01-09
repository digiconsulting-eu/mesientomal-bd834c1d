import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./schema";

type BasicInfoProps = {
  form: UseFormReturn<FormSchema>;
};

export function BasicInfo({ form }: BasicInfoProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título *</FormLabel>
            <FormControl>
              <Input placeholder="Ingresa un título (máx. 200 caracteres)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="symptoms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué síntomas has tenido? *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe los síntomas que has tenido..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cuenta tu experiencia *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="¿Qué tratamientos has hecho o estás haciendo? ¿Has logrado curarte?"
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}