// 运营管理数据

import type { OrgSubAccountRef } from './orgWorkbench';

export type ListingService = {
  id: string;
  name: string;
  category: string;
  status: '在售' | '已停用' | '退出预警' | '已退出';
  listedAt: string;
  certExpiry: string;
  qualityScore: number;
  calls: string;
  subscriberCount: number;
  subscribers: string[];
};

export const listingServices: ListingService[] = [
  { id: 'ls-001', name: 'Deepseek标准对话模型（V4）', category: '通用基础大模型', status: '在售', listedAt: '2026-03-15', certExpiry: '2027-03-15', qualityScore: 4.8, calls: '254k', subscriberCount: 86, subscribers: ['常州市人民医院', '南京鼓楼医院', '江苏省人民医院', '东南大学附属中大医院', '常州第二人民医院'] },
  { id: 'ls-002', name: '山海知医5.0大模型', category: '医保自研专属大模型', status: '在售', listedAt: '2026-04-20', certExpiry: '2028-12-25', qualityScore: 4.6, calls: '286k', subscriberCount: 64, subscribers: ['常州市人民医院', '南京鼓楼医院', '江苏省人民医院', '东南大学附属中大医院', '常州第二人民医院'] },
  { id: 'ls-003', name: '肺结节CT图像辅助检测', category: '省头部医疗机构共建垂直模型', status: '在售', listedAt: '2026-05-12', certExpiry: '2029-04-12', qualityScore: 4.7, calls: '231k', subscriberCount: 42, subscribers: ['常州市人民医院', '南京鼓楼医院', '江苏省人民医院', '东南大学附属中大医院', '常州第二人民医院'] },
  { id: 'ls-004', name: '电子病历辅助生成智能体', category: '市场化合规生态AI产品', status: '在售', listedAt: '2026-05-28', certExpiry: '2027-08-15', qualityScore: 4.5, calls: '198k', subscriberCount: 73, subscribers: ['常州市人民医院', '南京鼓楼医院', '江苏省人民医院', '东南大学附属中大医院', '常州第二人民医院'] },
  { id: 'ls-005', name: '高值耗材智能比对智能体', category: '医保基金监管共建模型', status: '已停用', listedAt: '2026-06-08', certExpiry: '2027-09-12', qualityScore: 4.2, calls: '86k', subscriberCount: 28, subscribers: ['常州市人民医院', '南京鼓楼医院', '江苏省人民医院', '东南大学附属中大医院', '常州第二人民医院'] },
  { id: 'ls-006', name: '影像报告辅助生成大模型', category: '医保自研专属大模型', status: '退出预警', listedAt: '2026-04-12', certExpiry: '2025-08-20', qualityScore: 3.6, calls: '42k', subscriberCount: 18, subscribers: ['常州市人民医院', '南京鼓楼医院', '江苏省人民医院'] },
  { id: 'ls-007', name: '门诊特殊病人医嘱辅助判断智能体', category: '市场化合规生态AI产品', status: '在售', listedAt: '2026-06-22', certExpiry: '2027-10-22', qualityScore: 4.4, calls: '64k', subscriberCount: 32, subscribers: ['常州市人民医院', '南京鼓楼医院', '江苏省人民医院'] },
  { id: 'ls-008', name: '小肝人肝癌模型', category: '省头部医疗机构共建垂直模型', status: '退出预警', listedAt: '2026-05-30', certExpiry: '2025-09-08', qualityScore: 3.4, calls: '28k', subscriberCount: 12, subscribers: ['南京鼓楼医院', '东南大学附属中大医院'] },
  { id: 'ls-009', name: 'AI健康助手', category: '市场化合规生态AI产品', status: '在售', listedAt: '2026-07-01', certExpiry: '2027-11-30', qualityScore: 4.5, calls: '142k', subscriberCount: 56, subscribers: ['常州市人民医院', '南京鼓楼医院', '江苏省人民医院'] },
  { id: 'ls-010', name: '脊柱侧凸的无辐射筛查模型', category: '省头部医疗机构共建垂直模型', status: '已退出', listedAt: '2026-03-08', certExpiry: '2026-12-31', qualityScore: 3.0, calls: '12k', subscriberCount: 0, subscribers: [] },
];

// ============================ 服务准入管理（模型上架审核，多版本） ============================

export type AuditLogEntry = {
  stage: string;
  action: '提交' | '通过' | '驳回' | '阶段流转';
  auditor?: string;
  auditAt: string;
  opinion?: string;
};

export type ServiceVersionReview = {
  version: string;
  stage: '资质核验' | '技术测评' | '临床验收' | '简化测试' | '备案上架';
  status: '审核中' | '已通过' | '已驳回';
  submittedAt: string;
  billingMethod: string;
  scope: string;
  materials: string[];
  testReport?: string;
  auditLogs: AuditLogEntry[];
};

export type ServiceAccessRecord = {
  id: string;
  serviceName: string;
  category: string;
  riskLevel: '高风险' | '中风险' | '低风险';
  submitter: string;
  versions: ServiceVersionReview[];
};

export const serviceAccessRecords: ServiceAccessRecord[] = [
  {
    id: 'sa-001',
    serviceName: '肺结节CT图像辅助检测',
    category: '省头部医疗机构共建垂直模型',
    riskLevel: '高风险',
    submitter: '北京汇医慧影医疗科技有限公司',
    versions: [
      {
        version: 'v3.0', stage: '备案上架', status: '已通过', submittedAt: '2026-03-15 10:00:00',
        billingMethod: '按检查例次', scope: '放射科',
        materials: ['第三类医疗器械注册证', '网信办算法备案', 'ISO13485', '临床试验报告'],
        testReport: '准确率 96.8% / 灵敏度 95.8% / 特异度 96.2% / 假阳性率 3.8% / 临床验收 36 例通过',
        auditLogs: [
          { stage: '资质核验', action: '通过', auditor: '李四', auditAt: '2026-03-22 14:30', opinion: '资质材料齐全，准予进入技术测评' },
          { stage: '技术测评', action: '通过', auditor: '李工', auditAt: '2026-04-05 16:00', opinion: '准确率 96.8%，灵敏度/特异度均达标' },
          { stage: '临床验收', action: '通过', auditor: '李四', auditAt: '2026-04-18 11:20', opinion: '36 例样本全部通过，准予上架' },
          { stage: '备案上架', action: '通过', auditor: '钱十五', auditAt: '2026-04-20 16:30', opinion: '准确率 96.8%，准予上架' },
        ],
      },
      {
        version: 'v3.1', stage: '临床验收', status: '审核中', submittedAt: '2026-07-12 09:20:00',
        billingMethod: '按检查例次', scope: '放射科',
        materials: ['第三类医疗器械注册证（变更）', '网信办算法备案', '临床试验报告（v3.1）'],
        testReport: '准确率 97.4% / 灵敏度 96.2% / 特异度 97.0% / 假阳性率 3.0% / 临床验收 进行中 18/36',
        auditLogs: [
          { stage: '资质核验', action: '通过', auditor: '李四', auditAt: '2026-07-15 10:00', opinion: '变更材料核验通过' },
          { stage: '技术测评', action: '通过', auditor: '李工', auditAt: '2026-07-18 15:30', opinion: '准确率 97.4%，较 v3.0 提升 0.6%' },
          { stage: '临床验收', action: '阶段流转', auditor: '李四', auditAt: '2026-07-22 09:00', opinion: '已完成 18/36 例样本验收，继续推进' },
        ],
      },
    ],
  },
  {
    id: 'sa-002',
    serviceName: '视网膜病变筛查模型',
    category: '省头部医疗机构共建垂直模型',
    riskLevel: '高风险',
    submitter: '南京数维康医疗科技有限公司',
    versions: [
      {
        version: 'v1.0', stage: '技术测评', status: '审核中', submittedAt: '2026-07-10 14:32:00',
        billingMethod: '按检查例次', scope: '眼科',
        materials: ['第三类医疗器械注册证', '网信办算法备案'],
        testReport: '准确率 94.2% / 灵敏度 92.8% / 特异度 95.0%',
        auditLogs: [
          { stage: '资质核验', action: '通过', auditor: '李四', auditAt: '2026-07-13 11:00', opinion: '资质材料齐全' },
          { stage: '技术测评', action: '阶段流转', auditor: '李工', auditAt: '2026-07-16 14:30', opinion: '技术指标测评中，预计 5 个工作日完成' },
        ],
      },
    ],
  },
  {
    id: 'sa-003',
    serviceName: '病历质控智能体',
    category: '市场化合规生态AI产品',
    riskLevel: '中风险',
    submitter: '常州市第二人民医院',
    versions: [
      {
        version: 'v1.0', stage: '备案上架', status: '已通过', submittedAt: '2026-05-08 11:00:00',
        billingMethod: '按调用次数', scope: '医务科',
        materials: ['第二类医疗器械注册证', '网信办算法备案'],
        testReport: '稽核准确率 92.4%',
        auditLogs: [
          { stage: '资质核验', action: '通过', auditor: '李四', auditAt: '2026-05-12 10:00', opinion: '资质材料齐全' },
          { stage: '简化测试', action: '通过', auditor: '李工', auditAt: '2026-06-10 15:00', opinion: '稽核覆盖率 95%，准确率达标' },
          { stage: '备案上架', action: '通过', auditor: '李四', auditAt: '2026-06-18 15:20', opinion: '稽核覆盖率 95%，准予上架' },
        ],
      },
      {
        version: 'v2.0', stage: '简化测试', status: '审核中', submittedAt: '2026-07-08 11:15:00',
        billingMethod: '按调用次数', scope: '医务科',
        materials: ['第二类医疗器械注册证（变更）', '网信办算法备案'],
        testReport: '新增手术记录稽核规则，准确率 93.8%',
        auditLogs: [
          { stage: '资质核验', action: '通过', auditor: '李四', auditAt: '2026-07-11 09:30', opinion: '变更材料核验通过' },
          { stage: '简化测试', action: '阶段流转', auditor: '李工', auditAt: '2026-07-16 14:00', opinion: '新增手术记录稽核规则测试中' },
        ],
      },
    ],
  },
  {
    id: 'sa-004',
    serviceName: '智能导诊助手',
    category: '市场化合规生态AI产品',
    riskLevel: '低风险',
    submitter: '南京数维康医疗科技有限公司',
    versions: [
      {
        version: 'v2.0', stage: '备案上架', status: '审核中', submittedAt: '2026-07-06 16:48:00',
        billingMethod: '按Token', scope: '门诊大厅',
        materials: ['网信办算法备案', '营业执照'],
        auditLogs: [
          { stage: '备案上架', action: '阶段流转', auditor: '钱十五', auditAt: '2026-07-09 10:30', opinion: '低风险产品，备案材料审核中' },
        ],
      },
    ],
  },
  {
    id: 'sa-005',
    serviceName: '慢病随访智能体',
    category: '市场化合规生态AI产品',
    riskLevel: '中风险',
    submitter: '常州市第二人民医院',
    versions: [
      {
        version: 'v1.0', stage: '技术测评', status: '已驳回', submittedAt: '2026-06-25 14:20:00',
        billingMethod: '按调用次数', scope: '全科医学科',
        materials: ['第二类医疗器械注册证', '网信办算法备案'],
        testReport: '准确率 78% / 覆盖病种有限',
        auditLogs: [
          { stage: '资质核验', action: '通过', auditor: '李四', auditAt: '2026-06-28 10:00', opinion: '资质材料齐全' },
          { stage: '技术测评', action: '驳回', auditor: '李工', auditAt: '2026-07-01 10:15', opinion: '准确率 78%，未达 85% 阈值，需补充训练数据' },
        ],
      },
    ],
  },
];

