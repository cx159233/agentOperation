// 机构工作台数据

import { callRecords, monthlyBills, type CallRecord } from './reconciliation';

const ORG_NAME = '常州市人民医院';

export type OrgKpi = {
  label: string;
  value: string;
  unit: string;
  tone: 'stack' | 'pie' | 'trend' | 'apps';
  delta?: string;
};

export const orgKpis: OrgKpi[] = [
  { label: '词元余额', value: '1,258,560', unit: '万词元', tone: 'stack', delta: '本月 -8.6%' },
  { label: '已订阅服务', value: '23', unit: '项', tone: 'apps', delta: '本月 +3 项' },
  { label: '本月调用', value: '1,842,900', unit: '次', tone: 'trend', delta: '环比 +12.5%' },
  { label: '子账户数', value: '14', unit: '个', tone: 'pie', delta: '机构总账户 1 + 部门 8 + 个人 5' },
];

export type OrgSubAccountRef = {
  name: string;
  code: string;
  quota: string;
  used: string;
  ratio: number;
};

export type OrgSubscribedService = {
  id: string;
  name: string;
  category: string;
  billingMethod: string;
  validUntil: string;
  scope: string;
  status: '正常' | '即将到期' | '已到期';
  quota: string;
  used: string;
  ratio: number;
  alertThreshold: number;
  endpoint: string;
  accessKey: string;
  secretKey: string;
  subAccounts: OrgSubAccountRef[];
  callExample: string;
  payloadExample: string;
};

