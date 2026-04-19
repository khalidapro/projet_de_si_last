import { AnimatePresence, motion } from "framer-motion";
import { Lock, Unlock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export function VaultUnlock({
  open,
  onClose,
  onUnlocked,
  clientName,
}: {
  open: boolean;
  onClose: () => void;
  onUnlocked: () => void;
  clientName: string;
}) {
  const [phase, setPhase] = useState<"locked" | "unlocking" | "open">("locked");

  useEffect(() => {
    if (!open) {
      setPhase("locked");
      return;
    }
    const t1 = setTimeout(() => setPhase("unlocking"), 400);
    const t2 = setTimeout(() => setPhase("open"), 1500);
    const t3 = setTimeout(() => onUnlocked(), 1900);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
    };
  }, [open, onUnlocked]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[110] grid place-items-center bg-black/80 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong w-full max-w-md rounded-3xl p-10 text-center"
          >
            <div className="relative mx-auto h-28 w-28">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 ring-1 ring-white/10"
                animate={{
                  boxShadow: phase === "open"
                    ? "0 0 80px 12px rgba(16,185,129,0.45)"
                    : "0 0 40px 4px rgba(99,102,241,0.5)",
                }}
              />
              <div className="absolute inset-0 grid place-items-center">
                <AnimatePresence mode="wait">
                  {phase !== "open" ? (
                    <motion.div
                      key="lock"
                      initial={{ rotate: 0, scale: 1 }}
                      animate={phase === "unlocking" ? { rotate: [0, -8, 8, -6, 6, 0], scale: [1, 1.05, 1] } : {}}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 1, repeat: phase === "unlocking" ? Infinity : 0 }}
                    >
                      <Lock className="h-12 w-12 text-primary" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unlock"
                      initial={{ scale: 0.4, opacity: 0, rotate: -25 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    >
                      <Unlock className="h-12 w-12 text-emerald-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className="absolute inset-0 rounded-full pulse-ring" />
            </div>

            <h2 className="mt-7 font-display text-2xl">
              {phase === "open" ? "Vault Unlocked" : phase === "unlocking" ? "Decrypting…" : "Secure Vault"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Verifying access keys for <span className="text-foreground">{clientName}</span>'s confidential brief.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/30">
              <ShieldCheck className="h-3.5 w-3.5" /> AES-256 · Zero-knowledge
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
