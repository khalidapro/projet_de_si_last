import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCircle2, Clock4, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/lib/store";
import { CLIENT_NOTIFS, LAWYER_NOTIFS, type Notif } from "@/lib/notifications";

export function NotificationsBell() {
  const role = useApp((s) => s.user?.role) ?? "client";
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notif[]>(role === "lawyer" ? LAWYER_NOTIFS : CLIENT_NOTIFS);
  const ref = useRef<HTMLDivElement>(null);
  const unread = items.filter((i) => i.unread).length;

  useEffect(() => {
    setItems(role === "lawyer" ? LAWYER_NOTIFS : CLIENT_NOTIFS);
  }, [role]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  const markAll = () => setItems((prev) => prev.map((i) => ({ ...i, unread: false })));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        data-magnetic
        className="relative grid h-10 w-10 place-items-center rounded-xl surface hover:bg-secondary transition"
        aria-label="Notifications"
      >
        <Bell className="h-4.5 w-4.5 text-foreground" strokeWidth={2.2} />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-[oklch(0.78_0.18_70)] px-1 text-[10px] font-bold text-white glow-amber"
          >
            {unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="absolute right-0 mt-3 w-[340px] glass-strong rounded-2xl overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="font-display text-base">Notifications</div>
              <button onClick={markAll} className="text-[11px] text-primary hover:underline">Mark all read</button>
            </div>
            <div className="max-h-[360px] overflow-y-auto">
              {items.map((n, idx) => {
                const Icon = n.tone === "emerald" ? CheckCircle2 : n.tone === "rose" ? XCircle : Clock4;
                const chip = n.tone === "emerald" ? "chip-emerald" : n.tone === "rose" ? "chip-rose" : "chip-amber";
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`flex gap-3 px-4 py-3 border-b border-border/60 ${n.unread ? "bg-secondary/40" : ""}`}
                  >
                    <div className={`grid h-8 w-8 place-items-center rounded-lg ${chip}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold truncate">{n.title}</div>
                        {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.18_70)]" />}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.body}</p>
                      <div className="text-[10px] text-muted-foreground mt-1">{n.time}</div>
                    </div>
                  </motion.div>
                );
              })}
              {items.length === 0 && (
                <div className="text-center text-xs text-muted-foreground py-10">All caught up.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
