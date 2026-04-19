import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { Briefcase, TrendingUp, Inbox, CheckCircle2, XCircle, FileText, Star, Clock, Wallet } from "lucide-react";
import { useApp } from "@/lib/store";
import { Decrypt } from "@/components/Decrypt";
import { VaultUnlock } from "@/components/VaultUnlock";
import { PdfViewer } from "@/components/PdfViewer";

export const Route = createFileRoute("/workspace")({
  component: WorkspacePage,
});

function WorkspacePage() {
  const user = useApp((s) => s.user);
  const requests = useApp((s) => s.requests);
  const decide = useApp((s) => s.decideRequest);
  const navigate = useNavigate();

  const [vaultFor, setVaultFor] = useState<string | null>(null);
  const [viewerFor, setViewerFor] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== "lawyer") {
      navigate({ to: "/directory" });
    }
  }, [user, navigate]);

  const stats = useMemo(() => {
    const accepted = requests.filter((r) => r.status === "accepted");
    const pending = requests.filter((r) => r.status === "pending");
    const revenue = accepted.reduce((s, r) => s + r.estimatedFee, 0);
    return { revenue, pending: pending.length, accepted: accepted.length };
  }, [requests]);

  if (!user || user.role !== "lawyer") {
    return (
      <main className="mx-auto max-w-2xl px-6 pt-24 text-center">
        <div className="glass-strong rounded-3xl p-10">
          <Briefcase className="mx-auto h-8 w-8 text-primary" />
          <h1 className="mt-4 font-display text-3xl">Lawyer Workspace</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in as an Avocat to access this workspace.</p>
          <button
            onClick={() => navigate({ to: "/login" })}
            className="mt-6 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-white glow-primary"
          >
            Sign in
          </button>
        </div>
      </main>
    );
  }

  const activeRequest = requests.find((r) => r.id === viewerFor);

  return (
    <main className="mx-auto max-w-7xl px-6 pt-12 pb-24">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Lawyer Portal · {user.barreau ? `Barreau de ${user.barreau}` : "Bar verified"}
            </div>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">
              <Decrypt text={`Bonjour, Maître ${user.name.split(" ").slice(-1)[0]}`} duration={900} />
            </h1>
            <p className="mt-2 text-muted-foreground">Spécialité · {user.specialty ?? "Generalist"}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Wallet}
          label="Chiffre d'Affaires"
          value={`€${stats.revenue.toLocaleString()}`}
          accent="from-emerald-500/30 to-cyan-500/20"
          glow="0 0 40px -8px rgba(16,185,129,0.5)"
          delay={0}
        />
        <StatCard
          icon={Inbox}
          label="Pending Requests"
          value={String(stats.pending)}
          accent="from-primary/30 to-accent/20"
          glow="0 0 40px -8px rgba(99,102,241,0.55)"
          delay={0.1}
        />
        <StatCard
          icon={TrendingUp}
          label="Active Cases"
          value={String(stats.accepted)}
          accent="from-accent/30 to-primary/20"
          glow="0 0 40px -8px rgba(6,182,212,0.5)"
          delay={0.2}
        />
      </div>

      {/* Kanban */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl">Case Management</h2>
          <div className="text-xs text-muted-foreground">Drag-free kanban · auto-sorted by status</div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Column title="Pending" tone="primary" count={requests.filter((r) => r.status === "pending").length}>
            <AnimatePresence mode="popLayout">
              {requests.filter((r) => r.status === "pending").map((r) => (
                <RequestCard
                  key={r.id}
                  r={r}
                  onAccept={() => decide(r.id, "accepted")}
                  onDecline={() => decide(r.id, "declined")}
                  onReview={() => setVaultFor(r.id)}
                />
              ))}
            </AnimatePresence>
          </Column>
          <Column title="Accepted" tone="emerald" count={requests.filter((r) => r.status === "accepted").length}>
            <AnimatePresence mode="popLayout">
              {requests.filter((r) => r.status === "accepted").map((r) => (
                <RequestCard key={r.id} r={r} onReview={() => setVaultFor(r.id)} muted />
              ))}
            </AnimatePresence>
          </Column>
          <Column title="Declined" tone="rose" count={requests.filter((r) => r.status === "declined").length}>
            <AnimatePresence mode="popLayout">
              {requests.filter((r) => r.status === "declined").map((r) => (
                <RequestCard key={r.id} r={r} muted />
              ))}
            </AnimatePresence>
          </Column>
        </div>
      </div>

      <VaultUnlock
        open={vaultFor !== null}
        clientName={requests.find((r) => r.id === vaultFor)?.clientName ?? ""}
        onClose={() => setVaultFor(null)}
        onUnlocked={() => {
          const id = vaultFor;
          setVaultFor(null);
          setViewerFor(id);
        }}
      />

      <PdfViewer
        open={!!viewerFor && !!activeRequest}
        onClose={() => setViewerFor(null)}
        documentName={activeRequest?.documentName ?? ""}
        userName={activeRequest?.clientName ?? ""}
        layoutId={`vault-${viewerFor ?? "x"}`}
      />
    </main>
  );
}

