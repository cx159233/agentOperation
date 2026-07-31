import type {
  AccessReviewLevel,
  AuthRole,
  BillingRule,
  CapabilityCardData,
  CapabilityGroup,
  FilterOption,
  HistoryBill,
  KpiCardData,
  MonthlyTrendPoint,
  OperationMetric,
  OperationModule,
  OwnedPackage,
  QuotaAccount,
  RealtimeBill,
  RecommendationRankItem,
  ResourceCardData,
  RoleSidebarMenu,
  ServiceCategory,
  TokenPackage,
  UsageShareItem,
  WarningRecord,
} from '../types';

// ============================ 角色感知侧边栏菜单 ============================
export const roleSidebarMenus: Record<AuthRole, RoleSidebarMenu[]> = {
  org: [
    {
      label: '概览',
      path: '/org-workbench',
      icon: 'dashboard',
      children: [
        { label: '工作台', path: '/org-workbench', icon: 'dashboard' },
      ],
    },
    {
      label: '服务管理',
      path: '/org-workbench/subscriptions',
      icon: 'service',
      children: [
        { label: '模型广场', path: '/org-workbench/model-plaza', icon: 'service' },
        { label: '服务订阅', path: '/org-workbench/subscriptions', icon: 'table' },
        { label: '配额管理', path: '/org-workbench/quota', icon: 'setting' },
      ],
    },
    {
      label: '词元经济管理',
      path: '/org-workbench/bills',
      icon: 'wallet',
      children: [
        { label: '账单管理', path: '/org-workbench/bills', icon: 'reconciliation' },
        { label: '用量明细', path: '/org-workbench/billing/detail', icon: 'database' },
      ],
    },
    {
      label: '账户管理',
      path: '/org-workbench/members',
      icon: 'user',
      children: [
        { label: '机构子账户', path: '/org-workbench/members', icon: 'user' },
      ],
    },
  ],
  developer: [
    {
      label: '概览',
      path: '/developer-center',
      icon: 'dashboard',
      children: [
        { label: '工作台', path: '/developer-center', icon: 'dashboard' },
      ],
    },
    {
      label: '服务管理',
      path: '/developer-center/listing',
      icon: 'service',
      children: [
        { label: '服务上架', path: '/developer-center/listing', icon: 'form' },
        { label: '服务整改', path: '/developer-center/testing', icon: 'developer' },
      ],
    },
    {
      label: '结算中心',
      path: '/developer-center/revenue',
      icon: 'wallet',
      children: [
        { label: '账单管理', path: '/developer-center/revenue', icon: 'reconciliation' },
        { label: '用量明细', path: '/developer-center/billing/detail', icon: 'database' },
      ],
    },
  ],
  admin: [
    { label: '工作台', path: '/admin/workbench', icon: 'dashboard' },
    {
      label: '服务目录管理',
      path: '/admin/model-catalog',
      icon: 'service',
      children: [
        { label: '模型资源', path: '/admin/model-catalog' },
      ],
    },
    {
      label: '资产统筹管理',
      path: '/admin/resource/data',
      icon: 'fund',
      children: [
        { label: '数据资源', path: '/admin/resource/data' },
        { label: '知识体系', path: '/admin/resource/knowledge' },
        { label: '平台工具', path: '/admin/resource/tools' },
      ],
    },
    {
      label: '资产审核管理',
      path: '/admin/operations/service-access',
      icon: 'control',
      children: [
        { label: '服务上架审核', path: '/admin/operations/service-access' },
        { label: '机构入驻审核', path: '/admin/operations/org-access' },
        { label: '服务订阅审核', path: '/admin/operations/subscription-audit' },
      ],
    },
    {
      label: '词元经济管理',
      path: '/admin/billing',
      icon: 'reconciliation',
      children: [
        { label: '词元计费配置', path: '/admin/billing' },
        { label: '用量明细查询', path: '/admin/reconciliation/calls' },
        { label: '周期账单管理', path: '/admin/reconciliation/bills' },
        { label: '异常对账管理', path: '/admin/reconciliation/exceptions' },
      ],
    },
    {
      label: '服务运行监管',
      path: '/admin/operations/quality',
      icon: 'monitor',
      children: [
        { label: '服务开通管理', path: '/admin/operations/service-provisioning' },
        { label: '质量评价管理', path: '/admin/operations/quality' },
        { label: '运行成效分析', path: '/admin/ops-analytics' },
      ],
    },
    { label: '安全审计中心', path: '/admin/operations/audit/operation', icon: 'audit', children: [
      { label: '调用日志', path: '/admin/operations/monitoring' },
      { label: '操作日志', path: '/admin/operations/audit/operation' },
      { label: '登录日志', path: '/admin/operations/audit/login' },
    ]},
    {
      label: '机构协同管理',
      path: '/admin/org-mgmt',
      icon: 'org',
      children: [
        { label: '机构列表', path: '/admin/org-mgmt' },
        { label: '用户列表', path: '/admin/org-users' },
      ],
    },
    {
      label: '系统管理',
      path: '/admin/settings',
      icon: 'setting',
      children: [
        { label: '审核配置', path: '/admin/settings/audit' },
        { label: '字典管理', path: '/admin/settings' },
      ],
    },
  ],
};

// 兼容旧引用（已废弃，新代码请使用 roleSidebarMenus）
export const sidebarMenus: RoleSidebarMenu[] = roleSidebarMenus.admin;

