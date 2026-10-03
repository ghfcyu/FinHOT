import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { SELECTION } from "@aihot/industry/selection";
import { tierThreshold, UNDERSTAND_FLOOR } from "@aihot/backend/editorial/analyze";

test("financial selection thresholds and understand floor are configured correctly", () => {
  assert.equal(SELECTION.thresholds.T1, 60, "T1 official central bank & regulator threshold is 60");
  assert.equal(SELECTION.thresholds.T1_5, 65, "T1_5 authoritative media & top corporate filings threshold is 65");
  assert.equal(SELECTION.thresholds["T1.5"], 65, "T1.5 dot-syntax alias matches 65");
  assert.equal(SELECTION.thresholds.T2, 76, "T2 sell-side research & vertical media threshold is 76");
  assert.equal(SELECTION.understandFloor, 50, "understandFloor is 50");
  assert.equal(UNDERSTAND_FLOOR, 50, "UNDERSTAND_FLOOR constant matches selection export");
});

test("tierThreshold correctly resolves all financial tiers and safely rejects invalid tiers", () => {
  assert.equal(tierThreshold("T1"), 60);
  assert.equal(tierThreshold("T1_5"), 65);
  assert.equal(tierThreshold("T1.5"), 65, "supports dot notation without undefined lookup");
  assert.equal(tierThreshold("T2"), 76);
  assert.equal(tierThreshold("EXCLUDE_MP"), null, "EXCLUDE_MP has no threshold and skips curation");
  assert.equal(tierThreshold("UNKNOWN"), null);
  assert.equal(tierThreshold(""), null);
});

test("scoring threshold mathematics enforce strict financial quality boundaries", () => {
  // Helper simulating the core rule: score1 + score2 >= 2 * threshold
  const isSelected = (tier: string, s1: number, s2: number): boolean => {
    const t = tierThreshold(tier);
    if (t === null) return false;
    return s1 + s2 >= 2 * t;
  };

  const isNearSelected = (s1: number, s2: number): boolean => {
    return Math.floor((s1 + s2) / 2) >= UNDERSTAND_FLOOR;
  };

  // T1: Threshold 60 (Sum >= 120)
  assert.equal(isSelected("T1", 60, 60), true, "60 + 60 = 120 >= 120 is selected");
  assert.equal(isSelected("T1", 55, 65), true, "55 + 65 = 120 >= 120 is selected");
  assert.equal(isSelected("T1", 59, 60), false, "59 + 60 = 119 < 120 is rejected from selection");
  assert.equal(isNearSelected(59, 60), true, "mean 59 >= 50 qualifies for full understanding");
  assert.equal(isNearSelected(48, 50), false, "mean 49 < 50 falls back to translation/summary");

  // T1_5: Threshold 65 (Sum >= 130)
  assert.equal(isSelected("T1_5", 65, 65), true, "65 + 65 = 130 >= 130 is selected");
  assert.equal(isSelected("T1_5", 60, 70), true, "60 + 70 = 130 >= 130 is selected");
  assert.equal(isSelected("T1_5", 64, 65), false, "64 + 65 = 129 < 130 is rejected from selection");
  assert.equal(isNearSelected(64, 65), true, "mean 64 >= 50 qualifies for full understanding");

  // T2: Threshold 76 (Sum >= 152)
  assert.equal(isSelected("T2", 76, 76), true, "76 + 76 = 152 >= 152 is selected");
  assert.equal(isSelected("T2", 72, 80), true, "72 + 80 = 152 >= 152 is selected");
  assert.equal(isSelected("T2", 75, 76), false, "75 + 76 = 151 < 152 is rejected from selection");
  assert.equal(isNearSelected(75, 76), true, "mean 75 >= 50 qualifies for full understanding in 全部动态");
  assert.equal(isNearSelected(45, 50), false, "mean 47 < 50 is summarized");
});

test("all benchmark samples in gold.example.jsonl map to valid thresholds and pass tier validation", () => {
  const content = readFileSync(new URL("../industry/gold.example.jsonl", import.meta.url), "utf8");
  const lines = content.trim().split("\n");
  assert.equal(lines.length, 18, "exactly 18 golden cases in unbiased financial benchmark");

  const rows = lines.map((l) => JSON.parse(l));
  for (const row of rows) {
    const tier = row.sourceFacts.sourceTier;
    assert.ok(tier, `case ${row.caseId} must define sourceTier`);
    const threshold = tierThreshold(tier);
    assert.ok(typeof threshold === "number" && threshold > 0, `case ${row.caseId} tier ${tier} must have a positive threshold`);

    // Verify samplingContext
    assert.ok(row.samplingContext?.benchmarkSplit === "development" || row.samplingContext?.benchmarkSplit === "holdout");
    assert.ok(row.samplingContext?.samplingStratum, `case ${row.caseId} must specify samplingStratum`);

    // Verify gold decision
    assert.ok(["select", "reject", "either"].includes(row.gold.decision));
  }

  // Anti-bias checks: ensure both T1 and T2 have positive and negative cases (no tier-decision confounding)
  assert.ok(rows.some((r) => r.sourceFacts.sourceTier === "T1" && r.gold.decision === "select"), "T1 has positive policy/regulatory cases");
  assert.ok(rows.some((r) => r.sourceFacts.sourceTier === "T1" && r.gold.decision === "reject"), "T1 has negative administrative noise cases");
  assert.ok(rows.some((r) => r.sourceFacts.sourceTier === "T2" && r.gold.decision === "select"), "T2 has positive in-depth research cases");
  assert.ok(rows.some((r) => r.sourceFacts.sourceTier === "T2" && r.gold.decision === "reject"), "T2 has negative disguised promotion cases");
});
