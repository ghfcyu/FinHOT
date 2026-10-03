# 金融精选与机制校准

## 一条金融资料怎么变成精选

1. **收进来**：同一网址、同一内容只留一份。只有标题或订阅摘要的，先抓原文页面再判断。
2. **预筛**（`prefilter.md`）：判断是否属于金融与宏观商业范畴。宽进，只拦截明显无关的泛娱乐、游戏、生活琐事等：`BLOCK` 的资料不出现在任何公开页面；`PASS` 和拿不准的 `UNKNOWN` 继续往下走。
3. **评分**（`selection-score.md`）：同一份金融评分标准独立打两次分（0–100）。**两次之和 ≥ 2 × 门槛**就入选，门槛按信源分级不同。页面上显示的分数是两次的平均（向下取整）。
4. **写标题摘要与入选理由**：入选的和差一点入选的（平均分高于 `understandFloor`），按 `content-understanding.md` 写中文专业标题、答案先行事实摘要、入选理由（`editorialJudgment`，严禁写成买卖推荐或投资建议）和标签；其余的按 `summarize-*.md` 写简短的标题摘要，进“全部动态”。
5. **结构化**（`structure.md`）：分类（6 大金融分类）、标签、主体机构/公司（21 家核心监管与标的实体）、事实（谁、做了什么、对什么），和评分同时进行。主题页和事件归组靠它。
6. **归组**（`group-*.md`）：不同来源报道的同一金融事件归成一个事件，事件页有综述（`story-digest.md`），“热门”按事件排。入选的资料要等归组完成（最多 3 分钟）才出现在精选里，避免同一重大行情或决议先冒出好几条。
7. **日报、周报、月报**（`report-*.md`）：每天 08:00 出《金融日报》（前一天 08:00 到当天 08:00 的精选候选），每周一 10:00 出上周周报，每月 1 日 10:30 出上月月报。资料进入站点后若跨过刊期边界才确定精选公开时间，便归入下一期候选池；截止前已确定公开时间、但仍在提交的发布事务，取稿会等它提交后再读取，避免漏过前后两期。最终刊载仍受同一事实去重和版面容量限制。

每一步的提示词都在 `industry/prompts/`，改提示词不用改代码。提示词的版本就是它内容的哈希：改了提示词，之后的新资料按新版判断，已经判过的不会重算。

---

## 金融分级门槛：`industry/selection.ts`

```ts
export const SELECTION = {
  thresholds: { T1: 60, T1_5: 65, T2: 76 },   // 两次评分的平均至少要到这个数
  understandFloor: 50,                        // 平均分高于它的未入选资料，也按入选的写法写
};
```

各分级的行业逻辑与门槛设定考量：

- **T1（门槛 60 分）**：中央银行（中国人民银行、美联储、欧洲央行、英国央行）与核心监管部门（证监会、金融监管总局、SEC）一手发布。监管政策与宏观决议具备天然权威性和市场穿透力，公文措辞通常严谨中性，门槛适度放宽以确保核心政令**零遗漏**。
- **T1_5（门槛 65 分）**：彭博社、华尔街日报、路透社、FT、财联社、第一财经等主流权威财经媒体，以及标杆核心上市主体（如腾讯、工商银行、英伟达等）的一手财报。要求具备清晰的增量信息与市场影响力。
- **T2（门槛 76 分）**：券商卖方研报、行业垂直媒体、金融科技自媒体。门槛设定显著收紧（76 分），建立天然防火墙，从严防范自媒体黑嘴荐股、理财课营销、空气币炒作与情绪化恐慌小作文。
- **understandFloor（50 分）**：平均分超过 50 分的未入选高价值资料，同样生成规范的专业事实摘要与入选理由，收录进“全部动态”。

---

## 金标校准（Calibration）

### 1. 准备样本集

从你盯防的信源中挑选 100–200 条代表性金融资料，逐条人工标注“该选 / 不该选”，存成 `.data/gold.jsonl`（`.data/` 目录不进 Git）。每行一条标准 JSON：

```json
{"caseId":"fin-macro-001","material":{"title":"美联储联邦公开市场委员会决定下调联邦基金利率目标区间25个基点","originalTitle":"Federal Reserve issues FOMC statement","publishedAt":"2026-09-18T02:00:00+08:00","sourceName":"美联储政策发布","bodyZh":null,"bodyOriginal":"Recent indicators suggest that economic activity has continued to expand at a solid pace... In light of the progress on inflation and the balance of risks, the Committee decided to lower the target range for the federal funds rate by 1/4 percentage point to 4-1/2 to 4-3/4 percent."},"sourceFacts":{"sourceKind":"rss","sourceTier":"T1","firstParty":true,"language":"en"},"samplingContext":{"benchmarkSplit":"development","samplingStratum":"macro-policy"},"gold":{"decision":"select"}}
```