// ============================ 能力分类（CX标红） ============================
export const serviceCategories: { id: ServiceCategory; label: string; description: string; color: string }[] = [
  { id: '通用基础大模型', label: '通用基础大模型', description: '通用对话/嵌入/重排等基础模型，按Token计量', color: '#165DFF' },
  { id: '医保自研专属大模型', label: '医保自研专属大模型', description: '医保场景定制训练的自研模型', color: '#13B8C6' },
  { id: '医保基金监管共建模型', label: '医保基金监管共建模型', description: '面向基金监管/合规审查场景的共建模型', color: '#7C3AED' },
  { id: '省头部医疗机构共建垂直模型', label: '省头部医疗机构共建垂直模型', description: '医院共建的专科/病种垂直模型', color: '#10B981' },
  { id: '市场化合规生态AI产品', label: '市场化合规生态AI产品', description: '市场化合规AI产品，备案即可上架', color: '#F59E0B' },
];

export const subCategories: string[] = ['全部', ...serviceCategories.map((c) => c.label)];

// ============================ 筛选器 ============================
export const filters: FilterOption[] = [
  { label: '能力分类', defaultValue: '全部', options: subCategories },
  { label: '产品品类', defaultValue: '全部', options: ['全部', '大模型接口', '单病种筛查', '多病种一扫多查', '智能体应用'] },
  { label: '应用场景', defaultValue: '全部', options: ['全部', '医保监管', '基金管理', '临床辅助', '疾病筛查', '电子病历', '检查检验', '高值耗材', '智能导诊', '病历质控'] },
  { label: '风险等级', defaultValue: '全部', options: ['全部', '高风险', '中风险', '低风险'] },
  { label: '资源类别', defaultValue: '全部', options: ['全部', '医疗器械证', '网信备案', '科研专用'] },
];

