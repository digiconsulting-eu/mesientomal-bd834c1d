export interface ReviewsTable {
  Row: {
    created_at: string
    diagnosis_difficulty: number | null
    experience: string | null
    healing_possibility: number | null
    id: number
    patologia: string | null
    pharmacological_treatment: boolean | null
    social_discomfort: number | null
    symptom_severity: number | null
    symptoms: string | null
    title: string
  }
  Insert: {
    created_at?: string
    diagnosis_difficulty?: number | null
    experience?: string | null
    healing_possibility?: number | null
    id?: number
    patologia?: string | null
    pharmacological_treatment?: boolean | null
    social_discomfort?: number | null
    symptom_severity?: number | null
    symptoms?: string | null
    title: string
  }
  Update: {
    created_at?: string
    diagnosis_difficulty?: number | null
    experience?: string | null
    healing_possibility?: number | null
    id?: number
    patologia?: string | null
    pharmacological_treatment?: boolean | null
    social_discomfort?: number | null
    symptom_severity?: number | null
    symptoms?: string | null
    title?: string
  }
  Relationships: [
    {
      foreignKeyName: "reviews_patologia_fkey"
      columns: ["patologia"]
      isOneToOne: false
      referencedRelation: "PATOLOGIE"
      referencedColumns: ["Patologia"]
    }
  ]
}