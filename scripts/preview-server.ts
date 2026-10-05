// FinHOT 本地交互式演示 API 服务 (Zero-dependency Mock API Server)
// 使用 Node.js 原生 node:http 构建，零外部依赖，严格适配 @aihot/contracts 契约。
import http from "node:http";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// 读取金融专题目录
interface TopicRaw {
  slug: string;
  name: string;
  group: string;
  entityId?: string;
  tags: string[];
  definition: string;
  related?: string[];
}

interface TopicsData {
  exportedAt: string;
  groups: Array<{ key: string; name: string; blurb: string }>;
  topics: TopicRaw[];
}

let topicsData: TopicsData;
try {
  const topicsPath = resolve(__dirname, "../industry/topics.json");
  topicsData = JSON.parse(readFileSync(topicsPath, "utf-8")) as TopicsData;
} catch {
  topicsData = { exportedAt: "2026-10-01", groups: [], topics: [] };
}

const topicNameBySlug = new Map<string, string>(topicsData.topics.map((t) => [t.slug, t.name]));

// 12 条高保真金融资讯条目（完整覆盖 6 大金融分类）
export interface FinancialItem {
  id: string;
  revision: number;
  title: string;
  originalTitle: string | null;
  summary: string;
  reason: string;
  source: {
    id: string;
    name: string;
    kind: "web_list" | "rss" | "mp_account";
    firstParty: boolean;
    iconUrl: string | null;
  };
  links: {
    aihot: string;
    original: string;
  };
  publishedAt: string;
  discoveredAt: string;
  timelineAt: string;
  category: "macro-policy" | "capital-markets" | "earnings-corporate" | "institutions" | "fintech" | "opinion";
  tags: string[];
  subjects: string[];
  score: number;
  selected: boolean;
  channel: "news" | "x";
  story: { publicId: string; title: string } | null;
  x: null;
  facts: Array<{ subject: string; predicate: string; object: string; impact: string }>;
  extractedFacts: Array<{ subject: string; action: string; outcome: string }>;
  attribution: { name: string; url: string };
}

