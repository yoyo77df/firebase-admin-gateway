import { useMemo } from "react";

export function Particles({ count = 30 }: { count?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: Math.random() * 100,
        size: 1 + Math.random() * 3,
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 14,
        dx: -40 + Math.random() * 80,
        opacity: 0.3 + Math.random() * 0.6,
        key: i,
      })),
    [count],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d) => (
        <span
          key={d.key}
          className="absolute bottom-0 rounded-full bg-[var(--neon)]"
          style={{
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            boxShadow: `0 0 ${d.size * 4}px var(--neon)`,
            animation: `drift ${d.duration}s linear ${d.delay}s infinite`,
            // @ts-expect-error css var
            "--dx": `${d.dx}px`,
          }}
        />
      ))}
    </div>
  );
}
