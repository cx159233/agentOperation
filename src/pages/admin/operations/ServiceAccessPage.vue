<template>
  <div class="p-[20px]">
    <PageHeader title="服务上架审核" description="针对模型上架数据的审核，支持多版本审核记录与快照，按风险等级执行差异化审核流程" />

    <!-- 三级审核流程 -->
    <section class="mb-[14px] overflow-hidden rounded-[10px] relative bg-gradient-to-br from-[#f0f5ff] via-white to-[#e6efff]">
      <!-- 装饰光晕 -->
      <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(circle at 0% 0%, rgba(22,93,255,0.08) 0%, transparent 40%), radial-gradient(circle at 100% 100%, rgba(22,93,255,0.06) 0%, transparent 40%);"></div>
      <!-- 装饰圆形 -->
      <div class="absolute -top-[40px] -right-[40px] w-[120px] h-[120px] rounded-full bg-primary/5 pointer-events-none"></div>
      <div class="absolute -bottom-[30px] -left-[30px] w-[80px] h-[80px] rounded-full bg-primary/5 pointer-events-none"></div>
      <div class="relative px-[24px] py-[10px] flex items-center gap-[10px]">
        <div class="w-[4px] h-[14px] rounded-full bg-gradient-to-b from-primary to-primary/50" />
        <span class="text-[14px] font-semibold text-text-primary">三级差异化审核流程</span>
        <span class="text-[12px] text-text-tertiary ml-[8px]">按风险等级执行差异化审核</span>
      </div>
      <div class="relative px-[24px] pt-[20px] pb-[20px]">
        <div class="flex items-stretch">
          <template v-for="(level, idx) in accessReviewLevels" :key="level.level">
            <div class="flex-1 rounded-[8px] p-[14px] flex items-center gap-[10px] bg-white/40 hover:bg-white/60 transition-all">
              <div class="w-[28px] h-[28px] rounded-[6px] bg-primary text-white grid place-items-center text-[13px] font-bold shrink-0">{{ idx + 1 }}</div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-[6px]">
                  <span class="text-[13px] font-semibold text-text-primary truncate">{{ level.title }}</span>
                  <a-tag :color="levelTagColor(level.level)" class="!m-0 !text-[10px]">{{ level.level }}</a-tag>
                </div>
                <div class="mt-[4px] flex items-center gap-[4px] flex-wrap">
                  <template v-for="(step, sIdx) in level.process" :key="step">
                    <span class="text-[11px] text-text-tertiary">{{ step }}</span>
                    <ArrowRightOutlined v-if="sIdx < level.process.length - 1" class="text-[9px] text-text-tertiary" />
                  </template>
                </div>
              </div>
            </div>
            <div v-if="idx < accessReviewLevels.length - 1" class="flex items-center px-[8px]">
              <svg width="16" height="16" viewBox="0 0 16 16" class="text-text-tertiary">
                <path d="M6 4 L10 8 L6 12" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
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
        <a-input v-model:value="filter.name" style="width: 200px" placeholder="服务名称" allow-clear />
        <a-select v-model:value="filter.category" style="width: 200px" placeholder="能力分类" allow-clear>
          <a-select-option v-for="c in categories" :key="c" :value="c">{{ c }}</a-select-option>
        </a-select>
        <a-select v-model:value="filter.riskLevel" style="width: 140px" placeholder="风险等级" allow-clear>
          <a-select-option value="高风险">高风险</a-select-option>
          <a-select-option value="中风险">中风险</a-select-option>
          <a-select-option value="低风险">低风险</a-select-option>
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
            <template v-if="column.dataIndex === 'riskLevel'">
              <a-tag :color="riskColor(record.riskLevel)" class="!m-0">{{ record.riskLevel }}</a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'currentStatus'">
              <a-badge :status="statusBadge(record.currentStatus)" :text="record.currentStatus" />
            </template>
            <template v-else-if="column.dataIndex === 'versionCount'">
              <span class="font-num text-[12px] text-text-secondary">{{ record.versionCount }} 个版本</span>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" size="small" class="!p-0" @click="onReview(record)">审核详情</a-button>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 审核详情抽屉 -->
    <a-drawer v-model:open="drawer.visible" title="服务上架审核详情" :width="760" placement="right">
      <template v-if="drawer.record">
        <!-- 基础信息 -->
        <div class="flex items-center gap-[8px] mb-[12px]">
          <div class="w-[3px] h-[14px] bg-primary rounded-full" />
          <span class="text-[14px] font-semibold text-text-primary">基础信息</span>
        </div>
        <a-descriptions :column="2" bordered size="small" class="mb-[16px]">
          <a-descriptions-item label="服务名称" :span="2">{{ drawer.record.serviceName }}</a-descriptions-item>
          <a-descriptions-item label="能力分类">{{ drawer.record.category }}</a-descriptions-item>
          <a-descriptions-item label="风险等级">
            <a-tag :color="riskColor(drawer.record.riskLevel)" class="!m-0">{{ drawer.record.riskLevel }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="提交单位" :span="2">{{ drawer.record.submitter }}</a-descriptions-item>
          <a-descriptions-item label="版本数" :span="2">{{ drawer.record.versions.length }} 个版本</a-descriptions-item>
        </a-descriptions>

        <!-- 面板切换 -->
        <a-tabs v-model:activeKey="drawer.activePanel" size="small" class="!mb-[8px]">
          <a-tab-pane key="audit" tab="审核记录" />
          <a-tab-pane key="version" tab="版本信息" />
          <a-tab-pane key="material" tab="资质材料" />
        </a-tabs>

        <!-- 审核记录：所有版本所有审核日志的时间线列表 -->
        <template v-if="drawer.activePanel === 'audit'">
          <div class="flex items-center justify-between mb-[10px]">
            <span class="text-[12px] text-text-tertiary">共 {{ allAuditLogs.length }} 条审核记录</span>
            <a-select v-model:value="drawer.auditVersionFilter" style="width: 160px" placeholder="按版本筛选" allow-clear>
              <a-select-option v-for="v in drawer.record.versions" :key="v.version" :value="v.version">{{ v.version }}</a-select-option>
            </a-select>
          </div>
          <a-timeline>
            <a-timeline-item
              v-for="(log, idx) in filteredAuditLogs"
              :key="idx"
              :color="log.action === '通过' ? 'green' : log.action === '驳回' ? 'red' : 'blue'"
            >
              <div class="flex items-center gap-[8px] mb-[4px]">
                <a-tag :color="log.action === '通过' ? 'success' : log.action === '驳回' ? 'error' : 'processing'" class="!m-0 !text-[10px]">{{ log.action }}</a-tag>
                <span class="text-[12px] font-semibold text-text-primary">{{ log.stage }}</span>
                <span class="text-[11px] text-text-tertiary font-mono">{{ log.version }}</span>
              </div>
              <div class="text-[11px] text-text-tertiary mb-[4px]">{{ log.auditor || '系统' }} · {{ log.auditAt }}</div>
              <div v-if="log.opinion" class="text-[12px] text-text-secondary leading-[18px]">{{ log.opinion }}</div>
            </a-timeline-item>
          </a-timeline>
        </template>

        <!-- 版本信息：列表展示各版本基本信息 -->
        <template v-else-if="drawer.activePanel === 'version'">
          <div class="space-y-[10px]">
            <div
              v-for="(v, idx) in drawer.record.versions"
              :key="idx"
              class="rounded-[4px] border border-border-soft p-[12px]"
            >
              <div class="flex items-center justify-between mb-[8px]">
                <div class="flex items-center gap-[8px]">
                  <span class="font-num text-[14px] font-semibold text-text-primary">{{ v.version }}</span>
                  <a-badge :status="statusBadge(v.status)" :text="v.status" />
                  <a-tag class="!m-0 !text-[10px]">{{ v.stage }}</a-tag>
                </div>
                <span class="text-[11px] text-text-tertiary">提交于 {{ v.submittedAt }}</span>
              </div>
              <a-descriptions :column="2" size="small" :colon="false">
                <a-descriptions-item label="计费方式">{{ v.billingMethod }}</a-descriptions-item>
                <a-descriptions-item label="使用范围">{{ v.scope }}</a-descriptions-item>
                <a-descriptions-item label="审核记录" :span="2">{{ v.auditLogs.length }} 条审核日志</a-descriptions-item>
              </a-descriptions>
              <div v-if="v.testReport" class="mt-[8px] rounded-[4px] bg-bg p-[10px] text-[11px] text-text-secondary leading-[18px]">
                <span class="text-text-tertiary">测试报告：</span>{{ v.testReport }}
              </div>
            </div>
          </div>
        </template>

        <!-- 资质材料：按版本切换查看 -->
        <template v-else-if="drawer.activePanel === 'material'">
          <div class="flex items-center justify-between mb-[12px]">
            <span class="text-[12px] text-text-tertiary">选择版本查看资质材料</span>
            <a-select v-model:value="drawer.materialVersion" style="width: 160px">
              <a-select-option v-for="v in drawer.record.versions" :key="v.version" :value="v.version">{{ v.version }}</a-select-option>
            </a-select>
          </div>
          <template v-if="materialVersionDetail">
            <div class="space-y-[6px] mb-[14px]">
              <div v-for="m in materialVersionDetail.materials" :key="m" class="flex items-center justify-between rounded-[6px] border border-border-soft p-[10px]">
                <div class="flex items-center gap-[8px]">
                  <CheckCircleOutlined class="text-success" />
                  <span class="text-[12px] text-text-primary">{{ m }}</span>
                </div>
                <a class="text-primary text-[11px]">查看</a>
              </div>
            </div>
            <template v-if="materialVersionDetail.testReport">
              <div class="text-[12px] font-semibold text-text-primary mb-[8px]">测试报告</div>
              <div class="rounded-[4px] bg-bg p-[10px] text-[12px] text-text-secondary leading-[18px]">
                {{ materialVersionDetail.testReport }}
              </div>
            </template>
          </template>
        </template>

        <!-- 审核意见（仅当前审核中版本可操作） -->
        <template v-if="currentReviewingVersion">
          <a-divider />
          <div class="text-[13px] font-semibold text-text-primary mb-[10px]">审核意见（针对 {{ currentReviewingVersion.version }}）</div>
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
import { ArrowRightOutlined, CheckCircleOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { accessReviewLevels } from '../../../data';
import { serviceAccessRecords } from '../../../data/operations';
import type { ServiceAccessRecord, ServiceVersionReview } from '../../../data/operations';
import type { RiskLevel } from '../../../types';
import PageHeader from '../../../components/common/PageHeader.vue';
import FilterBar from '../../../components/common/FilterBar.vue';
import ColumnSettings from '../../../components/common/ColumnSettings.vue';

const columns = [
  { title: '服务名称', dataIndex: 'serviceName', key: 'serviceName' },
  { title: '能力分类', dataIndex: 'category', key: 'category', width: 220 },
  { title: '风险等级', dataIndex: 'riskLevel', key: 'riskLevel', width: 100 },
  { title: '当前版本', dataIndex: 'currentVersion', key: 'currentVersion', width: 100 },
  { title: '当前阶段', dataIndex: 'currentStage', key: 'currentStage', width: 120 },
  { title: '当前状态', dataIndex: 'currentStatus', key: 'currentStatus', width: 110 },
  { title: '提交单位', dataIndex: 'submitter', key: 'submitter', width: 200 },
  { title: '提交时间', dataIndex: 'submittedAt', key: 'submittedAt', width: 160 },
  { title: '版本数', dataIndex: 'versionCount', key: 'versionCount', width: 100 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 110 },
];

const filter = ref({ name: '', category: undefined as string | undefined, riskLevel: undefined as string | undefined, status: undefined as string | undefined });
const applied = ref({ name: '', category: undefined as string | undefined, riskLevel: undefined as string | undefined, status: undefined as string | undefined });
const hiddenKeys = ref<string[]>([]);
const visibleColumns = computed(() => columns.filter((c) => !hiddenKeys.value.includes(c.key)));

const categories = Array.from(new Set(serviceAccessRecords.map((r) => r.category)));

function onSearch() {
  applied.value = { ...filter.value };
}
function onReset() {
  filter.value = { name: '', category: undefined, riskLevel: undefined, status: undefined };
  applied.value = { name: '', category: undefined, riskLevel: undefined, status: undefined };
}

const filteredData = computed(() => {
  const f = applied.value;
  return serviceAccessRecords
    .filter((r) => {
      if (f.name && !r.serviceName.includes(f.name)) return false;
      if (f.category && r.category !== f.category) return false;
      if (f.riskLevel && r.riskLevel !== f.riskLevel) return false;
      const current = r.versions[r.versions.length - 1];
      if (f.status && current.status !== f.status) return false;
      return true;
    })
    .map((r) => {
      const current = r.versions[r.versions.length - 1];
      return {
        key: r.id,
        serviceName: r.serviceName,
        category: r.category,
        riskLevel: r.riskLevel,
        submitter: r.submitter,
        currentVersion: current.version,
        currentStage: current.stage,
        currentStatus: current.status,
        submittedAt: current.submittedAt,
        versionCount: r.versions.length,
      };
    });
});

function levelBorderClass(level: RiskLevel) {
  if (level === '高风险') return 'border-error/30 bg-error/5';
  if (level === '中风险') return 'border-warning/30 bg-warning/5';
  return 'border-success/30 bg-success/5';
}

function levelTagColor(level: RiskLevel): 'error' | 'warning' | 'success' {
  if (level === '高风险') return 'error';
  if (level === '中风险') return 'warning';
  return 'success';
}

function riskColor(level: string): 'error' | 'warning' | 'success' {
  if (level === '高风险') return 'error';
  if (level === '中风险') return 'warning';
  return 'success';
}

function statusBadge(status: string): 'processing' | 'success' | 'error' | 'default' {
  if (status === '审核中') return 'processing';
  if (status === '已通过') return 'success';
  if (status === '已驳回') return 'error';
  return 'default';
}

const drawer = ref<{
  visible: boolean;
  record: ServiceAccessRecord | null;
  activePanel: 'audit' | 'version' | 'material';
  auditVersionFilter: string | undefined;
  materialVersion: string | undefined;
  opinion: string;
}>({ visible: false, record: null, activePanel: 'audit', auditVersionFilter: undefined, materialVersion: undefined, opinion: '' });

// 所有版本的审核日志聚合（带版本号），按时间倒序
const allAuditLogs = computed(() => {
  if (!drawer.value.record) return [];
  const logs: Array<{ version: string; stage: string; action: string; auditor?: string; auditAt: string; opinion?: string }> = [];
  drawer.value.record.versions.forEach((v) => {
    v.auditLogs.forEach((log) => {
      logs.push({ version: v.version, ...log });
    });
  });
  return logs.sort((a, b) => (a.auditAt < b.auditAt ? 1 : -1));
});

const filteredAuditLogs = computed(() => {
  if (!drawer.value.auditVersionFilter) return allAuditLogs.value;
  return allAuditLogs.value.filter((l) => l.version === drawer.value.auditVersionFilter);
});

const materialVersionDetail = computed<ServiceVersionReview | null>(() => {
  if (!drawer.value.record || !drawer.value.materialVersion) return null;
  return drawer.value.record.versions.find((v) => v.version === drawer.value.materialVersion) ?? null;
});

// 当前审核中的版本（用于展示审核意见操作区）
const currentReviewingVersion = computed<ServiceVersionReview | null>(() => {
  if (!drawer.value.record) return null;
  return drawer.value.record.versions.find((v) => v.status === '审核中') ?? null;
});

function onReview(record: any) {
  const full = serviceAccessRecords.find((r) => r.id === record.key);
  if (!full) return;
  const reviewing = full.versions.find((v) => v.status === '审核中');
  drawer.value = {
    visible: true,
    record: full,
    activePanel: 'audit',
    auditVersionFilter: undefined,
    materialVersion: (reviewing ?? full.versions[full.versions.length - 1]).version,
    opinion: '',
  };
}

function onPass() {
  if (!currentReviewingVersion.value) return;
  message.success(`${currentReviewingVersion.value.version} 审核已通过`);
  drawer.value.visible = false;
}

function onReject() {
  if (!drawer.value.opinion) {
    message.warning('请填写驳回原因');
    return;
  }
  message.success('已驳回，原因已通知开发者');
  drawer.value.visible = false;
}

function onExport() {
  message.success('审核记录导出请求已提交');
}
</script>
