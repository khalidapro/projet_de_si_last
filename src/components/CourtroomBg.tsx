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

      {/* Theme overlay — light mode: warm parchment wash; dark mode: deep sepia night */}
      <div className="absolute inset-0 bg-[oklch(0.93_0.03_70)]/72 dark:bg-[oklch(0.12_0.02_45)]/82" />

      {/* Soft top-to-bottom darken for header legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.93_0.03_70)]/40 via-transparent to-[oklch(0.85_0.03_60)]/45 dark:from-[oklch(0.1_0.02_45)]/55 dark:via-transparent dark:to-[oklch(0.08_0.02_45)]/70" />

      {/* Radial vignette */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_0%,transparent_45%,oklch(0.3_0.05_45/0.3)_100%)] dark:[background:radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,oklch(0_0_0/0.65)_100%)]" />

      {/* Warm halo for hero glow */}
      <div className="absolute left-1/2 top-1/2 h-[55vmax] w-[55vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.85_0.09_60)]/12 blur-3xl dark:bg-[oklch(0.7_0.13_55)]/10" />
    </div>
  );
}
