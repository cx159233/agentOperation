<template>
  <ResourcePageTemplate
    title="知识体系"
    description="汇聚医保政策、医学知识和业务规则，构建统一知识底座"
    :filters="knowledgeFilters"
    :cards="knowledgeCards"
    :hot-ranks="hotRanks"
    :latest-ranks="latestRanks"
    @create="createOpen = true"
  />
  <CreateAssetDialog
    v-model:open="createOpen"
    title="新增知识体系"
    :fields="createFields"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { knowledgeCards, knowledgeFilters } from '../data';
import ResourcePageTemplate from '../components/resource/ResourcePageTemplate.vue';
import CreateAssetDialog from '../components/resource/CreateAssetDialog.vue';

const hotRanks = [
  { name: '医保支付政策细则库', subtitle: '热度 88k' },
  { name: '平台运营管理规范', subtitle: '热度 76k' },
];
const latestRanks = [
  { name: '临床诊疗规范合集', subtitle: '07-21' },
  { name: '平台运营管理规范', subtitle: '07-19' },
];

const createOpen = ref(false);

const createFields = [
  { label: '知识名称', key: 'name', type: 'input' as const, required: true, placeholder: '如：医保支付政策细则库', full: true },
  { label: '提供单位', key: 'unit', type: 'input' as const, required: true, placeholder: '如：江苏省医保数据赋能实验室', full: true },
  { label: '政策法规类', key: 'policy', type: 'select' as const, options: ['医保支付政策', '医疗服务价格', '基金监管规则'] },
  { label: '医学知识类', key: 'medical', type: 'select' as const, options: ['术语编码标准', '临床诊疗规范'] },
  { label: '业务规则类', key: 'business', type: 'select' as const, options: ['医保经办规程', '平台运营规则'] },
  { label: '适用场景', key: 'scenario', type: 'textarea' as const, full: true, rows: 2, placeholder: '请描述该知识体系的典型适用场景' },
];

function onSubmit(_data: Record<string, string>) {
  // 实际项目这里调用 API
}
</script>
