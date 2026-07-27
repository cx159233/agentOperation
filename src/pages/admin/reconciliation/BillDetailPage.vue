<template>
  <div class="p-[20px]">
    <!-- 顶部返回 + 标题 -->
    <div class="flex items-center gap-[8px] mb-[14px]">
      <a-button type="text" class="!px-[6px] !text-text-secondary" @click="onBack">
        <template #icon><ArrowLeftOutlined /></template>
        返回周期账单
      </a-button>
      <a-divider type="vertical" class="!mx-[4px]" />
      <span class="text-[12px] text-text-tertiary">周期账单 / 账单明细</span>
    </div>

    <template v-if="bill">
      <!-- 账单概要 -->
      <section class="cloud-card p-[16px] mb-[14px]">
        <div class="flex items-start justify-between mb-[14px]">
          <div>
            <div class="flex items-center gap-[10px]">
              <div class="text-[16px] font-semibold text-text-primary">{{ bill.service }}</div>
              <a-badge :status="statusBadge(bill.status)" :text="bill.status" />
            </div>
            <div class="mt-[6px] text-[12px] text-text-secondary">
              <span class="font-num">{{ bill.period }}</span>
              <span class="mx-[8px] text-border">|</span>
              <span>{{ bill.org }}</span>
              <span class="mx-[8px] text-border">|</span>
              <span>开发者：{{ bill.developer }}</span>
              <span class="mx-[8px] text-border">|</span>
              <span>计费方式：{{ bill.billingMethod }}</span>
            </div>
          </div>
          <div class="flex items-center gap-[10px]">
            <a-button @click="onExport">
              <template #icon><DownloadOutlined /></template>
              导出明细
            </a-button>
            <a-button v-if="bill.status === '待确认'" type="primary" @click="onConfirm">确认账单</a-button>
          </div>
        </div>

        <div class="grid grid-cols-5 gap-[12px]">
          <div class="rounded-[6px] border border-border-soft p-[12px]">
            <div class="text-[12px] text-text-secondary">调用次数</div>
            <div class="mt-[6px] font-num text-[20px] font-semibold text-text-primary">{{ bill.calls }}</div>
          </div>
          <div class="rounded-[6px] border border-border-soft p-[12px]">
            <div class="text-[12px] text-text-secondary">词元消耗</div>
            <div class="mt-[6px] font-num text-[20px] font-semibold text-text-primary">{{ bill.tokens }}</div>
          </div>
          <div class="rounded-[6px] border border-border-soft p-[12px]">
            <div class="text-[12px] text-text-secondary">账单总额</div>
            <div class="mt-[6px] font-num text-[20px] font-semibold text-text-primary">{{ bill.gross }}</div>
          </div>
          <div class="rounded-[6px] border border-border-soft p-[12px]">
            <div class="text-[12px] text-text-secondary">AI 厂商分成（70%）</div>
            <div class="mt-[6px] font-num text-[20px] font-semibold text-success">{{ bill.share }}</div>
          </div>
          <div class="rounded-[6px] border border-border-soft p-[12px]">
            <div class="text-[12px] text-text-secondary">分润对象</div>
            <div class="mt-[6px] text-[14px] font-semibold text-text-primary">{{ shareCount }} 方</div>
            <div class="mt-[2px] text-[11px] text-text-tertiary">医保/运营/厂商/运维</div>
          </div>
        </div>
      </section>

      <!-- 分润明细 -->
      <section class="cloud-card p-[0] overflow-hidden mb-[14px]">
        <div class="px-[16px] py-[14px] flex items-center justify-between">
          <div>
            <div class="text-[14px] font-semibold text-text-primary">分润明细</div>
            <div class="text-[11px] text-text-secondary mt-[4px]">按 70 / 15 / 10 / 5 比例分润</div>
          </div>
          <span class="text-[12px] text-text-tertiary">账单总额 {{ bill.gross }}</span>
        </div>
        <div class="border-t border-[#e8e8e8] mx-[16px]"></div>
        <div class="px-[16px] py-[14px]">
          <a-table :columns="shareColumns" :data-source="shareBreakdown" :pagination="false" size="middle">
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

      <!-- 调用明细 -->
      <section class="cloud-card p-[0] overflow-hidden">
        <div class="px-[16px] py-[14px] flex items-center justify-between">
          <div>
            <div class="text-[14px] font-semibold text-text-primary">本期调用明细</div>
            <div class="text-[11px] text-text-secondary mt-[4px]">按服务与机构筛选的调用记录与扣费情况</div>
          </div>
          <span class="text-[12px] text-text-tertiary">共 {{ callList.length }} 条</span>
        </div>
        <div class="border-t border-[#e8e8e8] mx-[16px]"></div>
        <div class="px-[16px] py-[14px]">
          <a-table :columns="callColumns" :data-source="callList" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle" row-key="id">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'status'">
                <a-badge :status="callStatusBadge(record.status)" :text="record.status" />
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
    </template>

    <a-empty v-else description="账单不存在" class="!mt-[60px]">
      <a-button type="primary" @click="onBack">返回周期账单</a-button>
    </a-empty>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { monthlyBills, shareDistributions, callDetails } from '../../../data/reconciliation';
