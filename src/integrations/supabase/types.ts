export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      invitation_codes: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          is_active: boolean | null
          redeemed_at: string | null
          redeemed_by: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          is_active?: boolean | null
          redeemed_at?: string | null
          redeemed_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          is_active?: boolean | null
          redeemed_at?: string | null
          redeemed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitation_codes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitation_codes_redeemed_by_fkey"
            columns: ["redeemed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          social_media: string | null
          use_case: string | null
          user_id: string | null
          work_email: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          social_media?: string | null
          use_case?: string | null
          user_id?: string | null
          work_email?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          social_media?: string | null
          use_case?: string | null
          user_id?: string | null
          work_email?: string | null
        }
        Relationships: []
      }
      memories: {
        Row: {
          created_at: string
          description: string | null
          emotion: string | null
          id: string
          image_url: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          created_at: string
          description?: string | null
          emotion?: string | null
          id?: string
          image_url?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          emotion?: string | null
          id?: string
          image_url?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          comments_count: number | null
          content: string | null
          created_at: string
          id: string
          likes_count: number | null
          media_type: string | null
          media_url: string | null
          privacy: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number | null
          content?: string | null
          created_at?: string
          id?: string
          likes_count?: number | null
          media_type?: string | null
          media_url?: string | null
          privacy?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number | null
          content?: string | null
          created_at?: string
          id?: string
          likes_count?: number | null
          media_type?: string | null
          media_url?: string | null
          privacy?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      premium_features: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badge: string | null
          bio: string | null
          cover_url: string | null
          created_at: string | null
          display_name: string | null
          email_notifications: boolean | null
          id: string
          invitation_code_created_at: string | null
          invitation_code_used: string | null
          phone_number: string | null
          profile_completed: boolean | null
          sms_notifications: boolean | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          badge?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email_notifications?: boolean | null
          id: string
          invitation_code_created_at?: string | null
          invitation_code_used?: string | null
          phone_number?: string | null
          profile_completed?: boolean | null
          sms_notifications?: boolean | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          badge?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email_notifications?: boolean | null
          id?: string
          invitation_code_created_at?: string | null
          invitation_code_used?: string | null
          phone_number?: string | null
          profile_completed?: boolean | null
          sms_notifications?: boolean | null
          username?: string | null
        }
        Relationships: []
      }
      "public.user_stats": {
        Row: {
          created_at: string
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      smart_notifications: {
        Row: {
          active: boolean | null
          created_at: string
          feature_id: string | null
          id: string
          message: string
          title: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          feature_id?: string | null
          id?: string
          message: string
          title: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          feature_id?: string | null
          id?: string
          message?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "smart_notifications_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "premium_features"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          attachment_urls: string[] | null
          category: string | null
          cost: number | null
          created_at: string
          custom_category: string | null
          expiry_date: string
          id: string
          notes: string | null
          notification_preferences: string[] | null
          notification_timing: string[] | null
          service_icon: string | null
          service_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attachment_urls?: string[] | null
          category?: string | null
          cost?: number | null
          created_at?: string
          custom_category?: string | null
          expiry_date: string
          id?: string
          notes?: string | null
          notification_preferences?: string[] | null
          notification_timing?: string[] | null
          service_icon?: string | null
          service_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attachment_urls?: string[] | null
          category?: string | null
          cost?: number | null
          created_at?: string
          custom_category?: string | null
          expiry_date?: string
          id?: string
          notes?: string | null
          notification_preferences?: string[] | null
          notification_timing?: string[] | null
          service_icon?: string | null
          service_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          dismissed: boolean | null
          id: string
          notification_id: string
          shown_at: string
          user_id: string
        }
        Insert: {
          dismissed?: boolean | null
          id?: string
          notification_id: string
          shown_at?: string
          user_id: string
        }
        Update: {
          dismissed?: boolean | null
          id?: string
          notification_id?: string
          shown_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "smart_notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_premium_access: {
        Row: {
          created_at: string
          daily_usage_count: number | null
          id: string
          is_premium: boolean
          last_usage_date: string | null
          premium_end_date: string | null
          premium_start_date: string | null
          trial_end_date: string | null
          trial_start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_usage_count?: number | null
          id?: string
          is_premium?: boolean
          last_usage_date?: string | null
          premium_end_date?: string | null
          premium_start_date?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_usage_count?: number | null
          id?: string
          is_premium?: boolean
          last_usage_date?: string | null
          premium_end_date?: string | null
          premium_start_date?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_premium: {
        Args: { user_id: string }
        Returns: boolean
      }
      check_subscription_limit: {
        Args: { user_id: string }
        Returns: boolean
      }
      count_user_posts: {
        Args: { user_id: string }
        Returns: {
          count: number
        }[]
      }
      track_premium_usage: {
        Args: { user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