export const subscribedServices: OrgSubscribedService[] = [
  {
    id: 'sub-001',
    name: 'Deepseek标准对话模型（V4）',
    category: '通用基础大模型',
    billingMethod: '按Token',
    validUntil: '2025-12-31',
    scope: '全院',
    status: '正常',
    quota: '8,000万词元',
    used: '5,420万词元',
    ratio: 67.8,
    alertThreshold: 80,
    endpoint: 'https://api.jsyb-ai.cn/v1/llm/deepseek-v4/chat',
    accessKey: 'AK_JSYB_2024_0018A3',
    secretKey: 'SK_9f3a7c4e1b2d8a5f6c0e4b7a9d1c3f2e',
    subAccounts: [
      { name: '门诊办公室', code: 'DEPT_OP', quota: '2,000万词元', used: '1,280万词元', ratio: 64.0 },
      { name: '信息科', code: 'DEPT_IT', quota: '3,000万词元', used: '2,140万词元', ratio: 71.3 },
      { name: '住院部', code: 'DEPT_IP', quota: '3,000万词元', used: '2,000万词元', ratio: 66.7 },
    ],
    callExample: `curl -X POST ${'${ENDPOINT}'} \\
  -H "Authorization: Bearer ${'${AK}'}:${'${SK}'}" \\
  -H "X-Sub-Account: ${'${DEPT_CODE}'}" \\
  -H "Content-Type: application/json" \\
  -d '${'${PAYLOAD}'}'`,
    payloadExample: `{
  "model": "deepseek-v4",
  "messages": [
    { "role": "system", "content": "你是医保政策咨询助手" },
    { "role": "user", "content": "门诊慢特病报销比例是多少？" }
  ],
  "temperature": 0.3,
  "max_tokens": 1024
}`,
  },
  {
    id: 'sub-002',
    name: '山海知医5.0大模型',
    category: '医保自研专属大模型',
    billingMethod: '按Token',
    validUntil: '2025-09-15',
    scope: '门诊+住院',
    status: '正常',
    quota: '5,000万词元',
    used: '3,820万词元',
    ratio: 76.4,
    alertThreshold: 80,
    endpoint: 'https://api.jsyb-ai.cn/v1/llm/shanzhi-medical/chat',
    accessKey: 'AK_JSYB_2024_0027B1',
    secretKey: 'SK_4e8b1c6f2a9d3b5e7c0a4f1d8e2b6c9a',
    subAccounts: [
      { name: '门诊办公室', code: 'DEPT_OP', quota: '2,500万词元', used: '2,080万词元', ratio: 83.2 },
      { name: '住院部', code: 'DEPT_IP', quota: '2,500万词元', used: '1,740万词元', ratio: 69.6 },
    ],
    callExample: `curl -X POST ${'${ENDPOINT}'} \\
  -H "Authorization: Bearer ${'${AK}'}:${'${SK}'}" \\
  -H "X-Sub-Account: ${'${DEPT_CODE}'}" \\
  -H "Content-Type: application/json" \\
  -d '${'${PAYLOAD}'}'`,
    payloadExample: `{
  "model": "shanzhi-medical-5.0",
  "messages": [
    { "role": "user", "content": "患者男58岁，COPD急性加重，请生成入院记录首程" }
  ],
  "context": { "patientId": "P-2024-0815", "visitType": "inpatient" }
}`,
  },
  {
    id: 'sub-003',
    name: '肺结节CT图像辅助检测',
    category: '省头部医疗机构共建垂直模型',
    billingMethod: '按检查例次',
    validUntil: '2025-08-20',
    scope: '放射科',
    status: '即将到期',
    quota: '800例/月',
    used: '642例',
    ratio: 80.3,
    alertThreshold: 80,
    endpoint: 'https://api.jsyb-ai.cn/v1/medical/lung-nodule-detect',
    accessKey: 'AK_JSYB_2024_0039C7',
    secretKey: 'SK_7c2e9b4f1a8d3e6c0b5f2a9e4d1c7b3f',
    subAccounts: [
      { name: '放射科', code: 'DEPT_RAD', quota: '800例/月', used: '642例', ratio: 80.3 },
    ],
    callExample: `curl -X POST ${'${ENDPOINT}'} \\
  -H "Authorization: Bearer ${'${AK}'}:${'${SK}'}" \\
  -H "X-Sub-Account: ${'${DEPT_CODE}'}" \\
  -H "Content-Type: application/json" \\
  -d '${'${PAYLOAD}'}'`,
    payloadExample: `{
  "studyInstanceUID": "1.2.840.113619.2.55.3.604688119.971",
  "seriesUID": "1.2.840.113619.2.55.3.604688119.972",
  "modality": "CT",
  "sliceThickness": 1.25,
  "kvp": 120
}`,
  },
  {
    id: 'sub-004',
    name: '远程心电AI诊断',
    category: '省头部医疗机构共建垂直模型',
    billingMethod: '按检查例次',
    validUntil: '2026-02-28',
    scope: '心内科+急诊',
    status: '正常',
    quota: '500例/月',
    used: '428例',
    ratio: 85.6,
    alertThreshold: 85,
    endpoint: 'https://api.jsyb-ai.cn/v1/medical/ecg-analysis',
    accessKey: 'AK_JSYB_2024_0041D2',
    secretKey: 'SK_2b8e5c1f9a4d7e3b6c0a2f5d8e1b4c9a',
    subAccounts: [
      { name: '心内科', code: 'DEPT_CAR', quota: '300例/月', used: '268例', ratio: 89.3 },
      { name: '急诊科', code: 'DEPT_EMG', quota: '200例/月', used: '160例', ratio: 80.0 },
    ],
    callExample: `curl -X POST ${'${ENDPOINT}'} \\
  -H "Authorization: Bearer ${'${AK}'}:${'${SK}'}" \\
  -H "X-Sub-Account: ${'${DEPT_CODE}'}" \\
  -H "Content-Type: application/json" \\
  -d '${'${PAYLOAD}'}'`,
    payloadExample: `{
  "ecgFileUrl": "https://oss.jsyb-ai.cn/ecg/P-2024-0815-001.xml",
  "leads": 12,
  "durationSec": 10,
  "samplingRate": 500
}`,
  },
  {
    id: 'sub-005',
    name: '电子病历辅助生成智能体',
    category: '市场化合规生态AI产品',
    billingMethod: '按Token',
    validUntil: '2025-11-30',
    scope: '全院',
    status: '正常',
    quota: '6,000万词元',
    used: '4,180万词元',
    ratio: 69.7,
    alertThreshold: 80,
    endpoint: 'https://api.jsyb-ai.cn/v1/agent/emr-generator/run',
    accessKey: 'AK_JSYB_2024_0053E8',
    secretKey: 'SK_9a4d1c7b3e8f2a5c0b6e1d4f7a2c9b3e',
    subAccounts: [
      { name: '住院部', code: 'DEPT_IP', quota: '4,000万词元', used: '3,080万词元', ratio: 77.0 },
      { name: '门诊办公室', code: 'DEPT_OP', quota: '2,000万词元', used: '1,100万词元', ratio: 55.0 },
    ],
    callExample: `curl -X POST ${'${ENDPOINT}'} \\
  -H "Authorization: Bearer ${'${AK}'}:${'${SK}'}" \\
  -H "X-Sub-Account: ${'${DEPT_CODE}'}" \\
  -H "Content-Type: application/json" \\
  -d '${'${PAYLOAD}'}'`,
    payloadExample: `{
  "agentId": "emr-generator-v2",
  "patientId": "P-2024-0815",
  "visitType": "inpatient",
  "inputs": {
    "chiefComplaint": "反复咳嗽伴胸闷3天",
    "vitalSigns": { "temp": 37.2, "bp": "130/85", "hr": 86 }
  }
}`,
  },
  {
    id: 'sub-006',
    name: '病历文书规范稽核智能体',
    category: '市场化合规生态AI产品',
    billingMethod: '按调用次数',
    validUntil: '2025-07-25',
    scope: '医务科',
    status: '即将到期',
    quota: '3,000次/月',
    used: '1,820次',
    ratio: 60.7,
    alertThreshold: 80,
    endpoint: 'https://api.jsyb-ai.cn/v1/agent/emr-audit/run',
    accessKey: 'AK_JSYB_2024_0067F1',
    secretKey: 'SK_3e8b1c4f9a2d7e5b0c6a1f4d8e3b9c2a',
    subAccounts: [
      { name: '医务科', code: 'DEPT_MA', quota: '3,000次/月', used: '1,820次', ratio: 60.7 },
    ],
    callExample: `curl -X POST ${'${ENDPOINT}'} \\
  -H "Authorization: Bearer ${'${AK}'}:${'${SK}'}" \\
  -H "X-Sub-Account: ${'${DEPT_CODE}'}" \\
  -H "Content-Type: application/json" \\
  -d '${'${PAYLOAD}'}'`,
    payloadExample: `{
  "agentId": "emr-audit-v1",
  "emrId": "EMR-2024-0715-0892",
  "auditScope": ["首程", "入院记录", "出院小结"],
  "rulesetVersion": "2024-Q2"
}`,
  },
  {
    id: 'sub-007',
    name: 'AI健康助手',
    category: '市场化合规生态AI产品',
    billingMethod: '按Token',
    validUntil: '2026-03-10',
    scope: '门诊大厅+互联网医院',
    status: '正常',
    quota: '2,000万词元',
    used: '820万词元',
    ratio: 41.0,
    alertThreshold: 80,
    endpoint: 'https://api.jsyb-ai.cn/v1/agent/health-assistant/chat',
    accessKey: 'AK_JSYB_2024_0079G4',
    secretKey: 'SK_5c2e9b4f1a8d3e7c0b6a2f5d8e1b4c9a',
    subAccounts: [
      { name: '门诊大厅', code: 'DEPT_LOBBY', quota: '1,200万词元', used: '520万词元', ratio: 43.3 },
      { name: '互联网医院', code: 'DEPT_INH', quota: '800万词元', used: '300万词元', ratio: 37.5 },
    ],
    callExample: `curl -X POST ${'${ENDPOINT}'} \\
  -H "Authorization: Bearer ${'${AK}'}:${'${SK}'}" \\
  -H "X-Sub-Account: ${'${DEPT_CODE}'}" \\
  -H "Content-Type: application/json" \\
  -d '${'${PAYLOAD}'}'`,
    payloadExample: `{
  "agentId": "health-assistant-v3",
  "sessionKey": "lobby-kiosk-007",
  "messages": [
    { "role": "user", "content": "我最近总头晕，应该挂哪个科？" }
  ]
}`,
  },
  {
    id: 'sub-008',
    name: 'BGE检索重排序模型',
    category: '通用基础大模型',
    billingMethod: '按Token',
    validUntil: '2025-10-31',
    scope: '信息科',
    status: '正常',
    quota: '2,000万词元',
    used: '820万词元',
    ratio: 41.0,
    alertThreshold: 80,
    endpoint: 'https://api.jsyb-ai.cn/v1/llm/bge-rerank/search',
    accessKey: 'AK_JSYB_2024_0082H6',
    secretKey: 'SK_1f4d8e3b9c2a5e7c0b6a2f5d8e1b4c9a',
    subAccounts: [
      { name: '信息科', code: 'DEPT_IT', quota: '2,000万词元', used: '820万词元', ratio: 41.0 },
    ],
    callExample: `curl -X POST ${'${ENDPOINT}'} \\
  -H "Authorization: Bearer ${'${AK}'}:${'${SK}'}" \\
  -H "X-Sub-Account: ${'${DEPT_CODE}'}" \\
  -H "Content-Type: application/json" \\
  -d '${'${PAYLOAD}'}'`,
    payloadExample: `{
  "model": "bge-reranker-large",
  "query": "门诊慢特病备案流程",
  "documents": ["doc-001", "doc-002", "doc-003"],
  "topN": 5
}`,
  },
  {
    id: 'sub-009',
    name: '高值耗材智能比对智能体',
    category: '医保基金监管共建模型',
    billingMethod: '按调用次数',
    validUntil: '2025-09-08',
    scope: '医保办',
    status: '已到期',
    quota: '1,500次/月',
    used: '1,580次',
    ratio: 105.3,
    alertThreshold: 100,
    endpoint: 'https://api.jsyb-ai.cn/v1/agent/pci-consumable-audit/run',
    accessKey: 'AK_JSYB_2024_0094J3',
    secretKey: 'SK_8e2b5c1f9a4d7e3b6c0a2f5d8e1b4c9a',
    subAccounts: [
      { name: '医保办', code: 'DEPT_MI', quota: '1,500次/月', used: '1,580次', ratio: 105.3 },
    ],
    callExample: `curl -X POST ${'${ENDPOINT}'} \\
  -H "Authorization: Bearer ${'${AK}'}:${'${SK}'}" \\
  -H "X-Sub-Account: ${'${DEPT_CODE}'}" \\
  -H "Content-Type: application/json" \\
  -d '${'${PAYLOAD}'}'`,
    payloadExample: `{
  "agentId": "pci-audit-v1",
  "patientId": "P-2024-0815",
  "procedureCode": "PCI-DES-01",
  "consumables": [
    { "code": "C-STENT-001", "qty": 2, "price": 8500 },
    { "code": "C-BALLOON-002", "qty": 1, "price": 4200 }
  ]
}`,
  },
];

