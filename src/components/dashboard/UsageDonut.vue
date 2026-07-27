<template>
  <div class="flex items-center justify-center" style="height: 240px;">
    <div class="relative" style="width: 200px; height: 200px;">
      <svg viewBox="0 0 42 42" class="w-full h-full -rotate-90">
        <circle v-for="(seg, idx) in segments" :key="idx"
          cx="21" cy="21" r="15.915"
          fill="transparent"
          :stroke="seg.color"
          stroke-width="3"
          :stroke-dasharray="`${seg.value} ${100 - seg.value}`"
          :stroke-dashoffset="seg.offset"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <div class="font-num text-[24px] font-bold text-text-primary">100%</div>
        <div class="text-[11px] text-text-secondary mt-[2px]">总占比</div>
      </div>
    </div>
    <div class="ml-[24px] space-y-[8px]">
      <div v-for="item in data" :key="item.name" class="flex items-center gap-[8px] text-[12px]">
        <span class="w-[10px] h-[10px] rounded-sm" :style="{ background: item.color }" />
        <span class="text-text-primary flex-1">{{ item.name }}</span>
        <span class="font-num font-semibold text-text-secondary">{{ item.value }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { UsageShareItem } from '../../types';

const props = defineProps<{ data: UsageShareItem[] }>();

const segments = computed(() => {
  let acc = 0;
  return props.data.map((item) => {
    const seg = { ...item, offset: 100 - acc };
    acc += item.value;
    return seg;
  });
});
</script>
