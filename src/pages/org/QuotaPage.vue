<template>
  <div class="p-[20px]">
    <PageHeader
      title="配额管理"
      description="管理平台分配的限流阈值（TPM / 并发数 / RPM），默认限流不足时向平台申请提额；配置闲置回收规则，释放长期闲置的配额"
    >
      <template #actions>
        <a-button type="primary" @click="onApply">
          <template #icon><PlusOutlined /></template>
          申请提额
        </a-button>
      </template>
    </PageHeader>

    <!-- 顶部 KPI -->
    <section class="grid grid-cols-4 gap-[14px] mb-[14px]">
      <StatCard label="已订阅服务配额" :value="`${serviceRateLimits.length} 项`" delta="含 9 个服务的平台限流契约" tone="primary" />
      <StatCard label="当前 TPM 总量" :value="totalTpm" unit="Tokens/min" :delta="`并发合计 ${totalConcurrency}`" tone="default" />
      <StatCard label="审批中申请" :value="pendingCount" unit="项" delta="平台运营审核中" tone="warning" />
      <StatCard label="闲置待回收" :value="idleCount" unit="项" delta="已触发闲置回收规则" tone="danger" />
    </section>

    <!-- 闲置回收规则 -->
    <section class="cloud-card p-[16px] mb-[14px]">
      <div class="flex items-center justify-between mb-[12px]">
        <div class="flex items-center gap-[10px]">
          <div class="w-[3px] h-[16px] bg-primary rounded-full" />
          <span class="text-[15px] font-semibold text-text-primary">闲置回收规则</span>
          <span class="text-[12px] text-text-tertiary">长期闲置的限流配额将按规则预警或自动回收</span>
        </div>
        <a-button type="text" size="small" @click="onEditRules">
          <template #icon><SettingOutlined /></template>
          规则设置
        </a-button>
      </div>
      <div class="grid grid-cols-2 gap-[14px]">
        <div
          v-for="rule in idleReclaimRules"
          :key="rule.id"
          class="rounded-[8px] border p-[14px]"
          :class="rule.enabled ? 'border-primary/30 bg-primary/[0.03]' : 'border-border-soft bg-bg-soft'"
        >
          <div class="flex items-center justify-between mb-[8px]">
            <div class="flex items-center gap-[8px]">
              <component :is="rule.reclaimRatio > 0 ? 'StopOutlined' : 'WarningOutlined'" class="text-[14px]" :class="rule.enabled ? 'text-primary' : 'text-text-tertiary'" />
              <span class="text-[14px] font-semibold text-text-primary">{{ rule.name }}</span>
              <a-tag v-if="rule.reclaimRatio > 0" color="orange" class="!m-0 !text-[10px]">回收 {{ rule.reclaimRatio }}%</a-tag>
              <a-tag v-else color="blue" class="!m-0 !text-[10px]">仅预警</a-tag>
            </div>
            <a-switch v-model:checked="rule.enabled" size="small" />
          </div>
          <p class="text-[12px] text-text-secondary leading-[18px] mb-[10px]">{{ rule.description }}</p>
          <div class="flex items-center gap-[16px] text-[11px] text-text-tertiary">
            <span>使用率 &lt; <span class="font-num text-text-primary font-semibold">{{ rule.usageThreshold }}%</span></span>
            <span>持续 <span class="font-num text-text-primary font-semibold">{{ rule.idleDays }}</span> 天</span>
          </div>
          <div v-if="rule.lastTriggeredAt" class="mt-[8px] pt-[8px] border-t border-border-soft text-[11px] text-text-tertiary">
            最近触发：{{ rule.lastTriggeredAt }} · {{ rule.lastTriggeredService }}
          </div>
        </div>
      </div>
    </section>

    <!-- 筛选 -->
    <section class="cloud-card p-[0] overflow-hidden mb-[14px]">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <a-input v-model:value="filter.keyword" style="width: 220px" placeholder="服务名称" allow-clear />
        <a-select v-model:value="filter.status" style="width: 140px" placeholder="申请状态" allow-clear>
          <a-select-option value="正常">正常</a-select-option>
          <a-select-option value="审批中">审批中</a-select-option>
          <a-select-option value="已驳回">已驳回</a-select-option>
        </a-select>
        <a-select v-model:value="filter.idleStatus" style="width: 140px" placeholder="闲置状态" allow-clear>
          <a-select-option value="闲置预警">闲置预警</a-select-option>
          <a-select-option value="待回收">待回收</a-select-option>
        </a-select>
      </FilterBar>
    </section>

    <!-- 服务限流配额卡片列表 -->
    <section v-for="rl in filteredRateLimits" :key="rl.id" class="cloud-card p-[0] overflow-hidden mb-[14px]">
      <!-- 服务头部 -->
      <div
        class="relative px-[20px] py-[14px] flex items-center gap-[20px] border-b border-[#e8e8e8]"
        :style="{ background: `linear-gradient(90deg, ${statusGradientStart(rl)} 0%, #FFFFFF 72%)` }"
      >
        <div class="absolute left-0 top-0 bottom-0 w-[3px]" :style="{ background: statusAccentColor(rl) }" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-[8px] mb-[4px]">
            <span class="text-[15px] font-semibold text-text-primary truncate">{{ rl.serviceName }}</span>
            <a-tag class="!m-0 !text-[11px]" :color="billingTagColor(rl.billingMethod)">{{ rl.billingMethod }}</a-tag>
            <a-badge :status="applyStatusBadge(rl.applyStatus)" :text="rl.applyStatus" />
          </div>
          <div class="text-[11px] text-text-tertiary">
            {{ rl.category }}
            <span v-if="rl.lastApplyAt"> · 最近申请：{{ rl.lastApplyAt }}</span>
            <span v-if="rl.idleStatus !== '正常'" class="ml-[8px] px-[6px] py-[1px] rounded-[3px] text-[10px] font-medium" :class="idleTagClass(rl.idleStatus)">
              {{ rl.idleStatus }}{{ rl.idleDays > 0 ? ` · ${rl.idleDays}天` : '' }}
            </span>
          </div>
        </div>
        <div class="flex items-center shrink-0 gap-[8px]">
          <a-button size="small" @click="onViewApplications(rl)">
            <template #icon><UnorderedListOutlined /></template>
            申请记录
          </a-button>
          <a-button type="primary" size="small" @click="onApplyFor(rl)">
            <template #icon><ArrowUpOutlined /></template>
            申请提额
          </a-button>
        </div>
      </div>

      <!-- 限流阈值指标 -->
      <div class="px-[20px] py-[16px]">
        <div class="grid grid-cols-3 gap-[14px]">
          <!-- TPM / RPM -->
          <div class="rounded-[8px] border border-border-soft p-[14px]">
            <div class="flex items-center justify-between mb-[8px]">
              <span class="text-[12px] text-text-tertiary">{{ rl.tpmLimit !== undefined ? 'TPM（Tokens/min）' : 'RPM（Requests/min）' }}</span>
              <a-tag color="blue" class="!m-0 !text-[10px]">平台限流</a-tag>
            </div>
            <div class="flex items-baseline gap-[6px] mb-[8px]">
              <span class="font-num text-[20px] font-semibold" :class="ratioTextClass(rateLimitRatio(rl))">{{ formatNum(rl.tpmUsed ?? rl.rpmUsed) }}</span>
              <span class="text-[12px] text-text-tertiary">/ {{ formatNum(rl.tpmLimit ?? rl.rpmLimit) }}</span>
            </div>
            <a-progress :percent="Math.min(rateLimitRatio(rl), 100)" :show-info="false" size="small" :stroke-color="ratioColor(rateLimitRatio(rl))" />
            <div class="text-[11px] text-text-tertiary mt-[4px]">当前使用率 {{ rateLimitRatio(rl) }}%</div>
          </div>

          <!-- 并发数 -->
          <div class="rounded-[8px] border border-border-soft p-[14px]">
            <div class="flex items-center justify-between mb-[8px]">
              <span class="text-[12px] text-text-tertiary">并发数上限</span>
              <a-tag color="purple" class="!m-0 !text-[10px]">平台限流</a-tag>
            </div>
            <div class="flex items-baseline gap-[6px] mb-[8px]">
              <span class="font-num text-[20px] font-semibold" :class="ratioTextClass(concurrencyRatio(rl))">{{ rl.concurrencyUsed }}</span>
              <span class="text-[12px] text-text-tertiary">/ {{ rl.concurrencyLimit }}</span>
            </div>
            <a-progress :percent="Math.min(concurrencyRatio(rl), 100)" :show-info="false" size="small" :stroke-color="ratioColor(concurrencyRatio(rl))" />
            <div class="text-[11px] text-text-tertiary mt-[4px]">当前使用率 {{ concurrencyRatio(rl) }}%</div>
          </div>

          <!-- 近7天平均使用率 -->
          <div class="rounded-[8px] border border-border-soft p-[14px]">
            <div class="flex items-center justify-between mb-[8px]">
              <span class="text-[12px] text-text-tertiary">近 7 天平均使用率</span>
              <a-tag :color="rl.idleStatus === '正常' ? 'green' : rl.idleStatus === '闲置预警' ? 'orange' : 'red'" class="!m-0 !text-[10px]">
                {{ rl.idleStatus === '正常' ? '活跃' : rl.idleStatus === '闲置预警' ? '偏低' : '闲置' }}
              </a-tag>
            </div>
            <div class="flex items-baseline gap-[6px] mb-[8px]">
              <span class="font-num text-[20px] font-semibold" :class="ratioTextClass(rl.avgUsageRatio)">{{ rl.avgUsageRatio }}%</span>
            </div>
            <a-progress :percent="Math.min(rl.avgUsageRatio, 100)" :show-info="false" size="small" :stroke-color="ratioColor(rl.avgUsageRatio, rl.idleStatus !== '正常' ? 15 : 80)" />
            <div class="text-[11px] text-text-tertiary mt-[4px]">
              <span v-if="rl.idleStatus === '正常'">配额使用健康</span>
              <span v-else-if="rl.idleStatus === '闲置预警'">已触发闲置预警</span>
              <span v-else>已触发自动回收规则</span>
            </div>
          </div>
        </div>

        <!-- 最近申请摘要 -->
        <div v-if="latestApplication(rl)" class="mt-[12px] rounded-[6px] bg-bg-soft p-[10px] flex items-center gap-[10px]">
          <HistoryOutlined class="text-[12px] text-text-tertiary shrink-0" />
          <span class="text-[11px] text-text-secondary">
            最近申请：{{ (latestApplication(rl) as any)?.appliedAt }}
            · {{ (latestApplication(rl) as any)?.applyType }}{{ (latestApplication(rl) as any)?.dimension }}
            · {{ formatNum((latestApplication(rl) as any)?.currentValue) }} → {{ formatNum((latestApplication(rl) as any)?.appliedValue) }}
          </span>
          <a-tag :color="applicationTagColor((latestApplication(rl) as any)?.status)" class="!m-0 !text-[10px] !ml-auto">{{ (latestApplication(rl) as any)?.status }}</a-tag>
        </div>
      </div>
    </section>

    <!-- 空状态 -->
    <section v-if="filteredRateLimits.length === 0" class="cloud-card p-[40px] text-center">
      <a-empty description="未找到匹配的配额记录" />
    </section>

    <!-- 申请提额弹窗 -->
    <a-modal v-model:open="applyModal.visible" title="申请提额" @ok="confirmApply" ok-text="提交申请" cancel-text="取消" :width="520">
      <a-alert type="info" show-icon class="!mb-[14px]">
        <template #message>
          <span class="text-[12px]">此处向平台申请提升模型的限流阈值（TPM / 并发数 / RPM），审核通过后即时生效。子账户 Token 额度分配请在「服务订阅管理」中操作。</span>
        </template>
      </a-alert>
      <a-form layout="vertical">
        <a-form-item label="选择服务" required>
          <a-select v-model:value="applyModal.serviceId" placeholder="请选择已订阅服务" @change="onApplyServiceChange">
            <a-select-option v-for="rl in serviceRateLimits" :key="rl.serviceId" :value="rl.serviceId">
              {{ rl.serviceName }}（{{ rl.billingMethod }}）
            </a-select-option>
          </a-select>
        </a-form-item>
        <div v-if="applyModal.serviceId" class="rounded-[6px] bg-bg p-[10px] mb-[12px] text-[11px] text-text-secondary">
          <div>当前 TPM/RPM：<span class="font-num text-text-primary">{{ formatNum(applyModal.currentMain) }}</span></div>
          <div>当前并发数：<span class="font-num text-text-primary">{{ applyModal.currentConcurrency }}</span></div>
        </div>
        <a-form-item label="申请调整维度" required>
          <a-radio-group v-model:value="applyModal.dimension" :disabled="!applyModal.serviceId">
            <a-radio-button value="TPM" :disabled="!applyModal.hasTpm">TPM</a-radio-button>
            <a-radio-button value="RPM" :disabled="!applyModal.hasRpm">RPM</a-radio-button>
            <a-radio-button value="并发数">并发数</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <div class="grid grid-cols-2 gap-[12px]">
          <a-form-item label="当前值">
            <a-input :value="formatNum(applyModal.currentValue)" disabled />
          </a-form-item>
          <a-form-item label="申请值" required>
            <a-input-number v-model:value="applyModal.appliedValue" :min="1" style="width: 100%" placeholder="请输入申请值" />
          </a-form-item>
        </div>
        <a-form-item label="申请原因" required>
          <a-textarea v-model:value="applyModal.reason" :rows="3" placeholder="请说明提额原因，如业务量增长、新增场景、高峰期超限等" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 申请记录抽屉 -->
    <a-drawer v-model:open="appsDrawer.visible" title="提额申请记录" :width="560" placement="right">
      <template v-if="appsDrawer.record">
        <div class="rounded-[8px] bg-bg-soft border border-border-soft p-[14px] mb-[16px]">
          <div class="text-[15px] font-semibold text-text-primary mb-[4px]">{{ appsDrawer.record.serviceName }}</div>
          <div class="text-[11px] text-text-tertiary">
            {{ appsDrawer.record.category }} · {{ appsDrawer.record.billingMethod }}
          </div>
          <div class="mt-[8px] flex items-center gap-[16px] text-[11px]">
            <span class="text-text-tertiary">TPM/RPM：<span class="font-num text-text-primary font-semibold">{{ formatNum(appsDrawer.record.tpmLimit ?? appsDrawer.record.rpmLimit) }}</span></span>
            <span class="text-text-tertiary">并发：<span class="font-num text-text-primary font-semibold">{{ appsDrawer.record.concurrencyLimit }}</span></span>
            <span class="text-text-tertiary">状态：<a-badge :status="applyStatusBadge(appsDrawer.record.applyStatus)" :text="appsDrawer.record.applyStatus" /></span>
          </div>
        </div>

        <div class="flex items-center gap-[8px] mb-[12px]">
          <div class="w-[3px] h-[14px] bg-primary rounded-full" />
          <span class="text-[13px] font-semibold text-text-primary">申请时间线</span>
          <span class="text-[11px] text-text-tertiary">共 {{ serviceApplications(appsDrawer.record).length }} 条</span>
        </div>

        <a-timeline>
          <a-timeline-item
            v-for="app in serviceApplications(appsDrawer.record)"
            :key="app.id"
            :color="app.status === '已通过' ? 'green' : app.status === '已驳回' ? 'red' : 'blue'"
          >
            <div class="flex items-center gap-[8px] mb-[4px]">
              <a-tag :color="applicationTagColor(app.status)" class="!m-0 !text-[10px]">{{ app.status }}</a-tag>
              <span class="text-[12px] font-semibold text-text-primary">{{ app.applyType }}{{ app.dimension }}</span>
              <span class="text-[11px] text-text-tertiary font-mono">{{ formatNum(app.currentValue) }} → {{ formatNum(app.appliedValue) }}</span>
            </div>
            <div class="text-[11px] text-text-tertiary mb-[4px]">{{ app.appliedAt }}</div>
            <div class="text-[12px] text-text-secondary leading-[18px]">{{ app.reason }}</div>
            <div v-if="app.reviewer" class="mt-[6px] rounded-[4px] bg-bg p-[8px] text-[11px] text-text-secondary leading-[18px]">
              <div>审核人：{{ app.reviewer }} · {{ app.reviewedAt }}</div>
              <div v-if="app.reviewOpinion" class="mt-[2px]"><span class="text-text-tertiary">审核意见：</span>{{ app.reviewOpinion }}</div>
              <div v-if="app.approvedValue !== undefined" class="mt-[2px]"><span class="text-text-tertiary">审定值：</span><span class="font-num text-text-primary font-semibold">{{ formatNum(app.approvedValue) }}</span></div>
            </div>
          </a-timeline-item>
        </a-timeline>
      </template>
    </a-drawer>

    <!-- 规则设置弹窗 -->
    <a-modal v-model:open="rulesModal.visible" title="闲置回收规则设置" @ok="confirmRules" ok-text="保存规则" cancel-text="取消" :width="520">
      <div v-for="rule in rulesModal.rules" :key="rule.id" class="rounded-[8px] border border-border-soft p-[14px] mb-[12px]">
        <div class="flex items-center justify-between mb-[10px]">
          <span class="text-[14px] font-semibold text-text-primary">{{ rule.name }}</span>
          <a-switch v-model:checked="rule.enabled" size="small" />
        </div>
        <a-form layout="vertical" size="small">
          <div class="grid grid-cols-3 gap-[10px]">
            <a-form-item label="使用率阈值(%)">
              <a-input-number v-model:value="rule.usageThreshold" :min="1" :max="100" style="width: 100%" />
            </a-form-item>
            <a-form-item label="持续天数">
              <a-input-number v-model:value="rule.idleDays" :min="1" style="width: 100%" />
            </a-form-item>
            <a-form-item label="回收比例(%)">
              <a-input-number v-model:value="rule.reclaimRatio" :min="0" :max="100" style="width: 100%" />
            </a-form-item>
          </div>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import {
  PlusOutlined,
  ArrowUpOutlined,
  SettingOutlined,
  UnorderedListOutlined,
  HistoryOutlined,
  WarningOutlined,
  StopOutlined,
} from '@ant-design/icons-vue';
import { serviceRateLimits, quotaApplications, idleReclaimRules } from '../../data/orgWorkbench';
import type { ServiceRateLimit, QuotaApplication, IdleReclaimRule } from '../../data/orgWorkbench';
import PageHeader from '../../components/common/PageHeader.vue';
import FilterBar from '../../components/common/FilterBar.vue';
import StatCard from '../../components/common/StatCard.vue';

