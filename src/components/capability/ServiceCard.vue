<template>
  <article
    class="group cloud-card p-[14px] cursor-pointer flex flex-col h-[164px]"
    @click="$emit('click')"
  >
    <div class="flex items-start gap-[10px]">
      <div
        class="w-[40px] h-[40px] grid place-items-center rounded-[10px] shrink-0"
        :style="{ background: toneBg, color: toneColor }"
      >
        <component :is="iconComp" class="text-[22px]" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <h3 class="text-[14px] font-semibold text-text-primary truncate flex-1 mr-[6px]" :title="item.title">{{ item.title }}</h3>
          <div class="shrink-0">
            <a-tag v-if="item.status === '已上线使用'" color="success" class="!m-0 !text-[10px] !px-[5px] !leading-[14px]">已上线</a-tag>
            <a-tag v-else-if="item.status === '对接测试中'" color="warning" class="!m-0 !text-[10px] !px-[5px] !leading-[14px]">测试中</a-tag>
            <a-tag v-else color="processing" class="!m-0 !text-[10px] !px-[5px] !leading-[14px]">上线中</a-tag>
          </div>
        </div>
        
        <div class="mt-[6px] flex flex-wrap gap-[4px]">
          <span v-if="item.category" class="px-[6px] py-[2px] rounded-[4px] text-[10px] text-white" :style="{ backgroundColor: categoryColor }">{{ item.category }}</span>
          <span v-if="item.riskLevel" class="px-[6px] py-[2px] rounded-[4px] text-[10px] bg-bg-soft text-text-secondary">{{ item.riskLevel }}</span>
          <span v-for="tag in item.tags.slice(0, 2)" :key="tag" class="px-[6px] py-[2px] rounded-[4px] text-[10px] bg-bg-soft text-text-secondary">{{ tag }}</span>
        </div>
      </div>
    </div>

    <p class="mt-[8px] text-[12px] text-text-secondary line-clamp-2 leading-[1.5]">{{ item.description || '暂无描述' }}</p>

    <div class="mt-auto flex items-center justify-between">
      <span class="text-[11px] text-text-tertiary">{{ item.unit || '未知机构' }}</span>
      <button v-if="!hideDetail" class="opacity-0 group-hover:opacity-100 text-[12px] font-medium text-primary hover:text-primary-dark transition-all duration-200 flex items-center gap-[2px]">
        查看详情 <RightOutlined class="text-[10px]" />
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  ExperimentOutlined,
  FileTextOutlined,
  ScanOutlined,
  EyeOutlined,
  RobotOutlined,
  MedicineBoxOutlined,
  CloudOutlined,
  BarChartOutlined,
  SafetyCertificateOutlined,
  CalculatorOutlined,
  RightOutlined,
} from '@ant-design/icons-vue';
import type { CapabilityCardData } from '../../types';
import { serviceCategories } from '../../data';

const props = defineProps<{ item: CapabilityCardData; hideDetail?: boolean }>();
defineEmits<{ (e: 'click'): void }>();

const iconMap: Record<string, any> = {
  brain: ExperimentOutlined,
  document: FileTextOutlined,
  lungs: ScanOutlined,
  eye: EyeOutlined,
  robot: RobotOutlined,
  stethoscope: MedicineBoxOutlined,
  cloud: CloudOutlined,
  scan: ScanOutlined,
  file: FileTextOutlined,
  assistant: RobotOutlined,
  'bar-chart': BarChartOutlined,
  'shield-check': SafetyCertificateOutlined,
};

const iconComp = computed(() => iconMap[props.item.iconType] ?? ExperimentOutlined);

const toneMap: Record<string, { bg: string; color: string }> = {
  blue: { bg: '#E8F3FF', color: '#165DFF' },
  cyan: { bg: '#E0F7FA', color: '#13B8C6' },
  green: { bg: '#E7F7EE', color: '#16A34A' },
  orange: { bg: '#FEF3E7', color: '#F59E0B' },
  purple: { bg: '#F1E7FE', color: '#7C3AED' },
  rose: { bg: '#FEE7EB', color: '#EF4444' },
};

const toneBg = computed(() => toneMap[props.item.iconTone]?.bg ?? '#E8F3FF');
const toneColor = computed(() => toneMap[props.item.iconTone]?.color ?? '#165DFF');

const categoryColor = computed(() => serviceCategories.find((c) => c.id === props.item.category)?.color ?? '#165DFF');

const riskColor = computed(() => {
  switch (props.item.riskLevel) {
    case '高风险': return 'error';
    case '中风险': return 'warning';
    case '低风险': return 'success';
    default: return 'default';
  }
});
</script>
