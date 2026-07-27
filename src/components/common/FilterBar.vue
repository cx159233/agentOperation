<template>
  <div class="bg-surface border border-border rounded-[8px] p-[14px] mb-[14px]">
    <div class="flex items-center flex-wrap gap-[10px]">
      <!-- LEFT: 操作按钮（异常核验、导出等） -->
      <div v-if="$slots.actions" class="flex items-center gap-[8px] shrink-0">
        <slot name="actions" />
      </div>
      <div class="flex-1" />
      <!-- RIGHT: 常用筛选 + 查询/重置 + 展开收起 -->
      <div v-if="$slots.default || $slots.extra || showActions || $slots.advanced" class="flex items-center gap-[8px] flex-wrap">
        <span v-if="label" class="text-[12px] text-text-tertiary shrink-0">{{ label }}</span>
        <slot />
        <slot name="extra" />
        <template v-if="showActions">
          <a-button type="primary" @click="$emit('search')">
            <template #icon><SearchOutlined /></template>
            查询
          </a-button>
          <a-button @click="$emit('reset')">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
        </template>
        <slot name="suffix" />
        <a-button v-if="$slots.advanced" type="link" size="small" class="!p-0 !h-auto !text-[12px]" @click="expanded = !expanded">
          {{ expanded ? '收起' : '更多筛选' }}
          <component :is="expanded ? UpOutlined : DownOutlined" class="!text-[10px] !ml-[2px]" />
        </a-button>
      </div>
    </div>
    <!-- 高级筛选（可收起） -->
    <div v-if="$slots.advanced && expanded" class="mt-[10px] pt-[10px] border-t border-border-soft flex items-center gap-[8px] flex-wrap">
      <slot name="advanced" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SearchOutlined, ReloadOutlined, DownOutlined, UpOutlined } from '@ant-design/icons-vue';

withDefaults(
  defineProps<{
    label?: string;
    showActions?: boolean;
  }>(),
  {
    label: '',
    showActions: true,
  },
);

defineEmits<{
  (e: 'search'): void;
  (e: 'reset'): void;
}>();

const expanded = ref(false);
</script>
