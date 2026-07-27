<template>
  <ResourcePageTemplate
    title="平台工具"
    description="覆盖数据治理、模型研发、能力扩展、智能体搭建、测试评估与部署运维全流程"
    :filters="toolFilters"
    :cards="toolCards"
    :hot-ranks="hotRanks"
    :latest-ranks="latestRanks"
    @create="createOpen = true"
  />
  <CreateAssetDialog
    v-model:open="createOpen"
    title="新增平台工具"
    :fields="createFields"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { toolCards, toolFilters } from '../data';
import ResourcePageTemplate from '../components/resource/ResourcePageTemplate.vue';
import CreateAssetDialog from '../components/resource/CreateAssetDialog.vue';

const hotRanks = [
  { name: 'MCP 协议连接器', subtitle: '热度 108k' },
  { name: '专项技能包（Skills）', subtitle: '热度 90k' },
];
const latestRanks = [
  { name: '模型效果评估工具', subtitle: '07-22' },
  { name: '模型一键部署工具', subtitle: '07-18' },
];

const createOpen = ref(false);

const createFields = [
  { label: '工具名称', key: 'name', type: 'input' as const, required: true, placeholder: '如：医学影像脱敏工具', full: true },
  { label: '提供单位', key: 'unit', type: 'input' as const, required: true, placeholder: '如：江苏省医保数据赋能实验室', full: true },
  { label: '数据治理工具', key: 'governance', type: 'select' as const, options: ['医学影像脱敏工具', '病历文本清洗工具', '数据标注工具', '数据标准化工具'] },
  { label: '模型研发工具', key: 'research', type: 'select' as const, options: ['大模型轻量化微调框架', '算力调度工具', '模型压缩工具', '联邦学习训练工具'] },
  { label: '能力扩展工具', key: 'extension', type: 'select' as const, options: ['MCP 协议连接器', '专项技能包（Skills）', '通用 AI 原子工具'] },
  { label: '智能体搭建工具', key: 'agent', type: 'select' as const, options: ['可视化工作流编排器', '多智能体调度引擎', '医保场景 Prompt 模板库', '业务规则引擎'] },
  { label: '测试评估工具', key: 'testing', type: 'select' as const, options: ['模型效果评估', '医疗合规检测', '安全风险扫描', '并发压力测试'] },
  { label: '部署运维工具', key: 'deploy', type: 'select' as const, options: ['模型一键部署', '边缘节点下沉', '运行监控', '调用日志审计'] },
];

function onSubmit(_data: Record<string, string>) {
  // 实际项目这里调用 API
}
</script>