// ============================ AI服务市场 - 能力卡片（按能力分类） ============================
export const capabilityGroups: CapabilityGroup[] = [
  {
    id: 'general-base-models',
    title: '通用基础大模型',
    badge: '通用基础',
    summary: '通用对话/嵌入/重排等基础模型，按Token计量',
    columns: [
      {
        title: '',
        items: [
          { id: 'deepseek-v4', title: 'Deepseek标准对话模型（V4）', unit: '深度求索（北京）科技有限公司', description: '基于Deepseek自研的新一代大语言模型，支持多轮对话和复杂推理任务', tags: ['大模型接口'], category: '通用基础大模型', riskLevel: '低风险', billingMethod: '按Token', iconType: 'brain', iconTone: 'blue', status: '已上线使用', entryUrl: 'https://app.jsyb-ai.cn/deepseek-v4' },
          { id: 'qwen-multimodal', title: 'Qwen全模态融合模型', unit: '阿里巴巴通义实验室', description: '支持文本、图像、音频等多模态输入，具备强大的跨模态理解能力', tags: ['大模型接口'], category: '通用基础大模型', riskLevel: '低风险', billingMethod: '按Token', iconType: 'brain', iconTone: 'blue', status: '已上线使用', entryUrl: 'https://app.jsyb-ai.cn/qwen-multimodal' },
          { id: 'bge-rerank', title: 'BGE检索重排序模型', unit: '北京智源人工智能研究院BAAI', description: '用于提升检索结果的排序质量，显著增强信息检索的准确性', tags: ['大模型接口'], category: '通用基础大模型', riskLevel: '低风险', billingMethod: '按Token', iconType: 'brain', iconTone: 'blue', status: '已上线使用', entryUrl: 'https://app.jsyb-ai.cn/bge-rerank' },
          { id: 'bge-embedding', title: 'BGE语义嵌入模型', unit: '北京智源人工智能研究院BAAI', description: '将文本转化为高维向量表示，支持语义相似度计算和文本检索', tags: ['大模型接口'], category: '通用基础大模型', riskLevel: '低风险', billingMethod: '按Token', iconType: 'brain', iconTone: 'blue', status: '已上线使用', entryUrl: 'https://app.jsyb-ai.cn/bge-embedding' },
        ],
      },
    ],
  },
  {
    id: 'medical-self-models',
    title: '医保自研专属大模型',
    badge: '医保自研',
    summary: '医保场景定制训练的自研模型',
    columns: [
      {
        title: '',
        items: [
          { id: 'shanzhiyi-5.0', title: '山海知医5.0大模型', unit: '云知声智能科技股份有限公司', description: '专为医保场景定制的大语言模型，具备电子病历理解和多模态融合能力', tags: ['电子病历', '多模态融合'], category: '医保自研专属大模型', riskLevel: '中风险', billingMethod: '按Token', iconType: 'brain', iconTone: 'cyan', status: '已上线使用', entryUrl: 'https://app.jsyb-ai.cn/shanzhiyi-5' },
          { id: 'zhongzheng-medical-model', title: '重症医擎大模型', unit: '东南大学附属中大医院', description: '面向重症医学场景的AI辅助诊断模型，支持多模态数据融合分析', tags: ['临床辅助', '多模态融合'], category: '医保自研专属大模型', riskLevel: '中风险', billingMethod: '按Token', iconType: 'brain', iconTone: 'cyan', status: '对接测试中', entryUrl: 'https://app.jsyb-ai.cn/zhongzheng-icu' },
          { id: 'radiology-report-model', title: '影像报告辅助生成大模型', unit: '南京鼓楼医院', description: '基于医学影像数据训练的报告自动生成模型，提升影像诊断效率', tags: ['多模态融合'], category: '医保自研专属大模型', riskLevel: '中风险', billingMethod: '按Token', iconType: 'brain', iconTone: 'cyan', status: '对接测试中', entryUrl: 'https://app.jsyb-ai.cn/radiology-report' },
        ],
      },
    ],
  },
  {
    id: 'fund-supervision-models',
    title: '医保基金监管共建模型',
    badge: '基金监管',
    summary: '面向基金监管/合规审查场景的共建模型',
    columns: [
      {
        title: '',
        items: [
          { id: 'consumable-compare-agent', title: '高值耗材智能比对智能体', unit: '常州健康医疗大数据运营有限公司', description: '用于高值耗材使用的智能比对分析，识别异常使用模式，辅助医保基金监管', tags: ['医保监管', '高值耗材'], category: '医保基金监管共建模型', riskLevel: '中风险', billingMethod: '按调用次数', iconType: 'robot', iconTone: 'purple', status: '对接测试中', entryUrl: 'https://app.jsyb-ai.cn/consumable-compare' },
          { id: 'exam-compare-agent', title: '检查检验智能比对智能体', unit: '常州健康医疗大数据运营有限公司', description: '对检查检验项目进行智能比对，发现不合理检查行为，提升医保基金使用效率', tags: ['医保监管', '检查检验'], category: '医保基金监管共建模型', riskLevel: '中风险', billingMethod: '按调用次数', iconType: 'robot', iconTone: 'purple', status: '对接测试中', entryUrl: 'https://app.jsyb-ai.cn/exam-compare' },
          { id: 'prescription-review', title: '电子处方智能合规审查', unit: '云知声智能科技股份有限公司', description: '自动审查电子处方的合规性，识别不合理用药和超范围诊疗行为', tags: ['病例质控', '医保合规'], category: '医保基金监管共建模型', riskLevel: '中风险', billingMethod: '按调用次数', iconType: 'robot', iconTone: 'purple', status: '对接测试中', entryUrl: 'https://app.jsyb-ai.cn/prescription-review' },
        ],
      },
    ],
  },
  {
    id: 'hospital-cobuilt-models',
    title: '省头部医疗机构共建垂直模型',
    badge: '医院共建',
    summary: '医院共建的专科/病种垂直模型',
    columns: [
      {
        title: '',
        items: [
          { id: 'neonatal-retina-screening', title: '多示例学习的新生儿眼底病变智能筛查', unit: '江苏省人民医院，南京理工大学', description: '基于多示例学习的新生儿眼底病变智能筛查系统，提高早期筛查准确率', tags: ['单病种筛查', '多模态融合'], category: '省头部医疗机构共建垂直模型', riskLevel: '高风险', billingMethod: '按检查例次', iconType: 'scan', iconTone: 'green', status: '对接上线中', entryUrl: 'https://app.jsyb-ai.cn/neonatal-retina' },
          { id: 'dayi-zhuying', title: '达医智影', unit: '阿里巴巴达摩院', description: '支持多病种同时筛查的AI影像分析系统，具备多模态数据融合能力', tags: ['多病种一扫多查', '多模态'], category: '省头部医疗机构共建垂直模型', riskLevel: '高风险', billingMethod: '按检查例次', iconType: 'scan', iconTone: 'green', status: '对接测试中', entryUrl: 'https://app.jsyb-ai.cn/dayi-zhuying' },
          { id: 'lungcancer-screening', title: '肺癌AI筛查', unit: '零氪科技（北京）有限公司', description: '基于CT影像的肺癌早期筛查模型，辅助医生进行精准诊断', tags: ['单病种筛查', '医疗器械证'], category: '省头部医疗机构共建垂直模型', riskLevel: '高风险', billingMethod: '按检查例次', iconType: 'scan', iconTone: 'green', status: '已上线使用', entryUrl: 'https://app.jsyb-ai.cn/lungcancer-screening' },
          { id: 'ecg-diagnosis', title: '远程心电AI诊断', unit: '南京数维康医疗科技有限公司', description: '支持远程心电诊断的AI辅助系统，提升基层医疗机构心电诊断能力', tags: ['临床辅助', '医疗器械证'], category: '省头部医疗机构共建垂直模型', riskLevel: '中风险', billingMethod: '按检查例次', iconType: 'scan', iconTone: 'green', status: '已上线使用', entryUrl: 'https://app.jsyb-ai.cn/ecg-diagnosis' },
          { id: 'lungnodule-ct', title: '肺结节CT图像辅助检测', unit: '北京汇医慧影医疗科技有限公司', description: '自动检测CT图像中的肺结节，辅助医生进行早期诊断', tags: ['临床辅助', '医疗器械证'], category: '省头部医疗机构共建垂直模型', riskLevel: '高风险', billingMethod: '按检查例次', iconType: 'scan', iconTone: 'green', status: '已上线使用', entryUrl: 'https://app.jsyb-ai.cn/lungnodule-ct' },
          { id: 'bonedensity-ct', title: '骨密度CT影像辅助', unit: '北京汇医慧影医疗科技有限公司', description: '基于CT影像的骨密度测量辅助模型，支持骨质疏松症筛查', tags: ['临床辅助', '医疗器械证'], category: '省头部医疗机构共建垂直模型', riskLevel: '中风险', billingMethod: '按检查例次', iconType: 'scan', iconTone: 'green', status: '已上线使用', entryUrl: 'https://app.jsyb-ai.cn/bonedensity-ct' },
          { id: 'xiaoganren-liver', title: '小肝人肝癌模型', unit: '东南大学附属中大医院', description: '面向肝癌早期筛查的AI辅助诊断模型，支持临床科研应用', tags: ['临床辅助', '科研专用'], category: '省头部医疗机构共建垂直模型', riskLevel: '高风险', billingMethod: '按检查例次', iconType: 'scan', iconTone: 'green', status: '对接测试中', entryUrl: 'https://app.jsyb-ai.cn/xiaoganren-liver' },
          { id: 'pancreas-puncture', title: '胰腺穿刺现场病理模型', unit: '南京鼓楼医院', description: '胰腺穿刺术中病理诊断辅助模型，支持实时病理分析', tags: ['临床辅助'], category: '省头部医疗机构共建垂直模型', riskLevel: '高风险', billingMethod: '按检查例次', iconType: 'scan', iconTone: 'green', status: '对接测试中', entryUrl: 'https://app.jsyb-ai.cn/pancreas-puncture' },
          { id: 'scoliosis-screening', title: '脊柱侧凸的无辐射筛查模型', unit: '南京鼓楼医院', description: '采用无辐射成像技术的脊柱侧凸筛查模型，适用于青少年群体', tags: ['临床辅助', '单病种筛查'], category: '省头部医疗机构共建垂直模型', riskLevel: '中风险', billingMethod: '按检查例次', iconType: 'scan', iconTone: 'green', status: '对接测试中', entryUrl: 'https://app.jsyb-ai.cn/scoliosis-screening' },
          { id: 'renal-tumor-surgery-nav', title: '肾肿瘤微创手术人工智能实时导航预警', unit: '江苏省人民医院，东南大学', description: '肾肿瘤微创手术中的AI实时导航系统，支持数字孪生可视化', tags: ['手术辅助', '数字孪生'], category: '省头部医疗机构共建垂直模型', riskLevel: '高风险', billingMethod: '按调用次数', iconType: 'robot', iconTone: 'green', status: '对接上线中', entryUrl: 'https://app.jsyb-ai.cn/renal-tumor-nav' },
          { id: 'chronic-screening-agent', title: '慢病筛查防控智能体', unit: '江苏省人民医院，华为技术有限公司', description: '面向慢性疾病筛查和防控的智能体系统，支持多维度健康数据分析', tags: ['慢病管理', '临床辅助'], category: '省头部医疗机构共建垂直模型', riskLevel: '中风险', billingMethod: '按调用次数', iconType: 'robot', iconTone: 'green', status: '对接上线中', entryUrl: 'https://app.jsyb-ai.cn/chronic-screening' },
        ],
      },
    ],
  },
  {
    id: 'market-ecosystem',
    title: '市场化合规生态AI产品',
    badge: '市场化生态',
    summary: '市场化合规AI产品，备案即可上架',
    columns: [
      {
        title: '',
        items: [
          { id: 'emr-assist-agent', title: '电子病历辅助生成智能体', unit: '云知声智能科技股份有限公司', description: '自动辅助生成电子病历内容，支持模板导入和智能补全功能', tags: ['自动导入', '智能生成'], category: '市场化合规生态AI产品', riskLevel: '低风险', billingMethod: '按Token', iconType: 'robot', iconTone: 'orange', status: '对接测试中', entryUrl: 'https://app.jsyb-ai.cn/emr-assist' },
          { id: 'medical-history-push', title: '病史追溯推送总结', unit: '云知声智能科技股份有限公司', description: '跨院病史数据追溯和智能总结，辅助临床诊疗决策', tags: ['跨院数据', 'AI分析'], category: '市场化合规生态AI产品', riskLevel: '低风险', billingMethod: '按Token', iconType: 'robot', iconTone: 'orange', status: '对接测试中', entryUrl: 'https://app.jsyb-ai.cn/medical-history' },
          { id: 'emr-qc-agent', title: '病历文书规范稽核智能体', unit: '常州市第二人民医院', description: '对病历文书进行规范稽核，确保医疗文书质量符合要求', tags: ['电子病历', '科研专用'], category: '市场化合规生态AI产品', riskLevel: '低风险', billingMethod: '按调用次数', iconType: 'robot', iconTone: 'orange', status: '已上线使用', entryUrl: 'https://app.jsyb-ai.cn/emr-qc' },
          { id: 'ai-health-assistant', title: 'AI健康助手', unit: '常州市第二人民医院', description: '面向患者的AI健康咨询和导诊助手，提供智能健康服务', tags: ['智能生成', '智能导诊'], category: '市场化合规生态AI产品', riskLevel: '低风险', billingMethod: '按Token', iconType: 'robot', iconTone: 'orange', status: '已上线使用', entryUrl: 'https://app.jsyb-ai.cn/ai-health' },
          { id: 'fully-structured-emr', title: '全结构化电子病历', unit: '常州市第二人民医院', description: '将非结构化病历数据转化为全结构化格式，便于数据分析和利用', tags: ['智能生成', '病历生成'], category: '市场化合规生态AI产品', riskLevel: '低风险', billingMethod: '按Token', iconType: 'robot', iconTone: 'orange', status: '已上线使用', entryUrl: 'https://app.jsyb-ai.cn/structured-emr' },
          { id: 'emr-assist-agent-cz', title: '电子病历辅助生成智能体', unit: '常州市第二人民医院', description: '本地化部署的电子病历辅助生成系统，支持院内业务流程', tags: ['智能生成', '病历生成'], category: '市场化合规生态AI产品', riskLevel: '低风险', billingMethod: '按Token', iconType: 'robot', iconTone: 'orange', status: '已上线使用', entryUrl: 'https://app.jsyb-ai.cn/emr-assist-cz' },
          { id: 'outpatient-order-agent', title: '门诊特殊病人医嘱辅助判断智能体', unit: '南京鼓楼医院', description: '针对门诊特殊病人的医嘱辅助判断系统，提高用药安全性', tags: ['临床辅助'], category: '市场化合规生态AI产品', riskLevel: '中风险', billingMethod: '按调用次数', iconType: 'robot', iconTone: 'orange', status: '对接测试中', entryUrl: 'https://app.jsyb-ai.cn/outpatient-order' },
          { id: 'infection-assist-agent', title: '感染辅助判断智能体', unit: '南京鼓楼医院', description: '辅助医生进行感染性疾病的诊断和治疗方案选择', tags: ['临床辅助'], category: '市场化合规生态AI产品', riskLevel: '中风险', billingMethod: '按调用次数', iconType: 'robot', iconTone: 'orange', status: '对接测试中', entryUrl: 'https://app.jsyb-ai.cn/infection-assist' },
        ],
      },
    ],
  },
];

