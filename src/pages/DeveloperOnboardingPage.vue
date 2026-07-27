<template>
  <div class="bg-bg min-h-[calc(100vh-60px)]">
    <!-- Hero -->
    <section class="bg-[#0B1120] text-white py-[60px] px-[40px] relative overflow-hidden">
      <div class="absolute inset-0 opacity-[0.15] pointer-events-none">
        <div class="absolute -top-[60px] -right-[60px] w-[420px] h-[420px] rounded-full" style="background: radial-gradient(circle, #165DFF 0%, transparent 70%); filter: blur(40px);" />
        <div class="absolute bottom-[-100px] left-[20%] w-[380px] h-[380px] rounded-full" style="background: radial-gradient(circle, #13B8C6 0%, transparent 70%); filter: blur(50px);" />
      </div>
      <div class="absolute inset-0 opacity-[0.06] pointer-events-none" style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 56px 56px;" />
      <div class="relative max-w-[1200px] mx-auto">
        <div class="inline-flex items-center gap-[6px] px-[12px] py-[4px] rounded-full bg-white/10 border border-white/15 text-[12px] font-medium mb-[14px]">
          <span class="w-[6px] h-[6px] rounded-full bg-success animate-pulse" />
          开发者入驻
        </div>
        <h1 class="text-[36px] font-bold leading-[1.2]">加入江苏医保 AI 服务生态</h1>
        <p class="mt-[14px] text-[15px] text-white/75 leading-[1.8] max-w-[680px]">
          面向 AI 企业、科研机构、医疗机构自研团队。提交资质材料通过核验后，即可在平台上架您的 AI 模型与智能体服务，触达全省 128 家接入机构。
        </p>
        <div class="mt-[20px] flex gap-[14px]">
          <a-button type="primary" size="large" class="!h-[44px] !w-[150px] !bg-primary !border-primary !font-semibold" @click="scrollToForm">开始入驻</a-button>
          <a-button ghost size="large" class="!h-[44px] !w-[150px] !text-white !border-white/30 hover:!bg-white/10">入驻指南</a-button>
        </div>
      </div>
    </section>

    <!-- 流程说明 -->
    <section class="py-[36px] px-[40px] bg-surface border-b border-border-soft">
      <div class="max-w-[960px] mx-auto">
        <div class="text-[18px] font-semibold text-text-primary mb-[24px]">入驻流程</div>
        <div class="flex items-stretch">
          <template v-for="(step, idx) in steps" :key="step.title">
            <div class="flex-1 rounded-[8px] border border-border-soft bg-white p-[14px] flex items-center gap-[10px] hover:border-primary/30 hover:shadow-sm transition-all">
              <div class="w-[28px] h-[28px] rounded-[6px] bg-primary text-white grid place-items-center text-[13px] font-bold shrink-0">{{ idx + 1 }}</div>
              <div class="text-[13px] font-semibold text-text-primary">{{ step.title }}</div>
            </div>
            <div v-if="idx < steps.length - 1" class="flex items-center px-[8px]">
              <svg width="16" height="16" viewBox="0 0 16 16" class="text-text-tertiary">
                <path d="M6 4 L10 8 L6 12" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- 入驻表单 -->
    <section ref="formRef" class="py-[40px] px-[40px]">
      <div class="max-w-[960px] mx-auto cloud-card p-[28px]">
        <div class="text-[18px] font-semibold text-text-primary mb-[6px]">资质材料提交</div>
        <div class="text-[12px] text-text-secondary mb-[20px]">请如实填写以下信息，提交后将在 3 个工作日内反馈审核结果</div>

        <a-steps :current="currentStep" size="small" class="mb-[24px]">
          <a-step v-for="s in formSteps" :key="s.title" :title="s.title" />
        </a-steps>

        <!-- Step 1: 企业基础信息 -->
        <div v-show="currentStep === 0" class="space-y-[14px]">
          <div class="grid grid-cols-2 gap-[14px]">
            <a-form-item label="公司名称" required>
              <a-input v-model:value="form.company" placeholder="请输入公司全称" />
            </a-form-item>
            <a-form-item label="统一社会信用代码" required>
              <a-input v-model:value="form.creditCode" placeholder="18 位统一社会信用代码" />
            </a-form-item>
            <a-form-item label="法定代表人" required>
              <a-input v-model:value="form.legalPerson" placeholder="请输入法定代表人姓名" />
            </a-form-item>
            <a-form-item label="注册资本">
              <a-input v-model:value="form.registeredCapital" placeholder="如：5000 万元人民币" />
            </a-form-item>
            <a-form-item label="联系人姓名" required>
              <a-input v-model:value="form.contactName" placeholder="请输入联系人姓名" />
            </a-form-item>
            <a-form-item label="联系电话" required>
              <a-input v-model:value="form.contactPhone" placeholder="请输入手机号" />
            </a-form-item>
          </div>
        </div>

        <!-- Step 2: 资质材料 -->
        <div v-show="currentStep === 1" class="space-y-[14px]">
          <div class="grid grid-cols-2 gap-[14px]">
            <a-form-item label="营业执照" required>
              <a-upload :max-count="1" list-type="picture-card"><div><PlusOutlined /><div class="text-[12px] mt-[4px] text-text-secondary">上传</div></div></a-upload>
            </a-form-item>
            <a-form-item label="医疗器械注册证">
              <a-upload :max-count="3" list-type="picture-card"><div><PlusOutlined /><div class="text-[12px] mt-[4px] text-text-secondary">上传</div></div></a-upload>
            </a-form-item>
            <a-form-item label="算法备案">
              <a-upload :max-count="2" list-type="picture-card"><div><PlusOutlined /><div class="text-[12px] mt-[4px] text-text-secondary">上传</div></div></a-upload>
            </a-form-item>
            <a-form-item label="网信办备案">
              <a-upload :max-count="2" list-type="picture-card"><div><PlusOutlined /><div class="text-[12px] mt-[4px] text-text-secondary">上传</div></div></a-upload>
            </a-form-item>
            <a-form-item label="ISO 认证">
              <a-upload :max-count="3" list-type="picture-card"><div><PlusOutlined /><div class="text-[12px] mt-[4px] text-text-secondary">上传</div></div></a-upload>
            </a-form-item>
            <a-form-item label="其他资质">
              <a-upload :max-count="5" list-type="picture-card"><div><PlusOutlined /><div class="text-[12px] mt-[4px] text-text-secondary">上传</div></div></a-upload>
            </a-form-item>
          </div>
        </div>

        <!-- Step 3: 产品能力说明 -->
        <div v-show="currentStep === 2" class="space-y-[14px]">
          <div class="grid grid-cols-2 gap-[14px]">
            <a-form-item label="拟上架产品" required>
              <a-input v-model:value="form.productName" placeholder="如：肺结节 CT 辅助检测模型" />
            </a-form-item>
            <a-form-item label="能力分类" required>
              <a-select v-model:value="form.category" :options="categoryOptions" placeholder="请选择分类" />
            </a-form-item>
            <a-form-item label="风险等级" required>
              <a-select v-model:value="form.riskLevel" :options="riskOptions" placeholder="请选择风险等级" />
            </a-form-item>
            <a-form-item label="计费建议">
              <a-select v-model:value="form.billing" :options="billingOptions" placeholder="请选择计费方式" />
            </a-form-item>
          </div>
          <a-form-item label="适用场景">
            <a-textarea v-model:value="form.scenarios" :rows="3" placeholder="请描述产品的典型应用场景" />
          </a-form-item>
        </div>

        <!-- Step 4: 提交确认 -->
        <div v-show="currentStep === 3">
          <a-descriptions title="入驻信息确认" bordered :column="2" size="small">
            <a-descriptions-item label="公司名称">{{ form.company || '-' }}</a-descriptions-item>
            <a-descriptions-item label="信用代码">{{ form.creditCode || '-' }}</a-descriptions-item>
            <a-descriptions-item label="法人">{{ form.legalPerson || '-' }}</a-descriptions-item>
            <a-descriptions-item label="联系人">{{ form.contactName || '-' }} {{ form.contactPhone }}</a-descriptions-item>
            <a-descriptions-item label="拟上架产品">{{ form.productName || '-' }}</a-descriptions-item>
            <a-descriptions-item label="分类">{{ form.category || '-' }}</a-descriptions-item>
            <a-descriptions-item label="风险等级">{{ form.riskLevel || '-' }}</a-descriptions-item>
            <a-descriptions-item label="计费建议">{{ form.billing || '-' }}</a-descriptions-item>
            <a-descriptions-item label="适用场景" :span="2">{{ form.scenarios || '-' }}</a-descriptions-item>
          </a-descriptions>
          <a-alert class="mt-[14px]" type="info" show-icon message="提交后不可修改，请确认信息无误" />
        </div>

        <!-- 操作按钮 -->
        <div class="mt-[24px] flex justify-between">
          <a-button :disabled="currentStep === 0" @click="currentStep--">上一步</a-button>
          <div class="flex gap-[10px]">
            <a-button @click="onCancel">取消</a-button>
            <a-button v-if="currentStep < 3" type="primary" @click="nextStep">下一步</a-button>
            <a-button v-else type="primary" @click="onSubmit">提交入驻申请</a-button>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系方式 -->
    <section class="py-[40px] px-[40px] bg-surface border-t border-border-soft">
      <div class="max-w-[1200px] mx-auto grid grid-cols-3 gap-[20px]">
        <div v-for="contact in contacts" :key="contact.title" class="cloud-card cloud-card-hover p-[16px]">
          <div class="text-[14px] font-semibold text-text-primary mb-[6px]">{{ contact.title }}</div>
          <div class="text-[12px] text-text-secondary leading-[20px]">{{ contact.content }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { serviceCategories } from '../data';

const router = useRouter();
const formRef = ref<HTMLElement | null>(null);
const currentStep = ref(0);

const form = ref({
  company: '', creditCode: '', legalPerson: '', registeredCapital: '',
  contactName: '', contactPhone: '',
  productName: '', category: '', riskLevel: '', billing: '', scenarios: '',
});

const formSteps = [
  { title: '企业基础信息' },
  { title: '资质材料' },
  { title: '产品能力说明' },
  { title: '提交确认' },
];

const steps = [
  { title: '提交入驻申请' },
  { title: '资质核验' },
  { title: '技术测评' },
  { title: '完成入驻' },
];

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

const contacts = [
  { title: '商务合作', content: '邮箱：partner@jsyb-ai.cn\n电话：025-12345678' },
  { title: '技术支持', content: '邮箱：tech@jsyb-ai.cn\n工作日 9:00-18:00' },
  { title: '办公地址', content: '江苏省南京市建邺区江东中路 123 号\n医保数据赋能实验室' },
];

function scrollToForm() {
  formRef.value?.scrollIntoView({ behavior: 'smooth' });
}

function nextStep() {
  if (currentStep.value === 0) {
    if (!form.value.company || !form.value.creditCode || !form.value.contactName) {
      message.warning('请完整填写企业基础信息');
      return;
    }
  }
  if (currentStep.value === 2) {
    if (!form.value.productName || !form.value.category || !form.value.riskLevel) {
      message.warning('请完整填写产品能力说明');
      return;
    }
  }
  currentStep.value++;
}

function onCancel() {
  router.push('/portal');
}

function onSubmit() {
  message.success('入驻申请已提交，将在 3 个工作日内反馈审核结果');
  setTimeout(() => router.push('/portal'), 1500);
}
</script>
