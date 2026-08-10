<template>
  <div ref="pageRoot" class="p-[20px]">
    <PageHeader title="模型/智能体" description="将各类模型、智能体纳入统一目录体系，按能力分类与风险等级差异化纳管" />

    <!-- 模型编目表格 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <template #actions>
          <a-button v-if="isAdmin" type="primary" @click="onCreate">
            <template #icon><PlusOutlined /></template>
            新增编目
          </a-button>
        </template>
        <a-range-picker v-model:value="filter.createdAt" style="width: 240px" :placeholder="['创建开始', '创建结束']" />
        <a-input v-model:value="filter.name" style="width: 160px" placeholder="模型名称" allow-clear />
        <a-input v-model:value="filter.internalId" style="width: 180px" placeholder="资产标识" allow-clear />
        <a-input v-model:value="filter.code" style="width: 160px" placeholder="模型代码" allow-clear />
        <a-input v-model:value="filter.unit" style="width: 180px" placeholder="服务商名称" allow-clear />
        <a-select v-model:value="filter.status" style="width: 140px" placeholder="接入状态" allow-clear>
          <a-select-option value="已上线使用">已上线使用</a-select-option>
          <a-select-option value="已下架">已下架</a-select-option>
        </a-select>
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>

      <div class="px-[16px] py-[16px]">
        <a-table :columns="visibleColumns" :data-source="filteredModels" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 项` }" size="middle" :row-key="(r: any) => r.id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'title'">
              <span class="font-semibold text-text-primary">{{ record.title }}</span>
              <div class="text-[12px] text-text-tertiary mt-[2px] font-num">{{ record.internalId || '--' }}</div>
            </template>
            <template v-else-if="column.dataIndex === 'code'">
              <span class="font-num">{{ record.code || record.id?.toUpperCase() }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'createdAt'">
              <span class="font-num whitespace-nowrap">{{ record.createdAt }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-badge :status="statusBadge(record.status)" :text="record.status" class="mvp-status-badge" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space v-if="isAdmin" size="small">
                <a-button type="link" size="small" class="!p-0" @click="onView(record)">详情</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0" @click="onEdit(record)">编辑</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0" :class="record.status === '已上线使用' ? '!text-danger' : ''" @click="onToggleClick(record)">{{ record.status === '已下架' ? '上架' : '下架' }}</a-button>
              </a-space>
              <a-space v-else size="small">
                <a-button type="link" size="small" class="!p-0" @click="onView(record)">详情</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0" @click="onApplyAccess(record)">申请使用</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 查看抽屉 -->
    <a-drawer v-model:open="viewDrawer.visible" title="模型编目详情" :width="860" placement="right" :get-container="getDemoPanel">
      <template v-if="viewDrawer.record">
        <div class="drawer-header-row">
          <div class="drawer-header-icon">
            <img v-if="viewDrawer.record.logo" :src="viewDrawer.record.logo" class="w-full h-full object-cover rounded-[10px]" alt="" />
            <RobotOutlined v-else class="text-[28px] text-white" />
          </div>
          <div class="drawer-header-info">
            <div class="drawer-header-title-row">
              <span class="drawer-header-title">{{ viewDrawer.record.title }}</span>
              <a-badge :status="statusBadge(viewDrawer.record.status)" :text="viewDrawer.record.status" />
            </div>
            <div class="drawer-header-sub">
              <span>资产标识：{{ viewDrawer.record.internalId || '--' }}</span>
            </div>
          </div>
        </div>

        <a-tabs v-model:activeKey="viewDrawer.activeTab" class="mvp-detail-tabs">
          <!-- Tab1 概览 -->
          <a-tab-pane key="info" tab="概览">
            <div class="text-[14px] font-semibold text-text-primary mb-[10px]">基本信息</div>
            <a-descriptions :column="2" bordered size="small" class="mb-[16px]">
              <a-descriptions-item label="服务商名称">{{ viewDrawer.record.unit }}</a-descriptions-item>
              <a-descriptions-item label="模型代码">{{ viewDrawer.record.code || viewDrawer.record.id?.toUpperCase() }}</a-descriptions-item>
              <a-descriptions-item label="统一社会信用代码">91110108MA0012XY3A</a-descriptions-item>
              <a-descriptions-item label="创建时间">{{ viewDrawer.record.createdAt || '--' }}</a-descriptions-item>
              <a-descriptions-item label="一句话简介" :span="2">{{ viewDrawer.record.description || '--' }}</a-descriptions-item>
              <a-descriptions-item label="适用场景" :span="2">
                <template v-if="(viewDrawer.record.tags ?? []).length">
                  <a-tag v-for="t in viewDrawer.record.tags" :key="t" class="!mb-[4px] !text-[14px]" style="background: #f0f0f0; border: 1px solid #d9d9d9;">{{ t }}</a-tag>
                </template>
                <span v-else>--</span>
              </a-descriptions-item>
              <a-descriptions-item label="产品介绍" :span="2">{{ viewDrawer.record.description || '--' }}</a-descriptions-item>
            </a-descriptions>

            <div class="text-[14px] font-semibold text-text-primary mb-[10px]">调用说明</div>
            <a-descriptions :column="1" bordered size="small" class="mb-[16px]">
              <a-descriptions-item label="前端入口">
                <span class="font-num text-[12px]">{{ viewDrawer.record.entryUrl || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="推送地址">
                <span class="font-num text-[12px]">--</span>
              </a-descriptions-item>
              <a-descriptions-item label="推送查询地址">
                <span class="font-num text-[12px]">api.jsyb-ai.cn</span>
              </a-descriptions-item>
            </a-descriptions>

            <div class="text-[14px] font-semibold text-text-primary mb-[10px] mt-[16px]">数据要求</div>
            <a-descriptions :column="2" bordered size="small">
              <a-descriptions-item label="配置类别">--</a-descriptions-item>
              <a-descriptions-item label="支持的检查模态" :span="2">
                <template v-if="(viewDrawer.record.modalities ?? []).length">
                  <a-tag v-for="m in viewDrawer.record.modalities" :key="m" class="!m-0 !mr-[4px] !text-[14px]" style="background: #f0f0f0; border: 1px solid #d9d9d9;">{{ m }}</a-tag>
                </template>
                <span v-else>--</span>
              </a-descriptions-item>
              <a-descriptions-item label="符合要求的数据说明" :span="2">--</a-descriptions-item>
            </a-descriptions>
          </a-tab-pane>

          <!-- Tab2 审核信息 -->
          <!--
          <a-tab-pane key="audit" tab="审核信息">
            <div class="text-[14px] font-semibold text-text-primary mb-[10px]">审核记录</div>
            <a-table :columns="auditColumns" :data-source="viewDrawer.auditLogs" :pagination="{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'], showTotal: (t: number) => `共 ${t} 条` }" size="small">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'submittedAt' || column.dataIndex === 'auditAt'">
                  <span class="font-num text-[12px]">{{ record[column.dataIndex] }}</span>
                </template>
                <template v-else-if="column.dataIndex === 'status'">
                  <a-tag :color="record.status === '已通过' ? 'success' : record.status === '已驳回' ? 'error' : 'processing'" class="!m-0 !text-[11px]">{{ record.status }}</a-tag>
                </template>
              </template>
            </a-table>
          </a-tab-pane>
          -->
        </a-tabs>
      </template>
    </a-drawer>

    <!-- 新增/编辑跳转至独立页面 -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import dayjs, { type Dayjs } from 'dayjs';
import { PlusOutlined, PictureOutlined, RobotOutlined } from '@ant-design/icons-vue';
import { modelCatalogMvpData } from '../data';
import type { CapabilityCardData } from '../types';
import PageHeader from '../components/common/PageHeader.vue';
import FilterBar from '../components/common/FilterBar.vue';
import ColumnSettings from '../components/common/ColumnSettings.vue';
import { setPrdAnchor } from '../composables/usePrdAnchor';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();
const isAdmin = computed(() => auth.role === 'admin');

const pageRoot = ref<HTMLElement>();

function getDemoPanel(): HTMLElement {
  return document.querySelector('.demo-panel') as HTMLElement
}
const filter = ref<{ name: string; internalId: string; code: string; createdAt?: [Dayjs, Dayjs]; unit: string; status?: string }>({ name: '', internalId: '', code: '', createdAt: undefined, unit: '', status: undefined });
const applied = ref<{ name: string; internalId: string; code: string; createdAt?: [Dayjs, Dayjs]; unit: string; status?: string }>({ name: '', internalId: '', code: '', createdAt: undefined, unit: '', status: undefined });

function onSearch() {
  applied.value = { ...filter.value };
}
function onReset() {
  filter.value = { name: '', internalId: '', code: '', createdAt: undefined, unit: '', status: undefined };
  applied.value = { name: '', internalId: '', code: '', createdAt: undefined, unit: '', status: undefined };
}

const allModels = ref<CapabilityCardData[]>(modelCatalogMvpData);

const filteredModels = computed(() => {
  const f = applied.value;
  return allModels.value.filter((m) => {
    if (f.name && !m.title.includes(f.name)) return false;
    if (f.internalId && !(m.internalId || '').toLowerCase().includes(f.internalId.toLowerCase())) return false;
    if (f.code && !(m.code || m.id).toLowerCase().includes(f.code.toLowerCase())) return false;
    if (f.createdAt && f.createdAt.length === 2 && m.createdAt) {
      const start = f.createdAt[0].format('YYYY-MM-DD');
      const end = f.createdAt[1].format('YYYY-MM-DD');
      const d = m.createdAt.slice(0, 10);
      if (d < start || d > end) return false;
    }
    if (f.unit && !m.unit.includes(f.unit)) return false;
    if (f.status && m.status !== f.status) return false;
    return true;
  });
});

const columns = [
  { title: '模型名称', dataIndex: 'title', key: 'title' },
  { title: '模型代码', dataIndex: 'code', key: 'code', width: 160 },
  { title: '服务商名称', dataIndex: 'unit', key: 'unit', width: 220 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 200 },
];

const auditColumns = [
  { title: '提交审核时间', dataIndex: 'submittedAt', key: 'submittedAt', width: 150 },
  { title: '提交人', dataIndex: 'submitter', key: 'submitter', width: 100 },
  { title: '审核状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '审核意见', dataIndex: 'opinion', key: 'opinion' },
  { title: '审核时间', dataIndex: 'auditAt', key: 'auditAt', width: 150 },
  { title: '操作人', dataIndex: 'auditor', key: 'auditor', width: 100 },
];

const hiddenKeys = ref<string[]>([]);
const visibleColumns = computed(() => columns.filter((c) => !hiddenKeys.value.includes(c.key)));

function statusBadge(status?: string) {
  if (status === '已上线使用') return 'success';
  if (status === '已下架') return 'error';
  return 'default';
}

// 查看抽屉
const viewDrawer = ref<{ visible: boolean; record: CapabilityCardData | null; activeTab: string; auditLogs: any[] }>({ visible: false, record: null, activeTab: 'info', auditLogs: [] });

function onView(record: CapabilityCardData) {
  viewDrawer.value = {
    visible: true,
    record,
    activeTab: 'info',
    auditLogs: [
      { key: '1', submittedAt: record.createdAt || '--', submitter: record.unit, status: '已通过', opinion: '资质核验通过，准予纳入编目', auditAt: record.createdAt || '--', auditor: '李四' },
    ],
  };
  setPrdAnchor('prd-3.2.4');
}

function onApplyAccess(record: CapabilityCardData) {
  message.success(`已提交「${record.title}」的使用申请，等待平台审批`);
}

function onCreate() {
  router.push('/admin/model-catalog-v2/edit');
}

function onEdit(record: CapabilityCardData) {
  router.push(`/admin/model-catalog-v2/edit?id=${record.id}`);
}

function onToggleClick(record: CapabilityCardData) {
  const isOnline = record.status === '已上线使用';
  const action = isOnline ? '下架' : '上架';
  setPrdAnchor('prd-3.2.5');
  Modal.confirm({
    title: `确认${action}该模型？`,
    content: isOnline ? '下架后该模型将不再对机构开放使用。' : '上架后该模型将恢复对机构开放使用。',
    okText: '确定',
    cancelText: '取消',
    getContainer: () => document.querySelector('.demo-panel') as HTMLElement,
    onOk: () => {
      record.status = isOnline ? '已下架' : '已上线使用';
      message.success(`${record.title} 已${action}`);
    },
  });
}
</script>

<style>
.ant-drawer .ant-table-wrapper,
.ant-drawer .ant-table-wrapper .ant-table,
.ant-drawer .ant-table-wrapper .ant-table-container,
.ant-drawer .ant-table-wrapper .ant-table-thead > tr > th,
.ant-drawer .ant-table-wrapper .ant-table-tbody > tr > td,
.ant-drawer .ant-table-wrapper .ant-table-thead > tr:first-child > th:first-child,
.ant-drawer .ant-table-wrapper .ant-table-tbody > tr:first-child > td:first-child,
.ant-drawer .ant-descriptions,
.ant-drawer .ant-descriptions-view,
.ant-drawer .ant-descriptions-row > td,
.ant-drawer .ant-descriptions-row > th {
  border-radius: 0 !important;
}
.ant-drawer .ant-table-thead .ant-table-cell {
  font-weight: normal !important;
}
.ant-drawer .ant-descriptions-item-label {
  width: 160px;
  min-width: 160px;
  max-width: 160px;
  white-space: nowrap;
}
.ant-drawer .ant-descriptions-item-content {
  width: auto;
}
/* MVP 详情抽屉描述列表：表头/表体与 a-table 规范统一 */
.mvp-detail-tabs .ant-descriptions-item-label {
  background: #FAFBFC !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.85) !important;
  font-feature-settings: "tnum" !important;
}
.mvp-detail-tabs .ant-descriptions-item-content {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.65) !important;
  font-feature-settings: "tnum" !important;
}
/* MVP 列表状态列文字颜色统一 0.65（色点不变） */
.mvp-status-badge .ant-badge-status-text {
  color: rgba(0, 0, 0, 0.65) !important;
}

/* 抽屉头部样式 */
.drawer-header-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0 8px;
  margin-bottom: 8px;
}
.drawer-header-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #165DFF 0%, #4096ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}
.drawer-header-info {
  flex: 1;
  min-width: 0;
}
.drawer-header-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}
.drawer-header-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}
.drawer-header-sub {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
}
</style>
