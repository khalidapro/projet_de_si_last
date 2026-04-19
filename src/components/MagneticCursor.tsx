import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function MagneticCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setVisible(true);
      const target = e.target as HTMLElement;
      const interactive = target.closest("a,button,input,textarea,select,[role='button'],[data-magnetic]");
      if (interactive) {
        const r = interactive.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        // magnetic snap toward center
        x.set(cx + (e.clientX - cx) * 0.25);
        y.set(cy + (e.clientY - cy) * 0.25);
        setHovering(true);
      } else {
        x.set(e.clientX);
        y.set(e.clientY);
        setHovering(false);
      }
    };
    const leave = () => setVisible(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-screen"
        style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
      >
        <motion.div
          animate={{
            width: hovering ? 44 : 10,
            height: hovering ? 44 : 10,
            backgroundColor: hovering ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.95)",
            borderColor: hovering ? "rgba(6,182,212,0.9)" : "transparent",
          }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ boxShadow: "0 0 24px rgba(99,102,241,0.7)" }}
        />
      </motion.div>
    </>
  );
}
