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
          <span class="text-[16px] font-semibold text-text-primary">{{ isEdit ? '编辑模型编目' : '新增模型编目' }}</span>
        </div>
        <a-button type="primary" @click="onSubmit">提交</a-button>
      </div>
    </div>

    <div class="flex gap-[14px] max-w-[1100px] mx-auto items-start">
      <!-- 左侧锚点导航 -->
      <aside class="sticky top-[68px] w-[180px] flex-shrink-0 pt-[20px] pl-[20px]">
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
        <section id="sec-basic" class="cloud-card p-[20px] mb-[14px] scroll-mt-[80px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">基本信息</span>
            <span class="text-[11px] text-text-tertiary">用于平台纳管与目录展示</span>
          </div>
          <a-form layout="vertical">
            <div class="grid grid-cols-2 gap-x-[16px]">
              <a-form-item label="模型名称" required>
                <a-input v-model:value="form.title" placeholder="如：肺结节CT图像辅助检测" :maxlength="40" show-count />
              </a-form-item>
              <a-form-item label="模型代码" required>
                <a-input v-model:value="form.code" placeholder="如：LUNG-NUD-CT-001" :maxlength="30" show-count />
              </a-form-item>
              <a-form-item label="服务商名称" required>
                <a-select
                  v-model:value="form.unit"
                  :options="unitOptions"
                  :field-names="{ label: 'label', value: 'value' }"
                  show-search
                  :filter-option="filterUnit"
                  placeholder="请选择服务商名称"
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
              <a-form-item label="接入状态" required>
                <a-select v-model:value="form.status" :options="statusOptions" placeholder="请选择状态" />
              </a-form-item>
            </div>
          </a-form>
        </section>

        <!-- 2. 服务描述 -->
        <section id="sec-desc" class="cloud-card p-[20px] mb-[14px] scroll-mt-[80px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">服务描述</span>
            <span class="text-[11px] text-text-tertiary">向订阅方与审核方说明模型能力</span>
          </div>
          <a-form layout="vertical">
            <a-form-item label="LOGO">
              <div class="flex items-center gap-[14px]">
                <div class="relative w-[80px] h-[80px] flex-shrink-0">
                  <a-upload
                    :max-count="1"
                    :show-upload-list="false"
                    accept=".png,.jpg,.jpeg"
                    :before-upload="handleLogoUpload"
                  >
                    <div class="group relative w-[80px] h-[80px] rounded-[8px] border border-border-soft bg-bg grid place-items-center overflow-hidden cursor-pointer">
                      <img v-if="form.logo" :src="form.logo" alt="logo" class="w-full h-full object-cover" />
                      <PictureOutlined v-else class="text-[24px] text-text-tertiary" />
                      <div class="absolute inset-0 bg-black/45 grid place-items-center opacity-0 group-hover:opacity-100 transition">
                        <PlusOutlined v-if="!form.logo" class="text-[20px] text-white" />
                        <template v-else>
                          <div class="text-[11px] text-white/90 text-center leading-[16px]">点击替换</div>
                        </template>
                      </div>
                    </div>
                  </a-upload>
                  <a
                    v-if="form.logo"
                    class="absolute -top-[6px] -right-[6px] w-[20px] h-[20px] rounded-full bg-danger text-white grid place-items-center text-[11px] shadow-sm hover:bg-danger/90 z-10"
                    title="删除 LOGO"
                    @click.stop="onRemoveLogo"
                  >
                    <CloseOutlined />
                  </a>
                </div>
                <div class="text-[11px] text-text-tertiary">支持 PNG / JPG，建议 256×256，≤ 2MB</div>
              </div>
            </a-form-item>
            <a-form-item label="一句话简介">
              <a-input v-model:value="form.summary" placeholder="30 字以内，简明描述模型核心能力" :maxlength="30" show-count />
            </a-form-item>
            <a-form-item label="适用场景">
              <a-textarea v-model:value="form.scenarios" :rows="3" placeholder="请描述模型的典型应用场景" :maxlength="200" show-count />
            </a-form-item>
            <a-form-item label="产品介绍">
              <a-textarea v-model:value="form.description" :rows="5" placeholder="详细介绍模型能力、技术原理、临床价值等" :maxlength="1000" show-count />
            </a-form-item>
          </a-form>
        </section>

        <!-- 3. 接入信息 -->
        <section id="sec-api" class="cloud-card p-[20px] mb-[14px] scroll-mt-[80px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">接入信息</span>
            <span class="text-[11px] text-text-tertiary">订阅方将凭此信息调用模型</span>
          </div>
          <a-form layout="vertical">
            <div class="grid grid-cols-2 gap-x-[16px]">
              <a-form-item label="平台网关地址">
                <a-input :value="gatewayUrl" disabled />
                <div class="text-[11px] text-text-tertiary mt-[4px]">平台对订阅方暴露的 API 统一入口，保存后自动生成；机构调用此地址，由平台鉴权计费后转发至后端</div>
              </a-form-item>
              <a-form-item label="后端回调地址" required>
                <a-input v-model:value="form.apiEndpoint" placeholder="如：https://your-server.com/api/v1/predict" />
                <div class="text-[11px] text-text-tertiary mt-[4px]">模型提供方自己的服务地址（公网可访问），平台网关将请求转发至此地址执行推理</div>
              </a-form-item>
              <a-form-item label="服务入口地址">
                <a-input v-model:value="form.entryUrl" placeholder="如：https://app.jsyb-ai.cn/deepseek-v4" />
                <div class="text-[11px] text-text-tertiary mt-[4px]">机构工作台点击「进入服务」跳转的前端应用地址</div>
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
              <a-textarea v-model:value="form.requestExample" :rows="4" placeholder="粘贴 curl 或 JSON 请求示例" />
            </a-form-item>
          </a-form>
        </section>

        <!-- 4. 提交确认 -->
        <section id="sec-confirm" class="cloud-card p-[20px] mb-[14px] scroll-mt-[80px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">提交确认</span>
          </div>
          <a-checkbox v-model:checked="form.agree">
            <span class="text-[12px] text-text-primary">
              我已确认所填信息真实有效，并同意
              <a class="text-primary">《AI 服务纳管协议》</a>
              <a class="text-primary">《数据安全合规承诺书》</a>
            </span>
          </a-checkbox>
          <a-alert type="success" show-icon class="mt-[14px]">
            <template #message>
              <span class="text-[12px]">管理员提交后默认审核通过，编目即时生效；已上架模型编辑后将触发版本评审流程</span>
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
import { ArrowLeftOutlined, PictureOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { modelCatalogMvpData } from '../../data';
import type { CapabilityCardData, RiskLevel } from '../../types';

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.query.id);

