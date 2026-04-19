import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, ArrowRight, Lock, Zap, Users } from "lucide-react";
import { Decrypt } from "@/components/Decrypt";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="relative mx-auto max-w-6xl px-6 pt-20 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-muted-foreground">End-to-End Encrypted · Bar-vetted lawyers</span>
        </div>

        <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05]">
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
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3.5 text-sm font-semibold text-white glow-primary"
          >
            Browse the directory
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3.5 text-sm font-semibold"
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
            className="glass rounded-2xl p-6"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 ring-1 ring-white/10">
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
        className="mt-24 glass-strong rounded-3xl p-10 text-center"
      >
        <Sparkles className="mx-auto h-6 w-6 text-accent" />
        <h2 className="mt-3 font-display text-3xl">Ready to find your counsel?</h2>
        <Link
          to="/directory"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white glow-primary"
        >
          Explore lawyers <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </main>
  );
}