// ============================ 词元计费配置 ============================
export const billingTabs = ['计费总览', '计费规则配置', '额度管控配置', '词元包管理'];

export const kpiCards: KpiCardData[] = [
  { label: '当前词元总余量', value: '1,258,560,000', unit: '词元', tone: 'stack' },
  { label: '本月已消耗量', value: '342,560,000', unit: '词元', tone: 'pie' },
  { label: '环比变化', value: '+12.56%', unit: '较上月', tone: 'trend' },
  { label: '可用服务数量', value: '256', unit: '个', tone: 'apps' },
];

export const monthlyTrend: MonthlyTrendPoint[] = [
  { month: '1月', tokens: 200, services: 18 },
  { month: '2月', tokens: 320, services: 20 },
  { month: '3月', tokens: 290, services: 24 },
  { month: '4月', tokens: 405, services: 25 },
  { month: '5月', tokens: 380, services: 27 },
  { month: '6月', tokens: 445, services: 29 },
  { month: '7月', tokens: 430, services: 31 },
  { month: '8月', tokens: 520, services: 33 },
  { month: '9月', tokens: 605, services: 36 },
  { month: '10月', tokens: 520, services: 38 },
  { month: '11月', tokens: 480, services: 40 },
  { month: '12月', tokens: 580, services: 42 },
];

