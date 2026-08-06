<template>
  <div class="p-[20px]">
    <PageHeader title="词元计费配置" description="词元计费规则、额度管控配置、词元包管理" />

    <!-- 衔接提示（计费与对账前后衔接） -->
    <a-alert type="info" show-icon class="!mb-[14px] !rounded-[8px]">
      <template #message>
        <span class="text-[12px]">
          <strong>词元计费闭环：</strong>
          <a-tag color="processing" class="!m-0 !ml-[4px]">计费管理（调用前）</a-tag>
          计费规则制定 -> 额度管控配置 -> 词元包管理
          <ArrowRightOutlined class="mx-[6px] text-text-tertiary" />
          <a-tag color="success" class="!m-0">对账查询（调用后）</a-tag>
          调用明细核验 -> 周期账单确认 -> 异常处置闭环
        </span>
      </template>
    </a-alert>

    <!-- Tab -->
    <a-tabs v-model:activeKey="activeTab" class="!mb-[14px]">
      <a-tab-pane key="计费规则配置" tab="计费规则配置" />
      <a-tab-pane key="额度管控配置" tab="额度管控配置" />
      <a-tab-pane key="词元包管理" tab="词元包管理" />
    </a-tabs>

    <!-- 计费规则配置 -->
    <template v-if="activeTab === '计费规则配置'">
      <div class="cloud-card p-[20px]">
        <div class="flex items-center justify-between mb-[16px]">
          <div>
            <div class="text-[15px] font-semibold text-text-primary">差异化计费规则配置</div>
            <div class="text-[12px] text-text-secondary mt-[4px]">按服务类型和应用主体实行差异化管理，三方面形成闭环</div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-[14px]">
          <div v-for="(rule, idx) in billingRules" :key="rule.dimension" class="rounded-[8px] border border-primary/20 bg-primary/5 p-[16px]">
            <div class="flex items-center gap-[8px] mb-[8px]">
              <span class="w-[24px] h-[24px] grid place-items-center rounded-full text-[12px] font-semibold text-white bg-primary">{{ idx + 1 }}</span>
              <span class="text-[14px] font-semibold text-text-primary">{{ rule.dimension }}</span>
            </div>
            <p class="text-[12px] text-text-secondary leading-[18px] h-[36px]">{{ rule.description }}</p>
            <div class="mt-[12px] space-y-[6px]">
              <div v-for="ex in rule.examples" :key="ex" class="flex items-center gap-[6px] text-[12px] text-text-primary">
                <CheckCircleOutlined class="text-[12px] text-primary" />
                <span>{{ ex }}</span>
              </div>
            </div>
          </div>
        </div>

        <a-divider />

        <div class="text-[13px] font-semibold text-text-primary mb-[10px]">计费规则展示</div>
        <a-table :columns="ruleColumns" :data-source="ruleTableData" :pagination="false" size="middle" />
      </div>
    </template>

    <!-- 额度管控配置 -->
    <template v-else-if="activeTab === '额度管控配置'">
      <div class="grid grid-cols-[1fr] gap-[14px]">
        <div class="cloud-card p-[16px]">
          <div class="text-[14px] font-semibold text-text-primary mb-[12px]">额度管控策略</div>
          <div class="space-y-[12px] max-w-[500px]">
            <div class="rounded-[6px] bg-bg-soft p-[12px] text-[13px] text-text-primary">
              <div class="mb-[8px] font-semibold">预警通知</div>
              <a-checkbox v-model:checked="notice.inbox" class="mr-[16px]">站内信</a-checkbox>
              <a-checkbox v-model:checked="notice.sms">短信</a-checkbox>
            </div>
            <div class="rounded-[6px] bg-bg-soft p-[12px] text-[13px] text-text-primary">
              <div class="mb-[8px] font-semibold">熔断机制</div>
              <a-select v-model:value="circuitMode" size="large" class="w-full" :options="[{label: '超额自动熔断', value: '超额自动熔断'}, {label: '超额按量计费', value: '超额按量计费'}]" />
            </div>
            <a-button type="primary" block size="large" @click="message.success('管控策略已保存')">保存管控策略</a-button>
          </div>
        </div>
      </div>
    </template>

    <!-- 词元包管理 -->
    <template v-else-if="activeTab === '词元包管理'">
      <div class="space-y-[14px]">
        <!-- 词元包规格管理 -->
        <div class="cloud-card p-[16px]">
          <div class="flex items-center justify-between mb-[16px]">
            <div>
              <div class="text-[14px] font-semibold text-text-primary">词元包规格管理</div>
              <div class="text-[12px] text-text-secondary mt-[4px]">维护各档次词元包定价、折扣与适用范围</div>
            </div>
            <a-button type="primary">
              <template #icon><PlusOutlined /></template>
              新增词元包
            </a-button>
          </div>
          <div class="grid grid-cols-4 gap-[12px]">
            <div
              v-for="pkg in tokenPackages"
              :key="pkg.name"
              class="rounded-[8px] border bg-white p-[14px] transition-all hover:shadow-[0_2px_8px_rgba(22,93,255,0.08)] relative overflow-hidden"
              :class="pkg.featured ? 'border-primary' : 'border-border'"
            >
              <!-- 推荐标识 -->
              <div v-if="pkg.featured" class="absolute top-0 right-0 bg-primary text-white text-[10px] font-medium px-[8px] py-[2px] rounded-bl-[6px]">推荐</div>

              <!-- 头部:包名 -->
              <div class="flex items-center gap-[6px] mb-[12px]">
                <div
                  class="w-[24px] h-[24px] grid place-items-center rounded-[6px]"
                  :class="pkg.featured ? 'bg-primary/10' : 'bg-bg-soft'"
                >
                  <WalletOutlined class="text-[14px]" :class="pkg.featured ? 'text-primary' : 'text-text-secondary'" />
                </div>
                <span class="text-[14px] font-semibold text-text-primary">{{ pkg.name }}</span>
              </div>

              <!-- 价格(主信息) -->
              <div class="mb-[6px]">
                <span class="font-num text-[22px] font-bold text-text-primary leading-none">{{ pkg.price }}</span>
              </div>

              <!-- 词元数量 + 折扣 -->
              <div class="flex items-center gap-[6px] mb-[12px]">
                <span class="text-[12px] text-text-secondary">{{ pkg.amount }}</span>
                <span class="text-[10px] text-text-tertiary">·</span>
                <span class="text-[11px] text-warning font-medium">{{ pkg.discount }}</span>
              </div>

              <!-- 适用范围 -->
              <div class="rounded-[4px] bg-bg-soft px-[8px] py-[6px] mb-[10px]">
                <div class="text-[10px] text-text-tertiary mb-[2px]">适用范围</div>
                <div class="text-[11px] text-text-secondary leading-[15px]">{{ pkg.scope }}</div>
              </div>

              <!-- 操作 -->
              <div class="flex gap-[6px]">
                <a-button size="small" block @click="onEditPackage(pkg)">编辑</a-button>
                <a-button size="small" danger block @click="onDeletePackage(pkg)">删除</a-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 机构购买记录 -->
        <div class="cloud-card p-[0] overflow-hidden">
          <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onPurchaseSearch" @reset="onPurchaseReset">
            <template #actions>
              <a-button @click="onExportPurchase">
                <template #icon><DownloadOutlined /></template>
                导出
              </a-button>
            </template>
            <a-input v-model:value="purchaseFilter.orgName" style="width: 220px" placeholder="搜索机构名称" allow-clear @keyup.enter="onPurchaseSearch" />
            <a-select v-model:value="purchaseFilter.packageName" style="width: 160px" placeholder="词元包" allow-clear>
              <a-select-option v-for="pkg in tokenPackages" :key="pkg.name" :value="pkg.name">{{ pkg.name }}</a-select-option>
            </a-select>
            <a-select v-model:value="purchaseFilter.status" style="width: 140px" placeholder="状态" allow-clear>
              <a-select-option value="正常">正常</a-select-option>
              <a-select-option value="即将到期">即将到期</a-select-option>
              <a-select-option value="额度紧张">额度紧张</a-select-option>
            </a-select>
            <template #suffix>
              <ColumnSettings v-model="purchaseHiddenKeys" :columns="purchaseColumns" />
            </template>
          </FilterBar>
          <div class="border-t border-[#e8e8e8] mx-[16px]"></div>

          <div class="px-[16px] py-[16px]">
            <a-table
              :columns="visiblePurchaseColumns"
              :data-source="filteredPurchaseRecords"
              :pagination="{ pageSize: 5, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }"
              size="middle"
              row-key="key"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <a-badge :status="purchaseStatusBadge(record.status)" :text="record.status" />
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-button type="link" size="small" class="!p-0" @click="onViewPurchase(record)">查看</a-button>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  WalletOutlined,
  DownloadOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import {
  billingRules,
  tokenPackages,
  purchaseRecords,
} from '../data';
import PageHeader from '../components/common/PageHeader.vue';
import FilterBar from '../components/common/FilterBar.vue';
import ColumnSettings from '../components/common/ColumnSettings.vue';

