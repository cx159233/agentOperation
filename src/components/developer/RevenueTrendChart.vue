<template>
  <div class="w-full">
    <div class="flex items-end justify-between mb-[8px] text-[11px] text-text-secondary">
      <span>收益金额（元）</span>
      <div class="flex items-center gap-[4px]">
        <span class="w-[8px] h-[8px] rounded-full bg-warning" />
        <span>当月收益</span>
      </div>
    </div>
    <svg :viewBox="`0 0 ${width} ${height}`" class="w-full" style="height: 240px;">
      <line v-for="i in 5" :key="i" :x1="40" :x2="width - 10" :y1="20 + (i - 1) * 44" :y2="20 + (i - 1) * 44" stroke="#F0F4F9" stroke-width="1" />
      <text v-for="(label, idx) in yLabels" :key="`y-${idx}`" :x="32" :y="20 + idx * 44 + 4" text-anchor="end" font-size="10" fill="#94A3B8">{{ label }}</text>
      <text v-for="(point, idx) in data" :key="`x-${idx}`" :x="60 + idx * step" :y="height - 6" text-anchor="middle" font-size="10" fill="#94A3B8">{{ formatMonth(point.label) }}</text>
      <path :d="areaPath" fill="url(#revenueGradient)" />
      <path :d="linePath" fill="none" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      <circle v-for="(point, idx) in data" :key="`c-${idx}`" :cx="60 + idx * step" :cy="y(point.value)" r="3" fill="#F59E0B" />
      <defs>
        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ data: { label: string; value: number }[] }>();

const width = 720;
const height = 240;
const step = computed(() => (width - 80) / Math.max(props.data.length - 1, 1));
const max = computed(() => Math.max(...props.data.map((d) => d.value), 100));

const yLabels = computed(() => {
  const m = max.value;
  return [Math.round(m).toString(), Math.round(m * 0.75).toString(), Math.round(m * 0.5).toString(), Math.round(m * 0.25).toString(), '0'];
});

function y(value: number) {
  return 20 + (1 - value / max.value) * 176;
}

const linePath = computed(() =>
  props.data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${60 + i * step.value} ${y(d.value)}`).join(' '),
);

const areaPath = computed(() => {
  const line = props.data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${60 + i * step.value} ${y(d.value)}`).join(' ');
  const lastX = 60 + (props.data.length - 1) * step.value;
  return `${line} L ${lastX} 200 L 60 200 Z`;
});

function formatMonth(m: string) {
  return m.replace('2024-', '');
}
</script>
