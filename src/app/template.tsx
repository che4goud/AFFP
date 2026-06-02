"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      {/* Content fades in after the curtain sweeps away */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, delay: 0.38 }}
      >
        {children}
      </motion.div>

      {/* Ink curtain: slides in from the right covering the screen, then exits to the left */}
      <motion.div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          backgroundColor: "var(--color-ink)",
          pointerEvents: "none",
        }}
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{
          clipPath: [
            "inset(0 100% 0 0)",
            "inset(0 0% 0 0)",
            "inset(0 0% 0 100%)",
          ],
        }}
        transition={{ duration: 0.72, times: [0, 0.42, 1], ease: "easeInOut" }}
      />
    </div>
  );
}
