<template>
  <div class="p-[20px]">
    <PageHeader title="机构入驻审核" description="针对机构入驻申请的审核，支持多次申请记录追溯，字段与机构入驻表单对应" />

    <!-- 入驻审核流程 -->
    <section class="mb-[14px] overflow-hidden rounded-[10px] relative bg-gradient-to-br from-[#f0f5ff] via-white to-[#e6efff]">
      <!-- 装饰光晕 -->
      <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(circle at 0% 0%, rgba(22,93,255,0.08) 0%, transparent 40%), radial-gradient(circle at 100% 100%, rgba(22,93,255,0.06) 0%, transparent 40%);"></div>
      <!-- 装饰圆形 -->
      <div class="absolute -top-[40px] -right-[40px] w-[120px] h-[120px] rounded-full bg-primary/5 pointer-events-none"></div>
      <div class="absolute -bottom-[30px] -left-[30px] w-[80px] h-[80px] rounded-full bg-primary/5 pointer-events-none"></div>
      <div class="relative px-[24px] py-[10px] flex items-center gap-[10px]">
        <div class="w-[4px] h-[14px] rounded-full bg-gradient-to-b from-primary to-primary/50" />
        <span class="text-[14px] font-semibold text-text-primary">入驻审核流程</span>
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
        <a-input v-model:value="filter.unit" style="width: 240px" placeholder="单位名称" allow-clear />
        <a-select v-model:value="filter.type" style="width: 200px" placeholder="单位类型" allow-clear>
          <a-select-option v-for="t in types" :key="t" :value="t">{{ t }}</a-select-option>
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
            <template v-if="column.dataIndex === 'type'">
              <a-tag :color="typeColor(record.type)" class="!m-0">{{ record.type }}</a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'currentStatus'">
              <a-badge :status="statusBadge(record.currentStatus)" :text="record.currentStatus" />
            </template>
            <template v-else-if="column.dataIndex === 'submissionCount'">
              <span class="font-num text-[12px] text-text-secondary">{{ record.submissionCount }} 次申请</span>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" size="small" class="!p-0" @click="onReview(record)">审核详情</a-button>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 审核详情抽屉 -->
    <a-drawer v-model:open="drawer.visible" title="机构入驻审核详情" :width="720" placement="right">
      <template v-if="drawer.record">
        <a-tabs v-model:activeKey="drawer.activeTab" class="!mt-0">
          <a-tab-pane key="basic" tab="基本信息">
            <a-descriptions :column="2" bordered size="small" class="mb-[16px]">
              <a-descriptions-item label="单位名称" :span="2">{{ drawer.record.unit }}</a-descriptions-item>
              <a-descriptions-item label="单位类型">
                <a-tag :color="typeColor(drawer.record.type)" class="!m-0">{{ drawer.record.type }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="法定代表人">{{ drawer.record.legalPerson }}</a-descriptions-item>
              <a-descriptions-item label="统一社会信用代码" :span="2">{{ drawer.record.creditCode }}</a-descriptions-item>
              <a-descriptions-item label="联系人" :span="2">{{ drawer.record.contact }}</a-descriptions-item>
            </a-descriptions>

            <div v-if="activeSubmission" class="mb-[16px]">
              <div class="text-[13px] font-semibold text-text-primary mb-[10px]">资质材料</div>
              <div class="space-y-[6px]">
                <div v-for="m in activeSubmission.materials" :key="m" class="flex items-center justify-between rounded-[4px] border border-border-soft p-[8px]">
                  <div class="flex items-center gap-[8px] text-[12px] text-text-primary">
                    <CheckCircleOutlined class="text-success" />
                    <span>{{ m }}</span>
                  </div>
                  <a class="text-primary text-[11px]">查看</a>
                </div>
              </div>
            </div>
          </a-tab-pane>

          <a-tab-pane key="records" tab="审核记录">
            <a-table
              :columns="auditColumns"
              :data-source="auditTableData"
              :pagination="false"
              size="middle"
              row-key="index"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'status'">
                  <a-badge :status="statusBadge(record.status)" :text="record.status" />
                </template>
                <template v-if="column.dataIndex === 'opinion'">
                  <span class="text-[12px] text-text-secondary">{{ record.opinion || '-' }}</span>
                </template>
                <template v-if="column.dataIndex === 'snapshot'">
                  <a-button type="link" size="small" class="!p-0 !text-primary" @click="onViewSnapshot(record)">查看快照</a-button>
                </template>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>

        <!-- 审核意见（仅当前审核中申请可操作） -->
        <template v-if="activeSubmission && activeSubmission.status === '审核中'">
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
import { CheckCircleOutlined, DownloadOutlined, SafetyCertificateOutlined, AuditOutlined } from '@ant-design/icons-vue';
import { orgAccessRecords } from '../../../data/operations';
import type { OrgAccessRecord, OrgSubmissionHistory } from '../../../data/operations';
import PageHeader from '../../../components/common/PageHeader.vue';
import FilterBar from '../../../components/common/FilterBar.vue';
import ColumnSettings from '../../../components/common/ColumnSettings.vue';

const columns = [
  { title: '单位名称', dataIndex: 'unit', key: 'unit' },
  { title: '单位类型', dataIndex: 'type', key: 'type', width: 140 },
  { title: '统一社会信用代码', dataIndex: 'creditCode', key: 'creditCode', width: 200 },
  { title: '法定代表人', dataIndex: 'legalPerson', key: 'legalPerson', width: 120 },
  { title: '联系人', dataIndex: 'contact', key: 'contact', width: 180 },
  { title: '当前状态', dataIndex: 'currentStatus', key: 'currentStatus', width: 110 },
  { title: '提交时间', dataIndex: 'submittedAt', key: 'submittedAt', width: 160 },
  { title: '申请次数', dataIndex: 'submissionCount', key: 'submissionCount', width: 110 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 110 },
];

const filter = ref({ unit: '', type: undefined as string | undefined, status: undefined as string | undefined });
const applied = ref({ unit: '', type: undefined as string | undefined, status: undefined as string | undefined });
const hiddenKeys = ref<string[]>([]);
const visibleColumns = computed(() => columns.filter((c) => !hiddenKeys.value.includes(c.key)));

const types = Array.from(new Set(orgAccessRecords.map((r) => r.type)));

// 入驻审核流程说明
const auditStepIcons = [SafetyCertificateOutlined, AuditOutlined, CheckCircleOutlined];
const auditSteps = [
  { title: '资质材料核验', desc: '核验基础信息与资质材料' },
  { title: '平台合规审查', desc: '核查信用评级与业务匹配' },
  { title: '入驻协议签署', desc: '签署协议并开通上架权限' },
];

function onSearch() {
  applied.value = { ...filter.value };
}
function onReset() {
  filter.value = { unit: '', type: undefined, status: undefined };
  applied.value = { unit: '', type: undefined, status: undefined };
}

const filteredData = computed(() => {
  const f = applied.value;
  return orgAccessRecords
    .filter((r) => {
      if (f.unit && !r.unit.includes(f.unit)) return false;
      if (f.type && r.type !== f.type) return false;
      if (f.status && r.submissions[r.submissions.length - 1].status !== f.status) return false;
      return true;
    })
    .map((r) => {
      const current = r.submissions[r.submissions.length - 1];
      return {
        key: r.id,
        unit: r.unit,
        type: r.type,
        creditCode: r.creditCode,
        legalPerson: r.legalPerson,
        contact: r.contact,
        currentStatus: current.status,
        submittedAt: current.submittedAt,
        submissionCount: r.submissions.length,
      };
    });
});

function typeColor(type: string): 'blue' | 'cyan' | 'purple' {
  if (type === 'AI 厂商') return 'blue';
  if (type === '医疗机构自研') return 'cyan';
  return 'purple';
}

function statusBadge(status: string): 'processing' | 'success' | 'error' | 'default' {
  if (status === '审核中') return 'processing';
  if (status === '已通过') return 'success';
  if (status === '已驳回') return 'error';
  return 'default';
}

const auditColumns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60 },
  { title: '版本', dataIndex: 'version', key: 'version', width: 80 },
  { title: '提交时间', dataIndex: 'submittedAt', key: 'submittedAt', width: 150 },
  { title: '审核状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '审核人', dataIndex: 'reviewer', key: 'reviewer', width: 100 },
  { title: '审核时间', dataIndex: 'reviewedAt', key: 'reviewedAt', width: 150 },
  { title: '审核意见', dataIndex: 'opinion', key: 'opinion' },
  { title: '快照', dataIndex: 'snapshot', key: 'snapshot', width: 100 },
];

