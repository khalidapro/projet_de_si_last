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
        const isAmber = active && s !== "Confirmed";
        const isEmerald = active && s === "Confirmed";
        const dotColor = isEmerald
          ? "oklch(0.7 0.16 160)"
          : isAmber
          ? "oklch(0.78 0.16 75)"
          : done
          ? "oklch(0.7 0.16 160)"
          : "oklch(0.18 0.02 240 / 0.18)";
        return (
          <div key={s} className="flex items-center gap-2">
            <div className="relative">
              <motion.div
                initial={false}
                animate={{ backgroundColor: dotColor, scale: active ? 1.2 : 1 }}
                className="h-2.5 w-2.5 rounded-full"
              />
              {active && <span className="absolute inset-0 pulse-ring rounded-full" />}
            </div>
            <span className={`text-xs font-semibold ${
              isAmber ? "text-[oklch(0.5_0.18_60)]" :
              isEmerald ? "text-[oklch(0.45_0.16_160)]" :
              done ? "text-[oklch(0.45_0.16_160)]" : "text-muted-foreground"
            }`}>{s}</span>
            {i < STEPS.length - 1 && (
              <div className="relative h-px w-8 bg-border overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: i < current ? "100%" : "0%" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-primary"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
