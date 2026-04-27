import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, ArrowRight, Lock, Zap, Users, Scale, MessageSquare, FileText, Quote } from "lucide-react";
import { Decrypt } from "@/components/Decrypt";

const HERO_IMG = "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1200";
const PORTRAIT_IMG = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800";
const COLLAB_IMG = "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "Avocat-Link — Find your lawyer in seconds" },
      { name: "description", content: "Premium legal-tech platform. Encrypted briefs, vetted attorneys, instant matching." },
      { property: "og:title", content: "Avocat-Link — Premium LegalTech" },
      { property: "og:description", content: "Encrypted briefs. Bar-vetted attorneys. Instant matching." },
      { property: "og:image", content: HERO_IMG },
      { name: "twitter:image", content: HERO_IMG },
    ],
  }),
});

function LandingPage() {
  return (
    <>
      <header className="sticky top-4 z-40 mx-auto mt-4 w-[min(1200px,calc(100%-2rem))]">
        <div className="glass-strong flex items-center justify-between rounded-2xl px-5 py-3 backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)]">
              <Scale className="h-4.5 w-4.5 text-primary-foreground" strokeWidth={2.4} />
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

      <main className="relative mx-auto max-w-6xl px-6 pt-16 pb-32">
        {/* HERO — Supreme Court image with glassmorphism overlay */}
        <section className="relative overflow-hidden rounded-3xl ring-1 ring-border">
          <div className="absolute inset-0">
            <img
              src={HERO_IMG}
              alt="Supreme courthouse columns at golden hour"
              className="h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/55 to-background/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(166,123,91,0.25),transparent_60%)]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            className="relative px-6 py-20 md:px-14 md:py-28 text-center backdrop-blur-[1px]"
          >
            <div className="inline-flex items-center gap-2 rounded-full chip-emerald px-4 py-1.5 text-xs backdrop-blur-md">
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

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/directory"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground glow-primary"
              >
                Browse the directory
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl glass-strong px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur-xl"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        </section>

        {/* FEATURES grid */}
        <div className="mt-20 grid gap-4 md:grid-cols-3">
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
              className="surface rounded-2xl p-6 backdrop-blur-md"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl chip-emerald">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
            </motion.div>
          ))}
        </div>

        {/* MOSAIC GALLERY */}
        <section className="mt-24">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full chip-amber px-3 py-1 text-[10px] uppercase tracking-wider font-semibold">
              The Network
            </div>
            <h2 className="mt-4 font-display text-3xl md:text-4xl">
              Counsel you can <span className="text-gradient">trust on sight.</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Real practitioners. Real bar registrations. Real outcomes.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3 md:grid-rows-2 md:[grid-auto-flow:dense]">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative md:col-span-2 md:row-span-2 overflow-hidden rounded-3xl ring-1 ring-border min-h-[320px]"
            >
              <img src={COLLAB_IMG} alt="Diverse lawyers collaborating around a table" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-background/20 to-transparent" />
              <div className="relative p-6 md:p-8 flex flex-col h-full justify-end min-h-[320px]">
                <div className="glass-strong rounded-2xl p-5 backdrop-blur-xl max-w-md">
                  <Quote className="h-4 w-4 text-primary mb-2" />
                  <p className="text-sm leading-relaxed">
                    "We coordinate cross-border M&A in three time zones — Avocat-Link's encrypted vault is now the only way our team shares term sheets."
                  </p>
                  <div className="mt-3 text-xs text-muted-foreground">— Clara A., Partner · Paris</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-3xl ring-1 ring-border min-h-[160px]"
            >
              <img src={PORTRAIT_IMG} alt="Calm lawyer portrait" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/30 to-transparent" />
              <div className="relative p-5 flex flex-col h-full justify-end min-h-[160px]">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Practice</div>
                <div className="font-display text-lg">Quiet confidence.</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-3xl ring-1 ring-border min-h-[160px] surface backdrop-blur-md"
            >
              <div className="relative p-5 flex flex-col h-full justify-between min-h-[160px]">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Average match</div>
                  <div className="font-display text-4xl text-gradient mt-1">42<span className="text-2xl">s</span></div>
                </div>
                <div className="text-[11px] text-muted-foreground">Across 1,200+ vetted French lawyers.</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 surface-lg rounded-3xl p-10 text-center backdrop-blur-xl"
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
