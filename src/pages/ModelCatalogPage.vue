<template>
  <div class="p-[20px]">
    <PageHeader title="模型/智能体" description="将各类模型、智能体纳入统一目录体系，按能力分类与风险等级差异化纳管" badge="能力分类" />

    <!-- 顶部统计 -->
    <section class="grid grid-cols-4 gap-[14px] mb-[14px]">
      <StatCard
        v-for="stat in catalogStats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :unit="stat.unit"
        :tone="stat.tone"
      />
    </section>

    <!-- 模型资源榜 -->
    <ResourceRanking
      title="模型资源榜"
      :hot-items="hotRanks"
      :latest-items="latestRanks"
      class="mb-[14px]"
    />

    <!-- 模型编目表格 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <template #actions>
          <a-button v-if="isAdmin" type="primary" @click="onCreate">
            <template #icon><PlusOutlined /></template>
            新增编目
          </a-button>
        </template>
        <a-input v-model:value="filter.name" style="width: 200px" placeholder="模型名称" allow-clear />
        <a-select v-model:value="filter.category" style="width: 200px" placeholder="能力分类" allow-clear>
          <a-select-option v-for="c in categoryOptions" :key="c" :value="c">{{ c }}</a-select-option>
        </a-select>
        <a-select v-model:value="filter.riskLevel" style="width: 140px" placeholder="风险等级" allow-clear>
          <a-select-option value="高风险">高风险</a-select-option>
          <a-select-option value="中风险">中风险</a-select-option>
          <a-select-option value="低风险">低风险</a-select-option>
        </a-select>
        <a-select v-model:value="filter.billingMethod" style="width: 140px" placeholder="计费方式" allow-clear>
          <a-select-option value="按Token">按 Token</a-select-option>
          <a-select-option value="按检查例次">按检查例次</a-select-option>
          <a-select-option value="按调用次数">按调用次数</a-select-option>
        </a-select>
        <a-select v-model:value="filter.status" style="width: 140px" placeholder="接入状态" allow-clear>
          <a-select-option value="已上线使用">已上线使用</a-select-option>
          <a-select-option value="对接上线中">对接上线中</a-select-option>
          <a-select-option value="对接测试中">对接测试中</a-select-option>
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
            <template v-else-if="column.dataIndex === 'modalities'">
              <div v-if="(record.modalities ?? []).length" class="flex flex-wrap gap-[4px]">
                <a-tag v-for="m in record.modalities" :key="m" class="!m-0 !text-[11px]">{{ m }}</a-tag>
              </div>
              <span v-else class="text-[11px] text-text-tertiary">—</span>
            </template>
            <template v-else-if="column.dataIndex === 'category'">
              <a-tag :color="categoryColorMap[record.category]" class="!m-0 !text-[11px]">{{ record.category }}</a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'riskLevel'">
              <a-tag :color="riskColor(record.riskLevel)" class="!m-0 !text-[11px]">{{ record.riskLevel }}</a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-badge :status="statusBadge(record.status)" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space v-if="isAdmin" size="small">
                <a-button type="link" size="small" class="!p-0" @click="onView(record)">查看</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0" @click="onEdit(record)">编辑</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-popconfirm v-if="record.status !== '已下架'" :title="`确认${record.status === '已上线使用' ? '已下架' : '上架'}该模型？`" @confirm="onToggleStatus(record)">
                  <a-button type="link" size="small" class="!p-0" :class="record.status === '已上线使用' ? '!text-danger' : ''">{{ record.status === '已上线使用' ? '已下架' : '上架' }}</a-button>
                </a-popconfirm>
                <a-popconfirm v-else title="确认重新上架该模型？" @confirm="onToggleStatus(record)">
                  <a-button type="link" size="small" class="!p-0">启用</a-button>
                </a-popconfirm>
              </a-space>
              <a-space v-else size="small">
                <a-button type="link" size="small" class="!p-0" @click="onView(record)">查看详情</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0" @click="onApplyAccess(record)">申请使用</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 查看抽屉 -->
    <a-drawer v-model:open="viewDrawer.visible" title="模型编目详情" :width="860" placement="right">
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
        <div class="border-b border-[#f0f0f0] mb-[16px]"></div>

        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item label="研发单位">{{ viewDrawer.record.unit }}</a-descriptions-item>
          <a-descriptions-item label="能力分类">{{ viewDrawer.record.category || '-' }}</a-descriptions-item>
          <a-descriptions-item label="风险等级">{{ viewDrawer.record.riskLevel || '-' }}</a-descriptions-item>
          <a-descriptions-item label="计费方式">{{ viewDrawer.record.billingMethod || '-' }}</a-descriptions-item>
          <a-descriptions-item label="接入状态">{{ viewDrawer.record.status }}</a-descriptions-item>
          <a-descriptions-item label="支持的检查模态" :span="2">
            <template v-if="(viewDrawer.record.modalities ?? []).length">
              <a-tag v-for="m in viewDrawer.record.modalities" :key="m" class="!m-0 !mr-[4px] !text-[11px]">{{ m }}</a-tag>
            </template>
            <span v-else class="text-[12px] text-text-tertiary">-</span>
          </a-descriptions-item>
          <a-descriptions-item label="接入端点" :span="2">https://api.jsyb-ai.cn/v1/llm/{{ viewDrawer.record.id }}/invoke</a-descriptions-item>
          <a-descriptions-item label="创建时间">2024-03-15 10:00</a-descriptions-item>
          <a-descriptions-item label="最近更新">2024-07-12 14:30</a-descriptions-item>
        </a-descriptions>

      </template>
    </a-drawer>

    <!-- 新增/编辑跳转至独立页面 -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { PlusOutlined, RobotOutlined } from '@ant-design/icons-vue';
