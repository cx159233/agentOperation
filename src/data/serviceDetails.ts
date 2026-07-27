import type { CapabilityCardData } from '../types';
import type { ServiceBasicInfo, ServiceCase, ServiceDetail, ServiceQualification, ServiceTrial } from '../types';

type ServiceDetailMap = Record<string, ServiceDetail>;

export const serviceDetails: ServiceDetailMap = {
  'deepseek-v4': {
    basic: {
      服务归属: '深度求索（北京）科技有限公司',
      能力类型: ['自然语言理解', '文本生成', '对话推理', '代码生成'],
      适用范围: ['医保结算单智能解析', '电子病历辅助生成', '政策咨询问答', '智能导诊预问诊'],
      资质标签: ['网信办大模型备案', 'ISO27001信息安全认证'],
      接入状态: '已上线使用',
    },
    qualifications: [
      { type: '网信办大模型备案', number: 'TC2024-LLM-0231', issuedBy: '国家互联网信息办公室', validUntil: '2027-03-15', status: '有效' },
      { type: 'ISO27001信息安全认证', number: 'ISO27001-2024-CN-882', issuedBy: '中国质量认证中心', validUntil: '2026-09-08', status: '有效' },
      { type: '算法备案（深度合成）', number: '备202411011000078', issuedBy: '国家互联网信息办公室', validUntil: '2027-08-20', status: '有效' },
    ],
    trial: {
      quota: '50 万词元',
      period: '30 天',
      inputExample: `POST /v1/chat/completions
{
  "model": "deepseek-v4",
  "messages": [
    { "role": "system", "content": "你是医保政策咨询助手，请基于最新政策文件回答用户问题。" },
    { "role": "user", "content": "门诊慢特病报销比例是多少？" }
  ],
  "max_tokens": 1024,
  "temperature": 0.3
}`,
      outputExample: `{
  "id": "chatcmpl-9f8e2c",
  "object": "chat.completion",
  "model": "deepseek-v4",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "根据《江苏省基本医疗保险门诊慢特病管理办法》规定，门诊慢特病报销比例为：职工医保85%，居民医保70%..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": { "prompt_tokens": 86, "completion_tokens": 142, "total_tokens": 228 }
}`,
      workflow: [
        '调用方申请调用权限并获取 API Key',
        '构造符合规范的 messages 请求体，必要时附加 system 提示词',
        '通过 HTTPS POST 调用 /v1/chat/completions 接口',
        '解析返回的 choices 与 usage 字段，记录 token 消耗',
        '基于响应内容在前端展示给最终用户',
      ],
    },
    cases: [
      { org: '常州市人民医院', scenario: '医保结算单智能解析', calls: '52,180 次' },
      { org: '江苏省医保数据赋能实验室', scenario: '政策咨询问答', calls: '38,920 次' },
      { org: '南京市鼓楼医院', scenario: '电子病历辅助生成', calls: '27,640 次' },
    ],
  },

  'qwen-multimodal': {
    basic: {
      服务归属: '阿里巴巴通义实验室',
      能力类型: ['多模态理解', '图文对话', '跨模态检索', '文档智能'],
      适用范围: ['医学影像报告生成', '病历文档结构化', '多模态医学问答', '检查检验图文解读'],
      资质标签: ['网信办大模型备案', 'ISO27001信息安全认证'],
      接入状态: '已上线使用',
    },
    qualifications: [
      { type: '网信办大模型备案', number: 'TC2024-LLM-0412', issuedBy: '国家互联网信息办公室', validUntil: '2027-06-30', status: '有效' },
      { type: 'ISO27001信息安全认证', number: 'ISO27001-2023-CN-1024', issuedBy: '中国质量认证中心', validUntil: '2026-11-15', status: '有效' },
    ],
    trial: {
      quota: '30 万词元',
      period: '14 天',
      inputExample: `POST /v1/multimodal/conversations
{
  "model": "qwen-multimodal",
  "input": {
    "messages": [
      { "role": "user", "content": [
        { "type": "image_url", "image_url": "https://example.com/ct/scan_001.jpg" },
        { "type": "text", "text": "请描述该 CT 影像的可见异常区域" }
      ]}
    ]
  }
}`,
      outputExample: `{
  "request_id": "mm-2d8f1a",
  "output": {
    "choices": [{
      "message": {
        "role": "assistant",
        "content": [
          { "type": "text", "text": "右侧肺叶可见一约 6mm 结节影，边界尚清晰，建议结合临床进一步随访。" }
        ]
      },
      "finish_reason": "stop"
    }]
  },
  "usage": { "input_tokens": 1280, "output_tokens": 96, "image_tokens": 1184 }
}`,
      workflow: [
        '调用方上传影像或文档至对象存储并获取可访问 URL',
        '构造多模态 messages 请求体，混合 image_url 与 text 内容',
        '通过 HTTPS POST 调用 /v1/multimodal/conversations 接口',
        '解析返回的 text 或结构化字段，前端渲染结果',
        '记录 image_tokens 与 output_tokens，纳入计费统计',
      ],
    },
    cases: [
      { org: '南京鼓楼医院', scenario: '影像报告辅助生成', calls: '18,420 次' },
      { org: '东南大学附属中大医院', scenario: '病历文档结构化', calls: '12,680 次' },
      { org: '常州市第二人民医院', scenario: '多模态医学问答', calls: '9,250 次' },
    ],
  },

  'bge-rerank': {
    basic: {
      服务归属: '北京智源人工智能研究院 BAAI',
      能力类型: ['语义重排序', '检索增强', '相关度评分'],
      适用范围: ['医学知识库检索', '政策法规问答增强', '病历内容召回重排', '医保规则匹配'],
      资质标签: ['网信办大模型备案'],
      接入状态: '已上线使用',
    },
    qualifications: [
      { type: '网信办大模型备案', number: 'TC2024-LLM-0512', issuedBy: '国家互联网信息办公室', validUntil: '2027-05-20', status: '有效' },
    ],
    trial: {
      quota: '100 万词元',
      period: '30 天',
      inputExample: `POST /v1/rerank
{
  "model": "bge-rerank-large",
  "query": "门诊慢特病报销需要哪些材料？",
  "documents": [
    "门诊慢特病申请需提供：诊断证明、近期病历、检查报告...",
    "医保个人账户可用于门诊费用结算...",
    "住院报销比例根据医院等级确定..."
  ],
  "top_n": 3
}`,
      outputExample: `{
  "id": "rerank-3f9b2c",
  "results": [
    { "index": 0, "relevance_score": 0.9821, "document": "门诊慢特病申请需提供：诊断证明、近期病历、检查报告..." },
    { "index": 2, "relevance_score": 0.3842, "document": "住院报销比例根据医院等级确定..." },
    { "index": 1, "relevance_score": 0.2105, "document": "医保个人账户可用于门诊费用结算..." }
  ]
}`,
      workflow: [
        '从向量数据库或全文检索召回候选文档集合',
        '将 query 与 documents 一起传入 rerank 接口',
        '获取按 relevance_score 降序排列的结果',
        '取 top_n 结果作为大模型上下文输入',
        '记录调用 token 数纳入计费',
      ],
    },
    cases: [
      { org: '江苏省医保数据赋能实验室', scenario: '政策法规问答增强', calls: '142,800 次' },
      { org: '南京鼓楼医院', scenario: '病历内容召回重排', calls: '68,300 次' },
    ],
  },

  'shanzhiyi-5.0': {
    basic: {
      服务归属: '云知声智能科技股份有限公司',
      能力类型: ['医学语义理解', '电子病历生成', '多模态融合', '医学知识图谱'],
      适用范围: ['电子病历辅助生成', '病历文书质控', '智能导诊', '医学问答'],
      资质标签: ['网信办大模型备案', '第二类医疗器械注册证'],
      接入状态: '已上线使用',
    },
    qualifications: [
      { type: '网信办大模型备案', number: 'TC2024-LLM-0623', issuedBy: '国家互联网信息办公室', validUntil: '2027-04-10', status: '有效' },
      { type: '第二类医疗器械注册证', number: '苏械注准20242210328', issuedBy: '江苏省药品监督管理局', validUntil: '2028-12-25', status: '有效' },
      { type: 'ISO13485医疗器械质量体系', number: 'ISO13485-2023-CN-0512', issuedBy: '中国质量认证中心', validUntil: '2026-08-30', status: '有效' },
    ],
    trial: {
      quota: '20 万词元 + 100 例检查例次',
      period: '30 天',
      inputExample: `POST /v1/medical/emr/generate
{
  "model": "shanzhiyi-5.0",
  "patient": { "age": 56, "gender": "男", "chief_complaint": "反复咳嗽 1 月余" },
  "dialog": [
    { "role": "doctor", "content": "咳嗽什么时间加重？有痰吗？" },
    { "role": "patient", "content": "晨起咳嗽加重，少量白痰，无血丝" }
  ],
  "vitals": { "temperature": 36.8, "bp": "128/82", "heart_rate": 78 }
}`,
      outputExample: `{
  "emr": {
    "main_complaint": "反复咳嗽 1 月余，晨起加重，伴少量白痰",
    "present_illness": "患者 1 月前无明显诱因出现咳嗽，晨起加重，咳少量白色粘痰，无发热、胸痛、咯血...",
    "exam": "T 36.8℃ P 78 次/分 R 18 次/分 BP 128/82mmHg",
    "plan": "建议行胸部 CT、肺功能检查，必要时予以对症止咳治疗"
  },
  "quality_score": 0.92,
  "usage": { "tokens": 1840 }
}`,
      workflow: [
        '门诊医生工作站采集主诉、对话、生命体征',
        '通过 API 提交至 emr/generate 接口生成病历草稿',
        '医生审阅并修改后写入电子病历系统',
        '系统自动检测病历完整性并给出质量评分',
        '调用次数与 token 消耗纳入计费统计',
      ],
    },
    cases: [
      { org: '常州市第二人民医院', scenario: '电子病历辅助生成', calls: '38,640 次' },
      { org: '南京鼓楼医院', scenario: '病历文书质控', calls: '21,200 次' },
      { org: '东南大学附属中大医院', scenario: '多模态医学问答', calls: '14,580 次' },
    ],
  },

  'lungnodule-ct': {
    basic: {
      服务归属: '北京汇医慧影医疗科技有限公司',
      能力类型: ['医学影像分析', '病灶识别', '辅助诊断', '三维重建'],
      适用范围: ['肺结节早期筛查', '肺癌高危人群随访', '体检中心影像辅助', '放射科读片辅助'],
      资质标签: ['第三类医疗器械注册证', '网信办算法备案'],
      接入状态: '已上线使用',
    },
    qualifications: [
      { type: '第三类医疗器械注册证', number: '国械注准20243220678', issuedBy: '国家药品监督管理局', validUntil: '2029-04-12', status: '有效' },
      { type: '网信办算法备案', number: '备202411011000082', issuedBy: '国家互联网信息办公室', validUntil: '2027-08-15', status: '有效' },
      { type: 'ISO13485医疗器械质量体系', number: 'ISO13485-2024-CN-1208', issuedBy: '中国质量认证中心', validUntil: '2027-03-22', status: '有效' },
    ],
    trial: {
      quota: '20 例检查例次',
      period: '14 天',
      inputExample: `POST /v1/imaging/lung-nodule/detect
{
  "model": "lungnodule-ct-v3",
  "study_uid": "1.2.840.113619.2.55.3",
  "dicom_series_url": "dicom://study/2024/CT_001",
  "patient": { "age": 58, "gender": "男", "smoking_history": "30年" }
}`,
      outputExample: `{
  "study_uid": "1.2.840.113619.2.55.3",
  "findings": [
    {
      "nodule_id": "N1",
      "location": "右肺上叶尖段",
      "diameter_mm": 6.2,
      "volume_mm3": 124.8,
      "morphology": "实性结节",
      "malignancy_probability": 0.32,
      "recommendation": "6 个月后复查 CT"
    },
    {
      "nodule_id": "N2",
      "location": "左肺下叶后基底段",
      "diameter_mm": 3.1,
      "volume_mm3": 15.6,
      "morphology": "磨玻璃结节",
      "malignancy_probability": 0.12,
      "recommendation": "12 个月后复查 CT"
    }
  ],
  "report_suggestion": "双肺见多发小结节，最大者位于右肺上叶尖段，直径约6.2mm，建议6个月后复查CT随访。"
}`,
      workflow: [
        '影像设备采集 CT 序列并上传至 PACS',
        '平台通过 DICOM 接口获取影像序列',
        '调用 lung-nodule/detect 接口进行 AI 分析',
        '返回结节位置、直径、良恶性概率与随访建议',
        '放射科医生审核 AI 结果并出最终报告',
      ],
    },
    cases: [
      { org: '常州市人民医院', scenario: '肺结节早期筛查', calls: '5,820 例' },
      { org: '江苏省人民医院', scenario: '肺癌高危人群随访', calls: '3,460 例' },
      { org: '南京鼓楼医院', scenario: '体检中心影像辅助', calls: '4,180 例' },
    ],
  },

  'lungcancer-screening': {
    basic: {
      服务归属: '零氪科技（北京）有限公司',
      能力类型: ['医学影像分析', '肺癌早筛', '风险分层', '纵向随访'],
      适用范围: ['肺癌早筛', '肺结节良恶性评估', '高危人群管理', '肿瘤筛查报告生成'],
      资质标签: ['第三类医疗器械注册证', '网信办算法备案'],
      接入状态: '已上线使用',
    },
    qualifications: [
      { type: '第三类医疗器械注册证', number: '国械注准20233220945', issuedBy: '国家药品监督管理局', validUntil: '2028-10-20', status: '有效' },
      { type: '网信办算法备案', number: '备202411011000064', issuedBy: '国家互联网信息办公室', validUntil: '2027-06-18', status: '有效' },
    ],
    trial: {
      quota: '15 例检查例次',
      period: '14 天',
      inputExample: `POST /v1/screening/lung-cancer/assess
{
  "model": "lungcancer-screening-v2",
  "dicom_series_url": "dicom://study/2024/LC_001",
  "patient": {
    "age": 62, "gender": "男",
    "smoking_history": "40年·1包/天",
    "family_cancer_history": true
  }
}`,
      outputExample: `{
  "risk_level": "高风险",
  "risk_score": 0.78,
  "findings": [
    { "type": "实性结节", "location": "右肺上叶", "diameter_mm": 8.4, "malignancy_prob": 0.68 }
  ],
  "recommendation": "建议 PET-CT 进一步评估或3个月后复查CT",
  "follow_up_plan": "3 个月后复查低剂量螺旋 CT"
}`,
      workflow: [
        '低剂量螺旋 CT 采集影像',
        '调用 lung-cancer/assess 接口进行 AI 分析',
        '获取风险分层、结节特征与随访建议',
        '自动生成筛查报告并推送至医生工作站',
        '将患者纳入肺癌高危人群管理队列',
      ],
    },
    cases: [
      { org: '常州市人民医院', scenario: '肺癌早筛', calls: '2,840 例' },
      { org: '南京鼓楼医院', scenario: '肺结节良恶性评估', calls: '1,920 例' },
    ],
  },

  'ecg-diagnosis': {
    basic: {
      服务归属: '南京数维康医疗科技有限公司',
      能力类型: ['心电信号分析', '心律失常识别', '远程诊断', '危急值预警'],
      适用范围: ['远程心电监测', '基层心电辅助诊断', '心律失常筛查', '危急值自动预警'],
      资质标签: ['第二类医疗器械注册证', '网信办算法备案'],
      接入状态: '已上线使用',
    },
    qualifications: [
      { type: '第二类医疗器械注册证', number: '苏械注准20242210372', issuedBy: '江苏省药品监督管理局', validUntil: '2029-02-15', status: '有效' },
      { type: '网信办算法备案', number: '备202411011000095', issuedBy: '国家互联网信息办公室', validUntil: '2027-07-30', status: '有效' },
    ],
    trial: {
      quota: '50 例检查例次',
      period: '30 天',
      inputExample: `POST /v1/ecg/analyze
{
  "model": "ecg-diagnosis-v2",
  "ecg_file_url": "ecg://record/2024/ECG_001.xml",
  "duration_sec": 30,
  "leads": 12,
  "patient": { "age": 68, "gender": "男", "symptom": "胸闷心悸 2 小时" }
}`,
      outputExample: `{
  "diagnosis": ["窦性心律", "偶发室性早搏", "ST段轻度压低（II、III、aVF）"],
  "heart_rate": 76,
  "abnormal_count": 8,
  "critical_alert": false,
  "recommendation": "建议进一步完善心脏超声、心肌酶谱检查"
}`,
      workflow: [
        '基层医疗机构采集 12 导联心电数据',
        '通过接口上传 ECG 文件',
        'AI 自动分析心律、波形、ST 段等特征',
        '生成诊断意见并推送至上级医院心电中心',
        '发现危急值时实时通知心内科医生',
      ],
    },
    cases: [
      { org: '常州市人民医院', scenario: '远程心电监测', calls: '8,420 例' },
      { org: '盐城市大丰区中医院', scenario: '基层心电辅助诊断', calls: '3,680 例' },
    ],
  },

  'consumable-compare-agent': {
    basic: {
      服务归属: '常州健康医疗大数据运营有限公司',
      能力类型: ['智能体推理', '高值耗材比对', '医保规则匹配', '异常检测'],
      适用范围: ['高值耗材使用合理性审核', '医保基金监管', '耗材跨院比对', '异常用量预警'],
      资质标签: ['网信办算法备案'],
      接入状态: '对接测试中',
    },
    qualifications: [
      { type: '网信办算法备案', number: '备202411011000112', issuedBy: '国家互联网信息办公室', validUntil: '2027-09-12', status: '有效' },
      { type: 'ISO27001信息安全认证', number: 'ISO27001-2024-CN-1562', issuedBy: '中国质量认证中心', validUntil: '2027-01-20', status: '有效' },
    ],
    trial: {
      quota: '5,000 次调用',
      period: '30 天',
      inputExample: `POST /v1/agent/consumable-compare
{
  "agent_id": "consumable-compare-agent",
  "input": {
    "hospital_code": "H320902",
    "patient_id": "P2024100125",
    "procedure": "经皮冠状动脉介入治疗(PCI)",
    "consumables": [
      { "code": "C03.07.05.001", "name": "药物洗脱冠状动脉支架", "count": 2 },
      { "code": "C03.07.05.012", "name": "导引导丝", "count": 3 }
    ]
  }
}`,
      outputExample: `{
  "abnormal_flag": true,
  "comparison": {
    "same_procedure_avg_stent": 1.4,
    "current_stent_count": 2,
    "deviation": "+43%"
  },
  "alerts": [
    { "type": "超量使用", "level": "高", "message": "支架使用量超过同术式均值 43%" },
    { "type": "跨院比对", "level": "中", "message": "导引导丝用量在区域内偏高" }
  ],
  "suggestion": "建议医院医保办核验耗材使用合理性并备案说明"
}`,
      workflow: [
        '从 HIS/CIS 系统抽取耗材使用明细',
        '调用比对智能体分析同术式跨院数据',
        '识别超量、跨院异常等高风险场景',
        '推送预警至医保办并要求医院核验',
        '生成核查报告纳入基金监管档案',
      ],
    },
    cases: [
      { org: '江苏省医保局基金监管处', scenario: '高值耗材使用合理性审核', calls: '12,680 次' },
      { org: '常州市医疗保障局', scenario: '医保基金监管', calls: '8,420 次' },
    ],
  },

  'emr-qc-agent': {
    basic: {
      服务归属: '常州市第二人民医院',
      能力类型: ['智能体推理', '病历质控', '医学NLP', '规则引擎'],
      适用范围: ['病历文书规范稽核', '缺陷自动识别', '质控报告生成', '医保结算前置审核'],
      资质标签: ['网信办算法备案'],
      接入状态: '已上线使用',
    },
    qualifications: [
      { type: '网信办算法备案', number: '备202411011000136', issuedBy: '国家互联网信息办公室', validUntil: '2027-10-22', status: '有效' },
    ],
    trial: {
      quota: '5,000 次调用',
      period: '30 天',
      inputExample: `POST /v1/agent/emr-qc
{
  "agent_id": "emr-qc-agent",
  "input": {
    "emr_text": "患者男性，56岁，因反复咳嗽1月入院。查体：T 36.8℃，P 78次/分...",
    "emr_type": "入院记录",
    "department": "呼吸内科"
  }
}`,
      outputExample: `{
  "quality_score": 82,
  "defects": [
    { "type": "缺失项", "field": "既往史", "severity": "中", "suggestion": "请补充既往史" },
    { "type": "不规范表述", "field": "查体", "severity": "低", "suggestion": "建议统一血压单位为 mmHg" }
  ],
  "verdict": "合格（需修改）",
  "report_url": "https://qc.example.com/report/2024100125.pdf"
}`,
      workflow: [
        '医生提交病历至质控队列',
        '智能体分析病历结构与字段完整性',
        '匹配病历书写规范与医保结算前置规则',
        '返回缺陷清单、修改建议和质控评分',
        '医生修改后再次提交至审核通过',
      ],
    },
    cases: [
      { org: '常州市第二人民医院', scenario: '病历文书规范稽核', calls: '18,420 次' },
      { org: '常州市中医院', scenario: '病历质控前置审核', calls: '6,580 次' },
    ],
  },

  'neonatal-retina-screening': {
    basic: {
      服务归属: '江苏省人民医院、南京理工大学',
      能力类型: ['多示例学习', '眼底图像分析', '早产儿视网膜病变识别', '辅助诊断'],
      适用范围: ['早产儿视网膜病变（ROP）筛查', '新生儿眼底疾病早筛', '眼科辅助诊断'],
      资质标签: ['第三类医疗器械注册证', '网信办算法备案'],
      接入状态: '对接上线中',
    },
    qualifications: [
      { type: '第三类医疗器械注册证', number: '国械注准20243220692', issuedBy: '国家药品监督管理局', validUntil: '2029-06-08', status: '有效' },
      { type: '网信办算法备案', number: '备202411011000148', issuedBy: '国家互联网信息办公室', validUntil: '2027-11-15', status: '有效' },
    ],
    trial: {
      quota: '30 例检查例次',
      period: '30 天',
      inputExample: `POST /v1/screening/rop/analyze
{
  "model": "rop-mil-v1",
  "fundus_image_url": "img://fundus/2024/ROP_001.jpg",
  "patient": { "gestational_age_weeks": 30, "birth_weight_g": 1450, "postnatal_age_weeks": 36 }
}`,
      outputExample: `{
  "stage": "II期",
  "zone": "Zone 2",
  "plus_disease": false,
  "findings": [
    { "location": "颞侧视网膜", "description": "可见嵴样隆起，无纤维血管增殖" }
  ],
  "risk_score": 0.42,
  "recommendation": "建议 1-2 周内复查眼底，根据进展决定是否需激光治疗"
}`,
      workflow: [
        '新生儿眼底相机采集视网膜图像',
        '调用 rop/analyze 接口进行 AI 分析',
        '输出 ROP 分期、分区及 plus 病变判断',
        '结合孕周、出生体重给出风险评分',
        '眼科医生审核后出具筛查报告',
      ],
    },
    cases: [
      { org: '江苏省人民医院', scenario: '早产儿视网膜病变筛查', calls: '1,280 例' },
      { org: '南京鼓楼医院', scenario: '新生儿眼底疾病早筛', calls: '680 例' },
    ],
  },
};

