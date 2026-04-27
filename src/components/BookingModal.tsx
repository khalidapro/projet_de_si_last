import { AnimatePresence, motion } from "framer-motion";
import { X, ShieldCheck, Upload, FileCheck2, User, Fingerprint, CalendarPlus, Check, Star as StarIcon, Quote } from "lucide-react";
import { useState, useRef } from "react";
import type { Lawyer, Consultation } from "@/lib/mock-data";
import { Stars } from "@/components/Stars";

type Phase = "idle" | "uploading" | "scanning" | "secured";
type Tab = "booking" | "reviews";
type SyncState = "idle" | "syncing" | "synced";

export function BookingModal({
  lawyer,
  onClose,
  onConfirm,
}: {
  lawyer: Lawyer | null;
  onClose: () => void;
  onConfirm: (c: Omit<Consultation, "id" | "status">) => void;
}) {
  const [uploaded, setUploaded] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [tab, setTab] = useState<Tab>("booking");
  const [sync, setSync] = useState<SyncState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setUploaded(null); setDragOver(false); setPhase("idle");
    setTab("booking"); setSync("idle");
  };

  const handleFile = (f: File | undefined) => {
    if (!f) return;
    setUploaded(f.name);
    setPhase("uploading");
    setTimeout(() => setPhase("scanning"), 600);
    setTimeout(() => setPhase("secured"), 2100);
  };

  const triggerSync = () => {
    if (sync !== "idle") return;
    setSync("syncing");
    setTimeout(() => setSync("synced"), 1400);
  };

  const confirm = () => {
    if (!lawyer) return;
    onConfirm({
      lawyer,
      date: new Date(Date.now() + 3 * 86400000).toISOString(),
      documentName: uploaded || "consultation_brief.pdf",
    });
    reset();
    onClose();
  };

  const avgRating = lawyer
    ? Math.round((lawyer.reviews.reduce((s, r) => s + r.rating, 0) / Math.max(lawyer.reviews.length, 1)) * 10) / 10
    : 0;

  return (
    <AnimatePresence onExitComplete={reset}>
      {lawyer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-foreground/30 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="surface-lg relative w-full max-w-2xl rounded-3xl p-8 overflow-hidden bg-card max-h-[90vh] overflow-y-auto"
          >
            <button onClick={onClose} className="absolute right-5 top-5 text-muted-foreground hover:text-foreground transition">
              <X className="h-5 w-5" />
            </button>

            <h2 className="font-display text-2xl">Match & Connect</h2>
            <p className="text-sm text-muted-foreground mt-1">Secure pairing with end-to-end encryption</p>

            {/* Tabs */}
            <div className="mt-5 relative inline-flex rounded-xl bg-secondary p-1">
              {(["booking", "reviews"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative px-4 py-1.5 text-xs font-semibold rounded-lg transition ${tab === t ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {tab === t && (
                    <motion.span
                      layoutId="modal-tab-pill"
                      className="absolute inset-0 rounded-lg bg-primary glow-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 inline-flex items-center gap-1.5">
                    {t === "reviews" && <StarIcon className="h-3 w-3" />}
                    {t === "booking" ? "Booking" : `Reviews · ${lawyer.reviews.length}`}
                  </span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {tab === "booking" ? (
                <motion.div
                  key="b"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Match animation */}
                  <div className="mt-8 flex items-center justify-center gap-6 relative h-32">
                    <motion.div
                      initial={{ x: -120, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 180, damping: 20, delay: 0.1 }}
                      className="grid place-items-center h-20 w-20 rounded-2xl chip-emerald"
                    >
                      <User className="h-8 w-8" />
                    </motion.div>

                    <div className="relative">
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0.95] }}
                        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                        className="h-3 w-3 rounded-full bg-primary"
                        style={{ boxShadow: "0 0 30px 10px rgba(166,123,91,0.55)" }}
                      />
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="absolute h-3 w-3 rounded-full pulse-ring" />
                      </span>
                    </div>

                    <motion.div
                      initial={{ x: 120, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 180, damping: 20, delay: 0.1 }}
                      className="grid place-items-center h-20 w-20 rounded-2xl chip-amber font-display text-xl"
                    >
                      {lawyer.initials}
                    </motion.div>
                  </div>

                  <div className="mt-2 text-center text-xs text-muted-foreground">
                    Pairing with <span className="text-foreground">{lawyer.name}</span> — €{lawyer.rate}/h
                  </div>

                  {/* Dropzone */}
                  <div className="mt-6">
                    <input
                      ref={inputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0])}
                    />
                    <AnimatePresence mode="wait">
                      {phase === "idle" && (
                        <motion.button
                          key="dz"
                          layout
                          layoutId="dropzone"
                          onClick={() => inputRef.current?.click()}
                          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
                          className={`relative w-full rounded-2xl p-8 text-center transition ${dragOver ? "bg-primary/10" : "bg-secondary/40"}`}
                        >
                          <div className="absolute inset-0 rounded-2xl dashed-glow opacity-90" />
                          <Upload className="mx-auto h-7 w-7 text-primary" />
                          <div className="mt-2 font-medium">Drop your PDF proof here</div>
                          <div className="text-xs text-muted-foreground">or click to browse — encrypted in transit</div>
                        </motion.button>
                      )}

                      {(phase === "uploading" || phase === "scanning") && (
                        <motion.div
                          key="scan"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="relative w-full rounded-2xl bg-secondary/40 ring-1 ring-border p-8 text-center overflow-hidden"
                        >
                          <div className="relative mx-auto h-16 w-16">
                            <Fingerprint className="h-16 w-16 text-primary mx-auto" strokeWidth={1.6} />
                            {phase === "scanning" && (
                              <span className="absolute inset-x-0 top-0 h-1 scan-line" />
                            )}
                          </div>
                          <div className="mt-3 font-medium text-sm">
                            {phase === "uploading" ? "Uploading…" : "Biometric scan in progress…"}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">{uploaded}</div>
                        </motion.div>
                      )}

                      {phase === "secured" && (
                        <motion.div
                          key="encrypted"
                          layout
                          layoutId="dropzone"
                          initial={{ borderRadius: 24, scale: 0.9 }}
                          animate={{ borderRadius: 999, scale: 1 }}
                          transition={{ type: "spring", stiffness: 260, damping: 24 }}
                          className="mx-auto inline-flex items-center gap-2 rounded-full chip-emerald px-5 py-3 text-sm font-semibold glow-primary"
                        >
                          <FileCheck2 className="h-4 w-4" />
                          Document Encrypted & Secured
                          <span className="ml-1 text-muted-foreground text-xs">· {uploaded}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Calendar Sync Row */}
                  <div className="mt-6 surface rounded-xl p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Calendrier</div>
                      <div className="text-[11px] text-muted-foreground">Ajoutez le rendez-vous à votre agenda perso.</div>
                    </div>
                    <button
                      onClick={triggerSync}
                      disabled={sync !== "idle"}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary/10 hover:bg-primary/15 disabled:opacity-100 px-3.5 py-2 text-xs font-semibold text-primary transition"
                      aria-label="Synchroniser avec Google Agenda"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {sync === "idle" && (
                          <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                            <CalendarPlus className="h-3.5 w-3.5" />
                            Synchroniser avec Google Agenda
                          </motion.span>
                        )}
                        {sync === "syncing" && (
                          <motion.span key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                            <motion.span
                              className="h-3 w-3 rounded-full border-2 border-primary/40 border-t-primary"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                            />
                            Synchronisation…
                          </motion.span>
                        )}
                        {sync === "synced" && (
                          <motion.span key="d" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                            <Check className="h-3.5 w-3.5" />
                            Ajouté à Google Agenda
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>

                  <div className="mt-7 flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" /> AES-256 · Zero-knowledge storage
                    </div>
                    <button
                      onClick={confirm}
                      data-magnetic
                      className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-primary"
                    >
                      Confirm booking
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="r"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mt-6"
                >
                  <div className="surface rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Average</div>
                      <div className="font-display text-3xl text-gradient">{avgRating}</div>
                    </div>
                    <div className="text-right">
                      <Stars rating={avgRating} size={18} />
                      <div className="text-[11px] text-muted-foreground mt-1">{lawyer.reviews.length} reviews</div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {lawyer.reviews.map((r, i) => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, type: "spring", stiffness: 240, damping: 24 }}
                        className="surface rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-border font-display text-xs">
                              {r.initials}
                            </div>
                            <div>
                              <div className="text-sm font-semibold">{r.author}</div>
                              <div className="text-[10px] text-muted-foreground">{new Date(r.date).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <Stars rating={r.rating} size={13} />
                        </div>
                        <div className="mt-2.5 flex gap-2">
                          <Quote className="h-3.5 w-3.5 text-primary/60 shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground leading-relaxed">{r.body}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
