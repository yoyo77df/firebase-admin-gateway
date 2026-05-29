import { motion } from "framer-motion";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="mb-12 text-center"
    >
      {eyebrow && (
        <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-[var(--neon)] mb-3">
          <span className="h-px w-8 bg-[var(--neon)]" />
          {eyebrow}
          <span className="h-px w-8 bg-[var(--neon)]" />
        </div>
      )}
      <h2 className="font-display text-4xl md:text-5xl font-black uppercase">
        <span className="text-gradient">{title}</span>
      </h2>
      {subtitle && (
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      )}
    </motion.div>
  );
}