const ITEMS: FinancialItem[] = [
  {
    id: "item-fin-001",
    revision: 1,
    title: "中国人民银行开展公开市场国债买卖操作 保持银行体系流动性合理充裕",
    originalTitle: "中国人民银行公开市场国债买卖业务公告",
    summary: "央行公告称，为贯彻落实中央金融工作会议精神，保持银行体系流动性合理充裕，2026年10月开展公开市场国债买卖操作，全月净买入面值为2000亿元人民币。此举进一步丰富了基础货币投放渠道，有力引导国债收益率曲线平稳运行。",
    reason: "央行常态化开展国债买卖操作，体现稳健货币政策基调与宏观流动性引导，具有重大政策指示信号。",
    source: { id: "pbc", name: "中国人民银行官网", kind: "web_list", firstParty: true, iconUrl: null },
    links: { aihot: "/items/item-fin-001", original: "http://www.pbc.gov.cn/goutongjiaoliu/113456/index.html" },
    publishedAt: "2026-10-05T07:30:00.000Z",
    discoveredAt: "2026-10-05T07:35:00.000Z",
    timelineAt: "2026-10-05T07:30:00.000Z",
    category: "macro-policy",
    tags: ["宏观政策", "货币政策", "债券"],
    subjects: ["中国人民银行", "公开市场操作"],
    score: 9.6,
    selected: true,
    channel: "news",
    story: { publicId: "story-monetary-easing", title: "全球央行货币政策协同转向与流动性格局演进" },
    x: null,
    facts: [
      { subject: "中国人民银行", predicate: "开展", object: "公开市场国债买卖操作", impact: "全月净买入2000亿元国债" },
      { subject: "货币政策司", predicate: "丰富", object: "基础货币投放工具", impact: "引导国债收益率曲线平稳运行" },
    ],
    extractedFacts: [
      { subject: "中国人民银行", action: "买入国债2000亿元", outcome: "保持流动性合理充裕" },
    ],
    attribution: { name: "中国人民银行官网", url: "http://www.pbc.gov.cn" },
  },
  {
    id: "item-fin-002",
    revision: 1,
    title: "国家金融监督管理总局印发银行业保险业资本管理与风险处置最新指引",
    originalTitle: "金融监管总局加强中小金融机构风险防控若干规定",
    summary: "金融监管总局完善中小金融机构差异化资本管理框架，推进高风险机构穿透式监管，明确对资本充足率低于预警线机构的早期纠正与分级处置机制。",
    reason: "防范化解金融风险核心规章落地，显著提升中小银行与保险机构资本韧性。",
    source: { id: "nfra", name: "国家金融监督管理总局", kind: "web_list", firstParty: true, iconUrl: null },
    links: { aihot: "/items/item-fin-002", original: "https://www.nfra.gov.cn" },
    publishedAt: "2026-10-05T06:50:00.000Z",
    discoveredAt: "2026-10-05T07:00:00.000Z",
    timelineAt: "2026-10-05T06:50:00.000Z",
    category: "macro-policy",
    tags: ["监管动态", "银行", "保险"],
    subjects: ["国家金融监督管理总局", "资本管理"],
    score: 9.2,
    selected: true,
    channel: "news",
    story: { publicId: "story-monetary-easing", title: "全球央行货币政策协同转向与流动性格局演进" },
    x: null,
    facts: [
      { subject: "金融监管总局", predicate: "出台", object: "资本管理与风险处置新规", impact: "强化穿透式监管与早期预警" },
    ],
    extractedFacts: [
      { subject: "金融监管总局", action: "出台审慎监管新规", outcome: "健全分级处置机制" },
    ],
    attribution: { name: "国家金融监督管理总局", url: "https://www.nfra.gov.cn" },
  },
  {
    id: "item-fin-003",
    revision: 1,
    title: "A股三大指数全天震荡走强 沪深两市成交总额突破1.5万亿元",
    originalTitle: "A股收评：放量长阳突破关键点位 科技与金融齐飞",
    summary: "A股全天高开高走，创业板指领涨超3%，全市场成交额达1.52万亿元，较前一交易日放量超3000亿元。半导体芯片、券商、高股息红利资产领涨，外资净买入超120亿元。",
    reason: "成交量能显著放大，多头情绪与风险偏好共振回暖，市场结构性主线清晰。",
    source: { id: "cls", name: "财联社宏观", kind: "rss", firstParty: false, iconUrl: null },
    links: { aihot: "/items/item-fin-003", original: "https://www.cls.cn" },
    publishedAt: "2026-10-05T07:15:00.000Z",
    discoveredAt: "2026-10-05T07:20:00.000Z",
    timelineAt: "2026-10-05T07:15:00.000Z",
    category: "capital-markets",
    tags: ["市场行情", "A股", "大盘异动"],
    subjects: ["上交所", "深交所", "A股市场"],
    score: 8.9,
    selected: true,
    channel: "news",
    story: { publicId: "story-a-share-rally", title: "A股交投持续突破万亿 核心指数震荡走强与估值修复" },
    x: null,
    facts: [
      { subject: "A股市场", predicate: "成交总额", object: "1.52万亿元", impact: "较前一交易日放量3000亿元" },
    ],
    extractedFacts: [
      { subject: "A股三大指数", action: "全天放量上涨", outcome: "北向资金净流入超百亿" },
    ],
    attribution: { name: "财联社宏观", url: "https://www.cls.cn" },
  },
  {
    id: "item-fin-004",
    revision: 1,
    title: "伦敦现货黄金突破历史新高 全球央行购金需求与避险配置共振",
    originalTitle: "国际金价盘中再创历史新高 突破2750美元关口",
    summary: "现货黄金涨至每盎司2752美元，创历史新纪录。世界黄金协会最新数据显示，三季度全球央行净购金量达186吨，机构投资者黄金ETF持仓持续录得净流入。",
    reason: "贵金属异动反映全球去美元化叙事演进与全球资产储备多元化趋势。",
    source: { id: "yicai", name: "第一财经", kind: "rss", firstParty: false, iconUrl: null },
    links: { aihot: "/items/item-fin-004", original: "https://www.yicai.com" },
    publishedAt: "2026-10-05T05:40:00.000Z",
    discoveredAt: "2026-10-05T05:45:00.000Z",
    timelineAt: "2026-10-05T05:40:00.000Z",
    category: "capital-markets",
    tags: ["市场行情", "大宗商品", "黄金"],
    subjects: ["现货黄金", "全球央行", "避险资产"],
    score: 8.8,
    selected: true,
    channel: "news",
    story: { publicId: "story-a-share-rally", title: "A股交投持续突破万亿 核心指数震荡走强与估值修复" },
    x: null,
    facts: [
      { subject: "现货黄金", predicate: "升至", object: "2752美元/盎司", impact: "创历史新高" },
    ],
    extractedFacts: [
      { subject: "全球央行", action: "持续净买入黄金", outcome: "支撑金价长周期中枢上行" },
    ],
    attribution: { name: "第一财经", url: "https://www.yicai.com" },
  },
  {
    id: "item-fin-005",
    revision: 1,
    title: "贵州茅台发布前三季度业绩：营收利润实现双位数稳健增长 现金流充沛",
    originalTitle: "贵州茅台酒股份有限公司2026年第三季度报告",
    summary: "贵州茅台前三季度营业总收入1207.76亿元，同比增长16.95%；归母净利润608.28亿元，同比增长15.04%。公司经营活动现金流净额超480亿元，特别分红方案有序实施中。",
    reason: "核心消费白马业绩兑现度高，高分红与稳健经营树立A股蓝筹价值标杆。",
    source: { id: "sse", name: "上交所公告", kind: "web_list", firstParty: true, iconUrl: null },
    links: { aihot: "/items/item-fin-005", original: "https://www.sse.com.cn" },
    publishedAt: "2026-10-05T04:20:00.000Z",
    discoveredAt: "2026-10-05T04:25:00.000Z",
    timelineAt: "2026-10-05T04:20:00.000Z",
    category: "earnings-corporate",
    tags: ["财报业绩", "分红回购", "公司治理"],
    subjects: ["贵州茅台", "三季报"],
    score: 8.7,
    selected: true,
    channel: "news",
    story: null,
    x: null,
    facts: [
      { subject: "贵州茅台", predicate: "前三季度净利润", object: "608.28亿元", impact: "同比增长15.04%" },
    ],
    extractedFacts: [
      { subject: "贵州茅台", action: "披露三季报", outcome: "业绩双位数稳步增长" },
    ],
    attribution: { name: "上交所公告", url: "https://www.sse.com.cn" },
  },
  {
    id: "item-fin-006",
    revision: 1,
    title: "宁德时代第三季度净利润同比增长26% 动力电池与储能全球市占率稳固",
    originalTitle: "宁德时代新能源科技股份有限公司三季度业绩快报",
    summary: "宁德时代单季度营业收入实现近千亿元，净利润同比增长25.9%，研发投入持续加大，神行超充电池与麒麟电池在海内外主机厂客户中渗透率攀升至历史新高。",
    reason: "全球高端制造龙头抗周期能力强，验证全球新能源产业链景气度与盈利韧性。",
    source: { id: "szse", name: "深交所公告", kind: "web_list", firstParty: true, iconUrl: null },
    links: { aihot: "/items/item-fin-006", original: "https://www.szse.cn" },
    publishedAt: "2026-10-05T04:10:00.000Z",
    discoveredAt: "2026-10-05T04:15:00.000Z",
    timelineAt: "2026-10-05T04:10:00.000Z",
    category: "earnings-corporate",
    tags: ["财报业绩", "业绩预告", "宁德时代"],
    subjects: ["宁德时代", "动力电池"],
    score: 8.5,
    selected: true,
    channel: "news",
    story: null,
    x: null,
    facts: [
      { subject: "宁德时代", predicate: "单季度净利润", object: "同比增长25.9%", impact: "全球市占率持续保持第一" },
    ],
    extractedFacts: [
      { subject: "宁德时代", action: "发布业绩快报", outcome: "动力电池与储能盈利稳步扩张" },
    ],
    attribution: { name: "深交所公告", url: "https://www.szse.cn" },
  },
  {
    id: "item-fin-007",
    revision: 1,
    title: "中国工商银行加大实体信贷投放力度 制造业中长期贷款增速超20%",
    originalTitle: "工商银行前三季度支持实体经济与高质量发展进展报告",
    summary: "中国工商银行披露最新信贷结构，普惠小微贷款余额达2.6万亿元，战略性新兴产业贷款较年初增长近25%，不良贷款率微降至1.33%，拨备覆盖率保持健康充裕水平。",
    reason: "国有大行信贷投放发力体现货币政策向实体经济传导的实效，夯实资产质量底盘。",
    source: { id: "icbc", name: "中国工商银行", kind: "web_list", firstParty: true, iconUrl: null },
    links: { aihot: "/items/item-fin-007", original: "https://www.icbc.com.cn" },
    publishedAt: "2026-10-05T03:50:00.000Z",
    discoveredAt: "2026-10-05T03:55:00.000Z",
    timelineAt: "2026-10-05T03:50:00.000Z",
    category: "institutions",
    tags: ["机构动态", "银行", "实体经济支持"],
    subjects: ["工商银行", "普惠金融"],
    score: 8.6,
    selected: true,
    channel: "news",
    story: null,
    x: null,
    facts: [
      { subject: "中国工商银行", predicate: "制造业中长期贷款增速", object: "超20%", impact: "不良率保持低位稳定" },
    ],
    extractedFacts: [
      { subject: "工商银行", action: "加大实体经济信贷投放", outcome: "资产质量结构持续优化" },
    ],
    attribution: { name: "中国工商银行", url: "https://www.icbc.com.cn" },
  },
  {
    id: "item-fin-008",
    revision: 1,
    title: "头部公募基金落实行业费率改革 多只核心宽基ETF管理费调至最低档",
    originalTitle: "易方达、华夏等基金公司公告下调核心指数产品管理与托管费率",
    summary: "公募行业第二阶段降费让利举措深入推进，首批包含沪深300、中证A500在内的多只百亿规模旗舰ETF，管理费年费率降至0.15%，托管费年费率降至0.05%，显著降低中长期持有成本。",
    reason: "费率让利投资者，助力耐心资本与长期资金入市，重塑大财富管理行业生态。",
    source: { id: "amac", name: "中国证券投资基金业协会", kind: "web_list", firstParty: true, iconUrl: null },
    links: { aihot: "/items/item-fin-008", original: "https://www.amac.org.cn" },
    publishedAt: "2026-10-05T03:20:00.000Z",
    discoveredAt: "2026-10-05T03:25:00.000Z",
    timelineAt: "2026-10-05T03:20:00.000Z",
    category: "institutions",
    tags: ["资管产品", "公募基金", "ETF"],
    subjects: ["公募基金", "费率改革", "宽基ETF"],
    score: 9.1,
    selected: true,
    channel: "news",
    story: { publicId: "story-wealth-reform", title: "公募基金行业费率改革全面深化 ETF等工具型产品迎来爆发" },
    x: null,
    facts: [
      { subject: "头部公募机构", predicate: "宽基ETF管理费", object: "下调至0.15%/年", impact: "大幅节约长线配置成本" },
    ],
    extractedFacts: [
      { subject: "公募基金行业", action: "推进指数基金费率改革", outcome: "引导中长期资金入市" },
    ],
    attribution: { name: "中国证券投资基金业协会", url: "https://www.amac.org.cn" },
  },
  {
    id: "item-fin-009",
    revision: 1,
    title: "多边央行数字货币桥（mBridge）进入首发应用阶段 跨境清算效率显著跃升",
    originalTitle: "国际清算银行与参与央行宣布mBridge项目取得重大里程碑进展",
    summary: "国际清算银行（BIS）联合中国人民银行、阿联酋央行、香港金管局等宣布，多边央行数字货币桥正式达到商用最低可行产品（MVP）阶段，实现企业本币跨境支付即时结算与点对点直连。",
    reason: "跨境多边央行数字货币结算基础设施重大突破，对去中介化清算网络影响深远。",
    source: { id: "bis", name: "国际清算银行", kind: "web_list", firstParty: true, iconUrl: null },
    links: { aihot: "/items/item-fin-009", original: "https://www.bis.org" },
    publishedAt: "2026-10-05T02:40:00.000Z",
    discoveredAt: "2026-10-05T02:45:00.000Z",
    timelineAt: "2026-10-05T02:40:00.000Z",
    category: "fintech",
    tags: ["金融科技", "数字货币", "支付清算"],
    subjects: ["数字货币桥", "跨境清算", "mBridge"],
    score: 9.4,
    selected: true,
    channel: "news",
    story: { publicId: "story-monetary-easing", title: "全球央行货币政策协同转向与流动性格局演进" },
    x: null,
    facts: [
      { subject: "mBridge项目", predicate: "达到", object: "MVP商用阶段", impact: "支持企业跨境本币即时清算" },
    ],
    extractedFacts: [
      { subject: "BIS与多国央行", action: "推进数字货币桥商业化应用", outcome: "跨境结算成本与延迟大幅削减" },
    ],
    attribution: { name: "国际清算银行", url: "https://www.bis.org" },
  },
  {
    id: "item-fin-010",
    revision: 1,
    title: "招商银行发布智能投顾垂直金融大模型 赋能财富管理与投研工作台",
    originalTitle: "招商银行金融大模型通过国家生成式人工智能服务合规备案并上线应用",
    summary: "招商银行自研金融垂直大模型正式接入投研与财富管理终端，支持万亿级资产配置多维度分析、研报要点提炼与智能合规审核，全面助力前台理财经理与机构投顾效率提升。",
    reason: "金融垂直行业大模型在复杂投研与财富管理场景中的合规标杆示范。",
    source: { id: "cmb", name: "招商银行官方", kind: "web_list", firstParty: true, iconUrl: null },
    links: { aihot: "/items/item-fin-010", original: "https://www.cmbchina.com" },
    publishedAt: "2026-10-05T02:10:00.000Z",
    discoveredAt: "2026-10-05T02:15:00.000Z",
    timelineAt: "2026-10-05T02:10:00.000Z",
    category: "fintech",
    tags: ["金融科技", "金融AI", "智能投顾"],
    subjects: ["招商银行", "金融垂直大模型"],
    score: 8.6,
    selected: true,
    channel: "news",
    story: null,
    x: null,
    facts: [
      { subject: "招商银行", predicate: "上线", object: "金融垂直大模型", impact: "投研与投顾日常工作效率提升超40%" },
    ],
    extractedFacts: [
      { subject: "招商银行", action: "推进AI与财富管理深度融合", outcome: "实现千人千面的资产配置智能诊断" },
    ],
    attribution: { name: "招商银行官方", url: "https://www.cmbchina.com" },
  },
  {
    id: "item-fin-011",
    revision: 1,
    title: "中金公司2026宏观策略研报：全球流动性拐点已至 聚焦中国资产重估机遇",
    originalTitle: "中金策略研究：逆周期政策协同发力，核心权益估值迎系统性修复",
    summary: "中金公司宏观策略团队发布深度研报认为，海外发达经济体步入降息通道，国内逆周期财政与货币政策密集出台，中国权益资产估值风险溢价正处于历史极端低位，看好科技成长与核心资产重估。",
    reason: "顶级券商宏观深度研报，为第四季度大类资产配置策略提供关键逻辑支撑。",
    source: { id: "cicc", name: "中金公司研报", kind: "rss", firstParty: false, iconUrl: null },
    links: { aihot: "/items/item-fin-011", original: "https://www.cicc.com" },
    publishedAt: "2026-10-05T01:30:00.000Z",
    discoveredAt: "2026-10-05T01:35:00.000Z",
    timelineAt: "2026-10-05T01:30:00.000Z",
    category: "opinion",
    tags: ["研报分析", "宏观策略", "资产配置"],
    subjects: ["中金公司", "宏观策略研报"],
    score: 8.9,
    selected: true,
    channel: "news",
    story: { publicId: "story-a-share-rally", title: "A股交投持续突破万亿 核心指数震荡走强与估值修复" },
    x: null,
    facts: [
      { subject: "中金公司", predicate: "研判", object: "全球流动性拐点基本确立", impact: "中国核心权益资产估值风险溢价处于历史低位" },
    ],
    extractedFacts: [
      { subject: "中金策略团队", action: "发布四季度大类资产配置研报", outcome: "分析科技成长与高股息板块基本面特征" },
    ],
    attribution: { name: "中金公司研报", url: "https://www.cicc.com" },
  },
  {
    id: "item-fin-012",
    revision: 1,
    title: "中信证券：增量政策持续见效 重点关注化债推进与内需消费链条传导",
    originalTitle: "中信证券政策与经济追踪：化债举措切实落地，微观流动性逐步通畅",
    summary: "中信证券研究指出，地方政府隐性债务置换工作有序推开，直接改善地方财政流动性与企业应收账款周转，建筑工程与现代服务业微观现金流有望率先受益企稳。",
    reason: "透彻剖析宏观财政举措在微观产业链条中的传导逻辑，事实与论证逻辑严谨。",
    source: { id: "citic", name: "中信证券研究", kind: "rss", firstParty: false, iconUrl: null },
    links: { aihot: "/items/item-fin-012", original: "https://www.citics.com" },
    publishedAt: "2026-10-05T01:00:00.000Z",
    discoveredAt: "2026-10-05T01:05:00.000Z",
    timelineAt: "2026-10-05T01:00:00.000Z",
    category: "opinion",
    tags: ["专家观点", "财政政策", "化债"],
    subjects: ["中信证券", "地方化债"],
    score: 8.7,
    selected: true,
    channel: "news",
    story: null,
    x: null,
    facts: [
      { subject: "中信证券", predicate: "指出", object: "地方化债推进释放微观流动性", impact: "显著改善企业资产负债表预期" },
    ],
    extractedFacts: [
      { subject: "中信证券研究部", action: "解析隐性债务置换传导效应", outcome: "预期内需链条与基建产业链率先回暖" },
    ],
    attribution: { name: "中信证券研究", url: "https://www.citics.com" },
  },
];