const qualificationByRisk: Record<string, ServiceQualification[]> = {
  高风险: [
    { type: '第三类医疗器械注册证', number: '国械注准20243220XXX', issuedBy: '国家药品监督管理局', validUntil: '2029-06-30', status: '有效' },
    { type: '网信办算法备案', number: '备202411011000XXX', issuedBy: '国家互联网信息办公室', validUntil: '2027-09-30', status: '有效' },
  ],
  中风险: [
    { type: '第二类医疗器械注册证', number: '苏械注准20242210XXX', issuedBy: '江苏省药品监督管理局', validUntil: '2028-12-31', status: '有效' },
    { type: '网信办算法备案', number: '备202411011000XXX', issuedBy: '国家互联网信息办公室', validUntil: '2027-09-30', status: '有效' },
  ],
  低风险: [
    { type: '网信办算法备案', number: '备202411011000XXX', issuedBy: '国家互联网信息办公室', validUntil: '2027-09-30', status: '有效' },
    { type: 'ISO27001信息安全认证', number: 'ISO27001-2024-CN-XXX', issuedBy: '中国质量认证中心', validUntil: '2027-03-31', status: '有效' },
  ],
};

const abilityTypeByTag: Record<string, string[]> = {
  '大模型接口': ['自然语言理解', '文本生成', '对话推理'],
  '多模态融合': ['多模态理解', '图文对话', '跨模态检索'],
  '临床辅助': ['辅助诊断', '风险分层', '决策支持'],
  '单病种筛查': ['病灶识别', '辅助诊断', '风险分层'],
  '多病种一扫多查': ['多病灶识别', '辅助诊断', '风险分层'],
  '医保监管': ['智能体推理', '异常检测', '规则匹配'],
  '高值耗材': ['智能体推理', '耗材比对', '异常检测'],
  '检查检验': ['智能体推理', '检验比对', '异常检测'],
  '病例质控': ['智能体推理', '病历质控', '医学NLP'],
  '医保合规': ['智能体推理', '合规审查', '规则匹配'],
  '电子病历': ['医学语义理解', '病历生成', '医学知识图谱'],
  '自动导入': ['智能体推理', '病历生成', '文档智能'],
  '智能生成': ['医学语义理解', '内容生成', '医学知识图谱'],
  '智能导诊': ['智能体推理', '导诊推荐', '医学问答'],
  '跨院数据': ['智能体推理', '数据集成', '医学问答'],
  'AI分析': ['智能体推理', '数据分析', '决策支持'],
  '手术辅助': ['手术导航', '实时预警', '数字孪生'],
  '数字孪生': ['数字孪生', '手术导航', '实时预警'],
  '慢病管理': ['智能体推理', '风险分层', '健康管理'],
  '医疗器械证': ['医学影像分析', '辅助诊断', '风险分层'],
  '科研专用': ['医学影像分析', '科研分析', '辅助诊断'],
  '病历生成': ['医学语义理解', '病历生成', '医学知识图谱'],
};

