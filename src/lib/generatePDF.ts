import type { RiskResult } from "./riskScoring";

const ASSET_LABELS: Record<string, string> = {
  termDeposits: "Term Deposits",
  debtFunds: "Debt Funds",
  equityFundShares: "Equity Fund & Shares",
  gold: "Gold",
};

const BAND_ACCENT: Record<string, [number, number, number]> = {
  low:    [58,  90,  58],
  medium: [122, 90,  26],
  high:   [107, 26,  26],
};

const BAND_LABEL: Record<string, string> = {
  low:    "LOW RISK AVERSION",
  medium: "MODERATE RISK AVERSION",
  high:   "HIGH RISK AVERSION",
};

const NOTES = [
  "Prescribed allocation assumes individuals set aside 10–20% of savings as liquid cash depending on committed expenditure.",
  "Investing in multiple asset classes is considered good investment practice.",
  "If you are not covered by a pension, allocate 10% to 15% to a pension fund.",
  "These asset allocations are based on general theoretical model predictions. Individuals are advised to consult a SEBI registered investment advisor for a customised investment plan suited to their specific needs.",
];

export async function generatePDF(result: RiskResult): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = 210;
  const margin = 18;
  const contentW = W - margin * 2;
  const accent = BAND_ACCENT[result.band];
  const ink: [number, number, number] = [26, 24, 21];
  const muted: [number, number, number] = [74, 69, 64];
  const light: [number, number, number] = [138, 133, 128];
  const cream: [number, number, number] = [240, 237, 228];
  const border: [number, number, number] = [214, 209, 196];

  // ── Header bar ───────────────────────────────────────────────────────────────
  doc.setFillColor(...ink);
  doc.rect(0, 0, W, 38, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...cream);
  doc.text("ARMED FORCES FINANCIAL RISK ASSESSMENT", margin, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...light);
  doc.text("CONFIDENTIAL REPORT", margin, 23);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, margin, 29);

  // ── Accent line below header ──────────────────────────────────────────────────
  doc.setFillColor(...accent);
  doc.rect(0, 38, W, 2, "F");

  // ── Score section ─────────────────────────────────────────────────────────────
  let y = 58;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...light);
  doc.text("YOUR RISK AVERSION SCORE", W / 2, y, { align: "center" });

  y += 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(48);
  doc.setTextColor(...accent);
  doc.text(result.breakdown.total.toFixed(2), W / 2, y, { align: "center" });

  // Band chip
  y += 6;
  const chipLabel = BAND_LABEL[result.band];
  const chipW = 72;
  const chipH = 8;
  const chipX = W / 2 - chipW / 2;
  doc.setFillColor(...accent);
  doc.roundedRect(chipX, y, chipW, chipH, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...cream);
  doc.text(chipLabel, W / 2, y + 5.2, { align: "center" });

  // Description
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...muted);
  const descLines = doc.splitTextToSize(result.description, contentW);
  doc.text(descLines, W / 2, y, { align: "center" });
  y += descLines.length * 5 + 6;

  // ── Score meter bar ───────────────────────────────────────────────────────────
  const barH = 5;
  const barY = y;

  // Low zone (0–33%)
  doc.setFillColor(184, 212, 184);
  doc.roundedRect(margin, barY, contentW * 0.33, barH, 2, 2, "F");

  // Medium zone (33–80%)
  doc.setFillColor(212, 184, 122);
  doc.rect(margin + contentW * 0.33, barY, contentW * 0.47, barH, "F");

  // High zone (80–100%)
  doc.setFillColor(212, 160, 160);
  doc.roundedRect(margin + contentW * 0.80, barY, contentW * 0.20, barH, 2, 2, "F");

  // Score marker
  const METER_MIN = -5, METER_MAX = 55;
  const scorePct = Math.max(0, Math.min(1, (result.breakdown.total - METER_MIN) / (METER_MAX - METER_MIN)));
  const markerX = margin + contentW * scorePct;
  doc.setFillColor(...accent);
  doc.circle(markerX, barY + barH / 2, 3, "F");
  doc.setFillColor(...cream);
  doc.circle(markerX, barY + barH / 2, 1.5, "F");

  // Zone labels
  y += barH + 3;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...light);
  doc.text("Low", margin, y);
  doc.text("Moderate", margin + contentW * 0.56, y, { align: "center" });
  doc.text("High", margin + contentW, y, { align: "right" });

  // ── Divider ───────────────────────────────────────────────────────────────────
  y += 10;
  doc.setDrawColor(...border);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentW, y);

  // ── Asset allocation ──────────────────────────────────────────────────────────
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...light);
  doc.text("PRESCRIBED ASSET ALLOCATION", margin, y);

  y += 8;
  const entries = Object.entries(result.allocation);
  entries.forEach(([key, range], i) => {
    const { label, max } = range as { label: string; max: number };

    // Row background
    if (i % 2 === 0) {
      doc.setFillColor(245, 243, 238);
      doc.rect(margin, y - 4, contentW, 14, "F");
    }

    // Asset name
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...ink);
    doc.text(ASSET_LABELS[key] ?? key, margin + 2, y + 3);

    // Allocation label
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...accent);
    doc.text(label, margin + contentW - 2, y + 3, { align: "right" });

    // Bar track
    const bTrackY = y + 6;
    const bTrackH = 2.5;
    const bW = contentW * 0.55;
    const bX = margin + 2;
    doc.setFillColor(...border);
    doc.roundedRect(bX, bTrackY, bW, bTrackH, 1, 1, "F");

    // Bar fill
    doc.setFillColor(...accent);
    doc.roundedRect(bX, bTrackY, bW * (max / 100), bTrackH, 1, 1, "F");

    y += 14;
  });

  // ── Divider ───────────────────────────────────────────────────────────────────
  y += 4;
  doc.setDrawColor(...border);
  doc.line(margin, y, margin + contentW, y);

  // ── Notes ─────────────────────────────────────────────────────────────────────
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...light);
  doc.text("NOTE", margin, y);

  y += 6;
  NOTES.forEach((note) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...muted);
    const lines = doc.splitTextToSize(`• ${note}`, contentW - 4);
    doc.text(lines, margin + 2, y);
    y += lines.length * 4.5 + 2;
  });

  // ── Footer ────────────────────────────────────────────────────────────────────
  doc.setFillColor(...ink);
  doc.rect(0, 280, W, 17, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...light);
  doc.text("Armed Forces Financial Risk Assessment Tool  ·  Confidential", margin, 287);
  doc.text("For advisory purposes only. Not financial advice.", margin + contentW, 287, { align: "right" });

  doc.save("AFO-Risk-Assessment-Report.pdf");
}
