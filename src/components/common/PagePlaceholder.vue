<template>
  <div class="p-[24px]">
    <section class="cloud-card p-[28px]">
      <div class="flex items-start gap-[18px]">
        <div class="w-[64px] h-[64px] rounded-[12px] grid place-items-center shrink-0" :style="{ background: toneBg, color: toneColor }">
          <component :is="icon" class="text-[32px]" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-[10px] mb-[6px]">
            <h1 class="text-[20px] font-semibold text-text-primary">{{ title }}</h1>
            <a-tag v-if="badge" :color="badgeColor" class="!m-0">{{ badge }}</a-tag>
          </div>
          <p class="text-[13px] text-text-secondary leading-[22px]">{{ description }}</p>
        </div>
      </div>

      <a-divider class="!my-[18px]" />

      <div class="grid grid-cols-3 gap-[14px]">
        <div v-for="card in moduleCards" :key="card.title" class="rounded-[8px] border border-border-soft bg-bg-soft p-[14px] hover:border-primary-light hover:shadow-card transition">
          <div class="flex items-center gap-[8px] mb-[8px]">
            <span class="w-[6px] h-[6px] rounded-full" :style="{ background: toneColor }" />
            <span class="text-[14px] font-semibold text-text-primary">{{ card.title }}</span>
          </div>
          <p class="text-[12px] text-text-secondary leading-[18px]">{{ card.description }}</p>
          <div v-if="card.items?.length" class="mt-[10px] space-y-[4px]">
            <div v-for="item in card.items" :key="item" class="rounded-[4px] px-[8px] py-[4px] text-[11px] font-semibold text-text-primary" :style="{ background: toneColor + '10' }">
              {{ item }}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-[18px] flex items-center justify-between p-[14px] rounded-[8px] bg-bg-soft border border-border-soft">
        <div class="flex items-center gap-[10px]">
          <InfoCircleOutlined class="text-[16px] text-primary" />
          <span class="text-[13px] text-text-primary">本页面演示内容正在建设中，可参考 PRD 文档第 3 章对应模块。</span>
        </div>
        <a-button type="primary" ghost size="small" @click="onFeedback">需求反馈</a-button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import type { Component } from 'vue';

defineProps<{
  title: string;
  description: string;
  icon: Component;
  badge?: string;
  badgeColor?: 'primary' | 'success' | 'warning' | 'error' | 'processing';
  toneColor?: string;
  toneBg?: string;
  moduleCards: { title: string; description: string; items?: string[] }[];
}>();

function onFeedback() {
  message.success('感谢反馈，您的需求已记录');
}
</script>
