<template>
  <div class="p-[20px]">
    <PageHeader title="用量明细" description="查询本机构 AI 服务调用明细与扣费记录，支持按服务、子账户筛选" />

    <!-- 账单汇总卡 -->
    <section class="grid grid-cols-4 gap-[14px] mb-[14px]">
      <StatCard label="本月消耗" :value="billingSummary.monthAmount" :delta="billingSummary.monthTokens" tone="primary" />
      <StatCard label="已结算" :value="billingSummary.settled" delta="2024-06 已结算账单" tone="success" />
      <StatCard label="待确认" :value="billingSummary.pending" delta="2024-07 月度账单" tone="warning" />
      <StatCard label="异常待核验" :value="exceptionCount" delta="扣费失败 / 重复调用" tone="danger" />
    </section>

    <!-- 筛选 + 操作 + 列表（单容器） -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <template #actions>
          <a-button @click="goToExceptions">
            <template #icon><WarningOutlined /></template>
            异常核验
          </a-button>
          <a-button type="primary" @click="onExport">
            <template #icon><DownloadOutlined /></template>
            导出明细
          </a-button>
        </template>
        <a-select v-model:value="filter.service" style="width: 240px" placeholder="服务名称" allow-clear show-search option-filter-prop="label">
          <a-select-option v-for="s in services" :key="s" :value="s" :label="s">{{ s }}</a-select-option>
        </a-select>
        <a-select v-model:value="filter.department" style="width: 200px" placeholder="子账户" allow-clear>
          <a-select-option v-for="d in departments" :key="d" :value="d">{{ d }}</a-select-option>
        </a-select>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>

      <!-- 表格上方操作栏（左对齐 + 右侧列设置） -->
      <div class="px-[16px] pt-[16px] pb-[0] flex items-center justify-end">
        <a-popover v-model:open="columnSettingsOpen" trigger="click" placement="bottomRight" :overlay-style="{ width: '200px' }">
          <template #content>
            <div class="min-w-[180px] py-[4px]">
              <div class="flex items-center justify-between mb-[8px] pb-[8px] border-b border-[#F2F3F5]">
                <span class="text-[13px] font-medium text-text-primary">列设置</span>
                <a-button type="link" size="small" @click="resetColumns" style="padding: 0; height: auto; font-size: 12px">重置</a-button>
              </div>
              <div class="flex flex-col gap-[8px] max-h-[280px] overflow-auto">
                <a-checkbox
                  v-for="col in columnSettings"
                  :key="col.key"
                  :checked="col.visible"
                  @change="(e: any) => toggleColumn(col.key, e.target.checked)"
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
      </div>

      <!-- 表格 -->
      <div class="px-[16px] py-[16px]">
        <a-table :columns="visibleColumns" :data-source="filteredData" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { DownloadOutlined, WarningOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { billingRecords, billingSummary } from '../../data/orgWorkbench';
import PageHeader from '../../components/common/PageHeader.vue';
import StatCard from '../../components/common/StatCard.vue';
import FilterBar from '../../components/common/FilterBar.vue';

const filter = ref({ service: undefined as string | undefined, department: undefined as string | undefined });
const applied = ref({ service: undefined as string | undefined, department: undefined as string | undefined });

const services = Array.from(new Set(billingRecords.map((r) => r.service)));
const departments = Array.from(new Set(billingRecords.map((r) => r.department)));

const exceptionCount = billingRecords.filter((r) => r.status === '异常').length;

const columns = [
  { title: '时间', dataIndex: 'time', key: 'time', width: 160 },
  { title: '服务', dataIndex: 'service', key: 'service' },
  { title: '开发者', dataIndex: 'developer', key: 'developer', width: 200 },
  { title: '计费方式', dataIndex: 'billingMethod', key: 'billingMethod', width: 110 },
  { title: '操作人', dataIndex: 'caller', key: 'caller', width: 100 },
  { title: '子账户', dataIndex: 'department', key: 'department', width: 120 },
  { title: '用量', dataIndex: 'usage', key: 'usage', width: 120 },
  { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', width: 140 },
  { title: '金额', dataIndex: 'amount', key: 'amount', width: 100 },
];

const columnSettingsOpen = ref(false);
const columnSettings = ref(columns.map((c) => ({ ...c, visible: true })));

function toggleColumn(key: string, checked: boolean) {
  const col = columnSettings.value.find((c) => c.key === key);
  if (col) col.visible = checked;
}

function resetColumns() {
  columnSettings.value.forEach((c) => (c.visible = true));
}

const visibleColumns = computed(() => columnSettings.value.filter((c) => c.visible));

function onSearch() {
  applied.value = { ...filter.value };
}

function onReset() {
  filter.value = { service: undefined, department: undefined };
  applied.value = { service: undefined, department: undefined };
}

const filteredData = computed(() => {
  const f = applied.value;
  return billingRecords
    .filter((r) => {
      if (f.service && r.service !== f.service) return false;
      if (f.department && r.department !== f.department) return false;
      return true;
    })
    .map((r) => ({ key: r.id, ...r }));
});

function goToExceptions() {
  message.info('异常核验功能请联系平台运营人员处理，联系电话：025-12345678');
}

function onExport() {
  message.success('明细导出请求已提交，文件将通过邮件发送');
}
</script>
