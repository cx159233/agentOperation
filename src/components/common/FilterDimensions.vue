<template>
  <section :class="bare ? '' : 'cloud-card p-[18px]'">
    <!-- 筛选行：类别 + 选项，类目左对齐 -->
    <div class="space-y-[12px]">
      <div
        v-for="f in filters"
        :key="f.label"
        class="flex items-start gap-[12px]"
      >
        <div class="w-[96px] flex-shrink-0 text-[13px] font-medium text-text-primary text-left whitespace-nowrap leading-[28px]">
          {{ f.label }}
        </div>
        <div class="flex-1 flex flex-wrap gap-[8px]">
          <button
            v-for="opt in f.options"
            :key="opt"
            type="button"
            class="px-[12px] h-[28px] rounded-[4px] text-[13px] transition-colors"
            :class="selected[f.label] === opt
              ? 'bg-primary text-white font-medium'
              : 'bg-bg-soft text-text-primary hover:bg-primary/10 hover:text-primary'"
            @click="onSelect(f.label, opt)"
          >
            {{ opt }}
          </button>
        </div>
      </div>

      <!-- 关键词搜索行 -->
      <div v-if="keyword !== undefined" class="flex items-start gap-[12px]">
        <div class="w-[96px] flex-shrink-0 text-[13px] font-medium text-text-primary text-left whitespace-nowrap leading-[32px]">
          关键词
        </div>
        <a-input
          :value="keyword"
          :placeholder="keywordPlaceholder"
          allow-clear
          style="max-width: 320px"
          @update:value="onKeywordChange"
          @keyup.enter="onKeywordConfirm"
        >
          <template #prefix>
            <SearchOutlined class="text-text-tertiary" />
          </template>
        </a-input>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue';
import type { FilterOption } from '../../types';

withDefaults(
  defineProps<{
    filters: FilterOption[];
    selected: Record<string, string>;
    keyword?: string;
    keywordPlaceholder?: string;
    bare?: boolean;
  }>(),
  {
    bare: false,
  },
);

const emit = defineEmits<{
  (e: 'select', label: string, value: string): void;
  (e: 'keyword-change', value: string): void;
  (e: 'keyword-confirm'): void;
}>();

function onSelect(label: string, value: string) {
  emit('select', label, value);
}

function onKeywordChange(value: string) {
  emit('keyword-change', value);
}

function onKeywordConfirm() {
  emit('keyword-confirm');
}
</script>