// 热点故事聚类
export interface HotStory {
  publicId: string;
  title: string;
  status: "active" | "watching" | "settled";
  reportCount: number;
  sourceCount: number;
  firstReportAt: string;
  latestAt: string;
  digest: string;
  digestUpdatedAt: string;
  summary: string;
  excerpt: { text: string; sourceName: string } | null;
  latest: string;
  whyHot: {
    participants48h: number;
    newParticipants6h: number;
    recentReports24h: number;
    observationComplete: boolean;
    rank: number;
    heat: number;
  };
  developments: Array<{
    factId: string;
    title: string;
    occurredAt: string;
    firstReportAt: string;
    reportCount: number;
    representative: {
      id: string;
      title: string;
      summary: string;
      source: { id: string; name: string; kind: "web_list" | "rss"; firstParty: boolean; iconUrl: string | null };
      publishedAt: string;
      originalUrl: string;
      selected: boolean;
      factId: string;
    };
  }>;
  officialReports: Array<{
    id: string;
    title: string;
    summary: string;
    source: { id: string; name: string; kind: "web_list" | "rss"; firstParty: boolean; iconUrl: string | null };
    publishedAt: string;
    originalUrl: string;
    selected: boolean;
    factId: string;
  }>;
  timeline: Array<{
    id: string;
    title: string;
    summary: string;
    source: { id: string; name: string; kind: "web_list" | "rss"; firstParty: boolean; iconUrl: string | null };
    publishedAt: string;
    originalUrl: string;
    selected: boolean;
    factId: string;
  }>;
  heat: Array<{ hour: string; heat: number; participants: number }>;
  related: Array<{ publicId: string; title: string; relation: "storyline" | "related"; latestAt: string }>;
}