const activeTab = ref('计费规则配置');
const notice = ref({ inbox: true, sms: true });
const circuitMode = ref('超额自动熔断');

// ============== 计费规则展示 ==============
const ruleColumns = [
  { title: '服务类别', dataIndex: 'category', key: 'category' },
  { title: '计量口径', dataIndex: 'method', key: 'method' },
  { title: '付费方式', dataIndex: 'payment', key: 'payment' },
  { title: '示例', dataIndex: 'example', key: 'example' },
];

const ruleTableData = [
  { key: '1', category: '通用基础大模型', method: '按Token', payment: '套餐预购 / 财政统购', example: 'Deepseek V4 调用 1k Token' },
  { key: '2', category: '医保自研专属大模型', method: '按Token', payment: '专项经费', example: '山海知医5.0 调用 1k Token' },
  { key: '3', category: '医保基金监管共建模型', method: '按调用次数', payment: '医保补贴', example: '高值耗材比对 1 次' },
  { key: '4', category: '省头部医疗机构共建垂直模型', method: '按检查例次', payment: '医保结算分润', example: '肺结节CT筛查 1 例次' },
  { key: '5', category: '市场化合规生态AI产品', method: '按Token / 按调用次数', payment: '机构自付', example: '电子病历生成 1 次' },
];