export type ServiceFeedback = {
  id: string;
  serviceId: string;
  ratings: { 准确性: number; 稳定性: number; 响应时效: number; 业务适配性: number };
  tags: string[];
  content: string;
  createdAt: string;
  status: '已回复' | '处理中' | '待处理';
  reply?: string;
};

export const serviceFeedbacks: ServiceFeedback[] = [
  {
    id: 'fb-001',
    serviceId: 'sub-003',
    ratings: { 准确性: 5, 稳定性: 4, 响应时效: 5, 业务适配性: 4 },
    tags: ['读片准确', '响应快'],
    content: 'AI 辅助读片对6mm以下结节识别精度不错，建议增加对磨玻璃结节的特征描述。',
    createdAt: '2024-07-12 14:20',
    status: '已回复',
    reply: '感谢反馈，研发团队已规划下一版本加强 GGO 特征识别，预计 Q3 上线。',
  },
  {
    id: 'fb-002',
    serviceId: 'sub-002',
    ratings: { 准确性: 4, 稳定性: 5, 响应时效: 4, 业务适配性: 5 },
    tags: ['病历生成流畅', '格式规范'],
    content: '病历生成模板基本满足门诊需要，部分术语建议支持医院个性化定制。',
    createdAt: '2024-07-10 09:15',
    status: '处理中',
  },
  {
    id: 'fb-003',
    serviceId: 'sub-005',
    ratings: { 准确性: 4, 稳定性: 4, 响应时效: 3, 业务适配性: 4 },
    tags: ['内容完整', '高峰期偶有延迟'],
    content: '上午门诊高峰期接口响应偏慢，建议优化并发能力。',
    createdAt: '2024-07-08 11:30',
    status: '已回复',
    reply: '已优化并发资源池，建议工作日10-11点高峰期错峰使用。',
  },
  {
    id: 'fb-004',
    serviceId: 'sub-007',
    ratings: { 准确性: 4, 稳定性: 5, 响应时效: 5, 业务适配性: 4 },
    tags: ['操作友好', '导诊准确'],
    content: '门诊大厅自助机使用流畅，老年患者也能方便操作。',
    createdAt: '2024-07-05 15:42',
    status: '待处理',
  },
];

