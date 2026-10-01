// 这个行业的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉模型怎么归类。
 * 没归上类的资料在日报里放进第一个 key 为 macro-policy 的类别所在的节（没有就放最后一节）。
 */
export const CATEGORIES = [
  { key: "macro-policy", label: "宏观政策", section: "宏观与监管政策", guide: "央行货币政策、财政政策、金融监管新规、宏观经济统计数据发布与重要会议" },
  { key: "capital-markets", label: "资本市场", section: "资本市场动态", guide: "A股、港股、美股、债券、外汇、大宗商品重大异动、盘面主线与指数表现" },
  { key: "earnings-corporate", label: "商业财报", section: "商业与财报", guide: "头部上市公司关键财报、业绩预告、重大并购重组、核心高管变动与商业战略" },
  { key: "institutions", label: "机构资管", section: "金融机构与资管", guide: "银行、券商、基金、信托、VC/PE机构动态、创新资管产品与牌照业务" },
  { key: "fintech", label: "金融科技", section: "金融科技前沿", guide: "数字货币、支付清算、金融大模型落地、量化科技与监管科技应用" },
  { key: "opinion", label: "观点研报", section: "研报与专家观点", guide: "主流券商策略研报、宏观经济学家观点、行业分析与深度市场透视" },
] as const;

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = [
  "policy_announcement",
  "market_movement",
  "earnings_report",
  "institution_update",
  "fintech_innovation",
  "research_analysis",
  "industry_event",
] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = [
  "宏观政策",
  "监管动态",
  "市场行情",
  "财报业绩",
  "公司要闻",
  "机构动态",
  "资管产品",
  "金融科技",
  "研报分析",
  "专家观点",
  "行业动态",
  "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "货币政策",
  "财政政策",
  "监管新规",
  "宏观数据",
  "A股",
  "港股",
  "美股",
  "债券",
  "外汇",
  "大宗商品",
  "黄金",
  "原油",
  "银行",
  "券商",
  "公募基金",
  "私募基金",
  "保险",
  "信托",
  "VC/PE",
  "财报分析",
  "业绩预告",
  "并购重组",
  "IPO",
  "分红回购",
  "公司治理",
  "数字货币",
  "支付清算",
  "金融AI",
  "量化投资",
  "监管科技",
  "智能投顾",
  "宏观策略",
  "行业透视",
  "公司研报",
  "专家访谈",
  "ESG",
] as const;

/** 可选的实体标签（公司、机构、监管）。 */
export const ENTITY_TAGS = [
  "中国人民银行",
  "中国证监会",
  "国家金融监督管理总局",
  "美联储",
  "上交所",
  "深交所",
  "工商银行",
  "建设银行",
  "中国银行",
  "农业银行",
  "招商银行",
  "中信证券",
  "中金公司",
  "华泰证券",
  "贵州茅台",
  "腾讯",
  "阿里巴巴",
  "宁德时代",
  "中国平安",
  "高盛",
  "摩根士丹利",
] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  政策: "宏观政策", 监管: "监管动态", 法规: "监管动态", 新规: "监管动态", 政策法规: "监管动态",
  央行政策: "宏观政策", 宏观: "宏观政策", 宏观调控: "宏观政策",
  货币政策: "货币政策", 降息: "货币政策", 降准: "货币政策", 加息: "货币政策", 逆回购: "货币政策",
  财政: "财政政策", 财政政策: "财政政策", 国债: "债券",
  经济数据: "宏观数据", cpi: "宏观数据", ppi: "宏观数据", gdp: "宏观数据", pmi: "宏观数据", 社融: "宏观数据",
  行情: "市场行情", 异动: "市场行情", 盘面: "市场行情", 股市: "市场行情", 大盘: "市场行情", 市场动态: "市场行情",
  a股: "A股", 港股: "港股", 美股: "美股", 中概股: "美股",
  债券: "债券", 债市: "债券", 外汇: "外汇", 汇率: "外汇", 人民币: "外汇",
  大宗: "大宗商品", 大宗商品: "大宗商品", 原油: "原油", 黄金: "黄金",
  财报: "财报业绩", 业绩: "财报业绩", 年报: "财报业绩", 季报: "财报业绩", 中报: "财报业绩", 业绩快报: "财报业绩", 预告: "业绩预告",
  并购: "并购重组", 重组: "并购重组", 收购: "并购重组", 借壳: "并购重组", 资产重组: "并购重组",
  上市: "IPO", ipo: "IPO", 回购: "分红回购", 分红: "分红回购",
  机构: "机构动态", 机构动向: "机构动态", 银行: "银行", 券商: "券商", 公募: "公募基金", 私募: "私募基金",
  基金: "公募基金", 资管: "资管产品", 理财: "资管产品", 险资: "保险", 信托: "信托", 创投: "VC/PE", pe: "VC/PE", vc: "VC/PE",
  fintech: "金融科技", 区块链: "数字货币", 虚拟货币: "数字货币", 加密货币: "数字货币", 数字人民币: "数字货币",
  支付: "支付清算", 跨境支付: "支付清算", 清算: "支付清算",
  量化: "量化投资", 算法交易: "量化投资", 智能投顾: "智能投顾",
  研报: "研报分析", 报告: "研报分析", 策略研报: "研报分析", 深度研报: "研报分析",
  观点: "专家观点", 大佬观点: "专家观点", 分析师说: "专家观点", 访谈: "专家访谈",
  行业: "行业动态", 动态: "行业动态", 行业新闻: "行业动态",
};

