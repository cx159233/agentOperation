<template>
  <div class="p-[20px]">
    <PageHeader title="服务订阅管理" description="查看已订阅服务的额度、状态，获取调用凭证并对服务进行评价" />

    <!-- 列表 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <template #actions>
          <a-button type="primary" @click="goToServiceHall">
            <template #icon><PlusOutlined /></template>
            订阅新服务
          </a-button>
          <a-button @click="onExport">
            <template #icon><DownloadOutlined /></template>
            导出订阅清单
          </a-button>
        </template>
        <a-input v-model:value="filter.name" style="width: 240px" placeholder="服务名称" allow-clear />
        <a-select v-model:value="filter.status" style="width: 160px" placeholder="状态" allow-clear>
          <a-select-option value="正常">正常</a-select-option>
          <a-select-option value="即将到期">即将到期</a-select-option>
          <a-select-option value="已到期">已到期</a-select-option>
        </a-select>
        <a-select v-model:value="filter.billingMethod" style="width: 180px" placeholder="计费方式" allow-clear>
          <a-select-option v-for="m in billingMethods" :key="m" :value="m">{{ m }}</a-select-option>
        </a-select>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>
      <div class="px-[16px] py-[16px]">
        <a-table :columns="columns" :data-source="filteredData" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              <div class="font-semibold text-text-primary">{{ record.name }}</div>
              <div class="text-[11px] text-text-tertiary mt-[2px]">{{ record.category }}</div>
            </template>
            <template v-else-if="column.dataIndex === 'usage'">
              <div class="flex items-center gap-[8px]">
                <a-progress :percent="Math.min(record.ratio, 100)" :show-info="false" size="small" :stroke-color="ratioColor(record.ratio, record.alertThreshold)" style="width: 100px" />
                <span class="text-[12px]" :class="ratioTextClass(record.ratio, record.alertThreshold)">{{ record.ratio }}%</span>
              </div>
              <div class="text-[11px] text-text-tertiary mt-[2px]">{{ record.used }} / {{ record.quota }}</div>
            </template>
            <template v-else-if="column.dataIndex === 'subAccounts'">
              <span class="font-num text-[12px] text-text-primary">{{ record.subAccounts.length }} 个</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <div class="whitespace-nowrap"><a-badge :status="statusBadge(record.status)" :text="record.status" /></div>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button type="link" size="small" class="!p-0" @click="onShowCredential(record)">调用详情</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button v-if="hasEvaluation(record)" type="link" size="small" class="!p-0" @click="onViewEvaluation(record)">查看评价</a-button>
                <a-button v-else type="link" size="small" class="!p-0" @click="onEvaluate(record)">评价</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0" @click="onRenew(record)">续订</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 调用详情抽屉 -->
    <a-drawer v-model:open="credentialDrawer.visible" title="调用凭证与接入说明" :width="640" placement="right">
      <template v-if="credentialDrawer.record">
        <!-- 服务信息 -->
        <div class="rounded-[8px] bg-bg p-[12px] mb-[16px]">
          <div class="text-[14px] font-semibold text-text-primary">{{ credentialDrawer.record.name }}</div>
          <div class="text-[11px] text-text-secondary mt-[4px]">{{ credentialDrawer.record.category }} · {{ credentialDrawer.record.billingMethod }} · 有效期至 {{ credentialDrawer.record.validUntil }}</div>
        </div>

        <!-- 接入凭证 -->
        <div class="text-[13px] font-semibold text-text-primary mb-[10px]">接入凭证</div>
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="API 端点">
            <span class="font-num text-[12px]">{{ credentialDrawer.record.endpoint }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="AccessKey">
            <div class="flex items-center gap-[8px]">
              <span class="font-num text-[12px]">{{ credentialDrawer.record.accessKey }}</span>
              <a class="text-primary text-[11px]" @click="copyText(credentialDrawer.record.accessKey)">复制</a>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="SecretKey">
            <div class="flex items-center gap-[8px]">
              <span class="font-num text-[12px]">{{ showSecret ? credentialDrawer.record.secretKey : '••••••••••••••••••••••' }}</span>
              <a class="text-primary text-[11px]" @click="showSecret = !showSecret">{{ showSecret ? '隐藏' : '显示' }}</a>
              <a class="text-primary text-[11px]" @click="copyText(credentialDrawer.record.secretKey)">复制</a>
            </div>
          </a-descriptions-item>
        </a-descriptions>

        <a-alert class="!mt-[10px]" type="info" show-icon>
          <template #message>
            <span class="text-[12px]">
              <strong>子账户标识：</strong>调用时通过 HTTP Header <code class="font-num text-primary">X-Sub-Account</code> 传入对应科室/子账户编码，平台据此将用量归属到具体配额账户。
            </span>
          </template>
        </a-alert>

        <!-- 子账户列表 -->
        <div class="flex items-center justify-between mt-[20px] mb-[10px]">
          <div class="text-[13px] font-semibold text-text-primary">子账户列表</div>
          <a-button type="primary" @click="onAddSubAccount">
            <template #icon><PlusOutlined /></template>
            分配子账户额度
          </a-button>
        </div>
        <a-table :columns="subAccountColumns" :data-source="credentialDrawer.record.subAccounts" :pagination="false" size="small" row-key="code">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'code'">
              <span class="font-num text-[12px] text-primary">{{ record.code }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'ratio'">
              <span class="text-[12px] font-semibold" :class="ratioTextClass(record.ratio, 80)">{{ record.ratio }}%</span>
            </template>
            <template v-else-if="column.dataIndex === 'op'">
              <a-space size="small">
                <a class="text-primary text-[11px]" @click="onAdjustSubAccount(record)">调整</a>
                <a-popconfirm title="确认移除该子账户？" @confirm="onRemoveSubAccount(record)">
                  <a class="text-error text-[11px]">移除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>

        <!-- 调用示例 -->
        <div class="text-[13px] font-semibold text-text-primary mt-[20px] mb-[10px]">调用示例</div>
        <div class="text-[11px] text-text-secondary mb-[6px]">cURL 请求</div>
        <pre class="rounded-[6px] bg-sidebar text-white/90 p-[12px] text-[11px] leading-[18px] overflow-x-auto font-num">{{ credentialDrawer.record.callExample }}</pre>
        <div class="text-[11px] text-text-secondary mt-[10px] mb-[6px]">请求体示例（JSON）</div>
        <pre class="rounded-[6px] bg-sidebar text-white/90 p-[12px] text-[11px] leading-[18px] overflow-x-auto font-num">{{ credentialDrawer.record.payloadExample }}</pre>

        <div class="mt-[16px] rounded-[6px] border border-border-soft p-[10px]">
          <div class="text-[12px] font-semibold text-text-primary mb-[4px]">调用说明</div>
          <ol class="text-[11px] text-text-secondary leading-[18px] list-decimal pl-[18px] space-y-[2px]">
            <li>使用机构 AccessKey / SecretKey 进行鉴权，建议服务端存储避免泄露。</li>
            <li>每次调用需通过 <code class="font-num text-primary">X-Sub-Account</code> Header 传入子账户编码，用于配额归属。</li>
            <li>平台按调用次数 / Token 数实时扣减对应子账户配额，超限自动熔断。</li>
            <li>如需为科室新增子账户或调整额度，可在上方「子账户列表」中操作，分配后即时生效。</li>
          </ol>
        </div>
      </template>
    </a-drawer>

    <!-- 分配/调整子账户额度弹窗 -->
    <a-modal
      v-model:open="subAccountModal.visible"
      :title="subAccountModal.mode === 'add' ? `分配子账户额度 - ${subAccountModal.serviceName ?? ''}` : `调整子账户额度 - ${subAccountModal.serviceName ?? ''}`"
      @ok="confirmSubAccount"
      :ok-text="subAccountModal.mode === 'add' ? '确认分配' : '确认调整'"
      cancel-text="取消"
      :width="480"
    >
      <template v-if="subAccountModal.serviceName">
        <div class="rounded-[6px] bg-bg p-[10px] mb-[14px]">
          <div class="text-[13px] font-semibold text-text-primary">{{ subAccountModal.serviceName }}</div>
          <div class="text-[11px] text-text-secondary mt-[2px]">服务总额度：{{ subAccountModal.serviceQuota }} · 已分配：{{ subAccountModal.allocated }}</div>
        </div>
        <a-form layout="vertical">
          <div class="grid grid-cols-2 gap-[12px]">
            <a-form-item label="科室/子账户名称" required>
              <a-select
                v-model:value="subAccountModal.name"
                :disabled="subAccountModal.mode === 'adjust'"
                placeholder="请选择科室"
                allow-clear
              >
                <a-select-option v-for="d in departmentOptions" :key="d" :value="d">{{ d }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="子账户编码" required>
              <a-input
                v-model:value="subAccountModal.code"
                :disabled="subAccountModal.mode === 'adjust'"
                placeholder="如：DEPT_RAD"
              />
            </a-form-item>
          </div>
          <div class="grid grid-cols-2 gap-[12px]">
            <a-form-item label="分配额度" required>
              <a-input v-model:value="subAccountModal.quota" :placeholder="`如：${subAccountModal.quotaHint}`" />
            </a-form-item>
            <a-form-item label="预警阈值">
              <a-input-number v-model:value="subAccountModal.threshold" addon-after="%" :min="50" :max="100" style="width: 100%" />
            </a-form-item>
          </div>
          <a-alert type="info" show-icon>
            <template #message>
              <span class="text-[12px]">
                分配后子账户将通过 <code class="font-num text-primary">X-Sub-Account</code> Header 传入对应编码来归属用量；额度上限受服务总额度约束。
              </span>
            </template>
          </a-alert>
        </a-form>
      </template>
    </a-modal>

    <!-- 评价弹窗 -->
    <a-modal v-model:open="evaluateModal.visible" title="服务评价" @ok="confirmEvaluate" ok-text="提交评价" cancel-text="取消" :width="520">
      <template v-if="evaluateModal.record">
        <div class="rounded-[6px] bg-bg p-[10px] mb-[14px]">
          <div class="text-[13px] font-semibold text-text-primary">{{ evaluateModal.record.name }}</div>
          <div class="text-[11px] text-text-secondary mt-[2px]">{{ evaluateModal.record.category }}</div>
        </div>
        <a-form layout="vertical">
          <div class="grid grid-cols-2 gap-[12px]">
            <a-form-item v-for="key in ratingKeys" :key="key" :label="key">
              <a-rate v-model:value="evaluateModal.ratings[key]" />
            </a-form-item>
          </div>
          <a-form-item label="标签">
            <a-select v-model:value="evaluateModal.tags" mode="tags" placeholder="输入标签后回车" :token-separators="[',']" />
          </a-form-item>
          <a-form-item label="评价内容" required>
            <a-textarea v-model:value="evaluateModal.content" :rows="4" placeholder="请描述您的使用体验与建议" />
          </a-form-item>
        </a-form>
      </template>
    </a-modal>

    <!-- 续订弹窗 -->
    <a-modal v-model:open="renewModal.visible" :title="`续订 - ${renewModal.service?.name ?? ''}`" @ok="confirmRenew" ok-text="确认续订" cancel-text="取消" :width="432">
      <a-form layout="vertical">
        <a-form-item label="续订周期">
          <a-radio-group v-model:value="renewModal.period">
            <a-radio-button value="1年">1 年</a-radio-button>
            <a-radio-button value="2年">2 年（9.5 折）</a-radio-button>
            <a-radio-button value="3年">3 年（9 折）</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="使用范围">
          <a-input v-model:value="renewModal.scope" />
        </a-form-item>
        <a-alert type="info" show-icon message="续订后将自动延长有效期并保持原计费方式" />
      </a-form>
    </a-modal>

    <!-- 查看评价弹窗 -->
    <a-modal v-model:open="viewEvalModal.visible" :title="`服务评价 - ${viewEvalModal.serviceName ?? ''}`" :footer="null" cancel-text="关闭" :width="520">
      <template v-if="viewEvalModal.record">
        <div class="rounded-[6px] bg-bg p-[10px] mb-[14px]">
          <div class="text-[13px] font-semibold text-text-primary">{{ viewEvalModal.record.service }}</div>
          <div class="text-[11px] text-text-secondary mt-[2px]">提交时间：{{ viewEvalModal.record.createdAt }} · 状态：{{ viewEvalModal.record.status }}</div>
        </div>
        <div class="grid grid-cols-2 gap-[12px] mb-[14px]">
          <div v-for="key in ratingKeys" :key="key" class="rounded-[6px] border border-border-soft p-[10px]">
            <div class="text-[11px] text-text-tertiary">{{ key }}</div>
            <div class="mt-[4px] flex items-center gap-[6px]">
              <a-rate :value="viewEvalModal.record.ratings[key]" disabled allow-half style="font-size: 13px" />
              <span class="text-[12px] font-semibold text-primary">{{ viewEvalModal.record.ratings[key] }}</span>
            </div>
          </div>
        </div>
        <div class="text-[12px] font-semibold text-text-primary mb-[6px]">评价内容</div>
        <div class="rounded-[6px] bg-bg p-[10px] mb-[10px] text-[12px] text-text-primary leading-[20px]">{{ viewEvalModal.record.content }}</div>
        <div v-if="viewEvalModal.record.tags?.length" class="flex items-center gap-[6px] mb-[10px]">
          <a-tag v-for="t in viewEvalModal.record.tags" :key="t" color="blue" class="!m-0 !text-[11px]">{{ t }}</a-tag>
        </div>
        <div v-if="viewEvalModal.record.reply" class="rounded-[6px] border border-border-soft p-[10px] bg-primary/5">
          <div class="flex items-center gap-[6px] mb-[4px]">
            <a-tag color="cyan" class="!m-0 !text-[10px]">开发者回复</a-tag>
          </div>
          <div class="text-[12px] text-text-primary leading-[18px]">{{ viewEvalModal.record.reply }}</div>
        </div>
        <a-alert v-else type="info" show-icon class="!mt-[10px]" message="开发者尚未回复，平台将在 3 个工作日内跟进" />
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { subscribedServices, feedbackRecords } from '../../data/orgWorkbench';
import type { OrgSubscribedService, OrgSubAccountRef, FeedbackRecord } from '../../data/orgWorkbench';
import { orgMembers } from '../../data/orgMembers';
import PageHeader from '../../components/common/PageHeader.vue';
import FilterBar from '../../components/common/FilterBar.vue';

const router = useRouter();

const departmentOptions = computed(() => Array.from(new Set(orgMembers.map((m) => m.department))));

const columns = [
  { title: '服务名称', dataIndex: 'name', key: 'name' },
  { title: '计费方式', dataIndex: 'billingMethod', key: 'billingMethod', width: 110 },
  { title: '额度使用', dataIndex: 'usage', key: 'usage', width: 220 },
  { title: '有效期至', dataIndex: 'validUntil', key: 'validUntil', width: 120 },
  { title: '子账户', dataIndex: 'subAccounts', key: 'subAccounts', width: 90 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 110 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 240 },
];

const subAccountColumns = [
  { title: '子账户', dataIndex: 'name', key: 'name' },
  { title: '编码', dataIndex: 'code', key: 'code', width: 130 },
  { title: '额度', dataIndex: 'quota', key: 'quota', width: 130 },
  { title: '已用', dataIndex: 'used', key: 'used', width: 130 },
  { title: '占比', dataIndex: 'ratio', key: 'ratio', width: 80 },
  { title: '操作', dataIndex: 'op', key: 'op', width: 110 },
];

const billingMethods = Array.from(new Set(subscribedServices.map((s) => s.billingMethod)));

const filter = ref({ name: '', status: undefined as string | undefined, billingMethod: undefined as string | undefined });
const applied = ref({ name: '', status: undefined as string | undefined, billingMethod: undefined as string | undefined });

function onSearch() {
  applied.value = { ...filter.value };
}
function onReset() {
  filter.value = { name: '', status: undefined, billingMethod: undefined };
  applied.value = { name: '', status: undefined, billingMethod: undefined };
}

const filteredData = computed(() => {
  const f = applied.value;
  return subscribedServices
    .filter((s) => {
      if (f.name && !s.name.includes(f.name)) return false;
      if (f.status && s.status !== f.status) return false;
      if (f.billingMethod && s.billingMethod !== f.billingMethod) return false;
      return true;
    })
    .map((s) => ({ key: s.id, ...s }));
});

function onExport() {
  message.success('订阅清单导出请求已提交');
}

const ratingKeys = ['准确性', '稳定性', '响应时效', '业务适配性'] as const;

function statusBadge(status: string): 'success' | 'warning' | 'error' {
  if (status === '正常') return 'success';
  if (status === '即将到期') return 'warning';
  return 'error';
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

const credentialDrawer = ref<{ visible: boolean; record: OrgSubscribedService | null }>({
  visible: false,
  record: null,
});
const showSecret = ref(false);

function onShowCredential(record: OrgSubscribedService) {
  showSecret.value = false;
  credentialDrawer.value = { visible: true, record };
}

function copyText(text: string) {
  navigator.clipboard?.writeText(text).then(
    () => message.success('已复制到剪贴板'),
    () => message.warning('复制失败，请手动复制'),
  );
}

// 子账户额度分配/调整
const subAccountModal = ref<{
  visible: boolean;
  mode: 'add' | 'adjust';
  serviceName: string;
  serviceQuota: string;
  allocated: string;
  quotaHint: string;
  name: string;
  code: string;
  quota: string;
  threshold: number;
}>({
  visible: false,
  mode: 'add',
  serviceName: '',
  serviceQuota: '',
  allocated: '',
  quotaHint: '',
  name: '',
  code: '',
  quota: '',
  threshold: 80,
});

function subAccountQuotaHint(record: OrgSubscribedService): string {
  const m = record.billingMethod ?? '';
  if (m.includes('Token')) return '1,000万词元';
  if (m.includes('检查例次')) return '300例/月';
  return '500次/月';
}

function sumAllocated(record: OrgSubscribedService): string {
  const m = record.billingMethod ?? '';
  const sum = record.subAccounts.reduce((acc, sa) => {
    const num = parseFloat(sa.quota.replace(/[^\d.]/g, '')) || 0;
    return acc + num;
  }, 0);
  if (m.includes('Token')) return `${sum.toLocaleString()}万词元`;
  if (m.includes('检查例次')) return `${sum}例/月`;
  return `${sum}次/月`;
}

function onAddSubAccount() {
  const r = credentialDrawer.value.record;
  if (!r) return;
  subAccountModal.value = {
    visible: true,
    mode: 'add',
    serviceName: r.name,
    serviceQuota: r.quota,
    allocated: sumAllocated(r),
    quotaHint: subAccountQuotaHint(r),
    name: '',
    code: '',
    quota: '',
    threshold: 80,
  };
}

function onAdjustSubAccount(row: OrgSubAccountRef) {
  const r = credentialDrawer.value.record;
  if (!r) return;
  subAccountModal.value = {
    visible: true,
    mode: 'adjust',
    serviceName: r.name,
    serviceQuota: r.quota,
    allocated: sumAllocated(r),
    quotaHint: subAccountQuotaHint(r),
    name: row.name,
    code: row.code,
    quota: row.quota,
    threshold: 80,
  };
}

function onRemoveSubAccount(row: OrgSubAccountRef) {
  const r = credentialDrawer.value.record;
  if (!r) return;
  const idx = r.subAccounts.findIndex((sa) => sa.code === row.code);
  if (idx >= 0) r.subAccounts.splice(idx, 1);
  message.success(`子账户「${row.name}」已移除`);
}

function confirmSubAccount() {
  const m = subAccountModal.value;
  if (!m.name || !m.code || !m.quota) {
    message.warning('请完整填写子账户名称、编码与额度');
    return;
  }
  if (m.mode === 'add') {
    const r = credentialDrawer.value.record;
    if (r?.subAccounts.some((sa) => sa.code === m.code)) {
      message.warning('子账户编码已存在，请更换');
      return;
    }
    r?.subAccounts.push({
      name: m.name,
      code: m.code,
      quota: m.quota,
      used: '0',
      ratio: 0,
    });
    message.success(`已为「${m.name}」分配额度 ${m.quota}`);
  } else {
    const r = credentialDrawer.value.record;
    const target = r?.subAccounts.find((sa) => sa.code === m.code);
    if (target) {
      const oldUsedNum = parseFloat(target.used.replace(/[^\d.]/g, '')) || 0;
      const oldQuotaNum = parseFloat(target.quota.replace(/[^\d.]/g, '')) || 1;
      const newQuotaNum = parseFloat(m.quota.replace(/[^\d.]/g, '')) || 1;
      const newRatio = Math.round((oldUsedNum / newQuotaNum) * 1000) / 10;
      target.quota = m.quota;
      target.ratio = newRatio;
    }
    message.success(`「${m.name}」额度已调整至 ${m.quota}`);
  }
  subAccountModal.value.visible = false;
}

const evaluateModal = ref<{
  visible: boolean;
  record: OrgSubscribedService | null;
  ratings: { 准确性: number; 稳定性: number; 响应时效: number; 业务适配性: number };
  tags: string[];
  content: string;
}>({
  visible: false,
  record: null,
  ratings: { 准确性: 4, 稳定性: 4, 响应时效: 4, 业务适配性: 4 },
  tags: [],
  content: '',
});

function onEvaluate(record: OrgSubscribedService) {
  evaluateModal.value = {
    visible: true,
    record,
    ratings: { 准确性: 4, 稳定性: 4, 响应时效: 4, 业务适配性: 4 },
    tags: [],
    content: '',
  };
}

function hasEvaluation(record: OrgSubscribedService): boolean {
  return feedbackRecords.some((fb) => fb.service === record.name);
}

const viewEvalModal = ref<{ visible: boolean; record: FeedbackRecord | null; serviceName: string }>({
  visible: false,
  record: null,
  serviceName: '',
});

function onViewEvaluation(record: OrgSubscribedService) {
  const fb = feedbackRecords.find((f) => f.service === record.name);
  if (!fb) {
    message.info('该服务暂无评价');
    return;
  }
  viewEvalModal.value = { visible: true, record: fb, serviceName: record.name };
}

function confirmEvaluate() {
  if (!evaluateModal.value.content) {
    message.warning('请填写评价内容');
    return;
  }
  message.success('评价已提交，平台将在 3 个工作日内回复');
  evaluateModal.value.visible = false;
}

const renewModal = ref<{ visible: boolean; service: OrgSubscribedService | null; period: string; scope: string }>({
  visible: false,
  service: null,
  period: '1年',
  scope: '',
});

function onRenew(service: OrgSubscribedService) {
  renewModal.value = { visible: true, service, period: '1年', scope: service.scope };
}

function confirmRenew() {
  message.success(`续订成功，已延长至 ${renewModal.value.service?.validUntil} 之后`);
  renewModal.value.visible = false;
}

function goToServiceHall() {
  router.push('/service-hall');
}
</script>
