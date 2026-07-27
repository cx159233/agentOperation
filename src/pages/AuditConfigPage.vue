<template>
  <div class="p-[20px]">
    <PageHeader title="审核配置" description="按风险等级配置差异化审核流程" />

    <div class="cloud-card p-[20px]">
      <div class="flex items-center justify-between mb-[14px]">
        <div>
          <div class="text-[14px] font-semibold text-text-primary">三级审核配置</div>
          <div class="text-[11px] text-text-tertiary mt-[4px]">高风险走全流程、中风险简化测试、低风险备案即上架</div>
        </div>
        <a-button type="primary" @click="onSave">保存配置</a-button>
      </div>
      <a-table :columns="auditColumns" :data-source="auditLevels" :pagination="false" size="middle">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'level'">
            <a-tag :color="record.level === '高风险' ? 'error' : record.level === '中风险' ? 'warning' : 'success'" class="!m-0 !text-[11px]">{{ record.level }}</a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'process'">
            <a-select v-model:value="record.process" mode="multiple" style="width: 100%" :options="auditSteps" />
          </template>
          <template v-else-if="column.dataIndex === 'enabled'">
            <a-switch v-model:checked="record.enabled" />
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import PageHeader from '../components/common/PageHeader.vue';

const auditColumns = [
  { title: '风险等级', dataIndex: 'level', key: 'level', width: 120 },
  { title: '适用类型', dataIndex: 'scope', key: 'scope' },
  { title: '审核流程', dataIndex: 'process', key: 'process', width: 320 },
  { title: '启用', dataIndex: 'enabled', key: 'enabled', width: 100 },
];

const auditSteps = [
  { label: '资质核验', value: '资质核验' },
  { label: '技术测评', value: '技术测评' },
  { label: '简化技术测试', value: '简化技术测试' },
  { label: '临床验收', value: '临床验收' },
  { label: '备案上架', value: '备案上架' },
];

const auditLevels = ref([
  { key: '1', level: '高风险', scope: '诊断类AI模型（影像筛查、病理诊断）', process: ['资质核验', '技术测评', '临床验收'], enabled: true },
  { key: '2', level: '中风险', scope: '辅助类模型（电子病历、医嘱判断）', process: ['资质核验', '简化技术测试'], enabled: true },
  { key: '3', level: '低风险', scope: '市场化合规生态 AI 产品', process: ['备案上架'], enabled: true },
]);

function onSave() {
  message.success('审核配置已保存');
}
</script>
