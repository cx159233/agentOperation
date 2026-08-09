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
        <a-button type="primary" @click="onSubmit">提交审核</a-button>
      </div>
    </div>

    <div class="max-w-[920px] mx-auto items-start">

      <!-- 主表单 -->
      <main class="flex-1 p-[20px] pl-0 max-w-[920px]">
        <a-form ref="formRef" :model="form" layout="vertical">
        <!-- 1. 基本信息 -->
        <section id="sec-basic" class="cloud-card p-[20px] mb-[14px] scroll-mt-[80px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">基本信息</span>
            <span class="text-[11px] text-text-tertiary">用于平台纳管与目录展示</span>
          </div>
          <div class="grid grid-cols-2 gap-x-[16px]">
            <a-form-item label="模型名称" name="title" :rules="[{ required: true, message: '请输入模型名称' }]">
              <a-input v-model:value="form.title" placeholder="如：肺结节CT图像辅助检测" :maxlength="40" show-count />
            </a-form-item>
            <a-form-item label="模型代码" name="code" :rules="[{ required: true, message: '请输入模型代码' }]">
              <a-input v-model:value="form.code" placeholder="如：LUNG-NUD-CT-001" :maxlength="30" show-count />
            </a-form-item>
            <a-form-item label="研发单位" name="unit" :rules="[{ required: true, message: '请选择研发单位' }]">
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
            <a-form-item label="统一社会信用代码">
              <a-input :value="unitCreditCode" disabled placeholder="选择研发单位后自动填入" />
            </a-form-item>
          </div>
        </section>

        <!-- 2. 服务描述 -->
        <section id="sec-desc" class="cloud-card p-[20px] mb-[14px] scroll-mt-[80px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">服务描述</span>
            <span class="text-[11px] text-text-tertiary">向订阅方与审核方说明模型能力</span>
          </div>
            <a-form-item label="LOGO">
              <div class="flex items-center gap-[14px]">
                <div class="relative w-[80px] h-[80px] flex-shrink-0">
                  <a-upload
                    :max-count="1"
                    :show-upload-list="false"
                    accept=".png,.jpg,.jpeg,.svg"
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
                <div class="text-[11px] text-text-tertiary">支持 PNG / JPG / JPEG / SVG / WebP，建议 256×256，≤ 2MB</div>
              </div>
            </a-form-item>
            <a-form-item label="一句话简介">
              <a-input v-model:value="form.summary" placeholder="30 字以内，简明描述模型核心能力" :maxlength="30" show-count />
            </a-form-item>
            <a-form-item label="适用场景">
              <a-select
                v-model:value="form.scenarios"
                mode="tags"
                placeholder="适用场景"
                :token-separators="[',']"
                :options="scenarioOptions"
              />
            </a-form-item>
            <a-form-item label="产品介绍">
              <div class="relative">
                <a-textarea v-model:value="form.description" :rows="5" placeholder="详细介绍模型能力、技术原理、临床价值等" :maxlength="1000" class="!pb-[28px]" />
                <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">
                  {{ form.description.length }}/1000
                </div>
              </div>
            </a-form-item>
        </section>

        <!-- 3. 调用说明 -->
        <section id="sec-api" class="cloud-card p-[20px] mb-[14px] scroll-mt-[80px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">调用说明</span>
            <span class="text-[11px] text-text-tertiary">平台调用与订阅方接入所需的接口信息</span>
          </div>
          <a-form-item label="前端入口地址">
              <a-input v-model:value="form.entryUrl" placeholder="如：https://app.jsyb-ai.cn/deepseek-v4" />
              <div class="text-[11px] text-text-tertiary mt-[4px]">机构工作台点击「进入服务」后跳转的页面，选填</div>
            </a-form-item>
            <a-form-item label="推送地址">
              <a-input v-model:value="form.pushUrl" placeholder="如：https://api.jsyb-ai.cn/v1/llm/deepseek-v4/chat" />
              <div class="text-[11px] text-text-tertiary mt-[4px]">平台调用该模型推理服务的接口地址</div>
            </a-form-item>
            <a-form-item label="推送查询地址">
              <a-input v-model:value="form.domain" placeholder="如：api.jsyb-ai.cn/v1/llm/deepseek-v4/chat" />
              <div class="text-[11px] text-text-tertiary mt-[4px]">推送结果查询地址，需要携带的参数需要和厂商进行沟通确认</div>
            </a-form-item>
        </section>

        <!-- 4. 数据要求 -->
        <section id="sec-scope" class="cloud-card p-[20px] mb-[14px] scroll-mt-[80px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">数据要求</span>
            <span class="text-[11px] text-text-tertiary">使用本模型进行推理需提供符合要求的数据</span>
          </div>
          <div class="grid grid-cols-2 gap-x-[16px]">
              <a-form-item label="配置类别">
                <a-select
                  v-model:value="form.configCategory"
                  :options="configCategoryOptions"
                  placeholder="请选择配置类别"
                  allow-clear
                />
                <div class="text-[11px] text-text-tertiary mt-[4px]">标注模型可处理的数据类别</div>
              </a-form-item>
              <a-form-item label="支持的检查模态" class="col-span-2">
                <a-select
                  v-model:value="form.modalities"
                  mode="tags"
                  placeholder="输入或选择检查模态，如：CT / MRI / X光"
                  :token-separators="[',']"
                  :options="modalityOptions"
                />
                <div class="text-[11px] text-text-tertiary mt-[4px]">模型支持的输入检查模态，调用方需按此提供数据</div>
              </a-form-item>
            </div>
            <a-form-item label="符合要求的数据说明">
              <div class="relative">
                <a-textarea
                  v-model:value="form.dataScope"
                  :rows="4"
                  placeholder="注明哪些数据符合模型输入要求，如：DICOM 格式的胸部 CT 影像、层厚 ≤ 2mm、像素间距 0.6~0.8mm 等"
                  :maxlength="500"
                  class="!pb-[28px]"
                />
                <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">
                  {{ form.dataScope.length }}/500
                </div>
              </div>
            </a-form-item>
        </section>

        </a-form>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { ArrowLeftOutlined, PictureOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { modelCatalogMvpData } from '../../data';
import type { CapabilityCardData, RiskLevel } from '../../types';

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.query.id);

