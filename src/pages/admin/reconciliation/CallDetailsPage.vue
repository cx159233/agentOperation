<template>
  <div class="p-[20px]">
    <PageHeader title="用量明细查询" description="查询接入机构调用 AI 服务的明细记录与扣费情况" />

    <!-- 明细表 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <template #actions>
          <a-button @click="onExport">
            <template #icon><DownloadOutlined /></template>
            导出
          </a-button>
        </template>
        <a-select v-model:value="filter.service" style="width: 220px" placeholder="服务" allow-clear show-search option-filter-prop="label">
          <a-select-option v-for="s in services" :key="s" :value="s" :label="s">{{ s }}</a-select-option>
        </a-select>
        <a-select v-model:value="filter.org" style="width: 220px" placeholder="机构" allow-clear>
          <a-select-option v-for="o in orgs" :key="o" :value="o">{{ o }}</a-select-option>
        </a-select>
        <a-select v-model:value="filter.developer" style="width: 220px" placeholder="开发者" allow-clear>
          <a-select-option v-for="d in developers" :key="d" :value="d">{{ d }}</a-select-option>
        </a-select>
        <a-input v-model:value="filter.caller" style="width: 160px" placeholder="操作人" allow-clear />
        <a-select v-model:value="filter.status" style="width: 140px" placeholder="状态" allow-clear>
          <a-select-option value="已扣费">已扣费</a-select-option>
          <a-select-option value="处理中">处理中</a-select-option>
          <a-select-option value="异常">异常</a-select-option>
        </a-select>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>
      <div class="px-[16px] py-[16px]">
        <a-table :columns="columns" :data-source="filteredData" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'status'">
              <a-badge :status="statusBadge(record.status)" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'exception'">
              <a-tooltip v-if="record.exception" :title="record.exception">
                <span class="text-error text-[12px]">{{ record.exception }}</span>
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
import { callDetails } from '../../../data/reconciliation';
import PageHeader from '../../../components/common/PageHeader.vue';
import FilterBar from '../../../components/common/FilterBar.vue';

const filter = ref({
  service: undefined as string | undefined,
  org: undefined as string | undefined,
  developer: undefined as string | undefined,
  caller: '',
  status: undefined as string | undefined,
});

const applied = ref({ ...filter.value });

const services = Array.from(new Set(callDetails.map((r) => r.service)));
const orgs = Array.from(new Set(callDetails.map((r) => r.org)));
const developers = Array.from(new Set(callDetails.map((r) => r.developer)));

const columns = [
  { title: '调用时间', dataIndex: 'time', key: 'time', width: 160 },
  { title: '调用主体', dataIndex: 'caller', key: 'caller', width: 110 },
  { title: '机构', dataIndex: 'org', key: 'org', width: 180 },
  { title: '科室', dataIndex: 'department', key: 'department', width: 110 },
  { title: '服务', dataIndex: 'service', key: 'service', width: 180 },
  { title: '开发者', dataIndex: 'developer', key: 'developer', width: 180 },
  { title: '计费方式', dataIndex: 'billingMethod', key: 'billingMethod', width: 110 },
  { title: '用量', dataIndex: 'usage', key: 'usage', width: 110 },
  { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', width: 130 },
  { title: '金额', dataIndex: 'amount', key: 'amount', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '异常信息', dataIndex: 'exception', key: 'exception', width: 200 },
];

function onSearch() {
  applied.value = { ...filter.value };
}

function onReset() {
  filter.value = {
    service: undefined,
    org: undefined,
    developer: undefined,
    caller: '',
    status: undefined,
  };
  applied.value = { ...filter.value };
}

const filteredData = computed(() => {
  const f = applied.value;
  return callDetails
    .filter((r) => {
      if (f.service && r.service !== f.service) return false;
      if (f.org && r.org !== f.org) return false;
      if (f.developer && r.developer !== f.developer) return false;
      if (f.caller && !r.caller.includes(f.caller)) return false;
      if (f.status && r.status !== f.status) return false;
      return true;
    })
    .map((r) => ({ key: r.id, ...r }));
});

function statusBadge(status: string): 'success' | 'processing' | 'error' {
  if (status === '已扣费') return 'success';
  if (status === '处理中') return 'processing';
  return 'error';
}

function onExport() {
  message.success('当前结果导出请求已提交，将通过邮件发送');
}
</script>
