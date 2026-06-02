"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const MIN_AGE = 18;
const MAX_AGE = 100;
const DEFAULT_AGE = 30;

interface AgeQuestionProps {
  selected?: number;
  onAnswer: (value: number) => void;
}

export default function AgeQuestion({ selected, onAnswer }: AgeQuestionProps) {
  const [age, setAge] = useState(selected ?? DEFAULT_AGE);

  const fillPct = ((age - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100;

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Question text */}
      <div className="text-center">
        <p
          className="text-sm tracking-[0.2em] uppercase font-mono mb-3"
          style={{ color: "var(--color-ink-light)" }}
        >
          Question 2 of 6
        </p>
        <h2
          className="text-4xl sm:text-5xl leading-tight"
          style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}
        >
          How old are you?
        </h2>
      </div>

      {/* Age display */}
      <div className="flex flex-col items-center gap-1 select-none">
        <motion.span
          key={age}
          initial={{ opacity: 0.6, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.12 }}
          className="font-serif text-[clamp(3.5rem,18vw,5.5rem)]"
          style={{
            fontFamily: "var(--font-serif)",
            lineHeight: 1,
            color: "var(--color-ink)",
            fontStyle: "italic",
          }}
        >
          {age}
        </motion.span>
        <span
          className="text-sm tracking-[0.18em] uppercase font-mono"
          style={{ color: "var(--color-ink-light)" }}
        >
          years old
        </span>
      </div>

      {/* Slider */}
      <div className="w-full max-w-lg flex flex-col gap-3">
        <div className="relative h-10 flex items-center">
          {/* Track background */}
          <div
            className="absolute left-0 right-0 h-0.5 rounded-full"
            style={{ backgroundColor: "var(--color-cream-border)" }}
          />
          {/* Track fill */}
          <motion.div
            className="absolute left-0 h-0.5 rounded-full"
            style={{ backgroundColor: "var(--color-ink)" }}
            animate={{ width: `${fillPct}%` }}
            transition={{ duration: 0.05 }}
          />
          {/* Native range input — invisible but functional */}
          <input
            type="range"
            min={MIN_AGE}
            max={MAX_AGE}
            step={1}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            style={{ height: "100%", zIndex: 10 }}
          />
          {/* Custom thumb */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: `calc(${fillPct}% - 11px)`,
              width: 22,
              height: 22,
              borderRadius: "50%",
              backgroundColor: "var(--color-ink)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.22)",
              border: "3px solid var(--color-cream)",
            }}
            animate={{ left: `calc(${fillPct}% - 11px)` }}
            transition={{ duration: 0.05 }}
          />
        </div>

        {/* Min / max labels */}
        <div className="flex justify-between">
          <span
            className="text-xs font-mono"
            style={{ color: "var(--color-ink-light)" }}
          >
            {MIN_AGE}
          </span>
          <span
            className="text-xs font-mono"
            style={{ color: "var(--color-ink-light)" }}
          >
            {MAX_AGE}
          </span>
        </div>
      </div>

      {/* Continue button */}
      <motion.button
        onClick={() => onAnswer(age)}
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
        Continue
      </motion.button>
    </div>
  );
}
