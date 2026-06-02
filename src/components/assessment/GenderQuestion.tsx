"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Gender } from "@/lib/assessmentTypes";

interface GenderQuestionProps {
  selected?: Gender;
  onAnswer: (value: Gender) => void;
}

const OPTIONS: { value: Gender; label: string; icon: React.ReactNode }[] = [
  {
    value: "male",
    label: "Male",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="15" r="8" stroke="currentColor" strokeWidth="2" />
        <line x1="20" y1="23" x2="20" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="14" y1="30" x2="26" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="26" y1="6" x2="34" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="34" y1="6" x2="34" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="26" y1="6" x2="26.5" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "female",
    label: "Female",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="14" r="8" stroke="currentColor" strokeWidth="2" />
        <line x1="20" y1="22" x2="20" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="14" y1="29" x2="26" y2="29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "prefer_not_to_say",
    label: "Prefer not to say",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2" />
        <circle cx="14" cy="20" r="1.5" fill="currentColor" />
        <circle cx="20" cy="20" r="1.5" fill="currentColor" />
        <circle cx="26" cy="20" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

const cardVariants = {
  rest: { y: 0, boxShadow: "0 4px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)" },
  hover: { y: -7, boxShadow: "0 14px 36px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.08)" },
  tap:   { y: -2, scale: 0.97, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
};

export default function GenderQuestion({ selected, onAnswer }: GenderQuestionProps) {
  const [localSelected, setLocalSelected] = useState<Gender | undefined>(selected);

  const handleSelect = (value: Gender) => {
    setLocalSelected(value);
    setTimeout(() => onAnswer(value), 320);
  };

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Question text */}
      <div className="text-center">
        <p
          className="text-sm tracking-[0.2em] uppercase font-mono mb-3"
          style={{ color: "var(--color-ink-light)" }}
        >
          Question 1 of 6
        </p>
        <h2
          className="text-4xl sm:text-5xl leading-tight"
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--color-ink)",
          }}
        >
          What is your gender?
        </h2>
      </div>

      {/* Option cards */}
      <div className="flex flex-col sm:flex-row gap-5 w-full max-w-2xl justify-center">
        {OPTIONS.map(({ value, label, icon }, i) => {
          const isSelected = localSelected === value;
          return (
            <motion.button
              key={value}
              onClick={() => handleSelect(value)}
              variants={cardVariants}
              initial="rest"
              whileHover={isSelected ? undefined : "hover"}
              whileTap="tap"
              animate={
                isSelected
                  ? {
                      y: -4,
                      boxShadow: "0 8px 28px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.08)",
                    }
                  : "rest"
              }
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              custom={i}
              className="relative flex flex-col items-center justify-center gap-4 px-6 sm:px-8 py-7 sm:py-10 rounded-2xl cursor-pointer select-none flex-1 min-w-[120px]"
              style={{
                backgroundColor: isSelected ? "var(--color-cream-dark)" : "var(--color-cream)",
                border: `1.5px solid ${isSelected ? "var(--color-ink)" : "var(--color-cream-border)"}`,
                fontFamily: "var(--font-serif)",
                outline: "none",
              }}
            >
              {/* Selected dot indicator */}
              {isSelected && (
                <motion.div
                  layoutId="selected-dot"
                  className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: "var(--color-ink)" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                />
              )}

              {/* Icon */}
              <div
                style={{
                  color: isSelected ? "var(--color-ink)" : "var(--color-ink-muted)",
                  transition: "color 0.2s ease",
                }}
              >
                {icon}
              </div>

              {/* Label */}
              <span
                className="text-base text-center leading-snug"
                style={{
                  color: isSelected ? "var(--color-ink)" : "var(--color-ink-muted)",
                  fontWeight: isSelected ? 600 : 400,
                  fontFamily: "var(--font-serif)",
                  transition: "color 0.2s ease, font-weight 0.1s ease",
                }}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
