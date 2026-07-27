<template>
  <div class="p-[20px]">
    <PageHeader title="机构列表" description="*您可在此查看所有入驻机构信息并进行管理" />

    <!-- 筛选 + 表格 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <a-input v-model:value="filter.orgName" style="width: 200px" placeholder="机构名称" allow-clear />
        <a-select v-model:value="filter.role" style="width: 140px" placeholder="机构角色" allow-clear>
          <a-select-option value="服务提供方">服务提供方</a-select-option>
          <a-select-option value="服务使用方">服务使用方</a-select-option>
        </a-select>
        <a-select v-model:value="filter.orgType" style="width: 140px" placeholder="机构类型" allow-clear>
          <a-select-option value="三级甲等">三级甲等</a-select-option>
          <a-select-option value="三级乙等">三级乙等</a-select-option>
          <a-select-option value="二级甲等">二级甲等</a-select-option>
          <a-select-option value="二级乙等">二级乙等</a-select-option>
        </a-select>
        <a-select v-model:value="filter.status" style="width: 140px" placeholder="机构状态" allow-clear>
          <a-select-option value="已启用">已启用</a-select-option>
          <a-select-option value="已停用">已停用</a-select-option>
        </a-select>
        <a-input v-model:value="filter.creditCode" style="width: 200px" placeholder="统一社会信用代码" allow-clear />
        <a-select v-model:value="filter.scale" style="width: 140px" placeholder="组织规模" allow-clear>
          <a-select-option value="100人以下">100人以下</a-select-option>
          <a-select-option value="100-500人">100-500人</a-select-option>
          <a-select-option value="500-1000人">500-1000人</a-select-option>
          <a-select-option value="1000人以上">1000人以上</a-select-option>
        </a-select>
        <a-select v-model:value="filter.city" style="width: 160px" placeholder="机构注册地" allow-clear>
          <a-select-option v-for="city in cities" :key="city" :value="city">{{ city }}</a-select-option>
        </a-select>
        <a-select v-model:value="filter.registerType" style="width: 140px" placeholder="注册类型" allow-clear>
          <a-select-option value="默认创建">默认创建</a-select-option>
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
          :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, showTotal: (t: number) => `共 ${t} 条` }"
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'status'">
              <a-badge :status="record.status === '已启用' ? 'success' : 'default'" :text="record.status" />
            </template>
            <template v-if="column.dataIndex === 'action'">
              <div class="flex gap-[8px]">
                <a-button type="link" size="small" @click="$router.push(`/admin/org-mgmt/${record.key}/detail`)">账户列表</a-button>
                <a-button type="link" size="small" @click="onEdit(record)">编辑</a-button>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 编辑弹窗 -->
    <a-modal v-model:open="editModal.visible" :title="`编辑机构 - ${editModal.record?.orgName ?? ''}`" @ok="confirmEdit" ok-text="保存" cancel-text="取消" :width="520">
      <a-form layout="vertical" v-if="editModal.record">
        <a-form-item label="机构名称">
          <a-input v-model:value="editModal.record.orgName" />
        </a-form-item>
        <a-form-item label="机构类型">
          <a-input v-model:value="editModal.record.orgType" />
        </a-form-item>
        <a-form-item label="联系人">
          <a-input v-model:value="editModal.record.contact" />
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input v-model:value="editModal.record.phone" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import type { OrgListItem, OrgUserItem } from '../../../types';
import { orgListMockData, orgUserMockData } from '../../../data/admin/org-mgmt';
import PageHeader from '../../../components/common/PageHeader.vue';
import FilterBar from '../../../components/common/FilterBar.vue';
import ColumnSettings from '../../../components/common/ColumnSettings.vue';

const filter = ref({
  orgName: '',
  role: undefined as string | undefined,
  orgType: undefined as string | undefined,
  creditCode: '',
  scale: undefined as string | undefined,
  city: undefined as string | undefined,
  status: undefined as string | undefined,
  registerType: undefined as string | undefined,
});

const applied = ref({ ...filter.value });

const cities = [
  '南京市',
  '无锡市',
  '徐州市',
  '常州市',
  '苏州市',
  '南通市',
  '连云港市',
  '淮安市',
  '盐城市',
  '扬州市',
  '镇江市',
  '泰州市',
  '宿迁市',
];