const filter = ref({ keyword: '', status: undefined as string | undefined, idleStatus: undefined as string | undefined });
const applied = ref({ keyword: '', status: undefined as string | undefined, idleStatus: undefined as string | undefined });

function onSearch() {
  applied.value = { ...filter.value };
}
function onReset() {
  filter.value = { keyword: '', status: undefined, idleStatus: undefined };
  applied.value = { keyword: '', status: undefined, idleStatus: undefined };
}

const filteredRateLimits = computed(() => {
  const f = applied.value;
  return serviceRateLimits.filter((rl) => {
    if (f.keyword && !rl.serviceName.includes(f.keyword)) return false;
    if (f.status && rl.applyStatus !== f.status) return false;
    if (f.idleStatus && rl.idleStatus !== f.idleStatus) return false;
    return true;
  });
});

// KPI 统计
const totalTpm = computed(() => {
  const sum = serviceRateLimits.reduce((acc, rl) => acc + (rl.tpmLimit ?? rl.rpmLimit ?? 0), 0);
  return sum.toLocaleString();
});
const totalConcurrency = computed(() => serviceRateLimits.reduce((acc, rl) => acc + rl.concurrencyLimit, 0));
const pendingCount = computed(() => serviceRateLimits.filter((r) => r.applyStatus === '审批中').length);
const idleCount = computed(() => serviceRateLimits.filter((r) => r.idleStatus !== '正常').length);

