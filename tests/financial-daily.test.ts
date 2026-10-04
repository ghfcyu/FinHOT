import assert from "node:assert/strict";
import { test } from "node:test";
import { SITE, withSubject } from "@aihot/industry/site";
import { CATEGORIES } from "@aihot/industry/taxonomy";
import { headline, KIND_LABEL, MOTTO, metricItems } from "../apps/web/app/features/report/format.ts";

test("FinHOT daily report metadata and headlines use financial subject", () => {
  assert.equal(SITE.subject, "金融");
  assert.equal(SITE.name, "FinHOT");
  assert.equal(withSubject("日报"), "金融日报");
  assert.equal(withSubject("周报"), "金融周报");
  assert.equal(withSubject("月报"), "金融月报");

  // Verify headline generator uses financial subject instead of hardcoded AI
  assert.equal(headline("daily", "2026-10-04", 5), "这一天的 5 件 金融大事");
  assert.equal(headline("weekly", "2026-W40", 12), "本周的 12 件 金融大事");
  assert.equal(headline("monthly", "2026-10", 25), "10 月的 25 件 金融大事");

  // Verify MOTTO uses dynamic financial subject and purges AI
  assert.equal(MOTTO.daily, "金融 · 每日要闻");
  assert.equal(MOTTO.weekly, "金融 · 每周综述");
  assert.equal(MOTTO.monthly, "金融 · 每月盘点");
  assert.equal(Object.values(MOTTO).some((v) => v.includes("人工智能")), false);
});

test("all financial categories map to valid non-empty report sections", () => {
  const sections = [...new Set(CATEGORIES.map((c) => c.section))];
  assert.ok(sections.length >= 6, "Must have at least 6 financial report sections");
  assert.ok(sections.includes("宏观与监管政策"), "Must include 宏观与监管政策");
  assert.ok(sections.includes("资本市场动态"), "Must include 资本市场动态");
  assert.ok(sections.includes("商业与财报"), "Must include 商业与财报");
  assert.ok(sections.includes("金融机构与资管"), "Must include 金融机构与资管");
  assert.ok(sections.includes("金融科技前沿"), "Must include 金融科技前沿");
  assert.ok(sections.includes("研报与专家观点"), "Must include 研报与专家观点");

  // Ensure obsolete AI sections are purged
  const rawSections = sections as readonly string[];
  assert.equal(rawSections.includes("模型发布/更新"), false, "Must not contain obsolete AI section");
  assert.equal(rawSections.includes("开发与生态"), false, "Must not contain obsolete AI section");
});

test("daily report JSON schema strictly adheres to financial reporting contract", () => {
  const sampleDaily = {
    date: "2026-10-04",
    lead: {
      title: "美联储决议下调联邦基金利率25基点 强调通胀放缓与就业平衡",
      leadParagraph: "美联储公开市场委员会宣布降息25个基点至4.50%-4.75%，表明货币政策进一步走向中性。本站客观归纳事实，不构成任何投资建议。",
    },
    highlights: [
      { itemId: "item-fed-001", title: "美联储如期下调联邦基金利率目标区间25个基点", sourceName: "美联储官方发布" },
      { itemId: "item-sec-002", title: "美国SEC就数字资产托管规则发布最新指导备忘录", sourceName: "美国证券交易委员会" },
    ],
    sections: [
      {
        label: "宏观与监管政策",
        items: [
          { itemId: "item-fed-001", title: "美联储降息25基点", summary: "委员会以全票通过降息决议。", sourceName: "美联储官方发布", score: 92, firstParty: true },
        ],
      },
    ],
    flashes: [],
    metrics: {
      totalEvents: 1,
      sourcesCount: 1,
      macroPolicyEvents: 1,
      firstPartyEvents: 1,
    },
  };

  assert.equal(sampleDaily.date, "2026-10-04");
  assert.ok(sampleDaily.lead.leadParagraph.includes("不构成任何投资建议"));
  assert.ok(sampleDaily.metrics.macroPolicyEvents >= 1);
  assert.equal((sampleDaily.metrics as any).modelsReleased, undefined, "Obsolete AI metric must be absent");

  // Verify metricItems correctly renders macroPolicyEvents into the masthead metrics contract
  const renderedMetrics = metricItems(sampleDaily.metrics);
  assert.ok(renderedMetrics.some((m) => m.unit === "件宏观政策" && m.value === 1));
  assert.equal(renderedMetrics.some((m) => m.unit === "个新模型"), false);
});
