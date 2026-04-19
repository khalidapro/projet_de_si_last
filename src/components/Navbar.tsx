import { Link, useLocation } from "@tanstack/react-router";
import { Scale, LayoutDashboard, Users, LogIn, Briefcase, Inbox, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";

const clientLinks = [
  { to: "/directory", label: "Directory", icon: Users },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];
const lawyerLinks = [
  { to: "/workspace", label: "Workspace", icon: Briefcase },
  { to: "/workspace/requests", label: "Requests", icon: Inbox },
];

export function Navbar() {
  const loc = useLocation();
  const user = useApp((s) => s.user);
  const setUser = useApp((s) => s.setUser);
  const links = user?.role === "lawyer" ? lawyerLinks : clientLinks;

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
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {user?.role === "lawyer" ? "Lawyer Workspace" : "Premium LegalTech"}
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = loc.pathname === l.to || (l.to !== "/workspace" && loc.pathname.startsWith(l.to));
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

        {user ? (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 glass rounded-xl px-3 py-1.5">
              <div className={`h-2 w-2 rounded-full ${user.role === "lawyer" ? "bg-cyan-400" : "bg-emerald-400"} animate-pulse`} />
              <span className="text-xs font-medium">{user.name}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{user.role}</span>
            </div>
            <button
              onClick={() => setUser(null)}
              className="grid h-9 w-9 place-items-center rounded-xl glass hover:bg-white/10 transition"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_0_30px_-8px_rgba(99,102,241,0.7)]"
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </Link>
        )}
      </div>
    </motion.header>
  );
}
