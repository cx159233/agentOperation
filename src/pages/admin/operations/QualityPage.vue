<template>
  <div class="p-[20px]">
    <PageHeader title="质量评价管理" description="基于准确性、稳定性、响应时效、用户反馈和合规记录综合评价服务质量" />

    <!-- KPI -->
    <section class="grid grid-cols-4 gap-[14px] mb-[14px]">
      <StatCard label="平均准确率" value="96.8%" tone="success" delta="较上月 +0.4%" />
      <StatCard label="平均时延" value="280ms" tone="primary" delta="P99 < 1.5s" />
      <StatCard label="业务适配性" value="4.4" tone="primary" delta="较上月 +0.1" />
      <StatCard label="问题服务数" :value="2" tone="danger" delta="综合评分 < 3.5" />
    </section>

    <!-- 服务质量评分表 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <template #actions>
          <a-button @click="onExport">
            <template #icon><DownloadOutlined /></template>
            导出评分报告
          </a-button>
        </template>
        <a-input v-model:value="filter.name" style="width: 240px" placeholder="服务名称" allow-clear />
        <a-select v-model:value="filter.scoreRange" style="width: 200px" placeholder="综合评分" allow-clear>
          <a-select-option value="excellent">优秀 (≥4.5)</a-select-option>
          <a-select-option value="good">良好 (4.0-4.5)</a-select-option>
          <a-select-option value="fair">一般 (3.5-4.0)</a-select-option>
          <a-select-option value="poor">较差 (&lt;3.5)</a-select-option>
        </a-select>
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>

      <!-- 表格 -->
      <div class="px-[16px] py-[16px]">
        <a-table :columns="visibleColumns" :data-source="filteredData" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'accuracy'">
              <span :class="metricClass(record.accuracy, 95)">{{ record.accuracy }}%</span>
            </template>
            <template v-else-if="column.dataIndex === 'latency'">
              <span :class="latencyClass(record.latency)">{{ record.latency }}ms</span>
            </template>
            <template v-else-if="column.dataIndex === 'successRate'">
              <span :class="metricClass(record.successRate, 99)">{{ record.successRate }}%</span>
            </template>
            <template v-else-if="column.dataIndex === 'businessFit'">
              <span :class="scoreClass(record.businessFit)">{{ record.businessFit.toFixed(1) }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'score'">
              <div class="flex items-center gap-[6px]">
                <a-progress type="circle" :percent="record.score * 20" :size="36" :stroke-color="scoreColor(record.score)" :format="() => record.score.toString()" />
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button type="link" size="small" class="!p-0" @click="onViewEvaluations(record)">查看评价明细</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0" @click="onRectify(record)">下发整改</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 整改通知弹窗 -->
    <a-modal v-model:open="rectifyModal.visible" title="下发整改通知" @ok="confirmRectify" ok-text="发送通知" cancel-text="取消">
      <a-form layout="vertical">
        <a-form-item label="服务名称">
          <a-input :value="rectifyModal.record?.name" disabled />
        </a-form-item>
        <a-form-item label="整改事项" required>
          <a-checkbox-group v-model:value="rectifyModal.items" :options="rectifyOptions" />
        </a-form-item>
        <a-form-item label="整改期限" required>
          <a-date-picker v-model:value="rectifyModal.deadline" style="width: 100%" />
        </a-form-item>
        <a-form-item label="整改要求说明">
          <a-textarea v-model:value="rectifyModal.note" :rows="3" placeholder="请描述具体整改要求" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 查看评价明细抽屉 -->
    <a-drawer v-model:open="evalDrawer.visible" :title="`服务评价明细 - ${evalDrawer.serviceName ?? ''}`" :width="860" placement="right">
      <template v-if="evalDrawer.record">
        <div class="drawer-header-row">
          <div class="drawer-header-icon">
            <img v-if="evalDrawer.record.logo" :src="evalDrawer.record.logo" class="w-full h-full object-cover rounded-[10px]" alt="" />
            <RobotOutlined v-else class="text-[28px] text-white" />
          </div>
          <div class="drawer-header-info">
            <div class="drawer-header-title-row">
              <span class="drawer-header-title">{{ evalDrawer.serviceName || evalDrawer.record.name }}</span>
              <span class="font-num text-[16px] font-semibold" :class="scoreClass(evalDrawer.record.score)">{{ evalDrawer.record.score }} 分</span>
            </div>
            <div class="drawer-header-sub">
              累计评价 {{ evalEvaluations.length }} 条 · 已回复 {{ evalEvaluations.filter((e: any) => e.status === '已回复').length }} 条 · 待处理 {{ evalEvaluations.filter((e: any) => e.status === '待处理').length }} 条
            </div>
          </div>
        </div>
        <div class="border-b border-[#f0f0f0] mb-[16px]"></div>

        <a-empty v-if="evalEvaluations.length === 0" description="该服务暂无评价" class="py-[40px]" />
        <div v-else class="space-y-[10px]">
          <div v-for="ev in evalEvaluations" :key="ev.id" class="rounded-[8px] border border-border-soft p-[12px]">
            <div class="flex items-center justify-between mb-[6px]">
              <div class="flex items-center gap-[6px]">
                <span class="text-[12px] font-semibold text-text-primary">{{ ev.org }} · {{ ev.department }}</span>
                <a-badge :status="evalStatusBadge(ev.status)" :text="ev.status" />
              </div>
              <span class="text-[11px] text-text-tertiary">{{ ev.createdAt }}</span>
            </div>
            <div class="grid grid-cols-4 gap-[6px] mb-[8px]">
              <div v-for="key in ratingKeys" :key="key" class="text-center rounded-[4px] bg-bg px-[4px] py-[4px]">
                <div class="text-[10px] text-text-tertiary">{{ key }}</div>
                <div class="font-num text-[12px] font-semibold text-primary">{{ ev.ratings[key] }}</div>
              </div>
            </div>
            <p class="text-[12px] text-text-secondary leading-[18px] mb-[6px]">{{ ev.content }}</p>
            <div v-if="ev.tags?.length" class="flex items-center gap-[4px] mb-[6px]">
              <a-tag v-for="t in ev.tags" :key="t" class="!m-0 !text-[10px]">{{ t }}</a-tag>
            </div>
            <div v-if="ev.reply" class="rounded-[4px] border-l-2 border-primary/40 pl-[8px] text-[11px] text-text-tertiary">
              <strong class="text-primary">开发者回复：</strong>{{ ev.reply }}
            </div>
          </div>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { DownloadOutlined, RobotOutlined } from '@ant-design/icons-vue';
import { qualityServices, qualityEvaluations } from '../../../data/operations';
import type { QualityService, QualityEvaluation } from '../../../data/operations';
import PageHeader from '../../../components/common/PageHeader.vue';
import StatCard from '../../../components/common/StatCard.vue';
import FilterBar from '../../../components/common/FilterBar.vue';
import ColumnSettings from '../../../components/common/ColumnSettings.vue';

const ratingKeys = ['准确性', '稳定性', '响应时效', '业务适配性'] as const;

const columns = [
  { title: '服务名称', dataIndex: 'name', key: 'name' },
  { title: '准确率', dataIndex: 'accuracy', key: 'accuracy', width: 100 },
  { title: '平均时延', dataIndex: 'latency', key: 'latency', width: 110 },
  { title: '成功率', dataIndex: 'successRate', key: 'successRate', width: 100 },
  { title: '业务适配性', dataIndex: 'businessFit', key: 'businessFit', width: 110 },
  { title: '综合评分', dataIndex: 'score', key: 'score', width: 120 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 200 },
];

const filter = ref({ name: '', scoreRange: undefined as string | undefined });
const applied = ref({ name: '', scoreRange: undefined as string | undefined });
const hiddenKeys = ref<string[]>([]);
const visibleColumns = computed(() => columns.filter((c) => !hiddenKeys.value.includes(c.key)));

function onSearch() {
  applied.value = { ...filter.value };
}
function onReset() {
  filter.value = { name: '', scoreRange: undefined };
  applied.value = { name: '', scoreRange: undefined };
}

function matchScoreRange(score: number, range: string): boolean {
  if (range === 'excellent') return score >= 4.5;
  if (range === 'good') return score >= 4.0 && score < 4.5;
  if (range === 'fair') return score >= 3.5 && score < 4.0;
  if (range === 'poor') return score < 3.5;
  return true;
}

const filteredData = computed(() => {
  const f = applied.value;
  return qualityServices
    .filter((r) => {
      if (f.name && !r.name.includes(f.name)) return false;
      if (f.scoreRange && !matchScoreRange(r.score, f.scoreRange)) return false;
      return true;
    })
    .map((r) => ({ key: r.id, ...r }));
});

function metricClass(value: number, threshold: number) {
  return value >= threshold ? 'text-success font-bold' : value >= threshold - 5 ? 'text-warning font-bold' : 'text-error font-bold';
}

function latencyClass(latency: number) {
  if (latency <= 500) return 'text-success font-bold';
  if (latency <= 1500) return 'text-warning font-bold';
  return 'text-error font-bold';
}

function scoreClass(score: number) {
  if (score >= 4.5) return 'text-success font-bold';
  if (score >= 4.0) return 'text-primary font-bold';
  if (score >= 3.5) return 'text-warning font-bold';
  return 'text-error font-bold';
}

function scoreColor(score: number) {
  if (score >= 4.5) return '#10B981';
  if (score >= 4.0) return '#165DFF';
  if (score >= 3.5) return '#F59E0B';
  return '#EF4444';
}

const rectifyOptions = [
  { label: '准确率提升', value: '准确率提升' },
  { label: '响应时延优化', value: '响应时延优化' },
  { label: '稳定性增强', value: '稳定性增强' },
  { label: '合规问题整改', value: '合规问题整改' },
];

const rectifyModal = ref<{ visible: boolean; record: QualityService | null; items: string[]; deadline: any; note: string }>({
  visible: false,
  record: null,
  items: [],
  deadline: null,
  note: '',
});

function onRectify(record: QualityService) {
  rectifyModal.value = { visible: true, record, items: [], deadline: null, note: '' };
}

function confirmRectify() {
  if (rectifyModal.value.items.length === 0 || !rectifyModal.value.deadline) {
    message.warning('请选择整改事项并设置期限');
    return;
  }
  message.success(`整改通知已发送至 ${rectifyModal.value.record?.name} 开发者`);
  rectifyModal.value.visible = false;
}

// 查看评价明细
const evalDrawer = ref<{ visible: boolean; record: QualityService | null; serviceName: string }>({
  visible: false,
  record: null,
  serviceName: '',
});

const evalEvaluations = computed<QualityEvaluation[]>(() => {
  if (!evalDrawer.value.record) return [];
  return qualityEvaluations.filter((e) => e.serviceName === evalDrawer.value.record!.name);
});

function evalStatusBadge(status: string): 'success' | 'processing' | 'warning' {
  if (status === '已回复') return 'success';
  if (status === '处理中') return 'processing';
  return 'warning';
}

function onViewEvaluations(record: QualityService) {
  evalDrawer.value = { visible: true, record, serviceName: record.name };
}

function onExport() {
  message.success('服务质量评分报告导出请求已提交');
}
</script>

<style scoped>
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