const form = ref({
  title: '',
  code: '',
  unit: '',
  modalities: [] as string[],
  status: '' as string,
  summary: '',
  scenarios: [] as string[],
  description: '',
  curlExample: '',
  jsonBody: '',
  entryUrl: '',
  logo: '',
  domain: '',
  pushUrl: '',
  // 数据范围
  configCategory: undefined as string | undefined,
  dataScope: '',
});

const unitOptions = computed(() => {
  const allUnits = [
    '推想医疗科技股份有限公司',
    '深圳市旭东数字医学影像技术有限公司',
    '慧影医疗科技（北京）股份有限公司',
  ];
  return Array.from(new Set(allUnits)).map((u) => ({ label: u, value: u }));
});
function filterUnit(input: string, option: any) {
  return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
}
const statusOptions = [
  { label: '已上线使用', value: '已上线使用' },
  { label: '已下架', value: '已下架' },
];
const unitCreditCodeMap: Record<string, string> = {
  '推想医疗科技股份有限公司': '91110108MA002XL790',
  '深圳市旭东数字医学影像技术有限公司': '914403005700203962',
  '慧影医疗科技（北京）股份有限公司': '91110108335563403F',
};
const unitCreditCode = computed(() => unitCreditCodeMap[form.value.unit] || '');
const modalityOptions = ['CT', 'DR', 'DX'].map((m) => ({ label: m, value: m }));
const scenarioOptions = [{ label: '辅助诊断', value: '辅助诊断' }, { label: '三维建模', value: '三维建模' }];
const configCategoryOptions = [
  { label: '影像 (IMG)', value: 'img' },
];

onMounted(() => {
  if (route.query.id) {
    const m = modelCatalogMvpData.find((x) => x.id === route.query.id);
    if (m) {
      form.value.title = m.title;
      form.value.code = m.id.toUpperCase();
      form.value.unit = m.unit;
      form.value.modalities = [];
      form.value.status = m.status ?? '';
      form.value.summary = m.description ?? '';
      form.value.scenarios = m.tags ?? [];
      form.value.description = m.description ?? '';
      form.value.entryUrl = m.entryUrl ?? '';
    }
  }
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
  router.push('/admin/model-catalog-v2');
}

const formRef = ref();

async function onSubmit() {
  try {
    await formRef.value.validate();
  } catch {
    return;
  }
  if (isEdit.value) {
    message.success(`模型「${form.value.title}」信息已更新`);
  } else {
    message.success(`模型「${form.value.title}」已新增，等待平台审核`);
  }
  router.push('/admin/model-catalog-v2');
}
</script>