/** 模型漏了分类标签时，按内容类型补一个。 */
export const CATEGORY_BY_ITEM_TYPE: Readonly<Record<string, string>> = {
  policy_announcement: "宏观政策",
  market_movement: "市场行情",
  earnings_report: "财报业绩",
  institution_update: "机构动态",
  fintech_innovation: "金融科技",
  research_analysis: "研报分析",
  industry_event: "行业动态",
};

// ── 公司与主体 ──────────────────────────────────────────────────────────────────────────

/** 核心主体：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[] }> = {
  pboc: { name: "中国人民银行", displayTag: "中国人民银行", aliases: ["中国人民银行", "央行", "人民银行", "人行", "PBOC"] },
  csrc: { name: "中国证监会", displayTag: "中国证监会", aliases: ["中国证监会", "证监会", "CSRC"] },
  nfra: { name: "金融监管总局", displayTag: "国家金融监督管理总局", aliases: ["国家金融监督管理总局", "金融监管总局", "金管局", "银保监会", "NFRA"] },
  fed: { name: "美联储", displayTag: "美联储", aliases: ["美联储", "联邦储备系统", "Federal Reserve", "The Fed", "FOMC", "鲍威尔"] },
  sse: { name: "上交所", displayTag: "上交所", aliases: ["上交所", "上海证券交易所", "SSE"] },
  szse: { name: "深交所", displayTag: "深交所", aliases: ["深交所", "深圳证券交易所", "SZSE"] },
  icbc: { name: "工商银行", displayTag: "工商银行", aliases: ["工商银行", "工行", "ICBC", "中国工商银行", "601398"] },
  ccb: { name: "建设银行", displayTag: "建设银行", aliases: ["建设银行", "建行", "CCB", "中国建设银行", "601939"] },
  boc: { name: "中国银行", displayTag: "中国银行", aliases: ["中国银行", "中行", "BOC", "601988"] },
  abc: { name: "农业银行", displayTag: "农业银行", aliases: ["农业银行", "农行", "ABC", "601288"] },
  cmb: { name: "招商银行", displayTag: "招商银行", aliases: ["招商银行", "招行", "CMB", "600036"] },
  citic: { name: "中信证券", displayTag: "中信证券", aliases: ["中信证券", "中信证券股份有限公司", "CITIC Securities", "600030"] },
  cicc: { name: "中金公司", displayTag: "中金公司", aliases: ["中金公司", "中金", "中国国际金融股份有限公司", "CICC", "601995"] },
  htsc: { name: "华泰证券", displayTag: "华泰证券", aliases: ["华泰证券", "HTSC", "601688"] },
  moutai: { name: "贵州茅台", displayTag: "贵州茅台", aliases: ["贵州茅台", "茅台", "Moutai", "600519"] },
  tencent: { name: "腾讯", displayTag: "腾讯", aliases: ["腾讯", "腾讯控股", "Tencent", "00700"] },
  alibaba: { name: "阿里巴巴", displayTag: "阿里巴巴", aliases: ["阿里巴巴", "阿里", "Alibaba", "BABA", "09988"] },
  catl: { name: "宁德时代", displayTag: "宁德时代", aliases: ["宁德时代", "CATL", "300750"] },
  pingan: { name: "中国平安", displayTag: "中国平安", aliases: ["中国平安", "平安保险", "平安集团", "Ping An", "601318"] },
  goldman: { name: "高盛", displayTag: "高盛", aliases: ["高盛", "Goldman Sachs", "高盛集团"] },
  "morgan-stanley": { name: "摩根士丹利", displayTag: "摩根士丹利", aliases: ["摩根士丹利", "大摩", "Morgan Stanley"] },
};

/**
 * 身份词典：摘要和标题里出现的主体，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 行业没有这个问题时可以留空数组。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "pboc", name: "中国人民银行", patterns: [/中国人民银行|人民银行|\b央行\b|\bpboc\b/i] },
  { id: "csrc", name: "中国证监会", patterns: [/中国证监会|\b证监会\b|\bcsrc\b/i] },
  { id: "nfra", name: "金融监管总局", patterns: [/国家金融监督管理总局|金融监督管理总局|金融监管总局|金管局|银保监会|\bnfra\b/i] },
  { id: "fed", name: "美联储", patterns: [/美联储|联邦储备系统|\bfed\b|\bfomc\b|鲍威尔|federal\s+reserve/i] },
  { id: "sse", name: "上交所", patterns: [/上交所|上海证券交易所|\bsse\b/i] },
  { id: "szse", name: "深交所", patterns: [/深交所|深圳证券交易所|\bszse\b/i] },
  { id: "icbc", name: "工商银行", patterns: [/工商银行|\b工行\b|\bicbc\b|中国工商银行/i] },
  { id: "ccb", name: "建设银行", patterns: [/建设银行|\b建行\b|\bccb\b|中国建设银行/i] },
  { id: "boc", name: "中国银行", patterns: [/中国银行|\b中行\b|\bboc\b/i] },
  { id: "abc", name: "农业银行", patterns: [/农业银行|\b农行\b|\babc\b|中国农业银行/i] },
  { id: "cmb", name: "招商银行", patterns: [/招商银行|\b招行\b|\bcmb\b/i] },
  { id: "citic", name: "中信证券", patterns: [/中信证券|\bcitic\s?securities\b/i] },
  { id: "cicc", name: "中金公司", patterns: [/中金公司|\b中金\b|\bcicc\b|中国国际金融/i] },
  { id: "htsc", name: "华泰证券", patterns: [/华泰证券|\bhtsc\b/i] },
  { id: "moutai", name: "贵州茅台", patterns: [/贵州茅台|\b茅台\b|\bmoutai\b/i] },
  { id: "tencent", name: "腾讯", patterns: [/腾讯|tencent/i] },
  { id: "alibaba", name: "阿里巴巴", patterns: [/阿里巴巴|\b阿里\b|alibaba|\bbaba\b/i] },
  { id: "catl", name: "宁德时代", patterns: [/宁德时代|\bcatl\b/i] },
  { id: "pingan", name: "中国平安", patterns: [/中国平安|平安保险|平安集团|\bping\s?an\b/i] },
  { id: "goldman", name: "高盛", patterns: [/高盛|goldman(\s+sachs)?/i] },
  { id: "morgan-stanley", name: "摩根士丹利", patterns: [/摩根士丹利|\b大摩\b|morgan\s+stanley/i] },
];

/** 这些域名上的文章，发布方就是对应的机构或公司（托管平台如 GitHub 不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "pboc", domains: ["pbc.gov.cn"] },
  { entityId: "csrc", domains: ["csrc.gov.cn"] },
  { entityId: "nfra", domains: ["nfra.gov.cn", "cbirc.gov.cn"] },
  { entityId: "fed", domains: ["federalreserve.gov"] },
  { entityId: "sse", domains: ["sse.com.cn"] },
  { entityId: "szse", domains: ["szse.cn"] },
  { entityId: "icbc", domains: ["icbc.com.cn"] },
  { entityId: "ccb", domains: ["ccb.com"] },
  { entityId: "boc", domains: ["boc.cn"] },
  { entityId: "abc", domains: ["abchina.com"] },
  { entityId: "cmb", domains: ["cmbchina.com"] },
  { entityId: "citic", domains: ["cs.ecitic.com"] },
  { entityId: "cicc", domains: ["cicc.com"] },
  { entityId: "htsc", domains: ["htsc.com.cn"] },
  { entityId: "moutai", domains: ["moutaichina.com"] },
  { entityId: "tencent", domains: ["tencent.com"] },
  { entityId: "alibaba", domains: ["alibabagroup.com"] },
  { entityId: "catl", domains: ["catl.com"] },
  { entityId: "pingan", domains: ["pingan.cn"] },
  { entityId: "goldman", domains: ["goldmansachs.com"] },
  { entityId: "morgan-stanley", domains: ["morganstanley.com"] },
];

/** 原文里的这些写法也算提到了对应主体。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [
  { entityId: "fed", pattern: /@federalreserve\b/i },
];
