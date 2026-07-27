<template>
  <section class="cloud-card p-[18px]">
    <div class="flex items-center justify-between mb-[16px]">
      <span class="text-[14px] font-semibold text-text-primary">{{ title }}</span>
      <span class="text-[12px] text-text-tertiary">按热度、试用转化、上线时间综合统计</span>
    </div>

    <div class="grid grid-cols-2 gap-[12px]">
      <!-- 热门排行 -->
      <div class="bg-gradient-to-br from-primary/5 to-primary/[0.02] rounded-[8px] p-[12px]">
        <div class="flex items-center gap-[6px] mb-[10px]">
          <span class="text-[13px] font-semibold text-text-primary">热门排行</span>
          <span class="px-[6px] py-[1px] rounded-[3px] bg-danger/10 text-danger text-[9px] font-bold">HOT</span>
        </div>
        <div class="space-y-[6px]">
          <div
            v-for="(item, idx) in hotItems"
            :key="item.id ?? item.name"
            class="flex items-center gap-[8px] p-[6px] rounded-[6px] transition-all duration-150 hover:bg-white/60"
            :class="clickable ? 'cursor-pointer' : ''"
            @click="clickable && emit('hot-click', item)"
          >
            <span class="w-[18px] h-[18px] rounded-[4px] grid place-items-center text-[10px] font-bold shrink-0" :class="idx < 3 ? 'bg-primary text-white' : 'bg-primary/10 text-primary'">{{ idx + 1 }}</span>
            <div class="flex-1 min-w-0">
              <div class="text-[12px] font-semibold text-text-primary truncate">{{ item.name }}</div>
            </div>
            <span class="font-num text-[12px] font-bold text-primary shrink-0">{{ item.value }}</span>
          </div>
        </div>
      </div>

      <!-- 最新上线 -->
      <div class="bg-gradient-to-br from-success/5 to-success/[0.02] rounded-[8px] p-[12px]">
        <div class="flex items-center gap-[6px] mb-[10px]">
          <span class="text-[13px] font-semibold text-text-primary">最新上线</span>
          <span class="px-[6px] py-[1px] rounded-[3px] bg-success/10 text-success text-[9px] font-bold">NEW</span>
        </div>
        <div class="space-y-[6px]">
          <div
            v-for="(item, idx) in latestItems"
            :key="item.id ?? item.name"
            class="flex items-center gap-[8px] p-[6px] rounded-[6px] transition-all duration-150 hover:bg-white/60"
            :class="clickable ? 'cursor-pointer' : ''"
            @click="clickable && emit('latest-click', item)"
          >
            <span class="w-[18px] h-[18px] rounded-[4px] grid place-items-center text-[10px] font-bold shrink-0" :class="idx < 3 ? 'bg-success text-white' : 'bg-success/10 text-success'">{{ idx + 1 }}</span>
            <div class="flex-1 min-w-0">
              <div class="text-[12px] font-semibold text-text-primary truncate">{{ item.name }}</div>
            </div>
            <span class="text-[11px] font-semibold text-text-secondary shrink-0">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface RankItem {
  id?: string;
  name: string;
  value: string;
}

withDefaults(
  defineProps<{
    title: string;
    hotItems: RankItem[];
    latestItems: RankItem[];
    clickable?: boolean;
  }>(),
  {
    clickable: false,
  },
);

const emit = defineEmits<{
  (e: 'hot-click', item: RankItem): void;
  (e: 'latest-click', item: RankItem): void;
}>();
</script>
