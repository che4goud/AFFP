"use client";

import { motion } from "framer-motion";
import { useDarkMode } from "@/lib/darkMode";

export default function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode();

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 1000,
        width: 44,
        height: 44,
        borderRadius: "50%",
        backgroundColor: "var(--color-ink)",
        color: "var(--color-cream)",
        border: "1.5px solid var(--color-cream-border)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
        transition: "background-color 0.25s, color 0.25s",
      }}
    >
      {isDark ? "☀" : "◑"}
    </motion.button>
  );
}
