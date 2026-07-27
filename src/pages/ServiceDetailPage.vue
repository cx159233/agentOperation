<template>
  <div class="p-[20px]">
    <!-- 顶部返回条 -->
    <div class="mb-[14px]">
      <router-link to="/service-hall" class="inline-flex items-center gap-[6px] text-[13px] font-semibold text-primary hover:opacity-80">
        <ArrowLeftOutlined class="text-[14px]" />
        <span>返回 AI 服务市场</span>
      </router-link>
    </div>

    <!-- 服务详情卡片 -->
    <section class="cloud-card p-[20px]">
      <div class="flex items-start justify-between border-b border-border pb-[16px]">
        <div class="flex-1 min-w-0">
          <div class="flex gap-[8px] mb-[10px] flex-wrap">
            <a-tag :color="categoryColor" class="!m-0 !text-[12px]">{{ service.category }}</a-tag>
            <a-tag v-for="tag in service.tags" :key="tag" class="!m-0 !text-[12px]">{{ tag }}</a-tag>
            <a-tag :color="riskTagColor" class="!m-0 !text-[12px]">风险等级：{{ service.riskLevel }}</a-tag>
          </div>
          <h1 class="text-[22px] font-semibold text-text-primary">{{ service.title }}</h1>
          <p class="mt-[8px] text-[13px] text-text-secondary">
            研发单位：{{ service.unit }}｜接入状态：{{ service.status }}｜计费方式：{{ service.billingMethod }}
          </p>
        </div>
        <div class="flex gap-[10px] shrink-0">
          <a-button type="primary" size="large" class="!w-[110px]" @click="onOpen">立即开通</a-button>
        </div>
      </div>
    </section>
    <section class="cloud-card p-[16px] mt-[14px]">
      <a-tabs>
        <a-tab-pane key="basic" tab="基础信息">
          <a-descriptions bordered :column="3" size="small">
            <a-descriptions-item label="服务ID">{{ service.id }}</a-descriptions-item>
            <a-descriptions-item label="服务归属">{{ detail.basic.服务归属 }}</a-descriptions-item>
            <a-descriptions-item label="接入状态">
              <a-badge :status="statusBadge" :text="detail.basic.接入状态" />
            </a-descriptions-item>
            <a-descriptions-item label="能力分类">{{ service.category }}</a-descriptions-item>
            <a-descriptions-item label="计费方式">{{ service.billingMethod ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="风险等级">
              <a-tag :color="riskTagColor" class="!m-0 !text-[12px]">{{ service.riskLevel }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="能力类型" :span="3">
              <a-tag v-for="t in detail.basic.能力类型" :key="t" color="blue" class="!mr-[4px] !mb-[4px]">{{ t }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="适用范围" :span="3">
              <a-tag v-for="s in detail.basic.适用范围" :key="s" class="!mr-[4px] !mb-[4px]">{{ s }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="资质标签" :span="3">
              <a-tag v-for="q in detail.basic.资质标签" :key="q" color="cyan" class="!mr-[4px] !mb-[4px]">{{ q }}</a-tag>
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
        <a-tab-pane key="pricing" tab="词元计量规则">
          <div class="flex items-center justify-between mb-[12px]">
            <span class="text-[12px] text-text-secondary">计量规则版本号将绑定每次调用明细与对账账单</span>
            <a-tag color="blue" class="!m-0 !text-[11px]">规则版本：BILL-RULE-2024-Q2</a-tag>
          </div>
          <a-descriptions bordered :column="3" size="small">
            <a-descriptions-item label="计量方式">{{ service.billingMethod ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="单价">
              <span class="font-num text-primary font-semibold">{{ pricing.unitPrice }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="付费方式">{{ pricing.paymentMethod }}</a-descriptions-item>
          </a-descriptions>
          <a-alert class="!mt-[10px]" type="info" show-icon>
            <template #message>
              <span class="text-[12px]">
                本服务适用 <strong>{{ pricing.paymentMethod }}</strong> 付费方式，调用按 <strong>{{ service.billingMethod }}</strong> 实时计量；
                计费规则版本号将绑定每次调用明细与对账账单，确保对账可追溯。
              </span>
            </template>
          </a-alert>
        </a-tab-pane>
        <a-tab-pane key="qualification" tab="资质信息">
          <a-table :columns="qualificationColumns" :data-source="qualificationData" :pagination="false" size="middle">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'status'">
                <a-badge :status="qualificationBadge(record.status)" :text="record.status" />
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </section>

    <!-- 调用示例 -->
    <section class="cloud-card p-[16px] mt-[14px]">
      <div class="flex items-center gap-[8px] mb-[12px]">
        <div class="w-[3px] h-[16px] bg-primary rounded-full" />
        <span class="text-[15px] font-semibold text-text-primary">调用示例</span>
      </div>
      <div class="grid grid-cols-2 gap-[14px]">
        <div>
          <div class="text-[12px] font-semibold text-text-secondary mb-[6px]">输入示例</div>
          <pre class="bg-[#0B1120] text-white/90 text-[12px] leading-[1.7] p-[12px] rounded-[6px] overflow-x-auto whitespace-pre font-num">{{ detail.trial.inputExample }}</pre>
        </div>
        <div>
          <div class="text-[12px] font-semibold text-text-secondary mb-[6px]">输出示例</div>
          <pre class="bg-[#0B1120] text-white/90 text-[12px] leading-[1.7] p-[12px] rounded-[6px] overflow-x-auto whitespace-pre font-num">{{ detail.trial.outputExample }}</pre>
        </div>
      </div>
      <div class="mt-[14px]">
        <div class="text-[12px] font-semibold text-text-secondary mb-[8px]">典型业务流程</div>
        <a-steps :current="detail.trial.workflow.length" size="small" direction="vertical">
          <a-step v-for="(step, idx) in detail.trial.workflow" :key="idx" :title="`步骤 ${idx + 1}`" :description="step" />
        </a-steps>
      </div>
    </section>

    <!-- 试点案例 -->
    <section class="cloud-card p-[16px] mt-[14px]">
      <div class="flex items-center justify-between mb-[12px]">
        <div class="flex items-center gap-[8px]">
          <div class="w-[3px] h-[16px] bg-primary rounded-full" />
          <span class="text-[15px] font-semibold text-text-primary">试点案例</span>
        </div>
        <a-tag color="purple" class="!m-0 !text-[11px]">已纳入 {{ pilotCases.length }} 个试点项目</a-tag>
      </div>
      <div class="space-y-[10px]">
        <div v-for="(pc, idx) in pilotCases" :key="idx" class="rounded-[8px] border border-border-soft p-[12px]">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-[6px]">
              <a-tag color="purple" class="!m-0 !text-[10px]">{{ pc.pilotId }}</a-tag>
              <span class="text-[13px] font-semibold text-text-primary">{{ pc.pilotName }}</span>
              <a-tag :color="pc.status === '进行中' ? 'processing' : 'success'" class="!m-0 !text-[10px]">{{ pc.status }}</a-tag>
            </div>
            <span class="text-[11px] text-text-tertiary">{{ pc.period }}</span>
          </div>
          <p class="text-[12px] text-text-secondary mt-[8px] leading-[18px]">{{ pc.note }}</p>
        </div>
      </div>
    </section>

    <!-- 平台评价 -->
    <section class="cloud-card p-[16px] mt-[14px]">
      <div class="flex items-center justify-between mb-[12px]">
        <div class="flex items-center gap-[8px]">
          <div class="w-[3px] h-[16px] bg-primary rounded-full" />
          <span class="text-[15px] font-semibold text-text-primary">用户评价</span>
        </div>
        <span class="text-[11px] text-text-tertiary">基于 {{ evaluationSummary.total }} 条评价 · 好评率 {{ evaluationSummary.positiveRate }}%</span>
      </div>
      <div class="flex items-start gap-[16px] mb-[14px]">
        <div class="flex items-center gap-[8px] shrink-0">
          <span class="text-[36px] font-semibold font-num text-primary">{{ evaluationSummary.avg }}</span>
          <div>
            <div class="flex gap-[2px]">
              <StarFilled v-for="n in 5" :key="n" class="text-[14px]" :class="n <= Math.round(evaluationSummary.avg) ? 'text-primary' : 'text-border'" />
            </div>
            <div class="text-[11px] text-text-secondary mt-[2px]">综合评分</div>
          </div>
        </div>
        <div class="flex-1 grid grid-cols-4 gap-[10px] border-l border-border-soft pl-[16px]">
          <div v-for="(v, k) in evaluationSummary.dimensions" :key="k" class="text-center">
            <div class="text-[11px] text-text-tertiary">{{ k }}</div>
            <div class="mt-[4px] flex items-center justify-center gap-[2px]">
              <a-rate :value="v" disabled allow-half style="font-size: 12px" />
              <span class="text-[12px] font-semibold text-text-primary">{{ v.toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 评价列表 -->
      <div class="space-y-[8px]">
        <div v-for="(ev, idx) in evaluationList" :key="idx" class="rounded-[6px] bg-bg-soft p-[10px]">
          <div class="flex items-center justify-between mb-[4px]">
            <div class="flex items-center gap-[6px]">
              <span class="text-[12px] font-semibold text-text-primary">{{ ev.org }}</span>
              <a-rate :value="ev.rating" disabled allow-half style="font-size: 11px" />
              <span class="text-[11px] text-text-tertiary">{{ ev.time }}</span>
            </div>
            <a-tag v-for="t in ev.tags" :key="t" color="blue" class="!m-0 !text-[10px]">{{ t }}</a-tag>
          </div>
          <p class="text-[12px] text-text-secondary leading-[18px]">{{ ev.content }}</p>
          <div v-if="ev.reply" class="mt-[6px] rounded-[4px] border-l-2 border-primary/40 pl-[8px] text-[11px] text-text-tertiary">
            <strong class="text-primary">开发者回复：</strong>{{ ev.reply }}
          </div>
        </div>
      </div>
    </section>

    <!-- 相关推荐 -->
    <section class="cloud-card p-[16px] mt-[14px]">
      <div class="flex items-center gap-[8px] mb-[12px]">
        <div class="w-[3px] h-[16px] bg-primary rounded-full" />
        <span class="text-[15px] font-semibold text-text-primary">相关推荐</span>
      </div>
      <a-tabs>
        <a-tab-pane key="category" :tab="`同类（${service.category}）`">
          <div class="grid grid-cols-3 gap-[10px]">
            <router-link v-for="rel in relatedByCategory" :key="rel.id" :to="`/service-hall/${rel.id}`" class="block rounded-[8px] border border-border-soft p-[10px] hover:border-primary hover:shadow-card transition">
              <div class="text-[12px] font-semibold text-text-primary">{{ rel.title }}</div>
              <div class="text-[11px] text-text-tertiary mt-[2px]">{{ rel.unit }}</div>
              <div class="mt-[4px] flex items-center gap-[4px]">
                <a-tag class="!m-0 !text-[10px]">{{ rel.billingMethod }}</a-tag>
                <a-tag :color="rel.riskLevel === '高风险' ? 'error' : rel.riskLevel === '中风险' ? 'warning' : 'success'" class="!m-0 !text-[10px]">{{ rel.riskLevel }}</a-tag>
              </div>
            </router-link>
          </div>
        </a-tab-pane>
        <a-tab-pane key="scene" :tab="`同场景`">
          <div class="grid grid-cols-3 gap-[10px]">
            <router-link v-for="rel in relatedByScene" :key="rel.id" :to="`/service-hall/${rel.id}`" class="block rounded-[8px] border border-border-soft p-[10px] hover:border-primary hover:shadow-card transition">
              <div class="text-[12px] font-semibold text-text-primary">{{ rel.title }}</div>
              <div class="text-[11px] text-text-tertiary mt-[2px]">{{ rel.unit }}</div>
              <div class="mt-[4px] flex items-center gap-[4px]">
                <a-tag class="!m-0 !text-[10px]">{{ rel.category }}</a-tag>
                <a-tag class="!m-0 !text-[10px]">{{ rel.billingMethod }}</a-tag>
              </div>
            </router-link>
          </div>
        </a-tab-pane>
        <a-tab-pane key="developer" :tab="`同开发者`">
          <div class="grid grid-cols-3 gap-[10px]">
            <router-link v-for="rel in relatedByDeveloper" :key="rel.id" :to="`/service-hall/${rel.id}`" class="block rounded-[8px] border border-border-soft p-[10px] hover:border-primary hover:shadow-card transition">
              <div class="text-[12px] font-semibold text-text-primary">{{ rel.title }}</div>
              <div class="text-[11px] text-text-tertiary mt-[2px]">{{ rel.category }}</div>
              <div class="mt-[4px] flex items-center gap-[4px]">
                <a-tag class="!m-0 !text-[10px]">{{ rel.billingMethod }}</a-tag>
                <a-tag :color="rel.riskLevel === '高风险' ? 'error' : rel.riskLevel === '中风险' ? 'warning' : 'success'" class="!m-0 !text-[10px]">{{ rel.riskLevel }}</a-tag>
              </div>
            </router-link>
          </div>
        </a-tab-pane>
      </a-tabs>
    </section>

    <!-- 立即开通弹窗 -->
    <a-modal v-model:open="openModal.visible" title="开通服务" @ok="confirmOpen" ok-text="提交开通申请" cancel-text="取消" :width="560">
      <template v-if="service">
        <div class="rounded-[6px] bg-bg p-[10px] mb-[14px]">
          <div class="text-[13px] font-semibold text-text-primary">{{ service.title }}</div>
          <div class="text-[11px] text-text-secondary mt-[2px]">{{ service.category }} · {{ service.billingMethod }} · {{ service.riskLevel }}</div>
        </div>
        <a-form layout="vertical">
          <a-form-item label="订阅周期" required>
            <a-radio-group v-model:value="openModal.period">
              <a-radio-button value="1年">1 年</a-radio-button>
              <a-radio-button value="2年">2 年（9.5 折）</a-radio-button>
              <a-radio-button value="3年">3 年（9 折）</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <div class="grid grid-cols-2 gap-[12px]">
            <a-form-item label="使用范围" required>
              <a-select v-model:value="openModal.scope" placeholder="请选择使用范围">
                <a-select-option value="全院">全院</a-select-option>
                <a-select-option value="门诊+住院">门诊+住院</a-select-option>
                <a-select-option value="指定科室">指定科室</a-select-option>
                <a-select-option value="互联网医院">互联网医院</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="额度方式" required>
              <a-radio-group v-model:value="openModal.billingType">
                <a-radio-button value="package">按词元包</a-radio-button>
                <a-radio-button value="quota">自定义额度</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </div>
          <a-form-item v-if="openModal.billingType === 'package'" label="词元包" required>
            <a-select v-model:value="openModal.package" placeholder="请选择词元包">
              <a-select-option v-for="pkg in tokenPackages" :key="pkg.name" :value="pkg.name">{{ pkg.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-else label="申请额度" required>
            <a-input v-model:value="openModal.quota" :placeholder="quotaPlaceholder" />
          </a-form-item>
          <a-form-item label="用途说明" required>
            <a-textarea v-model:value="openModal.purpose" :rows="3" placeholder="请描述本机构使用该服务的具体业务场景与预期效果" />
          </a-form-item>
          <div class="grid grid-cols-2 gap-[12px]">
            <a-form-item label="联系人" required>
              <a-input v-model:value="openModal.contactName" placeholder="请输入联系人姓名" />
            </a-form-item>
            <a-form-item label="联系电话" required>
              <a-input v-model:value="openModal.contactPhone" placeholder="请输入手机号" />
            </a-form-item>
          </div>
          <a-form-item required>
            <a-checkbox v-model:checked="openModal.agreed">
              我已阅读并同意 <a class="text-primary">《AI 服务接入协议》</a> 与 <a class="text-primary">《数据安全使用承诺书》</a>
            </a-checkbox>
          </a-form-item>
          <a-alert type="info" show-icon message="提交后平台将在 3 个工作日内审核，审核通过后即可在「服务订阅管理」中查看调用凭证，并可在调用详情抽屉中为各科室分配子账户额度" />
        </a-form>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { ArrowLeftOutlined, StarFilled } from '@ant-design/icons-vue';
import { capabilityGroups, serviceCategories, tokenPackages } from '../data';
import { getServiceDetail } from '../data/serviceDetails';
import { useAuthStore } from '../stores/auth';
import type { CapabilityCardData, RiskLevel, ServiceCategory } from '../types';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

function ensureAuth(): boolean {
  if (!auth.isAuthenticated) {
    message.warning('请先登录后再进行操作');
    router.push({ path: '/login', query: { redirect: route.fullPath } });
    return false;
  }
  if (auth.role !== 'org') {
    message.info(`当前角色为「${auth.userInfo?.roleLabel}」，仅机构用户可订阅服务`);
    return false;
  }
  return true;
}

const allServices = computed<{ card: CapabilityCardData; groupTitle: string; badge: string }[]>(() =>
  capabilityGroups.flatMap((group) =>
    group.columns.flatMap((column) => column.items.map((item) => ({ card: item, groupTitle: group.title, badge: group.badge }))),
  ),
);

const service = computed<CapabilityCardData>(() => {
  const id = route.params.id as string | undefined;
  const found = allServices.value.find((item) => item.card.id === id);
  return found?.card ?? allServices.value[0]?.card;
});

const detail = computed(() => getServiceDetail(service.value.id, service.value));

const categoryColor = computed(() => {
  const cat = serviceCategories.find((c) => c.id === service.value.category);
  return cat?.color ?? '#165DFF';
});

const riskTagColor = computed<'error' | 'warning' | 'success'>(() => {
  const lvl: RiskLevel | undefined = service.value.riskLevel;
  if (lvl === '高风险') return 'error';
  if (lvl === '中风险') return 'warning';
  return 'success';
});

const statusBadge = computed<'success' | 'processing' | 'default'>(() => {
  const s = service.value.status;
  if (s === '已上线使用') return 'success';
  if (s === '对接上线中') return 'processing';
  return 'default';
});

const scopeLabel = computed(() => {
  const cat: ServiceCategory = service.value.category;
  if (cat === '省头部医疗机构共建垂直模型') return '医院临床科室';
  if (cat === '医保基金监管共建模型') return '医保监管部门';
  return '试点机构';
});

const qualificationColumns = [
  { title: '证照类型', dataIndex: 'type', key: 'type', width: 220 },
  { title: '证书编号', dataIndex: 'number', key: 'number' },
  { title: '颁发机构', dataIndex: 'issuedBy', key: 'issuedBy' },
  { title: '有效期至', dataIndex: 'validUntil', key: 'validUntil', width: 130 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 110 },
];

const qualificationData = computed(() =>
  detail.value.qualifications.map((q, idx) => ({ key: idx, ...q })),
);

function qualificationBadge(status: string): 'success' | 'warning' | 'error' {
  if (status === '有效') return 'success';
  if (status === '即将到期') return 'warning';
  return 'error';
}

// 计量规则
const pricing = computed(() => {
  const m = service.value.billingMethod ?? '';
  const cat = service.value.category;
  if (m.includes('Token')) {
    return {
      unitPrice: '¥ 0.004 / 千词元',
      paymentMethod: cat === '医保自研专属大模型' || cat === '医保基金监管共建模型' ? '财政统购 + 套餐预购' : '套餐预购 + 专项经费',
    };
  }
  if (m.includes('检查例次')) {
    return {
      unitPrice: '¥ 18.50 / 检查例次',
      paymentMethod: '医保补贴 + 专项经费',
    };
  }
  return {
    unitPrice: '¥ 2.50 / 调用次数',
    paymentMethod: '套餐预购 + 科研公益免费',
  };
});

// 试点案例
const pilotCases = computed(() => {
  const id = service.value.id;
  const map: Record<string, Array<{
    pilotId: string;
    pilotName: string;
    status: string;
    period: string;
    metrics: Array<{ label: string; value: string; tone: string }>;
    note: string;
  }>> = {
    'lungnodule-ct': [
      {
        pilotId: 'PIL-2024-002',
        pilotName: '鼓楼医院肺结节AI筛查多中心试点',
        status: '进行中',
        period: '2024-05 ~ 2024-11',
        metrics: [
          { label: '筛查例次', value: '4,260', tone: 'text-primary' },
          { label: '敏感度', value: '94.2%', tone: 'text-success' },
          { label: '特异度', value: '88.6%', tone: 'text-success' },
          { label: '阅片提速', value: '3.2x', tone: 'text-warning' },
        ],
        note: '多中心数据验证敏感度较 v2.3 提升 3.8 个百分点，6mm 以下结节召回率显著改善，已纳入试点推广建议。',
      },
    ],
    'deepseek-v4': [
      {
        pilotId: 'PIL-2024-001',
        pilotName: '南京市DRG/DIP智能审核试点',
        status: '进行中',
        period: '2024-03 ~ 2024-12',
        metrics: [
          { label: '调用次数', value: '52,180', tone: 'text-primary' },
          { label: '审核准确率', value: '92.4%', tone: 'text-success' },
          { label: '人工复核率', value: '7.6%', tone: 'text-warning' },
          { label: '平均时延', value: '1.2s', tone: 'text-text-secondary' },
        ],
        note: 'DRG/DIP 智能审核场景调用稳定，对违规分组识别准确率 92.4%，已建议在全省三甲医院推广。',
      },
    ],
  };
  return map[id] ?? [
    {
      pilotId: 'PIL-2024-003',
      pilotName: '常州市基层AI健康助手试点',
      status: '进行中',
      period: '2024-06 ~ 2025-05',
      metrics: [
        { label: '累计调用', value: '184,200', tone: 'text-primary' },
        { label: '覆盖人数', value: '12,800', tone: 'text-success' },
        { label: '满意度', value: '4.6/5', tone: 'text-success' },
        { label: '导诊准确率', value: '89.3%', tone: 'text-warning' },
      ],
      note: '基层试点中表现良好，老年患者操作友好性高，导诊准确率达预期，建议扩展至全省基层医疗机构。',
    },
  ];
});

// 评价
const evaluationSummary = computed(() => ({
  avg: 4.6,
  total: 36,
  positiveRate: 94,
  dimensions: { 准确性: 4.7, 稳定性: 4.5, 响应时效: 4.4, 业务适配性: 4.6 },
}));

const evaluationList = computed(() => [
  { org: '南京鼓楼医院·放射科', rating: 5, time: '2024-07-15 14:20', tags: ['读片准确', '响应快'], content: 'AI 辅助读片对6mm以下结节识别精度不错，建议增加对磨玻璃结节的特征描述。', reply: '感谢反馈，研发团队已规划下一版本加强 GGO 特征识别，预计 Q3 上线。' },
  { org: '常州市人民医院·信息科', rating: 4, time: '2024-07-12 09:15', tags: ['稳定', '高峰偶有延迟'], content: '工作日 10-11 点高峰期接口响应略慢，建议优化并发能力。', reply: '已优化并发资源池，建议错峰使用。' },
  { org: '江苏省人民医院·医保办', rating: 5, time: '2024-07-10 16:48', tags: ['合规性强', '报表清晰'], content: '医保审核报表分类清晰，对违规分组识别准确，建议增加自定义规则配置。', reply: '' },
  { org: '东南大学附属中大医院·科研处', rating: 4, time: '2024-07-08 11:30', tags: ['接口规范', '文档完整'], content: '接口文档完整，调用示例清晰，对接效率高。希望增加批量调用接口。', reply: '批量调用接口已在 v2.4 规划中，Q4 上线。' },
]);

// 相关推荐
const relatedByCategory = computed(() =>
  allServices.value
    .filter((s) => s.card.category === service.value.category && s.card.id !== service.value.id)
    .slice(0, 6)
    .map((s) => s.card),
);

const relatedByScene = computed(() => {
  const myTags = new Set(service.value.tags ?? []);
  return allServices.value
    .filter((s) => s.card.id !== service.value.id && s.card.tags?.some((t) => myTags.has(t)))
    .slice(0, 6)
    .map((s) => s.card);
});

const relatedByDeveloper = computed(() =>
  allServices.value
    .filter((s) => s.card.unit === service.value.unit && s.card.id !== service.value.id)
    .slice(0, 6)
    .map((s) => s.card),
);

const quotaPlaceholder = computed(() => {
  const m = service.value.billingMethod ?? '';
  if (m.includes('Token')) return '如：5,000 万词元/月';
  if (m.includes('检查例次')) return '如：800 例/月';
  if (m.includes('调用次数')) return '如：3,000 次/月';
  return '请输入申请额度';
});

const openModal = ref({
  visible: false,
  period: '1年',
  billingType: 'package',
  package: '',
  scope: '',
  quota: '',
  purpose: '',
  contactName: '',
  contactPhone: '',
  agreed: false,
});

function onOpen() {
  if (!ensureAuth()) return;
  openModal.value = {
    visible: true,
    period: '1年',
    billingType: 'package',
    package: '',
    scope: '',
    quota: '',
    purpose: '',
    contactName: '',
    contactPhone: '',
    agreed: false,
  };
}

function confirmOpen() {
  const m = openModal.value;
  if (!m.scope || !m.purpose || !m.contactName || !m.contactPhone) {
    message.warning('请完整填写开通信息');
    return;
  }
  if (m.billingType === 'package' && !m.package) {
    message.warning('请选择词元包');
    return;
  }
  if (m.billingType === 'quota' && !m.quota) {
    message.warning('请填写申请额度');
    return;
  }
  if (!m.agreed) {
    message.warning('请阅读并同意接入协议');
    return;
  }
  message.success('开通申请已提交，平台将在 3 个工作日内反馈审核结果');
  openModal.value.visible = false;
}
</script>