export const usageShare: UsageShareItem[] = [
  { name: '医保多模态大模型', value: 28.6, color: '#165DFF' },
  { name: '髋关节CT早筛模型', value: 18.7, color: '#13B8C6' },
  { name: '医保智能审方助手', value: 14.3, color: '#7C3AED' },
  { name: '商汤医疗大模型', value: 12.5, color: '#10B981' },
  { name: '联影肺炎CT模型', value: 9.8, color: '#F59E0B' },
  { name: '其他服务', value: 16.1, color: '#94A3B8' },
];

export const warningRecords: WarningRecord[] = [
  { id: 'warn-001', service: '余额低于40%', level: '中', message: '触发中等预警', time: '2024-05-20 10:30' },
  { id: 'warn-002', service: '余额低于50%', level: '低', message: '触发低级预警', time: '2024-05-15 09:15' },
];

/** 计费规则（CX标红 - 差异化计费三方面） */
export const billingRules: BillingRule[] = [
  {
    dimension: '分品类差异化计量',
    description: '按服务类型实行差异化计量口径',
    examples: ['大模型按Token', '影像筛查按检查例次', '智能体按调用次数', '知识检索按检索次数'],
  },
  {
    dimension: '多主体灵活付费',
    description: '按应用主体实行差异化付费方式',
    examples: ['套餐预购', '财政统购', '专项经费', '医保补贴', '科研公益免费'],
  },
  {
    dimension: '多方分润闭环',
    description: '医保、运营主体、AI厂商收益清算分成',
    examples: ['医保结算分润', '运营服务费', 'AI厂商收益分成', '平台运维费'],
  },
];

export const tokenPackages: TokenPackage[] = [
  { name: '普惠包', amount: '5,000万 词元', discount: '9.8折', scope: '基层医疗机构、单点试用', price: '¥ 48,000' },
  { name: '标准包', amount: '2亿 词元', discount: '9.2折', scope: '区县医保部门、医院科室', price: '¥ 180,000', featured: true },
  { name: '医联体包', amount: '8亿 词元', discount: '8.5折', scope: '医联体、专科联盟、多机构协同', price: '¥ 680,000' },
  { name: '城市级包', amount: '30亿 词元', discount: '7.8折', scope: '设区市医保局、区域平台', price: '¥ 2,380,000' },
];

export const ownedPackages: OwnedPackage[] = [
  { name: '标准包 2024-Q2', validUntil: '2024-08-31', remaining: '1.26亿 词元', status: '正常' },
  { name: '普惠包 试点补充包', validUntil: '2024-06-15', remaining: '860万 词元', status: '即将到期' },
  { name: '科研专项包', validUntil: '2024-12-31', remaining: '394万 词元', status: '额度紧张' },
];

