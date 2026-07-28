<template>
  <div class="p-[20px]">
    <!-- 顶部 Hero -->
    <section class="rounded-[10px] bg-[#0B1120] text-white p-[24px] mb-[14px] relative overflow-hidden">
      <div class="absolute inset-0 opacity-[0.12] pointer-events-none">
        <div class="absolute -top-[40px] -right-[40px] w-[280px] h-[280px] rounded-full" style="background: radial-gradient(circle, #165DFF 0%, transparent 70%); filter: blur(40px);" />
      </div>
      <div class="absolute inset-0 opacity-[0.06] pointer-events-none" style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 56px 56px;" />
      <div class="relative flex items-start justify-between">
        <div class="flex-1">
          <div class="text-[22px] font-semibold tracking-[-0.4px]">模型广场</div>
          <div class="mt-[6px] text-[13px] text-white/70 max-w-[680px]">集中展示经统一评审准入后上架的 AI 模型与智能体，支撑合规 AI 服务规范上架、按需选购和统一词元计费</div>
          <div class="mt-[14px] flex items-center gap-[8px]">
            <span class="px-[10px] py-[3px] rounded-[4px] bg-white/10 border border-white/15 text-[11px] font-medium">能力分类管理</span>
            <span class="px-[10px] py-[3px] rounded-[4px] bg-white/10 border border-white/15 text-[11px] font-medium">三级差异化审核</span>
            <span class="px-[10px] py-[3px] rounded-[4px] bg-white/10 border border-white/15 text-[11px] font-medium">差异化词元计量</span>
          </div>
        </div>
        <div class="flex items-center gap-[24px] pl-[24px]">
          <div class="text-center">
            <div class="font-num text-[26px] font-bold leading-none">{{ totalCount }}</div>
            <div class="text-[11px] text-white/60 mt-[4px]">服务总数</div>
          </div>
          <div class="w-[1px] h-[36px] bg-white/15" />
          <div class="text-center">
            <div class="font-num text-[26px] font-bold leading-none">{{ onlineCount }}</div>
            <div class="text-[11px] text-white/60 mt-[4px]">已上线</div>
          </div>
          <div class="w-[1px] h-[36px] bg-white/15" />
          <div class="text-center">
            <div class="font-num text-[26px] font-bold leading-none">128</div>
            <div class="text-[11px] text-white/60 mt-[4px]">接入机构</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 榜单 -->
    <ResourceRanking
      title="模型 / 智能体榜"
      :hot-items="recommendationRanks.hot.map((i) => ({ id: i.id || '', name: i.name, value: i.heat }))"
      :latest-items="recommendationRanks.latest.map((i) => ({ id: i.id || '', name: i.name, value: i.date || '' }))"
      clickable
      class="mb-[14px]"
      @hot-click="(item) => item.id && goDetail(item.id)"
      @latest-click="(item) => item.id && goDetail(item.id)"
    />

    <!-- 左右布局：左侧筛选 + 右侧列表 -->
    <div class="flex gap-[14px]">
      <!-- 左侧筛选栏 -->
      <aside class="w-[320px] shrink-0">
        <section class="cloud-card p-[14px] sticky top-[20px]">
          <div>
            <!-- 模型分类总标题 -->
            <div class="flex items-center justify-between mb-[12px]">
              <div class="flex items-center gap-[4px]">
                <span class="text-[14px] font-semibold text-text-primary">模型分类</span>
                <span class="w-[18px] h-[18px] rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-medium">{{ filters.length }}</span>
              </div>
              <button class="w-[24px] h-[24px] rounded-[6px] hover:bg-bg-soft flex items-center justify-center transition-colors" @click="resetFilters">
                <ClearOutlined class="text-[14px] text-text-tertiary" />
              </button>
            </div>

            <!-- 各筛选子分类 -->
            <div class="space-y-[12px]">
              <div v-for="filter in filters" :key="filter.label">
                <div class="text-[12px] text-text-tertiary mb-[6px] font-medium">{{ filter.label }}</div>
                <div class="flex flex-wrap gap-[6px]">
                  <button
                    v-for="opt in filter.options"
                    :key="opt"
                    class="px-[10px] py-[4px] rounded-[4px] text-[12px] transition-colors"
                    :class="isActive(filter.label, opt) ? 'bg-primary text-white font-medium' : 'bg-bg-soft text-text-secondary hover:bg-bg-soft/80'"
                    @click="setFilter(filter.label, opt)"
                  >{{ opt }}</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </aside>

      <!-- 右侧列表 -->
      <main class="flex-1 min-w-0">
        <!-- 顶部统计 -->
        <div class="flex items-center gap-[6px] mb-[10px]">
          <div class="w-[2px] h-[16px] bg-primary rounded-full" />
          <span class="text-[13px] text-text-tertiary">共</span>
          <span class="font-num text-[20px] font-bold text-primary">{{ filteredItems.length }}</span>
          <span class="text-[13px] text-text-tertiary">个模型</span>
        </div>

        <!-- 服务列表 -->
        <div class="grid grid-cols-4 gap-[12px]">
          <ServiceCard v-for="item in filteredItems" :key="item.id" :item="item" @click="goDetail(item.id)" />
        </div>
        <a-empty v-if="filteredItems.length === 0" description="未找到匹配的服务，请调整筛选条件" class="py-[60px]" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { RightOutlined, ClearOutlined } from '@ant-design/icons-vue';
