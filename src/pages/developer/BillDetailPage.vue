<template>
  <div class="p-[20px]">
    <!-- 顶部返回 + 标题 -->
    <div class="flex items-center gap-[8px] mb-[14px]">
      <a-button type="text" class="!px-[6px] !text-text-secondary" @click="onBack">
        <template #icon><ArrowLeftOutlined /></template>
        返回账单管理
      </a-button>
      <a-divider type="vertical" class="!mx-[4px]" />
      <span class="text-[12px] text-text-tertiary">账单管理 / 账单明细</span>
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
              <span>调用机构：{{ bill.org }}</span>
              <span class="mx-[8px] text-border">|</span>
              <span>计费方式：{{ bill.billingMethod }}</span>
            </div>
          </div>
          <div class="flex items-center gap-[10px]">
            <a-button @click="onExport">
              <template #icon><DownloadOutlined /></template>
              导出明细
            </a-button>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-[12px]">
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
            <div class="text-[12px] text-text-secondary">本机构收益</div>
            <div class="mt-[6px] font-num text-[20px] font-semibold text-success">{{ bill.share }}</div>
          </div>
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
      <a-button type="primary" @click="onBack">返回账单管理</a-button>
    </a-empty>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { revenueBills } from '../../data/developerCenter';
import { callDetails } from '../../data/reconciliation';
import type { RevenueBill } from '../../data/developerCenter';

const route = useRoute();
const router = useRouter();

const billId = computed(() => String(route.params.id ?? ''));

const bill = computed<RevenueBill | undefined>(() => revenueBills.find((b) => b.id === billId.value));

const callColumns = [
  { title: '调用时间', dataIndex: 'time', key: 'time', width: 160 },
  { title: '调用主体', dataIndex: 'caller', key: 'caller', width: 110 },
  { title: '机构', dataIndex: 'org', key: 'org', width: 180 },
  { title: '科室', dataIndex: 'department', key: 'department', width: 110 },
  { title: '服务', dataIndex: 'service', key: 'service', width: 200 },
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
  router.push({ name: 'DeveloperRevenue' });
}

function onExport() {
  if (!bill.value) return;
  message.success(`${bill.value.org} - ${bill.value.service} 账单明细导出请求已提交`);
}
</script>
