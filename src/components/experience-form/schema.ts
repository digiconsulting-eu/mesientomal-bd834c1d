import * as z from "zod";

export const formSchema = z.object({
  patologia: z.string().min(1, "Selecciona una patología"),
  title: z.string().max(200, "El título no puede superar los 200 caracteres"),
  symptoms: z.string().min(1, "Ingresa los síntomas"),
  experience: z.string().min(1, "Cuenta tu experiencia"),
  diagnosis_difficulty: z.string().min(1, "Selecciona una dificultad"),
  symptom_severity: z.string().min(1, "Selecciona la severidad"),
  pharmacological_treatment: z.enum(["Si", "No"]),
  healing_possibility: z.string().min(1, "Selecciona una posibilidad"),
  social_discomfort: z.string().min(1, "Selecciona un nivel de incomodidad"),
});

export type FormSchema = z.infer<typeof formSchema>;