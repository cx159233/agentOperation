<template>
  <div class="p-[20px]">
    <PageHeader title="周期账单" description="按账期与机构维度，对账单进行确认、批量确认与多方分润管理" />

    <section class="cloud-card p-[0] overflow-hidden mb-[14px]">
      <div class="px-[16px] py-[16px] flex items-center justify-between">
        <div class="text-[14px] font-semibold text-text-primary">周期账单</div>
        <div class="flex items-center gap-[10px] flex-wrap">
          <a-button type="primary" @click="onConfirmBatch" :disabled="!hasPending">批量确认</a-button>
          <span class="text-[13px] font-semibold text-text-primary">账期：</span>
          <a-radio-group v-model:value="period" button-style="solid">
            <a-radio-button v-for="p in periods" :key="p" :value="p">{{ p }}</a-radio-button>
          </a-radio-group>
          <a-select v-model:value="filterOrg" style="width: 220px" placeholder="全部机构" allow-clear>
            <a-select-option v-for="o in orgs" :key="o" :value="o">{{ o }}</a-select-option>
          </a-select>
        </div>
      </div>

      <div class="px-[16px]">
        <div class="grid grid-cols-3 gap-[14px] py-[14px]">
          <div class="rounded-[8px] border border-border-soft p-[14px]">
            <div class="text-[12px] text-text-secondary">本期对账金额</div>
            <div class="mt-[6px] font-num text-[22px] font-semibold text-text-primary">{{ periodSummary.gross }}</div>
          </div>
          <div class="rounded-[8px] border border-border-soft p-[14px]">
            <div class="text-[12px] text-text-secondary">已确认 / 已结算</div>
            <div class="mt-[6px] font-num text-[22px] font-semibold text-text-primary">{{ periodSummary.confirmed }}</div>
          </div>
          <div class="rounded-[8px] border border-border-soft p-[14px]">
            <div class="text-[12px] text-text-secondary">待确认</div>
            <div class="mt-[6px] font-num text-[22px] font-semibold text-text-primary">{{ periodSummary.pending }}</div>
          </div>
        </div>
      </div>

      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>

      <div class="px-[16px] py-[16px]">
        <a-table :columns="columns" :data-source="filteredData" :pagination="false" size="middle" :row-selection="{ selectedRowKeys, onChange: onSelectChange, getCheckboxProps: (r: any) => ({ disabled: r.status !== '待确认' }) }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'period'">
              <span class="font-num text-[12px] font-semibold text-text-primary">{{ record.period }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'gross'">
              <span class="font-num text-[12px] font-semibold text-text-primary">{{ record.gross }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'share'">
              <span class="font-num text-[12px] font-semibold text-success">{{ record.share }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-badge :status="statusBadge(record.status)" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button v-if="record.status === '待确认'" type="link" size="small" class="!p-0" @click="onConfirm(record)">确认</a-button>
                <a-button type="link" size="small" class="!p-0" @click="onDetail(record)">明细</a-button>
                <a-button type="link" size="small" class="!p-0" @click="onExport(record)">导出</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 多方分润明细 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <div class="px-[16px] py-[16px] flex items-center justify-between">
        <div>
          <div class="text-[14px] font-semibold text-text-primary">多方分润明细</div>
          <div class="text-[11px] text-text-secondary mt-[4px]">基于本期对账金额，按 70 / 15 / 10 / 5 比例分润</div>
        </div>
        <span class="text-[12px] text-text-tertiary">本期对账金额 {{ periodSummary.gross }}</span>
      </div>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>
      <div class="px-[16px] py-[16px]">
        <a-table :columns="shareColumns" :data-source="shareData" :pagination="false" size="middle">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'ratio'">
              <div class="flex items-center gap-[8px]">
                <a-progress :percent="record.ratio" :show-info="false" size="small" style="width: 120px" :stroke-color="shareColor(record.share)" />
                <span class="text-[12px] font-semibold">{{ record.ratio }}%</span>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'amount'">
              <span class="font-num text-[12px] font-semibold text-text-primary">{{ record.amount }}</span>
            </template>
          </template>
        </a-table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { monthlyBills, shareDistributions } from '../../../data/reconciliation';
import type { MonthlyBill } from '../../../data/reconciliation';
import PageHeader from '../../../components/common/PageHeader.vue';

const router = useRouter();

const periods = Array.from(new Set(monthlyBills.map((r) => r.period))).sort().reverse();
const period = ref(periods[0] ?? '2024-07');
const filterOrg = ref<string | undefined>(undefined);
const selectedRowKeys = ref<string[]>([]);

const orgs = Array.from(new Set(monthlyBills.map((r) => r.org)));

const columns = [
  { title: '账期', dataIndex: 'period', key: 'period', width: 100 },
  { title: '机构', dataIndex: 'org', key: 'org', width: 180 },
  { title: '服务', dataIndex: 'service', key: 'service', width: 180 },
  { title: '开发者', dataIndex: 'developer', key: 'developer', width: 180 },
  { title: '计费方式', dataIndex: 'billingMethod', key: 'billingMethod', width: 110 },
  { title: '调用次数', dataIndex: 'calls', key: 'calls', width: 110 },
  { title: '词元消耗', dataIndex: 'tokens', key: 'tokens', width: 120 },
  { title: '账单总额', dataIndex: 'gross', key: 'gross', width: 120 },
  { title: 'AI 厂商分成', dataIndex: 'share', key: 'share', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 160 },
];

const filteredData = computed(() => {
  return monthlyBills
    .filter((r) => {
      if (r.period !== period.value) return false;
      if (filterOrg.value && r.org !== filterOrg.value) return false;
      return true;
    })
    .map((r) => ({ key: r.id, ...r }));
});

const hasPending = computed(() => filteredData.value.some((r) => r.status === '待确认'));

const periodSummary = computed(() => {
  const bills = filteredData.value;
  const grossNum = bills.reduce((sum, r) => sum + Number(r.gross.replace(/[^\d.]/g, '')), 0);
  const confirmedNum = bills
    .filter((r) => r.status === '已确认' || r.status === '已结算')
    .reduce((sum, r) => sum + Number(r.gross.replace(/[^\d.]/g, '')), 0);
  const pendingNum = bills
    .filter((r) => r.status === '待确认')
    .reduce((sum, r) => sum + Number(r.gross.replace(/[^\d.]/g, '')), 0);
  return {
    gross: `¥ ${grossNum.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    confirmed: `¥ ${confirmedNum.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    pending: `¥ ${pendingNum.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  };
});

function statusBadge(status: string): 'success' | 'warning' | 'default' | 'error' {
  if (status === '已结算') return 'default';
  if (status === '已确认') return 'success';
  if (status === '异常') return 'error';
  return 'warning';
}

function onSelectChange(keys: string[]) {
  selectedRowKeys.value = keys;
}

function onConfirm(record: MonthlyBill) {
  message.success(`${record.org} - ${record.service} 账单已确认`);
}

function onConfirmBatch() {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择待确认账单');
    return;
  }
  message.success(`已批量确认 ${selectedRowKeys.value.length} 条账单`);
  selectedRowKeys.value = [];
}

function onDetail(record: MonthlyBill) {
  router.push({ name: 'BillDetail', params: { id: record.id } });
}

function onExport(record: MonthlyBill) {
  message.success(`${record.org} - ${record.service} 账单已导出`);
}

const shareColumns = [
  { title: '分润对象', dataIndex: 'share', key: 'share', width: 200 },
  { title: '分润比例', dataIndex: 'ratio', key: 'ratio', width: 200 },
  { title: '分润金额', dataIndex: 'amount', key: 'amount', width: 160 },
  { title: '说明', dataIndex: 'description', key: 'description' },
];

const shareData = computed(() => {
  const grossNum = filteredData.value.reduce((sum, r) => sum + Number(r.gross.replace(/[^\d.]/g, '')), 0);
  return shareDistributions.map((s) => ({
    key: s.share,
    share: s.share,
    ratio: s.ratio,
    amount: `¥ ${(grossNum * s.ratio / 100).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    description: s.description,
  }));
});

function shareColor(share: string) {
  if (share.includes('医保')) return '#165DFF';
  if (share.includes('运营服务')) return '#13B8C6';
  if (share.includes('AI厂商')) return '#10B981';
  return '#F59E0B';
}
</script>