// ============================ 机构准入管理（入驻审核，多申请记录） ============================

export type OrgSubmissionHistory = {
  submittedAt: string;
  status: '审核中' | '已通过' | '已驳回';
  reviewer?: string;
  reviewedAt?: string;
  opinion?: string;
  materials: string[];
  version: string;
  snapshot?: string;
};

export type OrgAccessRecord = {
  id: string;
  unit: string;
  type: string;
  creditCode: string;
  legalPerson: string;
  contact: string;
  submissions: OrgSubmissionHistory[];
};

export const orgAccessRecords: OrgAccessRecord[] = [
  {
    id: 'oa-001',
    unit: '北京汇医慧影医疗科技有限公司',
    type: 'AI 厂商',
    creditCode: '91110108MA01ABC23X',
    legalPerson: '张某某',
    contact: '张经理 138-XXXX-1234',
    submissions: [
      {
        submittedAt: '2026-06-15 10:20:00', status: '已驳回', reviewer: '李四', reviewedAt: '2026-06-22 14:30',
        opinion: '缺少第三类医疗器械注册证，请补充后重新提交',
        materials: ['营业执照', '网信办算法备案'],
        version: 'v1.0',
        snapshot: '202606151020',
      },
      {
        submittedAt: '2026-07-12 09:20:00', status: '审核中',
        materials: ['营业执照', '第三类医疗器械注册证', '网信办算法备案', 'ISO13485'],
        version: 'v2.0',
        snapshot: '202607120920',
      },
    ],
  },
  {
    id: 'oa-002',
    unit: '南京数维康医疗科技有限公司',
    type: 'AI 厂商',
    creditCode: '91320104MA02DEF45Y',
    legalPerson: '李某某',
    contact: '李经理 139-XXXX-5678',
    submissions: [
      {
        submittedAt: '2026-07-10 14:32:00', status: '审核中',
        materials: ['营业执照', '第二类医疗器械注册证', '网信办算法备案'],
        version: 'v1.0',
        snapshot: '202607101432',
      },
    ],
  },
  {
    id: 'oa-003',
    unit: '东南大学附属中大医院',
    type: '医疗机构自研',
    creditCode: '1232000042609000ABC',
    legalPerson: '王某',
    contact: '王主任 137-XXXX-9012',
    submissions: [
      {
        submittedAt: '2026-07-08 11:15:00', status: '审核中',
        materials: ['事业单位法人证书', '科研伦理批件', '算法备案'],
        version: 'v1.0',
        snapshot: '202607081115',
      },
    ],
  },
  {
    id: 'oa-004',
    unit: '南京鼓楼医院',
    type: '医疗机构自研',
    creditCode: '1232000042609000DEF',
    legalPerson: '陈某',
    contact: '陈主任 136-XXXX-3456',
    submissions: [
      {
        submittedAt: '2026-07-05 16:48:00', status: '审核中',
        materials: ['事业单位法人证书', '科研伦理批件'],
        version: 'v1.0',
        snapshot: '202607051648',
      },
    ],
  },
  {
    id: 'oa-005',
    unit: '常州市第二人民医院',
    type: '医疗机构自研',
    creditCode: '1232000042609000GHI',
    legalPerson: '周某',
    contact: '周主任 135-XXXX-7890',
    submissions: [
      {
        submittedAt: '2026-05-20 10:00:00', status: '已通过', reviewer: '李四', reviewedAt: '2026-05-28 16:00',
        opinion: '资质齐全，准予入驻',
        materials: ['事业单位法人证书', '算法备案'],
        version: 'v1.0',
        snapshot: '202605201000',
      },
      {
        submittedAt: '2026-07-02 10:20:00', status: '审核中',
        materials: ['事业单位法人证书', '算法备案', '信息变更说明'],
        version: 'v2.0',
        snapshot: '202607021020',
      },
    ],
  },
];

// ============================ 实时调用监测日志 ============================
export type CallLog = {
  id: string;
  time: string;
  caller: string;
  org: string;
  department: string;
  service: string;
  developer: string;
  billingMethod: string;
  usage: string;
  latency: number;
  status: '成功' | '失败' | '处理中';
  ip: string;
  exception?: string;
};

export const callLogs: CallLog[] = [
  { id: 'cl-001', time: '2026-07-17 10:32:18', caller: '张三', org: '常州市人民医院', department: '放射科', service: '肺结节CT图像辅助检测', developer: '北京汇医慧影医疗科技有限公司', billingMethod: '按检查例次', usage: '1 例', latency: 1820, status: '成功', ip: '10.2.3.45' },
  { id: 'cl-002', time: '2026-07-17 10:31:44', caller: '孙七', org: '常州市人民医院', department: '门诊办公室', service: '山海知医5.0大模型', developer: '云知声智能科技股份有限公司', billingMethod: '按Token', usage: '12,800 词元', latency: 320, status: '成功', ip: '10.2.3.45' },
  { id: 'cl-003', time: '2026-07-17 10:30:02', caller: '周十七', org: '南京鼓楼医院', department: '心内科', service: '远程心电AI诊断', developer: '南京数维康医疗科技有限公司', billingMethod: '按检查例次', usage: '1 例', latency: 2100, status: '处理中', ip: '10.8.4.12' },
  { id: 'cl-004', time: '2026-07-17 10:28:51', caller: '孙十六', org: '南京鼓楼医院', department: '住院部', service: '电子病历辅助生成智能体', developer: '云知声智能科技股份有限公司', billingMethod: '按Token', usage: '8,400 词元', latency: 420, status: '成功', ip: '10.8.4.12' },
  { id: 'cl-005', time: '2026-07-17 10:25:33', caller: '李十三', org: '常州市人民医院', department: '医保办', service: '高值耗材智能比对智能体', developer: '常州健康医疗大数据运营有限公司', billingMethod: '按调用次数', usage: '3 次', latency: 580, status: '失败', ip: '10.2.3.45', exception: '扣费失败：额度冻结中' },
  { id: 'cl-006', time: '2026-07-17 10:22:18', caller: '周八', org: '东南大学附属中大医院', department: '信息科', service: 'BGE检索重排序模型', developer: '北京智源人工智能研究院BAAI', billingMethod: '按Token', usage: '42,000 词元', latency: 260, status: '成功', ip: '10.6.1.30' },
  { id: 'cl-007', time: '2026-07-17 10:18:44', caller: '前台导诊', org: '常州市人民医院', department: '门诊大厅', service: 'AI健康助手', developer: '常州市第二人民医院', billingMethod: '按Token', usage: '5,200 词元', latency: 180, status: '成功', ip: '10.2.3.45' },
  { id: 'cl-008', time: '2026-07-17 10:15:02', caller: '赵十四', org: '常州市人民医院', department: '医务科', service: '病历文书规范稽核智能体', developer: '常州市第二人民医院', billingMethod: '按调用次数', usage: '2 次', latency: 340, status: '成功', ip: '10.2.3.45' },
  { id: 'cl-009', time: '2026-07-17 09:58:11', caller: '张三', org: '常州市人民医院', department: '放射科', service: '肺结节CT图像辅助检测', developer: '北京汇医慧影医疗科技有限公司', billingMethod: '按检查例次', usage: '1 例', latency: 1920, status: '失败', ip: '10.2.3.45', exception: '重复调用：3 秒内同患者重复提交' },
  { id: 'cl-010', time: '2026-07-17 09:42:33', caller: '王十二', org: '常州市第二人民医院', department: '门诊大厅', service: 'AI健康助手', developer: '常州市第二人民医院', billingMethod: '按Token', usage: '3,800 词元', latency: 210, status: '成功', ip: '10.7.2.18' },
  { id: 'cl-011', time: '2026-07-17 09:32:08', caller: '吴九', org: '常州市第二人民医院', department: '住院部', service: '电子病历辅助生成智能体', developer: '云知声智能科技股份有限公司', billingMethod: '按Token', usage: '6,200 词元', latency: 450, status: '成功', ip: '10.7.2.18' },
  { id: 'cl-012', time: '2026-07-17 09:28:42', caller: '周十七', org: '南京鼓楼医院', department: '心内科', service: '远程心电AI诊断', developer: '南京数维康医疗科技有限公司', billingMethod: '按检查例次', usage: '1 例', latency: 1850, status: '成功', ip: '10.8.4.12' },
  { id: 'cl-013', time: '2026-07-17 09:15:22', caller: '孙七', org: '常州市人民医院', department: '门诊办公室', service: '山海知医5.0大模型', developer: '云知声智能科技股份有限公司', billingMethod: '按Token', usage: '9,600 词元', latency: 310, status: '成功', ip: '10.2.3.45' },
  { id: 'cl-014', time: '2026-07-17 08:58:08', caller: '李十三', org: '常州市人民医院', department: '医保办', service: '高值耗材智能比对智能体', developer: '常州健康医疗大数据运营有限公司', billingMethod: '按调用次数', usage: '1 次', latency: 620, status: '成功', ip: '10.2.3.45' },
  { id: 'cl-015', time: '2026-07-17 08:42:14', caller: '周八', org: '东南大学附属中大医院', department: '信息科', service: 'BGE检索重排序模型', developer: '北京智源人工智能研究院BAAI', billingMethod: '按Token', usage: '28,400 词元', latency: 240, status: '成功', ip: '10.6.1.30' },
  { id: 'cl-016', time: '2026-07-17 08:30:02', caller: '前台导诊', org: '常州市人民医院', department: '门诊大厅', service: 'AI健康助手', developer: '常州市第二人民医院', billingMethod: '按Token', usage: '4,200 词元', latency: 195, status: '成功', ip: '10.2.3.45' },
];

