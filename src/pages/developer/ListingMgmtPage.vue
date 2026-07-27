<template>
  <div class="p-[20px]">
    <PageHeader title="服务上架" description="管理本机构提交的 AI 服务上架申请，支持新增、编辑、查看审核进度与版本迭代" />

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
          <a-button type="primary" @click="onCreate">
            <template #icon><PlusOutlined /></template>
            新增上架申请
          </a-button>
          <a-button @click="onExport">
            <template #icon><DownloadOutlined /></template>
            导出申请清单
          </a-button>
        </template>
        <a-input v-model:value="filter.name" style="width: 240px" placeholder="服务名称" allow-clear />
        <a-select v-model:value="filter.riskLevel" style="width: 160px" placeholder="风险等级" allow-clear>
          <a-select-option value="高风险">高风险</a-select-option>
          <a-select-option value="中风险">中风险</a-select-option>
          <a-select-option value="低风险">低风险</a-select-option>
        </a-select>
        <a-select v-model:value="filter.status" style="width: 160px" placeholder="状态" allow-clear>
          <a-select-option value="已上架">已上架</a-select-option>
          <a-select-option value="审核中">审核中</a-select-option>
          <a-select-option value="草稿">草稿</a-select-option>
          <a-select-option value="已驳回">已驳回</a-select-option>
          <a-select-option value="已下架">已下架</a-select-option>
        </a-select>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>
      <div class="px-[16px] py-[16px]">
        <a-table :columns="columns" :data-source="filteredData" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              <div class="font-semibold text-text-primary">{{ record.name }}</div>
              <div class="text-[11px] text-text-tertiary mt-[2px]">{{ record.version }}</div>
            </template>
            <template v-else-if="column.dataIndex === 'riskLevel'">
              <a-tag :color="riskTagColor(record.riskLevel)" class="!m-0">{{ record.riskLevel }}</a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-badge :status="statusBadge(record.status)" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button type="link" size="small" class="!p-0" @click="onDetail(record)">详情</a-button>
                <template v-if="record.status === '草稿' || record.status === '已驳回'">
                  <a-divider type="vertical" class="!mx-[2px]" />
                  <a-button type="link" size="small" class="!p-0" @click="onEdit(record)">编辑</a-button>
                </template>
                <template v-if="record.status === '草稿'">
                  <a-divider type="vertical" class="!mx-[2px]" />
                  <a-button type="link" size="small" class="!p-0" @click="onSubmit(record)">提交审核</a-button>
                </template>
                <a-popconfirm v-if="record.status === '已上架'" title="确认下架该服务？" @confirm="onDelist(record)">
                  <a-button type="link" size="small" class="!p-0 !text-error">下架</a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 详情抽屉 -->
    <a-drawer v-model:open="detailDrawer.visible" title="上架申请详情" :width="640" placement="right">
      <template v-if="detailDrawer.record">
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="服务名称">{{ detailDrawer.record.name }}</a-descriptions-item>
          <a-descriptions-item label="当前版本">{{ detailDrawer.record.version }}</a-descriptions-item>
          <a-descriptions-item label="能力分类">{{ detailDrawer.record.category }}</a-descriptions-item>
          <a-descriptions-item label="风险等级">
            <a-tag :color="riskTagColor(detailDrawer.record.riskLevel)" class="!m-0">{{ detailDrawer.record.riskLevel }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="计费方式">{{ detailDrawer.record.billingMethod }}</a-descriptions-item>
          <a-descriptions-item label="提交时间">{{ detailDrawer.record.submittedAt }}</a-descriptions-item>
          <a-descriptions-item v-if="detailDrawer.record.listedAt" label="上架时间">{{ detailDrawer.record.listedAt }}</a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-badge :status="statusBadge(detailDrawer.record.status)" :text="detailDrawer.record.status" />
          </a-descriptions-item>
        </a-descriptions>

        <a-divider />

        <div class="flex items-center justify-between mb-[10px]">
          <div class="text-[13px] font-semibold text-text-primary">审核流程</div>
        </div>
        <a-steps :current="stepIndex(detailDrawer.record.status)" direction="vertical" size="small">
          <a-step title="提交申请" :description="detailDrawer.record.submittedAt" />
          <a-step title="资质核验" description="平台核验营业执照、医疗器械证、算法备案等材料" />
          <a-step title="技术测评" description="按风险等级执行差异化测试" />
          <a-step title="审核完成" :description="finalStatusDesc(detailDrawer.record.status)" />
        </a-steps>

        <a-divider />

        <!-- 版本迭代 -->
        <div class="flex items-center justify-between mb-[10px]">
          <div class="text-[13px] font-semibold text-text-primary">版本迭代</div>
          <a-button type="primary" @click="onNewVersion(detailDrawer.record)">
            <template #icon><PlusOutlined /></template>
            发布新版本
          </a-button>
        </div>
        <div v-if="serviceVersionsForDetail.length > 0" class="space-y-[8px]">
          <div v-for="v in serviceVersionsForDetail" :key="v.id" class="rounded-[6px] border border-border-soft p-[10px]">
            <div class="flex items-center justify-between mb-[4px]">
              <div class="flex items-center gap-[6px]">
                <a-tag :color="versionTagColor(v.type)" class="!m-0 !text-[10px] !px-[6px] !leading-[16px]">{{ versionTypeLabel(v.type) }}</a-tag>
                <span class="font-num text-[12px] font-semibold text-primary">{{ v.version }}</span>
                <a-badge :status="versionStatusBadge(v.status)" :text="v.status" />
              </div>
              <span class="text-[11px] text-text-tertiary">{{ v.releasedAt }}</span>
            </div>
            <p class="text-[12px] text-text-secondary leading-[18px]">{{ v.releaseNotes }}</p>
            <div class="mt-[6px] flex items-center justify-between">
              <span v-if="v.calls" class="text-[11px] text-text-tertiary">累计调用：{{ v.calls }}</span>
              <a-space v-else />
              <a-space size="small">
                <a v-if="v.status === '灰度中'" class="text-primary text-[11px]" @click="onPromote(v)">全量上线</a>
                <a-popconfirm v-if="v.status === '在线'" title="确认归档该版本？" @confirm="onArchive(v)">
                  <a class="text-text-secondary text-[11px]">归档</a>
                </a-popconfirm>
              </a-space>
            </div>
          </div>
        </div>
        <a-empty v-else description="暂无版本记录" :image="emptyImg" class="py-[20px]" />

        <a-divider />

        <!-- 机构评价 -->
        <div class="flex items-center justify-between mb-[10px]">
          <div class="text-[13px] font-semibold text-text-primary">机构评价</div>
          <span class="text-[11px] text-text-tertiary">共 {{ serviceEvaluationsForDetail.length }} 条 · 待回复 {{ serviceEvaluationsForDetail.filter((e) => e.status !== '已回复').length }} 条</span>
        </div>
        <div v-if="serviceEvaluationsForDetail.length > 0" class="space-y-[10px]">
          <div v-for="ev in serviceEvaluationsForDetail" :key="ev.id" class="rounded-[8px] border border-border-soft p-[10px]">
            <div class="flex items-center justify-between mb-[6px]">
              <div class="flex items-center gap-[6px]">
                <span class="text-[12px] font-semibold text-text-primary">{{ ev.org }} · {{ ev.department }}</span>
                <a-badge :status="evalStatusBadge(ev.status)" :text="ev.status" />
              </div>
              <span class="text-[11px] text-text-tertiary">{{ ev.createdAt }}</span>
            </div>
            <div class="grid grid-cols-4 gap-[6px] mb-[6px]">
              <div v-for="key in ratingKeys" :key="key" class="text-center rounded-[4px] bg-bg px-[4px] py-[4px]">
                <div class="text-[10px] text-text-tertiary">{{ key }}</div>
                <div class="font-num text-[12px] font-semibold text-primary">{{ ev.ratings[key] }}</div>
              </div>
            </div>
            <p class="text-[12px] text-text-secondary leading-[18px] mb-[4px]">{{ ev.content }}</p>
            <div v-if="ev.tags?.length" class="flex items-center gap-[4px] mb-[4px]">
              <a-tag v-for="t in ev.tags" :key="t" class="!m-0 !text-[10px]">{{ t }}</a-tag>
            </div>
            <div v-if="ev.reply" class="rounded-[4px] border-l-2 border-primary/40 pl-[8px] text-[11px] text-text-tertiary mb-[6px]">
              <strong class="text-primary">我的回复：</strong>{{ ev.reply }}
            </div>
            <div class="flex justify-end">
              <a v-if="!ev.reply" class="text-primary text-[11px]" @click="onReplyEvaluation(ev)">回复</a>
              <a v-else class="text-text-secondary text-[11px]" @click="onReplyEvaluation(ev)">修改回复</a>
            </div>
          </div>
        </div>
        <a-empty v-else description="暂无评价" :image="emptyImg" class="py-[20px]" />
      </template>
    </a-drawer>

    <!-- 发布新版本弹窗 -->
    <a-modal v-model:open="versionModal.visible" title="发布新版本" @ok="confirmNewVersion" ok-text="提交" cancel-text="取消" :width="560">
      <a-form layout="vertical">
        <div class="grid grid-cols-2 gap-[12px]">
          <a-form-item label="选择服务">
            <a-input :value="versionModal.service" disabled />
          </a-form-item>
          <a-form-item label="版本号" required>
            <a-input v-model:value="versionModal.version" placeholder="如：v2.4.0" />
          </a-form-item>
        </div>
        <a-form-item label="更新类型" required>
          <a-radio-group v-model:value="versionModal.type">
            <a-radio-button value="major">大版本</a-radio-button>
            <a-radio-button value="minor">功能更新</a-radio-button>
            <a-radio-button value="patch">补丁</a-radio-button>
            <a-radio-button value="hotfix">热修复</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="更新说明" required>
          <a-textarea v-model:value="versionModal.notes" :rows="4" placeholder="请描述本次版本的核心变更、影响范围、兼容性说明" />
        </a-form-item>
        <a-form-item label="发布策略">
          <a-radio-group v-model:value="versionModal.strategy">
            <a-radio value="gray">灰度发布（先开放 10% 流量）</a-radio>
            <a-radio value="full">直接全量上线</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 回复评价弹窗 -->
    <a-modal v-model:open="replyModal.visible" :title="replyModal.record?.reply ? '修改回复' : '回复评价'" @ok="confirmReply" ok-text="提交回复" cancel-text="取消" :width="520">
      <template v-if="replyModal.record">
        <div class="rounded-[6px] bg-bg p-[10px] mb-[10px]">
          <div class="text-[12px] font-semibold text-text-primary">{{ replyModal.record.org }} · {{ replyModal.record.department }}</div>
          <div class="text-[11px] text-text-secondary mt-[4px]">{{ replyModal.record.content }}</div>
        </div>
        <a-form layout="vertical">
          <a-form-item label="回复内容" required>
            <a-textarea v-model:value="replyModal.content" :rows="4" placeholder="请回复机构评价，回复后机构将在工作台查看" />
          </a-form-item>
          <a-alert type="info" show-icon message="回复内容将同步至机构工作台对应服务订阅记录" />
        </a-form>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message, Empty } from 'ant-design-vue';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { developerServices, serviceVersions } from '../../data/developerCenter';
