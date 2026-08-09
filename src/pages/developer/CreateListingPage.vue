<template>
  <div class="min-h-full bg-bg">
    <!-- 顶部操作栏 -->
    <div class="sticky top-0 z-30 bg-surface border-b border-border px-[24px] py-[12px]">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-[12px]">
          <a class="text-text-secondary hover:text-primary text-[13px] flex items-center gap-[4px]" @click="onBack">
            <ArrowLeftOutlined />
            返回
          </a>
          <a-divider type="vertical" />
          <span class="text-[16px] font-semibold text-text-primary">{{ isEdit ? '编辑上架申请' : '新增上架申请' }}</span>
          <a-tag v-if="form.status === '草稿'" color="default" class="!m-0">草稿</a-tag>
          <a-tag v-else-if="form.status === '已驳回'" color="error" class="!m-0">已驳回</a-tag>
        </div>
        <a-space>
          <a-button @click="onSaveDraft">保存草稿</a-button>
          <a-button type="primary" @click="onSubmit">提交审核</a-button>
        </a-space>
      </div>
    </div>

    <div class="flex gap-[14px] max-w-[1100px] mx-auto">
      <!-- 左侧锚点导航 -->
      <aside class="sticky top-[60px] w-[180px] flex-shrink-0 pt-[20px] pl-[20px]">
        <div class="cloud-card p-[12px]">
          <div class="text-[12px] font-medium text-text-tertiary mb-[8px] px-[4px]">表单导航</div>
          <a
            v-for="s in sections"
            :key="s.id"
            class="block px-[10px] py-[8px] rounded-[6px] text-[14px] cursor-pointer transition"
            :class="activeSection === s.id ? 'bg-primary/10 text-primary font-semibold' : 'text-text-secondary hover:bg-bg hover:text-text-primary'"
            @click="scrollTo(s.id)"
          >
            {{ s.label }}
          </a>
        </div>
      </aside>

      <!-- 主表单 -->
      <main class="flex-1 p-[20px] pl-0 max-w-[920px]">
        <!-- 1. 基本信息 -->
        <section id="sec-basic" class="cloud-card p-[20px] mb-[14px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">基本信息</span>
            <span class="text-[11px] text-text-tertiary">用于平台审核与市场展示</span>
          </div>
          <a-form layout="vertical">
            <div class="grid grid-cols-2 gap-x-[16px]">
              <a-form-item label="产品名称" required>
                <a-input v-model:value="form.name" placeholder="如：肺结节CT图像辅助检测软件" :maxlength="40" show-count />
              </a-form-item>
              <a-form-item label="模型代码" required>
                <a-input v-model:value="form.modelCode" placeholder="如：LUNG-NUD-CT-001" :maxlength="30" show-count />
              </a-form-item>
              <a-form-item label="版本号" required>
                <a-input v-model:value="form.version" placeholder="如：v2.4.0" />
              </a-form-item>
              <a-form-item label="研发单位" required>
                <a-select
                  v-model:value="form.unit"
                  :options="unitOptions"
                  :field-names="{ label: 'label', value: 'value' }"
                  show-search
                  :filter-option="filterUnit"
                  placeholder="请选择研发单位"
                  allow-clear
                />
              </a-form-item>
              <a-form-item label="能力分类">
                <a-select v-model:value="form.category" :options="categoryOptions" placeholder="请选择分类" allow-clear />
              </a-form-item>
              <a-form-item label="风险等级">
                <a-select v-model:value="form.riskLevel" :options="riskOptions" placeholder="请选择风险等级" allow-clear />
              </a-form-item>
              <a-form-item label="计费方式">
                <a-select v-model:value="form.billingMethod" :options="billingOptions" placeholder="请选择计费方式" allow-clear />
              </a-form-item>
              <a-form-item label="支持的检查模态">
                <a-select
                  v-model:value="form.modalities"
                  mode="tags"
                  placeholder="输入或选择检查模态，如：CT / MRI / X光"
                  :token-separators="[',']"
                  :options="modalityOptions"
                />
              </a-form-item>
              <a-form-item label="使用范围建议">
                <a-input v-model:value="form.scope" placeholder="如：放射科 / 体检中心" />
              </a-form-item>
              <a-form-item label="接入状态" required>
                <a-select v-model:value="form.accessStatus" :options="statusOptions" placeholder="请选择接入状态" />
              </a-form-item>
            </div>
          </a-form>
        </section>

        <!-- 2. 服务描述 -->
        <section id="sec-desc" class="cloud-card p-[20px] mb-[14px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">服务描述</span>
            <span class="text-[11px] text-text-tertiary">向客户与审核方说明服务能力</span>
          </div>
          <a-form layout="vertical">
            <a-form-item label="一句话简介" required>
              <a-input v-model:value="form.summary" placeholder="30 字以内，简明描述服务核心能力" :maxlength="30" show-count />
            </a-form-item>
            <a-form-item label="适用场景" required>
              <a-textarea v-model:value="form.scenarios" :rows="3" placeholder="请描述产品的典型应用场景，如：肺部CT影像中结节病灶的自动识别与测量" :maxlength="200" show-count />
            </a-form-item>
            <a-form-item label="核心能力标签" required>
              <a-select v-model:value="form.capabilities" mode="tags" placeholder="输入后回车添加，如：病灶识别 / 多模态融合 / 辅助诊断" :token-separators="[',']" />
            </a-form-item>
            <a-form-item label="产品介绍">
              <a-textarea v-model:value="form.description" :rows="5" placeholder="详细介绍产品能力、技术原理、临床价值等，支持 Markdown" :maxlength="1000" show-count />
            </a-form-item>
          </a-form>
        </section>

        <!-- 3. 资质材料 -->
        <section id="sec-qual" class="cloud-card p-[20px] mb-[14px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">资质材料</span>
            <span class="text-[11px] text-text-tertiary">按风险等级要求上传，PDF / JPG / PNG，单文件 ≤ 10MB</span>
          </div>
          <a-alert type="info" show-icon class="mb-[14px]">
            <template #message>
              <span class="text-[12px]">
                <span class="font-semibold">风险等级要求：</span>
                <span v-if="form.riskLevel === '高风险'">高风险诊断类需上传 第三类医疗器械注册证 + 网信办算法备案 + 临床试验报告</span>
                <span v-else-if="form.riskLevel === '中风险'">中风险辅助类需上传 第二类医疗器械注册证 + 网信办算法备案</span>
                <span v-else>低风险查询类需上传 网信办算法备案 + 营业执照</span>
              </span>
            </template>
          </a-alert>
          <div class="grid grid-cols-2 gap-[14px]">
            <div v-for="doc in qualificationDocs" :key="doc.key" class="rounded-[8px] border border-border-soft p-[12px]">
              <div class="flex items-center justify-between mb-[6px]">
                <span class="text-[12px] font-semibold text-text-primary">{{ doc.label }}</span>
                <a-tag v-if="doc.required" color="error" class="!m-0 !text-[10px]">必填</a-tag>
              </div>
              <div class="text-[11px] text-text-tertiary mb-[8px]">{{ doc.hint }}</div>
              <a-upload :max-count="1" :before-upload="(file: any) => handleUpload(file, doc.key)">
                <a-button size="small">
                  <template #icon><UploadOutlined /></template>
                  上传文件
                </a-button>
              </a-upload>
              <div v-if="form.uploads[doc.key]" class="mt-[6px] flex items-center gap-[6px] text-[11px] text-success">
                <CheckCircleOutlined />
                <span class="truncate">{{ form.uploads[doc.key] }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 4. 接入信息 -->
        <section id="sec-api" class="cloud-card p-[20px] mb-[14px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">接入信息</span>
            <span class="text-[11px] text-text-tertiary">客户订阅后将凭此信息调用服务</span>
          </div>
          <a-form layout="vertical">
            <div class="grid grid-cols-2 gap-x-[16px]">
              <a-form-item label="平台网关地址">
                <a-input :value="gatewayUrl" disabled />
                <div class="text-[11px] text-text-tertiary mt-[4px]">保存后自动生成，客户调用此地址由平台网关代理转发</div>
              </a-form-item>
              <a-form-item label="后端回调地址" required>
                <a-input v-model:value="form.apiEndpoint" placeholder="如：https://your-server.com/api/v1/predict" />
                <div class="text-[11px] text-text-tertiary mt-[4px]">平台网关将请求转发至此地址，请确保公网可访问</div>
              </a-form-item>
              <a-form-item label="请求方式" required>
                <a-select v-model:value="form.apiMethod" :options="methodOptions" />
              </a-form-item>
              <a-form-item label="认证方式" required>
                <a-select v-model:value="form.authType" :options="authOptions" />
              </a-form-item>
              <a-form-item label="限流（QPS）">
                <a-input-number v-model:value="form.qps" addon-after="次/秒" :min="1" :max="1000" style="width: 100%" />
              </a-form-item>
            </div>
            <a-form-item label="请求示例">
              <a-textarea v-model:value="form.requestExample" :rows="6" placeholder="粘贴 curl 或 JSON 请求示例" />
            </a-form-item>
            <a-form-item label="响应示例">
              <a-textarea v-model:value="form.responseExample" :rows="6" placeholder="粘贴 JSON 响应示例" />
            </a-form-item>
          </a-form>
        </section>

        <!-- 5. 计费配置 -->
        <section id="sec-billing" class="cloud-card p-[20px] mb-[14px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">计费配置</span>
            <span class="text-[11px] text-text-tertiary">客户调用将按此规则计费</span>
          </div>
          <a-form layout="vertical">
            <div class="grid grid-cols-3 gap-x-[16px]">
              <a-form-item label="单价" required>
                <a-input-number v-model:value="form.unitPrice" addon-after="元" :min="0" :step="0.01" style="width: 100%" />
              </a-form-item>
              <a-form-item label="计量单位" required>
                <a-input v-model:value="form.billingUnit" :placeholder="unitPlaceholder" />
              </a-form-item>
              <a-form-item label="试用额度">
                <a-input v-model:value="form.trialQuota" placeholder="如：500 次调用" />
              </a-form-item>
            </div>
            <a-form-item label="计费说明">
              <a-textarea v-model:value="form.billingNote" :rows="3" placeholder="补充计费规则说明，如：不足 1 词元按 1 词元计算" />
            </a-form-item>
          </a-form>
        </section>

        <!-- 6. 提交确认 -->
        <section id="sec-confirm" class="cloud-card p-[20px] mb-[14px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-text-tertiary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">提交确认</span>
          </div>
          <a-checkbox v-model:checked="form.agree">
            <span class="text-[12px] text-text-primary">
              我已确认所填信息真实有效，资质材料齐全且在有效期内，并同意
              <a class="text-primary">《AI 服务上架协议》</a>
              <a class="text-primary">《数据安全合规承诺书》</a>
            </span>
          </a-checkbox>
          <a-alert v-if="form.riskLevel === '高风险'" type="warning" show-icon class="mt-[14px]">
            <template #message>
              <span class="text-[12px]">高风险服务提交后将进入 资质核验 -> 技术测评 -> 临床验收 三阶段审核，预计 7-10 个工作日反馈结果</span>
            </template>
          </a-alert>
          <a-alert v-else-if="form.riskLevel === '中风险'" type="info" show-icon class="mt-[14px]">
            <template #message>
              <span class="text-[12px]">中风险服务提交后将进入 资质核验 -> 简化技术测试 两阶段审核，预计 3-5 个工作日反馈结果</span>
            </template>
          </a-alert>
          <a-alert v-else type="success" show-icon class="mt-[14px]">
            <template #message>
              <span class="text-[12px]">低风险服务备案即可上架，预计 1-2 个工作日完成</span>
            </template>
          </a-alert>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { ArrowLeftOutlined, UploadOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';
import { developerServices } from '../../data/developerCenter';
import { serviceCategories, capabilityGroups } from '../../data';

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.query.id);

const sections = [
  { id: 'sec-basic', label: '基本信息' },
  { id: 'sec-desc', label: '服务描述' },
  { id: 'sec-qual', label: '资质材料' },
  { id: 'sec-api', label: '接入信息' },
  { id: 'sec-billing', label: '计费配置' },
  { id: 'sec-confirm', label: '提交确认' },
];

const activeSection = ref('sec-basic');

const form = ref({
  name: '',
  modelCode: '',
  version: '',
  unit: '',
  category: '' as string,
  riskLevel: '' as string,
  billingMethod: '' as string,
  modalities: [] as string[],
  scope: '',
  accessStatus: '对接测试中' as string,
  summary: '',
  scenarios: '',
  capabilities: [] as string[],
  description: '',
  uploads: {} as Record<string, string>,
  apiEndpoint: '',
  apiMethod: 'POST',
  authType: 'Bearer Token (AK/SK)',
  qps: 50,
  requestExample: '',
  responseExample: '',
  unitPrice: 0,
  billingUnit: '',
  trialQuota: '',
  billingNote: '',
  agree: false,
  status: '草稿' as string,
});

const categoryOptions = serviceCategories.map((c) => ({ label: c.label, value: c.label }));
const riskOptions = [
  { label: '高风险（诊断类，需临床验收）', value: '高风险' },
  { label: '中风险（辅助类，简化测试）', value: '中风险' },
  { label: '低风险（查询类，备案上架）', value: '低风险' },
];
const billingOptions = [
  { label: '按 Token 计量', value: '按Token' },
  { label: '按检查例次', value: '按检查例次' },
  { label: '按调用次数', value: '按调用次数' },
];
const statusOptions = [
  { label: '已上线使用', value: '已上线使用' },
  { label: '对接上线中', value: '对接上线中' },
  { label: '对接测试中', value: '对接测试中' },
  { label: '停止使用', value: '停止使用' },
];
const modalityOptions = ['CT', 'DR', 'DX'].map((m) => ({ label: m, value: m }));
const unitOptions = computed(() => {
  const allModels = capabilityGroups.flatMap((g) => g.columns.flatMap((c) => c.items));
  return Array.from(new Set(allModels.map((m) => m.unit).filter(Boolean))).map((u) => ({ label: u, value: u }));
});
function filterUnit(input: string, option: any) {
  return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
}
const methodOptions = ['POST', 'GET', 'PUT'].map((m) => ({ label: m, value: m }));
const authOptions = ['Bearer Token (AK/SK)', 'API Key', 'OAuth 2.0'].map((a) => ({ label: a, value: a }));

const unitPlaceholder = computed(() => {
  if (form.value.billingMethod === '按Token') return '千词元';
  if (form.value.billingMethod === '按检查例次') return '例';
  if (form.value.billingMethod === '按调用次数') return '次';
  return '请先选择计费方式';
});

const gatewayUrl = computed(() => {
  const editId = route.query.id as string | undefined;
  if (editId) {
    return `https://api.jsyb.cloud/v1/services/${editId}/invoke`;
  }
  if (form.value.name) {
    const slug = form.value.name.replace(/\s+/g, '-').toLowerCase().slice(0, 20);
    return `https://api.jsyb.cloud/v1/services/${slug}/invoke`;
  }
  return '保存后自动生成';
});

const qualificationDocs = computed(() => {
  const base = [
    { key: 'license', label: '营业执照', hint: '企业法人营业执照（三证合一）', required: true },
    { key: 'algoRecord', label: '网信办算法备案', hint: '生成式人工智能服务备案', required: true },
  ];
  if (form.value.riskLevel === '高风险') {
    return [
      ...base,
      { key: 'medicalCert', label: '第三类医疗器械注册证', hint: '国家药品监督管理局颁发', required: true },
      { key: 'clinicalReport', label: '临床试验报告', hint: '多中心临床试验总结报告', required: true },
      { key: 'iso13485', label: 'ISO13485 体系认证', hint: '医疗器械质量管理体系认证', required: false },
    ];
  }
  if (form.value.riskLevel === '中风险') {
    return [
      ...base,
      { key: 'medicalCert', label: '第二类医疗器械注册证', hint: '省级药品监督管理局颁发', required: true },
      { key: 'iso13485', label: 'ISO13485 体系认证', hint: '医疗器械质量管理体系认证', required: false },
    ];
  }
  return base;
});

function handleUpload(file: File, key: string) {
  form.value.uploads[key] = file.name;
  message.success(`${file.name} 已上传`);
  return false;
}

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    activeSection.value = id;
  }
}