const drawer = ref<{ visible: boolean; record: OrgAccessRecord | null; activeSubmission: number; opinion: string; activeTab: string }>({ visible: false, record: null, activeSubmission: 0, opinion: '', activeTab: 'basic' });

const activeSubmission = computed<OrgSubmissionHistory | null>(() => {
  if (!drawer.value.record) return null;
  return drawer.value.record.submissions[drawer.value.activeSubmission] ?? null;
});

const auditTableData = computed(() => {
  if (!drawer.value.record) return [];
  return drawer.value.record.submissions.map((s, idx) => ({
    key: idx,
    index: drawer.value.record!.submissions.length - idx,
    version: s.version,
    submittedAt: s.submittedAt,
    status: s.status,
    reviewer: s.reviewer || '-',
    reviewedAt: s.reviewedAt || '-',
    opinion: s.opinion || '-',
    snapshot: s.snapshot || '-',
    raw: s,
  }));
});

function onReview(record: any) {
  const full = orgAccessRecords.find((r) => r.id === record.key);
  if (!full) return;
  drawer.value = { visible: true, record: full, activeSubmission: full.submissions.length - 1, opinion: '', activeTab: 'basic' };
}

function onViewSnapshot(record: any) {
  message.success(`已加载「${record.orgName}」的资质快照，可在右侧详情中查看历史版本`);
}

function onPass() {
  message.success('入驻申请已通过，开发者账号已激活');
  drawer.value.visible = false;
}

function onReject() {
  if (!drawer.value.opinion) {
    message.warning('请填写驳回原因');
    return;
  }
  message.success('已驳回，原因已通知申请方');
  drawer.value.visible = false;
}

function onExport() {
  message.success('审核记录导出请求已提交');
}
</script>