export type MonitoringKpi = {
  label: string;
  value: string;
  unit: string;
  delta: string;
};

export const monitoringKpis: MonitoringKpi[] = [
  { label: '今日调用总数', value: '12,486', unit: '次', delta: '较昨日 +8.6%' },
  { label: '调用成功率', value: '99.2', unit: '%', delta: '较昨日 +0.3pp' },
  { label: '平均响应时延', value: '386', unit: 'ms', delta: '较昨日 -24ms' },
  { label: '异常调用数', value: '18', unit: '次', delta: '较昨日 +5 次' },
];

export const callerRanking = [
  { name: '常州市人民医院', calls: '4,820', ratio: 100, color: '#165DFF' },
  { name: '南京鼓楼医院', calls: '3,240', ratio: 67, color: '#10B981' },
  { name: '常州市第二人民医院', calls: '2,180', ratio: 45, color: '#F59E0B' },
  { name: '东南大学附属中大医院', calls: '1,460', ratio: 30, color: '#7C3AED' },
  { name: '江苏省人民医院', calls: '786', ratio: 16, color: '#13B8C6' },
];

export const modelRanking = [
  { name: '山海知医5.0大模型', calls: '3,860', ratio: 100, color: '#165DFF' },
  { name: 'AI健康助手', calls: '2,940', ratio: 76, color: '#10B981' },
  { name: '肺结节CT图像辅助检测', calls: '2,180', ratio: 56, color: '#F59E0B' },
  { name: '电子病历辅助生成智能体', calls: '1,620', ratio: 42, color: '#7C3AED' },
  { name: '远程心电AI诊断', calls: '1,280', ratio: 33, color: '#13B8C6' },
];

export const latencyDistribution = [
  { range: '< 200ms', count: '4,860 次', ratio: 39, color: '#10B981' },
  { range: '200-500ms', count: '5,240 次', ratio: 42, color: '#165DFF' },
  { range: '500ms-1s', count: '1,820 次', ratio: 15, color: '#F59E0B' },
  { range: '1-2s', count: '420 次', ratio: 3, color: '#F97316' },
  { range: '> 2s', count: '146 次', ratio: 1, color: '#EF4444' },
];

// ============================ 异常预警 ============================
export type MonitoringAlert = {
  id: string;
  level: '高' | '中' | '低';
  service: string;
  org: string;
  description: string;
  time: string;
  status: '未处理' | '处理中' | '已处理';
};

export const monitoringAlerts: MonitoringAlert[] = [
  { id: 'ma-001', level: '高', service: '高值耗材智能比对智能体', org: '常州市人民医院', description: '单日调用 158 次，超出该机构历史均值 320%', time: '2026-07-15 10:25', status: '处理中' },
  { id: 'ma-002', level: '高', service: '山海知医5.0大模型', org: '南京鼓楼医院', description: '科研账号调用临床业务接口，超出授权范围', time: '2026-07-14 16:42', status: '已处理' },
  { id: 'ma-003', level: '中', service: '电子病历辅助生成智能体', org: '南京鼓楼医院', description: '响应时延 P99 达 3.8s，超过阈值 2s', time: '2026-07-14 11:18', status: '未处理' },
  { id: 'ma-004', level: '中', service: 'AI健康助手', org: '常州市人民医院', description: '凌晨 2-4 点异常高频调用', time: '2026-07-13 09:20', status: '已处理' },
  { id: 'ma-005', level: '低', service: 'BGE检索重排序模型', org: '东南大学附属中大医院', description: '调用失败率 0.8%，略高于均值', time: '2026-07-12 17:42', status: '已处理' },
];

export type HotService = {
  rank: number;
  name: string;
  category: string;
  calls: string;
  trend: string;
  growth: string;
};

export const hotServices: HotService[] = [
  { rank: 1, name: '山海知医5.0大模型', category: '医保自研专属大模型', calls: '286k', trend: '+18%', growth: 'up' },
  { rank: 2, name: 'Deepseek标准对话模型（V4）', category: '通用基础大模型', calls: '254k', trend: '+15%', growth: 'up' },
  { rank: 3, name: '肺结节CT图像辅助检测', category: '省头部医疗机构共建垂直模型', calls: '231k', trend: '+12%', growth: 'up' },
  { rank: 4, name: '电子病历辅助生成智能体', category: '市场化合规生态AI产品', calls: '198k', trend: '+9%', growth: 'up' },
  { rank: 5, name: 'AI健康助手', category: '市场化合规生态AI产品', calls: '142k', trend: '+22%', growth: 'up' },
  { rank: 6, name: '远程心电AI诊断', category: '省头部医疗机构共建垂直模型', calls: '128k', trend: '+8%', growth: 'up' },
  { rank: 7, name: '病历文书规范稽核智能体', category: '市场化合规生态AI产品', calls: '86k', trend: '+5%', growth: 'up' },
  { rank: 8, name: '高值耗材智能比对智能体', category: '医保基金监管共建模型', calls: '86k', trend: '-3%', growth: 'down' },
  { rank: 9, name: 'BGE检索重排序模型', category: '通用基础大模型', calls: '72k', trend: '+6%', growth: 'up' },
  { rank: 10, name: 'BGE语义嵌入模型', category: '通用基础大模型', calls: '58k', trend: '+4%', growth: 'up' },
];

export type QualityService = {
  id: string;
  name: string;
  logo?: string;
  accuracy: number;
  latency: number;
  successRate: number;
  businessFit: number;
  score: number;
  currentQuota: string;
};

export const qualityServices: QualityService[] = [
  { id: 'q-001', name: 'Deepseek标准对话模型（V4）', accuracy: 96.8, latency: 280, successRate: 99.6, businessFit: 4.5, score: 4.8, currentQuota: '5000万词元/月' },
  { id: 'q-002', name: '山海知医5.0大模型', accuracy: 95.2, latency: 320, successRate: 99.2, businessFit: 5.0, score: 4.6, currentQuota: '3000万词元/月' },
  { id: 'q-003', name: '肺结节CT图像辅助检测', accuracy: 97.4, latency: 1850, successRate: 99.8, businessFit: 4.5, score: 4.7, currentQuota: '800例/月' },
  { id: 'q-004', name: '电子病历辅助生成智能体', accuracy: 93.6, latency: 420, successRate: 98.8, businessFit: 4.0, score: 4.5, currentQuota: '2000万词元/月' },
  { id: 'q-005', name: '高值耗材智能比对智能体', accuracy: 91.8, latency: 580, successRate: 97.6, businessFit: 4.0, score: 4.2, currentQuota: '600次/月' },
  { id: 'q-006', name: '影像报告辅助生成大模型', accuracy: 88.4, latency: 920, successRate: 96.2, businessFit: 4.0, score: 3.6, currentQuota: '1500万词元/月' },
  { id: 'q-007', name: '小肝人肝癌模型', accuracy: 86.2, latency: 1240, successRate: 95.4, businessFit: 3.0, score: 3.4, currentQuota: '200例/月' },
];

export type QualityEvaluation = {
  id: string;
  serviceName: string;
  org: string;
  department: string;
  ratings: { 准确性: number; 稳定性: number; 响应时效: number; 业务适配性: number };
  tags: string[];
  content: string;
  createdAt: string;
  status: '已回复' | '处理中' | '待处理';
  reply?: string;
};

