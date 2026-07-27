// 类型定义 - AI与智能体服务管理平台

/** 平台AI服务能力分类（CX标红） */
export type ServiceCategory =
  | '通用基础大模型'
  | '医保自研专属大模型'
  | '医保基金监管共建模型'
  | '省头部医疗机构共建垂直模型'
  | '市场化合规生态AI产品';

/** 临床应用风险等级（CX标红 - 三级审核） */
export type RiskLevel = '高风险' | '中风险' | '低风险';

export type FilterOption = {
  label: string;
  options: string[];
  defaultValue: string;
};

export type CapabilityCardData = {
  id: string;
  title: string;
  unit: string;
  description: string;
  tags: string[];
  /** 能力分类（CX标红） */
  category: ServiceCategory;
  /** 临床应用风险等级 */
  riskLevel?: RiskLevel;
  /** 计费方式（如：按Token/按检查例次/按调用次数） */
  billingMethod?: string;
  /** 服务提供机构 */
  provider?: string;
  iconType: 'brain' | 'document' | 'lungs' | 'eye' | 'robot' | 'stethoscope' | 'cloud' | 'scan' | 'file' | 'assistant' | 'bar-chart' | 'shield-check';
  iconTone: 'blue' | 'cyan' | 'green' | 'orange' | 'purple' | 'rose';
  status?: '已上线使用' | '对接测试中' | '对接上线中';
};

export type CapabilityColumn = { title: string; items: CapabilityCardData[] };
export type CapabilityGroup = { id: string; title: string; badge: string; summary: string; columns: CapabilityColumn[] };

export type RecommendationRankItem = {
  id?: string;
  name: string;
  type: '模型' | '智能体';
  unit: string;
  heat: string;
  trend: string;
  date?: string;
};

export type KpiCardData = {
  label: string;
  value: string;
  unit: string;
  delta?: string;
  tone: 'stack' | 'pie' | 'trend' | 'apps';
};

export type MonthlyTrendPoint = { month: string; tokens: number; services: number };
export type UsageShareItem = { name: string; value: number; color: string };
export type WarningRecord = { id: string; service: string; level: '高' | '中' | '低'; message: string; time: string };

export type SidebarMenuIcon = 'service' | 'token' | 'ops' | 'setting' | 'resource' | 'user' | 'portal' | 'analytics' | 'reconciliation' | 'developer' | 'dashboard' | 'table' | 'form' | 'result' | 'exception' | 'database' | 'fund' | 'control' | 'audit' | 'wallet' | 'monitor' | 'org';
export type SidebarMenu = {
  label: string;
  path: string;
  icon: SidebarMenuIcon;
  /** 板块分组：portal=前台门户, admin=管理中心-后台管理 */
  section?: 'portal' | 'admin';
  children?: { label: string; path: string; icon?: SidebarMenuIcon }[];
};

export type ResourceCardData = {
  id: string;
  title: string;
  unit: string;
  tags: string[];
  iconType?: string;
};

// 机构管理
export type OrgListItem = {
  key: string;
  orgName: string;
  contactName: string;
  contactPhone: string;
  applyDate: string;
  creator: string;
  registerType: string;
  source: string;
  status: '已启用' | '已停用';
  role: string;
  orgType: string;
  creditCode: string;
  scale: string;
  city: string;
  detailedAddress: string;
};

export type OrgUserItem = {
  key: string;
  orgKey: string;
  userName: string;
  idCard: string;
  loginAccount: string;
  email: string;
  createDate: string;
  registerType: string;
  source: string;
  status: '已启用' | '已停用';
};

export type TokenPackage = {
  name: string;
  amount: string;
  discount: string;
  scope: string;
  price: string;
  featured?: boolean;
};

export type OwnedPackage = {
  name: string;
  validUntil: string;
  remaining: string;
  status: '正常' | '即将到期' | '额度紧张';
};

export type RealtimeBill = {
  time: string;
  operator: string;
  organization: string;
  service: string;
  tokens: string;
  status: '已扣费' | '处理中';
};

export type HistoryBill = {
  period: string;
  tokens: string;
  cost: string;
  status: '已结算' | '待确认';
};

export type QuotaAccount = {
  level: string;
  name: string;
  quota: string;
  used: string;
  alert: string;
};

export type OperationMetric = {
  label: string;
  value: string;
  unit: string;
  tone?: 'stack' | 'pie' | 'trend' | 'apps';
};

export type OperationModule = {
  title: string;
  description: string;
  items: string[];
  /** 模块类型标识，用于配色与图标 */
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'cyan';
};

/** 计费规则项（CX标红 - 差异化计费） */
export type BillingRule = {
  dimension: string;
  description: string;
  examples: string[];
};

/** 准入审核级别（CX标红 - 三级审核） */
export type AccessReviewLevel = {
  level: RiskLevel;
  title: string;
  process: string[];
  description: string;
};

// ============================ 重构新增类型 ============================

/** 用户角色 */
export type AuthRole = 'org' | 'developer' | 'admin';

/** 登录用户信息 */
export type UserInfo = {
  name: string;
  orgName: string;
  avatarText: string;
  roleLabel: string;
};

/** 服务详情 - 基础信息 */
export type ServiceBasicInfo = {
  服务归属: string;
  能力类型: string[];
  适用范围: string[];
  资质标签: string[];
  接入状态: string;
};

/** 服务详情 - 资质信息 */
export type ServiceQualification = {
  type: string;
  number: string;
  issuedBy: string;
  validUntil: string;
  status: '有效' | '即将到期' | '已过期';
};

/** 服务详情 - 试用场景 */
export type ServiceTrial = {
  quota: string;
  period: string;
  inputExample: string;
  outputExample: string;
  workflow: string[];
};

/** 服务详情 - 服务案例 */
export type ServiceCase = {
  org: string;
  scenario: string;
  calls: string;
};

/** 完整服务详情 */
export type ServiceDetail = {
  basic: ServiceBasicInfo;
  qualifications: ServiceQualification[];
  trial: ServiceTrial;
  cases: ServiceCase[];
};

/** 侧边栏菜单（角色感知） */
export type RoleSidebarMenu = {
  label: string;
  path: string;
  icon: SidebarMenuIcon;
  children?: { label: string; path: string; icon?: SidebarMenuIcon }[];
};

