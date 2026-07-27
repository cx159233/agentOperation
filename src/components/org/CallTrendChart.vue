<template>
  <div class="w-full">
    <div class="flex items-end justify-between mb-[8px] text-[12px] text-text-secondary">
      <span>调用次数 / 词元消耗</span>
      <div class="flex items-center gap-[12px]">
        <span class="flex items-center gap-[4px]"><span class="w-[8px] h-[8px] rounded-full bg-primary" /> 调用次数</span>
        <span class="flex items-center gap-[4px]"><span class="w-[8px] h-[8px] rounded-full bg-secondary" /> 词元消耗</span>
      </div>
    </div>
    <svg :viewBox="`0 0 ${width} ${height}`" class="w-full" style="height: 220px;">
      <line v-for="i in 5" :key="i" :x1="40" :x2="width - 10" :y1="20 + (i - 1) * 38" :y2="20 + (i - 1) * 38" stroke="#F0F4F9" stroke-width="1" />
      <text v-for="(label, idx) in yLabels" :key="`y-${idx}`" :x="32" :y="20 + idx * 38 + 4" text-anchor="end" font-size="12" fill="#94A3B8">{{ label }}</text>
      <text v-for="(point, idx) in data" :key="`x-${idx}`" :x="60 + idx * step" :y="height - 6" text-anchor="middle" font-size="12" fill="#94A3B8">{{ point.date }}</text>
      <path :d="callsAreaPath" fill="url(#callsGradient)" />
      <path :d="callsLinePath" fill="none" stroke="#165DFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      <path :d="tokensLinePath" fill="none" stroke="#13B8C6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 3" />
      <circle v-for="(point, idx) in data" :key="`c-${idx}`" :cx="60 + idx * step" :cy="callsY(point.calls)" r="3" fill="#165DFF" />
      <defs>
        <linearGradient id="callsGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#165DFF" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#165DFF" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CallTrendPoint } from '../../data/orgWorkbench';

const props = defineProps<{ data: CallTrendPoint[] }>();

const width = 520;
const height = 220;
const step = computed(() => (width - 80) / Math.max(props.data.length - 1, 1));

const maxCalls = computed(() => Math.max(...props.data.map((d) => d.calls), 100000));
const maxTokens = computed(() => Math.max(...props.data.map((d) => d.tokens), 1000));

const yLabels = computed(() => {
  const max = maxCalls.value;
  const k = max / 1000;
  return [`${Math.round(k).toString()}k`, `${Math.round(k * 0.75).toString()}k`, `${Math.round(k * 0.5).toString()}k`, `${Math.round(k * 0.25).toString()}k`, '0'];
});

function callsY(value: number) {
  return 20 + (1 - value / maxCalls.value) * 152;
}

function tokensY(value: number) {
  return 20 + (1 - value / maxTokens.value) * 152;
}

const callsLinePath = computed(() =>
  props.data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${60 + i * step.value} ${callsY(d.calls)}`).join(' '),
);

const callsAreaPath = computed(() => {
  const line = props.data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${60 + i * step.value} ${callsY(d.calls)}`).join(' ');
  const lastX = 60 + (props.data.length - 1) * step.value;
  return `${line} L ${lastX} 172 L 60 172 Z`;
});

const tokensLinePath = computed(() =>
  props.data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${60 + i * step.value} ${tokensY(d.tokens)}`).join(' '),
);
</script>