import type { DeveloperService, ServiceVersion } from '../../data/developerCenter';
import { qualityEvaluations } from '../../data/operations';
import type { QualityEvaluation } from '../../data/operations';
import PageHeader from '../../components/common/PageHeader.vue';
import StatCard from '../../components/common/StatCard.vue';
import FilterBar from '../../components/common/FilterBar.vue';

const router = useRouter();
const emptyImg = Empty.PRESENTED_IMAGE_SIMPLE;

const ratingKeys = ['准确性', '稳定性', '响应时效', '业务适配性'] as const;

const kpis = computed(() => {
  const listed = developerServices.filter((s) => s.status === '已上架').length;
  const reviewing = developerServices.filter((s) => s.status === '审核中').length;
  const draft = developerServices.filter((s) => s.status === '草稿').length;
  const rejected = developerServices.filter((s) => s.status === '已驳回').length;
  return [
    { label: '已上架', value: listed, delta: '正常运营', tone: 'success' as const },
    { label: '审核中', value: reviewing, delta: '平均 2.4 天', tone: 'warning' as const },
    { label: '草稿箱', value: draft, delta: '可继续编辑', tone: 'default' as const },
    { label: '已驳回', value: rejected, delta: '需补充材料', tone: 'danger' as const },
  ];
});

