import justice from "@/assets/justice-hero.png";

/**
 * Lady Justice backdrop. Sepia/chocolate tones, full-bleed with vignette.
 * Light mode: softer wash so foreground text stays legible.
 * Dark mode: deeper wash, image more present.
 */
export function CourtroomBg() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {/* Hero image — anchored right, slightly cropped, low-opacity for legibility */}
      <img
        src={justice}
        alt=""
        width={1200}
        height={900}
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover object-[70%_center] opacity-[0.22] dark:opacity-[0.38] transition-opacity duration-700"
      />
      {/* Warm parchment wash to lock palette */}
      <div className="absolute inset-0 bg-[oklch(0.93_0.03_70)]/70 dark:bg-[oklch(0.16_0.025_45)]/72" />
      {/* Left-to-right gradient so left column reads cleanly, right shows the figure */}
      <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.93_0.03_70)]/85 via-[oklch(0.93_0.03_70)]/40 to-transparent dark:from-[oklch(0.14_0.025_45)]/90 dark:via-[oklch(0.14_0.025_45)]/55 dark:to-transparent" />
      {/* Radial corner vignette */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_0%,transparent_50%,oklch(0.3_0.05_45/0.25)_100%)] dark:[background:radial-gradient(ellipse_at_center,transparent_0%,transparent_45%,oklch(0_0_0/0.6)_100%)]" />
      {/* Warm halo */}
      <div className="absolute left-1/2 top-1/2 h-[55vmax] w-[55vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.85_0.09_60)]/15 blur-3xl dark:bg-[oklch(0.7_0.13_55)]/12" />
    </div>
  );
}
