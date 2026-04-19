import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, ArrowRight, Lock, Zap, Users, Scale, MessageSquare, FileText } from "lucide-react";
import { Decrypt } from "@/components/Decrypt";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Avocat-Link — Find your lawyer in seconds" },
      { name: "description", content: "Premium legal-tech platform. Encrypted briefs, vetted attorneys, instant matching." },
    ],
  }),
});

function HomePage() {
  return (
    <>
      <header className="sticky top-4 z-40 mx-auto mt-4 w-[min(1200px,calc(100%-2rem))]">
        <div className="glass-strong flex items-center justify-between rounded-2xl px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.16_160)] to-[oklch(0.78_0.18_145)]">
              <Scale className="h-4.5 w-4.5 text-white" strokeWidth={2.4} />
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold">Avocat<span className="text-gradient">·</span>Link</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Premium LegalTech</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Link to="/terms" className="px-3 py-2 text-muted-foreground hover:text-foreground transition">Terms</Link>
            <Link to="/privacy" className="px-3 py-2 text-muted-foreground hover:text-foreground transition">Privacy</Link>
          </nav>
          <Link
            to="/login"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground glow-primary"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full chip-emerald px-4 py-1.5 text-xs">
            <ShieldCheck className="h-3.5 w-3.5" />
            End-to-End Encrypted · Bar-vetted lawyers
          </div>

          <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] text-foreground">
            The lawyers' network <br />
            <span className="text-gradient">
              <Decrypt text="reimagined for trust." duration={1400} />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground">
            Avocat-Link pairs you with vetted attorneys in seconds. Encrypted documents,
            confidential consultations, zero friction.
          </p>

          <div className="mt-10 flex items-center justify-center gap-3">
            <Link
              to="/directory"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground glow-primary"
            >
              Browse the directory
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl surface px-6 py-3.5 text-sm font-semibold text-foreground"
            >
              Sign in
            </Link>
          </div>
        </motion.div>

        <div className="mt-24 grid gap-4 md:grid-cols-3">
          {[
            { icon: Lock, title: "Zero-knowledge vault", text: "AES-256 encryption. Even we cannot read your briefs." },
            { icon: Zap, title: "Match in seconds", text: "Specialty-tuned matching across 1,200+ practitioners." },
            { icon: Users, title: "Bar-verified", text: "Every lawyer is vetted, insured, and continuously rated." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 180, damping: 22 }}
              className="surface rounded-2xl p-6"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl chip-emerald">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 surface-lg rounded-3xl p-10 text-center"
        >
          <Sparkles className="mx-auto h-6 w-6 text-accent" />
          <h2 className="mt-3 font-display text-3xl">Ready to find your counsel?</h2>
          <Link
            to="/directory"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground glow-primary"
          >
            Explore lawyers <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground border-t border-border pt-6">
          <div className="inline-flex items-center gap-2">
            <FileText className="h-3 w-3" /> © 2026 Avocat-Link
          </div>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/messages" className="inline-flex items-center gap-1 hover:text-foreground"><MessageSquare className="h-3 w-3" /> Support</Link>
          </div>
        </footer>
      </main>
    </>
  );
}
