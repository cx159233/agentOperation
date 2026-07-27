<template>
  <section class="flex items-start justify-between gap-[16px] mb-[14px]">
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-[10px]">
        <div v-if="title" class="text-[18px] font-semibold text-text-primary leading-none">{{ title }}</div>
        <a-tag v-if="badge" :color="badgeColor" class="!m-0 !text-[11px]">{{ badge }}</a-tag>
      </div>
      <div v-if="description" class="mt-[6px] text-[12px] text-text-secondary leading-[1.6]">{{ description }}</div>
      <slot name="extra" />
    </div>
    <div v-if="$slots.actions" class="flex items-center gap-[8px] shrink-0">
      <slot name="actions" />
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    badge?: string;
    badgeColor?: string;
  }>(),
  {
    title: '',
    description: '',
    badge: '',
    badgeColor: 'processing',
  },
);
</script>
