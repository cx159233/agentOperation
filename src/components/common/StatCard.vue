<template>
  <div class="cloud-card p-[16px] cloud-card-hover">
    <div class="flex items-start justify-between">
      <div class="text-[12px] text-text-secondary">{{ label }}</div>
      <div v-if="$slots.icon" class="w-[28px] h-[28px] rounded-[6px] grid place-items-center" :class="iconBgClass">
        <slot name="icon" />
      </div>
    </div>
    <div class="mt-[8px] flex items-baseline gap-[4px]">
      <div class="font-num text-[24px] font-semibold leading-none" :class="valueClass">{{ value }}</div>
      <div v-if="unit" class="text-[12px] text-text-tertiary">{{ unit }}</div>
    </div>
    <div v-if="delta || trend" class="mt-[6px] flex items-center gap-[6px] text-[11px]">
      <span :class="deltaClass">{{ delta }}</span>
      <span v-if="trend" class="text-text-tertiary">{{ trend }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    value: string | number;
    unit?: string;
    delta?: string;
    trend?: string;
    tone?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
    iconTone?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
  }>(),
  {
    tone: 'default',
    iconTone: 'primary',
  },
);

const valueClass = computed(() => {
  switch (props.tone) {
    case 'primary':
      return 'text-primary';
    case 'success':
      return 'text-success';
    case 'warning':
      return 'text-warning';
    case 'danger':
      return 'text-danger';
    default:
      return 'text-text-primary';
  }
});

const deltaClass = computed(() => {
  switch (props.tone) {
    case 'success':
      return 'text-success';
    case 'warning':
      return 'text-warning';
    case 'danger':
      return 'text-danger';
    default:
      return 'text-text-tertiary';
  }
});

const iconBgClass = computed(() => {
  switch (props.iconTone) {
    case 'primary':
      return 'bg-primary-50 text-primary';
    case 'success':
      return 'bg-success/10 text-success';
    case 'warning':
      return 'bg-warning/10 text-warning';
    case 'danger':
      return 'bg-danger/10 text-danger';
    default:
      return 'bg-bg-soft text-text-secondary';
  }
});
</script>
