<template>
  <div class="p-[20px]">
    <PageHeader title="操作日志" description="审计平台操作行为全量留痕，支持按操作人/角色/模块/结果筛选与导出" />

    <!-- 操作日志表 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <template #actions>
          <a-button @click="onExport">
            <template #icon><DownloadOutlined /></template>
            导出日志
          </a-button>
        </template>
        <a-input v-model:value="filter.keyword" style="width: 220px" placeholder="搜索操作人 / 操作内容" allow-clear @keyup.enter="onSearch" />
        <a-select v-model:value="filter.role" style="width: 130px" placeholder="角色" allow-clear>
          <a-select-option value="运营管理">运营管理</a-select-option>
          <a-select-option value="机构用户">机构用户</a-select-option>
          <a-select-option value="开发者">开发者</a-select-option>
        </a-select>
        <a-select v-model:value="filter.module" style="width: 160px" placeholder="模块" allow-clear>
          <a-select-option v-for="m in modules" :key="m" :value="m">{{ m }}</a-select-option>
        </a-select>
        <a-select v-model:value="filter.result" style="width: 120px" placeholder="结果" allow-clear>
          <a-select-option value="成功">成功</a-select-option>
          <a-select-option value="失败">失败</a-select-option>
          <a-select-option value="告警">告警</a-select-option>
        </a-select>
        <a-range-picker v-model:value="filter.range" :placeholder="['开始日期', '结束日期']" />
        <a-checkbox v-model:checked="filter.sensitiveOnly">仅看敏感操作</a-checkbox>
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>

      <!-- 表格 -->
      <div class="px-[16px] py-[16px]">
        <a-table :columns="visibleColumns" :data-source="filteredData" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle" row-key="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'operator'">
              <span class="text-text-secondary text-[14px]">{{ record.operator }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <div class="flex items-center gap-[6px]">
                <span class="text-text-primary text-[14px]">{{ record.action }}</span>
                <a-tag v-if="record.sensitive" color="error" class="!m-0 !text-[12px]">敏感</a-tag>
              </div>
              <div v-if="record.detail" class="text-text-tertiary text-[12px] mt-[2px]">{{ record.detail }}</div>
            </template>
            <template v-else-if="column.dataIndex === 'result'">
              <a-badge :status="resultBadge(record.result)" :text="record.result" />
            </template>
            <template v-else-if="column.dataIndex === 'location'">
              <span class="text-text-secondary text-[14px]">{{ record.location }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'action_col'">
              <a-button type="link" size="small" class="!p-0" @click="onDetail(record)">详情</a-button>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 详情抽屉 -->
    <a-drawer v-model:open="drawer.visible" title="操作日志详情" :width="520" placement="right">
      <template v-if="drawer.record">
        <div class="rounded-[4px] bg-bg-soft border border-border-soft p-[14px] mb-[16px]">
          <div class="flex items-center gap-[8px] mb-[8px]">
            <a-badge :status="resultBadge(drawer.record.result)" :text="drawer.record.result" />
            <a-tag v-if="drawer.record.sensitive" color="error" class="!m-0 !text-[12px]">敏感操作</a-tag>
            <a-tag class="!m-0 !text-[12px]" color="blue">{{ drawer.record.module }}</a-tag>
          </div>
          <div class="text-[16px] font-semibold text-text-primary">{{ drawer.record.action }}</div>
          <div class="text-[12px] text-text-tertiary mt-[4px]">流水号：{{ drawer.record.id }}</div>
        </div>
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="操作时间">{{ drawer.record.time }}</a-descriptions-item>
          <a-descriptions-item label="操作人">{{ drawer.record.operator }}</a-descriptions-item>
          <a-descriptions-item label="操作模块">{{ drawer.record.module }}</a-descriptions-item>
          <a-descriptions-item label="IP 地址">{{ drawer.record.ip }}</a-descriptions-item>
          <a-descriptions-item label="操作地点">{{ drawer.record.location }}</a-descriptions-item>
          <a-descriptions-item label="操作结果">
            <a-badge :status="resultBadge(drawer.record.result)" :text="drawer.record.result" />
          </a-descriptions-item>
          <a-descriptions-item label="是否敏感">{{ drawer.record.sensitive ? '是' : '否' }}</a-descriptions-item>
          <a-descriptions-item v-if="drawer.record.detail" label="详情说明">{{ drawer.record.detail }}</a-descriptions-item>
        </a-descriptions>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { DownloadOutlined } from '@ant-design/icons-vue';
import { auditLogs, type AuditLog } from '../../../data/operations';
import PageHeader from '../../../components/common/PageHeader.vue';
import FilterBar from '../../../components/common/FilterBar.vue';
import ColumnSettings from '../../../components/common/ColumnSettings.vue';

const filter = ref({
  keyword: '',
  role: undefined as string | undefined,
  module: undefined as string | undefined,
  result: undefined as string | undefined,
  range: undefined as any[] | undefined,
  sensitiveOnly: false,
});

const applied = ref({ ...filter.value });

const modules = Array.from(new Set(auditLogs.map((r) => r.module))).sort();

const columns = [
  { title: '时间', dataIndex: 'time', key: 'time', width: 160 },
  { title: '操作人', dataIndex: 'operator', key: 'operator', width: 140 },
  { title: '模块', dataIndex: 'module', key: 'module', width: 140 },
  { title: '操作内容', dataIndex: 'action', key: 'action' },
  { title: 'IP', dataIndex: 'ip', key: 'ip', width: 130 },
  { title: '地点', dataIndex: 'location', key: 'location', width: 120 },
  { title: '结果', dataIndex: 'result', key: 'result', width: 90 },
  { title: '操作', dataIndex: 'action_col', key: 'action_col', width: 80 },
];

const hiddenKeys = ref<string[]>([]);

const visibleColumns = computed(() => columns.filter((c) => !hiddenKeys.value.includes(c.key)));

function onSearch() {
  applied.value = { ...filter.value };
}

function onReset() {
  filter.value = { keyword: '', role: undefined, module: undefined, result: undefined, range: undefined, sensitiveOnly: false };
  applied.value = { ...filter.value };
}

const filteredData = computed(() => {
  const f = applied.value;
  return auditLogs
    .filter((r) => {
      if (f.keyword) {
        if (!r.operator.includes(f.keyword) && !r.action.includes(f.keyword)) return false;
      }
      if (f.role && r.role !== f.role) return false;
      if (f.module && r.module !== f.module) return false;
      if (f.result && r.result !== f.result) return false;
      if (f.sensitiveOnly && !r.sensitive) return false;
      if (f.range && f.range.length === 2) {
        const start = f.range[0].format('YYYY-MM-DD 00:00:00');
        const end = f.range[1].format('YYYY-MM-DD 23:59:59');
        if (r.time < start || r.time > end) return false;
      }
      return true;
    })
    .map((r) => ({ key: r.id, ...r }));
});

function resultBadge(result: string): 'success' | 'error' | 'warning' {
  if (result === '成功') return 'success';
  if (result === '失败') return 'error';
  return 'warning';
}

const drawer = ref<{ visible: boolean; record: AuditLog | null }>({ visible: false, record: null });

function onDetail(record: AuditLog) {
  drawer.value = { visible: true, record };
}

function onExport() {
  message.success('操作日志导出请求已提交，将通过邮件发送');
}
</script>
