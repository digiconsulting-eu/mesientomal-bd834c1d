import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ExperienceInsert = Database["public"]["Tables"]["experiences"]["Insert"];

const formSchema = z.object({
  title: z.string().max(200, "Il titolo non può superare i 200 caratteri"),
  symptoms: z.string().min(1, "Inserisci i sintomi"),
  experience: z.string().min(1, "Racconta la tua esperienza"),
  diagnosis_difficulty: z.string().min(1, "Seleziona una difficoltà"),
  symptom_severity: z.string().min(1, "Seleziona la severità"),
  pharmacological_treatment: z.enum(["Si", "No"]),
  healing_possibility: z.string().min(1, "Seleziona una possibilità"),
  social_discomfort: z.string().min(1, "Seleziona un livello di disagio"),
});

export function ExperienceForm() {
  const { name } = useParams();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      symptoms: "",
      experience: "",
      diagnosis_difficulty: "",
      symptom_severity: "",
      pharmacological_treatment: "No",
      healing_possibility: "",
      social_discomfort: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const insertData: ExperienceInsert = {
        patologia: name,
        title: values.title,
        symptoms: values.symptoms,
        experience: values.experience,
        diagnosis_difficulty: parseInt(values.diagnosis_difficulty),
        symptom_severity: parseInt(values.symptom_severity),
        healing_possibility: parseInt(values.healing_possibility),
        social_discomfort: parseInt(values.social_discomfort),
        pharmacological_treatment: values.pharmacological_treatment === "Si",
      };

      const { error } = await supabase.from("experiences").insert(insertData);

      if (error) throw error;

      toast({
        title: "Esperienza condivisa",
        description: "Grazie per aver condiviso la tua esperienza!",
      });

      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Si è verificato un errore durante l'invio. Riprova più tardi.",
      });
    }
  }

  const ratingOptions = Array.from({ length: 5 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

        <FormField
          control={form.control}
          name="diagnosis_difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficoltà di Diagnosi *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  {ratingOptions.map((option) => (
                    <FormItem key={option.value} className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value={option.value} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="symptom_severity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quanto sono fastidiosi i sintomi? *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  {ratingOptions.map((option) => (
                    <FormItem key={option.value} className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value={option.value} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="healing_possibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Possibilità di guarigione *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  {ratingOptions.map((option) => (
                    <FormItem key={option.value} className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value={option.value} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="social_discomfort"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disagio sociale *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  {ratingOptions.map((option) => (
                    <FormItem key={option.value} className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value={option.value} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Invia la tua esperienza
        </Button>
      </form>
    </Form>
  );
}