// 使用率计算
function rateLimitRatio(rl: ServiceRateLimit): number {
  const limit = rl.tpmLimit ?? rl.rpmLimit ?? 0;
  const used = rl.tpmUsed ?? rl.rpmUsed ?? 0;
  if (!limit) return 0;
  return Math.round((used / limit) * 100);
}
function concurrencyRatio(rl: ServiceRateLimit): number {
  if (!rl.concurrencyLimit) return 0;
  return Math.round((rl.concurrencyUsed / rl.concurrencyLimit) * 100);
}

function formatNum(n?: number): string {
  if (n === undefined) return '-';
  return n.toLocaleString();
}

function ratioColor(ratio: number, threshold = 80): string {
  if (ratio >= 100) return '#EF4444';
  if (ratio >= threshold) return '#F59E0B';
  if (threshold > 50 && ratio < 15) return '#94A3B8';
  return '#165DFF';
}
function ratioTextClass(ratio: number, threshold = 80): string {
  if (ratio >= 100) return 'text-error font-bold';
  if (ratio >= threshold) return 'text-warning font-bold';
  if (threshold > 50 && ratio < 15) return 'text-text-tertiary';
  return 'text-text-primary';
}

function applyStatusBadge(status: string): 'success' | 'warning' | 'error' {
  if (status === '正常') return 'success';
  if (status === '审批中') return 'warning';
  return 'error';
}
function applicationTagColor(status: string): 'success' | 'processing' | 'error' {
  if (status === '已通过') return 'success';
  if (status === '审批中') return 'processing';
  return 'error';
}

