<template>
  <div class="p-[20px]">
    <PageHeader title="服务整改" description="查看平台下发的测试任务、上传测试报告、查看平台反馈意见与整改建议" />

    <!-- KPI -->
    <section class="grid grid-cols-4 gap-[14px] mb-[14px]">
      <StatCard
        v-for="kpi in kpis"
        :key="kpi.label"
        :label="kpi.label"
        :value="kpi.value"
        :delta="kpi.delta"
        :tone="kpi.tone"
      />
    </section>

    <!-- 列表 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <template #actions>
          <a-button @click="onExport">
            <template #icon><DownloadOutlined /></template>
            导出测试记录
          </a-button>
        </template>
        <a-input v-model:value="filter.service" style="width: 240px" placeholder="服务名称" allow-clear />
        <a-select v-model:value="filter.testType" style="width: 160px" placeholder="测试类型" allow-clear>
          <a-select-option value="功能测试">功能测试</a-select-option>
          <a-select-option value="性能测试">性能测试</a-select-option>
          <a-select-option value="安全测试">安全测试</a-select-option>
          <a-select-option value="临床验收">临床验收</a-select-option>
        </a-select>
        <a-select v-model:value="filter.stage" style="width: 160px" placeholder="当前阶段" allow-clear>
          <a-select-option value="待测试">待测试</a-select-option>
          <a-select-option value="功能测试中">功能测试中</a-select-option>
          <a-select-option value="性能测试中">性能测试中</a-select-option>
          <a-select-option value="安全测试中">安全测试中</a-select-option>
          <a-select-option value="临床验收中">临床验收中</a-select-option>
          <a-select-option value="已通过">已通过</a-select-option>
          <a-select-option value="已驳回">已驳回</a-select-option>
        </a-select>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>
      <div class="px-[16px] py-[16px]">
        <a-table :columns="columns" :data-source="filteredData" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'service'">
              <div class="font-semibold text-text-primary">{{ record.service }}</div>
              <div class="text-[11px] text-text-tertiary mt-[2px]">{{ record.version }}</div>
            </template>
            <template v-else-if="column.dataIndex === 'testType'">
              <a-tag :color="testTypeColor(record.testType)" class="!m-0">{{ record.testType }}</a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'stage'">
              <a-badge :status="stageBadge(record.stage)" :text="record.stage" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button type="link" size="small" class="!p-0" @click="onDetail(record)">详情</a-button>
                <template v-if="record.stage === '已驳回'">
                  <a-divider type="vertical" class="!mx-[2px]" />
                  <a-button type="link" size="small" class="!p-0" @click="onResubmit(record)">重新提交</a-button>
                </template>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 详情抽屉 -->
    <a-drawer v-model:open="detailDrawer.visible" title="测试任务详情" :width="640" placement="right">
      <template v-if="detailDrawer.record">
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="任务编号">{{ detailDrawer.record.id }}</a-descriptions-item>
          <a-descriptions-item label="服务">{{ detailDrawer.record.service }}</a-descriptions-item>
          <a-descriptions-item label="版本">{{ detailDrawer.record.version }}</a-descriptions-item>
          <a-descriptions-item label="测试类型">{{ detailDrawer.record.testType }}</a-descriptions-item>
          <a-descriptions-item label="当前阶段">
            <a-badge :status="stageBadge(detailDrawer.record.stage)" :text="detailDrawer.record.stage" />
          </a-descriptions-item>
          <a-descriptions-item label="负责方">{{ detailDrawer.record.assignee ?? '待分配' }}</a-descriptions-item>
          <a-descriptions-item label="提交时间">{{ detailDrawer.record.submittedAt }}</a-descriptions-item>
          <a-descriptions-item v-if="detailDrawer.record.note" label="提交备注">{{ detailDrawer.record.note }}</a-descriptions-item>
        </a-descriptions>

        <a-divider />

        <div class="text-[13px] font-semibold text-text-primary mb-[10px]">测试流程</div>
        <a-steps :current="stageIndex(detailDrawer.record.stage)" direction="vertical" size="small">
          <a-step title="提交测试" :description="detailDrawer.record.submittedAt" />
          <a-step title="功能测试" description="验证核心能力与接口规范" />
          <a-step title="性能测试" description="压测并发、时延、稳定性" />
          <a-step title="安全测试" description="数据安全、隐私保护、鉴权审计" />
          <a-step v-if="detailDrawer.record.testType === '临床验收'" title="临床验收" description="多中心样本验证临床效果" />
          <a-step title="测试完成" :description="finalStageDesc(detailDrawer.record.stage)" />
        </a-steps>

        <!-- 平台反馈意见 -->
        <div class="mt-[20px] text-[13px] font-semibold text-text-primary mb-[10px]">平台反馈意见</div>
        <div v-if="feedbackForRecord.length > 0" class="space-y-[8px]">
          <div v-for="fb in feedbackForRecord" :key="fb.id" class="rounded-[6px] border border-border-soft p-[10px]">
            <div class="flex items-center justify-between mb-[4px]">
              <a-tag :color="fb.level === '不通过' ? 'error' : fb.level === '建议' ? 'warning' : 'success'" class="!m-0 !text-[10px]">{{ fb.level }}</a-tag>
              <span class="text-[11px] text-text-tertiary">{{ fb.time }}</span>
            </div>
            <p class="text-[12px] text-text-primary leading-[18px]">{{ fb.content }}</p>
          </div>
        </div>
        <a-empty v-else description="暂无反馈意见，平台测试中" :image="emptyImg" class="py-[20px]" />

        <!-- 测试报告 -->
        <div class="mt-[20px] flex items-center justify-between mb-[10px]">
          <div class="text-[13px] font-semibold text-text-primary">测试报告</div>
          <a-button size="small" type="primary" @click="onUploadReport(detailDrawer.record)">
            <template #icon><UploadOutlined /></template>
            {{ detailDrawer.record.reportUrl ? '更新报告' : '上传报告' }}
          </a-button>
        </div>
        <div v-if="detailDrawer.record.reportUrl" class="rounded-[6px] border border-border-soft p-[10px] mb-[10px]">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-[6px] text-[12px] text-text-primary">
              <FilePdfOutlined class="text-error" />
              <span>{{ detailDrawer.record.reportUrl }}</span>
            </div>
            <a class="text-primary text-[11px]" @click="onDownloadReport(detailDrawer.record)">下载</a>
          </div>
        </div>
        <a-alert v-else type="info" show-icon message="暂未上传测试报告，请在测试完成后上传" />

        <!-- 操作区 -->
        <div class="mt-[16px] rounded-[6px] bg-bg p-[10px]">
          <div class="text-[12px] font-semibold text-text-primary mb-[6px]">可用操作</div>
          <a-space wrap>
            <a-button v-if="detailDrawer.record.stage === '已驳回'" size="small" type="primary" @click="onResubmit(detailDrawer.record)">补充材料并重新提交</a-button>
            <a-button v-if="detailDrawer.record.stage === '已通过'" size="small" @click="onGoListing">前往上架申请</a-button>
          </a-space>
        </div>
      </template>
    </a-drawer>

    <!-- 上传测试报告弹窗 -->
    <a-modal v-model:open="uploadModal.visible" title="上传测试报告" @ok="confirmUpload" ok-text="确认上传" cancel-text="取消">
      <a-form layout="vertical">
        <a-form-item label="报告文件" required>
          <a-upload :before-upload="() => false" :max-count="1">
            <a-button>
              <template #icon><UploadOutlined /></template>
              选择 PDF/ZIP 文件
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="报告说明">
          <a-textarea v-model:value="uploadModal.note" :rows="3" placeholder="请描述测试覆盖范围、关键结论与遗留问题" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message, Empty } from 'ant-design-vue';
