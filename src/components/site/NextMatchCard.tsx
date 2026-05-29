import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Video, Calendar, Clock, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Match = {
  id: string;
  team_a: string;
  team_b: string;
  tournament: string | null;
  game: string | null;
  scheduled_at: string;
  status: string;
  score_a: number | null;
  score_b: number | null;
  stream_url: string | null;
  vod_url: string | null;
  stage_label: string | null;
};

const statusStyle: Record<string, string> = {
  upcoming: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  live: "bg-rose-500/15 text-rose-300 border-rose-500/40 animate-pulse",
  ended: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  cancelled: "bg-zinc-500/15 text-zinc-300 border-zinc-500/40",
};

function format(d: Date) {
  const date = d.toLocaleDateString("en-GB");
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  return { date, time };
}

export function NextMatchCard() {
  const { data, refetch } = useQuery({
    queryKey: ["matches", "next"],
    queryFn: async () => {
      const { data } = await supabase
        .from("matches")
        .select("*")
        .order("scheduled_at", { ascending: false })
        .limit(1);
      return (data?.[0] as Match | undefined) ?? null;
    },
    refetchInterval: 30_000,
  });

  // Realtime: refetch when matches table changes.
  useEffect(() => {
    const ch = supabase
      .channel("rt-matches")
      .on("postgres_changes", { event: "*", schema: "public", table: "matches" }, () => refetch())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [refetch]);

  if (!data) {
    return (
      <div className="glass-strong rounded-xl p-8 text-center text-muted-foreground">
        <Trophy className="w-6 h-6 mx-auto mb-3 text-[var(--neon)]" />
        No matches scheduled yet.
      </div>
    );
  }

  const when = new Date(data.scheduled_at);
  const { date, time } = format(when);
  const status = (data.status || "upcoming").toLowerCase();
  const chip = statusStyle[status] ?? statusStyle.upcoming;

  return (
    <div className="relative glass-strong rounded-xl p-6 md:p-7 overflow-hidden">
      <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-[var(--neon)]/20 blur-3xl" aria-hidden />
      {data.stage_label && (
        <div className="text-[11px] tracking-[0.32em] uppercase text-[var(--blood)] font-bold mb-3">
          {data.stage_label}
        </div>
      )}
      <h3 className="font-display font-black text-2xl md:text-3xl leading-tight mb-5">
        {data.tournament || data.team_a}
      </h3>

      {data.vod_url ? (
        <a
          href={data.vod_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-black/60 border border-white/10 hover:border-[var(--neon)] text-sm font-display tracking-wider mb-5 transition-colors"
        >
          <Video className="w-4 h-4" /> WATCH VOD
        </a>
      ) : data.stream_url ? (
        <a
          href={data.stream_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-black/60 border border-white/10 hover:border-[var(--neon)] text-sm font-display tracking-wider mb-5 transition-colors"
        >
          <Video className="w-4 h-4" /> WATCH LIVE
        </a>
      ) : null}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-[var(--blood)]" /> <span className="font-display italic">{date}</span>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <Clock className="w-4 h-4 text-[var(--blood)]" />
            <span className="font-display font-bold tracking-wider">{time}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-md text-[11px] font-display tracking-widest uppercase border ${chip}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
