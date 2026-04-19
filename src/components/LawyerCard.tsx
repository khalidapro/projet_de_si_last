import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, Briefcase, MapPin } from "lucide-react";
import type { Lawyer } from "@/lib/mock-data";
import { useRef } from "react";

export function LawyerCard({ lawyer, onBook }: { lawyer: Lawyer; onBook: (l: Lawyer) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 18 });
  const glowX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(my, [0, 1], ["0%", "100%"]);

  const handleMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const handleLeave = () => { mx.set(0.5); my.set(0.5); };

  const specialtyClass = {
    Business: "chip-emerald",
    Penal: "chip-rose",
    Family: "chip-amber",
  }[lawyer.specialty];

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="group relative"
    >
      {/* Spotlight border glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) =>
              `radial-gradient(360px circle at ${gx} ${gy}, rgba(16,185,129,0.35), rgba(16,185,129,0.08) 35%, transparent 60%)`
          ),
        }}
      />
      <div className="relative surface rounded-2xl p-6 overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-border font-display text-lg text-foreground">
              {lawyer.initials}
            </div>
            <div>
              <h3 className="font-display text-lg leading-tight">{lawyer.name}</h3>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {lawyer.city}
              </div>
            </div>
          </div>
          <div className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${specialtyClass}`}>
            {lawyer.specialty}
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{lawyer.bio}</p>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-[oklch(0.78_0.16_75)] text-[oklch(0.78_0.16_75)]" />{lawyer.rating}</span>
          <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{lawyer.cases} cases</span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Hourly</div>
            <div className="font-display text-2xl text-gradient">€{lawyer.rate}</div>
          </div>
          <button
            onClick={() => onBook(lawyer)}
            data-magnetic
            className="relative inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground glow-primary hover:brightness-105 transition"
          >
            Réserver
          </button>
        </div>
      </div>
    </motion.div>
  );
}