export type OrgQuota = {
  id: string;
  serviceId: string;
  department: string;
  quota: string;
  used: string;
  ratio: number;
  alertThreshold: number;
  status: '正常' | '预警' | '暂停';
};

export const orgQuotas: OrgQuota[] = [
  { id: 'q-001', serviceId: 'sub-001', department: '门诊办公室', quota: '2,000万词元', used: '1,280万词元', ratio: 64.0, alertThreshold: 80, status: '正常' },
  { id: 'q-002', serviceId: 'sub-001', department: '信息科', quota: '3,000万词元', used: '2,140万词元', ratio: 71.3, alertThreshold: 80, status: '正常' },
  { id: 'q-003', serviceId: 'sub-001', department: '住院部', quota: '3,000万词元', used: '2,000万词元', ratio: 66.7, alertThreshold: 80, status: '正常' },
  { id: 'q-004', serviceId: 'sub-002', department: '门诊办公室', quota: '2,500万词元', used: '2,080万词元', ratio: 83.2, alertThreshold: 80, status: '预警' },
  { id: 'q-005', serviceId: 'sub-002', department: '住院部', quota: '2,500万词元', used: '1,740万词元', ratio: 69.6, alertThreshold: 80, status: '正常' },
  { id: 'q-006', serviceId: 'sub-003', department: '放射科', quota: '800例/月', used: '642例', ratio: 80.3, alertThreshold: 80, status: '预警' },
  { id: 'q-007', serviceId: 'sub-004', department: '心内科', quota: '300例/月', used: '268例', ratio: 89.3, alertThreshold: 85, status: '预警' },
  { id: 'q-008', serviceId: 'sub-004', department: '急诊科', quota: '200例/月', used: '160例', ratio: 80.0, alertThreshold: 85, status: '正常' },
  { id: 'q-009', serviceId: 'sub-005', department: '住院部', quota: '4,000万词元', used: '3,080万词元', ratio: 77.0, alertThreshold: 80, status: '正常' },
  { id: 'q-010', serviceId: 'sub-005', department: '门诊办公室', quota: '2,000万词元', used: '1,100万词元', ratio: 55.0, alertThreshold: 80, status: '正常' },
  { id: 'q-011', serviceId: 'sub-006', department: '医务科', quota: '3,000次/月', used: '1,820次', ratio: 60.7, alertThreshold: 80, status: '正常' },
  { id: 'q-012', serviceId: 'sub-007', department: '门诊大厅', quota: '1,200万词元', used: '520万词元', ratio: 43.3, alertThreshold: 80, status: '正常' },
  { id: 'q-013', serviceId: 'sub-007', department: '互联网医院', quota: '800万词元', used: '300万词元', ratio: 37.5, alertThreshold: 80, status: '正常' },
  { id: 'q-014', serviceId: 'sub-008', department: '信息科', quota: '2,000万词元', used: '820万词元', ratio: 41.0, alertThreshold: 80, status: '正常' },
  { id: 'q-015', serviceId: 'sub-009', department: '医保办', quota: '1,500次/月', used: '1,580次', ratio: 105.3, alertThreshold: 100, status: '暂停' },
];

