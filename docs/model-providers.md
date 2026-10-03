# 模型服务与推理引擎集成

FinHOT 采用大语言模型实现金融资讯的预筛（Prefilter）、独立双重打分（Selection Score）、内容理解（Content Understanding / 摘要与入选理由）、实体结构化提取（Structure）以及每日日报生成（Daily Briefing）。

所有模型调用必须经过回执层（`packages/backend/src/providers/receipts.ts`）与预算熔断防护。API 密钥物理保存在服务器环境的 `.env` 中，严禁提交至 Git 仓库。

---

## 1. 默认主力引擎：美团 LongCat 大模型平台

FinHOT 推荐并已深度适配**美团 LongCat 大模型平台**。该平台全面兼容 OpenAI 标准协议规范。

### 配置规范（`.env`）
```bash
# 美团 LongCat OpenAI 兼容端点
LLM_BASE_URL=https://api.longcat.chat/openai/v1
LLM_API_KEY=你的_API_KEY
LLM_MODEL=LongCat-2.5-Preview

# 可选：单步骤定制模型
# PREFILTER_MODEL=LongCat-2.5-Preview
# SCORE_MODEL=LongCat-2.5-Preview
```

### 规格与能力特征
| 参数项 | 规格指标 | 适用环节 |
| :--- | :--- | :--- |
| **上下文窗口** | 1,048,576 Tokens（1M 上下文） | 深度研报、长篇财报公告与跨期事件综述 |
| **最大输出限制** | 262,144 Tokens | 完整期刊与海量结构化抽取 |
| **格式遵从** | 原生支持 `response_format: {"type": "json_object"}` | 预筛、评分与内容理解全链路 JSON 解析 |
| **思考链路** | 协议自动将推理链路剥离至 `reasoning_content` | 最终 JSON 干净纯正，不产生 Markdown 冗余 |

---

## 2. 线上接口验证与测试基准

在部署接入新 Key 或切换模型时，可通过标准 CLI 验证基础连通性与金融垂类判定质量：

### A. 模型列表连通性检查
```bash
curl -s -H "Authorization: Bearer $LLM_API_KEY" $LLM_BASE_URL/models
# 预期返回包含 LongCat-2.5-Preview 的合法 JSON 列表
```

### B. 金融违规预筛拦截能力实测
```bash
curl -s -X POST $LLM_BASE_URL/chat/completions \
  -H "Authorization: Bearer $LLM_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "LongCat-2.5-Preview",
    "messages": [
      {"role": "system", "content": "为FinHOT做宽召回的金融财经相关性预筛。只返回合法JSON：{\"label\": \"PASS\" | \"BLOCK\" | \"UNKNOWN\", \"reason\": \"理由\"}"},
      {"role": "user", "content": "【标题】下周必涨30%的三只大牛股速领\n【正文】加助理微信进群免费领取股票代码。"}
    ],
    "response_format": {"type": "json_object"}
  }'
# 预期输出：label 为 BLOCK，reason 命中荐股违规
```

---

## 3. Token 成本与防护机制

为了防止长文本无节制透传造成并发雪崩或 Token 浪费，工程流水线设定了严格的截断防护：
1. **预筛阶段（Prefilter）**：输入正文裁剪至 2,000 字符（`PREFILTER_MAX_CHARS`），秒级完成领域判断；
2. **打分阶段（Score）**：输入正文裁剪至 8,000 字符（`SCORE_MAX_BODY_CHARS`），保留核心数据、表格与论据，剔除冗长法律尾页；
3. **理解阶段（Understand）**：输出限制 `maxTokens: 2_048`，防止生成端死循环刷 Token；
4. **回执复用（Receipt Deduplication）**：相同哈希材料在分析时不重复发起付费调用，优先命中本地回执缓存。
