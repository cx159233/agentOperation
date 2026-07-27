<template>
  <div class="p-[20px] space-y-[14px]">
    <!-- 页面头 -->
    <PageHeader :title="title" :description="description" badge="资产中心" badge-color="processing">
      <template #actions>
        <a-button v-if="isAdmin" type="primary" @click="emit('create')">
          <template #icon><PlusOutlined /></template>
          新增{{ title }}
        </a-button>
      </template>
    </PageHeader>

    <!-- 榜单 -->
    <ResourceRanking
      :title="`${title}榜`"
      :hot-items="hotRanks.map((i) => ({ name: i.name, value: i.subtitle }))"
      :latest-items="latestRanks.map((i) => ({ name: i.name, value: i.subtitle }))"
    />

    <!-- 筛选 -->
    <FilterDimensions
      :filters="filters"
      :selected="selected"
      @select="(label, value) => (selected[label] = value)"
    />

    <!-- 筛选结果 -->
    <section class="cloud-card p-[18px]">
      <div class="flex items-center justify-between mb-[16px]">
        <div class="flex items-center gap-[8px]">
          <span class="text-[14px] font-semibold text-text-primary">筛选结果</span>
          <span class="text-[12px] text-text-tertiary">{{ totalCount }} 项</span>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-[12px]">
        <div v-for="[cat, cards] in categoryGroups" :key="cat" class="rounded-[4px] border border-border-soft p-[12px]">
          <div class="mb-[10px] flex items-center gap-[6px]">
            <span class="text-[14px] font-semibold text-text-primary">{{ cat }}</span>
            <span class="text-[12px] text-text-tertiary">{{ cards.length }} 项</span>
          </div>
          <div class="space-y-[8px]">
            <article v-for="card in cards" :key="card.id" class="rounded-[4px] border border-border-soft bg-surface p-[10px] hover:border-primary transition-colors cursor-pointer">
              <div class="flex items-start gap-[10px]">
                <div class="w-[32px] h-[32px] rounded-[4px] bg-primary/10 text-primary grid place-items-center shrink-0">
                  <component :is="iconComp(card.iconType)" class="text-[16px]" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-[14px] font-semibold text-text-primary truncate" :title="card.title">{{ card.title }}</div>
                  <div class="mt-[2px] text-[12px] text-text-tertiary truncate">{{ card.unit }}</div>
                </div>
              </div>
              <div class="mt-[8px] flex flex-wrap gap-[4px]">
                <span v-for="tag in card.tags.slice(1, 4)" :key="tag" class="px-[6px] h-[18px] inline-flex items-center rounded-[2px] bg-bg-soft text-[11px] text-text-secondary">{{ tag }}</span>
              </div>
              <div v-if="!isAdmin" class="mt-[8px] pt-[8px] border-t border-border-soft">
                <a-button type="link" size="small" class="!p-0 !h-[auto] !text-[12px]" @click.stop="onApplyAccess(card)">申请使用</a-button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  ExperimentOutlined,
  FileTextOutlined,
  ScanOutlined,
  EyeOutlined,
  RobotOutlined,
  MedicineBoxOutlined,
  CloudOutlined,
  BarChartOutlined,
  SafetyCertificateOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';
import type { FilterOption, ResourceCardData } from '../../types';
import PageHeader from '../../components/common/PageHeader.vue';
import FilterDimensions from '../../components/common/FilterDimensions.vue';
import ResourceRanking from '../../components/common/ResourceRanking.vue';
import { useAuthStore } from '../../stores/auth';
import { message } from 'ant-design-vue';

const auth = useAuthStore();
const isAdmin = computed(() => auth.role === 'admin');

const props = defineProps<{
  title: string;
  description: string;
  filters: FilterOption[];
  cards: ResourceCardData[];
  hotRanks: { name: string; subtitle: string }[];
  latestRanks: { name: string; subtitle: string }[];
}>();

const emit = defineEmits<{ (e: 'create'): void }>();

const iconMap: Record<string, any> = {
  brain: ExperimentOutlined,
  document: FileTextOutlined,
  lungs: ScanOutlined,
  eye: EyeOutlined,
  robot: RobotOutlined,
  stethoscope: MedicineBoxOutlined,
  cloud: CloudOutlined,
  scan: ScanOutlined,
  file: FileTextOutlined,
  assistant: RobotOutlined,
  'bar-chart': BarChartOutlined,
  'shield-check': SafetyCertificateOutlined,
};

function iconComp(t?: string) {
  return iconMap[t ?? 'document'] ?? FileTextOutlined;
}

const selected = ref<Record<string, string>>(
  Object.fromEntries(props.filters.map((f) => [f.label, f.defaultValue])),
);

const visibleCards = computed(() =>
  props.cards.filter((item) =>
    Object.values(selected.value).every((value) => {
      if (!value || value === '全部') return true;
      return item.tags.includes(value) || item.title.includes(value);
    }),
  ),
);

const categoryGroups = computed(() => {
  const map = new Map<string, ResourceCardData[]>();
  for (const card of visibleCards.value) {
    const cat = card.tags[0];
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(card);
  }
  return Array.from(map.entries());
});

const totalCount = computed(() => visibleCards.value.length);

function onApplyAccess(card: ResourceCardData) {
  message.success(`已提交「${card.title}」的使用申请，等待平台审批`);
}
</script>
