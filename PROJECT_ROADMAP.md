# FinHOT 迭代路线图 (PROJECT_ROADMAP.md)

当前状态：Phase 1 基础定制中
调度周期：每 6 小时自动迭代

## Phase 1: 金融基础定制与模块裁剪
- [x] Task 1.0: 代码仓库克隆与依赖准备 (/Users/liyuehuan/hoteveryone)
- [x] Task 1.1: 多智能体组织建立（PM + Builder + Critic 角色就绪）
- [x] Task 1.2: Obsidian 项目知识库建立 (/Users/liyuehuan/Obsidian/FinHOT)
- [ ] Task 1.3: 基础定制与开关裁剪
  - 修改 `industry/site.ts`（站名 FinHOT、行业词、文案、关于页）
  - 修改 `industry/features.ts`（关闭 AI 模型排行榜与 Codex 监控）
  - 跑通 `npm run typecheck`

## Phase 2: 金融分类体系与实体库建立
- [ ] Task 2.1: 修改 `industry/taxonomy.ts`
- [ ] Task 2.2: 修改 `industry/topics.json`

## Phase 3: 金融权威信源接入与清洗
- [ ] Task 3.1: 重构 `industry/sources.json`
- [ ] Task 3.2: 本地运行信源抓取与清洗测试 (`scripts/smoke.ts`)

## Phase 4: 金融核心 KnowHow（Prompt 与评分机制）
- [ ] Task 4.1: 定制预筛提示词 `industry/prompts/prefilter.md`
- [ ] Task 4.2: 定制五维评分提示词 `industry/prompts/selection-score.md`
- [ ] Task 4.3: 定制写作与防幻觉提示词 `industry/prompts/summary.md`
- [ ] Task 4.4: 调整精选门槛 `industry/selection.ts`

## Phase 5: 金融合规、品牌与容器化验证
- [ ] Task 5.1: 完善免责声明条款与隐私说明 (`industry/pages/`)
- [ ] Task 5.2: 替换品牌图标 (`industry/brand/`)
- [ ] Task 5.3: Docker Compose 构建与首期成刊验证