// ============== 词元包管理 ==============
function onEditPackage(pkg: { name: string }) {
  message.success(`词元包「${pkg.name}」编辑页已打开`);
}
function onDeletePackage(pkg: { name: string }) {
  message.warning(`词元包「${pkg.name}」已删除`);
}

function onViewPurchase(record: any) {
  message.success(`已查看「${record.orgName}」的购买详情`);
}

// ============== 机构购买记录 ==============
const purchaseFilter = ref({ orgName: '', packageName: undefined as string | undefined, status: undefined as string | undefined });
const purchaseHiddenKeys = ref<string[]>([]);

const purchaseColumns = [
  { title: '机构名称', dataIndex: 'orgName', key: 'orgName' },
  { title: '词元包', dataIndex: 'packageName', key: 'packageName' },
  { title: '购买时间', dataIndex: 'buyTime', key: 'buyTime' },
  { title: '价格', dataIndex: 'price', key: 'price' },
  { title: '剩余词元', dataIndex: 'remaining', key: 'remaining' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action', width: 80 },
];

const visiblePurchaseColumns = computed(() => purchaseColumns.filter((c) => !purchaseHiddenKeys.value.includes(c.key)));

const filteredPurchaseRecords = computed(() => {
  return purchaseRecords
    .filter((item) => {
      if (purchaseFilter.value.orgName && !item.orgName.includes(purchaseFilter.value.orgName)) return false;
      if (purchaseFilter.value.packageName && item.packageName !== purchaseFilter.value.packageName) return false;
      if (purchaseFilter.value.status && item.status !== purchaseFilter.value.status) return false;
      return true;
    })
    .map((item, idx) => ({ key: `${idx}`, ...item }));
});

function onPurchaseSearch() {
  // filteredPurchaseRecords 响应式计算
}
function onPurchaseReset() {
  purchaseFilter.value = { orgName: '', packageName: undefined, status: undefined };
}

function purchaseStatusBadge(status: string): 'success' | 'warning' | 'error' {
  if (status === '正常') return 'success';
  if (status === '即将到期') return 'warning';
  return 'error';
}

function onExportPurchase() {
  message.success('机构购买记录导出请求已提交');
}
</script>
