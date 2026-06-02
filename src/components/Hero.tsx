"use client";

import Link from "next/link";
import RetroComputer from "./RetroComputer";

const SPECS = [
  { label: "QUESTIONS", value: "6 Profile-Based" },
  { label: "MODEL", value: "Regression-Weighted" },
  { label: "RISK BANDS", value: "Low · Mid · High" },
  { label: "ASSET CLASSES", value: "5 Categories" },
];

export default function Hero() {
  return (
    <section
      className="min-h-screen flex items-center"
      style={{ backgroundColor: "var(--color-cream)" }}
    >
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* ── Left: Text content ── */}
        <div className="flex flex-col gap-8">
          {/* Eyebrow */}
          <p
            className="text-xs tracking-[0.25em] uppercase font-mono"
            style={{ color: "var(--color-ink-light)" }}
          >
            Armed Forces Financial Planning
          </p>

          {/* Headline */}
          <div className="flex flex-col gap-1">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl leading-tight"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--color-ink)",
                fontStyle: "italic",
              }}
            >
              Risk Assessment Tool
            </h1>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl leading-tight"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--color-ink)",
              }}
            >
              for Armed Forces
            </h1>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl leading-tight"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--color-ink)",
              }}
            >
              Officers{" "}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6em",
                  color: "var(--color-ink-muted)",
                  fontStyle: "normal",
                  verticalAlign: "middle",
                }}
              >
                (AFOs)
              </span>
            </h1>
          </div>

          {/* Description */}
          <p
            className="text-lg leading-relaxed max-w-md"
            style={{ color: "var(--color-ink-muted)" }}
          >
            Not a guess. Not a generic formula. This tool analyses your years of
            service, financial goals, and personal profile assigning you a
            precise risk score and prescribing your ideal asset allocation.
            Smart financial intelligence for officers who lead from the front.
          </p>

          {/* CTA row */}
          <div className="flex items-center gap-5">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium transition-colors duration-200"
              style={{
                backgroundColor: "var(--color-ink)",
                color: "var(--color-cream)",
                fontFamily: "var(--font-sans)",
                borderRadius: 2,
                letterSpacing: "0.01em",
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "var(--color-military-olive)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "var(--color-ink)";
              }}
            >
              Begin Assessment
            </Link>
            <span
              className="text-sm font-mono"
              style={{ color: "var(--color-ink-light)" }}
            >
              Free · Confidential
            </span>
          </div>

          {/* Specs grid */}
          <div
            className="grid grid-cols-2 gap-x-10 gap-y-4 pt-4"
            style={{
              borderTop: "1px solid var(--color-cream-border)",
            }}
          >
            {SPECS.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span
                  className="text-[10px] tracking-[0.2em] uppercase"
                  style={{
                    color: "var(--color-ink-light)",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                  }}
                >
                  {label}
                </span>
                <span
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-ink)",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Computer ── */}
        <div className="flex justify-center lg:justify-end overflow-hidden">
          <div className="scale-75 sm:scale-90 lg:scale-100 origin-top">
            <RetroComputer />
          </div>
        </div>
      </div>
    </section>
  );
}