function StatCard({ icon: Icon, label, value, accent, glow, delay }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; accent: string; glow: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 22 }}
      className="glass relative rounded-2xl p-6 overflow-hidden"
      style={{ boxShadow: glow }}
    >
      <div className={`absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br ${accent} blur-2xl opacity-60`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-3 font-display text-4xl">
          <Decrypt text={value} duration={700} />
        </div>
      </div>
    </motion.div>
  );
}

function Column({ title, tone, count, children }: { title: string; tone: "primary" | "emerald" | "rose"; count: number; children: React.ReactNode }) {
  const dot = { primary: "bg-primary", emerald: "bg-emerald-400", rose: "bg-rose-400" }[tone];
  return (
    <div className="glass rounded-2xl p-4 min-h-[200px]">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dot}`} />
          <h3 className="font-display text-lg">{title}</h3>
        </div>
        <span className="text-xs text-muted-foreground">{count}</span>
      </div>
      <div className="space-y-3">
        {children}
        {count === 0 && <div className="text-center text-xs text-muted-foreground py-8">Empty</div>}
      </div>
    </div>
  );
}

function RequestCard({ r, onAccept, onDecline, onReview, muted }: {
  r: import("@/lib/mock-data").LawyerRequest;
  onAccept?: () => void;
  onDecline?: () => void;
  onReview?: () => void;
  muted?: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={`relative rounded-xl p-4 ring-1 ring-white/10 ${muted ? "bg-white/[0.02]" : "bg-white/[0.04]"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 ring-1 ring-white/10 font-display text-sm">
            {r.clientInitials}
          </div>
          <div>
            <div className="text-sm font-medium">{r.clientName}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.specialty}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gradient font-semibold">€{r.estimatedFee}</div>
          <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" /> {new Date(r.submittedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{r.subject}</p>

      <button
        onClick={onReview}
        disabled={!onReview}
        className="mt-3 w-full glass inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-white/5 transition disabled:opacity-50"
      >
        <FileText className="h-3.5 w-3.5 text-primary" />
        <span className="font-medium truncate">{r.documentName}</span>
        <span className="text-emerald-300">· encrypted</span>
      </button>

      {onAccept && onDecline && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAccept}
            data-magnetic
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/30 hover:bg-emerald-500/25 transition"
            style={{ boxShadow: "0 0 24px -8px rgba(16,185,129,0.6)" }}
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Accepter
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onDecline}
            data-magnetic
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-rose-500/15 px-3 py-2 text-xs font-semibold text-rose-300 ring-1 ring-rose-400/30 hover:bg-rose-500/25 transition"
            style={{ boxShadow: "0 0 24px -8px rgba(244,63,94,0.5)" }}
          >
            <XCircle className="h-3.5 w-3.5" /> Décliner
          </motion.button>
        </div>
      )}

      {!onAccept && r.status === "accepted" && (
        <div className="mt-3 inline-flex items-center gap-1 text-[10px] text-emerald-300">
          <Star className="h-3 w-3 fill-current" /> Active engagement
        </div>
      )}
    </motion.div>
  );
}