const STORIES: HotStory[] = [
  {
    publicId: "story-monetary-easing",
    title: "全球央行货币政策协同转向与流动性格局演进",
    status: "active",
    reportCount: 6,
    sourceCount: 4,
    firstReportAt: "2026-10-04T08:00:00.000Z",
    latestAt: "2026-10-05T07:30:00.000Z",
    digest: "美联储、中国人民银行等主要央行相继通过降息与常态化国债买卖工具释放充裕中长期流动性，全球资产风险溢价重估提速。",
    digestUpdatedAt: "2026-10-05T07:35:00.000Z",
    summary: "多国央行降息与流动性工具协同落地，为实体经济注入资金活力，强化金融市场信心。",
    excerpt: { text: "美联储公开市场委员会与人民银行持续优化基础货币投放机制。", sourceName: "第一财经" },
    latest: "中国人民银行开展公开市场国债买卖操作，全月净买入2000亿元。",
    whyHot: {
      participants48h: 18,
      newParticipants6h: 6,
      recentReports24h: 12,
      observationComplete: true,
      rank: 1,
      heat: 985,
    },
    developments: [
      {
        factId: "fact-001",
        title: "央行常态化买卖国债投放基础货币",
        occurredAt: "2026-10-05T07:30:00.000Z",
        firstReportAt: "2026-10-05T07:30:00.000Z",
        reportCount: 3,
        representative: {
          id: "item-fin-001",
          title: "中国人民银行开展公开市场国债买卖操作 保持银行体系流动性合理充裕",
          summary: "央行公告称，10月全月净买入面值为2000亿元人民币国债。",
          source: { id: "pbc", name: "中国人民银行官网", kind: "web_list", firstParty: true, iconUrl: null },
          publishedAt: "2026-10-05T07:30:00.000Z",
          originalUrl: "http://www.pbc.gov.cn",
          selected: true,
          factId: "fact-001",
        },
      },
    ],
    officialReports: [
      {
        id: "item-fin-001",
        title: "中国人民银行开展公开市场国债买卖操作",
        summary: "全月净买入面值2000亿元国债。",
        source: { id: "pbc", name: "中国人民银行官网", kind: "web_list", firstParty: true, iconUrl: null },
        publishedAt: "2026-10-05T07:30:00.000Z",
        originalUrl: "http://www.pbc.gov.cn",
        selected: true,
        factId: "fact-001",
      },
    ],
    timeline: [
      {
        id: "item-fin-001",
        title: "中国人民银行开展公开市场国债买卖操作",
        summary: "全月净买入面值2000亿元国债。",
        source: { id: "pbc", name: "中国人民银行官网", kind: "web_list", firstParty: true, iconUrl: null },
        publishedAt: "2026-10-05T07:30:00.000Z",
        originalUrl: "http://www.pbc.gov.cn",
        selected: true,
        factId: "fact-001",
      },
    ],
    heat: [
      { hour: "2026-10-05T04:00:00.000Z", heat: 320, participants: 2 },
      { hour: "2026-10-05T05:00:00.000Z", heat: 580, participants: 3 },
      { hour: "2026-10-05T06:00:00.000Z", heat: 810, participants: 4 },
      { hour: "2026-10-05T07:00:00.000Z", heat: 985, participants: 4 },
    ],
    related: [
      { publicId: "story-a-share-rally", title: "A股交投持续突破万亿 核心指数震荡走强与估值修复", relation: "storyline", latestAt: "2026-10-05T07:15:00.000Z" },
    ],
  },
  {
    publicId: "story-a-share-rally",
    title: "A股交投持续突破万亿 核心指数震荡走强与估值修复",
    status: "active",
    reportCount: 5,
    sourceCount: 4,
    firstReportAt: "2026-10-04T09:30:00.000Z",
    latestAt: "2026-10-05T07:15:00.000Z",
    digest: "受逆周期宏观政策利好催化，两市成交额突破1.5万亿元，北向资金大举流入，成长与红利板块交替上涨。",
    digestUpdatedAt: "2026-10-05T07:20:00.000Z",
    summary: "宏观流动性宽松预期带动股市交投放量，核心指数突破关键阻力位。",
    excerpt: { text: "两市成交额突破1.5万亿元，多头情绪显著增强。", sourceName: "财联社" },
    latest: "创业板指领涨超3%，全市场超4200只个股飘红。",
    whyHot: {
      participants48h: 15,
      newParticipants6h: 5,
      recentReports24h: 10,
      observationComplete: true,
      rank: 2,
      heat: 920,
    },
    developments: [],
    officialReports: [],
    timeline: [],
    heat: [
      { hour: "2026-10-05T04:00:00.000Z", heat: 290, participants: 2 },
      { hour: "2026-10-05T06:00:00.000Z", heat: 750, participants: 3 },
      { hour: "2026-10-05T07:00:00.000Z", heat: 920, participants: 4 },
    ],
    related: [
      { publicId: "story-monetary-easing", title: "全球央行货币政策协同转向与流动性格局演进", relation: "storyline", latestAt: "2026-10-05T07:30:00.000Z" },
    ],
  },
  {
    publicId: "story-wealth-reform",
    title: "公募基金行业费率改革全面深化 ETF等工具型产品迎来爆发",
    status: "active",
    reportCount: 4,
    sourceCount: 3,
    firstReportAt: "2026-10-04T10:00:00.000Z",
    latestAt: "2026-10-05T03:20:00.000Z",
    digest: "监管引导财富管理机构让利投资者，多只核心宽基ETF管理费调至0.15%行业最低档，吸引中长期资金配置。",
    digestUpdatedAt: "2026-10-05T03:25:00.000Z",
    summary: "指数基金降费举措全面落地，资产配置生态步入低成本时代。",
    excerpt: { text: "宽基ETF管理费下调至0.15%，有效降低长期持有成本。", sourceName: "中国证券报" },
    latest: "易方达、华夏等多家基金公司正式执行新费率标准。",
    whyHot: {
      participants48h: 12,
      newParticipants6h: 4,
      recentReports24h: 8,
      observationComplete: true,
      rank: 3,
      heat: 860,
    },
    developments: [],
    officialReports: [],
    timeline: [],
    heat: [
      { hour: "2026-10-05T02:00:00.000Z", heat: 410, participants: 2 },
      { hour: "2026-10-05T03:00:00.000Z", heat: 860, participants: 3 },
    ],
    related: [],
  },
];