export const qualityEvaluations: QualityEvaluation[] = [
  { id: 'qe-001', serviceName: 'Deepseek标准对话模型（V4）', org: '南京鼓楼医院', department: '信息科', ratings: { 准确性: 5, 稳定性: 5, 响应时效: 4, 业务适配性: 5 }, tags: ['接口稳定', '响应快'], content: '通用对话能力强，接入规范，调用稳定。', createdAt: '2026-07-15 14:20', status: '已回复', reply: '感谢支持，将持续优化。' },
  { id: 'qe-002', serviceName: 'Deepseek标准对话模型（V4）', org: '常州市人民医院', department: '门诊办公室', ratings: { 准确性: 5, 稳定性: 4, 响应时效: 5, 业务适配性: 4 }, tags: ['稳定', '高峰偶有延迟'], content: '工作日 10-11 点高峰期接口响应略慢，建议优化并发能力。', createdAt: '2026-07-12 09:15', status: '已回复', reply: '已优化并发资源池，建议错峰使用。' },
  { id: 'qe-003', serviceName: '山海知医5.0大模型', org: '江苏省人民医院', department: '医保办', ratings: { 准确性: 5, 稳定性: 5, 响应时效: 4, 业务适配性: 5 }, tags: ['合规性强', '报表清晰'], content: '医保审核报表分类清晰，对违规分组识别准确，建议增加自定义规则配置。', createdAt: '2026-07-10 16:48', status: '处理中' },
  { id: 'qe-004', serviceName: '肺结节CT图像辅助检测', org: '南京鼓楼医院', department: '放射科', ratings: { 准确性: 5, 稳定性: 4, 响应时效: 5, 业务适配性: 4 }, tags: ['读片准确', '响应快'], content: 'AI 辅助读片对6mm以下结节识别精度不错，建议增加对磨玻璃结节的特征描述。', createdAt: '2026-07-15 14:20', status: '已回复', reply: '感谢反馈，研发团队已规划下一版本加强 GGO 特征识别，预计 Q3 上线。' },
  { id: 'qe-005', serviceName: '肺结节CT图像辅助检测', org: '东南大学附属中大医院', department: '影像科', ratings: { 准确性: 5, 稳定性: 5, 响应时效: 4, 业务适配性: 5 }, tags: ['准确率高', '辅助价值大'], content: '多中心试点表现稳定，对实性结节识别效果好。', createdAt: '2026-07-09 11:30', status: '待处理' },
  { id: 'qe-006', serviceName: '电子病历辅助生成智能体', org: '常州市人民医院', department: '住院部', ratings: { 准确性: 4, 稳定性: 4, 响应时效: 3, 业务适配性: 4 }, tags: ['内容完整', '高峰期偶有延迟'], content: '上午门诊高峰期接口响应偏慢，建议优化并发能力。', createdAt: '2026-07-08 11:30', status: '已回复', reply: '已优化并发资源池，建议工作日10-11点高峰期错峰使用。' },
  { id: 'qe-007', serviceName: '高值耗材智能比对智能体', org: '常州市人民医院', department: '医保办', ratings: { 准确性: 4, 稳定性: 3, 响应时效: 4, 业务适配性: 4 }, tags: ['比对准确', '偶有误报'], content: '耗材比对规则需细化，部分合规组合被判为异常。', createdAt: '2026-07-07 15:20', status: '处理中' },
  { id: 'qe-008', serviceName: '影像报告辅助生成大模型', org: '南京鼓楼医院', department: '放射科', ratings: { 准确性: 3, 稳定性: 3, 响应时效: 3, 业务适配性: 4 }, tags: ['模板化严重', '需优化'], content: '生成报告模板化倾向明显，缺乏个性化描述。', createdAt: '2026-07-06 10:15', status: '已回复', reply: '研发团队已规划模板定制能力，预计 Q4 上线。' },
  { id: 'qe-009', serviceName: '小肝人肝癌模型', org: '东南大学附属中大医院', department: '肝胆外科', ratings: { 准确性: 3, 稳定性: 4, 响应时效: 3, 业务适配性: 3 }, tags: ['准确率待提升'], content: '对小病灶识别敏感度不足，需补充训练数据。', createdAt: '2026-07-05 09:42', status: '待处理' },
  { id: 'qe-010', serviceName: 'AI健康助手', org: '常州市人民医院', department: '门诊办公室', ratings: { 准确性: 5, 稳定性: 5, 响应时效: 4, 业务适配性: 5 }, tags: ['问答准确', '接入便捷'], content: '患者咨询常见问题应答准确，显著减轻导诊台压力，建议增加多轮对话上下文记忆。', createdAt: '2026-07-16 10:25', status: '已回复', reply: '感谢反馈，多轮对话能力已在 v3.2.0 版本中上线，敬请升级体验。' },
  { id: 'qe-011', serviceName: 'AI健康助手', org: '南京鼓楼医院', department: '信息科', ratings: { 准确性: 4, 稳定性: 4, 响应时效: 5, 业务适配性: 4 }, tags: ['响应快', '偶有误答'], content: '响应速度满意，但对罕见病咨询偶有答非所问，建议补充专科知识库。', createdAt: '2026-07-14 15:30', status: '处理中' },
  { id: 'qe-012', serviceName: 'AI健康助手', org: '江苏省人民医院', department: '门诊部', ratings: { 准确性: 5, 稳定性: 5, 响应时效: 5, 业务适配性: 4 }, tags: ['稳定', '准确率高'], content: '日均承接 1200+ 咨询，运行稳定，准确率符合预期。', createdAt: '2026-07-11 09:20', status: '待处理' },
  { id: 'qe-013', serviceName: '病历文书规范稽核智能体', org: '常州市人民医院', department: '病案管理科', ratings: { 准确性: 5, 稳定性: 4, 响应时效: 4, 业务适配性: 5 }, tags: ['稽核精准', '规则完善'], content: '病历文书稽核覆盖率从 60% 提升至 95%，缺陷检出准确，建议支持自定义稽核规则。', createdAt: '2026-07-13 14:10', status: '已回复', reply: '感谢建议，自定义规则能力已在 v1.6.0 规划中，预计 Q3 末上线。' },
  { id: 'qe-014', serviceName: '病历文书规范稽核智能体', org: '东南大学附属中大医院', department: '医务处', ratings: { 准确性: 4, 稳定性: 4, 响应时效: 5, 业务适配性: 4 }, tags: ['效率提升', '误报低'], content: '稽核效率显著提升，平均每份病历 2 秒内完成，误报率低于 3%。', createdAt: '2026-07-09 16:00', status: '已回复', reply: '感谢认可，我们将持续优化规则引擎进一步降低误报。' },
  { id: 'qe-015', serviceName: '智能导诊助手', org: '南京鼓楼医院', department: '门诊办公室', ratings: { 准确性: 4, 稳定性: 4, 响应时效: 4, 业务适配性: 5 }, tags: ['导诊准确', '体验好'], content: '主诉匹配科室准确率 92%，患者满意度提升明显，建议增加儿科专科导诊。', createdAt: '2026-07-12 11:45', status: '处理中' },
  { id: 'qe-016', serviceName: '出院小结生成智能体', org: '常州市人民医院', department: '住院部', ratings: { 准确性: 4, 稳定性: 5, 响应时效: 4, 业务适配性: 4 }, tags: ['生成快速', '格式规范'], content: '出院小结生成平均 8 秒，格式符合规范，建议增加中医辨证内容字段。', createdAt: '2026-07-08 14:20', status: '待处理' },
  { id: 'qe-017', serviceName: '慢病随访智能体', org: '江苏省人民医院', department: '全科医学科', ratings: { 准确性: 3, 稳定性: 4, 响应时效: 4, 业务适配性: 3 }, tags: ['覆盖不足', '需优化'], content: '随访覆盖病种有限，对罕见慢病支持不足，建议扩展病种库。', createdAt: '2026-07-06 10:30', status: '待处理' },
];

export type AuditLog = {
  id: string;
  time: string;
  operator: string;
  role: '运营管理' | '机构用户' | '开发者';
  module: string;
  action: string;
  ip: string;
  location: string;
  result: '成功' | '失败' | '告警';
  sensitive?: boolean;
  detail?: string;
};