// ===================== 平台限流配额（机构与平台之间的契约） =====================
// 配额管理解决的是"机构与平台之间"的限流阈值契约：大模型 API 调用有并发、TPM/RPM 等硬性限制，
// 默认限流不够用时需在此向平台申请提额。子账户/API Key 的 Token 分配在「服务订阅管理」中进行。

export type ServiceRateLimit = {
  id: string;
  serviceId: string;
  serviceName: string;
  category: string;
  billingMethod: string;
  // 平台分配的限流阈值（硬性上限）
  tpmLimit?: number;        // Tokens Per Minute（按Token计费服务）
  rpmLimit?: number;        // Requests Per Minute（按调用/检查例次计费服务）
  concurrencyLimit: number; // 并发数上限
  // 当前分钟级峰值使用
  tpmUsed?: number;
  rpmUsed?: number;
  concurrencyUsed: number;
  // 配额申请状态
  applyStatus: '正常' | '审批中' | '已驳回';
  lastApplyAt?: string;
  // 闲置状态
  idleStatus: '正常' | '闲置预警' | '待回收';
  idleDays: number;
  // 近 7 天平均使用率
  avgUsageRatio: number;
};

export const serviceRateLimits: ServiceRateLimit[] = [
  {
    id: 'rl-001', serviceId: 'sub-001', serviceName: 'Deepseek标准对话模型（V4）', category: '通用基础大模型', billingMethod: '按Token',
    tpmLimit: 100000, concurrencyLimit: 20, tpmUsed: 68400, concurrencyUsed: 14,
    applyStatus: '审批中', lastApplyAt: '2024-07-10 14:20', idleStatus: '正常', idleDays: 0, avgUsageRatio: 68.4,
  },
  {
    id: 'rl-002', serviceId: 'sub-002', serviceName: '山海知医5.0大模型', category: '医保自研专属大模型', billingMethod: '按Token',
    tpmLimit: 80000, concurrencyLimit: 15, tpmUsed: 61120, concurrencyUsed: 11,
    applyStatus: '正常', lastApplyAt: '2024-05-15 10:30', idleStatus: '正常', idleDays: 0, avgUsageRatio: 76.4,
  },
  {
    id: 'rl-003', serviceId: 'sub-003', serviceName: '肺结节CT图像辅助检测', category: '省头部医疗机构共建垂直模型', billingMethod: '按检查例次',
    rpmLimit: 60, concurrencyLimit: 10, rpmUsed: 48, concurrencyUsed: 8,
    applyStatus: '已驳回', lastApplyAt: '2024-06-20 09:15', idleStatus: '正常', idleDays: 0, avgUsageRatio: 80.3,
  },
  {
    id: 'rl-004', serviceId: 'sub-004', serviceName: '远程心电AI诊断', category: '省头部医疗机构共建垂直模型', billingMethod: '按检查例次',
    rpmLimit: 30, concurrencyLimit: 5, rpmUsed: 26, concurrencyUsed: 4,
    applyStatus: '正常', lastApplyAt: '2024-04-08 16:40', idleStatus: '正常', idleDays: 0, avgUsageRatio: 85.6,
  },
  {
    id: 'rl-005', serviceId: 'sub-005', serviceName: '电子病历辅助生成智能体', category: '市场化合规生态AI产品', billingMethod: '按Token',
    tpmLimit: 120000, concurrencyLimit: 25, tpmUsed: 83640, concurrencyUsed: 17,
    applyStatus: '正常', lastApplyAt: '2024-06-25 11:20', idleStatus: '正常', idleDays: 0, avgUsageRatio: 69.7,
  },
  {
    id: 'rl-006', serviceId: 'sub-006', serviceName: '病历文书规范稽核智能体', category: '市场化合规生态AI产品', billingMethod: '按调用次数',
    rpmLimit: 100, concurrencyLimit: 15, rpmUsed: 61, concurrencyUsed: 9,
    applyStatus: '正常', lastApplyAt: '2024-03-12 14:05', idleStatus: '正常', idleDays: 0, avgUsageRatio: 60.7,
  },
  {
    id: 'rl-007', serviceId: 'sub-007', serviceName: 'AI健康助手', category: '市场化合规生态AI产品', billingMethod: '按Token',
    tpmLimit: 50000, concurrencyLimit: 10, tpmUsed: 8200, concurrencyUsed: 2,
    applyStatus: '正常', lastApplyAt: '2024-02-28 10:15', idleStatus: '闲置预警', idleDays: 12, avgUsageRatio: 16.4,
  },
  {
    id: 'rl-008', serviceId: 'sub-008', serviceName: 'BGE检索重排序模型', category: '通用基础大模型', billingMethod: '按Token',
    tpmLimit: 200000, concurrencyLimit: 30, tpmUsed: 16400, concurrencyUsed: 5,
    applyStatus: '正常', lastApplyAt: '2024-01-15 09:30', idleStatus: '待回收', idleDays: 35, avgUsageRatio: 8.2,
  },
  {
    id: 'rl-009', serviceId: 'sub-009', serviceName: '高值耗材智能比对智能体', category: '医保基金监管共建模型', billingMethod: '按调用次数',
    rpmLimit: 50, concurrencyLimit: 8, rpmUsed: 53, concurrencyUsed: 8,
    applyStatus: '审批中', lastApplyAt: '2024-07-12 16:30', idleStatus: '正常', idleDays: 0, avgUsageRatio: 105.3,
  },
];

