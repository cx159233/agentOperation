// 开发者中心数据

import { monthlyBills, monthlyRevenue, type MonthlyBill } from './reconciliation';

const DEVELOPER_NAME = '常州市第二人民医院';

export type DeveloperService = {
  id: string;
  name: string;
  category: string;
  riskLevel: '高风险' | '中风险' | '低风险';
  billingMethod: string;
  version: string;
  submittedAt: string;
  listedAt?: string;
  status: '草稿' | '待提交' | '审核中' | '已上架' | '已下架' | '已驳回';
  calls?: string;
  revenue?: string;
};

export const developerServices: DeveloperService[] = [
  { id: 'ds-001', name: 'AI健康助手', category: '市场化合规生态AI产品', riskLevel: '低风险', billingMethod: '按Token', version: 'v3.1.0', submittedAt: '2024-04-22 09:15', listedAt: '2024-05-10', status: '已上架', calls: '23,220 次', revenue: '¥ 43,736' },
  { id: 'ds-002', name: 'AI健康助手 v3.2.0', category: '市场化合规生态AI产品', riskLevel: '低风险', billingMethod: '按Token', version: 'v3.2.0', submittedAt: '2024-07-08 14:30', status: '审核中', calls: '-', revenue: '-' },
  { id: 'ds-003', name: '病历文书规范稽核智能体', category: '市场化合规生态AI产品', riskLevel: '中风险', billingMethod: '按调用次数', version: 'v1.5.2', submittedAt: '2024-06-18 11:00', listedAt: '2024-07-05', status: '已上架', calls: '12,760 次', revenue: '¥ 16,078' },
  { id: 'ds-004', name: '病历文书规范稽核智能体 v1.6.0', category: '市场化合规生态AI产品', riskLevel: '中风险', billingMethod: '按调用次数', version: 'v1.6.0', submittedAt: '2024-07-15 09:30', status: '草稿', calls: '-', revenue: '-' },
  { id: 'ds-005', name: '智能导诊助手 v2.0', category: '省头部医疗机构共建垂直模型', riskLevel: '高风险', billingMethod: '按Token', version: 'v2.0.0', submittedAt: '2024-07-10 16:48', status: '审核中', calls: '-', revenue: '-' },
  { id: 'ds-006', name: '出院小结生成智能体 v0.9', category: '市场化合规生态AI产品', riskLevel: '中风险', billingMethod: '按Token', version: 'v0.9.0', submittedAt: '2024-07-12 11:20', status: '草稿', calls: '-', revenue: '-' },
  { id: 'ds-007', name: '慢病随访智能体 v1.0', category: '市场化合规生态AI产品', riskLevel: '低风险', billingMethod: '按调用次数', version: 'v1.0.0', submittedAt: '2024-06-25 14:20', status: '已驳回', calls: '-', revenue: '-' },
  { id: 'ds-008', name: 'AI健康助手 v3.0.0', category: '市场化合规生态AI产品', riskLevel: '低风险', billingMethod: '按Token', version: 'v3.0.0', submittedAt: '2024-02-20 09:00', listedAt: '2024-03-01', status: '已下架', calls: '420,180 次', revenue: '¥ 12,840' },
];

export type TestingTask = {
  id: string;
  service: string;
  version: string;
  testType: '功能测试' | '性能测试' | '安全测试' | '临床验收';
  stage: '待测试' | '功能测试中' | '性能测试中' | '安全测试中' | '临床验收中' | '已通过' | '已驳回';
  submittedAt: string;
  assignee?: string;
  reportUrl?: string;
  note?: string;
};

export const testingTasks: TestingTask[] = [
  { id: 'TT-2024-0708-001', service: 'AI健康助手 v3.2.0', version: 'v3.2.0', testType: '临床验收', stage: '临床验收中', submittedAt: '2024-07-08 14:30', assignee: '常州市第二人民医院·门诊办公室', note: '需补充 200 例多中心样本数据' },
  { id: 'TT-2024-0710-002', service: '智能导诊助手 v2.0', version: 'v2.0.0', testType: '功能测试', stage: '功能测试中', submittedAt: '2024-07-10 16:48', assignee: '平台测试组', note: '导诊科室路由准确率测试' },
  { id: 'TT-2024-0710-003', service: '智能导诊助手 v2.0', version: 'v2.0.0', testType: '安全测试', stage: '待测试', submittedAt: '2024-07-10 16:48', note: '等待功能测试通过后启动' },
  { id: 'TT-2024-0625-004', service: '慢病随访智能体 v1.0', version: 'v1.0.0', testType: '功能测试', stage: '已驳回', submittedAt: '2024-06-25 14:20', assignee: '平台测试组', reportUrl: '/reports/tt-004.pdf', note: '准确率 78%，未达 85% 阈值，需补充训练数据' },
  { id: 'TT-2024-0618-005', service: '病历文书规范稽核智能体', version: 'v1.5.2', testType: '功能测试', stage: '已通过', submittedAt: '2024-06-18 11:00', assignee: '平台测试组', reportUrl: '/reports/tt-005.pdf', note: '通过率 92.4%，准予上架' },
  { id: 'TT-2024-0618-006', service: '病历文书规范稽核智能体', version: 'v1.5.2', testType: '安全测试', stage: '已通过', submittedAt: '2024-06-18 11:00', assignee: '安全合规组', reportUrl: '/reports/tt-006.pdf' },
];