const columns = [
  { title: '服务名称', dataIndex: 'name', key: 'name' },
  { title: '分类', dataIndex: 'category', key: 'category', width: 200 },
  { title: '风险等级', dataIndex: 'riskLevel', key: 'riskLevel', width: 100 },
  { title: '计费方式', dataIndex: 'billingMethod', key: 'billingMethod', width: 120 },
  { title: '提交时间', dataIndex: 'submittedAt', key: 'submittedAt', width: 160 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 240 },
];

const filter = ref({ name: '', riskLevel: undefined as string | undefined, status: undefined as string | undefined });
const applied = ref({ name: '', riskLevel: undefined as string | undefined, status: undefined as string | undefined });

function onSearch() {
  applied.value = { ...filter.value };
}
function onReset() {
  filter.value = { name: '', riskLevel: undefined, status: undefined };
  applied.value = { name: '', riskLevel: undefined, status: undefined };
}

const filteredData = computed(() => {
  const f = applied.value;
  return developerServices
    .filter((s) => {
      if (f.name && !s.name.includes(f.name)) return false;
      if (f.riskLevel && s.riskLevel !== f.riskLevel) return false;
      if (f.status && s.status !== f.status) return false;
      return true;
    })
    .map((s) => ({ key: s.id, ...s }));
});

