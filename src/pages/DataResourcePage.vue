<template>
  <ResourcePageTemplate
    title="数据资源"
    description="对平台数据资源进行统一编目、查询和管理，纳入资产目录"
    :filters="dataResourceFilters"
    :cards="dataResourceCards"
    :hot-ranks="hotRanks"
    :latest-ranks="latestRanks"
    @create="createOpen = true"
  />
  <CreateAssetDialog
    v-model:open="createOpen"
    title="新增数据资源"
    :fields="createFields"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { dataResourceCards, dataResourceFilters } from '../data';
import ResourcePageTemplate from '../components/resource/ResourcePageTemplate.vue';
import CreateAssetDialog from '../components/resource/CreateAssetDialog.vue';

const hotRanks = [
  { name: '原发性肺癌主题数据资源', subtitle: '热度 50k' },
  { name: 'DRG/DIP 住院结算数据集', subtitle: '热度 33k' },
];
const latestRanks = [
  { name: '2 型糖尿病主题数据资源', subtitle: '07-22' },
  { name: '脑卒中主题数据资源', subtitle: '07-20' },
];

const createOpen = ref(false);

const createFields = [
  { label: '资源名称', key: 'name', type: 'input' as const, required: true, placeholder: '如：肺癌早筛参保人群数据集', full: true },
  { label: '提供单位', key: 'unit', type: 'input' as const, required: true, placeholder: '如：江苏省医保数据赋能实验室', full: true },
  { label: '数据大类', key: 'category', type: 'select' as const, required: true, options: ['临床主题', '医保业务', '知识规则', '健康数据'] },
  { label: '影像模态', key: 'imaging', type: 'select' as const, options: ['CT', 'DR', 'MRI', '超声', '病理', '眼底', '无影像数据'] },
  { label: '非影像模态', key: 'nonImaging', type: 'select' as const, options: ['结构化表单', '医保结算', '自由文本', '检验结果', '长时序数值'] },
  { label: '应用场景', key: 'scenario', type: 'select' as const, options: ['AI 模型训练', '临床科研', '医保控费', '病种筛查', 'DRG/DIP 分析'] },
  { label: '数据规模', key: 'scale', type: 'select' as const, options: ['十万级以下', '十万级', '百万级', '千万级', 'TB 级'] },
  { label: '覆盖周期', key: 'period', type: 'select' as const, options: ['近一年', '近三年', '近五年', '历史全量'] },
];

function onSubmit(_data: Record<string, string>) {
  // 实际项目这里调用 API，演示仅关闭弹窗
}
</script>
