import { motion } from "framer-motion";
import { useLocation } from "@tanstack/react-router";

/**
 * Slow opacity scene transition between routes.
 * Re-mounts on pathname change via key.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  return (
    <motion.div
      key={loc.pathname}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