// 引用条目构造辅助
function toReportCitation(it: FinancialItem) {
  return {
    itemId: it.id,
    title: it.title,
    summary: it.summary,
    sourceName: it.source.name,
    sourceUrl: it.links.original,
    sourceId: it.source.id,
    sourceIconUrl: null,
    firstParty: it.source.firstParty,
    role: null,
    storyPublicId: it.story?.publicId ?? null,
    publishedAt: it.publishedAt,
    available: true,
    score: it.score,
  };
}

// 金融研报数据（首期金融日报、周报、月报）
const DAILY_REPORT = {
  kind: "daily",
  key: "2026-10-04",
  title: "金融日报 · 2026年10月04日",
  windowStart: "2026-10-03T00:00:00.000Z",
  windowEnd: "2026-10-04T00:00:00.000Z",
  generatedAt: "2026-10-04T08:00:00.000Z",
  revision: 1,
  lead: {
    title: "美联储决议下调联邦基金利率25基点 强调通胀放缓与就业平衡",
    leadParagraph: "美联储公开市场委员会宣布降息25个基点至4.50%-4.75%，表明货币政策进一步走向中性。本站客观归纳事实，不构成任何投资建议。",
  },
  overview: "今日金融市场聚焦全球央行货币政策决议及A股成交突破万亿。宏观流动性充裕，资产重估行情稳步展开。",
  highlights: [
    toReportCitation(ITEMS[0]),
    toReportCitation(ITEMS[2]),
    toReportCitation(ITEMS[7]),
    toReportCitation(ITEMS[8]),
  ],
  sections: [
    {
      label: "宏观与监管政策",
      summary: "中国人民银行与金融监管总局相继开展流动性调节与审慎监管新规部署。",
      items: [toReportCitation(ITEMS[0]), toReportCitation(ITEMS[1])],
    },
    {
      label: "资本市场动态",
      summary: "A股两市放量上涨突破1.5万亿元，伦敦金价持续刷新历史纪录。",
      items: [toReportCitation(ITEMS[2]), toReportCitation(ITEMS[3])],
    },
    {
      label: "商业与财报",
      summary: "头部龙头贵州茅台与宁德时代发布前三季度业绩，利润双双录得双位数稳步增长。",
      items: [toReportCitation(ITEMS[4]), toReportCitation(ITEMS[5])],
    },
    {
      label: "金融机构与资管",
      summary: "国有大行信贷精准滴灌实体经济，公募指数基金费率改革进一步提速。",
      items: [toReportCitation(ITEMS[6]), toReportCitation(ITEMS[7])],
    },
    {
      label: "金融科技前沿",
      summary: "多边央行数字货币桥步入商用阶段，财富管理垂直大模型加快合规落地。",
      items: [toReportCitation(ITEMS[8]), toReportCitation(ITEMS[9])],
    },
    {
      label: "研报与专家观点",
      summary: "主流券商发布四季度宏观策略研报，看好增量化债与核心权益资产重估。",
      items: [toReportCitation(ITEMS[10]), toReportCitation(ITEMS[11])],
    },
  ],
  stories: [
    { ...toReportCitation(ITEMS[0]), label: "宏观与监管政策" },
    { ...toReportCitation(ITEMS[2]), label: "资本市场动态" },
    { ...toReportCitation(ITEMS[7]), label: "金融机构与资管" },
  ],
  flashes: [],
  cover: null,
  metrics: {
    totalEvents: 12,
    sourcesCount: 8,
    macroPolicyEvents: 4,
    firstPartyEvents: 3,
  },
  macroPolicyEvents: 4,
  readingMinutes: 4,
  prev: null,
  next: null,
};

