"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { YesNoAnswer } from "@/lib/assessmentTypes";

interface YesNoQuestionProps {
  questionNumber: number;
  question: string;
  selected?: YesNoAnswer;
  onAnswer: (value: YesNoAnswer) => void;
}

const OPTIONS: {
  value: YesNoAnswer;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "yes",
    label: "Yes",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2" />
        <polyline
          points="13,20 18,25 27,14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    value: "no",
    label: "No",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2" />
        <line
          x1="14" y1="14" x2="26" y2="26"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        />
        <line
          x1="26" y1="14" x2="14" y2="26"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const cardVariants = {
  rest: {
    y: 0,
    boxShadow: "0 4px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)",
  },
  hover: {
    y: -7,
    boxShadow: "0 14px 36px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.08)",
  },
  tap: {
    y: -2,
    scale: 0.97,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
};

export default function YesNoQuestion({
  questionNumber,
  question,
  selected,
  onAnswer,
}: YesNoQuestionProps) {
  const [localSelected, setLocalSelected] = useState<YesNoAnswer | undefined>(
    selected
  );

  const handleSelect = (value: YesNoAnswer) => {
    setLocalSelected(value);
    setTimeout(() => onAnswer(value), 320);
  };

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Question text */}
      <div className="text-center max-w-xl">
        <p
          className="text-sm tracking-[0.2em] uppercase font-mono mb-3"
          style={{ color: "var(--color-ink-light)" }}
        >
          Question {questionNumber} of 6
        </p>
        <h2
          className="text-4xl sm:text-5xl leading-tight"
          style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}
        >
          {question}
        </h2>
      </div>

      {/* Option cards */}
      <div className="flex flex-col sm:flex-row gap-5 w-full max-w-2xl justify-center">
        {OPTIONS.map(({ value, label }) => {
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
                      boxShadow:
                        "0 8px 28px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.08)",
                    }
                  : "rest"
              }
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="relative flex flex-col items-center justify-center gap-4 px-6 sm:px-8 py-7 sm:py-10 rounded-2xl cursor-pointer select-none flex-1 min-w-[120px]"
              style={{
                backgroundColor: isSelected ? "var(--color-cream-dark)" : "var(--color-cream)",
                border: `1.5px solid ${
                  isSelected ? "var(--color-ink)" : "var(--color-cream-border)"
                }`,
                outline: "none",
              }}
            >
              {/* Selection dot */}
              {isSelected && (
                <motion.div
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
                  color: isSelected
                    ? "var(--color-ink)"
                    : "var(--color-ink-muted)",
                  transition: "color 0.2s ease",
                }}
              >
                {OPTIONS.find((o) => o.value === value)?.icon}
              </div>

              {/* Label */}
              <span
                className="text-base text-center leading-snug whitespace-pre-line"
                style={{
                  color: isSelected
                    ? "var(--color-ink)"
                    : "var(--color-ink-muted)",
                  fontWeight: isSelected ? 600 : 400,
                  fontFamily: "var(--font-serif)",
                  transition: "color 0.2s ease",
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