const scopeByTag: Record<string, string> = {
  '大模型接口': '通用文本对话场景',
  '多模态融合': '图文混合输入的医学问答',
  '临床辅助': '临床科室辅助诊断',
  '单病种筛查': '体检中心与专科筛查',
  '多病种一扫多查': '体检中心一站式筛查',
  '医保监管': '医保基金监管场景',
  '高值耗材': '高值耗材使用合理性审核',
  '检查检验': '检查检验结果比对',
  '病例质控': '病历文书规范稽核',
  '医保合规': '医保结算前置合规审查',
  '电子病历': '电子病历辅助生成',
  '智能导诊': '门诊导诊预问诊',
  '手术辅助': '术中实时辅助',
  '慢病管理': '慢病随访与健康管理',
  '医疗器械证': '医学影像辅助诊断',
};

function fallbackFromCard(card: CapabilityCardData): ServiceDetail {
  const riskKey = card.riskLevel ?? '低风险';
  const qualifications = qualificationByRisk[riskKey] ?? qualificationByRisk.低风险;

  const abilityTypeSet = new Set<string>();
  const scopeSet = new Set<string>();
  card.tags.forEach((tag) => {
    (abilityTypeByTag[tag] ?? []).forEach((t) => abilityTypeSet.add(t));
    if (scopeByTag[tag]) scopeSet.add(scopeByTag[tag]);
  });
  if (abilityTypeSet.size === 0) ['自然语言理解', '辅助诊断'].forEach((t) => abilityTypeSet.add(t));
  if (scopeSet.size === 0) scopeSet.add('试点机构业务场景');

  const tagSet = new Set<string>();
  qualifications.forEach((q) => tagSet.add(q.type));
  if (card.billingMethod === '按Token') tagSet.add('网信办大模型备案');

  const isImaging = card.tags.some((t) => ['单病种筛查', '多病种一扫多查', '临床辅助', '医疗器械证'].includes(t));
  const trial: ServiceTrial = isImaging
    ? {
        quota: '20 例检查例次',
        period: '14 天',
        inputExample: `POST /v1/imaging/analyze
{
  "model": "${card.id}",
  "dicom_series_url": "dicom://study/2024/SAMPLE_001",
  "patient": { "age": 56, "gender": "男" }
}`,
        outputExample: `{
  "findings": [
    { "location": "示例病灶区域", "diameter_mm": 5.2, "malignancy_probability": 0.28 }
  ],
  "report_suggestion": "AI 辅助检测结果，建议结合临床综合判断。"
}`,
        workflow: [
          '影像设备采集医学影像并上传至 PACS',
          '平台通过接口获取影像数据',
          '调用 AI 分析接口进行推理',
          '返回病灶位置、特征与辅助诊断建议',
          '医生审核结果并出最终报告',
        ],
      }
    : {
        quota: '20 万词元',
        period: '30 天',
        inputExample: `POST /v1/service/invoke
{
  "model": "${card.id}",
  "input": { "messages": [{ "role": "user", "content": "示例调用请求" }] }
}`,
        outputExample: `{
  "id": "resp-001",
  "output": { "content": "示例返回内容，实际调用结果以服务返回为准。" },
  "usage": { "total_tokens": 128 }
}`,
        workflow: [
          '调用方申请调用权限并获取 API Key',
          '构造符合规范的请求体',
          '通过 HTTPS POST 调用对应接口',
          '解析返回结果并记录 token 消耗',
          '基于响应内容在前端展示给最终用户',
        ],
      };

  const cases: ServiceCase[] = [
    { org: '常州市人民医院', scenario: scopeByTag[card.tags[0]] ?? '试点场景', calls: '3,200 次' },
    { org: '南京鼓楼医院', scenario: scopeByTag[card.tags[0]] ?? '试点场景', calls: '1,840 次' },
  ];

  return {
    basic: {
      服务归属: card.unit,
      能力类型: Array.from(abilityTypeSet),
      适用范围: Array.from(scopeSet),
      资质标签: Array.from(tagSet),
      接入状态: card.status ?? '对接测试中',
    },
    qualifications,
    trial,
    cases,
  };
}

export function getServiceDetail(serviceId: string, card?: CapabilityCardData): ServiceDetail {
  if (serviceDetails[serviceId]) return serviceDetails[serviceId];
  if (card) return fallbackFromCard(card);
  return fallbackFromCard({
    id: serviceId,
    title: serviceId,
    unit: '-',
    description: '',
    tags: [],
    category: '通用基础大模型',
    riskLevel: '低风险',
    billingMethod: '按Token',
    iconType: 'brain',
    iconTone: 'blue',
    status: '对接测试中',
  });
}
