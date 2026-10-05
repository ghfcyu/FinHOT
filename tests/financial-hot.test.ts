import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { SITE } from "@aihot/industry/site";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const targetFiles = [
  "apps/web/app/routes/hot.tsx",
  "apps/web/app/routes/story.tsx",
  "apps/web/app/routes/item.tsx",
  "apps/web/app/routes/feedback.tsx",
  "apps/web/app/routes/admin/source-new.tsx",
  "apps/web/app/routes/admin/feedback.tsx",
];

const bannedTerms = [
  "AI 圈",
  "AI 综述",
  "AI 评分",
  "AI 导读",
  "OpenAI 博客",
  "AI HOT",
  "openai-blog",
];

test("FinHOT routes strictly purged obsolete AI terms and placeholders", () => {
  for (const relativePath of targetFiles) {
    const fullPath = path.resolve(rootDir, relativePath);
    assert.ok(fs.existsSync(fullPath), `Target file must exist: ${relativePath}`);
    const content = fs.readFileSync(fullPath, "utf-8");

    for (const term of bannedTerms) {
      assert.equal(
        content.includes(term),
        false,
        `File ${relativePath} must NOT contain banned term "${term}"`
      );
    }
  }
});

test("hot.tsx meta description and subtitle accurately use financial subject", () => {
  assert.equal(SITE.subject, "金融");
  assert.equal(SITE.name, "FinHOT");

  const hotFile = path.resolve(rootDir, "apps/web/app/routes/hot.tsx");
  const content = fs.readFileSync(hotFile, "utf-8");

  // Meta description assertion
  assert.ok(
    content.includes("`过去 48 小时 ${SITE.subject}领域最受关注的 10 个重大事件：热度指数、趋势与组成热度的公开权威来源。`"),
    "hot.tsx meta description must include financial subject interpolation"
  );

  // Subtitle assertion - verified pure JSX expression without literal ${}
  assert.ok(
    content.includes("过去 {hot.windowHours} 小时，{SITE.subject}领域最受关注的 {hot.entries.length || 10} 件事"),
    "hot.tsx subtitle must include valid JSX expression without dollar literal"
  );
  assert.equal(
    content.includes("小时，${SITE.subject}领域最受关注"),
    false,
    "hot.tsx subtitle must not contain literal ${SITE.subject} in JSX tag"
  );
});

test("story.tsx and item.tsx route labels updated to objective financial terminology", () => {
  const storyFile = path.resolve(rootDir, "apps/web/app/routes/story.tsx");
  const storyContent = fs.readFileSync(storyFile, "utf-8");
  assert.ok(storyContent.includes('label: "事件综述"'), "story.tsx overview label must be 事件综述");
  assert.ok(storyContent.includes("根据各方权威报道客观归纳"), "story.tsx note must state objective authoritative reporting");

  const itemFile = path.resolve(rootDir, "apps/web/app/routes/item.tsx");
  const itemContent = fs.readFileSync(itemFile, "utf-8");
  assert.ok(itemContent.includes('"正文 · 智能翻译"'), "item.tsx translation label must be 正文 · 智能翻译");
  assert.ok(itemContent.includes('<RailSection title="精选评估">'), "item.tsx sidebar must be 精选评估");
  assert.ok(itemContent.includes('{summaryOnly ? "摘要" : "核心导读"}'), "item.tsx summary label must be 核心导读");
});

test("feedback and admin route placeholders updated to financial domain and FinHOT signature", () => {
  const feedbackFile = path.resolve(rootDir, "apps/web/app/routes/feedback.tsx");
  const feedbackContent = fs.readFileSync(feedbackFile, "utf-8");
  assert.ok(feedbackContent.includes("例如：我在搜索“美联储”或“降息”时遇到……我原本想……"));

  const sourceNewFile = path.resolve(rootDir, "apps/web/app/routes/admin/source-new.tsx");
  const sourceNewContent = fs.readFileSync(sourceNewFile, "utf-8");
  assert.ok(sourceNewContent.includes('placeholder="例如：中国人民银行官网"'));
  assert.ok(sourceNewContent.includes('placeholder="pboc-gov"'));
  assert.equal(sourceNewContent.includes('placeholder="openai-blog"'), false);

  const adminFeedbackFile = path.resolve(rootDir, "apps/web/app/routes/admin/feedback.tsx");
  const adminFeedbackContent = fs.readFileSync(adminFeedbackFile, "utf-8");
  assert.ok(adminFeedbackContent.includes("签名统一 FinHOT。"));
});

test("preview-server.ts strictly adheres to financial compliance and avoids investment advice", () => {
  const previewFile = path.resolve(rootDir, "scripts/preview-server.ts");
  const previewContent = fs.readFileSync(previewFile, "utf-8");

  assert.equal(previewContent.includes("建议超配"), false, "Must not contain advisory 建议超配");
  assert.equal(previewContent.includes("看好中国核心权益资产估值修复"), false, "Must not contain subjective 看好");
});