function statusGradientStart(rl: ServiceRateLimit): string {
  if (rl.applyStatus === '审批中') return '#FFF7E8';
  if (rl.applyStatus === '已驳回') return '#FEF0F0';
  if (rl.idleStatus === '待回收') return '#FEF0F0';
  if (rl.idleStatus === '闲置预警') return '#FFF7E8';
  return '#E8F3FF';
}
function statusAccentColor(rl: ServiceRateLimit): string {
  if (rl.applyStatus === '审批中') return '#F59E0B';
  if (rl.applyStatus === '已驳回') return '#EF4444';
  if (rl.idleStatus === '待回收') return '#EF4444';
  if (rl.idleStatus === '闲置预警') return '#F59E0B';
  return '#165DFF';
}

function idleTagClass(status: string): string {
  if (status === '待回收') return 'bg-error/10 text-error';
  if (status === '闲置预警') return 'bg-warning/10 text-warning';
  return 'bg-bg-soft text-text-tertiary';
}

function billingTagColor(method: string): 'blue' | 'cyan' | 'purple' {
  if (method.includes('Token')) return 'blue';
  if (method.includes('检查例次')) return 'cyan';
  return 'purple';
}

function serviceApplications(rl: ServiceRateLimit): QuotaApplication[] {
  return quotaApplications
    .filter((a) => a.serviceId === rl.serviceId)
    .sort((a, b) => (a.appliedAt < b.appliedAt ? 1 : -1));
}
function latestApplication(rl: ServiceRateLimit): QuotaApplication | undefined {
  return serviceApplications(rl)[0];
}

