<template>
  <div class="p-[20px]">
    <PageHeader title="工作台" description="平台运营全景总览，覆盖机构接入、服务上架、调用监测、异常预警与总账计费" />

    <!-- 顶部:管理员信息 + 待办事项 深蓝渐变卡片 -->
    <section class="rounded-[8px] overflow-hidden relative bg-gradient-to-br from-[#1a3060] via-[#15264a] to-[#0c1a33] shadow-[0_4px_16px_rgba(12,26,51,0.22)] mb-[14px]">
      <div class="relative grid grid-cols-[1fr_1px_2.2fr] items-center gap-0 py-[24px] px-[28px]">
        <!-- 左侧:管理员信息 -->
        <div class="pr-[24px]">
          <div class="text-[14px] text-white/60 mb-[6px]">你好</div>
          <div class="flex items-center gap-[8px]">
            <span class="text-[16px] font-medium text-white">{{ auth.userInfo?.name || '李四' }}</span>
            <span class="text-white/40">·</span>
            <span class="text-[14px] text-white/80 truncate">{{ auth.userInfo?.orgName || '江苏省医保局' }}</span>
          </div>
        </div>

        <!-- 分割线 -->
        <div class="w-[1px] h-[60px] bg-white/10 self-center"></div>

        <!-- 右侧:待办事项 -->
        <div class="pl-[24px]">
          <div class="text-white/90 text-[14px] font-semibold mb-[10px]">待办事项</div>
          <div class="grid grid-cols-4">
            <div
              v-for="(todo, idx) in todos"
              :key="todo.id"
              class="px-[16px] cursor-pointer transition-colors hover:bg-white/5 first:pl-0"
              :class="idx !== 0 ? 'border-l border-white/10' : ''"
              @click="router.push(todo.path)"
            >
              <div class="text-[12px] text-white/60 mb-[4px]">{{ todo.title }}</div>
              <div class="flex items-baseline gap-[4px]">
                <span class="font-num text-[32px] font-bold text-white leading-none">{{ todo.count }}</span>
                <span class="text-[12px] text-white/60">项</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 运营总览 -->
    <section class="cloud-card p-[18px] mb-[14px]">
      <div class="flex items-center justify-between mb-[16px]">
        <span class="text-[14px] font-semibold text-text-primary">运营总览</span>
        <div class="flex items-center gap-[4px] text-[12px] text-text-tertiary">
          <ClockCircleOutlined class="text-[12px]" />
          <span>更新时间：2025/06/11 11:43:13</span>
        </div>
      </div>
      <div class="grid grid-cols-4 gap-x-[20px] gap-y-[16px]">
        <div v-for="s in overviewStats" :key="s.label">
          <div class="text-[12px] text-text-tertiary mb-[6px]">{{ s.label }}</div>
          <div class="flex items-baseline gap-[4px]">
            <span class="font-num text-[24px] font-bold text-text-primary">{{ s.value }}</span>
            <span class="text-[12px] text-text-tertiary">{{ s.unit }}</span>
          </div>
          <div class="flex items-center gap-[2px] mt-[4px]">
            <template v-if="s.hint.includes('+')">
              <ArrowUpOutlined class="text-[10px] text-success" />
              <span class="text-[11px] text-success">{{ s.hint }}</span>
            </template>
            <template v-else-if="s.hint.includes('-')">
              <ArrowDownOutlined class="text-[10px] text-error" />
              <span class="text-[11px] text-error">{{ s.hint }}</span>
            </template>
            <span v-else class="text-[11px] text-text-tertiary">{{ s.hint }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 财务总览（合并总账统计 + 计费总览） -->
    <section class="cloud-card p-[16px]">
      <div class="flex items-center justify-between mb-[16px]">
        <div class="text-[14px] font-semibold text-text-primary">财务总览</div>
      </div>

      <!-- 关键指标横条 -->
      <div class="flex items-stretch mb-[18px]">
        <div v-for="(s, idx) in financeStats" :key="s.label" class="flex-1" :class="idx !== 0 ? 'pl-[20px] ml-[20px] border-l border-border-soft' : ''">
          <div class="text-[12px] text-text-tertiary">{{ s.label }}</div>
          <div class="font-num text-[22px] font-semibold mt-[4px]" :class="s.tone">{{ s.value }}</div>
          <div class="text-[11px] text-text-tertiary mt-[2px]">{{ s.hint }}</div>
        </div>
      </div>

      <div class="border-t border-border-soft pt-[16px]"></div>

      <!-- 图表网格 -->
      <div class="grid grid-cols-2 gap-x-[24px]">
        <!-- 按能力分类消耗分布 -->
        <div>
          <div class="text-[12px] font-semibold text-text-secondary mb-[12px]">按能力分类消耗分布</div>
          <div class="flex items-center gap-[16px]">
            <div class="relative w-[120px] h-[120px] flex-shrink-0">
              <svg viewBox="0 0 160 160" class="w-full h-full -rotate-90">
                <circle v-for="(seg, idx) in categorySegments" :key="idx"
                  cx="80" cy="80" r="60" fill="none"
                  :stroke="seg.color"
                  stroke-width="22"
                  :stroke-dasharray="`${seg.dash} ${circumference}`"
                  :stroke-dashoffset="seg.offset"
                />
              </svg>
              <div class="absolute inset-0 grid place-items-center">
                <div class="text-center">
                  <div class="font-num text-[14px] font-semibold text-text-primary">3.86亿</div>
                  <div class="text-[10px] text-text-tertiary">总消耗</div>
                </div>
              </div>
            </div>
            <div class="flex-1 space-y-[6px]">
              <div v-for="r in distributionByCategory" :key="r.name" class="flex items-center">
                <span class="w-[7px] h-[7px] rounded-sm flex-shrink-0" :style="{ background: r.color }"></span>
                <div class="flex-1 flex items-center justify-between ml-[6px]">
                  <span class="text-[11px] text-text-secondary truncate">{{ r.name }}</span>
                  <span class="font-num text-[11px] font-semibold text-text-primary">{{ r.ratio }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 按计费方式分布 -->
        <div>
          <div class="text-[12px] font-semibold text-text-secondary mb-[12px]">按计费方式分布</div>
          <div class="flex items-center gap-[16px]">
            <div class="relative w-[120px] h-[120px] flex-shrink-0">
              <svg viewBox="0 0 160 160" class="w-full h-full -rotate-90">
                <circle v-for="(seg, idx) in methodSegments" :key="idx"
                  cx="80" cy="80" r="60" fill="none"
                  :stroke="seg.color"
                  stroke-width="22"
                  :stroke-dasharray="`${seg.dash} ${circumference}`"
                  :stroke-dashoffset="seg.offset"
                />
              </svg>
              <div class="absolute inset-0 grid place-items-center">
                <div class="text-center">
                  <div class="font-num text-[14px] font-semibold text-text-primary">100%</div>
                  <div class="text-[10px] text-text-tertiary">计费占比</div>
                </div>
              </div>
            </div>
            <div class="flex-1 space-y-[6px]">
              <div v-for="r in distributionByMethod" :key="r.name" class="flex items-center">
                <span class="w-[7px] h-[7px] rounded-sm flex-shrink-0" :style="{ background: r.color }"></span>
                <div class="flex-1 flex items-center justify-between ml-[6px]">
                  <span class="text-[11px] text-text-secondary truncate">{{ r.name }}</span>
                  <span class="font-num text-[11px] font-semibold text-text-primary">{{ r.ratio }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { CalendarOutlined, DownOutlined, ArrowUpOutlined, ArrowDownOutlined, ClockCircleOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '../../stores/auth';
import { operationMetrics } from '../../data';
import { totalBillSummary } from '../../data/reconciliation';
import PageHeader from '../../components/common/PageHeader.vue';

const router = useRouter();
const auth = useAuthStore();

const metricDeltas = ['较昨日 +3 家', '较昨日 +6 项', '较昨日 +8.6%', '较昨日 +5.2%'];

const assetCategories = [
  { name: '模型/智能体', count: 26, delta: '已上架 18 · 测试中 8' },
  { name: '数据资源', count: 12, delta: '本期新增 2' },
  { name: '知识体系', count: 8, delta: '规则库 4 · 规范 4' },
  { name: '平台工具', count: 14, delta: '即将下线 1' },
];

const overviewStats = computed(() => [
  ...operationMetrics.map((m, idx) => ({
    label: m.label,
    value: m.value,
    unit: m.unit,
    hint: metricDeltas[idx] ?? '',
  })),
  ...assetCategories.map((c) => ({
    label: c.name,
    value: String(c.count),
    unit: '项',
    hint: c.delta,
  })),
]);

const todos = [
  { id: 't1', title: '服务准入待审核', count: 12, module: '服务准入管理 · 资质核验 8 项', path: '/admin/operations/service-access' },
  { id: 't2', title: '机构准入待审核', count: 4, module: '机构准入管理 · 资质核验中', path: '/admin/operations/org-access' },
  { id: 't3', title: '异常对账待处置', count: 8, module: '异常对账管理 · 核验中 3 条', path: '/admin/reconciliation/exceptions' },
  { id: 't4', title: '质量考核待复核', count: 5, module: '质量考核管理 · 投诉待处理', path: '/admin/operations/quality' },
];

const totalTodos = computed(() => todos.reduce((sum, t) => sum + t.count, 0));

// ============== 财务总览 ==============
const financeStats = [
  { label: '累计账单总额', value: totalBillSummary.totalAmount, hint: '跨周期累计', tone: 'text-text-primary' },
  { label: '累计已结算', value: totalBillSummary.settledAmount, hint: '已打款到 AI 厂商', tone: 'text-success' },
  { label: '累计待对账', value: totalBillSummary.pendingAmount, hint: '待机构确认', tone: 'text-warning' },
  { label: '本月词元消耗', value: '3.86亿', hint: '较上月 +12.56%', tone: 'text-primary' },
  { label: '词元总余量', value: '12.58亿', hint: '可用余量', tone: 'text-text-primary' },
];

const circumference = 2 * Math.PI * 60;

function buildSegments(items: { ratio: number; color: string }[]) {
  let cumulative = 0;
  return items.map((item) => {
    const dash = (item.ratio / 100) * circumference;
    const offset = -cumulative;
    cumulative += dash;
    return { dash, offset, color: item.color };
  });
}

const distributionByCategory = [
  { name: '通用基础大模型', ratio: 32, color: '#165DFF' },
  { name: '医保自研专属大模型', ratio: 22, color: '#13B8C6' },
  { name: '医保基金监管共建模型', ratio: 11, color: '#7C3AED' },
  { name: '省头部医疗机构共建垂直模型', ratio: 25, color: '#10B981' },
  { name: '市场化合规生态AI产品', ratio: 10, color: '#F59E0B' },
];

const distributionByMethod = [
  { name: '按Token', ratio: 58, color: '#165DFF' },
  { name: '按检查例次', ratio: 24, color: '#10B981' },
  { name: '按调用次数', ratio: 18, color: '#F59E0B' },
];

const categorySegments = computed(() => buildSegments(distributionByCategory));
const methodSegments = computed(() => buildSegments(distributionByMethod));
</script>
