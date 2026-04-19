import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Mail, Lock, ArrowRight, User, KeyRound, Search, Check } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [step, setStep] = useState<"login" | 1 | 2 | 3>("login");
  const [email, setEmail] = useState("alex@avocat-link.io");
  const [name, setName] = useState("Alex Mercier");
  const navigate = useNavigate();
  const setUser = useApp((s) => s.setUser);

  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(1);
  };

  const finish = () => {
    setUser({ name, email });
    navigate({ to: "/directory" });
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left — form */}
      <div className="relative flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="font-display text-2xl">Avocat<span className="text-gradient">·</span>Link</div>

          <AnimatePresence mode="wait">
            {step === "login" && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                onSubmit={submitLogin}
                className="mt-10"
              >
                <h1 className="font-display text-3xl">Welcome back.</h1>
                <p className="mt-1 text-sm text-muted-foreground">Sign in to your secure portal.</p>

                <label className="mt-8 block text-xs uppercase tracking-wider text-muted-foreground">Email</label>
                <div className="mt-1.5 flex items-center gap-2 glass rounded-xl px-3.5 py-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
                <label className="mt-4 block text-xs uppercase tracking-wider text-muted-foreground">Password</label>
                <div className="mt-1.5 flex items-center gap-2 glass rounded-xl px-3.5 py-3">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <input type="password" defaultValue="••••••••••" className="flex-1 bg-transparent text-sm outline-none" />
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent py-3 text-sm font-semibold text-white glow-primary"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </motion.form>
            )}

            {step !== "login" && (
              <OnboardingFlow
                key={`step-${step}`}
                step={step as 1 | 2 | 3}
                name={name}
                setName={setName}
                onNext={() => (step === 3 ? finish() : setStep(((step as number) + 1) as 1 | 2 | 3))}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right — visual */}
      <div className="relative hidden md:block bg-app overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
        <div className="relative h-full flex flex-col items-center justify-center p-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="glass-strong rounded-3xl p-10 max-w-md text-center"
          >
            <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 ring-1 ring-emerald-400/30 glow-emerald">
              <ShieldCheck className="h-10 w-10 text-emerald-300" />
              <span className="absolute inset-0 rounded-2xl pulse-ring" />
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              End-to-End Encrypted
            </div>
            <h2 className="mt-6 font-display text-3xl">Your privilege, protected.</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Communications are encrypted client-side. We physically cannot access them.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function OnboardingFlow({ step, name, setName, onNext }: { step: 1 | 2 | 3; name: string; setName: (s: string) => void; onNext: () => void }) {
  const steps = [
    { icon: User, title: "Profile setup", text: "Tell us who you are. This stays private." },
    { icon: KeyRound, title: "Security brief", text: "Your data is encrypted with keys only you hold." },
    { icon: Search, title: "Find your lawyer", text: "We'll match you in seconds." },
  ];
  const meta = steps[step - 1];

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className="mt-10"
    >
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-gradient-to-r from-primary to-accent" : "bg-white/10"}`} />
        ))}
      </div>

      <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 ring-1 ring-white/10">
        <meta.icon className="h-5 w-5" />
      </div>
      <h2 className="mt-4 font-display text-3xl">{meta.title}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">{meta.text}</p>

      {step === 1 && (
        <div className="mt-6">
          <label className="block text-xs uppercase tracking-wider text-muted-foreground">Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full glass rounded-xl px-3.5 py-3 text-sm outline-none"
          />
        </div>
      )}
      {step === 2 && (
        <div className="mt-6 glass rounded-xl p-4 text-sm text-muted-foreground">
          <ul className="space-y-2">
            <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" /> Documents encrypted client-side with AES-256.</li>
            <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" /> Zero-knowledge architecture — staff cannot decrypt.</li>
            <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" /> Annual independent security audits.</li>
          </ul>
        </div>
      )}
      {step === 3 && (
        <div className="mt-6 glass rounded-xl p-5 text-center">
          <div className="text-4xl">⚖️</div>
          <p className="mt-2 text-sm text-muted-foreground">Ready to browse 1,200+ vetted lawyers.</p>
        </div>
      )}

      <button
        onClick={onNext}
        className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent py-3 text-sm font-semibold text-white glow-primary"
      >
        {step === 3 ? "Enter Avocat-Link" : "Continue"} <ArrowRight className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