import { UploadOutlined, FilePdfOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { testingTasks } from '../../data/developerCenter';
import type { TestingTask } from '../../data/developerCenter';
import PageHeader from '../../components/common/PageHeader.vue';
import StatCard from '../../components/common/StatCard.vue';
import FilterBar from '../../components/common/FilterBar.vue';

const router = useRouter();
const emptyImg = Empty.PRESENTED_IMAGE_SIMPLE;

const kpis = computed(() => {
  const pending = testingTasks.filter((t) => t.stage === '待测试').length;
  const testing = testingTasks.filter((t) => t.stage.endsWith('中')).length;
  const passed = testingTasks.filter((t) => t.stage === '已通过').length;
  const rejected = testingTasks.filter((t) => t.stage === '已驳回').length;
  return [
    { label: '待测试', value: pending, delta: '排队中', tone: 'default' as const },
    { label: '测试中', value: testing, delta: '平台执行中', tone: 'primary' as const },
    { label: '已通过', value: passed, delta: '可继续上架流程', tone: 'success' as const },
    { label: '已驳回', value: rejected, delta: '需补充材料', tone: 'danger' as const },
  ];
});

const columns = [
  { title: '任务编号', dataIndex: 'id', key: 'id', width: 180 },
  { title: '服务', dataIndex: 'service', key: 'service' },
  { title: '测试类型', dataIndex: 'testType', key: 'testType', width: 120 },
  { title: '当前阶段', dataIndex: 'stage', key: 'stage', width: 130 },
  { title: '负责方', dataIndex: 'assignee', key: 'assignee', width: 180 },
  { title: '提交时间', dataIndex: 'submittedAt', key: 'submittedAt', width: 160 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 180 },
];

const filter = ref({ service: '', testType: undefined as string | undefined, stage: undefined as string | undefined });
const applied = ref({ service: '', testType: undefined as string | undefined, stage: undefined as string | undefined });

function onSearch() {
  applied.value = { ...filter.value };
}
function onReset() {
  filter.value = { service: '', testType: undefined, stage: undefined };
  applied.value = { service: '', testType: undefined, stage: undefined };
}

const filteredData = computed(() => {
  const f = applied.value;
  return testingTasks
    .filter((t) => {
      if (f.service && !t.service.includes(f.service)) return false;
      if (f.testType && t.testType !== f.testType) return false;
      if (f.stage && t.stage !== f.stage) return false;
      return true;
    })
    .map((t) => ({ key: t.id, ...t }));
});

function onExport() {
  message.success('测试记录导出请求已提交');
}

function testTypeColor(type: string): 'blue' | 'cyan' | 'purple' | 'orange' {
  if (type === '功能测试') return 'blue';
  if (type === '性能测试') return 'cyan';
  if (type === '安全测试') return 'purple';
  return 'orange';
}

function stageBadge(stage: string): 'default' | 'processing' | 'success' | 'error' {
  if (stage === '待测试') return 'default';
  if (stage.endsWith('中')) return 'processing';
  if (stage === '已通过') return 'success';
  return 'error';
}

function stageIndex(stage: string): number {
  if (stage === '待测试') return 0;
  if (stage === '功能测试中') return 1;
  if (stage === '性能测试中') return 2;
  if (stage === '安全测试中') return 3;
  if (stage === '临床验收中') return 4;
  if (stage === '已通过') return 5;
  return 0;
}

function finalStageDesc(stage: string): string {
  if (stage === '已通过') return '测试通过，准予上架';
  if (stage === '已驳回') return '测试未通过，请按报告补充后重新提交';
  return '处理中';
}

// 平台反馈意见（按任务关联）
const allFeedback: Record<string, Array<{ id: string; level: '通过' | '建议' | '不通过'; content: string; time: string }>> = {
  'TT-2024-0708-001': [
    { id: 'fb-1', level: '建议', content: '建议补充 200 例多中心样本数据，重点关注 6mm 以下结节召回率', time: '2024-07-09 10:20' },
  ],
  'TT-2024-0710-002': [
    { id: 'fb-2', level: '建议', content: '糖网识别准确率达标，青光眼敏感度需提升至 88% 以上', time: '2024-07-12 15:30' },
  ],
  'TT-2024-0625-004': [
    { id: 'fb-3', level: '不通过', content: '准确率 78%，未达 85% 阈值，需补充训练数据后重新提交', time: '2024-06-28 11:00' },
  ],
  'TT-2024-0618-005': [
    { id: 'fb-4', level: '通过', content: '通过率 92.4%，准予上架', time: '2024-06-20 16:00' },
  ],
};

const detailDrawer = ref<{ visible: boolean; record: TestingTask | null }>({ visible: false, record: null });

const feedbackForRecord = computed(() => {
  if (!detailDrawer.value.record) return [];
  return allFeedback[detailDrawer.value.record.id] ?? [];
});

function onDetail(record: TestingTask) {
  detailDrawer.value = { visible: true, record };
}

function onDownloadReport(record: TestingTask) {
  message.success(`正在下载 ${record.id} 测试报告`);
}

function onResubmit(record: TestingTask) {
  record.stage = '待测试';
  record.submittedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
  message.success(`${record.id} 已重新提交测试，等待平台分配`);
  detailDrawer.value.visible = false;
}

function onGoListing() {
  router.push('/developer-center/listing');
}

// 上传报告
const uploadModal = ref<{ visible: boolean; record: TestingTask | null; note: string }>({
  visible: false,
  record: null,
  note: '',
});

function onUploadReport(record: TestingTask) {
  uploadModal.value = { visible: true, record, note: '' };
}

function confirmUpload() {
  if (!uploadModal.value.record) return;
  uploadModal.value.record.reportUrl = `/reports/${uploadModal.value.record.id}.pdf`;
  message.success('测试报告已上传');
  uploadModal.value.visible = false;
}
</script>
