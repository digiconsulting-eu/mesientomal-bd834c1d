export interface PatologieTable {
  Row: {
    Descrizione: string | null
    id: number
    Patologia: string | null
  }
  Insert: {
    Descrizione?: string | null
    id?: number
    Patologia?: string | null
  }
  Update: {
    Descrizione?: string | null
    id?: number
    Patologia?: string | null
  }
  Relationships: []
}