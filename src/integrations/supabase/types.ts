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
      budgeting: {
        Row: {
          amount: number
          category: string
          created_at: string
          delete_at: string | null
          id: string
          notes: string | null
          period: string | null
          spent: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          delete_at?: string | null
          id?: string
          notes?: string | null
          period?: string | null
          spent?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          delete_at?: string | null
          id?: string
          notes?: string | null
          period?: string | null
          spent?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgeting_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      categories: {
        Row: {
          category_id: string
          created_at: string
          deleted_at: string | null
          name: string
          updated_at: string
        }
        Insert: {
          category_id?: string
          created_at?: string
          deleted_at?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          deleted_at?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          content: string
          created_at: string
          deleted_at: string | null
          education_id: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          deleted_at?: string | null
          education_id?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          deleted_at?: string | null
          education_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      game: {
        Row: {
          created_at: string
          deleted_at: string | null
          game_id: string
          game_name: string
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          game_id?: string
          game_name: string
          score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          game_id?: string
          game_name?: string
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      income: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          id: string
          notes: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      leaderboard: {
        Row: {
          created_at: string
          deleted_at: string | null
          leaderboard_id: string
          rank: number | null
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          leaderboard_id?: string
          rank?: number | null
          score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          leaderboard_id?: string
          rank?: number | null
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          name: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id: string
          name?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reward: {
        Row: {
          created_at: string
          description: string | null
          points_required: number
          reward_id: string
          reward_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          points_required: number
          reward_id?: string
          reward_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          points_required?: number
          reward_id?: string
          reward_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      rewards: {
        Row: {
          created_at: string
          deleted_at: string | null
          points_required: number
          redeemed: boolean
          reward_id: string
          reward_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          points_required: number
          redeemed?: boolean
          reward_id?: string
          reward_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          points_required?: number
          redeemed?: boolean
          reward_id?: string
          reward_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      saving_goals: {
        Row: {
          created_at: string
          current_amount: number
          deadline: string | null
          deleted_at: string | null
          goal_id: string
          goal_name: string
          target_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_amount?: number
          deadline?: string | null
          deleted_at?: string | null
          goal_id?: string
          goal_name: string
          target_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          deadline?: string | null
          deleted_at?: string | null
          goal_id?: string
          goal_name?: string
          target_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saving_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      saving_goals_history: {
        Row: {
          amount_added: number
          created_at: string
          goal_id: string
          history_id: string
          new_amount: number
          notes: string | null
          previous_amount: number
          user_id: string
        }
        Insert: {
          amount_added: number
          created_at?: string
          goal_id: string
          history_id?: string
          new_amount: number
          notes?: string | null
          previous_amount: number
          user_id: string
        }
        Update: {
          amount_added?: number
          created_at?: string
          goal_id?: string
          history_id?: string
          new_amount?: number
          notes?: string | null
          previous_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saving_goals_history_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "saving_goals"
            referencedColumns: ["goal_id"]
          },
        ]
      }
      spending_tracker: {
        Row: {
          amount: number
          budget_id: string | null
          created_at: string
          date: string
          deleted_at: string | null
          description: string
          id: string
          income: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          budget_id?: string | null
          created_at?: string
          date?: string
          deleted_at?: string | null
          description: string
          id?: string
          income?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          budget_id?: string | null
          created_at?: string
          date?: string
          deleted_at?: string | null
          description?: string
          id?: string
          income?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spending_tracker_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgeting"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spending_tracker_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      transactions: {
        Row: {
          ai_processed: boolean | null
          amount: number
          category_id: string | null
          created_at: string
          date: string
          deleted_at: string | null
          method: string
          name: string
          notes: string | null
          photo_url: string | null
          transaction_id: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_processed?: boolean | null
          amount: number
          category_id?: string | null
          created_at?: string
          date?: string
          deleted_at?: string | null
          method: string
          name: string
          notes?: string | null
          photo_url?: string | null
          transaction_id?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_processed?: boolean | null
          amount?: number
          category_id?: string | null
          created_at?: string
          date?: string
          deleted_at?: string | null
          method?: string
          name?: string
          notes?: string | null
          photo_url?: string | null
          transaction_id?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          deleted_at: string | null
          email: string
          password: string
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          email: string
          password: string
          updated_at?: string
          user_id?: string
          username: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          email?: string
          password?: string
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      budgeting_period: "weekly" | "monthly"
      category_type: "spending" | "budgeting"
      edu_type: "video" | "quiz" | "daily_tips"
      game_status: "ongoing" | "completed"
      role_type: "admin" | "user"
      saving_status: "ongoing" | "achieved"
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
    Enums: {
      budgeting_period: ["weekly", "monthly"],
      category_type: ["spending", "budgeting"],
      edu_type: ["video", "quiz", "daily_tips"],
      game_status: ["ongoing", "completed"],
      role_type: ["admin", "user"],
      saving_status: ["ongoing", "achieved"],
    },
  },
} as const
