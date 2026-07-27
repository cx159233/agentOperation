// 交易结算数据 - 三端（机构/开发者/运营）统一结算数据源

// ===================== 服务目录（跨表关联） =====================
export type ServiceCatalog = {
  id: string;
  name: string;
  developer: string;
  billingMethod: '按Token' | '按检查例次' | '按调用次数';
  unitPrice: string;
};

export const serviceCatalog: ServiceCatalog[] = [
  { id: 'svc-lung-ct', name: '肺结节CT图像辅助检测', developer: '北京汇医慧影医疗科技有限公司', billingMethod: '按检查例次', unitPrice: '¥ 18.50/例' },
  { id: 'svc-shanzhi', name: '山海知医5.0大模型', developer: '云知声智能科技股份有限公司', billingMethod: '按Token', unitPrice: '¥ 0.004/千词元' },
  { id: 'svc-ecg', name: '远程心电AI诊断', developer: '南京数维康医疗科技有限公司', billingMethod: '按检查例次', unitPrice: '¥ 12.00/例' },
  { id: 'svc-emr-gen', name: '电子病历辅助生成智能体', developer: '云知声智能科技股份有限公司', billingMethod: '按Token', unitPrice: '¥ 0.004/千词元' },
  { id: 'svc-pci-audit', name: '高值耗材智能比对智能体', developer: '常州健康医疗大数据运营有限公司', billingMethod: '按调用次数', unitPrice: '¥ 2.50/次' },
  { id: 'svc-bge', name: 'BGE检索重排序模型', developer: '北京智源人工智能研究院BAAI', billingMethod: '按Token', unitPrice: '¥ 0.001/千词元' },
  { id: 'svc-health', name: 'AI健康助手', developer: '常州市第二人民医院', billingMethod: '按Token', unitPrice: '¥ 0.004/千词元' },
  { id: 'svc-emr-audit', name: '病历文书规范稽核智能体', developer: '常州市第二人民医院', billingMethod: '按调用次数', unitPrice: '¥ 1.80/次' },
];

// ===================== 单次调用记录（机构端 + 运营端共用） =====================
export type CallRecord = {
  id: string;
  time: string;
  caller: string;
  org: string;
  department: string;
  service: string;
  developer: string;
  billingMethod: string;
  usage: string;
  unitPrice: string;
  amount: string;
  status: '已扣费' | '处理中' | '异常';
  exception?: string;
};

