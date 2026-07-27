<template>
  <a-modal
    :open="open"
    :title="title"
    :width="520"
    @update:open="(v: boolean) => emit('update:open', v)"
    @ok="onSubmit"
    @cancel="onCancel"
  >
    <a-alert type="info" show-icon class="mb-[14px]" message="提交后将进入审核流程，审核通过后自动上架到资产台账" />
    <a-form layout="vertical">
      <div class="grid grid-cols-2 gap-x-[16px]">
        <a-form-item
          v-for="f in fields"
          :key="f.key"
          :label="f.label"
          :required="f.required"
          :class="f.full && 'col-span-2'"
        >
          <a-input
            v-if="f.type === 'input'"
            v-model:value="form[f.key]"
            :placeholder="f.placeholder || `请输入${f.label}`"
          />
          <a-select
            v-else-if="f.type === 'select'"
            v-model:value="form[f.key]"
            :options="f.options?.map((o) => ({ label: o, value: o }))"
            :placeholder="f.placeholder || `请选择${f.label}`"
            allow-clear
          />
          <a-textarea
            v-else
            v-model:value="form[f.key]"
            :rows="f.rows || 3"
            :placeholder="f.placeholder || `请输入${f.label}`"
          />
        </a-form-item>
      </div>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { message } from 'ant-design-vue';

type FieldType = 'input' | 'select' | 'textarea';

type FieldDef = {
  label: string;
  key: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  full?: boolean;
  rows?: number;
};

const props = defineProps<{
  open: boolean;
  title: string;
  fields: FieldDef[];
}>();

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void;
  (e: 'submit', data: Record<string, string>): void;
}>();

const form = reactive<Record<string, string>>({});

watch(
  () => props.open,
  (v) => {
    if (v) {
      Object.keys(form).forEach((k) => delete form[k]);
      props.fields.forEach((f) => (form[f.key] = ''));
    }
  },
);

function onSubmit() {
  const missing = props.fields.filter((f) => f.required && !form[f.key]);
  if (missing.length) {
    message.warning(`请填写：${missing.map((m) => m.label).join('、')}`);
    return;
  }
  emit('submit', { ...form });
  message.success('已提交，审核通过后将自动上架');
  emit('update:open', false);
}

function onCancel() {
  emit('update:open', false);
}
</script>
