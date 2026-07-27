<template>
  <div class="p-[20px]">
    <PageHeader title="异常对账处置" description="识别异常调用并完成核验、处置、归档闭环，处置动作同步至机构与开发者" />

    <!-- KPI -->
    <section class="grid grid-cols-4 gap-[14px] mb-[14px]">
      <StatCard label="异常总数" :value="kpi.total" unit="条" tone="primary" delta="本期识别" />
      <StatCard label="待核验" :value="kpi.verifying" unit="条" tone="warning" delta="需人工核验" />
      <StatCard label="已归档" :value="kpi.archived" unit="条" tone="success" delta="处置完成" />
      <StatCard label="本期退费" :value="kpi.refundAmount" tone="default" delta="已退至机构" />
    </section>

    <!-- 异常处置全流程 -->
    <section class="mb-[14px] overflow-hidden rounded-[10px] relative bg-gradient-to-br from-[#f0f5ff] via-white to-[#e6efff]">
      <!-- 装饰光晕 -->
      <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(circle at 0% 0%, rgba(22,93,255,0.08) 0%, transparent 40%), radial-gradient(circle at 100% 100%, rgba(22,93,255,0.06) 0%, transparent 40%);"></div>
      <!-- 装饰圆形 -->
      <div class="absolute -top-[40px] -right-[40px] w-[120px] h-[120px] rounded-full bg-primary/5 pointer-events-none"></div>
      <div class="absolute -bottom-[30px] -left-[30px] w-[80px] h-[80px] rounded-full bg-primary/5 pointer-events-none"></div>
      <div class="relative px-[24px] py-[10px] flex items-center justify-between">
        <div class="flex items-center gap-[10px]">
          <div class="w-[4px] h-[14px] rounded-full bg-gradient-to-b from-primary to-primary/50" />
          <span class="text-[14px] font-semibold text-text-primary">异常处置全流程</span>
        </div>
        <a-tag color="blue" class="!m-0 !text-[11px]">7 步闭环</a-tag>
      </div>
      <div class="relative px-[24px] pt-[20px] pb-[20px]">
        <div class="flex items-center">
          <template v-for="(stage, idx) in stages" :key="stage.name">
            <div class="flex-1 flex items-center justify-center gap-[12px] group">
              <div class="relative shrink-0">
                <div class="w-[34px] h-[34px] rounded-full bg-white border-[2px] border-primary grid place-items-center transition-all duration-300 group-hover:shadow-md">
                  <div class="w-[10px] h-[10px] rounded-full bg-primary"></div>
                </div>
                <div class="absolute -top-[3px] -right-[3px] w-[15px] h-[15px] rounded-full bg-primary text-white text-[9px] font-bold grid place-items-center">{{ idx + 1 }}</div>
              </div>
              <div class="min-w-0">
                <div class="text-[13px] font-semibold text-text-primary leading-[18px]">{{ stage.name }}</div>
                <p class="text-[11px] text-text-secondary leading-[16px] mt-[2px] truncate">{{ stage.desc }}</p>
              </div>
            </div>
            <svg v-if="idx < stages.length - 1" width="16" height="16" viewBox="0 0 16 16" class="text-primary/40 mx-[10px] shrink-0">
              <path d="M6 4 L10 8 L6 12" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
        </div>
      </div>
    </section>

    <!-- 异常列表 -->
    <section class="cloud-card p-[0] overflow-hidden mb-[14px]">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <template #actions>
          <a-button @click="onBatchVerify">
            <template #icon><SafetyOutlined /></template>
            批量核验
          </a-button>
          <a-button @click="onExport">
            <template #icon><DownloadOutlined /></template>
            导出
          </a-button>
        </template>
        <a-select v-model:value="filterType" style="width: 160px" placeholder="异常类型" allow-clear>
          <a-select-option v-for="t in exceptionTypes" :key="t.type" :value="t.type">{{ t.type }}</a-select-option>
        </a-select>
        <a-select v-model:value="filterStatus" style="width: 140px" placeholder="处置状态" allow-clear>
          <a-select-option v-for="s in disposeStatusOptions" :key="s" :value="s">{{ s }}</a-select-option>
        </a-select>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>
      <div class="px-[16px] py-[16px]">
        <a-table :columns="columns" :data-source="filteredData" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle" row-key="id" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, getCheckboxProps: getCheckboxProps }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'type'">
              <a-tag :color="typeColor(record.type)" class="!m-0">{{ record.type }}</a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-badge :status="statusBadge(record.status)" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button v-if="record.status === '识别'" type="link" size="small" class="!p-0" @click="onVerify(record)">开始核验</a-button>
                <a-button v-else-if="record.status === '核验中'" type="link" size="small" class="!p-0" @click="onConfirmException(record)">确认异常</a-button>
                <a-button v-else-if="record.status === '已确认'" type="link" size="small" class="!p-0" @click="onViewDispose(record)">查看处置</a-button>
                <a-button v-else-if="record.status === '已申诉'" type="link" size="small" class="!p-0" @click="onAppeal(record)">查看申诉</a-button>
                <a-button v-else type="link" size="small" class="!p-0" @click="onDetail(record)">详情</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 处置工单列表 -->
    <section class="cloud-card p-[14px]">
      <div class="flex items-center justify-between mb-[12px]">
        <div>
          <div class="text-[14px] font-semibold text-text-primary">处置工单列表</div>
          <div class="text-[11px] text-text-secondary mt-[4px]">所有处置动作需审批留痕，处置结果同步至机构与开发者</div>
        </div>
        <a-tag color="orange" class="!m-0 !text-[11px]">本月已处置 {{ disposeOrders.length }} 单 · 累计退费 ¥ 12,840</a-tag>
      </div>
      <a-table :columns="disposeColumns" :data-source="disposeOrders" :pagination="{ pageSize: 5, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle" row-key="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <a-tag :color="disposeActionColor(record.action)" class="!m-0 !text-[10px]">{{ record.action }}</a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-badge :status="record.status === '已归档' ? 'default' : 'success'" :text="record.status" />
          </template>
        </template>
      </a-table>
    </section>

    <!-- 异常详情抽屉 -->
    <a-drawer v-model:open="detailDrawer.visible" title="异常详情" :width="640" placement="right">
      <template v-if="detailDrawer.record">
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="异常编号">{{ detailDrawer.record.id }}</a-descriptions-item>
          <a-descriptions-item label="异常类型">
            <a-tag :color="typeColor(detailDrawer.record.type)" class="!m-0">{{ detailDrawer.record.type }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="服务">{{ detailDrawer.record.service }}</a-descriptions-item>
          <a-descriptions-item label="机构">{{ detailDrawer.record.org }}</a-descriptions-item>
          <a-descriptions-item label="时间">{{ detailDrawer.record.time }}</a-descriptions-item>
          <a-descriptions-item label="异常描述">{{ detailDrawer.record.description }}</a-descriptions-item>
          <a-descriptions-item label="处置状态">
            <a-badge :status="statusBadge(detailDrawer.record.status)" :text="detailDrawer.record.status" />
          </a-descriptions-item>
          <a-descriptions-item label="处理人">{{ detailDrawer.record.handler }}</a-descriptions-item>
        </a-descriptions>

        <a-divider />

        <div class="text-[13px] font-semibold text-text-primary mb-[10px]">处置流程轨迹</div>
        <a-steps :current="stageIndex(detailDrawer.record.status)" direction="vertical" size="small">
          <a-step title="系统识别" :description="detailDrawer.record.time" />
          <a-step title="自动分级" description="按风险等级分发处理人" />
          <a-step title="人工核验" description="核验调用记录与计费明细" />
          <a-step title="异常确认" description="确认为真实异常，进入处置" />
          <a-step title="申诉复核" description="机构/开发者申诉，二级复核" />
          <a-step title="处置执行" description="退费/补扣/追责/转审计" />
          <a-step title="同步归档" description="同步机构与开发者，归档留痕" />
        </a-steps>

        <div v-if="detailDrawer.record.status === '已申诉'" class="mt-[16px] rounded-[6px] border border-warning/30 bg-warning/5 p-[10px]">
          <div class="text-[12px] font-semibold text-warning mb-[4px]">申诉理由</div>
          <div class="text-[12px] text-text-secondary leading-[18px]">{{ detailDrawer.record.appealReason ?? '机构称本次调用为正常业务流程，请求撤销扣费处理。' }}</div>
        </div>
      </template>
    </a-drawer>

    <!-- 处置弹窗 -->
    <a-modal v-model:open="disposeModal.visible" title="异常处置" @ok="confirmDispose" ok-text="提交处置" cancel-text="取消" :width="560">
      <template v-if="disposeModal.record">
        <div class="rounded-[6px] bg-bg p-[10px] mb-[14px]">
          <div class="text-[13px] font-semibold text-text-primary">{{ disposeModal.record.service }}</div>
          <div class="text-[11px] text-text-secondary mt-[2px]">{{ disposeModal.record.id }} · {{ disposeModal.record.type }} · {{ disposeModal.record.org }}</div>
        </div>
        <a-form layout="vertical">
          <a-form-item label="处置动作" required>
            <a-radio-group v-model:value="disposeModal.action">
              <a-radio value="退费">退费（机构多扣）</a-radio>
              <a-radio value="补扣">补扣（机构少付）</a-radio>
              <a-radio value="追责">追责（违规调用）</a-radio>
              <a-radio value="转审计">转审计（涉嫌违规）</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item v-if="disposeModal.action === '退费' || disposeModal.action === '补扣'" label="金额" required>
            <a-input v-model:value="disposeModal.amount" placeholder="如：¥ 1,280.00" />
          </a-form-item>
          <a-form-item v-if="disposeModal.action === '追责'" label="追责对象" required>
            <a-input v-model:value="disposeModal.target" placeholder="如：常州市人民医院·医保办" />
          </a-form-item>
          <a-form-item label="处置说明" required>
            <a-textarea v-model:value="disposeModal.note" :rows="3" placeholder="请描述处置依据、处置结果、后续改进建议" />
          </a-form-item>
          <a-form-item label="同步至">
            <a-checkbox-group v-model:value="disposeModal.notify">
              <a-checkbox value="org">机构</a-checkbox>
              <a-checkbox value="developer">开发者</a-checkbox>
              <a-checkbox value="audit">安全审计</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-alert type="warning" show-icon message="处置动作需二级审批，提交后将进入审批工作台，审批通过后自动同步至所选对象。" />
        </a-form>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { SafetyOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { exceptionTypes, exceptionRecords } from '../../../data/reconciliation';
import type { ExceptionRecord } from '../../../data/reconciliation';
import PageHeader from '../../../components/common/PageHeader.vue';
import StatCard from '../../../components/common/StatCard.vue';
import FilterBar from '../../../components/common/FilterBar.vue';

const filterType = ref();
const filterStatus = ref();
const appliedFilterType = ref();
const appliedFilterStatus = ref();

const disposeStatusOptions = ['识别', '核验中', '已确认', '已申诉'];

const columns = [
  { title: '异常类型', dataIndex: 'type', key: 'type', width: 120 },
  { title: '服务', dataIndex: 'service', key: 'service' },
  { title: '机构', dataIndex: 'org', key: 'org', width: 200 },
  { title: '时间', dataIndex: 'time', key: 'time', width: 160 },
  { title: '异常描述', dataIndex: 'description', key: 'description' },
  { title: '处置状态', dataIndex: 'status', key: 'status', width: 110 },
  { title: '处理人', dataIndex: 'handler', key: 'handler', width: 100 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 130 },
];

function onSearch() {
  appliedFilterType.value = filterType.value;
  appliedFilterStatus.value = filterStatus.value;
}

function onReset() {
  filterType.value = undefined;
  filterStatus.value = undefined;
  appliedFilterType.value = undefined;
  appliedFilterStatus.value = undefined;
}

function onBatchVerify() {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先勾选需要核验的异常记录');
    return;
  }
  const selected = filteredData.value.filter((r) => selectedRowKeys.value.includes(r.id));
  const verifyable = selected.filter((r) => r.status === '识别');
  if (verifyable.length === 0) {
    message.warning('选中的记录中没有待核验（识别状态）的异常');
    return;
  }
  message.success(`已批量提交 ${verifyable.length} 条异常记录进入核验阶段`);
  selectedRowKeys.value = [];
}

const selectedRowKeys = ref<string[]>([]);

function onSelectChange(keys: string[]) {
  selectedRowKeys.value = keys;
}

function getCheckboxProps(record: any) {
  return { disabled: record.status !== '识别' };
}

function onExport() {
  message.success(`已导出 ${filteredData.value.length} 条异常记录`);
}

const filteredData = computed(() => {
  return exceptionRecords
    .filter((r) => {
      if (appliedFilterType.value && r.type !== appliedFilterType.value) return false;
      if (appliedFilterStatus.value && r.status !== appliedFilterStatus.value) return false;
      return true;
    })
    .map((r) => ({ key: r.id, ...r }));
});

const kpi = computed(() => {
  const total = exceptionRecords.length;
  const verifying = exceptionRecords.filter((r) => r.status === '识别' || r.status === '核验中').length;
  const archived = exceptionRecords.filter((r) => r.status === '已确认' || r.status === '已申诉').length;
  return {
    total,
    verifying,
    archived,
    refundAmount: '¥ 12,840',
  };
});

const stages = [
  { name: '系统识别', desc: '规则与阈值自动捕获异常调用', owner: '系统', color: '#94A3B8' },
  { name: '自动分级', desc: '按风险等级分发处理人', owner: '系统', color: '#165DFF' },
  { name: '人工核验', desc: '核验调用记录与计费明细', owner: '运营处理人', color: '#13B8C6' },
  { name: '异常确认', desc: '确认为真实异常或误报', owner: '运营处理人', color: '#7C3AED' },
  { name: '申诉复核', desc: '机构/开发者申诉，二级复核', owner: '复核岗', color: '#F59E0B' },
  { name: '处置执行', desc: '退费/补扣/追责/转审计', owner: '审批+执行', color: '#EF4444' },
  { name: '同步归档', desc: '同步机构与开发者，归档留痕', owner: '系统', color: '#10B981' },
];

const disposeOrders = ref([
  { id: 'DO-2024-0715-001', exceptionId: 'EX-001', service: '高值耗材智能比对智能体', org: '常州市人民医院', action: '退费', amount: '¥ 1,280.00', handler: '李四', disposedAt: '2024-07-15 11:20', status: '已归档' },
  { id: 'DO-2024-0714-002', exceptionId: 'EX-002', service: '山海知医5.0大模型', org: '南京鼓楼医院', action: '补扣', amount: '¥ 420.00', handler: '李四', disposedAt: '2024-07-14 16:08', status: '已归档' },
  { id: 'DO-2024-0713-003', exceptionId: 'EX-003', service: '肺结节CT图像辅助检测', org: '东南大学附属中大医院', action: '追责', amount: '-', handler: '李四', disposedAt: '2024-07-13 14:32', status: '已归档' },
  { id: 'DO-2024-0712-004', exceptionId: 'EX-004', service: '远程心电AI诊断', org: '南京市第一医院', action: '转审计', amount: '-', handler: '李四', disposedAt: '2024-07-12 10:15', status: '已归档' },
  { id: 'DO-2024-0711-005', exceptionId: 'EX-005', service: 'BGE检索重排序模型', org: '常州市人民医院', action: '退费', amount: '¥ 86.00', handler: '李四', disposedAt: '2024-07-11 09:48', status: '已归档' },
  { id: 'DO-2024-0710-006', exceptionId: 'EX-006', service: '电子病历辅助生成智能体', org: '南京市第二医院', action: '补扣', amount: '¥ 230.00', handler: '李四', disposedAt: '2024-07-10 14:20', status: '已归档' },
]);

const disposeColumns = [
  { title: '工单号', dataIndex: 'id', key: 'id', width: 170 },
  { title: '关联异常', dataIndex: 'exceptionId', key: 'exceptionId', width: 110 },
  { title: '服务', dataIndex: 'service', key: 'service' },
  { title: '机构', dataIndex: 'org', key: 'org', width: 180 },
  { title: '处置动作', dataIndex: 'action', key: 'action', width: 110 },
  { title: '金额', dataIndex: 'amount', key: 'amount', width: 110 },
  { title: '处置时间', dataIndex: 'disposedAt', key: 'disposedAt', width: 150 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
];

function typeColor(type: string): 'error' | 'warning' | 'processing' | 'default' {
  if (type === '异常高频' || type === '超授权调用') return 'error';
  if (type === '重复调用' || type === '失败扣费') return 'warning';
  if (type === '跨机构异常') return 'processing';
  return 'default';
}

function statusBadge(status: string): 'default' | 'processing' | 'success' | 'warning' | 'error' {
  if (status === '识别') return 'default';
  if (status === '核验中') return 'processing';
  if (status === '已确认') return 'success';
  if (status === '已申诉') return 'warning';
  return 'default';
}

function disposeActionColor(action: string): string {
  const map: Record<string, string> = { 退费: 'green', 补扣: 'orange', 追责: 'red', 转审计: 'purple' };
  return map[action] || 'default';
}

function onVerify(record: ExceptionRecord) {
  message.success(`${record.id} 已进入核验阶段`);
}

function onConfirmException(record: ExceptionRecord) {
  message.success(`${record.id} 已确认为真实异常，进入待处置状态`);
}

const disposeModal = ref<{
  visible: boolean;
  record: ExceptionRecord | null;
  action: '退费' | '补扣' | '追责' | '转审计';
  amount: string;
  target: string;
  note: string;
  notify: string[];
}>({
  visible: false,
  record: null,
  action: '退费',
  amount: '',
  target: '',
  note: '',
  notify: ['org', 'developer'],
});

function onDispose(record: ExceptionRecord) {
  disposeModal.value = {
    visible: true,
    record,
    action: '退费',
    amount: '',
    target: '',
    note: '',
    notify: ['org', 'developer'],
  };
}

function confirmDispose() {
  const m = disposeModal.value;
  if (m.action === '退费' || m.action === '补扣') {
    if (!m.amount) {
      message.warning('请填写金额');
      return;
    }
  }
  if (m.action === '追责' && !m.target) {
    message.warning('请填写追责对象');
    return;
  }
  message.success(`处置已提交，进入二级审批流程；审批通过后将同步至 ${m.notify.length} 个对象`);
  disposeModal.value.visible = false;
}

function onViewDispose(record: ExceptionRecord) {
  detailDrawer.value = { visible: true, record };
}

function onAppeal(record: ExceptionRecord) {
  detailDrawer.value = { visible: true, record };
}

function onDetail(record: ExceptionRecord) {
  detailDrawer.value = { visible: true, record };
}

const detailDrawer = ref<{ visible: boolean; record: ExceptionRecord | null }>({ visible: false, record: null });

function stageIndex(status: string): number {
  if (status === '识别') return 0;
  if (status === '核验中') return 2;
  if (status === '已确认') return 3;
  if (status === '已申诉') return 4;
  return 0;
}
</script>