const sections = [
  { id: 'sec-basic', label: '基本信息' },
  { id: 'sec-desc', label: '服务描述' },
  { id: 'sec-api', label: '接入信息' },
  { id: 'sec-confirm', label: '提交确认' },
];

const activeSection = ref('sec-basic');

const form = ref({
  title: '',
  code: '',
  unit: '',
  category: '' as string,
  riskLevel: '' as string,
  billingMethod: '' as string,
  modalities: [] as string[],
  status: '对接测试中' as string,
  summary: '',
  scenarios: '',
  description: '',
  apiEndpoint: '',
  apiMethod: 'POST',
  authType: 'Bearer Token (AK/SK)',
  qps: 50,
  requestExample: '',
  entryUrl: '',
  logo: '',
  agree: false,
});

const categoryOptions = [
  { label: '通用基础大模型', value: '通用基础大模型' },
  { label: '医保自研专属大模型', value: '医保自研专属大模型' },
  { label: '医保基金监管共建模型', value: '医保基金监管共建模型' },
  { label: '省头部医疗机构共建垂直模型', value: '省头部医疗机构共建垂直模型' },
  { label: '市场化合规生态AI产品', value: '市场化合规生态AI产品' },
];
const unitOptions = computed(() => {
  const allUnits = [
    '推想医疗科技股份有限公司',
    '科亚医疗科技股份有限公司',
  ];
  return Array.from(new Set(allUnits)).map((u) => ({ label: u, value: u }));
});
function filterUnit(input: string, option: any) {
  return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
}
const riskOptions = [
  { label: '高风险', value: '高风险' },
  { label: '中风险', value: '中风险' },
  { label: '低风险', value: '低风险' },
];
const billingOptions = [
  { label: '按 Token', value: '按Token' },
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
const methodOptions = ['POST', 'GET', 'PUT'].map((m) => ({ label: m, value: m }));
const authOptions = ['Bearer Token (AK/SK)', 'API Key', 'OAuth 2.0'].map((a) => ({ label: a, value: a }));

const gatewayUrl = computed(() => {
  const editId = route.query.id as string | undefined;
  if (editId) {
    return `https://api.jsyb-ai.cn/v1/llm/${editId}/invoke`;
  }
  if (form.value.code) {
    return `https://api.jsyb-ai.cn/v1/llm/${form.value.code}/invoke`;
  }
  return '保存后自动生成';
});

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
    const m = modelCatalogMvpData.find((x) => x.id === route.query.id);
    if (m) {
      form.value.title = m.title;
      form.value.code = m.id.toUpperCase();
      form.value.unit = m.unit;
      form.value.category = m.category;
      form.value.riskLevel = m.riskLevel ?? '';
      form.value.billingMethod = m.billingMethod ?? '';
      form.value.modalities = [];
      form.value.status = m.status ?? '对接测试中';
      form.value.summary = m.description ?? '';
      form.value.scenarios = '';
      form.value.description = m.description ?? '';
      form.value.apiEndpoint = `https://your-server.com/api/v1/invoke`;
      form.value.entryUrl = m.entryUrl ?? '';
      form.value.agree = true;
    }
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});

function handleLogoUpload(file: File) {
  if (file.size > 2 * 1024 * 1024) {
    message.warning('LOGO 文件不能超过 2MB');
    return false;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    form.value.logo = e.target?.result as string;
  };
  reader.readAsDataURL(file);
  return false;
}

function onRemoveLogo() {
  form.value.logo = '';
}

function onBack() {
  router.push('/admin/model-catalog');
}

function validate(): string | null {
  if (!form.value.title) return '请填写模型名称';
  if (!form.value.code) return '请填写模型代码';
  if (!form.value.unit) return '请填写服务商名称';
  if (!form.value.status) return '请选择接入状态';
  if (!form.value.apiEndpoint) return '请填写后端回调地址';
  if (!form.value.agree) return '请勾选并同意纳管协议';
  return null;
}

function onSubmit() {
  const err = validate();
  if (err) {
    message.warning(err);
    return;
  }
  if (isEdit.value) {
    message.success(`模型「${form.value.title}」信息已更新`);
  } else {
    message.success(`模型「${form.value.title}」已新增，等待平台审核`);
  }
  router.push('/admin/model-catalog');
}
</script>
