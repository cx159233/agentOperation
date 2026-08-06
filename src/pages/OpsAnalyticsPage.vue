<template>
  <div class="p-[20px]">
    <PageHeader title="运行成效分析" description="业务分析视角：服务调用热度、质量评价与场景应用多维分析" />

    <!-- 三栏统计 -->
    <section class="grid grid-cols-4 gap-[14px] mb-[14px]">
      <StatCard
        v-for="stat in analyticsStats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :unit="stat.unit"
        :delta="stat.trend"
        :tone="stat.tone"
      />
    </section>

    <!-- 服务热度分析 -->
    <section class="cloud-card p-[16px] mb-[14px]">
      <div class="flex items-center justify-between mb-[12px]">
        <div class="flex items-center gap-[8px]">
          <div class="w-[4px] h-[18px] bg-primary rounded-full" />
          <span class="text-[15px] font-semibold text-text-primary">服务热度分析</span>
        </div>
        <a-radio-group v-model:value="heatRange" size="small">
          <a-radio-button value="week">近 7 日</a-radio-button>
          <a-radio-button value="month">近 30 日</a-radio-button>
        </a-radio-group>
      </div>
      <div class="grid grid-cols-[1.4fr_1fr] gap-[14px]">
        <TrendChart :data="heatTrend" />
        <div>
          <div class="text-[12px] text-text-secondary mb-[8px]">热度 TOP 服务</div>
          <div class="space-y-[8px]">
            <div v-for="(item, idx) in topHeat" :key="item.name" class="flex items-center gap-[10px] p-[8px] rounded-[6px] bg-bg">
              <span class="w-[22px] h-[22px] grid place-items-center rounded-full text-[11px] font-semibold" :class="rankClass(idx)">{{ idx + 1 }}</span>
              <span class="flex-1 text-[12px] font-semibold text-text-primary truncate">{{ item.name }}</span>
              <span class="font-num text-[13px] font-semibold text-text-primary">{{ item.heat }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 服务质量分析 -->
    <section class="cloud-card p-[16px] mb-[14px]">
      <div class="flex items-center justify-between mb-[12px]">
        <div class="flex items-center gap-[8px]">
          <div class="w-[4px] h-[18px] bg-primary rounded-full" />
          <span class="text-[15px] font-semibold text-text-primary">服务质量分析</span>
        </div>
        <span class="text-[12px] text-text-secondary">综合响应时长、成功率、用户评分</span>
      </div>
      <a-table :columns="qualityColumns" :data-source="qualityData" :pagination="false" size="middle">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'score'">
            <div class="flex items-center gap-[6px]">
              <span class="font-num text-[14px] font-semibold text-text-primary">{{ record.score }}</span>
              <a-progress :percent="record.score * 20" size="small" :show-info="false" style="width: 80px" />
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'successRate'">
            <a-tag :color="record.successRate >= 99 ? 'success' : record.successRate >= 95 ? 'warning' : 'error'" class="!m-0">{{ record.successRate }}%</a-tag>
          </template>
        </template>
      </a-table>
    </section>

    <!-- 场景应用分析 -->
    <section class="cloud-card p-[16px]">
      <div class="flex items-center justify-between mb-[12px]">
        <div class="flex items-center gap-[8px]">
          <div class="w-[4px] h-[18px] bg-primary rounded-full" />
          <span class="text-[15px] font-semibold text-text-primary">场景应用分析</span>
        </div>
        <span class="text-[12px] text-text-secondary">按应用场景统计调用分布</span>
      </div>
      <div class="grid grid-cols-2 gap-[14px]">
        <div>
          <UsageDonut :data="scenarioShare" />
        </div>
        <div>
          <div class="text-[12px] text-text-secondary mb-[8px]">场景调用 TOP</div>
          <div class="space-y-[8px]">
            <div v-for="item in scenarioShare" :key="item.name" class="flex items-center gap-[10px] p-[8px] rounded-[6px] bg-bg">
              <span class="w-[10px] h-[10px] rounded-sm" :style="{ background: item.color }" />
              <span class="flex-1 text-[12px] font-semibold text-text-primary">{{ item.name }}</span>
              <span class="font-num text-[13px] font-semibold text-text-secondary">{{ item.value }}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TrendChart from '../components/dashboard/TrendChart.vue';
import UsageDonut from '../components/dashboard/UsageDonut.vue';
import PageHeader from '../components/common/PageHeader.vue';
import StatCard from '../components/common/StatCard.vue';

const heatRange = ref<'week' | 'month'>('week');

const analyticsStats = [
  { label: '总调用次数', value: '1.84M', unit: '次', trend: '环比 +12.5%', tone: 'primary' as const },
  { label: '平均响应时长', value: '1.2', unit: 's', trend: '环比 -0.1s', tone: 'default' as const },
  { label: '成功率', value: '99.8', unit: '%', trend: '健康度优秀', tone: 'success' as const },
  { label: '用户满意度', value: '4.8', unit: '/5.0', trend: '稳定', tone: 'default' as const },
];

const heatTrend = [
  { month: '周一', tokens: 220, services: 18 },
  { month: '周二', tokens: 280, services: 22 },
  { month: '周三', tokens: 240, services: 20 },
  { month: '周四', tokens: 320, services: 25 },
  { month: '周五', tokens: 360, services: 28 },
  { month: '周六', tokens: 180, services: 14 },
  { month: '周日', tokens: 150, services: 12 },
];

const topHeat = [
  { name: 'Deepseek标准对话模型（V4）', heat: '286k' },
  { name: '山海知医5.0大模型', heat: '254k' },
  { name: '肺结节CT图像辅助检测', heat: '231k' },
  { name: '电子病历质控智能体', heat: '219k' },
  { name: '糖尿病视网膜病变模型', heat: '190k' },
];

const qualityColumns = [
  { title: '服务名称', dataIndex: 'name', key: 'name' },
  { title: '分类', dataIndex: 'category', key: 'category', width: 180 },
  { title: '平均响应', dataIndex: 'latency', key: 'latency', width: 120 },
  { title: '成功率', dataIndex: 'successRate', key: 'successRate', width: 120 },
  { title: '本月调用', dataIndex: 'count', key: 'count', width: 120 },
  { title: '综合评分', dataIndex: 'score', key: 'score', width: 180 },
];

const qualityData = [
  { key: '1', name: 'Deepseek标准对话模型（V4）', category: '通用基础大模型', latency: '0.8s', successRate: 99.9, count: '52,180', score: 4.9 },
  { key: '2', name: '山海知医5.0大模型', category: '医保自研专属大模型', latency: '1.2s', successRate: 99.5, count: '38,920', score: 4.8 },
  { key: '3', name: '肺结节CT图像辅助检测', category: '省头部医疗机构共建垂直模型', latency: '2.1s', successRate: 98.2, count: '1,840', score: 4.6 },
  { key: '4', name: '电子病历质控智能体', category: '市场化合规生态AI产品', latency: '1.5s', successRate: 99.1, count: '12,560', score: 4.7 },
  { key: '5', name: '高值耗材智能比对智能体', category: '医保基金监管共建模型', latency: '1.8s', successRate: 96.5, count: '640', score: 4.2 },
];

const scenarioShare = [
  { name: '医保监管', value: 28.6, color: '#165DFF' },
  { name: '辅助诊断', value: 24.5, color: '#3B82C7' },
  { name: '疾病筛查', value: 18.7, color: '#13B8C6' },
  { name: '电子病历', value: 14.3, color: '#10B981' },
  { name: '健康筛查', value: 8.6, color: '#F59E0B' },
  { name: '其他场景', value: 5.3, color: '#94A3B8' },
];

function rankClass(idx: number) {
  if (idx === 0) return 'bg-primary text-white';
  if (idx === 1) return 'bg-primary/70 text-white';
  if (idx === 2) return 'bg-primary/40 text-white';
  return 'bg-border text-text-secondary';
}
</script>
