<template>
  <div class="p-[20px]">
    <PageHeader title="字典管理" description="维护平台字段分类与字典编码，字段分类下可下钻维护具体的字段编码（英文字段名）" />

    <div class="cloud-card p-[0] overflow-hidden">
      <div class="grid grid-cols-[260px_1fr] min-h-[560px]">
        <!-- 左侧：字段分类 -->
        <div class="border-r border-border-soft flex flex-col">
          <div class="px-[16px] py-[14px] flex items-center justify-between border-b border-border-soft">
            <div>
              <div class="text-[14px] font-semibold text-text-primary">字段分类</div>
              <div class="text-[11px] text-text-tertiary mt-[2px]">共 {{ categories.length }} 个分类</div>
            </div>
            <a-button type="primary" size="small" @click="onAddCategory">
              <template #icon><PlusOutlined /></template>
              新增分类
            </a-button>
          </div>
          <div class="flex-1 overflow-y-auto py-[8px]">
            <div
              v-for="cat in categories"
              :key="cat.key"
              class="group mx-[8px] mb-[2px] px-[12px] py-[10px] rounded-[6px] cursor-pointer transition-colors"
              :class="activeCategoryKey === cat.key ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-bg-soft hover:text-primary'"
              @click="activeCategoryKey = cat.key"
            >
              <div class="flex items-center justify-between">
                <span class="text-[13px] font-medium">{{ cat.name }}</span>
                <div class="flex items-center gap-[6px]">
                  <span class="text-[11px] font-num" :class="activeCategoryKey === cat.key ? 'text-primary/70' : 'text-text-tertiary'">{{ cat.codes.length }}</span>
                  <a-tooltip title="编辑分类">
                    <EditOutlined class="text-[12px] opacity-0 group-hover:opacity-100 transition-opacity" :class="activeCategoryKey === cat.key ? 'text-primary' : 'text-text-tertiary hover:text-primary'" @click.stop="onEditCategory(cat)" />
                  </a-tooltip>
                </div>
              </div>
              <div class="text-[11px] mt-[2px] font-mono" :class="activeCategoryKey === cat.key ? 'text-primary/60' : 'text-text-tertiary'">{{ cat.key }}</div>
            </div>
          </div>
        </div>

        <!-- 右侧：字段编码列表 -->
        <div class="flex flex-col">
          <template v-if="activeCategory">
            <div class="px-[20px] py-[14px] border-b border-border-soft flex items-center justify-between">
              <div>
                <div class="flex items-center gap-[8px]">
                  <span class="text-[15px] font-semibold text-text-primary">{{ activeCategory.name }}</span>
                  <span class="text-[11px] font-mono text-text-tertiary px-[6px] py-[2px] rounded-[4px] bg-bg-soft">{{ activeCategory.key }}</span>
                </div>
                <div class="text-[11px] text-text-tertiary mt-[4px]">{{ activeCategory.description }}</div>
              </div>
              <a-space>
                <a-button type="primary" @click="onAddCode">
                  <template #icon><PlusOutlined /></template>
                  新增字段编码
                </a-button>
              </a-space>
            </div>

            <div class="flex-1 px-[20px] py-[16px]">
              <a-table :columns="codeColumns" :data-source="activeCategory.codes" :pagination="false" size="middle" row-key="code">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.dataIndex === 'code'">
                    <span class="font-mono text-[12px] text-text-primary">{{ record.code }}</span>
                  </template>
                  <template v-else-if="column.dataIndex === 'enabled'">
                    <a-switch v-model:checked="record.enabled" size="small" />
                  </template>
                  <template v-else-if="column.dataIndex === 'action'">
                    <a-space size="small">
                      <a class="text-primary text-[12px]" @click="onEditCode(record)">编辑</a>
                      <a-popconfirm title="确认删除该字段编码？" @confirm="onDeleteCode(record)">
                        <a class="text-danger text-[12px]">删除</a>
                      </a-popconfirm>
                    </a-space>
                  </template>
                </template>
              </a-table>
            </div>
          </template>
          <div v-else class="flex-1 grid place-items-center text-text-tertiary text-[13px]">请选择左侧的字段分类</div>
        </div>
      </div>
    </div>

    <!-- 字段分类新增/编辑弹窗 -->
    <a-modal v-model:open="categoryModal.visible" :title="categoryModal.mode === 'create' ? '新增字段分类' : `编辑字段分类 - ${categoryModal.originalKey}`" @ok="confirmCategory" :ok-text="categoryModal.mode === 'create' ? '新增' : '保存'" cancel-text="取消">
      <a-form layout="vertical">
        <a-form-item label="分类编码（英文字段名）" required>
          <a-input v-model:value="categoryModal.key" :disabled="categoryModal.mode === 'edit'" placeholder="如：risk_level" />
        </a-form-item>
        <a-form-item label="分类名称" required>
          <a-input v-model:value="categoryModal.name" placeholder="如：风险等级" />
        </a-form-item>
        <a-form-item label="分类描述">
          <a-textarea v-model:value="categoryModal.description" :rows="2" placeholder="该分类的用途说明" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 字段编码新增/编辑弹窗 -->
    <a-modal v-model:open="codeModal.visible" :title="codeModal.mode === 'create' ? `新增字段编码 - ${codeModal.categoryName}` : `编辑字段编码 - ${codeModal.categoryName}`" @ok="confirmCode" :ok-text="codeModal.mode === 'create' ? '新增' : '保存'" cancel-text="取消">
      <a-form layout="vertical">
        <div class="grid grid-cols-2 gap-[12px]">
          <a-form-item label="字段编码（英文字段名）" required>
            <a-input v-model:value="codeModal.code" :disabled="codeModal.mode === 'edit'" placeholder="如：high_risk" />
          </a-form-item>
          <a-form-item label="显示名称" required>
            <a-input v-model:value="codeModal.label" placeholder="如：高风险" />
          </a-form-item>
        </div>
        <a-form-item label="排序">
          <a-input-number v-model:value="codeModal.sort" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item label="字段描述">
          <a-textarea v-model:value="codeModal.description" :rows="2" placeholder="该字段编码的含义与适用场景" />
        </a-form-item>
        <a-form-item label="启用">
          <a-switch v-model:checked="codeModal.enabled" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined, EditOutlined } from '@ant-design/icons-vue';