import { filters, capabilityGroups, recommendationRanks, serviceCategories } from '../data';
import type { CapabilityGroup, CapabilityCardData } from '../types';
import ServiceCard from '../components/capability/ServiceCard.vue';
import ResourceRanking from '../components/common/ResourceRanking.vue';

const route = useRoute();
const router = useRouter();

const keyword = computed(() => (route.query.keyword as string) ?? '');

const selected = ref<Record<string, string>>(
  Object.fromEntries(filters.map((f) => [f.label, f.defaultValue])),
);

watch(
  () => route.query.keyword,
  (kw) => {
    if (kw) selected.value['能力分类'] = '全部';
  },
);

function isActive(label: string, opt: string): boolean {
  return selected.value[label] === opt;
}

function setFilter(label: string, opt: string) {
  selected.value[label] = opt;
}

function resetFilters() {
  selected.value = Object.fromEntries(filters.map((f) => [f.label, f.defaultValue]));
}

function categoryColor(id: string) {
  return serviceCategories.find((c) => c.id === id)?.color ?? '#165DFF';
}

function groupItems(group: CapabilityGroup) {
  return group.columns.flatMap((c) => c.items);
}

function itemMatchesFilter(item: { title: string; tags: string[]; category: string; riskLevel?: string }, sel: Record<string, string>) {
  return Object.entries(sel).every(([label, value]) => {
    if (!value || value === '全部') return true;
    if (label === '风险等级') return item.riskLevel === value;
    if (label === '能力分类') return item.category === value;
    return item.tags.includes(value) || item.title.includes(value);
  });
}

function itemMatchesKeyword(item: { title: string; unit: string; tags: string[] }, kw: string) {
  if (!kw) return true;
  const target = [item.title, item.unit, ...item.tags].join(' ').toLowerCase().replace(/\s+/g, '');
  return kw
    .toLowerCase()
    .split(/[，,、\s]+/)
    .filter(Boolean)
    .every((word) => target.includes(word));
}

const allItems = computed(() => capabilityGroups.flatMap((g) => groupItems(g)));

const filteredItems = computed(() => {
  return allItems.value.filter((item) => {
    return itemMatchesFilter(item, selected.value) && itemMatchesKeyword(item, keyword.value);
  });
});

const totalCount = computed(() => capabilityGroups.reduce((sum, g) => sum + g.columns.reduce((s, c) => s + c.items.length, 0), 0));
const onlineCount = computed(() => capabilityGroups.reduce((sum, g) => sum + g.columns.reduce((s, c) => s + c.items.filter((i) => i.status === '已上线使用').length, 0), 0));

function goDetail(id: string) {
  router.push(`/org-workbench/model-plaza/${id}`);
}
</script>