| 字段 | 说明 | 金融场景规范 |
|---|---|---|
| `caseId` | 唯一编号 | 建议按业务分类编号，如 `fin-macro-001`, `fin-noise-010` |
| `material` | 标题、原标题、发布时间、信源名、正文 | 中文正文放 `bodyZh`，英文或外文原文放 `bodyOriginal` |
| `sourceFacts` | 信源类型、分级、是否一手、语言 | `sourceTier` 必须为 `T1`、`T1_5` 或 `T2`，决定所匹配的评分门槛 |
| `samplingContext` | 评估切分与分层抽样 | `benchmarkSplit` 分开发集（`development`）和留出集（`holdout`）；`samplingStratum` 对应金融业务或噪声类型 |
| `gold.decision` | 人工黄金判定 | `select` 该选，`reject` 不该选，`either` 两可边界样本（不计入决定性指标） |

`industry/gold.example.jsonl` 内置了 18 条标准示例，覆盖 6 大金融业务维度、5 大金融典型噪声和 2 类边界样本。

#### 建议的样本分层分布（Sampling Strata）
- **宏观与监管（`macro-policy` / `institutions`）**：央行降准降息、流动性工具操作、重大涉案行政处罚。
- **市场与财报（`capital-markets` / `earnings-corporate`）**：全天成交放量异动、核心宽基突破、大型龙头企业财报核心财务数据。
- **前沿与深度（`fintech` / `opinion`）**：量化高频风控、金融大模型基础设施、顶级智库深度货币研报。
- **高危金融噪声（`noise-*`）**：
  - `noise-stock-promotion`：荐股群引流、涨停板战法、游资内幕代码推销。
  - `noise-course-marketing`：财商训练营、0元理财课、被动收入躺赚软文。
  - `noise-crypto-hype`：山寨币/空气币暴富宣传、交易所内幕传言。
  - `noise-trivial-announcement`：微小分支机构例行营业时间调整、无行业影响的细碎公告。
  - `noise-unverified-panic`：无官方依据的“银行破产”“金融海啸”惊悚恐慌标题党。
- **难例与留出集**：保留 20%–30% 样本作为留出集（`benchmarkSplit: "holdout"`），提示词微调期间只看开发集，最后在留出集上做端到端无偏验证。

---

### 2. 跑评测

```bash
node --env-file=.env scripts/eval-selection.ts --gold .data/gold.jsonl --split development --label "第一版金融评分标准"
```

对样本逐条运行预筛与双重独立评分，输出：

- **准确率（Accuracy）、查准率（Precision）、查全率（Recall）**；
- 门槛从 40 到 90 每隔 2 分的模拟扫描（Threshold Sweep）；
- 判错条目明细报告输出到 `.data/eval/`，并自动导入后台 SelectBench。

常用参数：
- `--models default,deepseek-flash`：横向对比不同模型在金融标准下的评分表现；
- `--n 200`：限制评测抽取条数；
- `--split holdout`：仅在留出集上执行终验。

---

### 3. 看错例，调标准，精校门槛

在后台 SelectBench 中重点排查以下两类错例并进行针对性微调：

#### A. 漏选分析（False Negative：该选却被拒）
- **现象**：央行或部委权威公文因为没有夸张形容词或语气克制，被判定为“信息平淡”而得分偏低（50–58 分）。
- **优化**：不要盲目下调 T1 门槛！应在 `industry/prompts/selection-score.md` 的“必须正常评价”章节中明确：凡央行准备金率、政策利率、公开市场逆回购、系统重要性金融机构监管指标等一手发布，基础事实权重即赋予 60–80 分基准区间。

#### B. 误选分析（False Positive：噪声溜进精选）
- **现象**：软文伪装成“宏观经济展望”，结尾夹带私货引导加群或推荐个股。
- **优化**：在 `selection-score.md` 的“必须压住的噪声”规则中加入穿透式判定：一旦文内出现具体股票买卖指引、引流微信号/群、承诺固定回报率，直接触发**一票否决**打入 20 分以下。

#### C. 调整门槛的黄金法则
**先改提示词标准，后动门槛数字。** 只有当绝大多数错例的分数都紧密扎堆在门槛边界（如优质研报均在 74–75 分，而门槛为 76 分），且修改提示词后分布仍然稳定时，才在 `industry/selection.ts` 中微调 1–2 分。

---

## 模型适配与金融风控

金融资讯具有极高的事实严谨性要求，在后台“模型与评测”中挑选或切换模型时，必须重点核验：
1. **数字与基点敏感度**：对 25bps、0.5 个百分点、营收同比/环比增速的理解是否准确，避免单位混淆；
2. **金融合规边界**：模型撰写 `editorialJudgment`（入选理由）时，是否严格遵守不提供投资建议的约束，杜绝“买入建议”“建议关注”“抄底良机”等诱导性违规表述；
3. **Token 与吞吐成本**：双重独立评分机制下，单篇资料消耗两次打分调用，优先选用推理速度快、长上下文指令遵从度高的模型。