export const auditLogs: AuditLog[] = [
  { id: 'al-001', time: '2026-07-17 10:32:18', operator: '李四', role: '运营管理', module: '交易结算', action: '确认常州市人民医院 7 月账单 ¥ 107,670.00', ip: '10.20.30.12', location: '南京市', result: '成功', sensitive: true, detail: '账单 mb-001 至 mb-005 批量确认' },
  { id: 'al-002', time: '2026-07-17 10:28:44', operator: '李四', role: '运营管理', module: '服务准入管理', action: '通过 肺结节CT V3 临床验收', ip: '10.20.30.12', location: '南京市', result: '成功', sensitive: true, detail: '版本 v3.1 临床验收通过，准予上架' },
  { id: 'al-003', time: '2026-07-17 10:22:11', operator: '李工', role: '运营管理', module: '上架下架管理', action: '暂停 高值耗材智能比对智能体 上架状态', ip: '10.20.30.18', location: '南京市', result: '成功', sensitive: true, detail: '因异常高频调用暂停上架' },
  { id: 'al-004', time: '2026-07-17 10:18:33', operator: '王工', role: '运营管理', module: '额度配置', action: '调整 心内科 远程心电 配额至 600 例/月', ip: '10.20.30.22', location: '南京市', result: '成功', sensitive: true, detail: '原配额 400 例/月，应机构申请上调' },
  { id: 'al-005', time: '2026-07-17 10:15:08', operator: '李四', role: '运营管理', module: '系统管理', action: '登录管理后台', ip: '10.20.30.12', location: '南京市', result: '成功' },
  { id: 'al-006', time: '2026-07-17 09:58:42', operator: '李工', role: '运营管理', module: '异常对账管理', action: '处理异常对账记录 e-002', ip: '10.20.30.18', location: '南京市', result: '成功', detail: '重复调用异常，已退费 ¥ 18.50' },
  { id: 'al-007', time: '2026-07-17 09:42:18', operator: '未知用户', role: '运营管理', module: '系统管理', action: '尝试登录失败（密码错误 5 次）', ip: '203.95.116.x', location: '未知', result: '失败', detail: '账号已临时锁定 30 分钟' },
  { id: 'al-008', time: '2026-07-17 09:32:08', operator: '王工', role: '运营管理', module: '上架下架管理', action: '下架 脊柱侧凸的无辐射筛查模型', ip: '10.20.30.22', location: '南京市', result: '成功', sensitive: true, detail: '资质材料过期，自动下架' },
  { id: 'al-009', time: '2026-07-17 09:18:44', operator: '李四', role: '运营管理', module: '开发者管理', action: '审核通过 北京汇医慧影 入驻申请', ip: '10.20.30.12', location: '南京市', result: '成功', sensitive: true },
  { id: 'al-010', time: '2026-07-17 09:08:32', operator: '李工', role: '运营管理', module: '敏感数据访问', action: '查询医保基金监管案例数据集', ip: '10.20.30.18', location: '南京市', result: '成功', sensitive: true, detail: '导出 2,340 条案例数据' },
  { id: 'al-011', time: '2026-07-17 08:55:14', operator: '张三', role: '机构用户', module: '服务订阅', action: '订阅 AI健康助手 服务', ip: '10.2.3.45', location: '常州市', result: '成功' },
  { id: 'al-012', time: '2026-07-17 08:42:08', operator: '王五', role: '开发者', module: '上架申请', action: '提交 山海知医5.0大模型 v2.0 上架申请', ip: '58.32.x.x', location: '上海市', result: '成功' },
  { id: 'al-013', time: '2026-07-17 08:30:02', operator: '赵六', role: '运营管理', module: '质量评价', action: '回复 心电图AI诊断 差评价', ip: '10.4.6.10', location: '南京市', result: '成功' },
  { id: 'al-014', time: '2026-07-16 23:42:11', operator: '系统', role: '运营管理', module: '运行监测', action: '告警：BGE检索重排序模型 响应时间超阈值', ip: '127.0.0.1', location: '南京市', result: '告警', detail: 'P99 响应时间 3.2s，超阈值 2s' },
  { id: 'al-015', time: '2026-07-16 18:20:45', operator: '张三', role: '机构用户', module: '配额管理', action: '申请增加 AI健康助手 配额', ip: '10.2.3.45', location: '常州市', result: '成功' },
  { id: 'al-016', time: '2026-07-16 17:55:41', operator: '王五', role: '开发者', module: '收益对账', action: '确认 6 月收益账单 ¥ 23,576.00', ip: '10.3.2.18', location: '上海市', result: '成功', sensitive: true },
  { id: 'al-017', time: '2026-07-16 14:20:08', operator: '钱十', role: '运营管理', module: '用户管理', action: '重置 孙七 的账户密码', ip: '10.4.6.10', location: '南京市', result: '成功', sensitive: true },
  { id: 'al-018', time: '2026-07-16 11:30:45', operator: '李四', role: '运营管理', module: '机构准入管理', action: '驳回 南京某科技公司 入驻申请', ip: '10.20.30.12', location: '南京市', result: '成功', detail: '资质材料不完整' },
  { id: 'al-019', time: '2026-07-16 09:15:22', operator: '李工', role: '运营管理', module: '词元计费', action: '调整 通用基础大模型API 词元单价', ip: '10.20.30.18', location: '南京市', result: '成功', sensitive: true, detail: '从 ¥ 0.003/千词元 调整为 ¥ 0.002/千词元' },
  { id: 'al-020', time: '2026-07-15 16:48:33', operator: '王工', role: '运营管理', module: '敏感数据访问', action: '导出医保基金监管数据 12,400 条', ip: '10.20.30.22', location: '南京市', result: '成功', sensitive: true },
];

// ============================ 服务订阅审核 ============================

export type SubscriptionAuditLog = {
  action: string;
  status: string;
  submittedAt: string;
  submitter: string;
  auditAt: string;
  auditor?: string;
  opinion?: string;
};

export type SubscriptionAuditRecord = {
  key: string;
  orgName: string;
  packageName: string;
  discountPrice: string;
  contactName: string;
  contactPhone: string;
  submittedAt: string;
  status: '审核中' | '已通过' | '已驳回';
  auditLogs: SubscriptionAuditLog[];
};

export const subscriptionAuditRecords: SubscriptionAuditRecord[] = [
  {
    key: 'sa-001',
    orgName: '常州市人民医院',
    packageName: '标准包',
    discountPrice: '¥ 180,000',
    contactName: '张三',
    contactPhone: '138-XXXX-1234',
    submittedAt: '2026-07-15 10:30:00',
    status: '审核中',
    auditLogs: [],
  },
  {
    key: 'sa-002',
    orgName: '南京市第一医院',
    packageName: '医联体包',
    discountPrice: '¥ 680,000',
    contactName: '王主任',
    contactPhone: '139-XXXX-5678',
    submittedAt: '2026-07-12 09:15:00',
    status: '已通过',
    auditLogs: [
      { action: '代开通', status: '已通过', submittedAt: '2026-07-14 16:30:00', submitter: '李四', auditAt: '2026-07-14 16:30', auditor: '李四', opinion: '资质齐全，准予通过' },
    ],
  },
  {
    key: 'sa-003',
    orgName: '苏州市医保局',
    packageName: '城市级包',
    discountPrice: '¥ 2,380,000',
    contactName: '李处长',
    contactPhone: '137-XXXX-9012',
    submittedAt: '2026-07-10 14:20:00',
    status: '审核中',
    auditLogs: [],
  },
  {
    key: 'sa-004',
    orgName: '南通大学附属医院',
    packageName: '普惠包',
    discountPrice: '¥ 48,000',
    contactName: '赵主任',
    contactPhone: '136-XXXX-7890',
    submittedAt: '2026-07-08 11:00:00',
    status: '已驳回',
    auditLogs: [
      { action: '审核驳回', status: '已驳回', submittedAt: '2026-07-08 11:00:00', submitter: '赵主任', auditAt: '2026-07-09 10:15', auditor: '李工', opinion: '机构信用评级不足，需补充担保材料后重新申请' },
    ],
  },
];

// ============================ 服务开通台账 ============================

export type GrantLevel = 'org' | 'department' | 'person';

export type Grant = {
  id: string;
  level: GrantLevel;
  target: string;
  targetId?: string;
  department?: string;
  role?: string;
  grantedAt: string;
};

export type ProvisionedService = {
  id: string;
  orgName: string;
  name: string;
  logo?: string;
  code: string;
  internalId?: string;
  unit: string;
  purpose: string;
  orgCreditCode: string;
  unitCreditCode: string;
  category: string;
  billingMethod: string;
  validUntil: string;
  scope: string;
  status: '已开通' | '已停用' | '未开始' | '已过期' | '即将到期' | '已到期' | '正常';
  quota: string;
  used: string;
  ratio: number;
  alertThreshold: number;
  endpoint: string;
  accessKey: string;
  secretKey: string;
  entryUrl: string;
  subAccounts: OrgSubAccountRef[];
  provisionedAt: string;
  packageName: string;
  discountPrice: string;
  contactName: string;
  contactPhone: string;
  auditor: string;
  auditOpinion: string;
  submittedAt: string;
  callExample: string;
  payloadExample: string;
  auditLogs: SubscriptionAuditLog[];
  workbenchMode: 'direct' | 'entry';
  overrideUrl?: string;
  grants: Grant[];
};

