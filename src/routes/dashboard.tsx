import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Calendar, FileText, ArrowUpRight, Video } from "lucide-react";
import { useApp } from "@/lib/store";
import { StatusStepper } from "@/components/StatusStepper";
import { PdfViewer } from "@/components/PdfViewer";
import { Decrypt } from "@/components/Decrypt";
import { Redacted } from "@/components/Redacted";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
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
    const dt = new Date(c.date);
    const end = new Date(dt.getTime() + 3600000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Avocat-Link//EN
BEGIN:VEVENT
UID:${crypto.randomUUID()}@avocat-link.io
DTSTAMP:${fmt(new Date())}
DTSTART:${fmt(dt)}
DTEND:${fmt(end)}
SUMMARY:Consultation with ${c.lawyer.name}
DESCRIPTION:Confidential consultation — doc: ${c.documentName}
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `consultation-${c.lawyer.name.replace(/\s/g, "-")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 pt-8 pb-24">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl md:text-5xl">
          <Decrypt text={`Welcome, ${user?.name ?? "Counsel"}`} duration={900} />
        </h1>
        <p className="mt-2 text-muted-foreground">{consultations.length} active consultations</p>
      </motion.div>

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

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <motion.button
                  layoutId={docId}
                  onClick={() => setOpenDoc(c.id)}
                  className="surface inline-flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm hover:bg-secondary transition"
                >
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{c.documentName}</span>
                  <span className="text-xs text-[oklch(0.45_0.16_160)]">· encrypted</span>
                </motion.button>

                {c.status === "Confirmed" && (
                  <button
                    onClick={() => exportIcs(c)}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground glow-primary"
                  >
                    <Calendar className="h-4 w-4" /> Export to Calendar (.ics)
                  </button>
                )}
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
