import assert from "node:assert/strict";
import { test } from "node:test";
import type { Server } from "node:http";
import { createPreviewServer } from "../scripts/preview-server.ts";

const TEST_PORT = 3099;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

test("FinHOT Preview Mock API Server tests", async (t) => {
  const server: Server = createPreviewServer();

  await new Promise<void>((resolve, reject) => {
    server.listen(TEST_PORT, "127.0.0.1", () => resolve());
    server.on("error", reject);
  });

  t.after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  await t.test("GET /api/health returns 200 and FinHOT status ok", async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.equal(res.status, 200);
    const data = (await res.json()) as { status: string; name: string };
    assert.equal(data.status, "ok");
    assert.equal(data.name, "FinHOT");
  });

  await t.test("GET /api/site/contact returns null qr codes and maker avatar", async () => {
    const res = await fetch(`${BASE_URL}/api/site/contact`);
    assert.equal(res.status, 200);
    const data = (await res.json()) as { wechatQr: unknown; feishuQr: unknown; makerAvatar: unknown };
    assert.equal(data.wechatQr, null);
    assert.equal(data.feishuQr, null);
    assert.equal(data.makerAvatar, null);
  });

  await t.test("GET /api/site/stats returns exact site statistics and financial metrics", async () => {
    const res = await fetch(`${BASE_URL}/api/site/stats`);
    assert.equal(res.status, 200);
    const data = (await res.json()) as {
      sourcesCount: number;
      collectedCount: number;
      selectedCount: number;
      reportsCount: number;
      sources: number;
      items: number;
      selected: number;
      dailies: number;
    };
    assert.equal(data.sourcesCount, 19);
    assert.equal(data.collectedCount, 1280);
    assert.equal(data.selectedCount, 96);
    assert.equal(data.reportsCount, 1);
    // 同时适配前台页面渲染
    assert.equal(data.sources, 19);
    assert.equal(data.items, 1280);
    assert.equal(data.selected, 96);
    assert.equal(data.dailies, 1);
  });

  await t.test("GET /api/topics returns 31 financial core topics from industry/topics.json", async () => {
    const res = await fetch(`${BASE_URL}/api/topics`);
    assert.equal(res.status, 200);
    const data = (await res.json()) as { count: number; topics: Array<{ slug: string; name: string }> };
    assert.equal(data.topics.length, 31);
    assert.equal(data.count, 31);
    assert.ok(data.topics.some((topic) => topic.slug === "pboc" && topic.name === "中国人民银行"));
    assert.ok(data.topics.some((topic) => topic.slug === "csrc" && topic.name === "中国证监会"));
  });

  await t.test("GET /api/topics/:slug returns topic details and item list", async () => {
    const res = await fetch(`${BASE_URL}/api/topics/pboc`);
    assert.equal(res.status, 200);
    const data = (await res.json()) as {
      topic: { slug: string; name: string; definition: string; related: Array<{ slug: string; name: string }> };
      items: Array<{ id: string; title: string }>;
    };
    assert.equal(data.topic.slug, "pboc");
    assert.equal(data.topic.name, "中国人民银行");
    assert.ok(data.topic.definition.length > 0);
    assert.ok(Array.isArray(data.topic.related));
    assert.ok(data.items.length > 0);

    // 404 for non-existent topic
    const notFoundRes = await fetch(`${BASE_URL}/api/topics/non-existent-topic-slug`);
    assert.equal(notFoundRes.status, 404);
  });

  await t.test("GET /api/items & GET /api/v1/items cover all 6 financial categories with tags, subjects and scores", async () => {
    for (const path of ["/api/items", "/api/v1/items"]) {
      const res = await fetch(`${BASE_URL}${path}`);
      assert.equal(res.status, 200);
      const data = (await res.json()) as {
        items: Array<{
          id: string;
          title: string;
          category: string;
          tags: string[];
          subjects: string[];
          score: number;
        }>;
      };
      assert.ok(data.items.length >= 6);

      const categories = new Set(data.items.map((i) => i.category));
      assert.ok(categories.has("macro-policy"), "Must contain macro-policy");
      assert.ok(categories.has("capital-markets"), "Must contain capital-markets");
      assert.ok(categories.has("earnings-corporate"), "Must contain earnings-corporate");
      assert.ok(categories.has("institutions"), "Must contain institutions");
      assert.ok(categories.has("fintech"), "Must contain fintech");
      assert.ok(categories.has("opinion"), "Must contain opinion");

      for (const item of data.items) {
        assert.ok(item.tags.length > 0, `Item ${item.id} must have tags`);
        assert.ok(item.subjects.length > 0, `Item ${item.id} must have subjects`);
        assert.ok(typeof item.score === "number" && item.score > 0, `Item ${item.id} must have score`);
      }
    }
  });

  await t.test("GET /api/items/:id returns item detail with fact extraction structure", async () => {
    const res = await fetch(`${BASE_URL}/api/items/item-fin-001`);
    assert.equal(res.status, 200);
    const data = (await res.json()) as {
      id: string;
      title: string;
      summary: string;
      facts: Array<{ subject: string; predicate: string; object: string; impact: string }>;
      extractedFacts: Array<{ subject: string; action: string; outcome: string }>;
      readingMode: string;
      body: { zh: string };
    };
    assert.equal(data.id, "item-fin-001");
    assert.ok(data.title.includes("中国人民银行"));
    assert.ok(Array.isArray(data.facts) && data.facts.length > 0, "Must have facts array");
    assert.ok(Array.isArray(data.extractedFacts) && data.extractedFacts.length > 0, "Must have extractedFacts array");
    assert.equal(data.readingMode, "full");
    assert.ok(data.body.zh.length > 0);
  });

  await t.test("GET /api/stories & GET /api/v1/hot-topics return clustered hot stories", async () => {
    const res1 = await fetch(`${BASE_URL}/api/stories`);
    assert.equal(res1.status, 200);
    const data1 = (await res1.json()) as { count: number; stories: Array<{ publicId: string; title: string }> };
    assert.ok(data1.count >= 3);
    assert.ok(data1.stories.some((s) => s.publicId === "story-monetary-easing"));

    const res2 = await fetch(`${BASE_URL}/api/v1/hot-topics`);
    assert.equal(res2.status, 200);
    const data2 = (await res2.json()) as { count: number; items: Array<{ id: string; title: string }> };
    assert.ok(data2.count >= 3);
    assert.ok(data2.items.some((s) => s.id === "story-monetary-easing"));
  });

  await t.test("GET /api/story/:publicId returns hot story details", async () => {
    const res = await fetch(`${BASE_URL}/api/story/story-monetary-easing`);
    assert.equal(res.status, 200);
    const data = (await res.json()) as {
      publicId: string;
      title: string;
      status: string;
      digest: string;
      whyHot: { heat: number; rank: number };
    };
    assert.equal(data.publicId, "story-monetary-easing");
    assert.equal(data.status, "active");
    assert.ok(data.digest.includes("央行"));
    assert.ok(data.whyHot.heat > 0);
  });

  await t.test("GET /api/reports/daily/latest & GET /api/reports/daily/:key return financial daily report", async () => {
    for (const path of ["/api/reports/daily/latest", "/api/reports/daily/2026-10-04"]) {
      const res = await fetch(`${BASE_URL}${path}`);
      assert.equal(res.status, 200);
      const data = (await res.json()) as {
        kind: string;
        title: string;
        lead: { title: string; leadParagraph: string };
        overview: string;
        highlights: Array<{ itemId: string; title: string }>;
        sections: Array<{ label: string; summary: string; items: unknown[] }>;
        metrics: { macroPolicyEvents: number; totalEvents: number };
        macroPolicyEvents: number;
      };
      assert.equal(data.kind, "daily");
      assert.ok(data.title.includes("金融日报"));
      assert.ok(data.lead.title.length > 0);
      assert.ok(data.lead.leadParagraph.includes("不构成任何投资建议"));
      assert.ok(data.overview.length > 0);
      assert.ok(data.highlights.length > 0);
      assert.ok(data.sections.length >= 6);

      const sectionLabels = data.sections.map((s) => s.label);
      assert.ok(sectionLabels.includes("宏观与监管政策"));
      assert.ok(sectionLabels.includes("资本市场动态"));
      assert.ok(sectionLabels.includes("商业与财报"));
      assert.ok(sectionLabels.includes("金融机构与资管"));
      assert.ok(sectionLabels.includes("金融科技前沿"));
      assert.ok(sectionLabels.includes("研报与专家观点"));

      assert.ok(data.metrics.macroPolicyEvents >= 1);
      assert.ok(data.macroPolicyEvents >= 1);
    }
  });

  await t.test("GET /api/reports/weekly/latest & monthly/latest return weekly and monthly reports", async () => {
    const weeklyRes = await fetch(`${BASE_URL}/api/reports/weekly/latest`);
    assert.equal(weeklyRes.status, 200);
    const weeklyData = (await weeklyRes.json()) as { kind: string; key: string; metrics: { macroPolicyEvents: number } };
    assert.equal(weeklyData.kind, "weekly");
    assert.ok(weeklyData.key.includes("W"));
    assert.ok(weeklyData.metrics.macroPolicyEvents >= 1);

    const monthlyRes = await fetch(`${BASE_URL}/api/reports/monthly/latest`);
    assert.equal(monthlyRes.status, 200);
    const monthlyData = (await monthlyRes.json()) as { kind: string; key: string; metrics: { macroPolicyEvents: number } };
    assert.equal(monthlyData.kind, "monthly");
    assert.ok(monthlyData.metrics.macroPolicyEvents >= 1);
  });

  await t.test("POST /api/mcp responds to MCP protocol handshake returning name finhot", async () => {
    const res = await fetch(`${BASE_URL}/api/mcp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "req-handshake-1",
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "test-client", version: "1.0.0" },
        },
      }),
    });
    assert.equal(res.status, 200);
    const data = (await res.json()) as {
      name: string;
      id: string;
      result: { serverInfo: { name: string } };
    };
    assert.equal(data.name, "finhot");
    assert.equal(data.id, "req-handshake-1");
    assert.equal(data.result.serverInfo.name, "finhot");
  });

  await t.test("SSR frontend compatibility routes succeed", async () => {
    // 验证 Web 前台 SSR 在浏览器中请求的核心路由
    const tlRes = await fetch(`${BASE_URL}/api/site/timeline`);
    assert.equal(tlRes.status, 200);
    const tlData = (await tlRes.json()) as { cards: unknown[]; hot: unknown[] };
    assert.ok(tlData.cards.length > 0);

    const poolRes = await fetch(`${BASE_URL}/api/site/pool`);
    assert.equal(poolRes.status, 200);
    const poolData = (await poolRes.json()) as { items: unknown[] };
    assert.ok(poolData.items.length > 0);

    const hotRes = await fetch(`${BASE_URL}/api/site/hot`);
    assert.equal(hotRes.status, 200);
    const hotData = (await hotRes.json()) as { entries: unknown[] };
    assert.ok(hotData.entries.length > 0);

    const reportPageRes = await fetch(`${BASE_URL}/api/site/reports/daily/latest-page`);
    assert.equal(reportPageRes.status, 200);
    const reportPageData = (await reportPageRes.json()) as { report: { kind: string } };
    assert.equal(reportPageData.report.kind, "daily");
  });
});
