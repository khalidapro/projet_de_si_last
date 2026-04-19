import { motion } from "framer-motion";

const STEPS = ["Pending", "Analyzing", "Confirmed"] as const;
type Step = (typeof STEPS)[number];

export function StatusStepper({ status }: { status: Step }) {
  const current = STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} className="flex items-center gap-2">
            <div className="relative">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: done ? "rgb(16,185,129)" : active ? "rgb(99,102,241)" : "rgba(255,255,255,0.12)",
                  scale: active ? 1.15 : 1,
                }}
                className="h-2.5 w-2.5 rounded-full"
              />
              {active && <span className="absolute inset-0 pulse-ring rounded-full" />}
            </div>
            <span className={`text-xs font-medium ${active ? "text-foreground" : done ? "text-emerald-300" : "text-muted-foreground"}`}>{s}</span>
            {i < STEPS.length - 1 && (
              <div className="relative h-px w-8 bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: i < current ? "100%" : "0%" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-emerald-400"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
