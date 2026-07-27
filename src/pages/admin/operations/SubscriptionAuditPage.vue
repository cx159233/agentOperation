<template>
  <div class="p-[20px]">
    <PageHeader title="服务订阅审核" description="机构提交的服务订阅申请需要人工审核，审核通过后机构才能获得对应词元额度" />

    <!-- 审核流程说明 -->
    <section class="mb-[14px] overflow-hidden rounded-[10px] relative bg-gradient-to-br from-[#f0f5ff] via-white to-[#e6efff]">
      <!-- 装饰光晕 -->
      <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(circle at 0% 0%, rgba(22,93,255,0.08) 0%, transparent 40%), radial-gradient(circle at 100% 100%, rgba(22,93,255,0.06) 0%, transparent 40%);"></div>
      <!-- 装饰圆形 -->
      <div class="absolute -top-[40px] -right-[40px] w-[120px] h-[120px] rounded-full bg-primary/5 pointer-events-none"></div>
      <div class="absolute -bottom-[30px] -left-[30px] w-[80px] h-[80px] rounded-full bg-primary/5 pointer-events-none"></div>
      <div class="relative px-[24px] py-[10px] flex items-center gap-[10px]">
        <div class="w-[4px] h-[14px] rounded-full bg-gradient-to-b from-primary to-primary/50" />
        <span class="text-[14px] font-semibold text-text-primary">订阅审核流程</span>
      </div>
      <div class="relative px-[24px] pt-[20px] pb-[20px]">
        <div class="flex items-center">
          <template v-for="(step, idx) in auditSteps" :key="step.title">
            <div class="flex-1 flex items-center justify-center gap-[12px] group">
              <div class="relative shrink-0">
                <div class="w-[34px] h-[34px] rounded-full bg-white border-[2px] border-primary/30 grid place-items-center transition-all duration-300 group-hover:border-primary group-hover:shadow-md group-hover:shadow-primary/15">
                  <component :is="auditStepIcons[idx]" class="text-[15px] text-primary" />
                </div>
                <div class="absolute -top-[3px] -right-[3px] w-[15px] h-[15px] rounded-full bg-primary text-white text-[9px] font-bold grid place-items-center">{{ idx + 1 }}</div>
              </div>
              <div class="min-w-0">
                <div class="text-[13px] font-semibold text-text-primary leading-[18px]">{{ step.title }}</div>
                <p class="text-[11px] text-text-secondary leading-[16px] mt-[2px]">{{ step.desc }}</p>
              </div>
            </div>
            <svg v-if="idx < auditSteps.length - 1" width="16" height="16" viewBox="0 0 16 16" class="text-primary/40 mx-[14px] shrink-0">
              <path d="M6 4 L10 8 L6 12" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
        </div>
      </div>
    </section>

    <!-- 表格区 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <template #actions>
          <a-button @click="onExport">
            <template #icon><DownloadOutlined /></template>
            导出审核记录
          </a-button>
        </template>
        <a-input v-model:value="filter.orgName" style="width: 200px" placeholder="机构名称" allow-clear />
        <a-select v-model:value="filter.packageName" style="width: 180px" placeholder="词元包" allow-clear>
          <a-select-option v-for="pkg in tokenPackages" :key="pkg.name" :value="pkg.name">{{ pkg.name }}</a-select-option>
        </a-select>
        <a-select v-model:value="filter.status" style="width: 140px" placeholder="审核状态" allow-clear>
          <a-select-option value="审核中">审核中</a-select-option>
          <a-select-option value="已通过">已通过</a-select-option>
          <a-select-option value="已驳回">已驳回</a-select-option>
        </a-select>
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>

      <div class="px-[16px] py-[16px]">
        <a-table :columns="visibleColumns" :data-source="filteredData" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'status'">
              <a-badge :status="statusBadge(record.status)" :text="record.status" />
            </template>
            <template v-if="column.dataIndex === 'discountPrice'">
              <span class="font-num text-text-primary">{{ record.discountPrice }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" size="small" class="!p-0" @click="onReview(record)">审核详情</a-button>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 审核详情抽屉 -->
    <a-drawer v-model:open="drawer.visible" title="服务订阅审核详情" :width="720" placement="right">
      <template v-if="drawer.record">
        <!-- 基础信息 -->
        <div class="flex items-center gap-[8px] mb-[12px]">
          <div class="w-[3px] h-[14px] bg-primary rounded-full" />
          <span class="text-[14px] font-semibold text-text-primary">基础信息</span>
        </div>
        <a-descriptions :column="2" bordered size="small" class="mb-[16px]">
          <a-descriptions-item label="机构名称" :span="2">{{ drawer.record.orgName }}</a-descriptions-item>
          <a-descriptions-item label="联系人">{{ drawer.record.contactName }}</a-descriptions-item>
          <a-descriptions-item label="联系电话">{{ drawer.record.contactPhone }}</a-descriptions-item>
          <a-descriptions-item label="词元包">{{ drawer.record.packageName }}</a-descriptions-item>
          <a-descriptions-item label="折扣后价格">{{ drawer.record.discountPrice }}</a-descriptions-item>
          <a-descriptions-item label="提交时间">{{ drawer.record.submittedAt }}</a-descriptions-item>
          <a-descriptions-item label="当前状态">
            <a-badge :status="statusBadge(drawer.record.status)" :text="drawer.record.status" />
          </a-descriptions-item>
        </a-descriptions>

        <!-- 审核历史 -->
        <div class="flex items-center justify-between mb-[12px]">
          <div class="flex items-center gap-[8px]">
            <div class="w-[3px] h-[14px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">审核历史</span>
            <span class="text-[12px] text-text-tertiary">共 {{ drawer.record.auditLogs.length }} 条记录</span>
          </div>
        </div>
        <div class="space-y-[10px] mb-[16px]">
          <div
            v-for="(log, idx) in drawer.record.auditLogs"
            :key="idx"
            class="rounded-[4px] border p-[12px] cursor-pointer transition-colors"
            :class="drawer.activeLog === idx ? 'border-primary bg-primary/5' : 'border-border-soft hover:border-primary/40'"
            @click="drawer.activeLog = idx"
          >
            <div class="flex items-center justify-between mb-[6px]">
              <div class="flex items-center gap-[8px]">
                <span class="text-[13px] font-semibold text-text-primary">{{ log.action }}</span>
                <a-tag :color="log.status === '已通过' ? 'success' : log.status === '已驳回' ? 'error' : 'processing'" class="!m-0">{{ log.status }}</a-tag>
              </div>
              <span class="text-[11px] text-text-tertiary">{{ log.auditAt }}</span>
            </div>
            <div v-if="log.auditor" class="text-[12px] text-text-secondary mb-[4px]">审核人：{{ log.auditor }}</div>
            <div v-if="log.opinion" class="mt-[6px] text-[12px] text-text-secondary leading-[18px]">
              <span class="text-text-tertiary">审核意见：</span>{{ log.opinion }}
            </div>
          </div>
        </div>

        <!-- 审核意见（仅当前审核中可操作） -->
        <template v-if="drawer.record.status === '审核中'">
          <a-divider />
          <div class="text-[13px] font-semibold text-text-primary mb-[10px]">审核意见</div>
          <a-textarea v-model:value="drawer.opinion" :rows="3" placeholder="请填写审核意见，驳回时必填" />
          <div class="mt-[14px] flex justify-end gap-[8px]">
            <a-button danger @click="onReject">驳回</a-button>
            <a-button type="primary" @click="onPass">通过</a-button>
          </div>
        </template>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { CheckCircleOutlined, DownloadOutlined, ProfileOutlined, AuditOutlined } from '@ant-design/icons-vue';
import { tokenPackages } from '../../../data';
import { subscriptionAuditRecords } from '../../../data/operations';
import type { SubscriptionAuditRecord } from '../../../data/operations';
import PageHeader from '../../../components/common/PageHeader.vue';
import FilterBar from '../../../components/common/FilterBar.vue';
import ColumnSettings from '../../../components/common/ColumnSettings.vue';

const columns = [
  { title: '机构名称', dataIndex: 'orgName', key: 'orgName' },
  { title: '词元包', dataIndex: 'packageName', key: 'packageName', width: 140 },
  { title: '折扣价格', dataIndex: 'discountPrice', key: 'discountPrice', width: 120 },
  { title: '联系人', dataIndex: 'contactName', key: 'contactName', width: 120 },
  { title: '提交时间', dataIndex: 'submittedAt', key: 'submittedAt', width: 160 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 100 },
];

const filter = ref({ orgName: '', packageName: undefined as string | undefined, status: undefined as string | undefined });
const applied = ref({ orgName: '', packageName: undefined as string | undefined, status: undefined as string | undefined });
const hiddenKeys = ref<string[]>([]);
const visibleColumns = computed(() => columns.filter((c) => !hiddenKeys.value.includes(c.key)));

function onSearch() {
  applied.value = { ...filter.value };
}
function onReset() {
  filter.value = { orgName: '', packageName: undefined, status: undefined };
  applied.value = { orgName: '', packageName: undefined, status: undefined };
}

// 订阅审核流程说明
const auditSteps = [
  { title: '申请信息核验', desc: '核验机构主体资质、联系人信息、词元包选择合理性' },
  { title: '词元包匹配', desc: '校验词元包定价、折扣规则、机构适用范围与额度上限' },
  { title: '额度发放', desc: '审核通过后向机构账户发放对应词元额度并通知联系人' },
];
const auditStepIcons = [ProfileOutlined, AuditOutlined, CheckCircleOutlined];

const filteredData = computed(() => {
  const f = applied.value;
  return subscriptionAuditRecords
    .filter((r) => {
      if (f.orgName && !r.orgName.includes(f.orgName)) return false;
      if (f.packageName && r.packageName !== f.packageName) return false;
      if (f.status && r.status !== f.status) return false;
      return true;
    });
});

function statusBadge(status: string): 'processing' | 'success' | 'error' | 'default' {
  if (status === '审核中') return 'processing';
  if (status === '已通过') return 'success';
  if (status === '已驳回') return 'error';
  return 'default';
}

const drawer = ref<{ visible: boolean; record: SubscriptionAuditRecord | null; opinion: string; activeLog: number }>({ visible: false, record: null, opinion: '', activeLog: 0 });

function onReview(record: any) {
  const full = subscriptionAuditRecords.find((r) => r.key === record.key);
  if (!full) return;
  drawer.value = { visible: true, record: full, opinion: '', activeLog: Math.max(0, full.auditLogs.length - 1) };
}

function onPass() {
  message.success('订阅审核已通过，词元额度已发放');
  drawer.value.visible = false;
}

function onReject() {
  if (!drawer.value.opinion) {
    message.warning('请填写驳回原因');
    return;
  }
  message.success('已驳回，原因已通知机构');
  drawer.value.visible = false;
}

function onExport() {
  message.success('审核记录导出请求已提交');
}
</script>