function onScroll() {
  for (const s of sections) {
    const el = document.getElementById(s.id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) {
      activeSection.value = s.id;
      break;
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  if (route.query.id) {
    const svc = developerServices.find((s) => s.id === route.query.id);
    if (svc) {
      form.value.name = svc.name;
      form.value.modelCode = svc.id?.toUpperCase() ?? '';
      form.value.version = svc.version;
      form.value.unit = svc.unit ?? '';
      form.value.category = svc.category;
      form.value.riskLevel = svc.riskLevel;
      form.value.billingMethod = svc.billingMethod;
      form.value.modalities = [];
      form.value.accessStatus = svc.status === '已上架' ? '已上线使用' : '对接测试中';
      form.value.status = svc.status;
      form.value.scope = '全院';
      form.value.summary = `${svc.name} 核心能力服务`;
      form.value.scenarios = `适用于${svc.category}场景，提供智能化辅助能力`;
      form.value.capabilities = [svc.category];
      form.value.description = `${svc.name} ${svc.version}，归属${svc.category}，风险等级${svc.riskLevel}，按${svc.billingMethod}计费。`;
      form.value.apiEndpoint = `https://your-server.com/api/v1/invoke`;
      form.value.apiMethod = 'POST';
      form.value.authType = 'Bearer Token (AK/SK)';
      form.value.qps = 50;
      form.value.unitPrice = svc.billingMethod === '按Token' ? 0.004 : 0.5;
      form.value.billingUnit = svc.billingMethod === '按Token' ? '千词元' : svc.billingMethod === '按检查例次' ? '例' : '次';
      form.value.trialQuota = '500 次';
      form.value.billingNote = '';
      form.value.agree = true;
      if (svc.riskLevel === '高风险') {
        form.value.uploads = {
          license: '营业执照.pdf',
          algoRecord: '算法备案.pdf',
          medicalDevice: '第三类医疗器械注册证.pdf',
          clinicalReport: '临床试验报告.pdf',
        };
      } else if (svc.riskLevel === '中风险') {
        form.value.uploads = {
          license: '营业执照.pdf',
          algoRecord: '算法备案.pdf',
          medicalDevice: '第二类医疗器械注册证.pdf',
        };
      } else {
        form.value.uploads = {
          license: '营业执照.pdf',
          algoRecord: '算法备案.pdf',
        };
      }
    }
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});

function onBack() {
  router.push('/developer-center/listing');
}

function validate(): string | null {
  if (!form.value.name) return '请填写产品名称';
  if (!form.value.modelCode) return '请填写模型代码';
  if (!form.value.version) return '请填写版本号';
  if (!form.value.unit) return '请选择研发单位';
  if (!form.value.accessStatus) return '请选择接入状态';
  if (!form.value.summary) return '请填写一句话简介';
  if (!form.value.scenarios) return '请填写适用场景';
  if (form.value.capabilities.length === 0) return '请填写核心能力标签';
  if (!form.value.apiEndpoint) return '请填写 API 端点';
  if (!form.value.unitPrice || form.value.unitPrice <= 0) return '请填写有效单价';
  if (!form.value.billingUnit) return '请填写计量单位';
  const missingDocs = qualificationDocs.value.filter((d) => d.required && !form.value.uploads[d.key]);
  if (missingDocs.length > 0) return `请上传资质材料：${missingDocs.map((d) => d.label).join('、')}`;
  if (!form.value.agree) return '请勾选并同意上架协议';
  return null;
}

function onSaveDraft() {
  message.success('草稿已保存，可稍后继续编辑');
  router.push('/developer-center/listing');
}

function onSubmit() {
  const err = validate();
  if (err) {
    message.warning(err);
    return;
  }
  const auditDays = form.value.riskLevel === '高风险' ? '7-10' : form.value.riskLevel === '中风险' ? '3-5' : '1-2';
  message.success(`上架申请已提交，预计 ${auditDays} 个工作日反馈审核结果`);
  router.push('/developer-center/listing');
}
</script>
