import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Calendar, FileText, ArrowUpRight, Video, Scale, Clock, ShieldCheck } from "lucide-react";
import { useApp } from "@/lib/store";
import { useAudit } from "@/lib/audit";
import { StatusStepper } from "@/components/StatusStepper";
import { PdfViewer } from "@/components/PdfViewer";
import { Decrypt } from "@/components/Decrypt";
import { Redacted } from "@/components/Redacted";
import { Tilt3D, TiltLayer } from "@/components/Tilt3D";
import { RoleGuard } from "@/components/RoleGuard";
import { downloadIcs } from "@/lib/ics";

type StatTone = "primary" | "emerald" | "amber";
function StatWidget({
  icon: Icon,
  label,
  value,
  hint,
  tone = "primary",
}: {
  icon: typeof Scale;
  label: string;
  value: string | number;
  hint: string;
  tone?: StatTone;
}) {
  const toneClass =
    tone === "emerald"
      ? "from-primary/25 to-primary/5 text-primary"
      : tone === "amber"
        ? "from-accent/30 to-accent/10 text-foreground/70"
        : "from-primary/25 to-accent/10 text-primary";
  return (
    <Tilt3D className="relative">
      <div className="surface relative overflow-hidden rounded-2xl p-5" style={{ transformStyle: "preserve-3d" }}>
        <TiltLayer z={0}>
          <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${toneClass} blur-2xl opacity-70`} />
        </TiltLayer>
        <TiltLayer z={30}>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <Icon className={`h-3.5 w-3.5 ${toneClass.split(" ").pop()}`} />
            {label}
          </div>
          <div className="mt-2 font-display text-3xl">{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
        </TiltLayer>
        <TiltLayer z={60} className="absolute bottom-4 right-4">
          <div className={`rounded-lg bg-gradient-to-br ${toneClass} px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider shadow-lg`}>
            Live
          </div>
        </TiltLayer>
      </div>
    </Tilt3D>
  );
}

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <RoleGuard action="view:dashboard" requiredRole="client">
      <DashboardInner />
    </RoleGuard>
  );
}

function DashboardInner() {
  const consultations = useApp((s) => s.consultations);
  const advance = useApp((s) => s.advance);
  const user = useApp((s) => s.user);
  const [openDoc, setOpenDoc] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(t);
  }, []);

  const exportIcs = (c: { lawyer: { name: string }; date: string; documentName: string }) => {
    downloadIcs(`consultation-${c.lawyer.name.replace(/\s/g, "-")}.ics`, {
      title: `Consultation with ${c.lawyer.name}`,
      description: `Confidential consultation — doc: ${c.documentName}`,
      start: new Date(c.date),
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 pt-8 pb-24">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl md:text-5xl">
          <Decrypt text={`Welcome, ${user?.name ?? "Counsel"}`} duration={900} />
        </h1>
        <p className="mt-2 text-muted-foreground">{consultations.length} active consultations</p>
      </motion.div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatWidget
          icon={Scale}
          label="Active cases"
          value={consultations.length}
          hint="Across all specialties"
          tone="primary"
        />
        <StatWidget
          icon={Clock}
          label="Next hearing"
          value={
            consultations[0]
              ? new Date(consultations[0].date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
              : "—"
          }
          hint={consultations[0]?.lawyer.name ?? "No upcoming"}
          tone="amber"
        />
        <StatWidget
          icon={ShieldCheck}
          label="Documents secured"
          value={consultations.length}
          hint="End-to-end encrypted"
          tone="emerald"
        />
      </div>

      <div className="mt-10 space-y-4">
        {consultations.map((c, i) => {
          const docId = `doc-${c.id}`;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="surface rounded-2xl p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-border font-display">
                    {c.lawyer.initials}
                  </div>
                  <div>
                    <div className="font-display text-xl">{c.lawyer.name}</div>
                    <div className="text-xs text-muted-foreground">{c.lawyer.specialty} · {new Date(c.date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusStepper status={c.status} />
                  {c.status !== "Confirmed" && (
                    <button
                      onClick={() => advance(c.id)}
                      className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                    >
                      Advance <ArrowUpRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3 text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
                Direct line: <Redacted>+33 1 84 88 12 04</Redacted>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <motion.button
                  layoutId={docId}
                  onClick={() => setOpenDoc(c.id)}
                  className="surface inline-flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm hover:bg-secondary transition"
                >
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{c.documentName}</span>
                  <span className="text-xs text-[oklch(0.42_0.06_50)]">· encrypted</span>
                </motion.button>

                {c.status === "Confirmed" && (() => {
                  const callTime = new Date(c.date).getTime();
                  const liveWindow = now >= callTime - 10 * 60 * 1000 && now <= callTime + 60 * 60 * 1000;
                  return (
                    <div className="flex items-center gap-2">
                      <motion.button
                        animate={liveWindow ? { scale: [1, 1.04, 1] } : {}}
                        transition={liveWindow ? { duration: 1.6, repeat: Infinity } : {}}
                        disabled={!liveWindow}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                          liveWindow
                            ? "bg-primary text-primary-foreground glow-primary"
                            : "bg-secondary text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        <Video className="h-4 w-4" />
                        {liveWindow ? "Join Video Call" : "Call unlocks at start"}
                      </motion.button>
                      <button
                        onClick={() => exportIcs(c)}
                        className="inline-flex items-center gap-2 rounded-xl surface px-3.5 py-2.5 text-sm font-semibold"
                      >
                        <Calendar className="h-4 w-4 text-primary" /> .ics
                      </button>
                    </div>
                  );
                })()}
              </div>

              <PdfViewer
                open={openDoc === c.id}
                onClose={() => setOpenDoc(null)}
                documentName={c.documentName}
                userName={user?.name ?? "Client"}
                layoutId={docId}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