import type { MonthlyBill } from '../../../data/reconciliation';

const route = useRoute();
const router = useRouter();

const billId = computed(() => String(route.params.id ?? ''));

const bill = computed<MonthlyBill | undefined>(() => monthlyBills.find((b) => b.id === billId.value));

const shareCount = shareDistributions.length;

const shareColumns = [
  { title: '分润对象', dataIndex: 'share', key: 'share', width: 200 },
  { title: '分润比例', dataIndex: 'ratio', key: 'ratio', width: 200 },
  { title: '分润金额', dataIndex: 'amount', key: 'amount', width: 160 },
  { title: '说明', dataIndex: 'description', key: 'description' },
];

const shareBreakdown = computed(() => {
  if (!bill.value) return [];
  const gross = Number(bill.value.gross.replace(/[^\d.]/g, ''));
  return shareDistributions.map((s) => ({
    key: s.share,
    share: s.share,
    ratio: s.ratio,
    amount: `¥ ${(gross * s.ratio / 100).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    description: s.description,
  }));
});

function shareColor(share: string) {
  if (share.includes('医保')) return '#165DFF';
  if (share.includes('运营服务')) return '#13B8C6';
  if (share.includes('AI厂商')) return '#10B981';
  return '#F59E0B';
}

const callColumns = [
  { title: '调用时间', dataIndex: 'time', key: 'time', width: 160 },
  { title: '调用主体', dataIndex: 'caller', key: 'caller', width: 110 },
  { title: '机构', dataIndex: 'org', key: 'org', width: 180 },
  { title: '科室', dataIndex: 'department', key: 'department', width: 110 },
  { title: '服务', dataIndex: 'service', key: 'service', width: 200 },
  { title: '开发者', dataIndex: 'developer', key: 'developer', width: 200 },
  { title: '计费方式', dataIndex: 'billingMethod', key: 'billingMethod', width: 110 },
  { title: '用量', dataIndex: 'usage', key: 'usage', width: 110 },
  { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', width: 130 },
  { title: '金额', dataIndex: 'amount', key: 'amount', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '异常信息', dataIndex: 'exception', key: 'exception', width: 200 },
];

const callList = computed(() => {
  if (!bill.value) return [];
  return callDetails
    .filter((c) => c.service === bill.value!.service && c.org === bill.value!.org)
    .map((c) => ({ key: c.id, ...c }));
});

function statusBadge(status: string): 'success' | 'warning' | 'default' | 'error' {
  if (status === '已结算') return 'default';
  if (status === '已确认') return 'success';
  if (status === '异常') return 'error';
  return 'warning';
}

function callStatusBadge(status: string): 'success' | 'processing' | 'error' {
  if (status === '已扣费') return 'success';
  if (status === '处理中') return 'processing';
  return 'error';
}

function onBack() {
  router.push({ name: 'ReconciliationBills' });
}

function onConfirm() {
  if (!bill.value) return;
  message.success(`${bill.value.org} - ${bill.value.service} 账单已确认`);
}

function onExport() {
  if (!bill.value) return;
  message.success(`${bill.value.org} - ${bill.value.service} 账单明细导出请求已提交`);
}
</script>
