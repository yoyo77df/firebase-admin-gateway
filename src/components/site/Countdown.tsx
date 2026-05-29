import { useEffect, useState } from "react";

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const s = Math.floor(ms / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export function Countdown({ target }: { target: Date | null }) {
  const [t, setT] = useState(() => (target ? diff(target) : null));
  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (!target || !t) return <span className="text-muted-foreground text-sm">TBA</span>;
  const Cell = ({ v, label }: { v: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="glass rounded-md px-3 py-2 min-w-[3rem] text-center font-display text-2xl text-glow tabular-nums">
        {v.toString().padStart(2, "0")}
      </div>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{label}</span>
    </div>
  );
  return (
    <div className="flex gap-2">
      <Cell v={t.d} label="Days" />
      <Cell v={t.h} label="Hrs" />
      <Cell v={t.m} label="Min" />
      <Cell v={t.s} label="Sec" />
    </div>
  );
}