export type ServiceVersion = {
  id: string;
  service: string;
  version: string;
  type: 'major' | 'minor' | 'patch' | 'hotfix';
  releaseNotes: string;
  releasedAt: string;
  status: '灰度中' | '在线' | '已归档';
  calls?: string;
};

export const serviceVersions: ServiceVersion[] = [
  { id: 'v-001', service: 'AI健康助手', version: 'v3.1.0', type: 'minor', releaseNotes: '导诊推荐策略升级，新增 8 个常见症状的科室路由', releasedAt: '2024-05-10 11:00', status: '在线', calls: '23,220 次' },
  { id: 'v-002', service: 'AI健康助手', version: 'v3.0.0', type: 'major', releaseNotes: '底层切换到山海知医5.0，多轮对话能力大幅提升', releasedAt: '2024-02-20 09:00', status: '已归档', calls: '420,180 次' },
  { id: 'v-003', service: 'AI健康助手', version: 'v3.2.0', type: 'minor', releaseNotes: '新增慢病随访话术，等待临床验收完成后灰度', releasedAt: '2024-07-08 14:30', status: '灰度中' },
  { id: 'v-004', service: '病历文书规范稽核智能体', version: 'v1.5.2', type: 'patch', releaseNotes: '修复入院记录稽核规则漏报问题，规则集升级至 2024-Q2', releasedAt: '2024-07-05 16:00', status: '在线', calls: '12,760 次' },
  { id: 'v-005', service: '病历文书规范稽核智能体', version: 'v1.5.0', type: 'minor', releaseNotes: '新增手术记录稽核规则，支持 12 类常见术式', releasedAt: '2024-04-18 10:00', status: '已归档', calls: '38,420 次' },
  { id: 'v-006', service: '病历文书规范稽核智能体', version: 'v1.6.0', type: 'minor', releaseNotes: '新增出院小结稽核规则，草稿中', releasedAt: '2024-07-15 09:30', status: '灰度中' },
];

export type RevenueBill = MonthlyBill;

// 本机构（常州市第二人民医院）作为服务提供方的月度账单：
// 2024-07：AI健康助手 ¥23,576（待确认）+ 病历文书规范稽核智能体 ¥8,291（已确认）= ¥31,867
// 2024-06：AI健康助手 ¥20,160（已结算）+ 病历文书规范稽核智能体 ¥7,787（异常）= ¥27,947
export const revenueBills: RevenueBill[] = monthlyBills.filter((b) => b.developer === DEVELOPER_NAME);

export { monthlyRevenue };

export type DeveloperCallTrendPoint = { date: string; calls: number; tokens: number };

export const developerCallTrend7d: DeveloperCallTrendPoint[] = [
  { date: '07-09', calls: 6240, tokens: 1820000 },
  { date: '07-10', calls: 7180, tokens: 2140000 },
  { date: '07-11', calls: 6820, tokens: 1980000 },
  { date: '07-12', calls: 7920, tokens: 2360000 },
  { date: '07-13', calls: 5460, tokens: 1620000 },
  { date: '07-14', calls: 4980, tokens: 1480000 },
  { date: '07-15', calls: 8420, tokens: 2480000 },
];

export type DeveloperServiceCallStat = {
  name: string;
  percent: number;
  value: string;
};

// 开发者视角：被调占比排行 = 哪些机构在调用本开发者的服务（被动接调用）
export const developerCallerRank: DeveloperServiceCallStat[] = [
  { name: '常州市人民医院', percent: 38.4, value: '17,720 次' },
  { name: '盐城市第三人民医院', percent: 22.6, value: '10,428 次' },
  { name: '常州市第一人民医院', percent: 16.8, value: '7,752 次' },
  { name: '南京鼓楼医院', percent: 12.1, value: '5,580 次' },
  { name: '其他 6 家机构', percent: 10.1, value: '4,648 次' },
];

export type DeveloperTodo = {
  type: '审核进度' | '草稿提醒' | '账单待确认' | '版本迭代';
  message: string;
  level: 'high' | 'medium' | 'low';
  action?: string;
};

export const developerTodos: DeveloperTodo[] = [
  { type: '审核进度', message: 'AI健康助手 v3.2.0 临床验收中，需补充 200 例多中心样本', level: 'high', action: '查看进度' },
  { type: '审核进度', message: '智能导诊助手 v2.0 功能测试中，导诊科室路由准确率测试', level: 'medium', action: '查看进度' },
  { type: '草稿提醒', message: '病历文书规范稽核智能体 v1.6.0 草稿待提交审核', level: 'medium', action: '继续编辑' },
  { type: '账单待确认', message: '2024-06 月度收益账单待确认，金额 ¥ 27,947.00', level: 'low', action: '去确认' },
  { type: '版本迭代', message: '慢病随访智能体 v1.0 已驳回，准确率 78% 未达 85% 阈值', level: 'high', action: '查看报告' },
];
