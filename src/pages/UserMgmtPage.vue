<template>
  <div class="p-[20px]">
    <PageHeader title="用户管理" description="管理平台用户账号与角色权限">
      <template #actions>
        <a-button type="primary">+ 新增用户</a-button>
      </template>
    </PageHeader>

    <!-- 顶部统计 -->
    <section class="grid grid-cols-4 gap-[14px] mb-[14px]">
      <StatCard
        v-for="stat in userStats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :unit="stat.unit"
        :tone="stat.tone"
      />
    </section>

    <!-- 用户列表 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <a-input v-model:value="keyword" placeholder="搜索用户姓名 / 账号" style="width: 240px" allow-clear @keyup.enter="onSearch" />
        <a-select v-model:value="roleFilter" style="width: 160px" placeholder="角色" allow-clear>
          <a-select-option value="超级管理员">超级管理员</a-select-option>
          <a-select-option value="机构管理员">机构管理员</a-select-option>
          <a-select-option value="机构用户">机构用户</a-select-option>
        </a-select>
        <a-select v-model:value="statusFilter" style="width: 120px" placeholder="状态" allow-clear>
          <a-select-option value="启用">启用</a-select-option>
          <a-select-option value="停用">停用</a-select-option>
        </a-select>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>
      <div class="px-[16px] py-[16px]">
        <a-table :columns="columns" :data-source="filteredUsers" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle" row-key="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              <div class="flex items-center gap-[8px]">
                <div class="w-[28px] h-[28px] rounded-full bg-secondary/10 text-secondary grid place-items-center text-[12px] font-semibold">{{ record.name.slice(0, 1) }}</div>
                <div>
                  <div class="text-[13px] font-semibold text-text-primary">{{ record.name }}</div>
                  <div class="text-[11px] text-text-secondary">{{ record.account }}</div>
                </div>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'role'">
              <a-tag :color="roleColor(record.role)" class="!m-0 !text-[11px]">{{ record.role }}</a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-badge :status="record.status === '启用' ? 'success' : 'default'" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button type="link" size="small" class="!p-0" @click="onEdit(record)">编辑</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0" @click="onResetPassword(record)">重置密码</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0" :class="record.status === '启用' ? '!text-danger' : ''" @click="onToggle(record)">{{ record.status === '启用' ? '停用' : '启用' }}</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 编辑弹窗 -->
    <a-modal v-model:open="editModal.visible" :title="`编辑用户 - ${editModal.record?.name ?? ''}`" @ok="confirmEdit" ok-text="保存" cancel-text="取消" :width="480">
      <a-form layout="vertical" v-if="editModal.record">
        <a-form-item label="姓名">
          <a-input v-model:value="editModal.record.name" />
        </a-form-item>
        <a-form-item label="账号">
          <a-input v-model:value="editModal.record.account" />
        </a-form-item>
        <a-form-item label="角色">
          <a-input v-model:value="editModal.record.role" />
        </a-form-item>
        <a-form-item label="所属机构">
          <a-input v-model:value="editModal.record.org" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import PageHeader from '../components/common/PageHeader.vue';
import FilterBar from '../components/common/FilterBar.vue';
import StatCard from '../components/common/StatCard.vue';

const keyword = ref('');
const roleFilter = ref<string | undefined>(undefined);
const statusFilter = ref<string | undefined>(undefined);
const applied = ref({ keyword: '', role: undefined as string | undefined, status: undefined as string | undefined });

function onSearch() {
  applied.value = { keyword: keyword.value, role: roleFilter.value, status: statusFilter.value };
}

function onReset() {
  keyword.value = '';
  roleFilter.value = undefined;
  statusFilter.value = undefined;
  applied.value = { keyword: '', role: undefined, status: undefined };
}

const userStats = [
  { label: '用户总数', value: '3,672', unit: '人', tone: 'primary' as const },
  { label: '管理员', value: '24', unit: '人', tone: 'default' as const },
  { label: '机构用户', value: '2,840', unit: '人', tone: 'success' as const },
  { label: '本月新增', value: '128', unit: '人', tone: 'warning' as const },
];

const columns = [
  { title: '用户', dataIndex: 'name', key: 'name', width: 220 },
  { title: '所属机构', dataIndex: 'org', key: 'org' },
  { title: '角色', dataIndex: 'role', key: 'role', width: 120 },
  { title: '最近登录', dataIndex: 'lastLogin', key: 'lastLogin', width: 160 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 110 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 230 },
];

const users = [
  { id: '1', name: '张三', account: 'zhang.san@jscz', org: '常州市人民医院', role: '机构管理员', lastLogin: '2024-07-17 09:42', status: '启用' },
  { id: '2', name: '赵六', account: 'zhao.liu@yczly', org: '盐城市疾病预防控制中心', role: '机构管理员', lastLogin: '2024-07-17 08:15', status: '启用' },
  { id: '3', name: '王五', account: 'wang.wu@ntdx', org: '南通大学附属医院', role: '机构用户', lastLogin: '2024-07-16 16:38', status: '启用' },
  { id: '4', name: '李四', account: 'li.si@jsyb', org: '江苏省医保数据赋能实验室', role: '超级管理员', lastLogin: '2024-07-17 10:05', status: '启用' },
  { id: '5', name: '孙二十', account: 'sun.ershi@htyy', org: '南京鼓楼医院', role: '机构用户', lastLogin: '2024-07-15 14:20', status: '启用' },
  { id: '6', name: '钱十', account: 'qian.shi@jscz', org: '江苏省人民医院', role: '机构管理员', lastLogin: '2024-07-14 11:30', status: '停用' },
  { id: '7', name: '李二十一', account: 'li.ershiyi@jsdy', org: '江苏省医学科学研究院', role: '机构用户', lastLogin: '2024-07-13 09:18', status: '启用' },
  { id: '8', name: '王二十二', account: 'wang.ershier@czey', org: '常州市第二人民医院', role: '机构用户', lastLogin: '2024-07-12 17:45', status: '启用' },
];

const filteredUsers = computed(() => {
  const { keyword: k, role, status } = applied.value;
  return users.filter((u) => {
    if (k && !u.name.includes(k) && !u.account.includes(k)) return false;
    if (role && u.role !== role) return false;
    if (status && u.status !== status) return false;
    return true;
  });
});

function roleColor(role: string) {
  if (role === '超级管理员') return 'error';
  if (role === '机构管理员') return 'blue';
  return 'default';
}

function onEdit(record: any) {
  editModal.value = { visible: true, record: { ...record } };
}
function onResetPassword(record: any) { message.success(`${record.name} 的密码已重置并发送至邮箱`); }
function onToggle(record: any) { message.warning(`已${record.status === '启用' ? '停用' : '启用'} ${record.name}`); }

const editModal = ref<{ visible: boolean; record: any }>({ visible: false, record: null });

function confirmEdit() {
  message.success(`用户「${editModal.value.record?.name}」信息已更新`);
  editModal.value.visible = false;
}
</script>
