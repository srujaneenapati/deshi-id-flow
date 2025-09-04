export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          confession_id: string
          content: string
          created_at: string
          id: string
          is_anonymous: boolean | null
          parent_id: string | null
          user_id: string | null
        }
        Insert: {
          confession_id: string
          content: string
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          parent_id?: string | null
          user_id?: string | null
        }
        Update: {
          confession_id?: string
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          parent_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_confession_id_fkey"
            columns: ["confession_id"]
            isOneToOne: false
            referencedRelation: "confessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          campus: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          member_count: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          campus: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          member_count?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          campus?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          member_count?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      community_members: {
        Row: {
          community_id: string | null
          id: string
          joined_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          community_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          community_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_messages: {
        Row: {
          community_id: string | null
          content: string
          created_at: string | null
          id: string
          media_type: string | null
          media_url: string | null
          user_id: string | null
        }
        Insert: {
          community_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          user_id?: string | null
        }
        Update: {
          community_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_messages_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      confessions: {
        Row: {
          content: string
          created_at: string
          dislikes: number | null
          id: string
          is_anonymous: boolean | null
          is_group_fun: boolean | null
          likes: number | null
          tags: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          dislikes?: number | null
          id?: string
          is_anonymous?: boolean | null
          is_group_fun?: boolean | null
          likes?: number | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          dislikes?: number | null
          id?: string
          is_anonymous?: boolean | null
          is_group_fun?: boolean | null
          likes?: number | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      credit_scores: {
        Row: {
          created_at: string
          factors: Json | null
          id: string
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          factors?: Json | null
          id?: string
          score: number
          user_id: string
        }
        Update: {
          created_at?: string
          factors?: Json | null
          id?: string
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      loan_applications: {
        Row: {
          aadhaar_number: string
          address: string
          ai_score: number | null
          application_number: string
          approved_amount: number | null
          approved_at: string | null
          created_at: string
          disbursed_at: string | null
          emi_amount: number | null
          full_name: string
          id: string
          interest_rate: number | null
          loan_amount: number
          monthly_income: number
          occupation: string
          pan_number: string | null
          phone: string
          purpose: string
          status: string
          tenure_months: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          aadhaar_number: string
          address: string
          ai_score?: number | null
          application_number?: string
          approved_amount?: number | null
          approved_at?: string | null
          created_at?: string
          disbursed_at?: string | null
          emi_amount?: number | null
          full_name: string
          id?: string
          interest_rate?: number | null
          loan_amount: number
          monthly_income: number
          occupation: string
          pan_number?: string | null
          phone: string
          purpose: string
          status?: string
          tenure_months?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          aadhaar_number?: string
          address?: string
          ai_score?: number | null
          application_number?: string
          approved_amount?: number | null
          approved_at?: string | null
          created_at?: string
          disbursed_at?: string | null
          emi_amount?: number | null
          full_name?: string
          id?: string
          interest_rate?: number | null
          loan_amount?: number
          monthly_income?: number
          occupation?: string
          pan_number?: string | null
          phone?: string
          purpose?: string
          status?: string
          tenure_months?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loan_payments: {
        Row: {
          amount: number
          created_at: string
          emi_number: number
          id: string
          loan_id: string
          payment_date: string
          payment_method: string | null
          status: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          emi_number: number
          id?: string
          loan_id: string
          payment_date: string
          payment_method?: string | null
          status?: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          emi_number?: number
          id?: string
          loan_id?: string
          payment_date?: string
          payment_method?: string | null
          status?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_payments_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          application_id: string
          completed_emis: number
          created_at: string
          disbursed_amount: number
          emi_amount: number
          id: string
          interest_rate: number
          loan_number: string
          next_emi_date: string
          outstanding_amount: number
          principal_amount: number
          start_date: string
          status: string
          tenure_months: number
          total_emis: number
          updated_at: string
          user_id: string
        }
        Insert: {
          application_id: string
          completed_emis?: number
          created_at?: string
          disbursed_amount: number
          emi_amount: number
          id?: string
          interest_rate: number
          loan_number?: string
          next_emi_date: string
          outstanding_amount: number
          principal_amount: number
          start_date: string
          status?: string
          tenure_months: number
          total_emis: number
          updated_at?: string
          user_id: string
        }
        Update: {
          application_id?: string
          completed_emis?: number
          created_at?: string
          disbursed_amount?: number
          emi_amount?: number
          id?: string
          interest_rate?: number
          loan_number?: string
          next_emi_date?: string
          outstanding_amount?: number
          principal_amount?: number
          start_date?: string
          status?: string
          tenure_months?: number
          total_emis?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loans_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          confidence: number | null
          content: string
          created_at: string | null
          id: string
          intent: string | null
          role: string
          session_id: string
        }
        Insert: {
          confidence?: number | null
          content: string
          created_at?: string | null
          id?: string
          intent?: string | null
          role: string
          session_id: string
        }
        Update: {
          confidence?: number | null
          content?: string
          created_at?: string | null
          id?: string
          intent?: string | null
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      private_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          media_type: string | null
          media_url: string | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          media_type?: string | null
          media_url?: string | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          media_type?: string | null
          media_url?: string | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badges: string[] | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          comment_id: string | null
          confession_id: string | null
          created_at: string
          description: string | null
          id: string
          reason: string
          reporter_id: string | null
          status: string | null
        }
        Insert: {
          comment_id?: string | null
          confession_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          reason: string
          reporter_id?: string | null
          status?: string | null
        }
        Update: {
          comment_id?: string | null
          confession_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          reason?: string
          reporter_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_confession_id_fkey"
            columns: ["confession_id"]
            isOneToOne: false
            referencedRelation: "confessions"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          anonymous_name: string
          campus: string
          created_at: string | null
          email: string
          id: string
          updated_at: string | null
        }
        Insert: {
          anonymous_name: string
          campus?: string
          created_at?: string | null
          email: string
          id: string
          updated_at?: string | null
        }
        Update: {
          anonymous_name?: string
          campus?: string
          created_at?: string | null
          email?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          comment_id: string | null
          confession_id: string | null
          created_at: string
          id: string
          session_id: string | null
          user_id: string | null
          vote_type: string | null
        }
        Insert: {
          comment_id?: string | null
          confession_id?: string | null
          created_at?: string
          id?: string
          session_id?: string | null
          user_id?: string | null
          vote_type?: string | null
        }
        Update: {
          comment_id?: string | null
          confession_id?: string | null
          created_at?: string
          id?: string
          session_id?: string | null
          user_id?: string | null
          vote_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_confession_id_fkey"
            columns: ["confession_id"]
            isOneToOne: false
            referencedRelation: "confessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
