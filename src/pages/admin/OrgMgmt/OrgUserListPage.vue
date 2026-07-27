<template>
  <div class="p-[20px]">
    <PageHeader title="用户列表" description="汇聚所有机构账户的用户列表，支持按机构、状态、注册类型筛选" />

    <!-- 筛选 + 表格 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <template #actions>
          <a-button @click="onExport">
            <template #icon><DownloadOutlined /></template>
            导出
          </a-button>
        </template>
        <a-input v-model:value="filter.userName" style="width: 180px" placeholder="用户姓名" allow-clear />
        <a-input v-model:value="filter.loginAccount" style="width: 180px" placeholder="登录账户" allow-clear />
        <a-select v-model:value="filter.orgKey" style="width: 220px" placeholder="所属机构" allow-clear show-search option-filter-prop="label">
          <a-select-option v-for="o in orgOptions" :key="o.key" :value="o.key" :label="o.orgName">{{ o.orgName }}</a-select-option>
        </a-select>
        <a-select v-model:value="filter.status" style="width: 140px" placeholder="账户状态" allow-clear>
          <a-select-option value="已启用">已启用</a-select-option>
          <a-select-option value="已停用">已停用</a-select-option>
        </a-select>
        <a-select v-model:value="filter.registerType" style="width: 160px" placeholder="注册类型" allow-clear>
          <a-select-option value="默认创建">默认创建</a-select-option>
          <a-select-option value="用户自注册">用户自注册</a-select-option>
          <a-select-option value="运营添加">运营添加</a-select-option>
        </a-select>
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>

      <div class="px-[16px] py-[16px]">
        <a-table
          :columns="visibleColumns"
          :data-source="filteredData"
          :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }"
          size="middle"
          row-key="key"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'orgName'">
              <span class="text-[12px] font-semibold text-text-primary">{{ record.orgName }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-badge :status="record.status === '已启用' ? 'success' : 'default'" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <div class="flex gap-[8px]">
                <a-button
                  v-if="record.status === '已启用'"
                  type="link"
                  size="small"
                  class="!p-0"
                  @click="toggleStatus(record)"
                >
                  停用
                </a-button>
                <a-button
                  v-else
                  type="link"
                  size="small"
                  class="!p-0"
                  @click="toggleStatus(record)"
                >
                  启用
                </a-button>
                <a-button type="link" size="small" class="!p-0" @click="onResetPassword(record)">
                  重置密码
                </a-button>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { DownloadOutlined } from '@ant-design/icons-vue';
import { orgListMockData, orgUserMockData } from '../../../data/admin/org-mgmt';
import type { OrgUserItem } from '../../../types';
import PageHeader from '../../../components/common/PageHeader.vue';
import FilterBar from '../../../components/common/FilterBar.vue';
import ColumnSettings from '../../../components/common/ColumnSettings.vue';

const orgOptions = orgListMockData.map((o) => ({ key: o.key, orgName: o.orgName }));
const orgMap = computed(() => {
  const m = new Map<string, string>();
  orgListMockData.forEach((o) => m.set(o.key, o.orgName));
  return m;
});

const filter = ref({
  userName: '',
  loginAccount: '',
  orgKey: undefined as string | undefined,
  status: undefined as string | undefined,
  registerType: undefined as string | undefined,
});

const applied = ref({ ...filter.value });

function onSearch() {
  applied.value = { ...filter.value };
}
function onReset() {
  filter.value = {
    userName: '',
    loginAccount: '',
    orgKey: undefined,
    status: undefined,
    registerType: undefined,
  };
  applied.value = { ...filter.value };
}

const columns = [
  { title: '用户姓名', dataIndex: 'userName', key: 'userName', width: 120 },
  { title: '所属机构', dataIndex: 'orgName', key: 'orgName', width: 200 },
  { title: '身份证号', dataIndex: 'idCard', key: 'idCard', width: 160 },
  { title: '登录账户', dataIndex: 'loginAccount', key: 'loginAccount', width: 140 },
  { title: '用户邮箱', dataIndex: 'email', key: 'email', width: 200 },
  { title: '创建日期', dataIndex: 'createDate', key: 'createDate', width: 160 },
  { title: '注册类型', dataIndex: 'registerType', key: 'registerType', width: 120 },
  { title: '用户来源', dataIndex: 'source', key: 'source', width: 120 },
  { title: '账户状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 100 },
];

const hiddenKeys = ref<string[]>([]);
const visibleColumns = computed(() => columns.filter((c) => !hiddenKeys.value.includes(c.key as string)));

const filteredData = computed<(OrgUserItem & { orgName: string })[]>(() => {
  const f = applied.value;
  return orgUserMockData
    .filter((u) => {
      if (f.userName && !u.userName.includes(f.userName)) return false;
      if (f.loginAccount && !u.loginAccount.includes(f.loginAccount)) return false;
      if (f.orgKey && u.orgKey !== f.orgKey) return false;
      if (f.status && u.status !== f.status) return false;
      if (f.registerType && u.registerType !== f.registerType) return false;
      return true;
    })
    .map((u) => ({ ...u, orgName: orgMap.value.get(u.orgKey) ?? '-' }));
});

function toggleStatus(record: OrgUserItem) {
  const newStatus = record.status === '已启用' ? '已停用' : '已启用';
  record.status = newStatus;
  message.success(`已${newStatus}用户 ${record.userName}`);
}

function onResetPassword(record: OrgUserItem) {
  message.success(`已向 ${record.email} 发送密码重置邮件`);
}

function onExport() {
  message.success('用户列表导出请求已提交');
}
</script>
