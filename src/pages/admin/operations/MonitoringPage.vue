<template>
  <div class="p-[20px]">
    <PageHeader title="调用日志" description="实时监测平台调用情况，覆盖调用方与调用检测列表" />

    <!-- 调用检测列表 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <template #actions>
          <a-button @click="onExport">
            <template #icon><DownloadOutlined /></template>
            导出
          </a-button>
        </template>
        <a-input v-model:value="filter.caller" style="width: 180px" placeholder="调用方" allow-clear @keyup.enter="onSearch" />
        <a-input v-model:value="filter.service" style="width: 220px" placeholder="调用模型" allow-clear @keyup.enter="onSearch" />
        <a-select v-model:value="filter.org" style="width: 180px" placeholder="调用机构" allow-clear>
          <a-select-option v-for="o in orgOptions" :key="o" :value="o">{{ o }}</a-select-option>
        </a-select>
        <a-select v-model:value="filter.status" style="width: 140px" placeholder="调用状态" allow-clear>
          <a-select-option value="成功">成功</a-select-option>
          <a-select-option value="失败">失败</a-select-option>
          <a-select-option value="处理中">处理中</a-select-option>
        </a-select>
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>

      <div class="px-[16px] py-[16px]">
        <a-table
          :columns="visibleColumns"
          :data-source="filteredData"
          :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }"
          size="middle"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'time'">
              <span class="font-num text-text-secondary text-[14px]">{{ record.time }}</span>
            </template>
            <template v-else-if="column.key === 'caller'">
              <div class="flex flex-col">
                <span class="text-text-primary text-[14px]">{{ record.caller }}</span>
                <span class="text-text-tertiary text-[12px]">{{ record.org }} · {{ record.department }}</span>
              </div>
            </template>
            <template v-else-if="column.key === 'service'">
              <div class="flex flex-col">
                <span class="text-text-secondary text-[14px]">{{ record.service }}</span>
                <span class="text-text-tertiary text-[12px]">{{ record.developer }}</span>
              </div>
            </template>
            <template v-else-if="column.key === 'latency'">
              <span class="font-num text-[14px]" :class="latencyClass(record.latency)">{{ record.latency }} ms</span>
            </template>
            <template v-else-if="column.key === 'status'">
              <a-badge :status="statusBadge(record.status)" :text="record.status" />
            </template>
            <template v-else-if="column.key === 'exception'">
              <a-tooltip v-if="record.exception" :title="record.exception">
                <span class="text-danger text-[14px] truncate inline-block max-w-[180px]">{{ record.exception }}</span>
              </a-tooltip>
              <span v-else class="text-text-tertiary">-</span>
            </template>
          </template>
        </a-table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { DownloadOutlined } from '@ant-design/icons-vue';
import { callLogs } from '../../../data/operations';
import PageHeader from '../../../components/common/PageHeader.vue';
import FilterBar from '../../../components/common/FilterBar.vue';
import ColumnSettings from '../../../components/common/ColumnSettings.vue';

const columns = [
  { title: '调用时间', dataIndex: 'time', key: 'time', width: 160 },
  { title: '调用方', dataIndex: 'caller', key: 'caller', width: 200 },
  { title: '调用模型', dataIndex: 'service', key: 'service', width: 240 },
  { title: '计量方式', dataIndex: 'billingMethod', key: 'billingMethod', width: 110 },
  { title: '用量', dataIndex: 'usage', key: 'usage', width: 120 },
  { title: '响应时延', dataIndex: 'latency', key: 'latency', width: 110 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '异常说明', dataIndex: 'exception', key: 'exception' },
];

const orgOptions = Array.from(new Set(callLogs.map((l) => l.org)));

const filter = ref({ caller: '', service: '', org: undefined as string | undefined, status: undefined as string | undefined });
const applied = ref({ caller: '', service: '', org: undefined as string | undefined, status: undefined as string | undefined });
const hiddenKeys = ref<string[]>([]);
const visibleColumns = computed(() => columns.filter((c) => !hiddenKeys.value.includes(c.key)));

function onSearch() {
  applied.value = { ...filter.value };
}
function onReset() {
  filter.value = { caller: '', service: '', org: undefined, status: undefined };
  applied.value = { caller: '', service: '', org: undefined, status: undefined };
}

const filteredData = computed(() => {
  const f = applied.value;
  return callLogs.filter((l) => {
    if (f.caller && !l.caller.includes(f.caller)) return false;
    if (f.service && !l.service.includes(f.service)) return false;
    if (f.org && l.org !== f.org) return false;
    if (f.status && l.status !== f.status) return false;
    return true;
  });
});

function statusBadge(status: string): 'success' | 'error' | 'processing' {
  if (status === '成功') return 'success';
  if (status === '失败') return 'error';
  return 'processing';
}

function latencyClass(latency: number) {
  if (latency > 2000) return 'text-danger';
  if (latency > 1000) return 'text-warning';
  return 'text-text-secondary';
}

function onExport() {
  message.success('调用检测数据导出请求已提交');
}
</script>
