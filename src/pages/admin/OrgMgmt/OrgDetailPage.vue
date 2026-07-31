<template>
  <div class="p-[20px]">
    <div class="flex items-center gap-[8px] mb-[14px]">
      <a-button type="text" class="!px-[6px] !text-text-secondary" @click="onBack">
        <template #icon><ArrowLeftOutlined /></template>
        返回机构协同管理
      </a-button>
      <a-divider type="vertical" class="!mx-[4px]" />
      <span class="text-[12px] text-text-tertiary">机构协同管理 / {{ orgInfo?.orgName }} / 用户列表</span>
    </div>

    <section class="cloud-card p-[0] overflow-hidden">
      <div class="px-[16px] py-[14px] flex items-center justify-between">
        <div>
          <div class="text-[14px] font-semibold text-text-primary">用户列表</div>
          <div class="text-[11px] text-text-secondary mt-[4px]">{{ orgInfo?.orgName }} 下的用户账户信息</div>
        </div>
        <span class="text-[12px] text-text-tertiary">共 {{ filteredUserData.length }} 条</span>
      </div>

      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>

      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <a-input v-model:value="filter.userName" style="width: 200px" placeholder="用户姓名" allow-clear />
        <a-select v-model:value="filter.status" style="width: 140px" placeholder="账户状态" allow-clear>
          <a-select-option value="已启用">已启用</a-select-option>
          <a-select-option value="已停用">已停用</a-select-option>
        </a-select>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>

      <div class="px-[16px] py-[16px]">
        <a-table
          :columns="userColumns"
          :data-source="filteredUserData"
          :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, showTotal: (t: number) => `共 ${t} 条` }"
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'status'">
              <a-badge :status="record.status === '已启用' ? 'success' : 'default'" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <div class="flex gap-[8px]">
                <a-button
                  v-if="record.status === '已启用'"
                  type="link"
                  size="small"
                  @click="toggleStatus(record)"
                >
                  停用
                </a-button>
                <a-button
                  v-else
                  type="link"
                  size="small"
                  @click="toggleStatus(record)"
                >
                  启用
                </a-button>
                <a-popconfirm title="确认重置该用户密码？重置后新密码将通过短信发送" @confirm="onResetPassword(record)">
                  <a-button type="link" size="small">
                    重置密码
                  </a-button>
                </a-popconfirm>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import type { OrgListItem, OrgUserItem } from '../../../types';
import { orgListMockData, orgUserMockData } from '../../../data/admin/org-mgmt';
import FilterBar from '../../../components/common/FilterBar.vue';

const route = useRoute();
const router = useRouter();

const orgKey = ref<string>(route.params.orgKey as string || '');
const orgInfo = ref<OrgListItem | null>(null);

const filter = ref({
  userName: '',
  status: undefined as string | undefined,
});

const applied = ref({ ...filter.value });

const userColumns = [
  { title: '序号', dataIndex: 'key', key: 'key', width: 50 },
  { title: '用户姓名', dataIndex: 'userName', key: 'userName' },
  { title: '身份证号', dataIndex: 'idCard', key: 'idCard', width: 140 },
  { title: '登录账户', dataIndex: 'loginAccount', key: 'loginAccount', width: 120 },
  { title: '用户邮箱', dataIndex: 'email', key: 'email', width: 160 },
  { title: '创建日期', dataIndex: 'createDate', key: 'createDate', width: 130 },
  { title: '注册类型', dataIndex: 'registerType', key: 'registerType', width: 100 },
  { title: '来源', dataIndex: 'source', key: 'source', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 180 },
];

const filteredUserData = computed(() => {
  const f = applied.value;
  return orgUserMockData
    .filter(u => u.orgKey === orgKey.value)
    .filter(item => {
      if (f.userName && !item.userName.includes(f.userName)) return false;
      if (f.status && item.status !== f.status) return false;
      return true;
    });
});

function onBack() {
  router.push('/admin/org-mgmt');
}

function onReset() {
  filter.value = { userName: '', status: undefined };
  applied.value = { ...filter.value };
}

function onResetPassword(record: any) {
  message.success(`已重置「${record.userName}」的密码，新密码已发送至其手机`);
}

function onSearch() {
  applied.value = { ...filter.value };
}

function toggleStatus(record: OrgUserItem) {
  const newStatus = record.status === '已启用' ? '已停用' : '已启用';
  record.status = newStatus;
  message.success(`已${newStatus}用户 ${record.userName}`);
}

onMounted(() => {
  const found = orgListMockData.find(item => item.key === orgKey.value);
  orgInfo.value = found || null;
});
</script>
