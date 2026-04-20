import light from "@/assets/parchment-light.jpg";
import dark from "@/assets/parchment-dark.jpg";

/**
 * Parchment & stone backdrop with corner vignette + central glassmorphism halo.
 * Light mode: aged parchment in beige/taupe. Dark mode: deep chocolate.
 */
export function CourtroomBg() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <img
        src={light}
        alt=""
        width={1920}
        height={1280}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-100 dark:opacity-0 transition-opacity duration-700"
      />
      <img
        src={dark}
        alt=""
        width={1920}
        height={1280}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-0 dark:opacity-100 transition-opacity duration-700"
      />
      {/* Soft tint wash to lock palette */}
      <div className="absolute inset-0 bg-[oklch(0.945_0.025_75)]/55 dark:bg-[oklch(0.18_0.025_50)]/70" />
      {/* Radial vignette: lighter center, darker corners */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_0%,transparent_45%,oklch(0.36_0.05_55/0.18)_100%)] dark:[background:radial-gradient(ellipse_at_center,transparent_0%,transparent_45%,oklch(0_0_0/0.55)_100%)]" />
      {/* Subtle warm glow halo in the center */}
      <div className="absolute left-1/2 top-1/2 h-[55vmax] w-[55vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.99_0.003_80)]/30 blur-3xl dark:bg-[oklch(0.78_0.12_60)]/10" />
    </div>
  );
}
