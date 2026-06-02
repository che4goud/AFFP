"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Screen from "./Screen";
import Keyboard from "./Keyboard";

type ScreenState = "idle" | "booting" | "ready";

export default function RetroComputer() {
  const [screenState, setScreenState] = useState<ScreenState>("idle");
  const [typedChars, setTypedChars] = useState("");

  const handleKeyPress = (char: string) => {
    if (char === "BACKSPACE") {
      setTypedChars((p) => p.slice(0, -1));
    } else if (char === "ENTER") {
      handleActivate();
    } else {
      setTypedChars((p) => (p + char).slice(-12));
    }
  };

  const handleActivate = () => {
    if (screenState === "idle") {
      setTypedChars("");
      setScreenState("booting");
      setTimeout(() => setScreenState("ready"), 1900);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
      className="flex flex-col items-center gap-3 animate-float"
    >
      {/* ── Computer body ── */}
      <motion.div
        whileHover={{ rotate: 0.5, scale: 1.01 }}
        transition={{ duration: 0.3 }}
        className="relative"
        style={{
          width: 260,
          backgroundColor: "#ddd9d0",
          borderRadius: 14,
          padding: "16px 16px 12px",
          boxShadow:
            "6px 6px 0px #b8b3aa, 0 12px 40px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.5)",
          border: "1.5px solid #c8c3ba",
        }}
      >
        {/* Top highlight ridge */}
        <div
          className="absolute top-0 left-4 right-4 h-px"
          style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
        />

        {/* ── Screen bezel ── */}
        <div
          style={{
            backgroundColor: "#2a2a28",
            borderRadius: 8,
            padding: "8px 8px 6px",
            boxShadow: "inset 0 3px 10px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          {/* Actual screen */}
          <div
            style={{
              height: 160,
              borderRadius: 4,
              overflow: "hidden",
              backgroundColor: "var(--color-screen-bg)",
            }}
          >
            <Screen
              typedChars={typedChars}
              onActivate={handleActivate}
              screenState={screenState}
              onStateChange={setScreenState}
            />
          </div>

          {/* Bezel label */}
          <div className="flex justify-center mt-1.5">
            <span
              className="text-[7px] font-mono tracking-widest"
              style={{ color: "#6a6860" }}
            >
              AFO
            </span>
          </div>
        </div>

        {/* ── Below screen: floppy + brand ── */}
        <div className="flex items-center justify-between mt-3 px-1">
          {/* Floppy drive */}
          <div
            style={{
              width: 80,
              height: 10,
              backgroundColor: "#c8c3ba",
              borderRadius: 2,
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.25)",
              border: "1px solid #b0ab9f",
            }}
          />

          {/* Brand dots (retro rainbow-style) */}
          <div className="flex gap-0.5 items-center">
            {["#c0392b", "#e67e22", "#f1c40f", "#27ae60", "#2980b9"].map(
              (c, i) => (
                <div
                  key={i}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    backgroundColor: c,
                    boxShadow: `0 0 3px ${c}66`,
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* Speaker dots */}
        <div className="flex gap-0.5 justify-end mt-2 pr-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                backgroundColor: "#b8b3aa",
              }}
            />
          ))}
        </div>

        {/* ── Stickers ── */}
        {/* Star badge */}
        <motion.div
          whileHover={{ rotate: -5, scale: 1.1 }}
          transition={{ duration: 0.2 }}
          className="absolute cursor-pointer"
          style={{
            left: -18,
            bottom: 38,
            width: 38,
            height: 38,
            backgroundColor: "#1a2740",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.3)",
            border: "2px solid #2a3a5a",
          }}
        >
          <span style={{ fontSize: 18 }}>★</span>
        </motion.div>

        {/* RISK INTEL badge */}
        <motion.div
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.2 }}
          className="absolute cursor-pointer"
          style={{
            right: -22,
            bottom: 44,
            backgroundColor: "#6b1a1a",
            borderRadius: 4,
            padding: "3px 6px",
            boxShadow: "2px 2px 5px rgba(0,0,0,0.35)",
            border: "1px solid #8b2a2a",
          }}
        >
          <span
            style={{
              fontSize: 7,
              color: "#fff",
              fontFamily: "var(--font-space-mono), monospace",
              fontWeight: 700,
              letterSpacing: "0.08em",
              whiteSpace: "nowrap",
            }}
          >
            RISK INTEL
          </span>
        </motion.div>

        {/* Small shield */}
        <motion.div
          whileHover={{ rotate: 8, scale: 1.1 }}
          transition={{ duration: 0.2 }}
          className="absolute cursor-pointer"
          style={{
            right: -14,
            top: 18,
            fontSize: 22,
          }}
        >
          🛡️
        </motion.div>
      </motion.div>

      {/* ── Keyboard ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{ width: 300 }}
      >
        <Keyboard onKeyPress={handleKeyPress} />
      </motion.div>

      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2 }}
        className="text-[10px] tracking-widest uppercase font-mono"
        style={{ color: "var(--color-ink-light)" }}
      >
        {screenState === "idle"
          ? "Click screen or type to begin"
          : screenState === "booting"
          ? "Initialising..."
          : "Assessment module loaded"}
      </motion.p>
    </motion.div>
  );
}
