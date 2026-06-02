"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MIN = 0;
const MAX = 45;
const DEFAULT = 10;

interface YearsServiceQuestionProps {
  selected?: number;
  onAnswer: (value: number) => void;
}

export default function YearsServiceQuestion({
  selected,
  onAnswer,
}: YearsServiceQuestionProps) {
  const [years, setYears] = useState(selected ?? DEFAULT);
  const [inputMode, setInputMode] = useState(false);
  const [raw, setRaw] = useState(String(selected ?? DEFAULT));

  const clamp = (n: number) => Math.max(MIN, Math.min(MAX, n));

  const increment = () => setYears((y) => clamp(y + 1));
  const decrement = () => setYears((y) => clamp(y - 1));

  const commitInput = () => {
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) setYears(clamp(parsed));
    else setRaw(String(years));
    setInputMode(false);
  };

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Question text */}
      <div className="text-center max-w-xl">
        <p
          className="text-sm tracking-[0.2em] uppercase font-mono mb-3"
          style={{ color: "var(--color-ink-light)" }}
        >
          Question 6 of 6
        </p>
        <h2
          className="text-4xl sm:text-5xl leading-tight"
          style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}
        >
          How many years have you served in the Armed Forces?
        </h2>
      </div>

      {/* Stepper */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          {/* Decrement */}
          <motion.button
            onClick={decrement}
            disabled={years <= MIN}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl select-none"
            style={{
              backgroundColor: years <= MIN ? "var(--color-cream-dark)" : "var(--color-ink)",
              color: years <= MIN ? "var(--color-ink-light)" : "var(--color-cream)",
              border: "none",
              cursor: years <= MIN ? "not-allowed" : "pointer",
              fontFamily: "var(--font-mono)",
            }}
          >
            −
          </motion.button>

          {/* Year display — click to type */}
          <div
            className="flex flex-col items-center gap-1"
            style={{ minWidth: 140 }}
          >
            <AnimatePresence mode="wait">
              {inputMode ? (
                <motion.input
                  key="input"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  type="number"
                  value={raw}
                  min={MIN}
                  max={MAX}
                  autoFocus
                  onChange={(e) => setRaw(e.target.value)}
                  onBlur={commitInput}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitInput();
                    if (e.key === "Escape") {
                      setRaw(String(years));
                      setInputMode(false);
                    }
                  }}
                  className="text-center"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(3rem, 15vw, 5rem)",
                    lineHeight: 1,
                    fontStyle: "italic",
                    color: "var(--color-ink)",
                    width: 140,
                    background: "transparent",
                    border: "none",
                    borderBottom: "2px solid var(--color-ink)",
                    outline: "none",
                    MozAppearance: "textfield",
                  }}
                />
              ) : (
                <motion.button
                  key="display"
                  onClick={() => {
                    setRaw(String(years));
                    setInputMode(true);
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  title="Click to type"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "text",
                    padding: 0,
                  }}
                >
                  <motion.span
                    key={years}
                    initial={{ opacity: 0.5, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.12 }}
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(3rem, 15vw, 5.5rem)",
                      lineHeight: 1,
                      fontStyle: "italic",
                      color: "var(--color-ink)",
                      display: "block",
                    }}
                  >
                    {years}
                  </motion.span>
                </motion.button>
              )}
            </AnimatePresence>

            <span
              className="text-sm tracking-[0.18em] uppercase font-mono"
              style={{ color: "var(--color-ink-light)" }}
            >
              years of service
            </span>
            <span
              className="text-[10px] font-mono mt-0.5"
              style={{ color: "var(--color-ink-light)" }}
            >
              (tap number to type directly)
            </span>
          </div>

          {/* Increment */}
          <motion.button
            onClick={increment}
            disabled={years >= MAX}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl select-none"
            style={{
              backgroundColor: years >= MAX ? "var(--color-cream-dark)" : "var(--color-ink)",
              color: years >= MAX ? "var(--color-ink-light)" : "var(--color-cream)",
              border: "none",
              cursor: years >= MAX ? "not-allowed" : "pointer",
              fontFamily: "var(--font-mono)",
            }}
          >
            +
          </motion.button>
        </div>

        {/* Range hint */}
        <p
          className="text-xs font-mono"
          style={{ color: "var(--color-ink-light)" }}
        >
          Range: {MIN}–{MAX} years
        </p>
      </div>

      {/* Continue */}
      <motion.button
        onClick={() => onAnswer(years)}
        whileHover={{ backgroundColor: "var(--color-military-olive)" }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15 }}
        className="px-12 py-4 text-sm font-medium tracking-wide"
        style={{
          backgroundColor: "var(--color-ink)",
          color: "var(--color-cream)",
          fontFamily: "var(--font-sans)",
          borderRadius: 2,
          border: "none",
          cursor: "pointer",
          letterSpacing: "0.04em",
        }}
      >
        Submit Assessment
      </motion.button>
    </div>
  );
}