export const callRecords: CallRecord[] = [
  { id: 'c-001', time: '2024-07-15 10:32:18', caller: '张三', org: '常州市人民医院', department: '放射科', service: '肺结节CT图像辅助检测', developer: '北京汇医慧影医疗科技有限公司', billingMethod: '按检查例次', usage: '1 例', unitPrice: '¥ 18.50/例', amount: '¥ 18.50', status: '已扣费' },
  { id: 'c-002', time: '2024-07-15 10:31:44', caller: '孙七', org: '常州市人民医院', department: '门诊办公室', service: '山海知医5.0大模型', developer: '云知声智能科技股份有限公司', billingMethod: '按Token', usage: '12,800 词元', unitPrice: '¥ 0.004/千词元', amount: '¥ 0.05', status: '已扣费' },
  { id: 'c-003', time: '2024-07-15 10:30:02', caller: '周十七', org: '南京鼓楼医院', department: '心内科', service: '远程心电AI诊断', developer: '南京数维康医疗科技有限公司', billingMethod: '按检查例次', usage: '1 例', unitPrice: '¥ 12.00/例', amount: '¥ 12.00', status: '处理中' },
  { id: 'c-004', time: '2024-07-15 10:28:51', caller: '孙十六', org: '南京鼓楼医院', department: '住院部', service: '电子病历辅助生成智能体', developer: '云知声智能科技股份有限公司', billingMethod: '按Token', usage: '8,400 词元', unitPrice: '¥ 0.004/千词元', amount: '¥ 0.03', status: '已扣费' },
  { id: 'c-005', time: '2024-07-15 10:25:33', caller: '李十三', org: '常州市人民医院', department: '医保办', service: '高值耗材智能比对智能体', developer: '常州健康医疗大数据运营有限公司', billingMethod: '按调用次数', usage: '3 次', unitPrice: '¥ 2.50/次', amount: '¥ 7.50', status: '异常', exception: '扣费失败：额度冻结中' },
  { id: 'c-006', time: '2024-07-15 10:22:18', caller: '周八', org: '东南大学附属中大医院', department: '信息科', service: 'BGE检索重排序模型', developer: '北京智源人工智能研究院BAAI', billingMethod: '按Token', usage: '42,000 词元', unitPrice: '¥ 0.001/千词元', amount: '¥ 0.04', status: '已扣费' },
  { id: 'c-007', time: '2024-07-15 10:18:44', caller: '前台导诊', org: '常州市人民医院', department: '门诊大厅', service: 'AI健康助手', developer: '常州市第二人民医院', billingMethod: '按Token', usage: '5,200 词元', unitPrice: '¥ 0.004/千词元', amount: '¥ 0.02', status: '已扣费' },
  { id: 'c-008', time: '2024-07-15 10:15:02', caller: '赵十四', org: '常州市人民医院', department: '医务科', service: '病历文书规范稽核智能体', developer: '常州市第二人民医院', billingMethod: '按调用次数', usage: '2 次', unitPrice: '¥ 1.80/次', amount: '¥ 3.60', status: '已扣费' },
  { id: 'c-009', time: '2024-07-15 09:58:11', caller: '张三', org: '常州市人民医院', department: '放射科', service: '肺结节CT图像辅助检测', developer: '北京汇医慧影医疗科技有限公司', billingMethod: '按检查例次', usage: '1 例', unitPrice: '¥ 18.50/例', amount: '¥ 18.50', status: '异常', exception: '重复调用：3 秒内同患者重复提交' },
  { id: 'c-010', time: '2024-07-15 09:42:33', caller: '王十二', org: '常州市第二人民医院', department: '门诊大厅', service: 'AI健康助手', developer: '常州市第二人民医院', billingMethod: '按Token', usage: '3,800 词元', unitPrice: '¥ 0.004/千词元', amount: '¥ 0.02', status: '已扣费' },
  { id: 'c-011', time: '2024-07-15 09:32:08', caller: '吴九', org: '常州市第二人民医院', department: '住院部', service: '电子病历辅助生成智能体', developer: '云知声智能科技股份有限公司', billingMethod: '按Token', usage: '6,200 词元', unitPrice: '¥ 0.004/千词元', amount: '¥ 0.03', status: '已扣费' },
  { id: 'c-012', time: '2024-07-15 09:28:42', caller: '周十七', org: '南京鼓楼医院', department: '心内科', service: '远程心电AI诊断', developer: '南京数维康医疗科技有限公司', billingMethod: '按检查例次', usage: '1 例', unitPrice: '¥ 12.00/例', amount: '¥ 12.00', status: '已扣费' },
];

// 兼容旧引用
export const callDetails = callRecords;
export type CallDetail = CallRecord;

// ===================== 月度账单（运营端 + 开发者端共用） =====================
export type MonthlyBill = {
  id: string;
  period: string;
  org: string;
  service: string;
  developer: string;
  billingMethod: string;
  calls: string;
  tokens: string;
  gross: string;
  share: string; // AI厂商分成 = gross × 70%
  status: '待确认' | '已确认' | '已结算' | '异常';
};

