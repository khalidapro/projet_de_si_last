import { motion, useScroll, useTransform } from "framer-motion";

export function ScrollGlow() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["10%", "85%"]);
  const x = useTransform(scrollYProgress, [0, 0.5, 1], ["20%", "70%", "30%"]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{ top: y, left: x }}
        className="absolute h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.55),transparent_60%)]" />
      </motion.div>
      <motion.div
        style={{ top: useTransform(scrollYProgress, [0, 1], ["80%", "10%"]) }}
        className="absolute right-[-10%] h-[420px] w-[420px] rounded-full blur-[140px]"
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.45),transparent_60%)]" />
      </motion.div>
    </div>
  );
}