export const provisionedServices: ProvisionedService[] = [
  {
    id: 'KH-20260320-001',
    orgName: '常州市第一人民医院',
    name: '肺结节',
    code: 'LUNG_NODULE',
    internalId: 'MDL-LUNG_NODULE',
    unit: '慧影医疗科技（北京）股份有限公司',
    purpose: '用于放射科肺部CT影像AI辅助诊断，提升肺结节检出率',
    orgCreditCode: '12320400MB1972156X',
    unitCreditCode: '91110108335563403F',
    category: '省头部医疗机构共建垂直模型',
    billingMethod: '按检查例次',
    validUntil: '2027-03-20 14:30:00',
    scope: '放射科、体检中心',
    status: '已开通',
    quota: '10,000 例次',
    used: '3,245 例次',
    ratio: 32,
    alertThreshold: 80,
    endpoint: 'https://api.jsyb-ai.cn/v1/llm/think-lung-ct/invoke',
    accessKey: 'AK_JSYB_2026_CZPH001',
    secretKey: 'SK_a7f3b2c9d4e1f8a6b0c2d5e7f9a1b3c6',
    entryUrl: 'https://app.jsyb-ai.cn/think-lung',
    subAccounts: [
      { name: '放射科', code: 'DEPT-RAD-CZPH', quota: '6,000 例次', used: '1,980 例次', ratio: 33 },
      { name: '体检中心', code: 'DEPT-PEC-CZPH', quota: '4,000 例次', used: '1,265 例次', ratio: 32 },
    ],
    provisionedAt: '2026-03-20 14:30:00',
    packageName: '标准包 2026-Q1',
    discountPrice: '¥ 180,000',
    contactName: '张伟',
    contactPhone: '13861001234',
    auditor: '李四',
    auditOpinion: '资质核验通过，准予开通',
    submittedAt: '2026-03-18 09:15:00',
    callExample: 'curl -X POST ${ENDPOINT} \\\n  -H "Authorization: Bearer ${AK}:${SK}" \\\n  -H "Content-Type: application/json" \\\n  -d \'${PAYLOAD}\'',
    payloadExample: '{\n  "model": "think-lung-ct",\n  "messages": [\n    { "role": "user", "content": "示例请求内容" }\n  ]\n}',
    auditLogs: [
      { action: '开通申请', status: '已通过', auditAt: '2026-03-20 14:30', auditor: '李四', opinion: '资质核验通过，准予开通', submittedAt: '2026-03-18 09:15:00', submitter: '张伟' },
    ],
    workbenchMode: 'entry',
    grants: [
      { id: 'g-lung-ct-cz-1', level: 'org', target: '常州市第一人民医院', grantedAt: '2026-03-20 14:30' },
    ],
  },
  {
    id: 'KH-20260110-001',
    orgName: '常州市第一人民医院',
    name: '四肢骨折',
    code: 'BONE_FRACTURE',
    internalId: 'MDL-BONE_FRACTURE',
    unit: '慧影医疗科技（北京）股份有限公司',
    purpose: '用于骨科及急诊四肢骨折DR/DX影像AI辅助诊断',
    orgCreditCode: '12320400MB1972156X',
    unitCreditCode: '91110108335563403F',
    category: '省头部医疗机构共建垂直模型',
    billingMethod: '按检查例次',
    validUntil: '2027-01-10 10:00:00',
    scope: '骨科、急诊科',
    status: '已开通',
    quota: '8,000 例次',
    used: '2,860 例次',
    ratio: 36,
    alertThreshold: 80,
    endpoint: 'https://api.jsyb-ai.cn/v1/llm/bone-fracture/invoke',
    accessKey: 'AK_JSYB_2026_CZPH003',
    secretKey: 'SK_d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6',
    entryUrl: '',
    subAccounts: [
      { name: '骨科', code: 'DEPT-ORT-CZPH', quota: '5,000 例次', used: '1,800 例次', ratio: 36 },
      { name: '急诊科', code: 'DEPT-ER-CZPH', quota: '3,000 例次', used: '1,060 例次', ratio: 35 },
    ],
    provisionedAt: '2026-01-10 10:00:00',
    packageName: '标准包 2026-Q1',
    discountPrice: '¥ 180,000',
    contactName: '张伟',
    contactPhone: '13861001234',
    auditor: '李四',
    auditOpinion: '资质核验通过，准予开通',
    submittedAt: '2026-01-08 08:30:00',
    callExample: 'curl -X POST ${ENDPOINT} \\\n  -H "Authorization: Bearer ${AK}:${SK}" \\\n  -H "Content-Type: application/json" \\\n  -d \'${PAYLOAD}\'',
    payloadExample: '{\n  "model": "bone-fracture",\n  "messages": [\n    { "role": "user", "content": "示例请求内容" }\n  ]\n}',
    auditLogs: [
      { action: '开通申请', status: '已通过', auditAt: '2026-01-10 10:00', auditor: '李四', opinion: '资质核验通过，准予开通', submittedAt: '2026-01-08 08:30:00', submitter: '张伟' },
    ],
    workbenchMode: 'entry',
    grants: [
      { id: 'g-bone-cz-1', level: 'org', target: '常州市第一人民医院', grantedAt: '2026-01-10 10:00' },
    ],
  },
  {
    id: 'KH-20260215-001',
    orgName: '常州市第一人民医院',
    name: '冠脉钙化积分',
    code: 'CT_CACS',
    internalId: 'MDL-CT_CACS',
    unit: '慧影医疗科技（北京）股份有限公司',
    purpose: '用于心内科冠心病CTA影像AI钙化积分计算，辅助风险评估',
    orgCreditCode: '12320400MB1972156X',
    unitCreditCode: '91110108335563403F',
    category: '省头部医疗机构共建垂直模型',
    billingMethod: '按检查例次',
    validUntil: '2026-06-01 10:00:00',
    scope: '心内科',
    status: '已开通',
    quota: '5,000 例次',
    used: '1,420 例次',
    ratio: 28,
    alertThreshold: 80,
    endpoint: 'https://api.jsyb-ai.cn/v1/llm/ct-cacs/invoke',
    accessKey: 'AK_JSYB_2026_CZPH004',
    secretKey: 'SK_e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7',
    entryUrl: '',
    subAccounts: [],
    provisionedAt: '2026-02-15 10:00:00',
    packageName: '标准包 2026-Q1',
    discountPrice: '¥ 180,000',
    contactName: '张伟',
    contactPhone: '13861001234',
    auditor: '李四',
    auditOpinion: '资质核验通过，准予开通',
    submittedAt: '2026-02-12 09:00:00',
    callExample: 'curl -X POST ${ENDPOINT} \\\n  -H "Authorization: Bearer ${AK}:${SK}" \\\n  -H "Content-Type: application/json" \\\n  -d \'${PAYLOAD}\'',
    payloadExample: '{\n  "model": "ct-cacs",\n  "messages": [\n    { "role": "user", "content": "示例请求内容" }\n  ]\n}',
    auditLogs: [
      { action: '开通申请', status: '已通过', auditAt: '2026-02-15 10:00', auditor: '李四', opinion: '资质核验通过，准予开通', submittedAt: '2026-02-12 09:00:00', submitter: '张伟' },
    ],
    workbenchMode: 'entry',
    grants: [
      { id: 'g-cacs-cz-1', level: 'org', target: '常州市第一人民医院', grantedAt: '2026-02-15 10:00' },
    ],
  },
  {
    id: 'KH-20260301-001',
    orgName: '常州市第一人民医院',
    name: '肋骨骨折',
    code: 'CT_RIB_FRACTURE',
    internalId: 'MDL-CT_RIB_FRACTURE',
    unit: '慧影医疗科技（北京）股份有限公司',
    purpose: '用于放射科及急诊胸部CT肋骨骨折AI自动检测',
    orgCreditCode: '12320400MB1972156X',
    unitCreditCode: '91110108335563403F',
    category: '省头部医疗机构共建垂直模型',
    billingMethod: '按检查例次',
    validUntil: '2027-03-01 10:00:00',
    scope: '放射科、急诊科',
    status: '已开通',
    quota: '6,000 例次',
    used: '3,120 例次',
    ratio: 52,
    alertThreshold: 75,
    endpoint: 'https://api.jsyb-ai.cn/v1/llm/ct-rib-fracture/invoke',
    accessKey: 'AK_JSYB_2026_CZPH005',
    secretKey: 'SK_f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8',
    entryUrl: '',
    subAccounts: [],
    provisionedAt: '2026-03-01 10:00:00',
    packageName: '标准包 2026-Q1',
    discountPrice: '¥ 180,000',
    contactName: '张伟',
    contactPhone: '13861001234',
    auditor: '李四',
    auditOpinion: '资质核验通过，准予开通',
    submittedAt: '2026-02-26 14:00:00',
    callExample: 'curl -X POST ${ENDPOINT} \\\n  -H "Authorization: Bearer ${AK}:${SK}" \\\n  -H "Content-Type: application/json" \\\n  -d \'${PAYLOAD}\'',
    payloadExample: '{\n  "model": "ct-rib-fracture",\n  "messages": [\n    { "role": "user", "content": "示例请求内容" }\n  ]\n}',
    auditLogs: [
      { action: '开通申请', status: '已通过', auditAt: '2026-03-01 10:00', auditor: '李四', opinion: '资质核验通过，准予开通', submittedAt: '2026-02-26 14:00:00', submitter: '张伟' },
    ],
    workbenchMode: 'entry',
    grants: [
      { id: 'g-rib-fracture-cz-1', level: 'org', target: '常州市第一人民医院', grantedAt: '2026-03-01 10:00' },
    ],
  },
  {
    id: 'KH-20260320-002',
    orgName: '常州市第一人民医院',
    name: '骨密度',
    code: 'CT_SPINE_BONE',
    internalId: 'MDL-CT_SPINE_BONE',
    unit: '慧影医疗科技（北京）股份有限公司',
    purpose: '用于骨科及体检中心CT影像骨密度AI自动测量，辅助骨质疏松筛查',
    orgCreditCode: '12320400MB1972156X',
    unitCreditCode: '91110108335563403F',
    category: '省头部医疗机构共建垂直模型',
    billingMethod: '按检查例次',
    validUntil: '2027-03-20 10:00:00',
    scope: '骨科、体检中心',
    status: '已停用',
    quota: '4,000 例次',
    used: '2,950 例次',
    ratio: 74,
    alertThreshold: 75,
    endpoint: 'https://api.jsyb-ai.cn/v1/llm/ct-spine-bone/invoke',
    accessKey: 'AK_JSYB_2026_CZPH006',
    secretKey: 'SK_a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9',
    entryUrl: '',
    subAccounts: [],
    provisionedAt: '2026-03-20 10:00:00',
    packageName: '普惠包 2026-Q1',
    discountPrice: '¥ 48,000',
    contactName: '张伟',
    contactPhone: '13861001234',
    auditor: '李四',
    auditOpinion: '资质核验通过，准予开通',
    submittedAt: '2026-03-18 10:30:00',
    callExample: 'curl -X POST ${ENDPOINT} \\\n  -H "Authorization: Bearer ${AK}:${SK}" \\\n  -H "Content-Type: application/json" \\\n  -d \'${PAYLOAD}\'',
    payloadExample: '{\n  "model": "ct-spine-bone",\n  "messages": [\n    { "role": "user", "content": "示例请求内容" }\n  ]\n}',
    auditLogs: [
      { action: '开通申请', status: '已通过', auditAt: '2026-03-20 10:00', auditor: '李四', opinion: '资质核验通过，准予开通', submittedAt: '2026-03-18 10:30:00', submitter: '张伟' },
    ],
    workbenchMode: 'entry',
    grants: [
      { id: 'g-spine-bone-cz-1', level: 'org', target: '常州市第一人民医院', grantedAt: '2026-03-20 10:00' },
    ],
  },
  {
    id: 'KH-20260520-001',
    orgName: '常州市第一人民医院',
    name: '肺结核',
    code: 'TB',
    internalId: 'MDL-TB',
    unit: '慧影医疗科技（北京）股份有限公司',
    purpose: '用于呼吸科及体检中心DR/DX影像肺结核AI辅助筛查',
    orgCreditCode: '12320400MB1972156X',
    unitCreditCode: '91110108335563403F',
    category: '省头部医疗机构共建垂直模型',
    billingMethod: '按检查例次',
    validUntil: '2027-05-20 10:00:00',
    scope: '呼吸科、体检中心',
    status: '已开通',
    quota: '10,000 例次',
    used: '1,860 例次',
    ratio: 19,
    alertThreshold: 80,
    endpoint: 'https://api.jsyb-ai.cn/v1/llm/tb/invoke',
    accessKey: 'AK_JSYB_2026_CZPH007',
    secretKey: 'SK_b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0',
    entryUrl: '',
    subAccounts: [],
    provisionedAt: '2026-05-20 10:00:00',
    packageName: '标准包 2026-Q2',
    discountPrice: '¥ 180,000',
    contactName: '张伟',
    contactPhone: '13861001234',
    auditor: '李四',
    auditOpinion: '资质核验通过，准予开通',
    submittedAt: '2026-05-18 11:00:00',
    callExample: 'curl -X POST ${ENDPOINT} \\\n  -H "Authorization: Bearer ${AK}:${SK}" \\\n  -H "Content-Type: application/json" \\\n  -d \'${PAYLOAD}\'',
    payloadExample: '{\n  "model": "tb",\n  "messages": [\n    { "role": "user", "content": "示例请求内容" }\n  ]\n}',
    auditLogs: [
      { action: '开通申请', status: '已通过', auditAt: '2026-05-20 10:00', auditor: '李四', opinion: '资质核验通过，准予开通', submittedAt: '2026-05-18 11:00:00', submitter: '张伟' },
    ],
    workbenchMode: 'entry',
    grants: [
      { id: 'g-tb-cz-1', level: 'org', target: '常州市第一人民医院', grantedAt: '2026-05-20 10:00' },
    ],
  },
  {
    id: 'KH-20260601-001',
    orgName: '常州市第一人民医院',
    name: '三维建模',
    code: 'threed',
    internalId: 'MDL-threed',
    unit: '深圳市旭东数字医学影像技术有限公司',
    purpose: '用于外科术前规划，基于CT/MRI影像三维重建与可视化',
    orgCreditCode: '12320400MB1972156X',
    unitCreditCode: '914403005700203962',
    category: '省头部医疗机构共建垂直模型',
    billingMethod: '按检查例次',
    validUntil: '2027-06-01 10:00:00',
    scope: '外科',
    status: '已开通',
    quota: '3,000 例次',
    used: '890 例次',
    ratio: 30,
    alertThreshold: 80,
    endpoint: 'https://api.jsyb-ai.cn/v1/llm/threed/invoke',
    accessKey: 'AK_JSYB_2026_CZPH008',
    secretKey: 'SK_c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1',
    entryUrl: '',
    subAccounts: [],
    provisionedAt: '2026-06-01 10:00:00',
    packageName: '标准包 2026-Q2',
    discountPrice: '¥ 180,000',
    contactName: '张伟',
    contactPhone: '13861001234',
    auditor: '李四',
    auditOpinion: '资质核验通过，准予开通',
    submittedAt: '2026-05-28 15:00:00',
    callExample: 'curl -X POST ${ENDPOINT} \\\n  -H "Authorization: Bearer ${AK}:${SK}" \\\n  -H "Content-Type: application/json" \\\n  -d \'${PAYLOAD}\'',
    payloadExample: '{\n  "model": "threed",\n  "messages": [\n    { "role": "user", "content": "示例请求内容" }\n  ]\n}',
    auditLogs: [
      { action: '开通申请', status: '已通过', auditAt: '2026-06-01 10:00', auditor: '李四', opinion: '资质核验通过，准予开通', submittedAt: '2026-05-28 15:00:00', submitter: '张伟' },
    ],
    workbenchMode: 'entry',
    grants: [
      { id: 'g-threed-cz-1', level: 'org', target: '常州市第一人民医院', grantedAt: '2026-06-01 10:00' },
    ],
  },
  {
    id: 'KH-20260412-001',
    orgName: '南京市鼓楼医院',
    name: '肺结节',
    code: 'LUNG_NODULE',
    internalId: 'MDL-LUNG_NODULE',
    unit: '慧影医疗科技（北京）股份有限公司',
    purpose: '用于放射科肺结节筛查，覆盖全院胸部CT检查',
    orgCreditCode: '12320100MB0123456Y',
    unitCreditCode: '91110108335563403F',
    category: '省头部医疗机构共建垂直模型',
    billingMethod: '按检查例次',
    validUntil: '2027-04-12 10:00:00',
    scope: '放射科',
    status: '已开通',
    quota: '8,000 例次',
    used: '5,120 例次',
    ratio: 64,
    alertThreshold: 75,
    endpoint: 'https://api.jsyb-ai.cn/v1/llm/think-lung-ct/invoke',
    accessKey: 'AK_JSYB_2026_NJGL001',
    secretKey: 'SK_b8e4c0d5f2a7b9c1d3e6f8a0b2c4d7f9',
    entryUrl: 'https://app.jsyb-ai.cn/think-lung',
    subAccounts: [],
    provisionedAt: '2026-04-12 10:00:00',
    packageName: '标准包 2026-Q2',
    discountPrice: '¥ 180,000',
    contactName: '李明',
    contactPhone: '13901581234',
    auditor: '李四',
    auditOpinion: '资质核验通过，准予开通',
    submittedAt: '2026-04-10 16:30:00',
    callExample: 'curl -X POST ${ENDPOINT} \\\n  -H "Authorization: Bearer ${AK}:${SK}" \\\n  -H "Content-Type: application/json" \\\n  -d \'${PAYLOAD}\'',
    payloadExample: '{\n  "model": "think-lung-ct",\n  "messages": [\n    { "role": "user", "content": "示例请求内容" }\n  ]\n}',
    auditLogs: [
      { action: '开通申请', status: '已通过', auditAt: '2026-04-12 10:00', auditor: '李四', opinion: '资质核验通过，准予开通', submittedAt: '2026-04-10 16:30:00', submitter: '李明' },
    ],
    workbenchMode: 'entry',
    grants: [
      { id: 'g-lung-ct-nj-1', level: 'org', target: '南京市鼓楼医院', grantedAt: '2026-04-12 10:00' },
    ],
  },
  {
    id: 'KH-20260701-001',
    orgName: '常州市第一人民医院',
    name: '肺炎',
    code: 'PNEUMONIA',
    internalId: 'MDL-PNEUMONIA',
    unit: '慧影医疗科技（北京）股份有限公司',
    purpose: '用于放射科肺炎CT影像AI辅助诊断，覆盖体检及门诊',
    orgCreditCode: '12320400MB1972156X',
    unitCreditCode: '91110108335563403F',
    category: '省头部医疗机构共建垂直模型',
    billingMethod: '按检查例次',
    validUntil: '2026-06-30 23:59:59',
    scope: '放射科',
    status: '已过期',
    quota: '5,000 例次',
    used: '2,100 例次',
    ratio: 42,
    alertThreshold: 80,
    endpoint: 'https://api.jsyb-ai.cn/v1/llm/pneumonia/invoke',
    accessKey: 'AK_JSYB_2026_CZPH002',
    secretKey: 'SK_c9d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5',
    entryUrl: 'https://app.jsyb-ai.cn/pneumonia',
    subAccounts: [
      { name: '放射科', code: 'DEPT-RAD-CZPH2', quota: '5,000 例次', used: '2,100 例次', ratio: 42 },
    ],
    provisionedAt: '2026-07-01 09:00:00',
    packageName: '普惠包 2026-Q3',
    discountPrice: '¥ 48,000',
    contactName: '张伟',
    contactPhone: '13861001234',
    auditor: '李四',
    auditOpinion: '资质核验通过，准予开通',
    submittedAt: '2026-06-28 11:20:00',
    callExample: 'curl -X POST ${ENDPOINT} \\\n  -H "Authorization: Bearer ${AK}:${SK}" \\\n  -H "Content-Type: application/json" \\\n  -d \'${PAYLOAD}\'',
    payloadExample: '{\n  "model": "pneumonia",\n  "messages": [\n    { "role": "user", "content": "示例请求内容" }\n  ]\n}',
    auditLogs: [
      { action: '开通申请', status: '已通过', auditAt: '2026-07-01 09:00', auditor: '李四', opinion: '资质核验通过，准予开通', submittedAt: '2026-06-28 11:20:00', submitter: '张伟' },
    ],
    workbenchMode: 'entry',
    grants: [
      { id: 'g-pneumonia-cz-1', level: 'org', target: '常州市第一人民医院', grantedAt: '2026-07-01 09:00' },
    ],
  },
  {
    id: 'KH-20260818-001',
    orgName: '南京市鼓楼医院',
    name: '冠脉钙化积分',
    code: 'CT_CACS',
    internalId: 'MDL-CT_CACS',
    unit: '慧影医疗科技（北京）股份有限公司',
    purpose: '用于心内科冠脉CTA影像AI钙化积分自动计算，辅助冠心病风险评估',
    orgCreditCode: '12320100MB0123456Y',
    unitCreditCode: '91110108335563403F',
    category: '省头部医疗机构共建垂直模型',
    billingMethod: '按检查例次',
    validUntil: '2027-08-18 15:45:00',
    scope: '心内科、神经内科',
    status: '已开通',
    quota: '6,000 例次',
    used: '2,340 例次',
    ratio: 39,
    alertThreshold: 80,
    endpoint: 'https://api.jsyb-ai.cn/v1/llm/ct-cacs/invoke',
    accessKey: 'AK_JSYB_2026_NJGL002',
    secretKey: 'SK_d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
    entryUrl: 'https://app.jsyb-ai.cn/ct-cacs',
    subAccounts: [],
    provisionedAt: '2026-08-18 15:45:00',
    packageName: '标准包 2026-Q3',
    discountPrice: '¥ 180,000',
    contactName: '李明',
    contactPhone: '13901581234',
    auditor: '李四',
    auditOpinion: '资质核验通过，准予开通',
    submittedAt: '2026-08-15 14:00:00',
    callExample: 'curl -X POST ${ENDPOINT} \\\n  -H "Authorization: Bearer ${AK}:${SK}" \\\n  -H "Content-Type: application/json" \\\n  -d \'${PAYLOAD}\'',
    payloadExample: '{\n  "model": "ct-cacs",\n  "messages": [\n    { "role": "user", "content": "示例请求内容" }\n  ]\n}',
    auditLogs: [
      { action: '开通申请', status: '已通过', auditAt: '2026-08-18 15:45', auditor: '李四', opinion: '资质核验通过，准予开通', submittedAt: '2026-08-15 14:00:00', submitter: '李明' },
    ],
    workbenchMode: 'entry',
    grants: [
      { id: 'g-cacs-nj-1', level: 'org', target: '南京市鼓楼医院', grantedAt: '2026-08-18 15:45' },
    ],
  },
  {
    id: 'KH-20260922-001',
    orgName: '苏州市立医院',
    name: '肋骨骨折',
    code: 'CT_RIB_FRACTURE',
    internalId: 'MDL-CT_RIB_FRACTURE',
    unit: '慧影医疗科技（北京）股份有限公司',
    purpose: '用于放射科及急诊胸部CT影像肋骨骨折AI自动检测',
    orgCreditCode: '12320500MB0789456Z',
    unitCreditCode: '91110108335563403F',
    category: '省头部医疗机构共建垂直模型',
    billingMethod: '按检查例次',
    validUntil: '2027-09-22 11:15:00',
    scope: '放射科',
    status: '已开通',
    quota: '4,000 例次',
    used: '1,060 例次',
    ratio: 27,
    alertThreshold: 80,
    endpoint: 'https://api.jsyb-ai.cn/v1/llm/ct-rib-fracture/invoke',
    accessKey: 'AK_JSYB_2026_SZSL001',
    secretKey: 'SK_e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6',
    entryUrl: 'https://app.jsyb-ai.cn/ct-rib-fracture',
    subAccounts: [
      { name: '放射科', code: 'DEPT-RAD-SZSL', quota: '4,000 例次', used: '1,060 例次', ratio: 27 },
    ],
    provisionedAt: '2026-09-22 11:15:00',
    packageName: '普惠包 2026-Q3',
    discountPrice: '¥ 48,000',
    contactName: '王芳',
    contactPhone: '13771781234',
    auditor: '李四',
    auditOpinion: '资质核验通过，准予开通',
    submittedAt: '2026-09-20 08:45:00',
    callExample: 'curl -X POST ${ENDPOINT} \\\n  -H "Authorization: Bearer ${AK}:${SK}" \\\n  -H "Content-Type: application/json" \\\n  -d \'${PAYLOAD}\'',
    payloadExample: '{\n  "model": "ct-rib-fracture",\n  "messages": [\n    { "role": "user", "content": "示例请求内容" }\n  ]\n}',
    auditLogs: [
      { action: '开通申请', status: '已通过', auditAt: '2026-09-22 11:15', auditor: '李四', opinion: '资质核验通过，准予开通', submittedAt: '2026-09-20 08:45:00', submitter: '王芳' },
    ],
    workbenchMode: 'entry',
    grants: [
      { id: 'g-rib-fracture-sz-1', level: 'org', target: '苏州市立医院', grantedAt: '2026-09-22 11:15' },
    ],
  },
  {
    id: 'KH-20261102-001',
    orgName: '苏州市立医院',
    name: '三维建模',
    code: 'threed',
    internalId: 'MDL-threed',
    unit: '深圳市旭东数字医学影像技术有限公司',
    purpose: '用于外科术前规划，基于CT/MRI影像进行三维重建与可视化',
    orgCreditCode: '12320500MB0789456Z',
    unitCreditCode: '914403005700203962',
    category: '省头部医疗机构共建垂直模型',
    billingMethod: '按检查例次',
    validUntil: '2027-11-02 16:20:00',
    scope: '外科',
    status: '已停用',
    quota: '5,000 例次',
    used: '3,800 例次',
    ratio: 76,
    alertThreshold: 75,
    endpoint: 'https://api.jsyb-ai.cn/v1/llm/threed/invoke',
    accessKey: 'AK_JSYB_2026_SZSL002',
    secretKey: 'SK_f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7',
    entryUrl: 'https://app.jsyb-ai.cn/threed',
    subAccounts: [],
    provisionedAt: '2026-11-02 16:20:00',
    packageName: '标准包 2026-Q4',
    discountPrice: '¥ 180,000',
    contactName: '王芳',
    contactPhone: '13771781234',
    auditor: '李四',
    auditOpinion: '资质核验通过，准予开通',
    submittedAt: '2026-10-30 10:00:00',
    callExample: 'curl -X POST ${ENDPOINT} \\\n  -H "Authorization: Bearer ${AK}:${SK}" \\\n  -H "Content-Type: application/json" \\\n  -d \'${PAYLOAD}\'',
    payloadExample: '{\n  "model": "threed",\n  "messages": [\n    { "role": "user", "content": "示例请求内容" }\n  ]\n}',
    auditLogs: [
      { action: '开通申请', status: '已通过', auditAt: '2026-11-02 16:20', auditor: '李四', opinion: '资质核验通过，准予开通', submittedAt: '2026-10-30 10:00:00', submitter: '王芳' },
    ],
    workbenchMode: 'entry',
    grants: [
      { id: 'g-threed-sz-1', level: 'org', target: '苏州市立医院', grantedAt: '2026-11-02 16:20' },
    ],
  },
];

