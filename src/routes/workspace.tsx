import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { Briefcase, TrendingUp, Inbox, CheckCircle2, XCircle, FileText, Star, Clock, Wallet, Receipt } from "lucide-react";
import { useApp } from "@/lib/store";
import { useAudit } from "@/lib/audit";
import { Decrypt } from "@/components/Decrypt";
import { VaultUnlock } from "@/components/VaultUnlock";
import { PdfViewer } from "@/components/PdfViewer";
import { StickyNote } from "@/components/StickyNote";
import { InvoiceModal, type InvoiceData } from "@/components/InvoiceModal";
import { Redacted } from "@/components/Redacted";
import { RoleGuard } from "@/components/RoleGuard";
import { SignaturePad } from "@/components/SignaturePad";

export const Route = createFileRoute("/workspace")({
  component: WorkspacePage,
});

function WorkspacePage() {
  return (
    <RoleGuard action="view:workspace" requiredRole="lawyer">
      <WorkspaceInner />
    </RoleGuard>
  );
}

function WorkspaceInner() {
  const user = useApp((s) => s.user);
  const requests = useApp((s) => s.requests);
  const decide = useApp((s) => s.decideRequest);
  const navigate = useNavigate();

  const [vaultFor, setVaultFor] = useState<string | null>(null);
  const [viewerFor, setViewerFor] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);

  const stats = useMemo(() => {
    const accepted = requests.filter((r) => r.status === "accepted");
    const pending = requests.filter((r) => r.status === "pending");
    const revenue = accepted.reduce((s, r) => s + r.estimatedFee, 0);
    return { revenue, pending: pending.length, accepted: accepted.length };
  }, [requests]);

  // Guard handles unauthenticated/wrong-role; safe to assume lawyer here.
  if (!user) return null;
  void navigate;

  const activeRequest = requests.find((r) => r.id === viewerFor);

  return (
    <div className="mx-auto max-w-7xl px-6 pt-8 pb-24">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full chip-emerald px-3 py-1 text-xs font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Lawyer Portal · {user.barreau ? `Barreau de ${user.barreau}` : "Bar verified"}
            </div>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">
              <Decrypt text={`Bonjour, Maître ${user.name.split(" ").slice(-1)[0]}`} duration={900} />
            </h1>
            <p className="mt-2 text-muted-foreground">Spécialité · {user.specialty ?? "Generalist"}</p>
          </div>
        </div>
      </motion.div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <StatCard icon={Wallet} label="Total Earnings" value={`€${stats.revenue.toLocaleString()}`} tone="emerald" delay={0} />
        <StatCard icon={Inbox} label="Pending Requests" value={String(stats.pending)} tone="amber" delay={0.1} />
        <StatCard icon={TrendingUp} label="Active Cases" value={String(stats.accepted)} tone="emerald" delay={0.2} />
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl">Case Management</h2>
          <div className="text-xs text-muted-foreground">Auto-sorted by status</div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Column title="Pending" tone="amber" count={requests.filter((r) => r.status === "pending").length}>
            <AnimatePresence mode="popLayout">
              {requests.filter((r) => r.status === "pending").map((r) => (
                <RequestCard
                  key={r.id} r={r}
                  onAccept={() => {
                    decide(r.id, "accepted");
                    useAudit.getState().log({ type: "role_switch", actor: user.name, role: "lawyer", detail: `Accepted request from ${r.clientName}` });
                  }}
                  onDecline={() => {
                    decide(r.id, "declined");
                    useAudit.getState().log({ type: "access_denied", actor: user.name, role: "lawyer", detail: `Declined request from ${r.clientName}` });
                  }}
                  onReview={() => setVaultFor(r.id)}
                />
              ))}
            </AnimatePresence>
          </Column>
          <Column title="Accepted" tone="emerald" count={requests.filter((r) => r.status === "accepted").length}>
            <AnimatePresence mode="popLayout">
              {requests.filter((r) => r.status === "accepted").map((r) => (
                <RequestCard
                  key={r.id} r={r}
                  onReview={() => setVaultFor(r.id)}
                  onInvoice={() => {
                    const data = {
                      clientName: r.clientName,
                      lawyerName: user.name,
                      rate: Math.round(r.estimatedFee / 4),
                      hours: 4,
                      date: new Date().toISOString(),
                      reference: `AVL-${new Date().getFullYear()}-${r.id.toUpperCase()}`,
                    };
                    setInvoice(data);
                    useAudit.getState().log({ type: "invoice_generated", actor: user.name, role: "lawyer", detail: `Invoice ${data.reference} for ${r.clientName} · €${data.rate * data.hours}` });
                  }}
                  muted
                />
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
          const req = requests.find((r) => r.id === id);
          if (req) {
            useAudit.getState().log({ type: "vault_unlock", actor: user.name, role: "lawyer", detail: `Unlocked vault: ${req.clientName} · ${req.documentName}` });
          }
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

      <InvoiceModal open={!!invoice} onClose={() => setInvoice(null)} data={invoice} />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone, delay }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; tone: "emerald" | "amber"; delay: number }) {
  const chip = tone === "emerald" ? "chip-emerald" : "chip-amber";
  const grad = tone === "emerald" ? "text-gradient" : "text-gradient-amber";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 22 }}
      className="surface relative rounded-2xl p-6 overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
        <div className={`grid h-8 w-8 place-items-center rounded-lg ${chip}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className={`mt-3 font-display text-4xl ${grad}`}>
        <Decrypt text={value} duration={700} />
      </div>
    </motion.div>
  );
}

function Column({ title, tone, count, children }: { title: string; tone: "amber" | "emerald" | "rose"; count: number; children: React.ReactNode }) {
  const dot = tone === "emerald" ? "bg-primary" : tone === "rose" ? "bg-destructive" : "bg-accent";
  return (
    <div className="surface rounded-2xl p-4 min-h-[200px]">
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

function RequestCard({ r, onAccept, onDecline, onReview, onInvoice, muted }: {
  r: import("@/lib/mock-data").LawyerRequest;
  onAccept?: () => void;
  onDecline?: () => void;
  onReview?: () => void;
  onInvoice?: () => void;
  muted?: boolean;
}) {
  const [strike, setStrike] = useState(false);
  const handleAccept = () => {
    setStrike(true);
    setTimeout(() => { setStrike(false); onAccept?.(); }, 520);
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={`relative rounded-xl p-4 ring-1 ring-border ${muted ? "bg-secondary/40" : "bg-card"} ${strike ? "gavel-strike" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-border font-display text-sm">
            {r.clientInitials}
          </div>
          <div>
            <div className="text-sm font-semibold">{r.clientName}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.specialty}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gradient font-bold">€{r.estimatedFee}</div>
          <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" /> {new Date(r.submittedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{r.subject}</p>

      <div className="mt-2 text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
        Direct line: <Redacted>+33 6 12 34 56 78</Redacted>
      </div>

      <button
        onClick={onReview}
        disabled={!onReview}
        className="mt-3 w-full surface inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-secondary transition disabled:opacity-50"
      >
        <FileText className="h-3.5 w-3.5 text-primary" />
        <span className="font-semibold truncate">{r.documentName}</span>
        <span className="text-[oklch(0.42_0.06_50)]">· encrypted</span>
      </button>

      {onAccept && onDecline && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAccept}
            data-magnetic
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground glow-primary"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Accepter
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onDecline}
            data-magnetic
            className="inline-flex items-center justify-center gap-1.5 rounded-lg chip-rose px-3 py-2 text-xs font-semibold glow-rose"
          >
            <XCircle className="h-3.5 w-3.5" /> Décliner
          </motion.button>
        </div>
      )}

      {!onAccept && r.status === "accepted" && (
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-[oklch(0.42_0.06_50)]">
            <Star className="h-3 w-3 fill-current" /> Active engagement
          </div>
          {onInvoice && (
            <button
              onClick={onInvoice}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/15 transition"
            >
              <Receipt className="h-3.5 w-3.5" /> Generate Invoice
            </button>
          )}
        </div>
      )}

      {r.status === "accepted" && (
        <div className="mt-3 pt-3 border-t border-border/60">
          <SignaturePad documentName={r.documentName} />
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-border/60">
        <StickyNote defaultValue={r.status === "accepted" ? "Counterparty seems open to settlement — confirm next call." : ""} />
      </div>
    </motion.div>
  );
}