// 申请提额
const applyModal = ref<{
  visible: boolean;
  serviceId: string;
  dimension: 'TPM' | 'RPM' | '并发数';
  currentValue: number;
  appliedValue: number;
  reason: string;
  currentMain: number;
  currentConcurrency: number;
  hasTpm: boolean;
  hasRpm: boolean;
}>({
  visible: false, serviceId: '', dimension: 'TPM', currentValue: 0, appliedValue: 0, reason: '',
  currentMain: 0, currentConcurrency: 0, hasTpm: false, hasRpm: false,
});

function onApply() {
  applyModal.value = {
    visible: true, serviceId: '', dimension: 'TPM', currentValue: 0, appliedValue: 0, reason: '',
    currentMain: 0, currentConcurrency: 0, hasTpm: false, hasRpm: false,
  };
}

function onApplyFor(rl: ServiceRateLimit) {
  const hasTpm = rl.tpmLimit !== undefined;
  applyModal.value = {
    visible: true,
    serviceId: rl.serviceId,
    dimension: hasTpm ? 'TPM' : 'RPM',
    currentValue: hasTpm ? rl.tpmLimit! : rl.rpmLimit!,
    appliedValue: 0,
    reason: '',
    currentMain: rl.tpmLimit ?? rl.rpmLimit ?? 0,
    currentConcurrency: rl.concurrencyLimit,
    hasTpm,
    hasRpm: rl.rpmLimit !== undefined,
  };
}

