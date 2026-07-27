<template>
  <a-popover v-model:open="open" trigger="click" placement="bottomRight" :overlay-style="{ width: '200px' }">
    <template #content>
      <div class="min-w-[180px] py-[4px]">
        <div class="flex items-center justify-between mb-[8px] pb-[8px] border-b border-[#F2F3F5]">
          <span class="text-[13px] font-medium text-text-primary">列设置</span>
          <a-button type="link" size="small" @click="reset" style="padding: 0; height: auto; font-size: 12px">重置</a-button>
        </div>
        <div class="flex flex-col gap-[8px] max-h-[280px] overflow-auto">
          <a-checkbox
            v-for="col in columns"
            :key="col.key"
            :checked="!hiddenKeys.includes(col.key)"
            @change="(e: any) => toggle(col.key, e.target.checked)"
          >
            <span class="text-[13px]">{{ col.title }}</span>
          </a-checkbox>
        </div>
      </div>
    </template>
    <a-tooltip title="列设置">
      <a-button type="text">
        <template #icon><SettingOutlined /></template>
      </a-button>
    </a-tooltip>
  </a-popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { SettingOutlined } from '@ant-design/icons-vue';

interface Column {
  title: string;
  key: string;
  [key: string]: any;
}

const props = defineProps<{
  columns: Column[];
  modelValue?: string[];
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', keys: string[]): void;
}>();

const open = ref(false);
const hiddenKeys = computed(() => props.modelValue ?? []);

function toggle(key: string, checked: boolean) {
  const current = [...hiddenKeys.value];
  const idx = current.indexOf(key);
  if (checked && idx >= 0) current.splice(idx, 1);
  if (!checked && idx < 0) current.push(key);
  emit('update:modelValue', current);
}

function reset() {
  emit('update:modelValue', []);
}
</script>