import PageHeader from '../components/common/PageHeader.vue';

type DictCode = {
  code: string;
  label: string;
  sort: number;
  enabled: boolean;
  description?: string;
};

type DictCategory = {
  key: string;
  name: string;
  description: string;
  codes: DictCode[];
};

const categories = ref<DictCategory[]>([
  {
    key: 'service_category',
    name: '模型能力分类',
    description: '按建设主体与合规要求将 AI 模型划分为五类',
    codes: [
      { code: 'general_basic_llm', label: '通用基础大模型', sort: 1, enabled: true, description: '通用对话/嵌入/重排等基础模型，按Token计量' },
      { code: 'medicare_self_research', label: '医保自研专属大模型', sort: 2, enabled: true, description: '医保场景定制训练的自研模型' },
      { code: 'medicare_fund_governance', label: '医保基金监管共建模型', sort: 3, enabled: true, description: '面向基金监管/合规审查场景的共建模型' },
      { code: 'hospital_vertical', label: '省头部医疗机构共建垂直模型', sort: 4, enabled: true, description: '医院共建的专科/病种垂直模型' },
      { code: 'market_compliance_ecology', label: '市场化合规生态AI产品', sort: 5, enabled: true, description: '市场化合规AI产品，备案即可上架' },
    ],
  },
  {
    key: 'billing_method',
    name: '计费方式',
    description: 'AI 服务的计量与计费口径',
    codes: [
      { code: 'by_token', label: '按Token', sort: 1, enabled: true, description: '按词元消耗计量' },
      { code: 'by_case', label: '按检查例次', sort: 2, enabled: true, description: '按影像/检查例次计量' },
      { code: 'by_call', label: '按调用次数', sort: 3, enabled: true, description: '按智能体调用次数计量' },
    ],
  },
  {
    key: 'risk_level',
    name: '风险等级',
    description: '按风险等级执行差异化审核流程',
    codes: [
      { code: 'high_risk', label: '高风险', sort: 1, enabled: true, description: '执行资质核验、技术测评、临床验收全流程' },
      { code: 'medium_risk', label: '中风险', sort: 2, enabled: true, description: '简化技术测试环节' },
      { code: 'low_risk', label: '低风险', sort: 3, enabled: true, description: '仅完成备案即可上架' },
    ],
  },
  {
    key: 'service_status',
    name: '服务状态',
    description: 'AI 服务在全生命周期中的当前状态',
    codes: [
      { code: 'online', label: '已上线使用', sort: 1, enabled: true },
      { code: 'onboarding', label: '对接上线中', sort: 2, enabled: true },
      { code: 'testing', label: '对接测试中', sort: 3, enabled: true },
      { code: 'offline', label: '已下架', sort: 4, enabled: true },
    ],
  },
  {
    key: 'asset_type',
    name: '资产类型',
    description: '资产台账中纳入管理的资源类型',
    codes: [
      { code: 'model', label: '模型', sort: 1, enabled: true },
      { code: 'data', label: '数据', sort: 2, enabled: true },
      { code: 'knowledge', label: '知识', sort: 3, enabled: true },
      { code: 'tool', label: '工具', sort: 4, enabled: true },
    ],
  },
]);

