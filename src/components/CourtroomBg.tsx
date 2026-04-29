import { motion } from "framer-motion";
import courtroom from "@/assets/courtroom-cinematic.jpg";

/**
 * Cinematic courtroom backdrop with Ken Burns effect.
 * - Slow infinite scale (1 → 1.05) + subtle drift so the room feels alive
 * - Heavy theme-aware overlay for high text contrast
 * - Warm vignette to focus the eye on center content
 */
export function CourtroomBg() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {/* Ken Burns image layer */}
      <motion.img
        src={courtroom}
        alt=""
        width={1920}
        height={1080}
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1, x: "0%", y: "0%" }}
        animate={{
          scale: [1, 1.05, 1.03, 1],
          x: ["0%", "-1.2%", "1%", "0%"],
          y: ["0%", "1%", "-0.8%", "0%"],
        }}
        transition={{ duration: 40, ease: "easeInOut", repeat: Infinity }}
      />

      {/*
        Light theme: Cream/Beige (#F5E0C8) wash at ~20% so the courtroom
        artwork stays clearly visible. The cognac foreground (#96694C) keeps
        sufficient contrast against this softer veil.
      */}
      <div className="absolute inset-0 bg-[oklch(0.91_0.04_75)]/20 dark:bg-[oklch(0.12_0.02_45)]/55" />

      {/*
        Radial vignette — strong focus pull. Center stays fully clear (~50%
        radius), then ramps darker toward the edges to frame the UI and
        guide the eye. Overlay above remains ~20% so artwork stays visible.
      */}
      <div
        className="absolute inset-0
          [background:radial-gradient(ellipse_65%_60%_at_50%_34%,transparent_0%,transparent_50%,oklch(0.32_0.045_50/0.28)_78%,oklch(0.22_0.04_45/0.62)_100%)]
          md:[background:radial-gradient(ellipse_58%_62%_at_44%_40%,transparent_0%,transparent_50%,oklch(0.32_0.045_50/0.28)_78%,oklch(0.22_0.04_45/0.6)_100%)]
          dark:[background:radial-gradient(ellipse_65%_60%_at_50%_34%,transparent_0%,transparent_46%,oklch(0_0_0/0.58)_80%,oklch(0_0_0/0.88)_100%)]
          dark:md:[background:radial-gradient(ellipse_58%_62%_at_44%_40%,transparent_0%,transparent_46%,oklch(0_0_0/0.55)_80%,oklch(0_0_0/0.85)_100%)]"
      />

      {/* Warm halo positioned over hero (upper-left third on desktop) */}
      <div className="absolute left-1/2 top-[32%] md:left-[42%] md:top-[38%] h-[55vmax] w-[55vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.85_0.09_60)]/14 blur-3xl dark:bg-[oklch(0.7_0.13_55)]/14" />
    </div>
  );
}
