"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { RiskResult, RiskBand } from "@/lib/riskScoring";
import { THRESHOLDS } from "@/lib/riskScoring";
import { generatePDF } from "@/lib/generatePDF";

// ── Colour config per band ───────────────────────────────────────────────────

const BAND_CONFIG: Record<
  RiskBand,
  { accent: string; muted: string; label: string }
> = {
  low:    { accent: "#3a5a3a", muted: "#b8d4b8", label: "LOW" },
  medium: { accent: "#7a5a1a", muted: "#d4b87a", label: "MODERATE" },
  high:   { accent: "#6b1a1a", muted: "#d4a0a0", label: "HIGH" },
};

// ── Asset class display order ────────────────────────────────────────────────

const ASSET_LABELS: Record<string, string> = {
  termDeposits:     "Term Deposits",
  debtFunds:        "Debt Funds",
  equityFundShares: "Equity Fund & Shares",
  gold:             "Gold",
};

const ALLOCATION_NOTES = [
  "Prescribed allocation assumes that individuals will set aside around 10%–20% of their savings as liquid cash, depending on regular, committed expenditure on health, education, and other areas.",
  "Investing in multiple asset classes is considered a good investment practice.",
  "If you are not covered for a pension, allocate 10% to 15% to a pension fund.",
];

// ── Score meter constants ────────────────────────────────────────────────────
// Practical display range: -5 to 55 (covers model min/max)
const METER_MIN = -5;
const METER_MAX = 55;

function meterPct(score: number) {
  return Math.max(0, Math.min(100, ((score - METER_MIN) / (METER_MAX - METER_MIN)) * 100));
}
const LOW_PCT  = meterPct(THRESHOLDS.low);
const HIGH_PCT = meterPct(THRESHOLDS.high);

// ── Animated counter hook ────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((from + (target - from) * eased).toFixed(2)));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

// ── Component ────────────────────────────────────────────────────────────────

interface ResultsViewProps {
  result: RiskResult;
  genderUndisclosed?: boolean;
}