export const monthlyBills: MonthlyBill[] = [
  // 2024-07
  { id: 'mb-001', period: '2024-07', org: '常州市人民医院', service: '肺结节CT图像辅助检测', developer: '北京汇医慧影医疗科技有限公司', billingMethod: '按检查例次', calls: '2,180 例', tokens: '-', gross: '¥ 40,330', share: '¥ 28,231', status: '待确认' },
  { id: 'mb-002', period: '2024-07', org: '常州市人民医院', service: 'AI健康助手', developer: '常州市第二人民医院', billingMethod: '按Token', calls: '12,420 次', tokens: '8,420万词元', gross: '¥ 33,680', share: '¥ 23,576', status: '待确认' },
  { id: 'mb-003', period: '2024-07', org: '南京鼓楼医院', service: '远程心电AI诊断', developer: '南京数维康医疗科技有限公司', billingMethod: '按检查例次', calls: '4,280 例', tokens: '-', gross: '¥ 51,360', share: '¥ 35,952', status: '已确认' },
  { id: 'mb-004', period: '2024-07', org: '南京鼓楼医院', service: '电子病历辅助生成智能体', developer: '云知声智能科技股份有限公司', billingMethod: '按Token', calls: '8,640 次', tokens: '4,180万词元', gross: '¥ 16,720', share: '¥ 11,704', status: '已确认' },
  { id: 'mb-005', period: '2024-07', org: '常州市第二人民医院', service: '病历文书规范稽核智能体', developer: '常州市第二人民医院', billingMethod: '按调用次数', calls: '6,580 次', tokens: '-', gross: '¥ 11,844', share: '¥ 8,291', status: '已确认' },
  // 2024-06
  { id: 'mb-006', period: '2024-06', org: '常州市人民医院', service: '肺结节CT图像辅助检测', developer: '北京汇医慧影医疗科技有限公司', billingMethod: '按检查例次', calls: '2,420 例', tokens: '-', gross: '¥ 44,770', share: '¥ 31,339', status: '已结算' },
  { id: 'mb-007', period: '2024-06', org: '常州市人民医院', service: 'AI健康助手', developer: '常州市第二人民医院', billingMethod: '按Token', calls: '10,800 次', tokens: '7,200万词元', gross: '¥ 28,800', share: '¥ 20,160', status: '已结算' },
  { id: 'mb-008', period: '2024-06', org: '南京鼓楼医院', service: '远程心电AI诊断', developer: '南京数维康医疗科技有限公司', billingMethod: '按检查例次', calls: '4,120 例', tokens: '-', gross: '¥ 49,440', share: '¥ 34,608', status: '已结算' },
  { id: 'mb-009', period: '2024-06', org: '常州市第二人民医院', service: '病历文书规范稽核智能体', developer: '常州市第二人民医院', billingMethod: '按调用次数', calls: '6,180 次', tokens: '-', gross: '¥ 11,124', share: '¥ 7,787', status: '异常' },
];

// ===================== 分成规则（统一 70/15/10/5） =====================
export type ShareDistribution = {
  share: string;
  ratio: number;
  description: string;
};

export const shareDistributions: ShareDistribution[] = [
  { share: 'AI厂商收益分成', ratio: 70, description: '服务提供方收益分成，按服务归属分配' },
  { share: '医保结算分润', ratio: 15, description: '医保基金承担的调用成本分摊' },
  { share: '平台运营服务费', ratio: 10, description: '平台运营与基础设施服务' },
  { share: '平台运维费', ratio: 5, description: '日常运维与技术支持' },
];

// ===================== 账单汇总 =====================
export type BillSummary = {
  monthAmount: string;
  confirmed: string;
  pending: string;
  exception: string;
};

// 2024-07 汇总：gross 153,934 = 40,330 + 33,680 + 51,360 + 16,720 + 11,844
// 已确认 79,924 = 51,360 + 16,720 + 11,844
// 待确认 74,010 = 40,330 + 33,680
export const billSummary: BillSummary = {
  monthAmount: '¥ 153,934.00',
  confirmed: '¥ 79,924.00',
  pending: '¥ 74,010.00',
  exception: '¥ 0.00',
};

// ===================== 总账统计（跨周期累计） =====================
// 累计金额 = 各月 bill gross 之和
// 2024-06: 44,770 + 28,800 + 49,440 + 11,124 = 134,134
// 2024-07: 40,330 + 33,680 + 51,360 + 16,720 + 11,844 = 153,934
// 累计 288,068 = 134,134 + 153,934（含历史估算）
export const totalBillSummary = {
  totalAmount: '¥ 288,068.00',
  settledAmount: '¥ 123,010.00',
  confirmedAmount: '¥ 79,924.00',
  pendingAmount: '¥ 74,010.00',
  exceptionAmount: '¥ 11,124.00',
  completionRate: '70.4%',
  totalCalls: '54,840 次',
  totalTokens: '6,200万 词元',
};

export const monthlyBillTrend = [
  { month: '2024-01', value: 38200 },
  { month: '2024-02', value: 42500 },
  { month: '2024-03', value: 46800 },
  { month: '2024-04', value: 51200 },
  { month: '2024-05', value: 48600 },
  { month: '2024-06', value: 134134 },
  { month: '2024-07', value: 153934 },
];

// ===================== 异常对账 =====================
export type ExceptionType = {
  type: string;
  count: number;
  level: 'high' | 'medium' | 'low';
};

export const exceptionTypes: ExceptionType[] = [
  { type: '重复调用', count: 8, level: 'medium' },
  { type: '异常高频', count: 3, level: 'high' },
  { type: '超授权调用', count: 2, level: 'high' },
  { type: '失败扣费', count: 4, level: 'medium' },
  { type: '跨机构异常', count: 1, level: 'low' },
];

export type ExceptionRecord = {
  id: string;
  type: string;
  service: string;
  org: string;
  time: string;
  description: string;
  status: '识别' | '核验中' | '已确认' | '已申诉';
  handler?: string;
  appealReason?: string;
};

