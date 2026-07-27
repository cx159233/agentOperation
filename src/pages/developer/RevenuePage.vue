<template>
  <div class="p-[20px]">
    <PageHeader title="账单管理" description="按账期与机构维度，查询本机构作为服务提供方的收益账单（只读）" />

    <section class="cloud-card p-[0] overflow-hidden">
      <div class="px-[16px] py-[16px] flex items-center justify-between">
        <div class="text-[14px] font-semibold text-text-primary">账单列表</div>
        <div class="flex items-center gap-[10px] flex-wrap">
          <span class="text-[13px] font-semibold text-text-primary">账期：</span>
          <a-radio-group v-model:value="period" button-style="solid">
            <a-radio-button v-for="p in periods" :key="p" :value="p">{{ p }}</a-radio-button>
          </a-radio-group>
          <a-select v-model:value="filterOrg" style="width: 220px" placeholder="全部机构" allow-clear>
            <a-select-option v-for="o in orgs" :key="o" :value="o">{{ o }}</a-select-option>
          </a-select>
          <a-button @click="onExport">
            <template #icon><DownloadOutlined /></template>
            导出本期账单
          </a-button>
        </div>
      </div>

      <div class="px-[16px]">
        <div class="grid grid-cols-3 gap-[14px] py-[14px]">
          <div class="rounded-[8px] border border-border-soft p-[14px]">
            <div class="text-[12px] text-text-secondary">本期收益</div>
            <div class="mt-[6px] font-num text-[22px] font-semibold text-text-primary">{{ periodSummary.gross }}</div>
            <div class="text-[11px] text-text-tertiary mt-[4px]">本机构服务分成收益</div>
          </div>
          <div class="rounded-[8px] border border-border-soft p-[14px]">
            <div class="text-[12px] text-text-secondary">已结算</div>
            <div class="mt-[6px] font-num text-[22px] font-semibold text-text-primary">{{ periodSummary.settled }}</div>
            <div class="text-[11px] text-text-tertiary mt-[4px]">已入账金额</div>
          </div>
          <div class="rounded-[8px] border border-border-soft p-[14px]">
            <div class="text-[12px] text-text-secondary">待结算</div>
            <div class="mt-[6px] font-num text-[22px] font-semibold text-text-primary">{{ periodSummary.pending }}</div>
            <div class="text-[11px] text-text-tertiary mt-[4px]">含待确认 / 已确认</div>
          </div>
        </div>
      </div>

      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>

      <div class="px-[16px] py-[16px]">
        <a-table :columns="columns" :data-source="filteredData" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle">
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
                <a-button type="link" size="small" class="!p-0" @click="onDetail(record)">明细</a-button>
                <a-button type="link" size="small" class="!p-0" @click="onExportRow(record)">导出</a-button>
              </a-space>
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
import { DownloadOutlined } from '@ant-design/icons-vue';
import { revenueBills } from '../../data/developerCenter';
import type { RevenueBill } from '../../data/developerCenter';
import PageHeader from '../../components/common/PageHeader.vue';

const router = useRouter();

const periods = Array.from(new Set(revenueBills.map((r) => r.period))).sort().reverse();
const period = ref(periods[0] ?? '2024-07');
const filterOrg = ref<string | undefined>(undefined);

const orgs = Array.from(new Set(revenueBills.map((r) => r.org)));

const columns = [
  { title: '账期', dataIndex: 'period', key: 'period', width: 100 },
  { title: '调用机构', dataIndex: 'org', key: 'org', width: 180 },
  { title: '服务', dataIndex: 'service', key: 'service' },
  { title: '计费方式', dataIndex: 'billingMethod', key: 'billingMethod', width: 110 },
  { title: '调用次数', dataIndex: 'calls', key: 'calls', width: 110 },
  { title: '词元消耗', dataIndex: 'tokens', key: 'tokens', width: 120 },
  { title: '账单总额', dataIndex: 'gross', key: 'gross', width: 120 },
  { title: '本机构收益', dataIndex: 'share', key: 'share', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 120 },
];

const filteredData = computed(() => {
  return revenueBills
    .filter((r) => {
      if (r.period !== period.value) return false;
      if (filterOrg.value && r.org !== filterOrg.value) return false;
      return true;
    })
    .map((r) => ({ key: r.id, ...r }));
});

const periodSummary = computed(() => {
  const bills = filteredData.value;
  const shareNum = bills.reduce((sum, r) => sum + Number(r.share.replace(/[^\d.]/g, '')), 0);
  const settledNum = bills
    .filter((r) => r.status === '已结算')
    .reduce((sum, r) => sum + Number(r.share.replace(/[^\d.]/g, '')), 0);
  const pendingNum = bills
    .filter((r) => r.status === '待确认' || r.status === '已确认')
    .reduce((sum, r) => sum + Number(r.share.replace(/[^\d.]/g, '')), 0);
  return {
    gross: `¥ ${shareNum.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    settled: `¥ ${settledNum.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    pending: `¥ ${pendingNum.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  };
});

function statusBadge(status: string): 'success' | 'warning' | 'default' | 'error' {
  if (status === '已结算') return 'default';
  if (status === '已确认') return 'success';
  if (status === '异常') return 'error';
  return 'warning';
}

function onDetail(record: RevenueBill) {
  router.push({ name: 'DeveloperBillDetail', params: { id: record.id } });
}

function onExportRow(record: RevenueBill) {
  message.success(`${record.org} - ${record.service} 账单已导出`);
}

function onExport() {
  message.success(`${period.value} 期账单导出请求已提交，文件将通过邮件发送`);
}
</script>
