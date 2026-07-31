<template>
  <div class="p-[20px]">
    <PageHeader title="模型资源" description="将各类模型、智能体纳入统一目录体系，按能力分类与风险等级差异化纳管" badge="能力分类">
      <template #actions>
        <a-button v-if="isAdmin" type="primary" @click="onCreate">
          <template #icon><PlusOutlined /></template>
          新增编目
        </a-button>
      </template>
    </PageHeader>

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

    <!-- 筛选条件 -->
    <FilterDimensions
      :filters="filterDims"
      :selected="selectedFilters"
      class="mb-[14px]"
      @select="(label, value) => (selectedFilters[label] = value)"
    />

    <!-- 模型编目表格 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <div class="px-[16px] py-[16px]">
        <a-table :columns="columns" :data-source="filteredModels" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 项` }" size="middle" :row-key="(r: any) => r.id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'title'">
              <div class="flex items-center gap-[8px]">
                <div class="w-[28px] h-[28px] rounded-[6px] bg-primary-50 grid place-items-center">
                  <RobotOutlined class="text-[14px] text-primary" />
                </div>
                <span class="font-medium text-text-primary">{{ record.title }}</span>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'code'">
              <span class="font-num text-[12px] text-text-secondary">{{ record.code || record.id?.toUpperCase() }}</span>
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
                <a-popconfirm v-if="record.status !== '停止使用'" :title="`确认${record.status === '已上线使用' ? '下架' : '上架'}该模型？`" @confirm="onToggleStatus(record)">
                  <a-button type="link" size="small" class="!p-0" :class="record.status === '已上线使用' ? '!text-danger' : ''">{{ record.status === '已上线使用' ? '下架' : '上架' }}</a-button>
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
    <a-drawer v-model:open="viewDrawer.visible" title="模型编目详情" :width="720" placement="right">
      <template v-if="viewDrawer.record">
        <div class="rounded-[8px] bg-bg-soft border border-border-soft p-[14px] mb-[16px]">
          <div class="flex items-center justify-between gap-[8px] flex-wrap mb-[4px]">
            <div class="text-[16px] font-semibold text-text-primary">{{ viewDrawer.record.title }}</div>
            <a-badge :status="statusBadge(viewDrawer.record.status)" :text="viewDrawer.record.status" />
          </div>
          <div class="text-[11px] text-text-tertiary">模型代码：{{ viewDrawer.record.code || viewDrawer.record.id?.toUpperCase() }}</div>
        </div>
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

        <a-divider />

        <!-- 关联资产视图 -->
        <div class="flex items-center gap-[8px] mb-[10px]">
          <div class="w-[3px] h-[14px] bg-primary rounded-full" />
          <span class="text-[13px] font-semibold text-text-primary">关联资产视图</span>
        </div>
        <div class="text-[11px] text-text-tertiary mb-[10px]">该模型依赖的数据、知识、工具资源</div>
        <div class="grid grid-cols-1 gap-[8px] mb-[14px]">
          <div v-for="dep in modelDependencies" :key="dep.type" class="rounded-[6px] border border-border-soft p-[10px]">
            <div class="flex items-center gap-[6px] mb-[6px]">
              <a-tag :color="dep.color" class="!m-0 !text-[10px]">{{ dep.type }}</a-tag>
              <span class="text-[11px] text-text-tertiary">共 {{ dep.items.length }} 项</span>
            </div>
            <div class="flex flex-wrap gap-[4px]">
              <a-tag v-for="item in dep.items" :key="item" class="!m-0 !text-[11px]">{{ item }}</a-tag>
            </div>
          </div>
        </div>

        <!-- 被服务引用 -->
        <div class="text-[13px] font-semibold text-text-primary mb-[10px]">被服务引用</div>
        <div class="text-[11px] text-text-tertiary mb-[10px]">该模型被以下智能体 / 服务调用</div>
        <div class="rounded-[6px] border border-border-soft p-[10px]">
          <div class="flex flex-wrap gap-[4px]">
            <a-tag v-for="svc in modelReferencedBy" :key="svc" color="blue" class="!m-0 !text-[11px]">{{ svc }}</a-tag>
            <span v-if="modelReferencedBy.length === 0" class="text-[11px] text-text-tertiary">暂无被服务引用记录</span>
          </div>
        </div>
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
import { capabilityGroups, filters, recommendationRanks } from '../data';
import type { CapabilityCardData, RiskLevel } from '../types';
import type { FilterOption } from '../types';
import PageHeader from '../components/common/PageHeader.vue';
import StatCard from '../components/common/StatCard.vue';
import FilterDimensions from '../components/common/FilterDimensions.vue';
import ResourceRanking from '../components/common/ResourceRanking.vue';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();
const isAdmin = computed(() => auth.role === 'admin');

const filterDims: FilterOption[] = [
  ...filters.map((f) => ({ label: f.label, options: f.options, defaultValue: f.defaultValue })),
  { label: '计费方式', defaultValue: '全部', options: ['全部', '按Token', '按检查例次', '按调用次数'] },
  { label: '接入状态', defaultValue: '全部', options: ['全部', '已上线使用', '对接上线中', '对接测试中', '停止使用'] },
];

const selectedFilters = ref<Record<string, string>>(
  Object.fromEntries(filterDims.map((f) => [f.label, '全部'])),
);

const hotRanks = recommendationRanks.hot.map((i) => ({ id: i.id || '', name: i.name, value: i.heat }));
const latestRanks = recommendationRanks.latest.map((i) => ({ id: i.id || '', name: i.name, value: i.date || '' }));

const allModels = ref<CapabilityCardData[]>(capabilityGroups.flatMap((g) => g.columns.flatMap((c) => c.items)));

const tagBasedKeys = ['产品品类', '应用场景', '资源类别'];

const filteredModels = computed(() => {
  return allModels.value.filter((m) => {
    for (const [label, value] of Object.entries(selectedFilters.value)) {
      if (!value || value === '全部') continue;
      if (label === '能力分类') {
        if (m.category !== value) return false;
      } else if (label === '风险等级') {
        if (m.riskLevel !== value) return false;
      } else if (label === '计费方式') {
        if (m.billingMethod !== value) return false;
      } else if (label === '接入状态') {
        if (m.status !== value) return false;
      } else if (tagBasedKeys.includes(label)) {
        if (!(m.tags ?? []).includes(value) && !m.title.includes(value)) return false;
      }
    }
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
    { label: '已下架', value: 0, unit: '项', tone: 'default' as const },
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
  if (status === '停止使用') return 'error';
  return 'default';
}

// 查看抽屉
const viewDrawer = ref<{ visible: boolean; record: CapabilityCardData | null }>({ visible: false, record: null });

// 模型依赖资产映射（按模型 ID 查询依赖的数据/知识/工具）
const modelDependencyMap: Record<string, Array<{ type: string; color: string; items: string[] }>> = {
  'lungnodule-ct': [
    { type: '数据资源', color: 'cyan', items: ['原发性肺癌主题数据资源', '肺癌早筛参保人群数据集'] },
    { type: '知识体系', color: 'purple', items: ['临床诊疗规范合集', '医保版术语编码标准库'] },
    { type: '平台工具', color: 'orange', items: ['医学影像脱敏工具', '模型效果评估工具', '模型一键部署工具'] },
  ],
  'deepseek-v4': [
    { type: '数据资源', color: 'cyan', items: ['医保基金监管案例数据集', '医保智能审核规则数据集'] },
    { type: '知识体系', color: 'purple', items: ['医保支付政策细则库', '医保经办规程手册'] },
    { type: '平台工具', color: 'orange', items: ['大模型轻量化微调框架', '医疗合规检测工具'] },
  ],
  'emr-assist-agent': [
    { type: '数据资源', color: 'cyan', items: ['门诊慢特病管理数据集'] },
    { type: '知识体系', color: 'purple', items: ['临床诊疗规范合集', '医疗服务价格规范库'] },
    { type: '平台工具', color: 'orange', items: ['病历文本清洗工具', '可视化工作流编排器', 'MCP协议连接器'] },
  ],
};

// 模型被服务引用映射
const modelReferencedByMap: Record<string, string[]> = {
  'deepseek-v4': ['医保政策问答机器人', 'AI健康助手', '智能导诊助手'],
  'lungnodule-ct': ['肺结节CT辅助检测服务', '影像报告辅助生成'],
  'emr-assist-agent': ['电子病历辅助生成服务', '病历文书稽核智能体'],
};

const modelDependencies = computed(() => {
  if (!viewDrawer.value.record) return [];
  return modelDependencyMap[viewDrawer.value.record.id] ?? [];
});

const modelReferencedBy = computed(() => {
  if (!viewDrawer.value.record) return [];
  return modelReferencedByMap[viewDrawer.value.record.id] ?? [];
});

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
    record.status = '停止使用';
    message.success(`${record.title} 已停止使用`);
  } else {
    record.status = '已上线使用';
    message.success(`${record.title} 已上架`);
  }
}
</script>