const WEEKLY_REPORT = {
  kind: "weekly",
  key: "2026-W40",
  title: "金融周报 · 2026年第40周",
  windowStart: "2026-09-28T00:00:00.000Z",
  windowEnd: "2026-10-04T00:00:00.000Z",
  generatedAt: "2026-10-04T08:00:00.000Z",
  revision: 1,
  lead: {
    title: "全球央行流动性拐点与A股放量长阳周度综述",
    leadParagraph: "本周全球金融资产迎来流动性拐点，各主要板块交易活跃度大幅提升。本站客观归纳事实，不构成任何投资建议。",
  },
  overview: "本周金融市场宏观环境改善，大类资产呈现普涨态势。",
  highlights: DAILY_REPORT.highlights,
  sections: DAILY_REPORT.sections,
  stories: DAILY_REPORT.stories,
  flashes: [],
  cover: null,
  metrics: {
    totalEvents: 45,
    sourcesCount: 16,
    macroPolicyEvents: 14,
    firstPartyEvents: 10,
  },
  macroPolicyEvents: 14,
  readingMinutes: 6,
  prev: null,
  next: null,
};

const MONTHLY_REPORT = {
  kind: "monthly",
  key: "2026-10",
  title: "金融月报 · 2026年10月",
  windowStart: "2026-10-01T00:00:00.000Z",
  windowEnd: "2026-10-31T00:00:00.000Z",
  generatedAt: "2026-10-05T08:00:00.000Z",
  revision: 1,
  lead: {
    title: "四季度宏观逆周期政策发力与资本市场月度全景",
    leadParagraph: "10月各项增量财政与货币流动性工具相继落地，资产定价逻辑进一步聚焦高质量发展。本站客观归纳事实，不构成任何投资建议。",
  },
  overview: "10月全月金融市场运行平稳，风险偏好持续修复。",
  highlights: DAILY_REPORT.highlights,
  sections: DAILY_REPORT.sections,
  stories: DAILY_REPORT.stories,
  flashes: [],
  cover: null,
  metrics: {
    totalEvents: 120,
    sourcesCount: 19,
    macroPolicyEvents: 35,
    firstPartyEvents: 22,
  },
  macroPolicyEvents: 35,
  readingMinutes: 12,
  prev: null,
  next: null,
};

// 构造单条 Item 详情
function toItemDetail(item: FinancialItem) {
  return {
    ...item,
    readingMode: "full" as const,
    author: "FinHOT 金融快讯组",
    language: "zh",
    body: {
      zh: `<p>${item.summary}</p><p><strong>核心事实：</strong>${item.facts.map((f) => `${f.subject} ${f.predicate} ${f.object}，${f.impact}`).join("；")}。</p><p><strong>推荐理由：</strong>${item.reason}</p>`,
      original: null,
      zhKind: "original" as const,
      complete: true,
    },
    outline: [
      { id: "sec-core-fact", text: "事件核心事实", level: 2 },
      { id: "sec-market-impact", text: "市场影响分析", level: 2 },
    ],
    relatedStories: item.story ? [item.story] : [],
    indexable: true,
    markdownAvailable: true,
    group: null,
    hasTranslation: false,
    bodyLanguage: "zh" as const,
  };
}

// 辅助响应函数
function jsonResponse(res: http.ServerResponse, statusCode: number, data: unknown) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, HEAD",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, x-aihot-ssr",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

