<template>
  <div ref="pageRoot" class="p-[20px]">
    <PageHeader title="服务开通列表" description="查看全量机构已开通服务的额度、凭证与审核溯源信息，支持管理员代开通" />

    <!-- 表格区 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <template #actions>
          <a-button type="primary" @click="onOpenProvision">
            <template #icon><PlusOutlined /></template>
            服务开通
          </a-button>
        </template>
        <a-range-picker v-model:value="filter.range" style="width: 240px" :placeholder="['开始时间', '截止时间']" />
        <a-input v-model:value="filter.serviceName" style="width: 180px" placeholder="服务名称" allow-clear />
        <a-input v-model:value="filter.internalId" style="width: 180px" placeholder="服务ID" allow-clear />
        <a-input v-model:value="filter.unit" style="width: 180px" placeholder="服务商名称" allow-clear />
        <a-input v-model:value="filter.orgName" style="width: 180px" placeholder="申请机构" allow-clear />
        <a-select v-model:value="filter.status" style="width: 120px" placeholder="状态" allow-clear>
          <a-select-option value="未开始">未开始</a-select-option>
          <a-select-option value="已开通">已开通</a-select-option>
          <a-select-option value="已过期">已过期</a-select-option>
          <a-select-option value="已停用">已停用</a-select-option>
        </a-select>
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>

      <div class="px-[16px] py-[16px]">
        <a-table :columns="visibleColumns" :data-source="filteredData" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'id'">
              <span class="font-num text-[13px]">{{ record.id }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'name'">
              <span class="font-semibold text-text-primary">{{ record.name }}</span>
              <div class="text-[12px] text-text-tertiary mt-[2px] font-num">{{ record.internalId || '--' }}</div>
            </template>
            <template v-else-if="column.dataIndex === 'orgName'">
              <span>{{ record.orgName }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'provisionedAt'">
              <span class="font-num whitespace-nowrap">{{ record.provisionedAt }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'validUntil'">
              <span class="font-num whitespace-nowrap">{{ record.validUntil }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'submittedAt'">
              <span class="font-num whitespace-nowrap">{{ record.submittedAt }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-badge :status="statusBadge(getDisplayStatus(record))" :text="getDisplayStatus(record)" class="mvp-status-badge" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button type="link" size="small" class="!p-0" @click="onViewDetail(record)">详情</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0" @click="onEdit(record)">编辑</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button v-if="getDisplayStatus(record) === '已开通'" type="link" size="small" class="!p-0 !text-warning" @click="onToggleClick(record)">停用</a-button>
                <a-button v-else-if="record.status === '已停用'" type="link" size="small" class="!p-0" @click="onToggleClick(record)">启用</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 代开通弹窗 -->
    <a-modal v-model:open="provisionModal.visible" title="服务开通" :width="1200" :footer="null" :mask-closable="false" :body-style="{ padding: '20px' }" :get-container="getDemoPanel">
        <!-- 基本信息 -->
        <div class="flex items-center gap-[8px] mb-[16px]">
          <div class="w-[4px] h-[16px] bg-primary rounded-full" />
          <span class="text-[14px] font-semibold text-text-primary">基本信息</span>
        </div>
        <a-form ref="provisionFormRef" :model="provisionModal" layout="vertical">
          <div class="grid grid-cols-2 gap-x-[16px]">
            <a-form-item label="申请机构" name="orgName" :rules="[{ required: true, message: '请选择申请机构' }]">
              <a-select
                v-model:value="provisionModal.orgName"
                :options="orgSelectOptions"
                show-search
                :filter-option="filterOrg"
                placeholder="请选择申请机构"
                allow-clear
                @change="onOrgChange"
              />
            </a-form-item>
            <a-form-item label="统一社会信用代码" name="orgCreditCode" :rules="[{ required: true, message: '请输入统一社会信用代码' }]">
              <a-input v-model:value="provisionModal.orgCreditCode" disabled placeholder="选择申请机构后自动填入" />
            </a-form-item>
          </div>
          <a-form-item label="用途说明" name="purpose" :rules="[{ required: true, message: '请填写用途说明' }]">
            <a-textarea v-model:value="provisionModal.purpose" :rows="2" placeholder="请描述机构使用该服务的具体业务场景与预期效果" />
          </a-form-item>
          <div class="grid grid-cols-2 gap-x-[16px]">
            <a-form-item label="联系人">
              <a-input v-model:value="provisionModal.contactName" placeholder="请输入联系人姓名" />
            </a-form-item>
            <a-form-item label="联系电话">
              <a-input v-model:value="provisionModal.contactPhone" placeholder="请输入手机号" />
            </a-form-item>
          </div>
          <div class="grid grid-cols-2 gap-x-[16px]">
            <a-form-item name="startDate">
              <template #label>
                开始时间
                <a-tooltip title="留空则创建后即时生效" overlay-class-name="text-[12px]">
                  <QuestionCircleOutlined class="text-text-tertiary ml-[4px] text-[12px]" />
                </a-tooltip>
              </template>
              <a-date-picker v-model:value="provisionModal.startDate" show-time format="YYYY-MM-DD HH:mm:ss" style="width: 100%" placeholder="留空则创建后即时生效" />
            </a-form-item>
            <a-form-item name="endDate">
              <template #label>
                截止时间
                <a-tooltip title="留空则不限期限" overlay-class-name="text-[12px]">
                  <QuestionCircleOutlined class="text-text-tertiary ml-[4px] text-[12px]" />
                </a-tooltip>
              </template>
              <a-date-picker v-model:value="provisionModal.endDate" show-time format="YYYY-MM-DD HH:mm:ss" style="width: 100%" placeholder="留空则不限期限" />
            </a-form-item>
          </div>
        </a-form>

        <!-- 选择服务 -->
        <div class="mt-[4px] pt-[16px] border-t border-[#f0f0f0]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">选择服务</span>
            <span v-if="provisionModal.selectedIds.length" class="text-[11px] text-text-secondary">已选择 <b class="text-primary">{{ provisionModal.selectedIds.length }}</b> 个</span>
            <span v-else class="text-[11px] text-text-tertiary">请至少选择一个服务</span>
            <div class="flex-1"></div>
            <a-input v-model:value="provisionFilter.name" placeholder="模型名称" allow-clear style="width: 160px" />
            <a-input v-model:value="provisionFilter.internalId" placeholder="模型ID" allow-clear style="width: 180px" />
            <a-input v-model:value="provisionFilter.unit" placeholder="服务商名称" allow-clear style="width: 200px" />
            <a-button @click="onProvisionReset">重置</a-button>
            <a-button type="primary" @click="onProvisionSearch">查询</a-button>
          </div>
          <div class="max-h-[280px] overflow-y-auto pr-[4px]">
            <a-table
              :columns="modelColumns"
              :data-source="filteredModels"
              :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50'], showTotal: (t: number) => `共 ${t} 项` }"
              size="small"
              :row-key="(r: any) => r.id"
              :row-selection="{ type: 'checkbox', selectedRowKeys: provisionModal.selectedIds, onChange: onModelSelect }"
              :custom-row="modelRowEvents"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'title'">
                  <span class="font-semibold text-text-primary">{{ record.title }}</span>
                  <div class="text-[12px] text-text-tertiary mt-[2px] font-num">{{ record.internalId || '--' }}</div>
                </template>
                <template v-else-if="column.dataIndex === 'createdAt'">
                  <span class="font-num whitespace-nowrap">{{ record.createdAt }}</span>
                </template>
                <template v-else-if="column.dataIndex === 'status'">
                  <a-badge :status="statusBadge(record.status)" :text="record.status" />
                </template>
              </template>
            </a-table>
            <a-empty v-if="filteredModels.length === 0" description="未找到匹配的服务" class="py-[32px]" />
          </div>
        </div>

        <div class="mt-[16px] pt-[16px] border-t border-[#f0f0f0]">
          <a-alert type="info" show-icon message="代开通提交后即视为审核通过，记录将出现在开通台账中" class="!mb-[12px]" />
          <div class="flex justify-end gap-[8px]">
            <a-button @click="provisionModal.visible = false">取消</a-button>
            <a-button type="primary" @click="confirmProvision">提交开通申请</a-button>
          </div>
        </div>
    </a-modal>

    <!-- 编辑弹窗 -->
    <a-modal v-model:open="editModal.visible" title="服务开通编辑" :width="800" :footer="null" :mask-closable="false" :get-container="getDemoPanel">
      <!-- 基本信息 -->
      <div class="flex items-center gap-[8px] mb-[16px]">
        <div class="w-[4px] h-[16px] bg-primary rounded-full" />
        <span class="text-[14px] font-semibold text-text-primary">基本信息</span>
      </div>
      <a-form ref="editFormRef" :model="editModal" layout="vertical">
        <div class="grid grid-cols-2 gap-x-[16px]">
          <a-form-item label="申请机构">
            <a-input :value="editModal.orgName" disabled />
          </a-form-item>
          <a-form-item label="统一社会信用代码">
            <a-input :value="editModal.orgCreditCode" disabled />
          </a-form-item>
        </div>
        <a-form-item label="用途说明">
          <a-textarea :value="editModal.purpose" :rows="2" disabled />
        </a-form-item>
        <div class="grid grid-cols-2 gap-x-[16px]">
          <a-form-item label="联系人">
            <a-input v-model:value="editModal.contactName" placeholder="请输入联系人姓名" />
          </a-form-item>
          <a-form-item label="联系电话">
            <a-input v-model:value="editModal.contactPhone" placeholder="请输入手机号" />
          </a-form-item>
        </div>
        <div class="grid grid-cols-2 gap-x-[16px]">
          <a-form-item>
            <template #label>
              开始时间
              <a-tooltip title="留空则即时生效" overlay-class-name="text-[12px]">
                <QuestionCircleOutlined class="text-text-tertiary ml-[4px] text-[12px]" />
              </a-tooltip>
            </template>
            <a-date-picker v-model:value="editModal.startDate" show-time format="YYYY-MM-DD HH:mm:ss" style="width: 100%" placeholder="留空则即时生效" />
          </a-form-item>
          <a-form-item>
            <template #label>
              截止时间
              <a-tooltip title="留空则不限期限" overlay-class-name="text-[12px]">
                <QuestionCircleOutlined class="text-text-tertiary ml-[4px] text-[12px]" />
              </a-tooltip>
            </template>
            <a-date-picker v-model:value="editModal.endDate" show-time format="YYYY-MM-DD HH:mm:ss" style="width: 100%" placeholder="留空则不限期限" />
          </a-form-item>
        </div>
      </a-form>
      <div class="border-t border-[#e8e8e8] my-[16px]"></div>
      <div class="flex justify-end gap-[8px]">
        <a-button @click="editModal.visible = false">取消</a-button>
        <a-button type="primary" @click="onEditSubmit">保存</a-button>
      </div>
    </a-modal>

    <!-- 详情抽屉 -->
    <a-drawer v-model:open="drawer.visible" title="服务开通详情" :width="860" placement="right" :get-container="getDemoPanel">
      <template v-if="drawer.record">
        <div class="drawer-header-row">
          <div class="drawer-header-icon">
            <img v-if="drawer.record.logo" :src="drawer.record.logo" class="w-full h-full object-cover rounded-[10px]" alt="" />
            <RobotOutlined v-else class="text-[28px] text-white" />
          </div>
          <div class="drawer-header-info">
            <div class="drawer-header-title-row">
              <span class="drawer-header-title">{{ drawer.record.name }}</span>
              <a-badge :status="statusBadge(getDisplayStatus(drawer.record))" :text="getDisplayStatus(drawer.record)" />
            </div>
            <div class="drawer-header-sub">
              <span>资产标识：{{ drawer.record.internalId || '--' }}</span>
            </div>
          </div>
        </div>
        <a-tabs v-model:activeKey="drawer.activeTab" class="mvp-detail-tabs">
          <!-- Tab1 概览 -->
          <a-tab-pane key="org" tab="概览">
            <div class="text-[14px] font-semibold text-text-primary mb-[10px]">基本信息</div>
            <a-descriptions :column="2" bordered size="small" class="mb-[16px]">
              <a-descriptions-item label="申请机构">{{ drawer.record.orgName }}</a-descriptions-item>
              <a-descriptions-item label="统一社会信用代码">{{ drawer.record.orgCreditCode }}</a-descriptions-item>
              <a-descriptions-item label="联系人">{{ drawer.record.contactName }}</a-descriptions-item>
              <a-descriptions-item label="联系电话">{{ drawer.record.contactPhone }}</a-descriptions-item>
              <a-descriptions-item label="开始时间">{{ drawer.record.provisionedAt }}</a-descriptions-item>
              <a-descriptions-item label="截止时间">{{ drawer.record.validUntil }}</a-descriptions-item>
              <a-descriptions-item label="用途说明" :span="2">{{ drawer.record.purpose }}</a-descriptions-item>
              <a-descriptions-item label="创建时间" :span="2">{{ drawer.record.submittedAt }}</a-descriptions-item>
            </a-descriptions>

            <div class="text-[14px] font-semibold text-text-primary mb-[10px]">服务信息</div>
            <a-descriptions :column="2" bordered size="small">
              <a-descriptions-item label="服务名称">{{ drawer.record.name }}</a-descriptions-item>
              <a-descriptions-item label="服务代码">{{ drawer.record.code }}</a-descriptions-item>
              <a-descriptions-item label="服务商名称">{{ drawer.record.unit }}</a-descriptions-item>
              <a-descriptions-item label="统一社会信用代码">{{ drawer.record.unitCreditCode }}</a-descriptions-item>
            </a-descriptions>
          </a-tab-pane>

          <!-- Tab2 审核信息 -->
          <!--
          <a-tab-pane key="audit" tab="审核信息">
            <div class="text-[14px] font-semibold text-text-primary mb-[10px]">审核记录</div>
            <a-table :columns="auditColumns" :data-source="drawer.record.auditLogs.map((l, i) => ({ key: i, ...l }))" :pagination="{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'], showTotal: (t: number) => `共 ${t} 条` }" size="small">
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
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { PlusOutlined, RobotOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
import dayjs, { type Dayjs } from 'dayjs';
import { provisionedServices } from '../../../data/operations';
import type { ProvisionedService } from '../../../data/operations';
import { modelCatalogMvpData } from '../../../data';
import type { CapabilityCardData } from '../../../types';
import PageHeader from '../../../components/common/PageHeader.vue';
import FilterBar from '../../../components/common/FilterBar.vue';
import ColumnSettings from '../../../components/common/ColumnSettings.vue';
import { setPrdAnchor } from '../../../composables/usePrdAnchor';

const services = reactive(provisionedServices);

const columns = [
  { title: '服务单号', dataIndex: 'id', key: 'id', width: 180 },
  { title: '开始时间', dataIndex: 'provisionedAt', key: 'provisionedAt', width: 170 },
  { title: '截止时间', dataIndex: 'validUntil', key: 'validUntil', width: 170 },
  { title: '服务名称/ID', dataIndex: 'name', key: 'name', width: 200 },
  { title: '服务商名称', dataIndex: 'unit', key: 'unit', width: 220 },
  { title: '申请机构', dataIndex: 'orgName', key: 'orgName', width: 180 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 110 },
  { title: '创建时间', dataIndex: 'submittedAt', key: 'submittedAt', width: 170 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 180 },
];

const auditColumns = [
  { title: '提交审核时间', dataIndex: 'submittedAt', key: 'submittedAt', width: 150 },
  { title: '提交人', dataIndex: 'submitter', key: 'submitter', width: 100 },
  { title: '审核状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '审核意见', dataIndex: 'opinion', key: 'opinion' },
  { title: '审核时间', dataIndex: 'auditAt', key: 'auditAt', width: 150 },
  { title: '操作人', dataIndex: 'auditor', key: 'auditor', width: 100 },
];

const pageRoot = ref<HTMLElement>();

function getDemoPanel(): HTMLElement {
  return document.querySelector('.demo-panel') as HTMLElement
}
const filter = ref<{ orgName: string; serviceName: string; internalId: string; unit: string; status?: string; range?: [Dayjs, Dayjs] }>({
  orgName: '',
  serviceName: '',
  internalId: '',
  unit: '',
  status: undefined,
  range: undefined,
});
const applied = ref<{ orgName: string; serviceName: string; internalId: string; unit: string; status?: string; range?: [Dayjs, Dayjs] }>({
  orgName: '',
  serviceName: '',
  internalId: '',
  unit: '',
  status: undefined,
  range: undefined,
});
const hiddenKeys = ref<string[]>([]);
const visibleColumns = computed(() => columns.filter((c) => !hiddenKeys.value.includes(c.key)));

function onSearch() {
  applied.value = { ...filter.value };
}
function onReset() {
  filter.value = { orgName: '', serviceName: '', internalId: '', unit: '', status: undefined, range: undefined };
  applied.value = { orgName: '', serviceName: '', internalId: '', unit: '', status: undefined, range: undefined };
}

const filteredData = computed(() => {
  const f = applied.value;
  return services
    .filter((s) => {
      if (f.orgName && !s.orgName.includes(f.orgName)) return false;
      if (f.serviceName && !s.name.includes(f.serviceName)) return false;
      if (f.internalId && !(s.internalId || '').toLowerCase().includes(f.internalId.toLowerCase())) return false;
      if (f.unit && !s.unit.includes(f.unit)) return false;
      if (f.status && getDisplayStatus(s) !== f.status) return false;
      if (f.range && f.range.length === 2) {
        const start = f.range[0].format('YYYY-MM-DD 00:00:00');
        const end = f.range[1].format('YYYY-MM-DD 23:59:59');
        if (s.provisionedAt < start || s.provisionedAt > end) return false;
      }
      return true;
    })
    .map((s) => ({ key: s.id, ...s }));
});

const unitCreditCodeMap: Record<string, string> = {
  '推想医疗科技股份有限公司': '91110108MA002XL790',
  '深圳市旭东数字医学影像技术有限公司': '914403005700203962',
  '慧影医疗科技（北京）股份有限公司': '91110108335563403F',
};

const orgCreditCodeMap: Record<string, string> = {
  '常州市第一人民医院': '12320400MB1972156X',
  '常州市人民医院': '12320400MB1972156X',
  '南京鼓楼医院': '12320100MB0123456Y',
  '江苏省人民医院': '12320500MB0789456Z',
  '东南大学附属中大医院': '12320500MB0789456Z',
};

const orgContactMap: Record<string, { name: string; phone: string }> = {
  '常州市第一人民医院': { name: '张伟', phone: '13861001234' },
  '常州市人民医院': { name: '张伟', phone: '13861001234' },
  '南京鼓楼医院': { name: '李明', phone: '13901581234' },
  '江苏省人民医院': { name: '王芳', phone: '13771781234' },
  '东南大学附属中大医院': { name: '王芳', phone: '13771781234' },
};

const orgSelectOptions = computed(() => Object.keys(orgCreditCodeMap).map((k) => ({ label: k, value: k })));
function filterOrg(input: string, option: any) {
  return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
}
function onOrgChange(value: string) {
  provisionModal.value.orgCreditCode = orgCreditCodeMap[value] || '';
}

const orgOptions = computed(() => Array.from(new Set(services.map((s) => s.orgName))));

function getDisplayStatus(s: ProvisionedService): string {
  const now = dayjs();
  if (s.provisionedAt && now.isBefore(dayjs(s.provisionedAt))) return '未开始';
  if (s.validUntil && s.validUntil !== '不限期限' && now.isAfter(dayjs(s.validUntil))) return '已过期';
  if (s.status === '已停用') return '已停用';
  return '已开通';
}

function statusBadge(status: string): 'success' | 'warning' | 'error' | 'default' {
  if (status === '已开通') return 'success';
  if (status === '未开始') return 'default';
  if (status === '已停用') return 'error';
  if (status === '已过期') return 'error';
  return 'default';
}

function ratioColor(ratio: number, threshold: number) {
  if (ratio >= 100) return '#EF4444';
  if (ratio >= threshold) return '#F59E0B';
  return '#165DFF';
}

function ratioTextClass(ratio: number, threshold: number) {
  if (ratio >= 100) return 'text-error font-bold';
  if (ratio >= threshold) return 'text-warning font-bold';
  return 'text-text-secondary';
}

// ===================== 详情抽屉 =====================
const drawer = ref<{ visible: boolean; record: ProvisionedService | null; activeTab: string }>({
  visible: false,
  record: null,
  activeTab: 'org',
});

function onViewDetail(record: any) {
  const full = services.find((s) => s.id === record.id);
  if (!full) return;
  drawer.value = { visible: true, record: full, activeTab: 'org' };
  setPrdAnchor('prd-3.3.4');
}

function onEdit(record: any) {
  editModal.value = {
    visible: true,
    record,
    orgName: record.orgName || '',
    orgCreditCode: record.orgCreditCode || '',
    purpose: record.purpose || '',
    contactName: record.contactName || '',
    contactPhone: record.contactPhone || '',
    startDate: record.provisionedAt ? dayjs(record.provisionedAt) : undefined,
    endDate: record.validUntil ? dayjs(record.validUntil) : undefined,
  };
  setPrdAnchor('prd-3.3.3');
}

function onEditSubmit() {
  const s = services.find((x) => x.id === editModal.value.record?.id);
  if (!s) return;
  s.contactName = editModal.value.contactName;
  s.contactPhone = editModal.value.contactPhone;
  s.provisionedAt = editModal.value.startDate?.format('YYYY-MM-DD HH:mm:ss') || '';
  s.validUntil = editModal.value.endDate?.format('YYYY-MM-DD HH:mm:ss') || '';
  editModal.value.visible = false;
  message.success(`${s.name} 已更新`);
}

function onToggleClick(record: any) {
  const s = services.find((x) => x.id === record.id);
  if (!s) return;
  const isActive = s.status === '已开通';
  const action = isActive ? '停用' : '启用';
  setPrdAnchor('prd-3.3.5');
  Modal.confirm({
    title: `确认${action}该服务？`,
    content: isActive ? '停用后该服务将暂停对外开放。' : '启用后该服务将恢复对外开放。',
    okText: '确定',
    cancelText: '取消',
    getContainer: () => document.querySelector('.demo-panel') as HTMLElement,
    onOk: () => {
      s.status = isActive ? '已停用' : '已开通';
      message.success(`${s.name} 已${action}`);
    },
  });
}

// ===================== 代开通弹窗 =====================
const allModels = computed(() => modelCatalogMvpData);
const modelColumns = [
  { title: '模型名称/ID', dataIndex: 'title', key: 'title' },
  { title: '服务商名称', dataIndex: 'unit', key: 'unit', width: 220 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
];
function onModelSelect(selectedKeys: string[]) {
  provisionModal.value.selectedIds = selectedKeys;
}
const modelRowEvents = (record: any) => ({
  onClick: () => {
    const idx = provisionModal.value.selectedIds.indexOf(record.id);
    if (idx >= 0) {
      provisionModal.value.selectedIds.splice(idx, 1);
    } else {
      provisionModal.value.selectedIds.push(record.id);
    }
  },
});

const provisionModal = ref<{
  visible: boolean;
  selectedIds: string[];
  orgName: string;
  orgCreditCode: string;
  purpose: string;
  contactName: string;
  contactPhone: string;
  startDate: Dayjs | undefined;
  endDate: Dayjs | undefined;
  workbenchMode: 'entry' | 'direct';
  overrideUrl: string;
}>({
  visible: false,
  selectedIds: [],
  orgName: '',
  orgCreditCode: '',
  purpose: '',
  contactName: '',
  contactPhone: '',
  startDate: undefined,
  endDate: undefined,
  workbenchMode: 'entry',
  overrideUrl: '',
});

const editModal = ref<{
  visible: boolean;
  record: any;
  orgName: string;
  orgCreditCode: string;
  purpose: string;
  contactName: string;
  contactPhone: string;
  startDate: Dayjs | undefined;
  endDate: Dayjs | undefined;
}>({
  visible: false,
  record: null,
  orgName: '',
  orgCreditCode: '',
  purpose: '',
  contactName: '',
  contactPhone: '',
  startDate: undefined,
  endDate: undefined,
});
const editFormRef = ref();

const provisionFilter = ref<{ name: string; internalId: string; unit: string | undefined }>({
  name: '',
  internalId: '',
  unit: undefined,
});
const provisionApplied = ref<{ name: string; internalId: string; unit: string | undefined }>({
  name: '',
  internalId: '',
  unit: undefined,
});
function onProvisionSearch() {
  provisionApplied.value = { ...provisionFilter.value };
}
function onProvisionReset() {
  provisionFilter.value = { name: '', internalId: '', unit: undefined };
  provisionApplied.value = { name: '', internalId: '', unit: undefined };
}

const filteredModels = computed(() => {
  const f = provisionApplied.value;
  const nameKw = f.name.trim().toLowerCase();
  return allModels.value.filter((m) => {
    if (m.status !== '已上线使用') return false;
    if (f.unit && !m.unit.includes(f.unit)) return false;
    if (f.internalId && !(m.internalId || '').toLowerCase().includes(f.internalId.toLowerCase())) return false;
    if (nameKw && !m.title.toLowerCase().includes(nameKw)) return false;
    return true;
  });
});

const selectedModels = computed<CapabilityCardData[]>(() => {
  const ids = provisionModal.value.selectedIds;
  if (!ids.length) return [];
  return allModels.value.filter((m) => ids.includes(m.id));
});

function onOpenProvision() {
  provisionModal.value = {
    visible: true,
    selectedIds: [],
    orgName: '',
    orgCreditCode: '',
    purpose: '',
    contactName: '',
    contactPhone: '',
    startDate: undefined,
    endDate: undefined,
    workbenchMode: 'entry',
    overrideUrl: '',
  };
  provisionFilter.value = { name: '', internalId: '', unit: undefined };
  provisionApplied.value = { name: '', internalId: '', unit: undefined };
  setPrdAnchor('prd-3.3.2');
}

const provisionFormRef = ref();

async function confirmProvision() {
  try {
    await provisionFormRef.value.validate();
  } catch {
    return;
  }
  const m = provisionModal.value;
  const models = selectedModels.value;
  if (!models.length) {
    message.warning('请至少选择一个服务');
    return;
  }
  const now = dayjs();
  const baseTs = Date.now();
  models.forEach((model, idx) => {
    const newRecord: ProvisionedService = {
      id: `${now.format('YYYYMMDD')}${String(idx + 1).padStart(4, '0')}`,
      orgName: m.orgName,
      name: model.title,
      code: model.code || model.id?.toUpperCase(),
      unit: model.unit,
      purpose: m.purpose,
      orgCreditCode: orgCreditCodeMap[m.orgName] || '--',
      unitCreditCode: unitCreditCodeMap[model.unit] || '--',
      category: model.category,
      billingMethod: model.billingMethod ?? '按Token',
      validUntil: m.endDate ? dayjs(m.endDate).format('YYYY-MM-DD HH:mm:ss') : '不限期限',
      scope: '-',
      status: '已开通',
      quota: '-',
      used: '0',
      ratio: 0,
      alertThreshold: 80,
      endpoint: `https://api.jsyb-ai.cn/v1/llm/${model.id}/invoke`,
      entryUrl: model.entryUrl || '',
      accessKey: `AK_JSYB_2026_${baseTs.toString(36).toUpperCase()}_${idx}`,
      secretKey: `SK_${Math.random().toString(16).slice(2, 34)}`,
      subAccounts: [],
      provisionedAt: m.startDate?.format('YYYY-MM-DD HH:mm:ss') || now.format('YYYY-MM-DD HH:mm:ss'),
      packageName: '-',
      discountPrice: '-',
      contactName: m.contactName || orgContactMap[m.orgName]?.name || '-',
      contactPhone: m.contactPhone || orgContactMap[m.orgName]?.phone || '-',
      auditor: '李四（代开通）',
      auditOpinion: '管理员代开通，即时生效',
      submittedAt: now.format('YYYY-MM-DD HH:mm:ss'),
      callExample: `curl -X POST ${'${ENDPOINT}'} \\
  -H "Authorization: Bearer ${'${AK}'}:${'${SK}'}" \\
  -H "X-Sub-Account: ${'${DEPT_CODE}'}" \\
  -H "Content-Type: application/json" \\
  -d '${'${PAYLOAD}'}'`,
      payloadExample: `{
  "model": "${model.id}",
  "messages": [
    { "role": "user", "content": "示例请求内容" }
  ]
}`,
      auditLogs: [
        { action: '代开通', status: '已通过', submittedAt: now.format('YYYY-MM-DD HH:mm:ss'), submitter: '李四（代开通）', auditAt: now.format('YYYY-MM-DD HH:mm:ss'), auditor: '李四（代开通）', opinion: '管理员代开通，即时生效' },
      ],
      workbenchMode: m.workbenchMode,
      overrideUrl: m.overrideUrl.trim() || undefined,
      grants: [
        { id: `g-${baseTs}-${idx}-1`, level: 'org', target: m.orgName, grantedAt: now.format('YYYY-MM-DD HH:mm:ss') },
      ],
    };
    services.unshift(newRecord);
  });
  message.success(`已为 ${models.length} 个服务开通，记录已加入台账`);
  provisionModal.value.visible = false;
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