import { capabilityGroups, recommendationRanks } from '../data';
import type { CapabilityCardData, RiskLevel } from '../types';
import PageHeader from '../components/common/PageHeader.vue';
import StatCard from '../components/common/StatCard.vue';
import FilterBar from '../components/common/FilterBar.vue';
import ColumnSettings from '../components/common/ColumnSettings.vue';
import ResourceRanking from '../components/common/ResourceRanking.vue';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();
const isAdmin = computed(() => auth.role === 'admin');

const filter = ref({ name: '', category: undefined as string | undefined, riskLevel: undefined as string | undefined, billingMethod: undefined as string | undefined, status: undefined as string | undefined });
const applied = ref({ name: '', category: undefined as string | undefined, riskLevel: undefined as string | undefined, billingMethod: undefined as string | undefined, status: undefined as string | undefined });

function onSearch() {
  applied.value = { ...filter.value };
}
function onReset() {
  filter.value = { name: '', category: undefined, riskLevel: undefined, billingMethod: undefined, status: undefined };
  applied.value = { name: '', category: undefined, riskLevel: undefined, billingMethod: undefined, status: undefined };
}

const hotRanks = recommendationRanks.hot.map((i) => ({ id: i.id || '', name: i.name, value: i.heat }));
const latestRanks = recommendationRanks.latest.map((i) => ({ id: i.id || '', name: i.name, value: i.date || '' }));

const allModels = ref<CapabilityCardData[]>(capabilityGroups.flatMap((g) => g.columns.flatMap((c) => c.items)));

const filteredModels = computed(() => {
  const f = applied.value;
  return allModels.value.filter((m) => {
    if (f.name && !m.title.includes(f.name)) return false;
    if (f.category && m.category !== f.category) return false;
    if (f.riskLevel && m.riskLevel !== f.riskLevel) return false;
    if (f.billingMethod && m.billingMethod !== f.billingMethod) return false;
    if (f.status && m.status !== f.status) return false;
    return true;
  });
});

const catalogStats = computed(() => {
  const total = allModels.value.length;
  const listed = allModels.value.filter((m) => m.status === '已上线使用').length;
  const testing = allModels.value.filter((m) => m.status === '对接测试中' || m.status === '对接上线中').length;
  return [
    { label: '编目总数', value: total, unit: '项', tone: 'primary' as const },
    { label: '已上线', value: listed, unit: '项', tone: 'success' as const },
    { label: '对接中', value: testing, unit: '项', tone: 'warning' as const },
    { label: '已已下架', value: 0, unit: '项', tone: 'default' as const },
  ];
});

const columns = [
  { title: '模型名称', dataIndex: 'title', key: 'title' },
  { title: '模型代码', dataIndex: 'code', key: 'code', width: 160 },
  { title: '研发单位', dataIndex: 'unit', key: 'unit', width: 220 },
  { title: '能力分类', dataIndex: 'category', key: 'category', width: 180 },
  { title: '风险等级', dataIndex: 'riskLevel', key: 'riskLevel', width: 100 },
  { title: '计费方式', dataIndex: 'billingMethod', key: 'billingMethod', width: 120 },
  { title: '支持的检查模态', dataIndex: 'modalities', key: 'modalities', width: 200 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 200 },
];

const hiddenKeys = ref<string[]>([]);
const visibleColumns = computed(() => columns.filter((c) => !hiddenKeys.value.includes(c.key)));

const categoryOptions = ['通用基础大模型', '医保自研专属大模型', '医保基金监管共建模型', '省头部医疗机构共建垂直模型', '市场化合规生态AI产品'];

const categoryColorMap: Record<string, string> = {
  通用基础大模型: 'blue',
  医保自研专属大模型: 'cyan',
  医保基金监管共建模型: 'purple',
  省头部医疗机构共建垂直模型: 'green',
  市场化合规生态AI产品: 'orange',
};

function riskColor(level?: RiskLevel) {
  if (!level) return 'default';
  return level === '高风险' ? 'error' : level === '中风险' ? 'warning' : 'success';
}

function statusBadge(status?: string) {
  if (status === '已上线使用') return 'success';
  if (status === '对接测试中') return 'processing';
  if (status === '对接上线中') return 'warning';
  if (status === '已下架') return 'error';
  return 'default';
}

// 查看抽屉
const viewDrawer = ref<{ visible: boolean; record: CapabilityCardData | null }>({ visible: false, record: null });

function onView(record: CapabilityCardData) {
  viewDrawer.value = { visible: true, record };
}

function onApplyAccess(record: CapabilityCardData) {
  message.success(`已提交「${record.title}」的使用申请，等待平台审批`);
}

function onCreate() {
  router.push('/admin/model-catalog/edit');
}

function onEdit(record: CapabilityCardData) {
  router.push(`/admin/model-catalog/edit?id=${record.id}`);
}

function onToggleStatus(record: CapabilityCardData) {
  if (record.status === '已上线使用') {
    record.status = '已下架';
    message.success(`${record.title} 已已下架`);
  } else {
    record.status = '已上线使用';
    message.success(`${record.title} 已上架`);
  }
}
</script>

<style scoped>
.drawer-header-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0 16px;
  margin-bottom: 16px;
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