export const exceptionRecords: ExceptionRecord[] = [
  { id: 'e-001', type: '异常高频', service: '高值耗材智能比对智能体', org: '常州市人民医院', time: '2024-07-15 10:25:33', description: '单日调用 158 次，超出该机构历史均值 320%', status: '核验中', handler: '李四' },
  { id: 'e-002', type: '重复调用', service: '肺结节CT图像辅助检测', org: '常州市人民医院', time: '2024-07-15 09:58:11', description: '同患者 3 秒内重复提交 2 次，疑似系统异常', status: '已确认', handler: '李工' },
  { id: 'e-003', type: '超授权调用', service: '山海知医5.0大模型', org: '南京鼓楼医院', time: '2024-07-14 16:42:08', description: '科研账号调用临床业务接口，超出授权范围', status: '已确认', handler: '李四' },
  { id: 'e-004', type: '失败扣费', service: '电子病历辅助生成智能体', org: '南京鼓楼医院', time: '2024-07-14 14:18:22', description: '额度冻结状态下扣费失败，待人工核验', status: '核验中', handler: '王工' },
  { id: 'e-005', type: '跨机构异常', service: '远程心电AI诊断', org: '南京鼓楼医院', time: '2024-07-13 11:20:48', description: '心电数据上传 IP 跨城市，疑似异常接入', status: '已申诉', handler: '李四' },
  { id: 'e-006', type: '重复调用', service: '病历文书规范稽核智能体', org: '常州市人民医院', time: '2024-07-12 15:32:11', description: '同一病历 30 秒内被提交 3 次', status: '识别' },
  { id: 'e-007', type: '异常高频', service: 'AI健康助手', org: '常州市人民医院', time: '2024-07-12 09:18:32', description: '凌晨 2-4 点异常高频调用', status: '识别' },
  { id: 'e-008', type: '失败扣费', service: 'BGE检索重排序模型', org: '东南大学附属中大医院', time: '2024-07-11 17:42:08', description: '并发超限导致扣费失败', status: '已确认', handler: '李工' },
];

// ===================== 导出记录 =====================
export type ExportHistory = {
  id: string;
  dimension: string;
  period: string;
  format: string;
  email: string;
  status: '已完成' | '处理中' | '失败';
  createdAt: string;
  fileSize: string;
};

export const exportHistories: ExportHistory[] = [
  { id: 'exp-001', dimension: '按机构', period: '2024-06', format: 'Excel', email: 'finance@jsyb-ai.cn', status: '已完成', createdAt: '2024-07-05 14:20', fileSize: '2.4 MB' },
  { id: 'exp-002', dimension: '按服务', period: '2024-Q2', format: 'Excel', email: 'operation@jsyb-ai.cn', status: '已完成', createdAt: '2024-07-03 10:18', fileSize: '5.8 MB' },
  { id: 'exp-003', dimension: '按明细', period: '2024-07', format: 'CSV', email: 'audit@jsyb-ai.cn', status: '处理中', createdAt: '2024-07-15 09:32', fileSize: '-' },
  { id: 'exp-004', dimension: '按项目', period: '2024-06', format: 'PDF', email: 'leader@jsyb-ai.cn', status: '已完成', createdAt: '2024-07-08 11:25', fileSize: '1.2 MB' },
  { id: 'exp-005', dimension: '按机构', period: '2024-05', format: 'Excel', email: 'finance@jsyb-ai.cn', status: '失败', createdAt: '2024-06-08 09:15', fileSize: '-' },
];

export const exportDimensions = [
  { label: '按机构', value: 'org', description: '按接入机构汇总对账明细' },
  { label: '按服务', value: 'service', description: '按上架服务汇总对账明细' },
  { label: '按项目', value: 'project', description: '按业务项目（科室/病种）汇总对账明细' },
  { label: '按明细', value: 'detail', description: '导出全部调用明细记录' },
];

export const exportFormats = ['Excel', 'CSV', 'PDF'];

// ===================== 月度收益趋势（开发者端） =====================
export const monthlyRevenue = [
  { month: '2024-01', value: 31200 },
  { month: '2024-02', value: 35800 },
  { month: '2024-03', value: 42100 },
  { month: '2024-04', value: 48600 },
  { month: '2024-05', value: 52300 },
  { month: '2024-06', value: 27947 },
  { month: '2024-07', value: 31867 },
];
