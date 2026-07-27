<template>
  <div class="w-full">
    <div class="flex items-end justify-between mb-[8px] text-[11px] text-text-secondary">
      <span>词元消耗（百万）</span>
      <div class="flex items-center gap-[12px]">
        <span class="flex items-center gap-[4px]"><span class="w-[8px] h-[8px] rounded-full bg-primary" /> 词元消耗</span>
        <span class="flex items-center gap-[4px]"><span class="w-[8px] h-[8px] rounded-full bg-secondary" /> 服务调用数</span>
      </div>
    </div>
    <svg :viewBox="`0 0 ${width} ${height}`" class="w-full" style="height: 260px;">
      <!-- 网格线 -->
      <line v-for="i in 5" :key="i" :x1="40" :x2="width - 10" :y1="20 + (i - 1) * 44" :y2="20 + (i - 1) * 44" stroke="#F0F4F9" stroke-width="1" />
      <!-- Y轴标签 -->
      <text v-for="(label, idx) in yLabels" :key="`y-${idx}`" :x="32" :y="20 + idx * 44 + 4" text-anchor="end" font-size="10" fill="#94A3B8">{{ label }}</text>
      <!-- X轴标签 -->
      <text v-for="(point, idx) in data" :key="`x-${idx}`" :x="60 + idx * step" :y="height - 6" text-anchor="middle" font-size="10" fill="#94A3B8">{{ point.month }}</text>
      <!-- 词元消耗折线（区域填充） -->
      <path :d="tokensAreaPath" fill="url(#tokensGradient)" />
      <path :d="tokensLinePath" fill="none" stroke="#165DFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      <!-- 服务调用数折线 -->
      <path :d="servicesLinePath" fill="none" stroke="#13B8C6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 3" />
      <!-- 数据点 -->
      <circle v-for="(point, idx) in data" :key="`c-${idx}`" :cx="60 + idx * step" :cy="tokensY(point.tokens)" r="3" fill="#165DFF" />
      <defs>
        <linearGradient id="tokensGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#165DFF" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#165DFF" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MonthlyTrendPoint } from '../../types';

const props = defineProps<{ data: MonthlyTrendPoint[] }>();

const width = 720;
const height = 260;
const step = computed(() => (width - 80) / Math.max(props.data.length - 1, 1));

const maxTokens = computed(() => Math.max(...props.data.map((d) => d.tokens), 100));
const maxServices = computed(() => Math.max(...props.data.map((d) => d.services), 50));

const yLabels = computed(() => {
  const max = maxTokens.value;
  return [Math.round(max).toString(), Math.round(max * 0.75).toString(), Math.round(max * 0.5).toString(), Math.round(max * 0.25).toString(), '0'];
});

function tokensY(value: number) {
  return 20 + (1 - value / maxTokens.value) * 176;
}

function servicesY(value: number) {
  return 20 + (1 - value / maxServices.value) * 176;
}

const tokensLinePath = computed(() =>
  props.data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${60 + i * step.value} ${tokensY(d.tokens)}`).join(' '),
);

const tokensAreaPath = computed(() => {
  const line = props.data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${60 + i * step.value} ${tokensY(d.tokens)}`).join(' ');
  const lastX = 60 + (props.data.length - 1) * step.value;
  return `${line} L ${lastX} 200 L 60 200 Z`;
});

const servicesLinePath = computed(() =>
  props.data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${60 + i * step.value} ${servicesY(d.services)}`).join(' '),
);
</script>