export type QuotaApplication = {
  id: string;
  serviceId: string;
  serviceName: string;
  applyType: '提额' | '降额';
  dimension: 'TPM' | '并发数' | 'RPM';
  currentValue: number;
  appliedValue: number;
  approvedValue?: number;
  reason: string;
  appliedAt: string;
  status: '审批中' | '已通过' | '已驳回';
  reviewer?: string;
  reviewedAt?: string;
  reviewOpinion?: string;
};

export const quotaApplications: QuotaApplication[] = [
  {
    id: 'qa-001', serviceId: 'sub-001', serviceName: 'Deepseek标准对话模型（V4）',
    applyType: '提额', dimension: 'TPM', currentValue: 100000, appliedValue: 200000,
    reason: '门诊高峰期 TPM 接近上限，需扩容以支撑业务量增长', appliedAt: '2024-07-10 14:20', status: '审批中',
  },
  {
    id: 'qa-002', serviceId: 'sub-001', serviceName: 'Deepseek标准对话模型（V4）',
    applyType: '提额', dimension: '并发数', currentValue: 15, appliedValue: 20, approvedValue: 20,
    reason: '新增互联网医院场景，需提升并发能力', appliedAt: '2024-05-08 10:15',
    status: '已通过', reviewer: '平台运营-钱十九', reviewedAt: '2024-05-10 09:30', reviewOpinion: '符合扩容条件，已审批通过',
  },
  {
    id: 'qa-003', serviceId: 'sub-003', serviceName: '肺结节CT图像辅助检测',
    applyType: '提额', dimension: '并发数', currentValue: 8, appliedValue: 15,
    reason: '放射科新增设备，需提升并发处理能力', appliedAt: '2024-06-20 09:15',
    status: '已驳回', reviewer: '平台运营-孙七', reviewedAt: '2024-06-22 14:40', reviewOpinion: '当前并发使用率未达上限，建议优化调用方式后再申请',
  },
  {
    id: 'qa-004', serviceId: 'sub-005', serviceName: '电子病历辅助生成智能体',
    applyType: '提额', dimension: 'TPM', currentValue: 80000, appliedValue: 120000, approvedValue: 120000,
    reason: '住院部全面上线电子病历生成，业务量大幅增长', appliedAt: '2024-06-25 11:20',
    status: '已通过', reviewer: '平台运营-钱十九', reviewedAt: '2024-06-27 10:00', reviewOpinion: '业务场景明确，已审批通过',
  },
  {
    id: 'qa-005', serviceId: 'sub-009', serviceName: '高值耗材智能比对智能体',
    applyType: '提额', dimension: 'RPM', currentValue: 40, appliedValue: 60,
    reason: '医保办集中核查耗材，RPM 持续超限', appliedAt: '2024-07-12 16:30', status: '审批中',
  },
  {
    id: 'qa-006', serviceId: 'sub-002', serviceName: '山海知医5.0大模型',
    applyType: '提额', dimension: 'TPM', currentValue: 60000, appliedValue: 80000, approvedValue: 80000,
    reason: '病历生成场景扩展，TPM 不足', appliedAt: '2024-05-15 10:30',
    status: '已通过', reviewer: '平台运营-周十七', reviewedAt: '2024-05-17 15:20', reviewOpinion: '同意扩容',
  },
  {
    id: 'qa-007', serviceId: 'sub-004', serviceName: '远程心电AI诊断',
    applyType: '提额', dimension: '并发数', currentValue: 3, appliedValue: 5, approvedValue: 5,
    reason: '心内科 + 急诊科同时使用，并发不足', appliedAt: '2024-04-08 16:40',
    status: '已通过', reviewer: '平台运营-钱十九', reviewedAt: '2024-04-10 11:15', reviewOpinion: '同意',
  },
];

export type IdleReclaimRule = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  usageThreshold: number;  // 使用率阈值 (%)
  idleDays: number;        // 连续闲置天数
  reclaimRatio: number;    // 回收比例 (%)，0 表示仅预警不回收
  lastTriggeredAt?: string;
  lastTriggeredService?: string;
};