export default function ResultsView({ result, genderUndisclosed = false }: ResultsViewProps) {
  const { breakdown, band, label, description, allocation } = result;
  const cfg = BAND_CONFIG[band];
  const displayScore = useCountUp(breakdown.total, 1600);
  const scorePct = meterPct(breakdown.total);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    await generatePDF(result);
    setDownloading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-cream)" }}
    >
      {/* ── Nav ── */}
      <header
        className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 shrink-0"
        style={{ borderBottom: "1px solid var(--color-cream-border)" }}
      >
        <Link
          href="/assessment"
          className="flex items-center gap-2 text-sm font-mono transition-opacity hover:opacity-60"
          style={{ color: "var(--color-ink-muted)" }}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "/assessment";
          }}
        >
          <span>←</span>
          <span>Retake</span>
        </Link>
        <span
          className="text-xs tracking-[0.2em] uppercase font-mono"
          style={{ color: "var(--color-ink-light)" }}
        >
          Assessment Complete
        </span>
        <span
          className="text-sm italic"
          style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink-muted)" }}
        >
          AFO Risk Assessment
        </span>
      </header>

      {/* Thin band accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: cfg.accent }} />

      <main className="flex-1 px-4 sm:px-6 py-8 sm:py-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto flex flex-col gap-14">

          {/* ── Score hero ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <p
              className="text-xs tracking-[0.25em] uppercase font-mono"
              style={{ color: "var(--color-ink-light)" }}
            >
              Your Risk Aversion Score
            </p>

            {/* Score number */}
            <div className="flex items-baseline gap-1">
              <span
                className="text-[clamp(3.5rem,18vw,6.25rem)]"
                style={{
                  fontFamily: "var(--font-serif)",
                  lineHeight: 1,
                  fontStyle: "italic",
                  color: cfg.accent,
                }}
              >
                {displayScore.toFixed(2)}
              </span>
            </div>

            {/* Band chip */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.4, type: "spring" }}
              className="px-5 py-1.5 rounded-full text-xs tracking-[0.22em] uppercase font-mono font-bold"
              style={{
                backgroundColor: cfg.accent,
                color: "var(--color-cream)",
              }}
            >
              {cfg.label} RISK AVERSION
            </motion.div>

            <p
              className="text-base leading-relaxed max-w-md"
              style={{ color: "var(--color-ink-muted)" }}
            >
              {description}
            </p>
          </motion.div>

          {/* ── Gender undisclosed notice ── */}
          {genderUndisclosed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex gap-3 px-5 py-4 max-w-lg mx-auto w-full"
              style={{
                border: "1px solid var(--color-cream-border)",
                borderLeft: "3px solid var(--color-ink-light)",
                borderRadius: 2,
                backgroundColor: "var(--color-cream-dark)",
              }}
            >
              <span
                className="text-xs font-mono shrink-0 mt-0.5"
                style={{ color: "var(--color-ink-light)" }}
              >
                ℹ
              </span>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--color-ink-muted)", fontFamily: "var(--font-sans)" }}
              >
                Your gender response was not disclosed. The underlying regression
                model codes gender as Female = 1 or Male = 0. Without a response,
                the model defaults to 0 — the male baseline — which may not reflect
                your actual risk profile. The score above should be interpreted
                with this limitation in mind. All other inputs have been applied in full.
              </p>
            </motion.div>
          )}

          {/* ── Score meter ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col gap-2"
          >
            {/* Track */}
            <div
              className="relative h-3 rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--color-cream-border)" }}
            >
              {/* Low zone */}
              <div
                className="absolute top-0 left-0 h-full opacity-60"
                style={{
                  width: `${LOW_PCT}%`,
                  backgroundColor: BAND_CONFIG.low.muted,
                }}
              />
              {/* Medium zone */}
              <div
                className="absolute top-0 h-full opacity-60"
                style={{
                  left: `${LOW_PCT}%`,
                  width: `${HIGH_PCT - LOW_PCT}%`,
                  backgroundColor: BAND_CONFIG.medium.muted,
                }}
              />
              {/* High zone */}
              <div
                className="absolute top-0 h-full opacity-60"
                style={{
                  left: `${HIGH_PCT}%`,
                  right: 0,
                  backgroundColor: BAND_CONFIG.high.muted,
                }}
              />

              {/* Score marker */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2"
                style={{
                  backgroundColor: cfg.accent,
                  borderColor: "var(--color-cream)",
                  boxShadow: `0 0 0 2px ${cfg.accent}`,
                  zIndex: 10,
                }}
                initial={{ left: "0%" }}
                animate={{ left: `calc(${scorePct}% - 8px)` }}
                transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            {/* Zone labels */}
            <div className="flex text-[9px] font-mono uppercase tracking-widest" style={{ color: "var(--color-ink-light)" }}>
              <span style={{ width: `${LOW_PCT}%` }}>Low</span>
              <span style={{ width: `${HIGH_PCT - LOW_PCT}%`, textAlign: "center" }}>Moderate</span>
              <span style={{ flex: 1, textAlign: "right" }}>High</span>
            </div>
          </motion.div>

          {/* ── Prescribed allocation ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5"
          >
            <div
              className="pb-3"
              style={{ borderBottom: "1px solid var(--color-cream-border)" }}
            >
              <p
                className="text-xs tracking-[0.22em] uppercase font-mono"
                style={{ color: "var(--color-ink-light)" }}
              >
                Prescribed Asset Allocation
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {Object.entries(allocation).map(([key, range], i) => {
                const { label, max } = range as { label: string; max: number };
                return (
                  <div key={key} className="flex flex-col gap-1">
                    <div className="flex justify-between items-baseline">
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-ink)", fontFamily: "var(--font-sans)" }}
                      >
                        {ASSET_LABELS[key] ?? key}
                      </span>
                      <span
                        className="text-sm font-mono font-bold"
                        style={{ color: cfg.accent }}
                      >
                        {label}
                      </span>
                    </div>
                    {/* Bar scaled to max of range */}
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--color-cream-border)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: cfg.accent }}
                        initial={{ width: 0 }}
                        animate={{ width: `${max}%` }}
                        transition={{
                          delay: 0.7 + i * 0.08,
                          duration: 0.7,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Notes */}
            <div
              className="flex flex-col gap-2 pt-4"
              style={{ borderTop: "1px solid var(--color-cream-border)" }}
            >
              <p
                className="text-[10px] tracking-[0.15em] uppercase font-mono"
                style={{ color: "var(--color-ink-light)" }}
              >
                Note
              </p>
              <ul className="flex flex-col gap-1.5 list-none">
                {ALLOCATION_NOTES.map((note, i) => (
                  <li key={i} className="flex gap-2">
                    <span
                      className="text-[10px] font-mono shrink-0 mt-0.5"
                      style={{ color: "var(--color-ink-light)" }}
                    >
                      •
                    </span>
                    <span
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--color-ink-muted)", fontFamily: "var(--font-sans)" }}
                    >
                      {note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* ── CTAs ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center pb-8"
          >
            {/* Download PDF */}
            <motion.button
              onClick={handleDownload}
              disabled={downloading}
              whileHover={{ backgroundColor: cfg.accent }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="px-10 py-3 text-sm font-medium font-sans tracking-wide"
              style={{
                backgroundColor: "var(--color-ink)",
                color: "var(--color-cream)",
                border: "none",
                borderRadius: 2,
                cursor: downloading ? "wait" : "pointer",
                opacity: downloading ? 0.7 : 1,
              }}
            >
              {downloading ? "Generating…" : "↓ Download Report"}
            </motion.button>

            {/* Retake */}
            <Link
              href="/assessment"
              className="px-10 py-3 text-sm font-medium font-sans tracking-wide text-center transition-colors"
              style={{
                backgroundColor: "transparent",
                color: "var(--color-ink-muted)",
                border: "1px solid var(--color-cream-border)",
                borderRadius: 2,
              }}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/assessment";
              }}
            >
              Retake Assessment
            </Link>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