export interface PurchaseRecord {
  orgName: string;
  packageName: string;
  buyTime: string;
  price: string;
  remaining: string;
  status: string;
}

export const purchaseRecords: PurchaseRecord[] = [
  { orgName: '常州市人民医院', packageName: '标准包', buyTime: '2024-01-15', price: '¥ 180,000', remaining: '1.26亿 词元', status: '正常' },
  { orgName: '南京市第一医院', packageName: '医联体包', buyTime: '2024-02-20', price: '¥ 680,000', remaining: '4,200万 词元', status: '额度紧张' },
  { orgName: '苏州市医保局', packageName: '城市级包', buyTime: '2024-03-10', price: '¥ 2,380,000', remaining: '18.5亿 词元', status: '正常' },
  { orgName: '南通大学附属医院', packageName: '普惠包', buyTime: '2024-05-05', price: '¥ 48,000', remaining: '320万 词元', status: '即将到期' },
  { orgName: '东南大学附属中大医院', packageName: '标准包', buyTime: '2024-04-18', price: '¥ 180,000', remaining: '1.52亿 词元', status: '正常' },
  { orgName: '盐城市第一人民医院', packageName: '医联体包', buyTime: '2024-05-22', price: '¥ 680,000', remaining: '6.8亿 词元', status: '正常' },
];

export const realtimeBills: RealtimeBill[] = [
  { time: '10:32:18', operator: '医院管理-张**', organization: '常州市人民医院', service: '肺结节 CT 影像辅助检测软件', tokens: '42,800', status: '已扣费' },
  { time: '10:31:44', operator: '健康管理-李**', organization: '常州市妇女联合会', service: '宫颈细胞数字病理图像辅助诊断软件', tokens: '31,200', status: '已扣费' },
  { time: '10:30:02', operator: '行业企业-王**', organization: '江苏恒瑞医药股份有限公司', service: '真实世界研究大模型', tokens: '9,650', status: '处理中' },
  { time: '10:28:51', operator: '科研机构-赵**', organization: '江苏省医学科学研究院', service: '糖尿病视网膜病变眼底图像辅助诊断软件', tokens: '18,420', status: '已扣费' },
];

export const recommendationRanks: { hot: RecommendationRankItem[]; latest: RecommendationRankItem[] } = {
  hot: [
    { id: 'shanhaizhiyi-5', name: '山海知医5.0大模型', type: '模型', unit: '云知声智能科技股份有限公司', heat: '286k', trend: '+18%' },
    { id: 'deepseek-v4', name: 'Deepseek标准对话模型（V4）', type: '模型', unit: '深度求索（北京）科技有限公司', heat: '254k', trend: '+15%' },
    { id: 'lungnodule-ct', name: '肺结节CT图像辅助检测', type: '模型', unit: '北京汇医慧影医疗科技有限公司', heat: '231k', trend: '+12%' },
    { id: 'emr-quality-agent', name: '电子病历质控智能体', type: '智能体', unit: '常州市第二人民医院', heat: '219k', trend: '+9%' },
  ],
  latest: [
    { id: 'liver-cancer', name: '小肝人肝癌模型', type: '模型', unit: '东南大学附属中大医院', heat: '新上架', trend: 'NEW', date: '07-22' },
    { id: 'report-gen', name: '影像报告辅助生成大模型', type: '模型', unit: '南京鼓楼医院', heat: '新上架', trend: 'NEW', date: '07-21' },
    { id: 'retinal-screen', name: '多示例学习的新生儿眼底病变智能筛查', type: '模型', unit: '常州市第二人民医院', heat: '新上架', trend: 'NEW', date: '07-20' },
    { id: 'icu-ai', name: '重症医擎大模型', type: '模型', unit: '东南大学附属中大医院', heat: '新上架', trend: 'NEW', date: '07-19' },
  ],
};

export const historyBills: HistoryBill[] = [
  { period: '2024年05月', tokens: '342,560,000', cost: '¥ 315,155.20', status: '待确认' },
  { period: '2024年04月', tokens: '298,120,000', cost: '¥ 274,270.40', status: '已结算' },
  { period: '2024年03月', tokens: '286,900,000', cost: '¥ 263,948.00', status: '已结算' },
];

export const quotaAccounts: QuotaAccount[] = [
  { level: '机构总账户', name: '江苏省医保数据赋能实验室', quota: '12亿', used: '68.58%', alert: '20%' },
  { level: '部门子账户', name: '基金监管处', quota: '3.2亿', used: '71.20%', alert: '25%' },
  { level: '部门子账户', name: '健康筛查项目组', quota: '2.6亿', used: '54.90%', alert: '20%' },
  { level: '个人账户', name: '演示账号-张三', quota: '800万', used: '39.60%', alert: '15%' },
];

// ============================ 运营管理 ============================
export const operationMetrics: OperationMetric[] = [
  { label: '接入机构数', value: '128', unit: '家', tone: 'stack' },
  { label: '上架服务数', value: '256', unit: '项', tone: 'pie' },
  { label: '当日调用总量', value: '1,842,900', unit: '次', tone: 'trend' },
  { label: '活跃用户数', value: '3,672', unit: '人', tone: 'apps' },
];

