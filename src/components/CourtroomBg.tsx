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
        Light theme: a very thin Cream/Beige (#F5E0C8 ≈ oklch(0.91 0.04 75)) wash at ~22%
        — lets the courtroom artwork breathe through while keeping warmth.
        Dark theme: keeps a stronger sepia veil so dark-mode text stays readable.
      */}
      <div className="absolute inset-0 bg-[oklch(0.91_0.04_75)]/22 dark:bg-[oklch(0.12_0.02_45)]/55" />

      {/*
        Radial vignette (replaces the old flat darken):
        - Center: fully transparent so the artwork is crisp behind the hero.
        - Edges: gentle Dark Brown fade to focus the eye and frame the UI.
      */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_0%,transparent_42%,oklch(0.32_0.045_50/0.18)_72%,oklch(0.32_0.045_50/0.42)_100%)] dark:[background:radial-gradient(ellipse_at_center,transparent_0%,transparent_38%,oklch(0_0_0/0.45)_75%,oklch(0_0_0/0.75)_100%)]" />

      {/* Warm halo for hero glow */}
      <div className="absolute left-1/2 top-1/2 h-[55vmax] w-[55vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.85_0.09_60)]/10 blur-3xl dark:bg-[oklch(0.7_0.13_55)]/10" />
    </div>
  );
}
