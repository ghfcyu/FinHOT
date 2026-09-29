<p align="center">
  <h1 align="center">📈 FinHOT</h1>
  <p align="center"><b>金融行业热点追踪与自动化研报生成框架</b></p>
  <p align="center">
    穿透市场噪音，追踪宏观政策、资本市场异动与商业脉搏。
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="MIT License">
  <img src="https://img.shields.io/badge/Node.js-24-176b75?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js 24">
  <img src="https://img.shields.io/badge/PostgreSQL-17-176b75?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL 17">
  <img src="https://img.shields.io/badge/Domain-Finance-success?style=flat-square" alt="Finance">
</p>

---

## 📌 项目介绍

**FinHOT** 是一个专为**金融领域**设计的行业热点自动化追踪与分析框架。本项目基于开源热点框架进行垂直领域深度定制，核心聚焦于：

1. **权威一手监管信源**：重点覆盖中国人民银行 (PBOC)、中国证监会 (CSRC)、国家金融监管总局、国家统计局、美联储等宏观与监管政策。
2. **严苛的去噪与双评分体系**：坚决剔除黑嘴荐股、营销通稿与标题党情绪文，从**宏观影响度、信息权威性、实质增量、时效性、分析深度**五个专业维度进行模型双重打分。
3. **结论先行与数据精准写作**：强制大模型以严谨客观的金融术语输出摘要，核心指标（利率变动、营收、净利润等）严格以原文为准，严防大模型幻觉。
4. **事件聚簇与真实热度**：将多媒体交叉报道聚合成单一事件，按独立一手信源密度计算市场真实热度，自动生成每日金融早报。

---

## 🏗️ 核心架构与功能

| 模块 | 能力说明 |
|---|---|
| **多协议权威信源** | 支持监管官网 RSS / 网页选择器抓取、快讯 JSON 接口、财经公众号等 |
| **金融精选与打分** | 预筛（剔除纯广告）+ 双模型独立打分 + 信源分级准入门槛机制 |
| **结论先行写作** | 提炼客观中文标题、结论先行摘要、核心数据归纳、行业标签 |
| **事件流聚合** | 48小时内同主题报道聚合为同一事件，后续进展挂载同一事件流 |
| **自动化出刊** | 每天 08:00 自动生成《金融早报》，按宏观、资本市场、商业财报等分类分节 |
| **Agent 原生支持** | 提供公开 API (`/api/v1/`) 与原生 **MCP 工具协议** (`/api/mcp`) |

---

## 🤖 智能体研发团队 (Multi-Agent System)

本项目采用全自主多智能体协作与持续审查体系：
- **项目经理 (PM Agent)**：统筹任务规划、状态看板维护与发版仲裁。
- **一线研发 (Builder Agent)**：负责按任务工单进行代码编写与本地编译自测。
- **反派审查 (The Critic Agent)**：专职红队审计，每天早上 09:00 进行全量代码、脆弱性、Token成本与金融合规深度挑刺。

---

## ⚡ 快速开始

### 依赖环境
- Node.js >= 24
- PostgreSQL >= 17 或 Docker

### 本地启动
```bash
git clone https://github.com/ghfcyu/FinHOT.git
cd FinHOT

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 配置你的大模型 API KEY (支持 DeepSeek / 通义千问 / 智谱 等)

# 启动数据库与全栈服务
docker compose up -d --build
```
访问 `http://localhost:3000` 查看前台，访问 `http://localhost:3000/admin` 进入管理后台。

---

## ⚠️ 免责声明 (Disclaimer)

1. 本项目所有内容均由算法及大模型根据公开信源自动清洗、摘要与聚合生成，**仅供金融资讯研究与技术学习交流使用**。
2. **本站任何内容均不构成任何投资建议、买卖要约或金融决策依据**。市场有风险，投资需谨慎。

---

## 📄 开源许可

本项目代码遵循 [MIT 许可证](LICENSE)。
底层框架致敬并衍生自 AIHOT 开源生态。