/** 准入审核三级（CX标红） */
export const accessReviewLevels: AccessReviewLevel[] = [
  {
    level: '高风险',
    title: '高风险诊断类模型',
    process: ['资质核验', '技术测评', '临床验收'],
    description: '执行资质核验、技术测评、临床验收全流程，重点用于诊断类AI模型（如影像筛查、病理诊断）',
  },
  {
    level: '中风险',
    title: '中风险辅助类模型',
    process: ['资质核验', '简化技术测试'],
    description: '简化技术测试环节，适用于辅助类模型（如电子病历生成、医嘱辅助判断）',
  },
  {
    level: '低风险',
    title: '低风险查询类产品',
    process: ['备案上架'],
    description: '仅完成备案即可上架，适用于查询类/管理类AI产品（如智能导诊、健康助手）',
  },
];

/** 运营管理模块（覆盖5个核心环节） */
export const operationModules: OperationModule[] = [
  { title: '服务准入管理', description: '三级差异化审核流程，资质核验、技术测评、临床验收全流程留痕', items: ['待审核 12 项', '资质核验 8 项', '临床验收 5 项'], tone: 'primary' },
  { title: '上架下架管理', description: '服务上架、暂停、恢复和退出统一管理，资质到期/质量下降自动触发退出', items: ['在售 256 项', '暂停 3 项', '退出预警 2 项'], tone: 'cyan' },
  { title: '运行监测管理', description: '接入机构、上架服务、调用总量、活跃用户、调用趋势和异常预警实时监测', items: ['调用趋势正常', '异常预警 3 条', '热门服务 TOP10'], tone: 'success' },
  { title: '质量评价管理', description: '准确性、稳定性、响应时效、用户反馈、投诉情况和合规记录综合评价', items: ['准确率 96.8%', '平均时延 280ms', '满意度 98.1%'], tone: 'warning' },
  { title: '安全审计管理', description: '服务调用、权限变更、材料审核、额度调整、账单确认等关键行为留痕审计', items: ['今日日志 18,230 条', '异常操作 3 条', '加密存储已开启'], tone: 'danger' },
];

/** 运营分析模块（CX标红 - 新增） */
export const opsAnalyticsModules: OperationModule[] = [
  { title: '服务热度分析', description: '基于调用次数、覆盖机构、活跃用户、试用转化和词元消耗等指标，形成服务使用热度分析', items: ['最热服务 286k', '试用转化 32%', '推广优先级 TOP5'], tone: 'warning' },
  { title: '服务质量分析', description: '基于服务质量评价结果，对准确性、稳定性、响应时效、用户反馈和合规记录等指标综合分析', items: ['优质服务 18 项', '问题服务 5 项', '需整改 2 项'], tone: 'success' },
  { title: '场景应用分析', description: '医保监管、基金管理、临床辅助、疾病筛查、健康服务、科研支撑等领域AI应用热度和实际需求分析', items: ['临床辅助 38%', '医保监管 24%', '疾病筛查 18%'], tone: 'primary' },
];

// ============================ 服务详情 ============================
export const serviceDetailModules = {
  basic: ['基础信息', '资质信息', '试用场景'],
  model: ['基础信息', '资质信息', '试用场景'],
  agent: ['基础信息', '资质信息', '试用场景'],
};

// ============================ 资源管理 - 数据资源 ============================
export const dataResourceFilters: FilterOption[] = [
  { label: '数据大类', defaultValue: '全部', options: ['全部', '临床主题', '医保业务', '知识规则', '健康数据'] },
  { label: '影像模态', defaultValue: '全部', options: ['全部', 'CT', 'DR', 'MRI', '超声', '病理', '眼底', '无影像数据'] },
  { label: '非影像模态', defaultValue: '全部', options: ['全部', '结构化表单', '医保结算', '自由文本', '检验结果', '长时序数值'] },
  { label: '应用场景', defaultValue: '全部', options: ['全部', 'AI 模型训练', '临床科研', '医保控费', '病种筛查', 'DRG/DIP 分析'] },
  { label: '数据规模', defaultValue: '全部', options: ['全部', '十万级以下', '十万级', '百万级', '千万级', 'TB 级'] },
  { label: '覆盖周期', defaultValue: '全部', options: ['全部', '近一年', '近三年', '近五年', '历史全量'] },
];

export const dataResourceCards: ResourceCardData[] = [
  { id: 'dr-lung-cancer', title: '原发性肺癌主题数据资源', unit: '江苏省医保数据赋能实验室', tags: ['临床主题', 'CT', 'AI 模型训练'], iconType: 'lungs' },
  { id: 'dr-diabetes', title: '2 型糖尿病主题数据资源', unit: '江苏省医保数据赋能实验室', tags: ['临床主题', '眼底', '病种筛查'], iconType: 'eye' },
  { id: 'dr-stroke', title: '脑卒中主题数据资源', unit: '江苏省医保数据赋能实验室', tags: ['临床主题', 'MRI', '临床科研'], iconType: 'brain' },
  { id: 'dr-drg-ip', title: 'DRG/DIP 住院结算数据集', unit: '江苏省医保数据赋能实验室', tags: ['医保业务', '医保结算', 'DRG/DIP 分析'], iconType: 'document' },
  { id: 'dr-fund-case', title: '医保基金监管案例数据集', unit: '江苏省医保数据赋能实验室', tags: ['医保业务', '无影像数据', '医保控费'], iconType: 'file' },
  { id: 'dr-audit-rule', title: '医保智能审核规则数据集', unit: '江苏省医保数据赋能实验室', tags: ['知识规则', '结构化表单', '模型微调'], iconType: 'document' },
  { id: 'dr-lung-screen', title: '肺癌早筛参保人群数据集', unit: '江苏省医保数据赋能实验室', tags: ['健康数据', 'CT', '病种筛查'], iconType: 'lungs' },
  { id: 'dr-retina-screen', title: '糖网病变医保筛查数据集', unit: '江苏省医保数据赋能实验室', tags: ['健康数据', '眼底', '病种筛查'], iconType: 'eye' },
  { id: 'dr-chronic-opd', title: '门诊慢特病管理数据集', unit: '江苏省医保数据赋能实验室', tags: ['医保业务', '长时序数值', '健康管理'], iconType: 'stethoscope' },
];

