<template>
  <div class="p-[20px]">
    <PageHeader title="登录日志" description="查看平台用户登录记录，含成功/失败、IP地点、浏览器指纹，异常登录实时预警" />

    <!-- 登录日志表 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <template #actions>
          <a-button @click="onExport">
            <template #icon><DownloadOutlined /></template>
            导出日志
          </a-button>
        </template>
        <a-input v-model:value="filter.keyword" style="width: 220px" placeholder="搜索用户 / IP" allow-clear @keyup.enter="onSearch" />
        <a-select v-model:value="filter.role" style="width: 130px" placeholder="角色" allow-clear>
          <a-select-option value="运营管理">运营管理</a-select-option>
          <a-select-option value="机构用户">机构用户</a-select-option>
          <a-select-option value="开发者">开发者</a-select-option>
        </a-select>
        <a-select v-model:value="filter.result" style="width: 120px" placeholder="结果" allow-clear>
          <a-select-option value="成功">成功</a-select-option>
          <a-select-option value="失败">失败</a-select-option>
        </a-select>
        <a-range-picker v-model:value="filter.range" :placeholder="['开始日期', '结束日期']" />
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>

      <div class="px-[16px] py-[16px]">
        <a-table :columns="visibleColumns" :data-source="filteredData" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle" row-key="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'user'">
              <span class="text-text-secondary text-[14px]">{{ record.user }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'ip'">
              <span class="font-num text-text-secondary text-[14px]">{{ record.ip }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'result'">
              <a-badge :status="record.result === '成功' ? 'success' : 'error'" :text="record.result" />
            </template>
            <template v-else-if="column.dataIndex === 'failReason'">
              <a-tooltip v-if="record.failReason" :title="record.failReason">
                <span class="text-danger text-[14px] truncate inline-block max-w-[200px]">{{ record.failReason }}</span>
              </a-tooltip>
              <span v-else class="text-text-tertiary">-</span>
            </template>
            <template v-else-if="column.dataIndex === 'browser'">
              <span class="text-text-secondary text-[14px]">{{ record.browser }} / {{ record.os }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'location'">
              <div class="flex items-center gap-[4px]">
                <EnvironmentOutlined class="text-text-tertiary text-[12px]" />
                <span class="text-text-secondary text-[14px]">{{ record.location }}</span>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'action_col'">
              <a-button type="link" size="small" class="!p-0" @click="onDetail(record)">详情</a-button>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 详情抽屉 -->
    <a-drawer v-model:open="drawer.visible" title="登录日志详情" :width="480" placement="right">
      <template v-if="drawer.record">
        <div class="rounded-[4px] bg-bg-soft border border-border-soft p-[14px] mb-[16px]">
          <div class="flex items-center gap-[8px] mb-[8px]">
            <a-badge :status="drawer.record.result === '成功' ? 'success' : 'error'" :text="drawer.record.result" />
            <a-tag class="!m-0 !text-[12px]" color="blue">{{ drawer.record.role }}</a-tag>
          </div>
          <div class="text-[16px] font-semibold text-text-primary">{{ drawer.record.user }}</div>
          <div class="text-[12px] text-text-tertiary mt-[4px]">会话ID：{{ drawer.record.sessionId ?? '-' }}</div>
        </div>
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="登录时间">{{ drawer.record.time }}</a-descriptions-item>
          <a-descriptions-item label="用户">{{ drawer.record.user }}</a-descriptions-item>
          <a-descriptions-item label="IP 地址">{{ drawer.record.ip }}</a-descriptions-item>
          <a-descriptions-item label="登录地点">{{ drawer.record.location }}</a-descriptions-item>
          <a-descriptions-item label="浏览器">{{ drawer.record.browser }}</a-descriptions-item>
          <a-descriptions-item label="操作系统">{{ drawer.record.os }}</a-descriptions-item>
          <a-descriptions-item label="登录结果">
            <a-badge :status="drawer.record.result === '成功' ? 'success' : 'error'" :text="drawer.record.result" />
          </a-descriptions-item>
          <a-descriptions-item v-if="drawer.record.failReason" label="失败原因">
            <span class="text-danger">{{ drawer.record.failReason }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="会话ID">{{ drawer.record.sessionId ?? '-' }}</a-descriptions-item>
        </a-descriptions>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { DownloadOutlined, EnvironmentOutlined } from '@ant-design/icons-vue';
import { loginLogs, type LoginLog } from '../../../data/operations';
import PageHeader from '../../../components/common/PageHeader.vue';
import FilterBar from '../../../components/common/FilterBar.vue';
import ColumnSettings from '../../../components/common/ColumnSettings.vue';

const filter = ref({
  keyword: '',
  role: undefined as string | undefined,
  result: undefined as string | undefined,
  range: undefined as any[] | undefined,
});

const applied = ref({ ...filter.value });

const columns = [
  { title: '登录时间', dataIndex: 'time', key: 'time', width: 160 },
  { title: '用户', dataIndex: 'user', key: 'user', width: 140 },
  { title: 'IP', dataIndex: 'ip', key: 'ip', width: 130 },
  { title: '登录地点', dataIndex: 'location', key: 'location', width: 140 },
  { title: '浏览器/系统', dataIndex: 'browser', key: 'browser', width: 220 },
  { title: '结果', dataIndex: 'result', key: 'result', width: 90 },
  { title: '失败原因', dataIndex: 'failReason', key: 'failReason', width: 220 },
  { title: '操作', dataIndex: 'action_col', key: 'action_col', width: 80 },
];

const hiddenKeys = ref<string[]>([]);

const visibleColumns = computed(() => columns.filter((c) => !hiddenKeys.value.includes(c.key)));

function onSearch() {
  applied.value = { ...filter.value };
}

function onReset() {
  filter.value = { keyword: '', role: undefined, result: undefined, range: undefined };
  applied.value = { ...filter.value };
}

const filteredData = computed(() => {
  const f = applied.value;
  return loginLogs
    .filter((l) => {
      if (f.keyword) {
        if (!l.user.includes(f.keyword) && !l.ip.includes(f.keyword)) return false;
      }
      if (f.role && l.role !== f.role) return false;
      if (f.result && l.result !== f.result) return false;
      if (f.range && f.range.length === 2) {
        const start = f.range[0].format('YYYY-MM-DD 00:00:00');
        const end = f.range[1].format('YYYY-MM-DD 23:59:59');
        if (l.time < start || l.time > end) return false;
      }
      return true;
    })
    .map((l) => ({ key: l.id, ...l }));
});

const drawer = ref<{ visible: boolean; record: LoginLog | null }>({ visible: false, record: null });

function onDetail(record: LoginLog) {
  drawer.value = { visible: true, record };
}

function onExport() {
  message.success('登录日志导出请求已提交，将通过邮件发送');
}
</script>
