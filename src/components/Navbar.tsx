import { Link, useLocation } from "@tanstack/react-router";
import { Scale, LayoutDashboard, Users, LogIn } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  { to: "/directory", label: "Directory", icon: Users },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Navbar() {
  const loc = useLocation();
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="sticky top-4 z-50 mx-auto mt-4 w-[min(1200px,calc(100%-2rem))]"
    >
      <div className="glass-strong flex items-center justify-between rounded-2xl px-5 py-3">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Scale className="h-4.5 w-4.5 text-white" strokeWidth={2.4} />
            <div className="absolute inset-0 rounded-xl bg-primary/40 blur-lg opacity-60 group-hover:opacity-100 transition" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">Avocat<span className="text-gradient">·</span>Link</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Premium LegalTech</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = loc.pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className="relative px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  <l.icon className="h-4 w-4" />
                  {l.label}
                </span>
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-white/8 ring-1 ring-white/10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/login"
          className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_0_30px_-8px_rgba(99,102,241,0.7)] transition hover:shadow-[0_0_40px_-4px_rgba(99,102,241,0.8)]"
        >
          <LogIn className="h-4 w-4" />
          Sign in
        </Link>
      </div>
    </motion.header>
  );
}