const columns = [
  { title: '序号', dataIndex: 'key', key: 'key', width: 50 },
  { title: '机构名称', dataIndex: 'orgName', key: 'orgName', width: 180 },
  { title: '机构角色', dataIndex: 'role', key: 'role', width: 100 },
  { title: '机构类型', dataIndex: 'orgType', key: 'orgType', width: 100 },
  { title: '统一社会信用代码', dataIndex: 'creditCode', key: 'creditCode', width: 180 },
  { title: '组织规模', dataIndex: 'scale', key: 'scale', width: 100 },
  { title: '机构所在地', dataIndex: 'city', key: 'city', width: 100 },
  { title: '机构联系人', dataIndex: 'contactName', key: 'contactName', width: 120 },
  { title: '联系人手机号码', dataIndex: 'contactPhone', key: 'contactPhone', width: 140 },
  { title: '申请日期', dataIndex: 'applyDate', key: 'applyDate', width: 140 },
  { title: '创建人', dataIndex: 'creator', key: 'creator', width: 100 },
  { title: '注册类型', dataIndex: 'registerType', key: 'registerType', width: 100 },
  { title: '用户来源', dataIndex: 'source', key: 'source', width: 100 },
  { title: '机构状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 120 },
];

const hiddenKeys = ref<string[]>([]);
const visibleColumns = computed(() => columns.filter(c => !hiddenKeys.value.includes(c.key as string)));

const filteredData = computed(() => {
  const f = applied.value;
  return orgListMockData.filter(item => {
    if (f.orgName && !item.orgName.includes(f.orgName)) return false;
    if (f.role && item.role !== f.role) return false;
    if (f.orgType && item.orgType !== f.orgType) return false;
    if (f.creditCode && !item.creditCode.includes(f.creditCode)) return false;
    if (f.scale && item.scale !== f.scale) return false;
    if (f.city && item.city !== f.city) return false;
    if (f.status && item.status !== f.status) return false;
    if (f.registerType && item.registerType !== f.registerType) return false;
    return true;
  });
});

function onSearch() {
  applied.value = { ...filter.value };
}

function onReset() {
  filter.value = {
    orgName: '',
    role: undefined,
    orgType: undefined,
    creditCode: '',
    scale: undefined,
    city: undefined,
    status: undefined,
    registerType: undefined,
  };
  applied.value = { ...filter.value };
}

// 用户列表抽屉
const userDrawer = ref<{ visible: boolean; orgName: string; orgKey: string }>({
  visible: false,
  orgName: '',
  orgKey: '',
});

const userFilter = ref({
  userName: '',
  status: undefined as string | undefined,
});

const userColumns = [
  { title: '序号', dataIndex: 'key', key: 'key', width: 50 },
  { title: '用户姓名', dataIndex: 'userName', key: 'userName' },
  { title: '身份证号', dataIndex: 'idCard', key: 'idCard', width: 140 },
  { title: '登录账户', dataIndex: 'loginAccount', key: 'loginAccount', width: 120 },
  { title: '用户邮箱', dataIndex: 'email', key: 'email', width: 160 },
  { title: '创建日期', dataIndex: 'createDate', key: 'createDate', width: 130 },
  { title: '注册类型', dataIndex: 'registerType', key: 'registerType', width: 100 },
  { title: '用户中心来源', dataIndex: 'source', key: 'source', width: 100 },
  { title: '账户状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 120 },
];

const filteredUserData = computed(() => {
  if (!userDrawer.value.orgKey) return [];
  return orgUserMockData
    .filter(u => u.orgKey === userDrawer.value.orgKey)
    .filter(item => {
      if (userFilter.value.userName && !item.userName.includes(userFilter.value.userName)) return false;
      if (userFilter.value.status && item.status !== userFilter.value.status) return false;
      return true;
    });
});

function openUserList(record: OrgListItem) {
  userDrawer.value = {
    visible: true,
    orgName: record.orgName,
    orgKey: record.key,
  };
}

function resetUserFilter() {
  userFilter.value = { userName: '', status: undefined };
}

const editModal = ref<{ visible: boolean; record: OrgListItem | null }>({ visible: false, record: null });

function onEdit(record: any) {
  editModal.value = { visible: true, record: { ...record } as OrgListItem };
}

function confirmEdit() {
  message.success(`机构「${editModal.value.record?.orgName}」信息已更新`);
  editModal.value.visible = false;
}

</script>