const activeCategoryKey = ref(categories.value[0]?.key ?? '');

const activeCategory = computed(() => categories.value.find((c) => c.key === activeCategoryKey.value) ?? null);

const codeColumns = [
  { title: '字段编码', dataIndex: 'code', key: 'code', width: 240 },
  { title: '显示名称', dataIndex: 'label', key: 'label', width: 200 },
  { title: '字段描述', dataIndex: 'description', key: 'description' },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
  { title: '启用', dataIndex: 'enabled', key: 'enabled', width: 80 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 120 },
];

// ============== 字段分类弹窗 ==============
const categoryModal = ref<{ visible: boolean; mode: 'create' | 'edit'; key: string; name: string; description: string; originalKey: string }>({
  visible: false,
  mode: 'create',
  key: '',
  name: '',
  description: '',
  originalKey: '',
});

function onAddCategory() {
  categoryModal.value = { visible: true, mode: 'create', key: '', name: '', description: '', originalKey: '' };
}

function onEditCategory(cat: DictCategory) {
  categoryModal.value = { visible: true, mode: 'edit', key: cat.key, name: cat.name, description: cat.description, originalKey: cat.key };
}

function confirmCategory() {
  const m = categoryModal.value;
  if (!m.key || !m.name) {
    message.warning('请填写分类编码与分类名称');
    return;
  }
  if (!/^[a-z][a-z0-9_]*$/.test(m.key)) {
    message.warning('分类编码需为英文字段名（小写字母开头，仅含字母/数字/下划线）');
    return;
  }
  if (m.mode === 'create') {
    if (categories.value.some((c) => c.key === m.key)) {
      message.warning('分类编码已存在');
      return;
    }
    categories.value.push({ key: m.key, name: m.name, description: m.description, codes: [] });
    activeCategoryKey.value = m.key;
    message.success('字段分类已新增');
  } else {
    const target = categories.value.find((c) => c.key === m.originalKey);
    if (target) {
      target.name = m.name;
      target.description = m.description;
    }
    message.success('字段分类已保存');
  }
  categoryModal.value.visible = false;
}

// ============== 字段编码弹窗 ==============
const codeModal = ref<{ visible: boolean; mode: 'create' | 'edit'; categoryKey: string; categoryName: string; code: string; label: string; sort: number; enabled: boolean; description: string; originalCode: string }>({
  visible: false,
  mode: 'create',
  categoryKey: '',
  categoryName: '',
  code: '',
  label: '',
  sort: 99,
  enabled: true,
  description: '',
  originalCode: '',
});

function onAddCode() {
  if (!activeCategory.value) return;
  codeModal.value = {
    visible: true,
    mode: 'create',
    categoryKey: activeCategory.value.key,
    categoryName: activeCategory.value.name,
    code: '',
    label: '',
    sort: activeCategory.value.codes.length + 1,
    enabled: true,
    description: '',
    originalCode: '',
  };
}

function onEditCode(record: DictCode) {
  if (!activeCategory.value) return;
  codeModal.value = {
    visible: true,
    mode: 'edit',
    categoryKey: activeCategory.value.key,
    categoryName: activeCategory.value.name,
    code: record.code,
    label: record.label,
    sort: record.sort,
    enabled: record.enabled,
    description: record.description ?? '',
    originalCode: record.code,
  };
}

function confirmCode() {
  const m = codeModal.value;
  if (!m.code || !m.label) {
    message.warning('请填写字段编码与显示名称');
    return;
  }
  if (!/^[a-z][a-z0-9_]*$/.test(m.code)) {
    message.warning('字段编码需为英文字段名（小写字母开头，仅含字母/数字/下划线）');
    return;
  }
  const cat = categories.value.find((c) => c.key === m.categoryKey);
  if (!cat) return;
  if (m.mode === 'create') {
    if (cat.codes.some((i) => i.code === m.code)) {
      message.warning('字段编码已存在');
      return;
    }
    cat.codes.push({ code: m.code, label: m.label, sort: m.sort, enabled: m.enabled, description: m.description || undefined });
    message.success('字段编码已新增');
  } else {
    const target = cat.codes.find((i) => i.code === m.originalCode);
    if (target) {
      target.label = m.label;
      target.sort = m.sort;
      target.enabled = m.enabled;
      target.description = m.description || undefined;
    }
    message.success('字段编码已保存');
  }
  cat.codes.sort((a, b) => a.sort - b.sort);
  codeModal.value.visible = false;
}

function onDeleteCode(record: DictCode) {
  const cat = categories.value.find((c) => c.key === activeCategoryKey.value);
  if (!cat) return;
  const idx = cat.codes.findIndex((i) => i.code === record.code);
  if (idx >= 0) cat.codes.splice(idx, 1);
  message.success('字段编码已删除');
}
</script>
