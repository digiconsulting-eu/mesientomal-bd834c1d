import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { PathologySelect } from "./experience-form/PathologySelect";
import { BasicInfo } from "./experience-form/BasicInfo";
import { RatingFields } from "./experience-form/RatingFields";
import { TreatmentField } from "./experience-form/TreatmentField";
import { formSchema, type FormSchema } from "./experience-form/schema";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];

export function ExperienceForm() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const preselectedPathology = searchParams.get("patologia");

  // Get current user's username
  const { data: userData } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");
      
      const { data: profile } = await supabase
        .from("users")
        .select("username")
        .eq("id", user.id)
        .single();
      
      return profile;
    }
  });
  
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patologia: preselectedPathology || "",
      title: "",
      symptoms: "",
      experience: "",
      diagnosis_difficulty: "3",
      symptom_severity: "3",
      pharmacological_treatment: "No",
      healing_possibility: "3",
      social_discomfort: "3",
    },
  });

  async function onSubmit(values: FormSchema) {
    try {
      if (!userData?.username) {
        throw new Error("User not authenticated");
      }

      // First get the patologia ID
      const { data: pathologyData } = await supabase
        .from("PATOLOGIE")
        .select("id")
        .eq("Patologia", values.patologia)
        .single();

      if (!pathologyData) {
        throw new Error("Patología no encontrada");
      }

      const insertData: ReviewInsert = {
        patologia_id: pathologyData.id,
        author_username: userData.username,
        title: values.title,
        symptoms: values.symptoms,
        experience: values.experience,
        diagnosis_difficulty: parseInt(values.diagnosis_difficulty),
        symptom_severity: parseInt(values.symptom_severity),
        healing_possibility: parseInt(values.healing_possibility),
        social_discomfort: parseInt(values.social_discomfort),
        pharmacological_treatment: values.pharmacological_treatment === "Si",
      };

      const { error } = await supabase.from("reviews").insert(insertData);

      if (error) throw error;

      toast({
        title: "Experiencia compartida",
        description: "¡Gracias por compartir tu experiencia!",
      });

      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al enviar. Por favor, inténtalo más tarde.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PathologySelect form={form} />
        <BasicInfo form={form} />
        <RatingFields form={form} />
        <TreatmentField form={form} />
        
        <Button type="submit" className="w-full">
          Envía tu experiencia
        </Button>
      </form>
    </Form>
  );
}