// ============================ 资源管理 - 知识体系 ============================
export const knowledgeFilters: FilterOption[] = [
  { label: '政策法规类', defaultValue: '全部', options: ['全部', '医保支付政策', '医疗服务价格', '基金监管规则'] },
  { label: '医学知识类', defaultValue: '全部', options: ['全部', '术语编码标准', '临床诊疗规范'] },
  { label: '业务规则类', defaultValue: '全部', options: ['全部', '医保经办规程', '平台运营规则'] },
];

export const knowledgeCards: ResourceCardData[] = [
  { id: 'knowledge-payment', title: '医保支付政策细则库', unit: '江苏省医保数据赋能实验室', tags: ['政策法规类', '医保支付政策'], iconType: 'document' },
  { id: 'knowledge-price', title: '医疗服务价格规范库', unit: '江苏省医保数据赋能实验室', tags: ['政策法规类', '医疗服务价格'], iconType: 'document' },
  { id: 'knowledge-fund', title: '基金监管规则库', unit: '江苏省医保数据赋能实验室', tags: ['政策法规类', '基金监管规则'], iconType: 'file' },
  { id: 'knowledge-terminology', title: '医保版术语编码标准库', unit: '江苏省医保数据赋能实验室', tags: ['医学知识类', '术语编码标准'], iconType: 'brain' },
  { id: 'knowledge-clinical', title: '临床诊疗规范合集', unit: '江苏省医保数据赋能实验室', tags: ['医学知识类', '临床诊疗规范'], iconType: 'stethoscope' },
  { id: 'knowledge-process', title: '医保经办规程手册', unit: '江苏省医保数据赋能实验室', tags: ['业务规则类', '医保经办规程'], iconType: 'document' },
  { id: 'knowledge-operation', title: '平台运营管理规范', unit: '江苏省医保数据赋能实验室', tags: ['业务规则类', '平台运营规则'], iconType: 'robot' },
];

// ============================ 资源管理 - 平台工具 ============================
export const toolFilters: FilterOption[] = [
  { label: '数据治理工具', defaultValue: '全部', options: ['全部', '医学影像脱敏工具', '病历文本清洗工具', '数据标注工具', '数据标准化工具'] },
  { label: '模型研发工具', defaultValue: '全部', options: ['全部', '大模型轻量化微调框架', '算力调度工具', '模型压缩工具', '联邦学习训练工具'] },
  { label: '能力扩展工具', defaultValue: '全部', options: ['全部', 'MCP 协议连接器', '专项技能包（Skills）', '通用 AI 原子工具（OCR、结构化提取）'] },
  { label: '智能体搭建工具', defaultValue: '全部', options: ['全部', '可视化工作流编排器', '多智能体调度引擎', '医保场景 Prompt 模板库', '业务规则引擎'] },
  { label: '测试评估工具', defaultValue: '全部', options: ['全部', '模型效果评估', '医疗合规检测', '安全风险扫描', '并发压力测试'] },
  { label: '部署运维工具', defaultValue: '全部', options: ['全部', '模型一键部署', '边缘节点下沉', '运行监控', '调用日志审计'] },
];

export const toolCards: ResourceCardData[] = [
  { id: 'tool-anon', title: '医学影像脱敏工具', unit: '江苏省医保数据赋能实验室', tags: ['数据治理工具'], iconType: 'scan' },
  { id: 'tool-clean', title: '病历文本清洗工具', unit: '江苏省医保数据赋能实验室', tags: ['数据治理工具'], iconType: 'document' },
  { id: 'tool-finetune', title: '大模型轻量化微调框架', unit: '江苏省医保数据赋能实验室', tags: ['模型研发工具'], iconType: 'brain' },
  { id: 'tool-mcp', title: 'MCP 协议连接器', unit: '江苏省医保数据赋能实验室', tags: ['能力扩展工具'], iconType: 'robot' },
  { id: 'tool-skills', title: '专项技能包（Skills）', unit: '江苏省医保数据赋能实验室', tags: ['能力扩展工具'], iconType: 'assistant' },
  { id: 'tool-workflow', title: '可视化工作流编排器', unit: '江苏省医保数据赋能实验室', tags: ['智能体搭建工具'], iconType: 'robot' },
  { id: 'tool-eval', title: '模型效果评估工具', unit: '江苏省医保数据赋能实验室', tags: ['测试评估工具'], iconType: 'bar-chart' },
  { id: 'tool-compliance', title: '医疗合规检测工具', unit: '江苏省医保数据赋能实验室', tags: ['测试评估工具'], iconType: 'shield-check' },
  { id: 'tool-deploy', title: '模型一键部署工具', unit: '江苏省医保数据赋能实验室', tags: ['部署运维工具'], iconType: 'cloud' },
];
