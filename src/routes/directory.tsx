import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { LAWYERS, type Lawyer, type Specialty } from "@/lib/mock-data";
import { LawyerCard } from "@/components/LawyerCard";
import { BookingModal } from "@/components/BookingModal";
import { useApp } from "@/lib/store";
import { useAudit } from "@/lib/audit";
import { RoleGuard } from "@/components/RoleGuard";

export const Route = createFileRoute("/directory")({
  component: DirectoryPage,
});

const SPECIALTIES: ("All" | Specialty)[] = ["All", "Business", "Penal", "Family"];

function DirectoryPage() {
  return (
    <RoleGuard action="view:directory" requiredRole="client">
      <DirectoryInner />
    </RoleGuard>
  );
}

function DirectoryInner() {
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState<"All" | Specialty>("All");
  const [maxRate, setMaxRate] = useState(450);
  const [selected, setSelected] = useState<Lawyer | null>(null);
  const addConsultation = useApp((s) => s.addConsultation);

  const filtered = useMemo(
    () =>
      LAWYERS.filter(
        (l) =>
          (spec === "All" || l.specialty === spec) &&
          l.rate <= maxRate &&
          (q === "" || l.name.toLowerCase().includes(q.toLowerCase()) || l.city.toLowerCase().includes(q.toLowerCase()))
      ),
    [q, spec, maxRate]
  );

  return (
    <div className="mx-auto max-w-7xl px-6 pt-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-4xl md:text-5xl">The Directory</h1>
        <p className="mt-2 text-muted-foreground">Discover bar-verified attorneys, ready to take your case.</p>
      </motion.div>

      {/* Filters */}
      <div className="surface-lg sticky top-24 z-30 rounded-2xl p-4 md:p-5 mb-8">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div className="flex items-center gap-2 surface rounded-xl px-3.5 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or city…"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-secondary p-1">
            {SPECIALTIES.map((s) => (
              <button
                key={s}
                onClick={() => setSpec(s)}
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${spec === s ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {spec === s && (
                  <motion.div
                    layoutId="spec-pill"
                    className="absolute inset-0 rounded-lg bg-primary glow-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{s}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 min-w-[220px]">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Max rate</span>
                <span className="text-gradient font-semibold">€{maxRate}/h</span>
              </div>
              <input
                type="range"
                min={150}
                max={500}
                step={10}
                value={maxRate}
                onChange={(e) => setMaxRate(+e.target.value)}
                className="w-full accent-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((l) => (
            <motion.div
              key={l.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
            >
              <LawyerCard lawyer={l} onBook={setSelected} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center text-muted-foreground py-16">No lawyers match your filters.</div>
      )}

      <BookingModal
        lawyer={selected}
        onClose={() => setSelected(null)}
        onConfirm={(c) => addConsultation(c)}
      />
    </div>
  );
}
