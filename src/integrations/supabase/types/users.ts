export interface UsersTable {
  Row: {
    id: string
    birth_year: number | null
    gender: string | null
    created_at: string
    updated_at: string
  }
  Insert: {
    id: string
    birth_year?: number | null
    gender?: string | null
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    birth_year?: number | null
    gender?: string | null
    created_at?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "users_id_fkey"
      columns: ["id"]
      isOneToOne: true
      referencedRelation: "users"
      referencedColumns: ["id"]
    }
  ]
}