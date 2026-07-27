<template>
  <div class="p-[20px]">
    <PageHeader title="账单管理" description="查询本机构 AI 服务消费账单，含月度账单、词元包购买与直接付费记录" />

    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <template #actions>
          <a-button @click="onExport">
            <template #icon><DownloadOutlined /></template>
            导出
          </a-button>
        </template>
        <a-select v-model:value="filter.type" style="width: 140px" placeholder="账单类型">
          <a-select-option value="monthly">月度账单</a-select-option>
          <a-select-option value="pack">词元包</a-select-option>
          <a-select-option value="direct">直接付费</a-select-option>
        </a-select>
        <a-select v-model:value="filter.status" style="width: 140px" placeholder="状态" allow-clear>
          <a-select-option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</a-select-option>
        </a-select>
        <a-select v-if="filter.type !== 'monthly'" v-model:value="filter.payMethod" style="width: 160px" placeholder="支付方式" allow-clear>
          <a-select-option value="医保基金">医保基金</a-select-option>
          <a-select-option value="机构自费">机构自费</a-select-option>
        </a-select>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>
      <div class="px-[16px] py-[16px]">
        <a-table :columns="currentColumns" :data-source="filteredData" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'gross'">
              <span class="font-num text-[12px] font-semibold text-text-primary">{{ record.gross }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'price'">
              <span class="font-num text-[12px] font-semibold text-text-primary">{{ record.price }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'amount'">
              <span class="font-num text-[12px] font-semibold text-text-primary">{{ record.amount }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'payMethod'">
              <a-tag :color="record.payMethod === '医保基金' ? 'blue' : 'orange'" class="!m-0 !text-[12px]">{{ record.payMethod }}</a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'invoice'">
              <span v-if="record.invoice && record.invoice !== '-'" class="font-num text-[12px] text-text-primary">{{ record.invoice }}</span>
              <span v-else class="text-text-tertiary">-</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-badge :status="statusBadge(record.status)" :text="record.status" />
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
import { orgMonthlyBills, tokenPackOrders, directPayOrders } from '../../data/orgWorkbench';
import PageHeader from '../../components/common/PageHeader.vue';
import FilterBar from '../../components/common/FilterBar.vue';

type BillType = 'monthly' | 'pack' | 'direct';

const filter = ref<{ type: BillType; status: string | undefined; payMethod: string | undefined }>({
  type: 'monthly',
  status: undefined,
  payMethod: undefined,
});

const applied = ref<{ type: BillType; status: string | undefined; payMethod: string | undefined }>({
  type: 'monthly',
  status: undefined,
  payMethod: undefined,
});

function onSearch() {
  applied.value = { ...filter.value };
}

function onReset() {
  filter.value = { type: 'monthly', status: undefined, payMethod: undefined };
  applied.value = { type: 'monthly', status: undefined, payMethod: undefined };
}

const statusOptionsByType: Record<BillType, string[]> = {
  monthly: ['待确认', '已结算', '异常'],
  pack: ['已支付', '使用中', '已用完', '已过期'],
  direct: ['已支付', '已开票', '待开票'],
};

const statusOptions = computed(() => statusOptionsByType[filter.value.type]);

const monthlyColumns = [
  { title: '账期', dataIndex: 'period', key: 'period', width: 100 },
  { title: '服务', dataIndex: 'service', key: 'service' },
  { title: '开发者', dataIndex: 'developer', key: 'developer', width: 200 },
  { title: '计费方式', dataIndex: 'billingMethod', key: 'billingMethod', width: 110 },
  { title: '调用次数', dataIndex: 'calls', key: 'calls', width: 110 },
  { title: '词元消耗', dataIndex: 'tokens', key: 'tokens', width: 120 },
  { title: '账单金额', dataIndex: 'gross', key: 'gross', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
];

const packColumns = [
  { title: '订单号', dataIndex: 'id', key: 'id', width: 160 },
  { title: '词元包', dataIndex: 'pack', key: 'pack' },
  { title: '适用服务', dataIndex: 'service', key: 'service', width: 200 },
  { title: '词元额度', dataIndex: 'tokens', key: 'tokens', width: 140 },
  { title: '价格', dataIndex: 'price', key: 'price', width: 130 },
  { title: '支付方式', dataIndex: 'payMethod', key: 'payMethod', width: 110 },
  { title: '支付时间', dataIndex: 'paidAt', key: 'paidAt', width: 150 },
  { title: '有效期至', dataIndex: 'validUntil', key: 'validUntil', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
];

const directColumns = [
  { title: '订单号', dataIndex: 'id', key: 'id', width: 160 },
  { title: '服务', dataIndex: 'service', key: 'service' },
  { title: '计费方式', dataIndex: 'billingMethod', key: 'billingMethod', width: 110 },
  { title: '用量', dataIndex: 'usage', key: 'usage', width: 120 },
  { title: '金额', dataIndex: 'amount', key: 'amount', width: 130 },
  { title: '支付方式', dataIndex: 'payMethod', key: 'payMethod', width: 110 },
  { title: '支付时间', dataIndex: 'paidAt', key: 'paidAt', width: 150 },
  { title: '发票号', dataIndex: 'invoice', key: 'invoice', width: 160 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
];

const currentColumns = computed(() => {
  if (applied.value.type === 'pack') return packColumns;
  if (applied.value.type === 'direct') return directColumns;
  return monthlyColumns;
});

const filteredData = computed(() => {
  const f = applied.value;
  if (f.type === 'monthly') {
    return orgMonthlyBills
      .filter((r) => {
        if (f.status && r.status !== f.status) return false;
        return true;
      })
      .map((r) => ({ key: r.id, ...r }));
  }
  if (f.type === 'pack') {
    return tokenPackOrders
      .filter((r) => {
        if (f.status && r.status !== f.status) return false;
        if (f.payMethod && r.payMethod !== f.payMethod) return false;
        return true;
      })
      .map((r) => ({ key: r.id, ...r }));
  }
  return directPayOrders
    .filter((r) => {
      if (f.status && r.status !== f.status) return false;
      if (f.payMethod && r.payMethod !== f.payMethod) return false;
      return true;
    })
    .map((r) => ({ key: r.id, ...r }));
});

function statusBadge(status: string): 'success' | 'processing' | 'warning' | 'default' | 'error' {
  if (status === '已结算' || status === '已用完') return 'default';
  if (status === '已支付' || status === '已开票') return 'success';
  if (status === '使用中') return 'processing';
  if (status === '异常' || status === '已过期') return 'error';
  return 'warning';
}

function onExport() {
  message.success('账单导出请求已提交，文件将通过邮件发送');
}
</script>
