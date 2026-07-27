<template>
  <div class="p-[20px]">
    <PageHeader title="机构子账户管理" description="管理本机构子账户、独立 API Key、服务调用权限，主账户凭证不再全科室共用" />

    <!-- KPI -->
    <section class="grid grid-cols-4 gap-[14px] mb-[14px]">
      <StatCard label="成员总数" :value="kpi.total" unit="人" tone="primary" />
      <StatCard label="启用中" :value="kpi.active" unit="人" tone="success" />
      <StatCard label="已禁用" :value="kpi.disabled" unit="人" tone="warning" />
      <StatCard label="待分配 Key" :value="kpi.pendingKey" unit="人" tone="default" />
    </section>

    <!-- 成员列表 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <template #actions>
          <a-button type="primary" @click="onCreate">
            <template #icon><PlusOutlined /></template>
            新增成员
          </a-button>
        </template>
        <a-input v-model:value="filter.keyword" style="width: 200px" placeholder="搜索姓名 / 账号" allow-clear @keyup.enter="onSearch" />
        <a-select v-model:value="filter.role" style="width: 140px" placeholder="角色" allow-clear>
          <a-select-option v-for="r in roleOptions" :key="r" :value="r">{{ r }}</a-select-option>
        </a-select>
        <a-select v-model:value="filter.status" style="width: 120px" placeholder="状态" allow-clear>
          <a-select-option value="启用">启用</a-select-option>
          <a-select-option value="禁用">禁用</a-select-option>
        </a-select>
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>

      <div class="px-[16px] py-[16px]">
        <a-alert type="info" show-icon class="!mb-[14px]">
          <template #message>
            <span class="text-[12px]">安全提示：主账户 API Key 仅用于管理操作，业务调用请使用各子账户独立 Key。禁用成员后其 Key 立即失效。</span>
          </template>
        </a-alert>

        <a-table :columns="visibleColumns" :data-source="filteredData" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle" row-key="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              <div class="flex flex-col">
                <span class="text-text-primary text-[14px]">{{ record.name }}</span>
                <span class="text-text-tertiary text-[12px] font-mono">{{ record.account }}</span>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'role'">
              <a-tag :color="roleColor(record.role)" class="!m-0">{{ record.role }}</a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'services'">
              <template v-if="record.services.length === 0">
                <span class="text-text-tertiary text-[14px]">-</span>
              </template>
              <template v-else>
                <a-tooltip :title="record.services.join('、')">
                  <span class="text-text-secondary text-[14px]">{{ record.services.length }} 个服务</span>
                </a-tooltip>
              </template>
            </template>
            <template v-else-if="column.dataIndex === 'apiKey'">
              <div class="flex items-center gap-[6px]">
                <span class="font-mono text-[13px] text-text-secondary">{{ record.apiKey }}</span>
                <a-tag v-if="record.apiKeyStatus === '正常'" color="success" class="!m-0 !text-[10px]">正常</a-tag>
                <a-tag v-else-if="record.apiKeyStatus === '已禁用'" color="default" class="!m-0 !text-[10px]">已禁用</a-tag>
                <a-tag v-else color="warning" class="!m-0 !text-[10px]">已过期</a-tag>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-badge :status="record.status === '启用' ? 'success' : 'default'" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button type="link" size="small" class="!p-0" @click="onEdit(record)">编辑</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button v-if="record.apiKey !== '-'" type="link" size="small" class="!p-0" @click="onResetKey(record)">重置Key</a-button>
                <a-button v-else type="link" size="small" class="!p-0" @click="onGenerateKey(record)">生成Key</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-popconfirm :title="`确认${record.status === '启用' ? '禁用' : '启用'}该成员？${record.status === '启用' ? '其 API Key 将立即失效' : ''}`" @confirm="onToggleStatus(record)">
                  <a-button type="link" size="small" class="!p-0" :class="record.status === '启用' ? '!text-danger' : ''">{{ record.status === '启用' ? '禁用' : '启用' }}</a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 新增/编辑弹窗 -->
    <a-modal v-model:open="formModal.visible" :title="formModal.mode === 'create' ? '新增成员' : `编辑 - ${formModal.record?.name ?? ''}`" @ok="confirmForm" :ok-text="formModal.mode === 'create' ? '创建' : '保存'" cancel-text="取消" :width="560">
      <a-form layout="vertical">
        <div class="grid grid-cols-2 gap-x-[16px]">
          <a-form-item label="姓名" required>
            <a-input v-model:value="formModal.name" placeholder="请输入姓名" />
          </a-form-item>
          <a-form-item label="账号" required>
            <a-input v-model:value="formModal.account" placeholder="如：zhang.san" :disabled="formModal.mode === 'edit'" />
          </a-form-item>
          <a-form-item label="角色" required>
            <a-select v-model:value="formModal.role" placeholder="请选择角色">
              <a-select-option v-for="r in roleOptions" :key="r" :value="r">{{ r }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="所属科室" required>
            <a-input v-model:value="formModal.department" placeholder="如：信息科" />
          </a-form-item>
        </div>
        <a-form-item label="可调用服务">
          <a-select v-model:value="formModal.services" mode="multiple" placeholder="选择该成员可调用的服务（留空则无调用权限）" allow-clear>
            <a-select-option v-for="s in serviceOptions" :key="s" :value="s">{{ s }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="IP 白名单">
          <a-input v-model:value="formModal.ipWhitelist" placeholder="如：10.2.3.0/24，留空则不限制" />
        </a-form-item>
        <a-form-item v-if="formModal.mode === 'create'" label="初始密码" required>
          <a-input-password v-model:value="formModal.password" placeholder="成员首次登录使用" />
        </a-form-item>
        <a-alert v-if="formModal.mode === 'create'" type="info" show-icon message="创建后系统将自动生成独立 API Key，成员可在个人中心查看" />
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { orgMembers, memberRoleOptions, type OrgMember, type MemberRole } from '../../data/orgMembers';
import PageHeader from '../../components/common/PageHeader.vue';
import StatCard from '../../components/common/StatCard.vue';
import FilterBar from '../../components/common/FilterBar.vue';
import ColumnSettings from '../../components/common/ColumnSettings.vue';

const filter = ref({ keyword: '', role: undefined as string | undefined, status: undefined as string | undefined });
const applied = ref({ ...filter.value });
const hiddenKeys = ref<string[]>([]);

const roleOptions = memberRoleOptions.map((r) => r.value);

const serviceOptions = ['AI健康助手', '病历文书规范稽核智能体', '肺结节CT图像辅助检测', '远程心电AI诊断', '骨密度CT影像辅助', '智能导诊助手'];

const columns = [
  { title: '成员', dataIndex: 'name', key: 'name', width: 180 },
  { title: '角色', dataIndex: 'role', key: 'role', width: 110 },
  { title: '科室', dataIndex: 'department', key: 'department', width: 120 },
  { title: '可调服务', dataIndex: 'services', key: 'services', width: 120 },
  { title: 'API Key', dataIndex: 'apiKey', key: 'apiKey', width: 240 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '最近登录', dataIndex: 'lastLogin', key: 'lastLogin', width: 150 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 200 },
];

const visibleColumns = computed(() => columns.filter((c) => !hiddenKeys.value.includes(c.key)));

function onSearch() {
  applied.value = { ...filter.value };
}
function onReset() {
  filter.value = { keyword: '', role: undefined, status: undefined };
  applied.value = { ...filter.value };
}

const filteredData = computed(() => {
  const f = applied.value;
  return orgMembers
    .filter((m) => {
      if (f.keyword) {
        if (!m.name.includes(f.keyword) && !m.account.includes(f.keyword)) return false;
      }
      if (f.role && m.role !== f.role) return false;
      if (f.status && m.status !== f.status) return false;
      return true;
    })
    .map((m) => ({ key: m.id, ...m }));
});

const kpi = computed(() => ({
  total: orgMembers.length,
  active: orgMembers.filter((m) => m.status === '启用').length,
  disabled: orgMembers.filter((m) => m.status === '禁用').length,
  pendingKey: orgMembers.filter((m) => m.apiKey === '-').length,
}));

function roleColor(role: MemberRole): string {
  if (role === '管理员') return 'purple';
  if (role === '调用员') return 'blue';
  if (role === '审核员') return 'cyan';
  return 'orange';
}

const formModal = ref<{
  visible: boolean;
  mode: 'create' | 'edit';
  record: OrgMember | null;
  name: string;
  account: string;
  role: MemberRole | undefined;
  department: string;
  services: string[];
  ipWhitelist: string;
  password: string;
}>({
  visible: false,
  mode: 'create',
  record: null,
  name: '',
  account: '',
  role: undefined,
  department: '',
  services: [],
  ipWhitelist: '',
  password: '',
});

function onCreate() {
  formModal.value = {
    visible: true,
    mode: 'create',
    record: null,
    name: '',
    account: '',
    role: undefined,
    department: '',
    services: [],
    ipWhitelist: '',
    password: '',
  };
}

function onEdit(record: OrgMember) {
  formModal.value = {
    visible: true,
    mode: 'edit',
    record,
    name: record.name,
    account: record.account,
    role: record.role,
    department: record.department,
    services: [...record.services],
    ipWhitelist: record.ipWhitelist ?? '',
    password: '',
  };
}

function confirmForm() {
  if (!formModal.value.name) return message.warning('请填写姓名');
  if (!formModal.value.account) return message.warning('请填写账号');
  if (!formModal.value.role) return message.warning('请选择角色');
  if (!formModal.value.department) return message.warning('请填写科室');
  if (formModal.value.mode === 'create' && !formModal.value.password) return message.warning('请填写初始密码');
  message.success(formModal.value.mode === 'create' ? `成员「${formModal.value.name}」已创建，API Key 已生成` : `成员「${formModal.value.name}」信息已更新`);
  formModal.value.visible = false;
}

function onResetKey(record: OrgMember) {
  message.success(`已重置「${record.name}」的 API Key，旧 Key 立即失效`);
}

function onGenerateKey(record: OrgMember) {
  message.success(`已为「${record.name}」生成 API Key`);
}

function onToggleStatus(record: OrgMember) {
  const action = record.status === '启用' ? '禁用' : '启用';
  message.success(`已${action}成员「${record.name}」${action === '禁用' ? '，其 API Key 已失效' : ''}`);
}
</script>