// 创建并返回 HTTP 服务器
export function createPreviewServer(): http.Server {
  const server = http.createServer(async (req, res) => {
    // 跨域预检处理
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, HEAD",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, x-aihot-ssr",
        "Access-Control-Max-Age": "86400",
      });
      res.end();
      return;
    }

    const parsedUrl = new URL(req.url ?? "/", "http://127.0.0.1");
    const pathname = parsedUrl.pathname;
    const method = req.method ?? "GET";

    // 1. GET /api/health
    if (pathname === "/api/health" && method === "GET") {
      return jsonResponse(res, 200, {
        status: "ok",
        name: "FinHOT",
        ok: true,
        db: "mock",
        release: "preview-1.0",
      });
    }

    // 2. GET /api/site/contact
    if (pathname === "/api/site/contact" && method === "GET") {
      return jsonResponse(res, 200, {
        wechatQr: null,
        feishuQr: null,
        makerAvatar: null,
      });
    }

    // 3. GET /api/site/stats
    if (pathname === "/api/site/stats" && method === "GET") {
      return jsonResponse(res, 200, {
        sourcesCount: 19,
        collectedCount: 1280,
        selectedCount: 96,
        reportsCount: 1,
        // 同时兼容前台 SiteStats 契约属性
        sources: 19,
        sourceKinds: { rss: 9, web_list: 7, mp_account: 3 },
        heatOnlySources: 0,
        items: 1280,
        selected: 96,
        dailies: 1,
        day: { collected: 48, selected: 12 },
        sampleSources: [
          { name: "中国人民银行", kind: "web_list", heatOnly: false },
          { name: "中国证监会", kind: "web_list", heatOnly: false },
          { name: "财联社宏观", kind: "rss", heatOnly: false },
        ],
        latest: [],
      });
    }

    // 4. GET /api/topics 或 GET /api/site/topics
    if ((pathname === "/api/topics" || pathname === "/api/site/topics") && method === "GET") {
      const topicSummaries = topicsData.topics.map((t) => ({
        slug: t.slug,
        name: t.name,
        group: t.group,
        definition: t.definition,
        recentItemsCount: 4,
        totalItemsCount: 12,
      }));
      return jsonResponse(res, 200, {
        count: topicsData.topics.length,
        total: topicsData.topics.length,
        exportedAt: topicsData.exportedAt,
        groups: topicsData.groups,
        topics: pathname === "/api/site/topics" ? topicSummaries : topicsData.topics,
      });
    }

    // 5. GET /api/topics/:slug 或 GET /api/site/topics/:slug
    if ((pathname.startsWith("/api/topics/") || pathname.startsWith("/api/site/topics/")) && method === "GET") {
      const slug = decodeURIComponent(pathname.replace(/^\/api\/(site\/)?topics\//, ""));
      const topic = topicsData.topics.find((t) => t.slug === slug);
      if (!topic) {
        return jsonResponse(res, 404, { status: 404, code: "not_found", detail: "Topic not found" });
      }

      // 匹配包含相关标签的条目，没有则返回全局前几条金融条目
      const matched = ITEMS.filter((it) => it.tags.some((tag) => topic.tags.includes(tag)) || it.subjects.some((sub) => topic.tags.includes(sub)));
      const items = matched.length > 0 ? matched : ITEMS.slice(0, 3);

      return jsonResponse(res, 200, {
        topic: {
          slug: topic.slug,
          name: topic.name,
          group: topic.group,
          definition: topic.definition,
          total: items.length,
          indexable: true,
          related: (topic.related ?? []).map((rSlug) => ({
            slug: rSlug,
            name: topicNameBySlug.get(rSlug) ?? rSlug,
          })),
        },
        items: items.map((it) => ({
          id: it.id,
          title: it.title,
          summary: it.summary,
          reason: it.reason,
          publishedAt: it.publishedAt,
          timelineAt: it.timelineAt,
          category: it.category,
          tags: it.tags,
          score: it.score,
          selected: it.selected,
          channel: it.channel,
          source: { name: it.source.name },
          x: null,
        })),
        page: 1,
        pageCount: 1,
        total: items.length,
      });
    }

    // 6. GET /api/items & GET /api/v1/items
    if ((pathname === "/api/items" || pathname === "/api/v1/items") && method === "GET") {
      return jsonResponse(res, 200, {
        schemaVersion: 1,
        count: ITEMS.length,
        total: ITEMS.length,
        items: ITEMS,
        page: { count: ITEMS.length, hasMore: false, nextCursor: null },
        query: { mode: "selected", category: null, window: "7d", q: null, by: "timeline", ordering: "desc" },
      });
    }

    // 7. GET /api/items/:id & GET /api/site/items/:id & /original
    if (
      (pathname.startsWith("/api/items/") || pathname.startsWith("/api/site/items/")) &&
      method === "GET" &&
      !pathname.includes("/availability")
    ) {
      let rawId = pathname.replace(/^\/api\/(site\/)?items\//, "");
      rawId = rawId.replace(/\/original$/, "");
      const id = decodeURIComponent(rawId);
      const item = ITEMS.find((it) => it.id === id) ?? ITEMS[0];
      if (!item) {
        return jsonResponse(res, 404, { status: 404, code: "not_found", detail: "Item not found" });
      }
      return jsonResponse(res, 200, toItemDetail(item));
    }

    // 8. GET /api/stories & GET /api/v1/hot-topics & GET /api/site/hot
    if ((pathname === "/api/stories" || pathname === "/api/v1/hot-topics" || pathname === "/api/site/hot") && method === "GET") {
      if (pathname === "/api/site/hot") {
        return jsonResponse(res, 200, {
          computedAt: new Date().toISOString(),
          ruleVersion: "1.0",
          windowHours: 24,
          entries: STORIES.map((s) => ({
            rank: s.whyHot.rank,
            story: { publicId: s.publicId, title: s.title },
            heat: s.whyHot.heat,
            trend: "up" as const,
            trendPct: 15,
            badges: ["surge" as const],
            participantCount: s.sourceCount,
            sourceCount: s.sourceCount,
            signalCount: 0,
            reportCount: s.reportCount,
            sourceNames: ["中国人民银行", "美联储", "财联社"],
            latestAt: s.latestAt,
            firstReportAt: s.firstReportAt,
            representative: { id: "item-fin-001", url: "http://www.pbc.gov.cn", sourceName: "中国人民银行" },
            participants: [
              { name: "中国人民银行", kind: "editorial" as const, iconUrl: null },
              { name: "美联储", kind: "editorial" as const, iconUrl: null },
            ],
            spark: [200, 450, 700, 850, s.whyHot.heat],
            summary: s.digest,
            latest: s.latest,
            cover: null,
          })),
        });
      }

      if (pathname === "/api/v1/hot-topics") {
        return jsonResponse(res, 200, {
          schemaVersion: 1,
          count: STORIES.length,
          items: STORIES.map((s) => ({
            rank: s.whyHot.rank,
            id: s.publicId,
            title: s.title,
            source: { name: "FinHOT 金融热点" },
            links: { aihot: `/story/${s.publicId}`, original: `/story/${s.publicId}`, story: `/story/${s.publicId}` },
            sourceCount: s.sourceCount,
            signalCount: 0,
            participantCount: s.whyHot.participants48h,
            sourceNames: ["中国人民银行", "美联储", "财联社"],
            latestAt: s.latestAt,
          })),
        });
      }

      return jsonResponse(res, 200, {
        count: STORIES.length,
        total: STORIES.length,
        stories: STORIES,
        items: STORIES,
      });
    }

    // 9. GET /api/story/:publicId & GET /api/site/stories/:publicId & GET /api/v1/stories/:publicId
    if (
      (pathname.startsWith("/api/story/") || pathname.startsWith("/api/site/stories/") || pathname.startsWith("/api/v1/stories/")) &&
      method === "GET"
    ) {
      const publicId = decodeURIComponent(pathname.replace(/^\/api\/(site\/|v1\/)?stor(y|ies)\//, ""));
      const story = STORIES.find((s) => s.publicId === publicId) ?? STORIES[0];
      if (!story) {
        return jsonResponse(res, 404, { status: 404, code: "not_found", detail: "Story not found" });
      }
      return jsonResponse(res, 200, story);
    }

    // 10. GET /api/reports/daily/latest & GET /api/reports/daily/:key & site 变体
    if (
      (pathname.startsWith("/api/reports/daily") || pathname.startsWith("/api/site/reports/daily") || pathname.startsWith("/api/v1/dailies")) &&
      method === "GET"
    ) {
      // 归档导航列表 /api/site/reports/daily
      if (pathname === "/api/site/reports/daily" || pathname === "/api/v1/dailies") {
        return jsonResponse(res, 200, {
          items: [{ key: DAILY_REPORT.key, title: DAILY_REPORT.title, generatedAt: DAILY_REPORT.generatedAt, count: 12 }],
        });
      }

      // 页面合单 /api/site/reports/daily/latest-page
      if (pathname === "/api/site/reports/daily/latest-page") {
        return jsonResponse(res, 200, {
          index: [{ key: DAILY_REPORT.key, title: DAILY_REPORT.title, count: 12 }],
          report: DAILY_REPORT,
        });
      }

      // 日报按月 /api/site/reports/daily/months/:month
      if (pathname.includes("/months/")) {
        return jsonResponse(res, 200, {
          items: [{ key: DAILY_REPORT.key, title: DAILY_REPORT.title, count: 12 }],
        });
      }

      // 导航单接口 /api/site/reports/daily/navigation/:key
      if (pathname.includes("/navigation/")) {
        return jsonResponse(res, 200, {
          items: [{ key: DAILY_REPORT.key, title: DAILY_REPORT.title, count: 12 }],
        });
      }

      // 默认返回首期金融日报
      return jsonResponse(res, 200, DAILY_REPORT);
    }

    // 11. GET /api/reports/weekly/latest & GET /api/reports/monthly/latest & site 变体
    if (
      (pathname.startsWith("/api/reports/weekly") ||
        pathname.startsWith("/api/site/reports/weekly") ||
        pathname.startsWith("/api/reports/monthly") ||
        pathname.startsWith("/api/site/reports/monthly")) &&
      method === "GET"
    ) {
      const isWeekly = pathname.includes("weekly");
      const report = isWeekly ? WEEKLY_REPORT : MONTHLY_REPORT;
      if (pathname.includes("latest-page")) {
        return jsonResponse(res, 200, {
          index: [{ key: report.key, title: report.title, count: report.metrics.totalEvents }],
          report,
        });
      }
      if (pathname.includes("navigation/")) {
        return jsonResponse(res, 200, {
          items: [{ key: report.key, title: report.title, count: report.metrics.totalEvents }],
        });
      }
      return jsonResponse(res, 200, report);
    }

    // 12. POST /api/mcp
    if (pathname === "/api/mcp" && method === "POST") {
      let reqBody = "";
      for await (const chunk of req) {
        reqBody += chunk;
      }
      let rpcId: string | number | null = 1;
      try {
        const parsed = JSON.parse(reqBody);
        if (parsed && typeof parsed.id !== "undefined") {
          rpcId = parsed.id;
        }
      } catch {
        // 非 JSON 则保持默认
      }

      return jsonResponse(res, 200, {
        jsonrpc: "2.0",
        id: rpcId,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: { listChanged: true } },
          serverInfo: { name: "finhot", version: "1.0.0" },
        },
        name: "finhot",
      });
    }

    // 13. 前台常用补充路由 (Timeline, Pool, Meta, Changelog 等)
    if (pathname === "/api/site/timeline" && method === "GET") {
      return jsonResponse(res, 200, {
        filters: { channel: "all", category: null, tag: null, topic: null },
        cards: ITEMS.map((it) => ({
          key: it.id,
          anchorAt: it.timelineAt,
          item: {
            id: it.id,
            title: it.title,
            summary: it.summary,
            reason: it.reason,
            publishedAt: it.publishedAt,
            timelineAt: it.timelineAt,
            category: it.category,
            tags: it.tags,
            score: it.score,
            selected: it.selected,
            channel: it.channel,
            source: { name: it.source.name },
            x: null,
          },
          group: null,
        })),
        nextCursor: null,
        refreshAt: null,
        hot: [
          {
            rank: 1,
            title: "全球央行货币政策协同转向与流动性格局演进",
            heat: 985,
            trend: "up" as const,
            storyPublicId: "story-monetary-easing",
            itemId: "item-fin-001",
            participants: [{ name: "中国人民银行", kind: "editorial" as const, iconUrl: null }],
            participantCount: 4,
          },
        ],
        dayCounts: { "2026-10-05": 12 },
        generatedAt: new Date().toISOString(),
      });
    }

    if (pathname === "/api/site/pool" && method === "GET") {
      return jsonResponse(res, 200, {
        filters: { channel: "all", category: null, tag: null, q: null, tab: "time" },
        items: ITEMS.map((it) => ({
          id: it.id,
          title: it.title,
          summary: it.summary,
          reason: it.reason,
          publishedAt: it.publishedAt,
          timelineAt: it.timelineAt,
          category: it.category,
          tags: it.tags,
          score: it.score,
          selected: it.selected,
          channel: it.channel,
          source: { name: it.source.name },
          x: null,
        })),
        page: 1,
        pageCount: 1,
        total: ITEMS.length,
        todayCount: ITEMS.length,
        freshness: new Date().toISOString(),
        generatedAt: new Date().toISOString(),
      });
    }

    if (pathname === "/api/site/changelog" && method === "GET") {
      return jsonResponse(res, 200, {
        latestVersion: "1.0.0",
        releases: [
          {
            version: "1.0.0",
            date: "2026-10-01",
            notes: "FinHOT 金融行业定制版首发上线，全天候追踪全球金融要闻与宏观脉搏。",
          },
        ],
      });
    }

    if (pathname === "/api/auth/options" && method === "GET") {
      return jsonResponse(res, 200, { password: true, feishu: false });
    }

    if (pathname === "/api/site/items/availability" && method === "GET") {
      return jsonResponse(res, 200, []);
    }

    // 默认 404
    return jsonResponse(res, 404, {
      status: 404,
      code: "not_found",
      detail: `Endpoint not found: ${pathname}`,
    });
  });

  return server;
}

// 命令行直接启动逻辑
const isDirectRun = process.argv[1] && (process.argv[1].endsWith("preview-server.ts") || process.argv[1].endsWith("preview-server.js"));
if (isDirectRun) {
  const PORT = Number(process.env.API_PORT || process.env.PORT || 3001);
  const HOST = process.env.API_HOST || "127.0.0.1";
  const server = createPreviewServer();
  server.listen(PORT, HOST, () => {
    console.log(`[FinHOT Preview API] Server listening on http://${HOST}:${PORT}`);
  });
}
