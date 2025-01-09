import * as z from "zod";

export const formSchema = z.object({
  patologia: z.string().min(1, "Seleziona una patologia"),
  title: z.string().max(200, "Il titolo non può superare i 200 caratteri"),
  symptoms: z.string().min(1, "Inserisci i sintomi"),
  experience: z.string().min(1, "Racconta la tua esperienza"),
  diagnosis_difficulty: z.string().min(1, "Seleziona una difficoltà"),
  symptom_severity: z.string().min(1, "Seleziona la severità"),
  pharmacological_treatment: z.enum(["Si", "No"]),
  healing_possibility: z.string().min(1, "Seleziona una possibilità"),
  social_discomfort: z.string().min(1, "Seleziona un livello di disagio"),
});

export type FormSchema = z.infer<typeof formSchema>;