// ============================ 登录日志 ============================
export type LoginLog = {
  id: string;
  time: string;
  user: string;
  role: '运营管理' | '机构用户' | '开发者';
  ip: string;
  location: string;
  browser: string;
  os: string;
  result: '成功' | '失败';
  failReason?: string;
  sessionId?: string;
};

export const loginLogs: LoginLog[] = [
  { id: 'lg-001', time: '2026-07-17 10:15:08', user: '李四', role: '运营管理', ip: '10.20.30.12', location: '江苏省南京市', browser: 'Chrome 126', os: 'Windows 11', result: '成功', sessionId: 'sess-a01' },
  { id: 'lg-002', time: '2026-07-17 09:42:18', user: '张三', role: '机构用户', ip: '10.2.3.45', location: '江苏省常州市', browser: 'Edge 126', os: 'Windows 10', result: '成功', sessionId: 'sess-a02' },
  { id: 'lg-003', time: '2026-07-17 09:18:32', user: '王五', role: '开发者', ip: '114.88.42.x', location: '北京市', browser: 'Chrome 126', os: 'macOS 14', result: '成功', sessionId: 'sess-a03' },
  { id: 'lg-004', time: '2026-07-17 08:55:14', user: '未知用户', role: '运营管理', ip: '203.95.116.x', location: '未知', browser: 'Chrome 126', os: 'Windows 10', result: '失败', failReason: '密码错误 5 次，账号已临时锁定 30 分钟' },
  { id: 'lg-005', time: '2026-07-17 08:30:02', user: '赵六', role: '运营管理', ip: '10.4.6.10', location: '江苏省南京市', browser: 'Chrome 126', os: 'Windows 11', result: '成功', sessionId: 'sess-a04' },
  { id: 'lg-006', time: '2026-07-16 23:42:11', user: '王五', role: '开发者', ip: '58.32.18.x', location: '上海市', browser: 'Safari 17', os: 'macOS 14', result: '成功', sessionId: 'sess-a05' },
  { id: 'lg-007', time: '2026-07-16 18:20:45', user: '张三', role: '机构用户', ip: '10.2.3.45', location: '江苏省常州市', browser: 'Edge 126', os: 'Windows 10', result: '失败', failReason: '密码错误' },
  { id: 'lg-008', time: '2026-07-16 17:55:41', user: '王五', role: '开发者', ip: '10.3.2.18', location: '上海市', browser: 'Chrome 126', os: 'Windows 11', result: '成功', sessionId: 'sess-a06' },
  { id: 'lg-009', time: '2026-07-16 14:20:08', user: '钱十', role: '运营管理', ip: '10.4.6.10', location: '江苏省南京市', browser: 'Chrome 126', os: 'Windows 11', result: '成功', sessionId: 'sess-a07' },
  { id: 'lg-010', time: '2026-07-16 11:30:45', user: '李四', role: '运营管理', ip: '10.20.30.12', location: '江苏省南京市', browser: 'Chrome 126', os: 'Windows 11', result: '成功', sessionId: 'sess-a08' },
  { id: 'lg-011', time: '2026-07-16 08:15:22', user: '孙七', role: '机构用户', ip: '10.2.3.45', location: '江苏省常州市', browser: 'Chrome 125', os: 'Windows 10', result: '成功', sessionId: 'sess-a09' },
  { id: 'lg-012', time: '2026-07-15 22:08:14', user: 'unknown', role: '运营管理', ip: '45.61.128.x', location: '海外', browser: 'Firefox 127', os: 'Linux', result: '失败', failReason: '账号不存在' },
  { id: 'lg-013', time: '2026-07-15 16:45:33', user: '周八', role: '机构用户', ip: '10.5.8.20', location: '江苏省南京市', browser: 'Chrome 126', os: 'Windows 11', result: '成功', sessionId: 'sess-a10' },
  { id: 'lg-014', time: '2026-07-15 14:30:08', user: '吴九', role: '开发者', ip: '121.35.22.x', location: '深圳市', browser: 'Chrome 126', os: 'Windows 11', result: '成功', sessionId: 'sess-a11' },
  { id: 'lg-015', time: '2026-07-15 09:08:32', user: '李工', role: '运营管理', ip: '10.20.30.18', location: '江苏省南京市', browser: 'Chrome 126', os: 'Windows 11', result: '成功', sessionId: 'sess-a12' },
];