export const idleReclaimRules: IdleReclaimRule[] = [
  {
    id: 'ir-001', name: '闲置预警', description: '配额使用率持续低于阈值时触发预警通知，提醒机构关注或主动降额',
    enabled: true, usageThreshold: 15, idleDays: 7, reclaimRatio: 0,
    lastTriggeredAt: '2024-07-05 08:00', lastTriggeredService: 'AI健康助手',
  },
  {
    id: 'ir-002', name: '自动回收', description: '长期闲置的配额按比例自动回收，释放给平台其他机构使用',
    enabled: true, usageThreshold: 10, idleDays: 30, reclaimRatio: 50,
    lastTriggeredAt: '2024-06-28 08:00', lastTriggeredService: 'BGE检索重排序模型',
  },
];

export type OrgSubAccount = {
  level: string;
  name: string;
  quota: string;
  used: string;
  ratio: number;
  alert: number;
};

export const orgSubAccounts: OrgSubAccount[] = [
  { level: '机构总账户', name: '常州市人民医院', quota: '5亿词元', used: '3.42亿词元', ratio: 68.4, alert: 80 },
  { level: '部门子账户', name: '门诊办公室', quota: '8,000万词元', used: '3,280万词元', ratio: 41.0, alert: 80 },
  { level: '部门子账户', name: '放射科', quota: '5,000万词元', used: '3,920万词元', ratio: 78.4, alert: 80 },
  { level: '部门子账户', name: '心内科', quota: '3,000万词元', used: '2,560万词元', ratio: 85.3, alert: 80 },
  { level: '部门子账户', name: '医务科', quota: '2,000万词元', used: '920万词元', ratio: 46.0, alert: 80 },
  { level: '个人账户', name: '张三（演示）', quota: '200万词元', used: '78万词元', ratio: 39.0, alert: 80 },
];

export type BillingRecord = CallRecord;

export const billingRecords: BillingRecord[] = callRecords.filter((r) => r.org === ORG_NAME);

export type BillingSummary = {
  monthTokens: string;
  monthAmount: string;
  settled: string;
  pending: string;
};

// 2024-07 常州市人民医院 月度账单：mb-001 ¥40,330 + mb-002 ¥33,680 = ¥74,010（均为待确认）
// 2024-06 已结算：mb-006 ¥44,770 + mb-007 ¥28,800 = ¥73,570
export const billingSummary: BillingSummary = {
  monthTokens: '8,420 万词元',
  monthAmount: '¥ 74,010.00',
  settled: '¥ 73,570.00',
  pending: '¥ 74,010.00',
};

export const orgMonthlyBills = monthlyBills.filter((b) => b.org === ORG_NAME);

// ===================== 词元包购买记录 =====================
export type TokenPackOrder = {
  id: string;
  pack: string;
  service: string;
  tokens: string;
  price: string;
  payMethod: '医保基金' | '机构自费';
  paidAt: string;
  validUntil: string;
  status: '已支付' | '使用中' | '已用完' | '已过期';
};

export const tokenPackOrders: TokenPackOrder[] = [
  { id: 'TP-2024-07-001', pack: '通用基础大模型 5000 万词元包', service: '山海知医5.0大模型', tokens: '5,000 万词元', price: '¥ 20,000.00', payMethod: '医保基金', paidAt: '2024-07-02 10:18', validUntil: '2024-10-02', status: '使用中' },
  { id: 'TP-2024-06-002', pack: '电子病历生成 2000 万词元包', service: '电子病历辅助生成智能体', tokens: '2,000 万词元', price: '¥ 8,000.00', payMethod: '机构自费', paidAt: '2024-06-10 14:42', validUntil: '2024-09-10', status: '使用中' },
  { id: 'TP-2024-05-003', pack: '通用基础大模型 5000 万词元包', service: '山海知医5.0大模型', tokens: '5,000 万词元', price: '¥ 20,000.00', payMethod: '医保基金', paidAt: '2024-04-05 09:30', validUntil: '2024-07-05', status: '已用完' },
  { id: 'TP-2024-03-004', pack: 'BGE 检索重排 1000 万词元包', service: 'BGE检索重排序模型', tokens: '1,000 万词元', price: '¥ 1,000.00', payMethod: '机构自费', paidAt: '2024-03-18 11:20', validUntil: '2024-06-18', status: '已过期' },
];

// ===================== 直接付费记录 =====================
export type DirectPayOrder = {
  id: string;
  service: string;
  billingMethod: '按检查例次' | '按调用次数';
  usage: string;
  amount: string;
  payMethod: '医保基金' | '机构自费';
  paidAt: string;
  invoice: string;
  status: '已支付' | '已开票' | '待开票';
};