function onApplyServiceChange(sid: string) {
  const rl = serviceRateLimits.find((r) => r.serviceId === sid);
  if (!rl) return;
  const hasTpm = rl.tpmLimit !== undefined;
  applyModal.value.dimension = hasTpm ? 'TPM' : 'RPM';
  applyModal.value.currentValue = hasTpm ? rl.tpmLimit! : (rl.rpmLimit ?? rl.concurrencyLimit)!;
  applyModal.value.currentMain = rl.tpmLimit ?? rl.rpmLimit ?? 0;
  applyModal.value.currentConcurrency = rl.concurrencyLimit;
  applyModal.value.hasTpm = hasTpm;
  applyModal.value.hasRpm = rl.rpmLimit !== undefined;
}

function confirmApply() {
  const m = applyModal.value;
  if (!m.serviceId || !m.appliedValue || !m.reason) {
    message.warning('请完整填写提额申请信息');
    return;
  }
  const rl = serviceRateLimits.find((r) => r.serviceId === m.serviceId);
  message.success(`已向平台提交「${rl?.serviceName ?? ''}」${m.dimension}提额申请，等待平台审核`);
  applyModal.value.visible = false;
}

// 申请记录抽屉
const appsDrawer = ref<{ visible: boolean; record: ServiceRateLimit | null }>({ visible: false, record: null });
function onViewApplications(rl: ServiceRateLimit) {
  appsDrawer.value = { visible: true, record: rl };
}

// 规则设置
const rulesModal = ref<{ visible: boolean; rules: IdleReclaimRule[] }>({ visible: false, rules: [] });
function onEditRules() {
  rulesModal.value = { visible: true, rules: idleReclaimRules.map((r) => ({ ...r })) };
}
function confirmRules() {
  rulesModal.value.rules.forEach((r) => {
    const idx = idleReclaimRules.findIndex((x) => x.id === r.id);
    if (idx >= 0) idleReclaimRules[idx] = { ...r };
  });
  message.success('闲置回收规则已更新');
  rulesModal.value.visible = false;
}
</script>
