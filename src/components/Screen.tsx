"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ScreenState = "idle" | "booting" | "ready";

interface ScreenProps {
  typedChars: string;
  onActivate: () => void;
  screenState: ScreenState;
  onStateChange: (state: ScreenState) => void;
}

const BOOT_LINES = [
  "RISK ASSESSMENT v1.0",
  "──────────────────",
  "ARMED FORCES",
  "FINANCIAL INTELLIGENCE",
  "SYSTEM",
  "──────────────────",
  "> Initialising...",
  "> System ready.",
  "",
  "[CLICK TO BEGIN]",
];

export default function Screen({
  typedChars,
  onActivate,
  screenState,
  onStateChange,
}: ScreenProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [bootDone, setBootDone] = useState(false);
  const lineRef = useRef(0);

  useEffect(() => {
    if (screenState !== "idle") return;
    lineRef.current = 0;
    setVisibleLines([]);
    setBootDone(false);

    const interval = setInterval(() => {
      const idx = lineRef.current;
      if (idx >= BOOT_LINES.length) {
        clearInterval(interval);
        setBootDone(true);
        return;
      }
      setVisibleLines((prev) => [...prev, BOOT_LINES[idx]]);
      lineRef.current = idx + 1;
    }, 200);

    return () => clearInterval(interval);
  }, [screenState]);

  const handleClick = () => {
    if (!bootDone) return;
    onActivate();
    onStateChange("booting");
    setTimeout(() => onStateChange("ready"), 1800);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative w-full h-full overflow-hidden rounded-sm cursor-pointer select-none ${
        screenState === "idle" ? "screen-idle" : ""
      }`}
      style={{ backgroundColor: "var(--color-screen-bg)" }}
    >
      {/* Scanlines overlay */}
      <div className="scanlines absolute inset-0 z-10 rounded-sm" />

      {/* Screen vignette */}
      <div
        className="absolute inset-0 z-20 rounded-sm pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-30 h-full flex flex-col justify-start p-3 overflow-hidden">
        <AnimatePresence mode="wait">
          {screenState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-0"
            >
              {visibleLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`leading-tight text-[9px] font-mono ${
                    line.startsWith(">")
                      ? "phosphor-text-dim"
                      : line.startsWith("─")
                      ? "phosphor-text-dim"
                      : line.startsWith("[")
                      ? "phosphor-text text-center"
                      : line === "RISK ASSESSMENT v1.0"
                      ? "phosphor-text font-bold text-[11px]"
                      : line === ""
                      ? ""
                      : "phosphor-text"
                  }`}
                >
                  {line || " "}
                </motion.div>
              ))}

              {bootDone && (
                <div className="mt-1 flex gap-0.5 items-center">
                  <span className="text-[9px] phosphor-text-dim font-mono">
                    &gt;{" "}
                  </span>
                  <span className="text-[9px] phosphor-text font-mono">
                    {typedChars}
                  </span>
                  <span className="cursor-blink text-[9px] phosphor-text font-mono">
                    ▋
                  </span>
                </div>
              )}
            </motion.div>
          )}

          {screenState === "booting" && (
            <motion.div
              key="booting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-0.5"
            >
              {[
                "> Loading profile module...",
                "> Calibrating weights...",
                "> Linking asset classes...",
                "> Assessment ready.",
              ].map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.38, duration: 0.2 }}
                  className="text-[9px] phosphor-text-dim font-mono leading-tight"
                >
                  {line}
                </motion.div>
              ))}
            </motion.div>
          )}

          {screenState === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col h-full justify-between"
            >
              <div>
                <div className="phosphor-text font-bold text-[10px] font-mono mb-1">
                  RISK ASSESSMENT v1.0
                </div>
                <div className="phosphor-text-dim text-[8px] font-mono mb-2">
                  ──────────────────
                </div>
                <div className="phosphor-text text-[9px] font-mono leading-relaxed">
                  <div>OFFICER RISK</div>
                  <div>ASSESSMENT</div>
                  <div className="mt-1 phosphor-text-dim">
                    Questions: 6
                  </div>
                  <div className="phosphor-text-dim">
                    Model: Regression
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="phosphor-text text-[9px] font-mono animate-pulse">
                  [SCROLL DOWN]
                </div>
                <div className="phosphor-text-dim text-[7px] font-mono">
                  TO BEGIN
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
