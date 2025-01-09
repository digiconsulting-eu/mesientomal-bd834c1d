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
            <FormLabel>Titolo *</FormLabel>
            <FormControl>
              <Input placeholder="Inserisci un titolo (max 200 caratteri)" {...field} />
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
            <FormLabel>Quali sintomi hai avuto? *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descrivi i sintomi che hai avuto..."
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
            <FormLabel>Racconta la tua esperienza *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Quali cure hai fatto o stai facendo? Sei riuscito a guarire?"
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