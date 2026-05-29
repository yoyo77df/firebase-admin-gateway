import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  key: string;
  site_title: string;
  tagline: string;
  hero_subtitle: string;
  hero_cta_label: string;
  hero_cta_url: string;
  logo_url: string | null;
  hero_bg_url: string | null;
  dashboard_bg_url: string | null;
  next_match_team_a: string | null;
  next_match_team_b: string | null;
  next_match_tournament: string | null;
  next_match_at: string | null;
  theme_accent: string;
};

export function useSiteSettings() {
  const { data } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "main")
        .maybeSingle();
      if (error) throw error;
      return data as SiteSettings | null;
    },
    staleTime: 30_000,
  });
  return data ?? null;
}
