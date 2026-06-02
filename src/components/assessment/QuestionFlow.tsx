"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import GenderQuestion from "./GenderQuestion";
import AgeQuestion from "./AgeQuestion";
import YesNoQuestion from "./YesNoQuestion";
import YearsServiceQuestion from "./YearsServiceQuestion";
import ResultsView from "./ResultsView";
import type { AssessmentAnswers } from "@/lib/assessmentTypes";
import { TOTAL_QUESTIONS } from "@/lib/assessmentTypes";
import { computeResult } from "@/lib/riskScoring";

const RESULTS_STEP = TOTAL_QUESTIONS + 1; // 7

const STEP_LABELS: Record<number, string> = {
  1: "Gender",
  2: "Age",
  3: "House Purchase",
  4: "Marriage",
  5: "Loan",
  6: "Years of Service",
};

const pageVariants = {
  enter:  (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const pageTransition = { type: "spring" as const, stiffness: 260, damping: 30 };

export default function QuestionFlow() {
  const [step, setStep]         = useState(1);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers]   = useState<AssessmentAnswers>({});

  const goNext = () => { setDirection(1);  setStep((s) => s + 1); };
  const goBack = () => { setDirection(-1); setStep((s) => s - 1); };

  const handleAnswer = <K extends keyof AssessmentAnswers>(
    key: K,
    value: AssessmentAnswers[K]
  ) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    goNext();
  };

  // Compute result only once when step reaches 7, memoised on answers
  const result = useMemo(
    () => (step === RESULTS_STEP ? computeResult(answers) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step]
  );

  const isResults = step === RESULTS_STEP;

  // Results page has its own full-page layout — render outside the shell
  if (isResults && result) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="results"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <ResultsView
            result={result}
            genderUndisclosed={answers.gender === "prefer_not_to_say"}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-cream)" }}
    >
      {/* ── Top nav ── */}
      <header
        className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 shrink-0"
        style={{ borderBottom: "1px solid var(--color-cream-border)" }}
      >
        <div>
          {step === 1 ? (
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-mono transition-opacity hover:opacity-60"
              style={{ color: "var(--color-ink-muted)" }}
            >
              <span>←</span>
              <span>Home</span>
            </Link>
          ) : (
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-sm font-mono transition-opacity hover:opacity-60"
              style={{
                color: "var(--color-ink-muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <span>←</span>
              <span>Back</span>
            </button>
          )}
        </div>

        <span
          className="text-xs tracking-[0.2em] uppercase font-mono"
          style={{ color: "var(--color-ink-light)" }}
        >
          {step} / {TOTAL_QUESTIONS}
        </span>

        <span
          className="text-sm italic"
          style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink-muted)" }}
        >
          AFO Risk Assessment
        </span>
      </header>

      {/* ── Mission Progress ── */}
      <div
        className="px-4 sm:px-8 pt-3 pb-2.5 shrink-0"
        style={{ borderBottom: "1px solid var(--color-cream-border)" }}
      >
        {/* Segment blocks */}
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => {
            const blockStep = i + 1;
            const done    = step > blockStep;
            const current = step === blockStep;
            return (
              <div
                key={i}
                className="relative flex-1 overflow-hidden"
                style={{ height: 7, borderRadius: 1 }}
              >
                {/* Track */}
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: "var(--color-cream-border)" }}
                />

                {/* Fill — slides in when done or current */}
                <motion.div
                  className="absolute inset-y-0 left-0"
                  style={{ backgroundColor: "var(--color-ink)", borderRadius: 1 }}
                  initial={{ width: "0%" }}
                  animate={{ width: done ? "100%" : current ? "100%" : "0%" }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Active scan stripe — bright ticker at right edge of current block */}
                {current && (
                  <motion.div
                    className="absolute inset-y-0"
                    style={{
                      width: 3,
                      right: 0,
                      backgroundColor: "var(--color-military-gold)",
                      borderRadius: 1,
                    }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Label row */}
        <div className="flex items-center justify-between mt-2">
          <span
            className="text-[9px] font-mono tracking-[0.2em] uppercase tabular-nums"
            style={{ color: "var(--color-ink-light)" }}
          >
            Step {String(step).padStart(2, "0")}/{String(TOTAL_QUESTIONS).padStart(2, "0")}
          </span>
          <span
            className="text-[9px] font-mono tracking-[0.2em] uppercase"
            style={{ color: "var(--color-ink)" }}
          >
            ▸ {STEP_LABELS[step]}
          </span>
        </div>
      </div>

      {/* ── Question area ── */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="w-full max-w-3xl"
          >
            {step === 1 && (
              <GenderQuestion
                selected={answers.gender}
                onAnswer={(v) => handleAnswer("gender", v)}
              />
            )}

            {step === 2 && (
              <AgeQuestion
                selected={answers.age}
                onAnswer={(v) => handleAnswer("age", v)}
              />
            )}

            {step === 3 && (
              <YesNoQuestion
                questionNumber={3}
                question="Do you wish to buy a house in the next 5–10 years?"
                selected={answers.housePurchase}
                onAnswer={(v) => handleAnswer("housePurchase", v)}
              />
            )}

            {step === 4 && (
              <YesNoQuestion
                questionNumber={4}
                question="Do you expect a marriage in your household in the next 5–10 years?"
                selected={answers.marriage}
                onAnswer={(v) => handleAnswer("marriage", v)}
              />
            )}

            {step === 5 && (
              <YesNoQuestion
                questionNumber={5}
                question="Do you currently have a loan?"
                selected={answers.hasLoan}
                onAnswer={(v) => handleAnswer("hasLoan", v)}
              />
            )}

            {step === 6 && (
              <YearsServiceQuestion
                selected={answers.yearsOfService}
                onAnswer={(v) => handleAnswer("yearsOfService", v)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