export const directPayOrders: DirectPayOrder[] = [
  { id: 'DP-2024-07-021', service: '肺结节CT图像辅助检测', billingMethod: '按检查例次', usage: '2,180 例', amount: '¥ 40,330.00', payMethod: '医保基金', paidAt: '2024-07-15 09:20', invoice: 'INV-2024-07-0312', status: '已开票' },
  { id: 'DP-2024-06-018', service: '肺结节CT图像辅助检测', billingMethod: '按检查例次', usage: '2,420 例', amount: '¥ 44,770.00', payMethod: '医保基金', paidAt: '2024-06-12 16:08', invoice: 'INV-2024-06-0287', status: '已开票' },
  { id: 'DP-2024-07-019', service: '病历文书规范稽核智能体', billingMethod: '按调用次数', usage: '6,580 次', amount: '¥ 11,844.00', payMethod: '机构自费', paidAt: '2024-07-10 11:42', invoice: '-', status: '待开票' },
  { id: 'DP-2024-06-015', service: '高值耗材智能比对智能体', billingMethod: '按调用次数', usage: '4,260 次', amount: '¥ 10,650.00', payMethod: '机构自费', paidAt: '2024-06-08 14:24', invoice: 'INV-2024-06-0265', status: '已支付' },
];

export type FeedbackRecord = {
  id: string;
  service: string;
  ratings: { 准确性: number; 稳定性: number; 响应时效: number; 业务适配性: number };
  tags: string[];
  content: string;
  createdAt: string;
  status: '已回复' | '处理中' | '待处理';
  reply?: string;
};

export const feedbackRecords: FeedbackRecord[] = [
  {
    id: 'fb-001',
    service: '肺结节CT图像辅助检测',
    ratings: { 准确性: 5, 稳定性: 4, 响应时效: 5, 业务适配性: 4 },
    tags: ['读片准确', '响应快'],
    content: 'AI 辅助读片对6mm以下结节识别精度不错，建议增加对磨玻璃结节的特征描述。',
    createdAt: '2024-07-12 14:20',
    status: '已回复',
    reply: '感谢反馈，研发团队已规划下一版本加强 GGO 特征识别，预计 Q3 上线。',
  },
  {
    id: 'fb-002',
    service: '山海知医5.0大模型',
    ratings: { 准确性: 4, 稳定性: 5, 响应时效: 4, 业务适配性: 5 },
    tags: ['病历生成流畅', '格式规范'],
    content: '病历生成模板基本满足门诊需要，部分术语建议支持医院个性化定制。',
    createdAt: '2024-07-10 09:15',
    status: '处理中',
  },
  {
    id: 'fb-003',
    service: '电子病历辅助生成智能体',
    ratings: { 准确性: 4, 稳定性: 4, 响应时效: 3, 业务适配性: 4 },
    tags: ['内容完整', '高峰期偶有延迟'],
    content: '上午门诊高峰期接口响应偏慢，建议优化并发能力。',
    createdAt: '2024-07-08 11:30',
    status: '已回复',
    reply: '已优化并发资源池，建议工作日10-11点高峰期错峰使用。',
  },
  {
    id: 'fb-004',
    service: 'AI健康助手',
    ratings: { 准确性: 4, 稳定性: 5, 响应时效: 5, 业务适配性: 4 },
    tags: ['操作友好', '导诊准确'],
    content: '门诊大厅自助机使用流畅，老年患者也能方便操作。',
    createdAt: '2024-07-05 15:42',
    status: '待处理',
  },
];

export type CallTrendPoint = { date: string; calls: number; tokens: number };

export const callTrend7d: CallTrendPoint[] = [
  { date: '07-09', calls: 168200, tokens: 38400000 },
  { date: '07-10', calls: 182400, tokens: 42100000 },
  { date: '07-11', calls: 175800, tokens: 40800000 },
  { date: '07-12', calls: 192600, tokens: 44500000 },
  { date: '07-13', calls: 158400, tokens: 36200000 },
  { date: '07-14', calls: 142800, tokens: 32800000 },
  { date: '07-15', calls: 184200, tokens: 42800000 },
];

export type OrgTodo = {
  type: '续订预警' | '配额预警' | '账单待确认' | '配额分配';
  message: string;
  level: 'high' | 'medium' | 'low';
  action?: string;
};

export const orgTodos: OrgTodo[] = [
  { type: '续订预警', message: '肺结节CT图像辅助检测订阅将于 2025-08-20 到期', level: 'high', action: '去续订' },
  { type: '续订预警', message: '病历文书规范稽核智能体订阅将于 2025-07-25 到期', level: 'high', action: '去续订' },
  { type: '配额预警', message: '医保办 PCI 耗材比对调用已暂停（105.3%）', level: 'high', action: '去处理' },
  { type: '配额预警', message: '心内科远程心电配额使用率达 85.6%', level: 'medium', action: '查看' },
  { type: '配额分配', message: 'Deepseek V4 仍有 2,000 万词元未分配科室', level: 'medium', action: '去分配' },
  { type: '账单待确认', message: '2024-06 月度账单待确认，金额 ¥ 268,420.00', level: 'low', action: '去确认' },
];
