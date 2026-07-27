<template>
  <div class="p-[20px]">
    <PageHeader title="用量明细" description="查询本开发者上架服务的调用计费明细，含调用次数、词元消耗、单次扣费与结算状态" />

    <!-- 汇总卡 -->
    <section class="grid grid-cols-4 gap-[14px] mb-[14px]">
      <StatCard label="本月调用扣费" :value="`¥ ${monthCallAmount.toLocaleString()}`" :delta="`${monthCallCount} 次调用`" tone="primary" />
      <StatCard label="待结算收益" :value="`¥ ${pendingSettle.toLocaleString()}`" delta="2024-07 周期账单" tone="warning" />
      <StatCard label="已结算收益" :value="`¥ ${settledAmount.toLocaleString()}`" delta="2024-06 已入账" tone="success" />
      <StatCard label="异常扣费" :value="exceptionCount" delta="失败调用 / 重复扣费" tone="danger" />
    </section>

    <!-- 筛选 + 表格 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <template #actions>
          <a-button @click="onExport">
            <template #icon><DownloadOutlined /></template>
            导出明细
          </a-button>
        </template>
        <a-input v-model:value="filter.service" style="width: 220px" placeholder="服务名称" allow-clear />
        <a-select v-model:value="filter.org" style="width: 200px" placeholder="调用机构" allow-clear show-search option-filter-prop="label">
          <a-select-option v-for="o in orgs" :key="o" :value="o" :label="o">{{ o }}</a-select-option>
        </a-select>
        <a-select v-model:value="filter.billingMethod" style="width: 140px" placeholder="计费方式" allow-clear>
          <a-select-option value="按Token">按Token</a-select-option>
          <a-select-option value="按检查例次">按检查例次</a-select-option>
          <a-select-option value="按调用次数">按调用次数</a-select-option>
        </a-select>
        <a-select v-model:value="filter.status" style="width: 140px" placeholder="结算状态" allow-clear>
          <a-select-option value="待结算">待结算</a-select-option>
          <a-select-option value="已结算">已结算</a-select-option>
          <a-select-option value="异常">异常</a-select-option>
        </a-select>
        <a-range-picker v-model:value="filter.range" :placeholder="['开始日期', '结束日期']" />
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>
      <div class="px-[16px] py-[16px]">
        <a-table :columns="columns" :data-source="filteredData" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle" row-key="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'serviceName'">
              <div class="flex items-center gap-[8px]">
                <div class="w-[24px] h-[24px] rounded-[4px] bg-primary-50 grid place-items-center shrink-0">
                  <RobotOutlined class="text-[12px] text-primary" />
                </div>
                <span class="text-text-primary">{{ record.serviceName }}</span>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'amount'">
              <span class="font-num text-text-primary font-medium">¥ {{ record.amount.toLocaleString() }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'tokens'">
              <span class="font-num text-text-secondary">{{ record.tokens ? record.tokens.toLocaleString() : '-' }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'calls'">
              <span class="font-num text-text-secondary">{{ record.calls }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-badge :status="statusBadge(record.status)" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" size="small" class="!p-0" @click="onDetail(record)">详情</a-button>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 详情抽屉 -->
    <a-drawer v-model:open="drawer.visible" title="计费明细详情" :width="520" placement="right">
      <template v-if="drawer.record">
        <div class="rounded-[4px] bg-bg-soft border border-border-soft p-[14px] mb-[16px]">
          <div class="flex items-center gap-[8px] mb-[8px]">
            <a-tag :color="billingMethodColor(drawer.record.billingMethod)" class="!m-0 !text-[12px]">{{ drawer.record.billingMethod }}</a-tag>
            <a-badge :status="statusBadge(drawer.record.status)" :text="drawer.record.status" />
          </div>
          <div class="text-[16px] font-semibold text-text-primary">{{ drawer.record.serviceName }}</div>
          <div class="text-[12px] text-text-tertiary mt-[4px]">流水号：{{ drawer.record.id }}</div>
        </div>
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="调用机构">{{ drawer.record.org }}</a-descriptions-item>
          <a-descriptions-item label="调用时间">{{ drawer.record.time }}</a-descriptions-item>
          <a-descriptions-item label="计费方式">{{ drawer.record.billingMethod }}</a-descriptions-item>
          <a-descriptions-item label="调用次数">{{ drawer.record.calls }} 次</a-descriptions-item>
          <a-descriptions-item label="词元消耗">{{ drawer.record.tokens ? drawer.record.tokens.toLocaleString() : '-' }}</a-descriptions-item>
          <a-descriptions-item label="单次单价">¥ {{ drawer.record.unitPrice.toFixed(4) }}</a-descriptions-item>
          <a-descriptions-item label="扣费总额">
            <span class="font-num text-primary font-semibold">¥ {{ drawer.record.amount.toLocaleString() }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="结算状态">{{ drawer.record.status }}</a-descriptions-item>
          <a-descriptions-item label="账期">{{ drawer.record.period }}</a-descriptions-item>
        </a-descriptions>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { DownloadOutlined, RobotOutlined } from '@ant-design/icons-vue';
import PageHeader from '../../components/common/PageHeader.vue';
import StatCard from '../../components/common/StatCard.vue';
import FilterBar from '../../components/common/FilterBar.vue';

type BillingRecord = {
  id: string;
  time: string;
  serviceName: string;
  org: string;
  billingMethod: '按Token' | '按检查例次' | '按调用次数';
  calls: number;
  tokens?: number;
  unitPrice: number;
  amount: number;
  status: '待结算' | '已结算' | '异常';
  period: string;
};

const billingRecords: BillingRecord[] = [
  { id: 'DB-2024-07-0001', time: '2024-07-17 14:23:08', serviceName: '肺结节CT辅助检测模型', org: '江苏省人民医院', billingMethod: '按检查例次', calls: 128, unitPrice: 6.5, amount: 832, status: '待结算', period: '2024-07' },
  { id: 'DB-2024-07-0002', time: '2024-07-17 11:05:42', serviceName: '医保基金监管智能审查', org: '盐城市医保中心', billingMethod: '按调用次数', calls: 3420, unitPrice: 0.08, amount: 273.6, status: '待结算', period: '2024-07' },
  { id: 'DB-2024-07-0003', time: '2024-07-17 09:18:15', serviceName: '通用基础大模型API', org: '南京鼓楼医院', billingMethod: '按Token', calls: 856, tokens: 1284000, unitPrice: 0.002, amount: 2568, status: '待结算', period: '2024-07' },
  { id: 'DB-2024-07-0004', time: '2024-07-16 16:42:30', serviceName: '肺结节CT辅助检测模型', org: '苏州市立医院', billingMethod: '按检查例次', calls: 86, unitPrice: 6.5, amount: 559, status: '待结算', period: '2024-07' },
  { id: 'DB-2024-07-0005', time: '2024-07-16 14:10:22', serviceName: '病历质控智能体', org: '徐州医科大学附属医院', billingMethod: '按调用次数', calls: 1240, unitPrice: 0.5, amount: 620, status: '已结算', period: '2024-06' },
  { id: 'DB-2024-07-0006', time: '2024-07-16 10:35:18', serviceName: '通用基础大模型API', org: '无锡市人民医院', billingMethod: '按Token', calls: 432, tokens: 685000, unitPrice: 0.002, amount: 1370, status: '已结算', period: '2024-06' },
  { id: 'DB-2024-07-0007', time: '2024-07-15 18:22:45', serviceName: '医保基金监管智能审查', org: '南通市医保中心', billingMethod: '按调用次数', calls: 2150, unitPrice: 0.08, amount: 172, status: '已结算', period: '2024-06' },
  { id: 'DB-2024-07-0008', time: '2024-07-15 15:08:12', serviceName: '肺结节CT辅助检测模型', org: '江苏省人民医院', billingMethod: '按检查例次', calls: 0, unitPrice: 6.5, amount: 0, status: '异常', period: '2024-07' },
  { id: 'DB-2024-07-0009', time: '2024-07-15 09:45:33', serviceName: '智能导诊分诊系统', org: '连云港市第一人民医院', billingMethod: '按调用次数', calls: 980, unitPrice: 0.3, amount: 294, status: '待结算', period: '2024-07' },
  { id: 'DB-2024-07-0010', time: '2024-07-14 14:30:08', serviceName: '通用基础大模型API', org: '盐城市医保中心', billingMethod: '按Token', calls: 1240, tokens: 2150000, unitPrice: 0.002, amount: 4300, status: '待结算', period: '2024-07' },
  { id: 'DB-2024-07-0011', time: '2024-07-14 10:12:45', serviceName: '病历质控智能体', org: '淮安市第一人民医院', billingMethod: '按调用次数', calls: 1560, unitPrice: 0.5, amount: 780, status: '已结算', period: '2024-06' },
  { id: 'DB-2024-07-0012', time: '2024-07-13 16:55:20', serviceName: '肺结节CT辅助检测模型', org: '南京市第一医院', billingMethod: '按检查例次', calls: 102, unitPrice: 6.5, amount: 663, status: '待结算', period: '2024-07' },
];

const orgs = computed(() => Array.from(new Set(billingRecords.map((r) => r.org))));

const monthCallAmount = computed(() => billingRecords.filter((r) => r.period === '2024-07' && r.status !== '异常').reduce((sum, r) => sum + r.amount, 0));
const monthCallCount = computed(() => billingRecords.filter((r) => r.period === '2024-07').reduce((sum, r) => sum + r.calls, 0));
const pendingSettle = computed(() => billingRecords.filter((r) => r.status === '待结算').reduce((sum, r) => sum + r.amount, 0));
const settledAmount = computed(() => billingRecords.filter((r) => r.status === '已结算').reduce((sum, r) => sum + r.amount, 0));
const exceptionCount = computed(() => billingRecords.filter((r) => r.status === '异常').length);

const filter = ref<{ service: string; org: string | undefined; billingMethod: string | undefined; status: string | undefined; range: any[] | undefined }>({
  service: '',
  org: undefined,
  billingMethod: undefined,
  status: undefined,
  range: undefined,
});

const applied = ref({ ...filter.value });

function onSearch() {
  applied.value = { ...filter.value };
}

function onReset() {
  filter.value = { service: '', org: undefined, billingMethod: undefined, status: undefined, range: undefined };
  applied.value = { ...filter.value };
}

const filteredData = computed(() => {
  const f = applied.value;
  return billingRecords.filter((r) => {
    if (f.service && !r.serviceName.includes(f.service)) return false;
    if (f.org && r.org !== f.org) return false;
    if (f.billingMethod && r.billingMethod !== f.billingMethod) return false;
    if (f.status && r.status !== f.status) return false;
    return true;
  });
});

const columns = [
  { title: '流水号', dataIndex: 'id', key: 'id', width: 170 },
  { title: '调用时间', dataIndex: 'time', key: 'time', width: 160 },
  { title: '服务名称', dataIndex: 'serviceName', key: 'serviceName', width: 220 },
  { title: '调用机构', dataIndex: 'org', key: 'org', width: 200 },
  { title: '计费方式', dataIndex: 'billingMethod', key: 'billingMethod', width: 120 },
  { title: '调用次数', dataIndex: 'calls', key: 'calls', width: 100 },
  { title: '词元消耗', dataIndex: 'tokens', key: 'tokens', width: 130 },
  { title: '扣费金额', dataIndex: 'amount', key: 'amount', width: 120 },
  { title: '结算状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '账期', dataIndex: 'period', key: 'period', width: 100 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 80 },
];

function statusBadge(status: string): 'success' | 'warning' | 'error' {
  if (status === '已结算') return 'success';
  if (status === '待结算') return 'warning';
  return 'error';
}

function billingMethodColor(method: string): string {
  if (method === '按Token') return 'blue';
  if (method === '按检查例次') return 'green';
  return 'orange';
}

const drawer = ref<{ visible: boolean; record: BillingRecord | null }>({ visible: false, record: null });

function onDetail(record: BillingRecord) {
  drawer.value = { visible: true, record };
}

function onExport() {
  message.success('费用明细导出请求已提交，稍后通过邮件发送');
}
</script>
