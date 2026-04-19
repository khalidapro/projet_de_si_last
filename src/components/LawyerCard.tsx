import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, Briefcase, MapPin } from "lucide-react";
import type { Lawyer } from "@/lib/mock-data";
import { useRef } from "react";

export function LawyerCard({ lawyer, onBook }: { lawyer: Lawyer; onBook: (l: Lawyer) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 200, damping: 18 });
  const glowX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(my, [0, 1], ["0%", "100%"]);

  const handleMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const handleLeave = () => { mx.set(0.5); my.set(0.5); };

  const specialtyColor = {
    Business: "from-indigo-500/20 to-indigo-500/5 text-indigo-300 ring-indigo-400/30",
    Penal: "from-rose-500/20 to-rose-500/5 text-rose-300 ring-rose-400/30",
    Family: "from-emerald-500/20 to-emerald-500/5 text-emerald-300 ring-emerald-400/30",
  }[lawyer.specialty];

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="group relative"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) =>
              `radial-gradient(380px circle at ${gx} ${gy}, rgba(99,102,241,0.35), rgba(6,182,212,0.18) 35%, transparent 60%)`
          ),
        }}
      />
      <div className="relative glass rounded-2xl p-6 overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 ring-1 ring-white/10 font-display text-lg">
              {lawyer.initials}
            </div>
            <div>
              <h3 className="font-display text-lg leading-tight">{lawyer.name}</h3>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {lawyer.city}
              </div>
            </div>
          </div>
          <div className={`rounded-full bg-gradient-to-br px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ring-1 ${specialtyColor}`}>
            {lawyer.specialty}
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{lawyer.bio}</p>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{lawyer.rating}</span>
          <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{lawyer.cases} cases</span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Hourly</div>
            <div className="font-display text-2xl text-gradient">€{lawyer.rate}</div>
          </div>
          <button
            onClick={() => onBook(lawyer)}
            data-magnetic
            className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_-8px_rgba(99,102,241,0.6)] hover:shadow-[0_0_40px_-4px_rgba(99,102,241,0.9)] transition-shadow"
          >
            Réserver
          </button>
        </div>
      </div>
    </motion.div>
  );
}