function onExport() {
  message.success('上架申请清单导出请求已提交');
}

function riskTagColor(level: string): 'error' | 'warning' | 'success' {
  if (level === '高风险') return 'error';
  if (level === '中风险') return 'warning';
  return 'success';
}

function statusBadge(status: string): 'success' | 'processing' | 'warning' | 'error' | 'default' {
  if (status === '已上架') return 'success';
  if (status === '审核中') return 'processing';
  if (status === '草稿' || status === '待提交') return 'default';
  if (status === '已下架') return 'warning';
  return 'error';
}

function stepIndex(status: string): number {
  if (status === '草稿') return 0;
  if (status === '审核中') return 2;
  if (status === '已上架') return 4;
  return 1;
}

function finalStatusDesc(status: string): string {
  if (status === '已上架') return '审核通过，已上架运营';
  if (status === '已驳回') return '审核未通过，请补充材料后重新提交';
  if (status === '已下架') return '已主动下架';
  return '处理中';
}

function versionTypeLabel(type: string) {
  if (type === 'major') return '大版本';
  if (type === 'minor') return '功能更新';
  if (type === 'patch') return '补丁';
  return '热修复';
}

function versionTagColor(type: string): 'error' | 'processing' | 'success' | 'warning' {
  if (type === 'major') return 'error';
  if (type === 'minor') return 'processing';
  if (type === 'patch') return 'success';
  return 'warning';
}

function versionStatusBadge(status: string): 'success' | 'processing' | 'default' {
  if (status === '在线') return 'success';
  if (status === '灰度中') return 'processing';
  return 'default';
}

const detailDrawer = ref<{ visible: boolean; record: DeveloperService | null }>({ visible: false, record: null });

const serviceVersionsForDetail = computed(() => {
  if (!detailDrawer.value.record) return [];
  return serviceVersions.filter((v) => v.service === detailDrawer.value.record!.name);
});

function onDetail(record: DeveloperService) {
  detailDrawer.value = { visible: true, record };
}

function onCreate() {
  router.push('/developer-center/listing/create');
}

function onEdit(record: DeveloperService) {
  router.push(`/developer-center/listing/create?id=${record.id}`);
}

function onSubmit(record: DeveloperService) {
  message.success(`${record.name} 已提交审核，预计 3 个工作日内反馈`);
}

function onDelist(record: DeveloperService) {
  message.success(`已下架 ${record.name}`);
}

const versionModal = ref<{
  visible: boolean;
  service: string;
  version: string;
  type: 'major' | 'minor' | 'patch' | 'hotfix';
  notes: string;
  strategy: 'gray' | 'full';
}>({ visible: false, service: '', version: '', type: 'minor', notes: '', strategy: 'gray' });

function onNewVersion(record: DeveloperService) {
  versionModal.value = { visible: true, service: record.name, version: '', type: 'minor', notes: '', strategy: 'gray' };
}

function confirmNewVersion() {
  const m = versionModal.value;
  if (!m.version || !m.notes) {
    message.warning('请完整填写版本号与更新说明');
    return;
  }
  message.success(m.strategy === 'gray' ? `${m.version} 已提交灰度发布` : `${m.version} 已全量上线`);
  versionModal.value.visible = false;
}

function onPromote(version: ServiceVersion) {
  message.success(`${version.version} 已全量上线`);
}

function onArchive(version: ServiceVersion) {
  message.success(`${version.version} 已归档`);
}

// 评价与回复
const serviceEvaluationsForDetail = computed<QualityEvaluation[]>(() => {
  if (!detailDrawer.value.record) return [];
  const name = detailDrawer.value.record.name;
  return qualityEvaluations.filter((e) => e.serviceName === name || name.includes(e.serviceName) || e.serviceName.includes(name));
});

function evalStatusBadge(status: string): 'success' | 'processing' | 'warning' {
  if (status === '已回复') return 'success';
  if (status === '处理中') return 'processing';
  return 'warning';
}

const replyModal = ref<{ visible: boolean; record: QualityEvaluation | null; content: string }>({
  visible: false,
  record: null,
  content: '',
});

function onReplyEvaluation(ev: QualityEvaluation) {
  replyModal.value = { visible: true, record: ev, content: ev.reply ?? '' };
}

function confirmReply() {
  if (!replyModal.value.content) {
    message.warning('请填写回复内容');
    return;
  }
  if (replyModal.value.record) {
    replyModal.value.record.reply = replyModal.value.content;
    replyModal.value.record.status = '已回复';
  }
  message.success('回复已提交，机构可在工作台查看');
  replyModal.value.visible = false;
}
</script>
