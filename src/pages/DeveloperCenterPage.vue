<template>
  <div class="p-[20px] space-y-[14px]">
    <PageHeader title="工作台" description="管理本开发者上架的 AI 服务，跟踪审核进度、版本迭代与收益结算">
    </PageHeader>

    <!-- 顶部:开发者信息 + 本月收益 + 今日调用 深蓝渐变卡片 -->
    <section class="rounded-[8px] overflow-hidden relative bg-gradient-to-br from-[#1a3060] via-[#15264a] to-[#0c1a33] shadow-[0_4px_16px_rgba(12,26,51,0.22)]">
      <!-- 装饰光晕 -->
      <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(circle at 90% 10%, rgba(96,165,250,0.14) 0%, transparent 45%), radial-gradient(circle at 6% 92%, rgba(96,165,250,0.08) 0%, transparent 40%);"></div>

      <div class="relative grid grid-cols-[1.6fr_1px_1fr_1px_1fr] items-center gap-0 py-[24px] px-[28px]">
        <!-- 左侧:开发者信息 -->
        <div class="pr-[24px]">
          <div class="text-[14px] text-white/60 mb-[6px]">你好</div>
          <div class="flex items-center gap-[8px]">
            <span class="text-[16px] font-medium text-white">{{ auth.userInfo?.name || '用户' }}</span>
            <span class="text-white/40">·</span>
            <span class="text-[14px] text-white/80 truncate">{{ auth.userInfo?.orgName || '智联AI科技有限公司' }}</span>
          </div>
          <div class="mt-[8px] flex items-center gap-[12px] text-[12px]">
            <span class="text-white/60">已上架 <span class="font-num font-semibold text-white">{{ listedCount }}</span> 项</span>
            <span class="w-[1px] h-[10px] bg-white/20"></span>
            <span class="text-white/60">审核中 <span class="font-num font-semibold text-white">{{ reviewingCount }}</span> 项</span>
          </div>
        </div>

        <!-- 分割线 -->
        <div class="w-[1px] h-[56px] bg-white/10 self-center"></div>

        <!-- 中间:本月收益分成 -->
        <div class="flex items-center gap-[16px] px-[24px]">
          <div class="relative w-[60px] h-[60px] shrink-0">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="24" stroke="rgba(255,255,255,0.12)" stroke-width="6" fill="none" />
              <circle
                cx="30"
                cy="30"
                r="24"
                stroke="#7eb6ff"
                stroke-width="6"
                fill="none"
                stroke-dasharray="150.8"
                :stroke-dashoffset="150.8 * (1 - 0.70)"
                stroke-linecap="round"
              />
            </svg>
            <div class="absolute inset-0 grid place-items-center">
              <span class="font-num text-[16px] font-semibold text-white">70%</span>
            </div>
          </div>
          <div class="min-w-0">
            <div class="text-[12px] text-white/60">本月收益分成</div>
            <div class="mt-[4px] text-[14px] text-white/90">已入账 ¥ {{ monthRevenueAmount.toLocaleString() }}</div>
          </div>
        </div>

        <!-- 分割线 -->
        <div class="w-[1px] h-[56px] bg-white/10 self-center"></div>

        <!-- 右侧:今日调用次数 -->
        <div class="pl-[24px]">
          <div class="text-[12px] text-white/60">今日调用次数</div>
          <div class="mt-[6px] flex items-baseline gap-[8px]">
            <span class="font-num text-[24px] font-semibold text-white leading-none">8,420</span>
            <span class="text-[12px] text-[#7dd3a0] font-medium">↑ 9.2%</span>
          </div>
          <div class="mt-[6px] text-[12px] text-white/50">较昨日 +708 次</div>
        </div>
      </div>
    </section>

    <!-- 服务调用排行 + 调用趋势 + 审核任务 -->
    <section class="grid grid-cols-[1.4fr_1fr] gap-[14px]">
      <div class="cloud-card p-[16px]">
        <div class="grid grid-cols-[1fr_1.2fr] gap-[20px]">
          <!-- 左侧:被调占比排行（开发者视角：哪些机构在调用我的服务） -->
          <div class="flex flex-col h-full">
            <div class="flex items-center gap-[8px] mb-[4px]">
              <div class="w-[3px] h-[14px] bg-primary rounded-full" />
              <span class="text-[14px] font-semibold text-text-primary">服务被调用占比排行</span>
            </div>
            <div class="text-[11px] text-text-tertiary mb-[14px]">本开发者服务被哪些机构调用（被动接调用）</div>
            <div class="flex-1 flex flex-col justify-center space-y-[16px]">
              <div v-for="(item, idx) in developerCallerRank" :key="idx" class="flex items-center gap-[10px]">
                <span class="text-[14px] font-num font-medium text-text-tertiary w-[20px] flex-shrink-0">{{ idx + 1 }}</span>
                <span class="text-[14px] text-text-primary w-[120px] flex-shrink-0 truncate">{{ item.name }}</span>
                <span class="text-[14px] font-num text-text-secondary w-[44px] flex-shrink-0 text-right">{{ item.percent }}%</span>
                <div class="flex-1 h-[20px] bg-bg-soft rounded-[2px] overflow-hidden">
                  <div class="h-full bg-primary rounded-[2px]" :style="{ width: `${item.percent}%` }"></div>
                </div>
                <span class="text-[12px] font-num text-text-tertiary w-[64px] flex-shrink-0 text-right">{{ item.value }}</span>
              </div>
            </div>
          </div>

          <!-- 右侧:近7日调用趋势 -->
          <div class="flex flex-col h-full">
            <div class="flex items-center justify-between mb-[12px]">
              <span class="text-[14px] font-semibold text-text-primary">近 7 日调用趋势</span>
              <div class="flex items-center gap-[12px] text-[12px] text-text-secondary">
                <span class="flex items-center gap-[4px]"><span class="w-[10px] h-[10px] rounded-full bg-primary"></span> 调用次数</span>
                <span class="flex items-center gap-[4px]"><span class="w-[10px] h-[10px] rounded-full bg-success"></span> 词元消耗</span>
              </div>
            </div>
            <div class="flex-1 min-h-[240px]">
              <CallTrendChart :data="developerCallTrend7d" />
            </div>
          </div>
        </div>
      </div>

      <!-- 高优任务与预警 -->
      <div class="cloud-card p-[16px]">
        <div class="flex items-center justify-between mb-[14px]">
          <div class="flex items-center gap-[8px]">
            <div class="w-[3px] h-[14px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">高优任务与预警</span>
          </div>
        </div>
        <div class="space-y-[8px]">
          <div
            v-for="(todo, idx) in highUrgentTodos"
            :key="idx"
            class="rounded-[4px] px-[12px] py-[10px] flex items-center justify-between gap-[8px]"
            :class="todo.level === 'high' ? 'bg-danger/10' : 'bg-warning/10'"
          >
            <div class="flex-1 flex items-center gap-[8px] min-w-0">
              <WarningOutlined
                class="shrink-0"
                :class="todo.level === 'high' ? 'text-danger' : 'text-warning'"
              />
              <span class="text-[14px] text-text-primary leading-[20px] truncate">{{ todo.message }}</span>
            </div>
            <a-button v-if="todo.action" type="link" size="small" class="!p-0 !h-[auto] !text-[12px]" @click="onTodoAction(todo)">{{ todo.action }}</a-button>
          </div>
        </div>
        <div class="mt-[12px] text-center">
          <router-link to="/developer-center/listing" class="text-[12px] text-primary">查看更多任务 -></router-link>
        </div>
      </div>
    </section>

    <!-- 已上架服务 -->
    <section class="cloud-card p-[16px]">
      <div class="flex items-center justify-between mb-[12px]">
        <div class="flex items-center gap-[8px]">
          <div class="w-[3px] h-[14px] bg-primary rounded-full" />
          <span class="text-[14px] font-semibold text-text-primary">已上架服务</span>
        </div>
        <router-link to="/developer-center/listing" class="text-[12px] text-primary">查看全部 -></router-link>
      </div>
      <a-table :columns="listedColumns" :data-source="listedData" :pagination="false" size="small">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'calls'">
            <span class="font-num text-[12px] text-text-secondary">{{ record.calls }}</span>
          </template>
          <template v-if="column.dataIndex === 'revenue'">
            <span class="font-num text-[12px] font-semibold text-text-primary">{{ record.revenue }}</span>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <a-tag v-if="record.status === '已上架'" color="success" class="!m-0">已上架</a-tag>
            <a-tag v-else-if="record.status === '已下架'" color="default" class="!m-0">已下架</a-tag>
            <a-tag v-else color="warning" class="!m-0">{{ record.status }}</a-tag>
          </template>
        </template>
      </a-table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { PlusOutlined, WarningOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '../stores/auth';
import { developerServices, developerCallTrend7d, developerCallerRank, developerTodos, type DeveloperTodo } from '../data/developerCenter';
import CallTrendChart from '../components/org/CallTrendChart.vue';
import PageHeader from '../components/common/PageHeader.vue';

const auth = useAuthStore();
const router = useRouter();

const listedCount = computed(() => developerServices.filter((s) => s.status === '已上架').length);
const reviewingCount = computed(() => developerServices.filter((s) => s.status === '审核中').length);

const monthRevenueAmount = computed(() => {
  return developerServices
    .filter((s) => s.revenue && s.revenue !== '-')
    .reduce((sum, s) => sum + Number(s.revenue!.replace(/[^\d.]/g, '')), 0);
});

const highUrgentTodos = computed(() => {
  return developerTodos.filter((t) => t.level === 'high' || t.level === 'medium').slice(0, 4);
});

const listedColumns = [
  { title: '服务名称', dataIndex: 'name', key: 'name', width: 240 },
  { title: '分类', dataIndex: 'category', key: 'category', width: 200 },
  { title: '计费方式', dataIndex: 'billingMethod', key: 'billingMethod', width: 120 },
  { title: '版本', dataIndex: 'version', key: 'version', width: 100 },
  { title: '调用次数', dataIndex: 'calls', key: 'calls', width: 120 },
  { title: '累计收益', dataIndex: 'revenue', key: 'revenue', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
];

const listedData = computed(() =>
  developerServices
    .filter((s) => s.status === '已上架' || s.status === '已下架')
    .map((s) => ({ key: s.id, ...s })),
);

function onTodoAction(todo: DeveloperTodo) {
  if (todo.type === '审核进度' || todo.type === '草稿提醒' || todo.type === '版本迭代') {
    router.push('/developer-center/listing');
    return;
  }
  if (todo.type === '账单待确认') {
    router.push('/developer-center/revenue');
    return;
  }
  message.info(`「${todo.message}」请在左侧菜单查找对应功能处理`);
}
</script>
