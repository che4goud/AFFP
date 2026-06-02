/**
 * Regression model — exact equation from the research paper:
 *
 * Risk Score = 15.79
 *            + (5.50  × Female)
 *            + (0.25  × Age)
 *            + (8.77  × HouseGoal)
 *            − (8.17  × MarriageGoal)
 *            + (4.41  × Loan)
 *            − (0.31  × YearsOfService)
 *
 * Variable coding (from paper):
 *   Female         : 1 if female, 0 otherwise
 *   Age            : integer years
 *   HouseGoal      : 1 if yes, 0 if no / do-not-wish-to-answer
 *   MarriageGoal   : 1 if yes, 0 if no / do-not-wish-to-answer
 *   Loan           : 1 if yes, 0 if no / do-not-wish-to-answer
 *   YearsOfService : integer years
 *
 * Classification thresholds (from paper):
 *   score < 15          → Low risk aversion  (high risk tolerance)
 *   15 ≤ score ≤ 45     → Moderate risk aversion
 *   score > 45          → High risk aversion (low risk tolerance)
 */

import type { AssessmentAnswers, YesNoAnswer } from "./assessmentTypes";

// ── Coefficients ────────────────────────────────────────────────────────────

export const COEF = {
  intercept:      15.79,
  female:          5.50,
  age:             0.25,
  houseGoal:       8.77,
  marriageGoal:   -8.17,
  loan:            4.41,
  yearsOfService: -0.31,
} as const;

export const THRESHOLDS = { low: 15, high: 45 } as const;

// ── Types ───────────────────────────────────────────────────────────────────

export type RiskBand = "low" | "medium" | "high";

export interface ScoreBreakdown {
  intercept:       number;
  femaleContrib:   number;
  ageContrib:      number;
  houseContrib:    number;
  marriageContrib: number;
  loanContrib:     number;
  serviceContrib:  number;
  total:           number;
}

export interface AssetRange {
  label: string;
  max:   number;
}

export interface AssetAllocation {
  termDeposits:     AssetRange;
  debtFunds:        AssetRange;
  equityFundShares: AssetRange;
  gold:             AssetRange;
}

export interface RiskResult {
  breakdown:   ScoreBreakdown;
  band:        RiskBand;
  label:       string;
  description: string;
  allocation:  AssetAllocation;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function binEncode(v: YesNoAnswer | undefined): number {
  return v === "yes" ? 1 : 0;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ── Core scoring ─────────────────────────────────────────────────────────────

export function computeScore(answers: AssessmentAnswers): ScoreBreakdown {
  const isFemale = answers.gender === "female" ? 1 : 0;
  const age      = answers.age            ?? 0;
  const house    = binEncode(answers.housePurchase);
  const marriage = binEncode(answers.marriage);
  const loan     = binEncode(answers.hasLoan);
  const service  = answers.yearsOfService ?? 0;

  const femaleContrib   = round2(COEF.female          * isFemale);
  const ageContrib      = round2(COEF.age             * age);
  const houseContrib    = round2(COEF.houseGoal       * house);
  const marriageContrib = round2(COEF.marriageGoal    * marriage);
  const loanContrib     = round2(COEF.loan            * loan);
  const serviceContrib  = round2(COEF.yearsOfService  * service);

  const total = round2(
    COEF.intercept +
    femaleContrib  +
    ageContrib     +
    houseContrib   +
    marriageContrib +
    loanContrib    +
    serviceContrib
  );

  return {
    intercept: COEF.intercept,
    femaleContrib,
    ageContrib,
    houseContrib,
    marriageContrib,
    loanContrib,
    serviceContrib,
    total,
  };
}

export function classifyRisk(score: number): RiskBand {
  if (score < THRESHOLDS.low)  return "low";
  if (score <= THRESHOLDS.high) return "medium";
  return "high";
}

// ── Prescribed asset allocation ──────────────────────────────────────────────

const ALLOCATIONS: Record<RiskBand, AssetAllocation> = {
  low: {
    termDeposits:     { label: "< 5%",       max: 5  },
    debtFunds:        { label: "15% to 30%", max: 30 },
    equityFundShares: { label: "50% to 60%", max: 60 },
    gold:             { label: "Up to 10%",  max: 10 },
  },
  medium: {
    termDeposits:     { label: "5% to 50%",  max: 50 },
    debtFunds:        { label: "10% to 15%", max: 15 },
    equityFundShares: { label: "20% to 50%", max: 50 },
    gold:             { label: "Up to 10%",  max: 10 },
  },
  high: {
    termDeposits:     { label: "50% to 65%", max: 65 },
    debtFunds:        { label: "5% to 10%",  max: 10 },
    equityFundShares: { label: "7% to 20%",  max: 20 },
    gold:             { label: "Up to 10%",  max: 10 },
  },
};

const BAND_LABELS: Record<RiskBand, string> = {
  low:    "Low Risk Aversion",
  medium: "Moderate Risk Aversion",
  high:   "High Risk Aversion",
};

const BAND_DESCRIPTIONS: Record<RiskBand, string> = {
  low:    "You have a high tolerance for market volatility. Your portfolio is growth-oriented, with a heavy equity allocation to maximise long-run returns.",
  medium: "You prefer a balanced approach—participating in market growth while maintaining a meaningful debt cushion to dampen volatility.",
  high:   "You prioritise capital preservation. Your portfolio is conservative, anchored in debt instruments and stable assets to protect accumulated wealth.",
};

// ── Main export ──────────────────────────────────────────────────────────────

export function computeResult(answers: AssessmentAnswers): RiskResult {
  const breakdown = computeScore(answers);
  const band      = classifyRisk(breakdown.total);

  return {
    breakdown,
    band,
    label:       BAND_LABELS[band],
    description: BAND_DESCRIPTIONS[band],
    allocation:  ALLOCATIONS[band],
  };
}
