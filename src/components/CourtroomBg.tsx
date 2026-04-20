import light from "@/assets/courtroom-light.jpg";
import dark from "@/assets/courtroom-dark.jpg";

/**
 * Fixed courtroom photo backdrop with strong themed overlay for legibility.
 * Both images are layered; dark fades in via the .dark variant.
 */
export function CourtroomBg() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20">
      <img
        src={light}
        alt=""
        width={1920}
        height={1280}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.18] dark:opacity-0 transition-opacity duration-700"
      />
      <img
        src={dark}
        alt=""
        width={1920}
        height={1280}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-0 dark:opacity-[0.35] transition-opacity duration-700"
      />
      {/* Legibility overlay */}
      <div className="absolute inset-0 bg-white/80 dark:bg-[#0B0F19]/85 backdrop-blur-[2px]" />
    </div>
  );
}
