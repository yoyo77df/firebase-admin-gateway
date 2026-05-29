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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          game: string | null
          id: string
          image_url: string | null
          placement: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          game?: string | null
          id?: string
          image_url?: string | null
          placement?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          game?: string | null
          id?: string
          image_url?: string | null
          placement?: string | null
          title?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          category: string | null
          created_at: string
          id: string
          image_url: string
          sort_order: number
          title: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number
          title?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
          title?: string | null
        }
        Relationships: []
      }
      highlights: {
        Row: {
          created_at: string
          description: string | null
          id: string
          published_at: string
          title: string
          youtube_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          published_at?: string
          title: string
          youtube_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          published_at?: string
          title?: string
          youtube_id?: string
        }
        Relationships: []
      }
      management: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          name: string
          role: string
          socials: Json | null
          sort_order: number
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name: string
          role: string
          socials?: Json | null
          sort_order?: number
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          role?: string
          socials?: Json | null
          sort_order?: number
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string
          game: string | null
          id: string
          scheduled_at: string
          score_a: number | null
          score_b: number | null
          stage_label: string | null
          status: string
          stream_url: string | null
          team_a: string
          team_b: string | null
          tournament: string | null
          vod_url: string | null
        }
        Insert: {
          created_at?: string
          game?: string | null
          id?: string
          scheduled_at: string
          score_a?: number | null
          score_b?: number | null
          stage_label?: string | null
          status?: string
          stream_url?: string | null
          team_a: string
          team_b?: string | null
          tournament?: string | null
          vod_url?: string | null
        }
        Update: {
          created_at?: string
          game?: string | null
          id?: string
          scheduled_at?: string
          score_a?: number | null
          score_b?: number | null
          stage_label?: string | null
          status?: string
          stream_url?: string | null
          team_a?: string
          team_b?: string | null
          tournament?: string | null
          vod_url?: string | null
        }
        Relationships: []
      }
      news_posts: {
        Row: {
          author: string | null
          content: string
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean
          published_at: string
          slug: string
          title: string
        }
        Insert: {
          author?: string | null
          content: string
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string
          slug: string
          title: string
        }
        Update: {
          author?: string | null
          content?: string
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string
          slug?: string
          title?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          active: boolean
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          country: string | null
          created_at: string
          game: string | null
          id: string
          ign: string
          name: string
          role: string | null
          slug: string
          socials: Json | null
          sort_order: number
          stats: Json | null
          stats_text: string | null
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          game?: string | null
          id?: string
          ign: string
          name: string
          role?: string | null
          slug: string
          socials?: Json | null
          sort_order?: number
          stats?: Json | null
          stats_text?: string | null
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          game?: string | null
          id?: string
          ign?: string
          name?: string
          role?: string | null
          slug?: string
          socials?: Json | null
          sort_order?: number
          stats?: Json | null
          stats_text?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          dashboard_bg_url: string | null
          hero_bg_url: string | null
          hero_cta_label: string
          hero_cta_url: string
          hero_subtitle: string
          key: string
          logo_url: string | null
          next_match_at: string | null
          next_match_team_a: string | null
          next_match_team_b: string | null
          next_match_tournament: string | null
          site_title: string
          tagline: string
          theme_accent: string
          updated_at: string
        }
        Insert: {
          dashboard_bg_url?: string | null
          hero_bg_url?: string | null
          hero_cta_label?: string
          hero_cta_url?: string
          hero_subtitle?: string
          key: string
          logo_url?: string | null
          next_match_at?: string | null
          next_match_team_a?: string | null
          next_match_team_b?: string | null
          next_match_tournament?: string | null
          site_title?: string
          tagline?: string
          theme_accent?: string
          updated_at?: string
        }
        Update: {
          dashboard_bg_url?: string | null
          hero_bg_url?: string | null
          hero_cta_label?: string
          hero_cta_url?: string
          hero_subtitle?: string
          key?: string
          logo_url?: string | null
          next_match_at?: string | null
          next_match_team_a?: string | null
          next_match_team_b?: string | null
          next_match_tournament?: string | null
          site_title?: string
          tagline?: string
          theme_accent?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          id: string
          platform: string
          sort_order: number
          url: string
        }
        Insert: {
          id?: string
          platform: string
          sort_order?: number
          url: string
        }
        Update: {
          id?: string
          platform?: string
          sort_order?: number
          url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
