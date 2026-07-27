<template>
  <div class="p-[20px]">
    <PageHeader title="开发者管理" description="管理平台开发者账号、审核与上架服务">
      <template #actions>
        <a-button type="primary">+ 新增开发者</a-button>
      </template>
    </PageHeader>

    <!-- 顶部统计 -->
    <section class="grid grid-cols-4 gap-[14px] mb-[14px]">
      <StatCard
        v-for="stat in devStats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :unit="stat.unit"
        :tone="stat.tone"
      />
    </section>

    <!-- 开发者列表 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <a-input v-model:value="keyword" placeholder="搜索开发者 / 单位" style="width: 260px" allow-clear @keyup.enter="onSearch" />
        <a-select v-model:value="typeFilter" style="width: 160px" placeholder="类型" allow-clear>
          <a-select-option value="AI厂商">AI厂商</a-select-option>
          <a-select-option value="医院/科研">医院/科研</a-select-option>
        </a-select>
        <a-select v-model:value="statusFilter" style="width: 140px" placeholder="状态" allow-clear>
          <a-select-option value="正常">正常</a-select-option>
          <a-select-option value="待审核">待审核</a-select-option>
          <a-select-option value="已停用">已停用</a-select-option>
        </a-select>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>
      <div class="px-[16px] py-[16px]">
        <a-table :columns="columns" :data-source="filteredDevs" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle" row-key="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              <div class="flex items-center gap-[8px]">
                <div class="w-[28px] h-[28px] rounded-full bg-primary/10 text-primary grid place-items-center text-[12px] font-semibold">{{ record.name.slice(0, 1) }}</div>
                <div>
                  <div class="text-[13px] font-semibold text-text-primary">{{ record.name }}</div>
                  <div class="text-[11px] text-text-secondary">{{ record.account }}</div>
                </div>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'type'">
              <a-tag :color="record.type === 'AI厂商' ? 'blue' : 'cyan'" class="!m-0 !text-[11px]">{{ record.type }}</a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-badge :status="record.status === '正常' ? 'success' : record.status === '待审核' ? 'warning' : 'default'" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button type="link" size="small" class="!p-0" @click="onView(record)">查看</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button v-if="record.status === '待审核'" type="link" size="small" class="!p-0" @click="onApprove(record)">审核</a-button>
                <a-button v-else type="link" size="small" class="!p-0" @click="onEdit(record)">编辑</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0 !text-danger" @click="onDisable(record)">停用</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 查看抽屉 -->
    <a-drawer v-model:open="viewDrawer.visible" title="开发者详情" :width="520" placement="right">
      <template v-if="viewDrawer.record">
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="开发者名称">{{ viewDrawer.record.name }}</a-descriptions-item>
          <a-descriptions-item label="所属机构">{{ viewDrawer.record.org }}</a-descriptions-item>
          <a-descriptions-item label="类型">{{ viewDrawer.record.type }}</a-descriptions-item>
          <a-descriptions-item label="状态">{{ viewDrawer.record.status }}</a-descriptions-item>
          <a-descriptions-item label="上架服务">{{ viewDrawer.record.services ?? '-' }}</a-descriptions-item>
          <a-descriptions-item label="累计调用">{{ viewDrawer.record.calls ?? '-' }}</a-descriptions-item>
          <a-descriptions-item label="累计收益">{{ viewDrawer.record.revenue ?? '-' }}</a-descriptions-item>
          <a-descriptions-item label="入驻时间">{{ viewDrawer.record.joinedAt ?? '-' }}</a-descriptions-item>
        </a-descriptions>
      </template>
    </a-drawer>

    <!-- 编辑弹窗 -->
    <a-modal v-model:open="editModal.visible" :title="`编辑开发者 - ${editModal.record?.name ?? ''}`" @ok="confirmEdit" ok-text="保存" cancel-text="取消" :width="480">
      <a-form layout="vertical" v-if="editModal.record">
        <a-form-item label="开发者名称">
          <a-input v-model:value="editModal.record.name" />
        </a-form-item>
        <a-form-item label="所属机构">
          <a-input v-model:value="editModal.record.org" />
        </a-form-item>
        <a-form-item label="联系人">
          <a-input v-model:value="editModal.record.contact" placeholder="请输入联系人" />
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input v-model:value="editModal.record.phone" placeholder="请输入联系电话" />
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
const typeFilter = ref<string | undefined>(undefined);
const statusFilter = ref<string | undefined>(undefined);
const applied = ref({ keyword: '', type: undefined as string | undefined, status: undefined as string | undefined });

function onSearch() {
  applied.value = { keyword: keyword.value, type: typeFilter.value, status: statusFilter.value };
}

function onReset() {
  keyword.value = '';
  typeFilter.value = undefined;
  statusFilter.value = undefined;
  applied.value = { keyword: '', type: undefined, status: undefined };
}

const devStats = [
  { label: '开发者总数', value: '46', unit: '人', tone: 'primary' as const },
  { label: 'AI 厂商', value: '18', unit: '家', tone: 'default' as const },
  { label: '医院/科研', value: '24', unit: '家', tone: 'success' as const },
  { label: '待审核', value: '4', unit: '人', tone: 'warning' as const },
];

const columns = [
  { title: '开发者', dataIndex: 'name', key: 'name', width: 220 },
  { title: '单位', dataIndex: 'org', key: 'org' },
  { title: '类型', dataIndex: 'type', key: 'type', width: 120 },
  { title: '上架服务', dataIndex: 'count', key: 'count', width: 100 },
  { title: '本月调用', dataIndex: 'calls', key: 'calls', width: 120 },
  { title: '注册时间', dataIndex: 'createdAt', key: 'createdAt', width: 140 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 110 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 200 },
];

const devs = [
  { id: '1', name: '张三', account: 'zhangsan@deepseek', org: '深度求索（北京）科技有限公司', type: 'AI厂商', count: 4, calls: '184,320', createdAt: '2023-08-15', status: '正常' },
  { id: '2', name: '李四', account: 'lisi@yunzhisheng', org: '云知声智能科技股份有限公司', type: 'AI厂商', count: 6, calls: '128,920', createdAt: '2023-09-22', status: '正常' },
  { id: '3', name: '王五', account: 'wangwu@huiyi', org: '北京汇医慧影医疗科技有限公司', type: 'AI厂商', count: 3, calls: '62,180', createdAt: '2023-11-08', status: '正常' },
  { id: '4', name: '赵六', account: 'zhaoliu@gulou', org: '南京鼓楼医院', type: '医院/科研', count: 5, calls: '38,920', createdAt: '2024-01-15', status: '正常' },
  { id: '5', name: '孙七', account: 'sunqi@zhongda', org: '东南大学附属中大医院', type: '医院/科研', count: 2, calls: '12,580', createdAt: '2024-02-20', status: '待审核' },
  { id: '6', name: '周八', account: 'zhouba@alibaba', org: '阿里巴巴达摩院', type: 'AI厂商', count: 1, calls: '8,420', createdAt: '2024-03-10', status: '正常' },
  { id: '7', name: '吴九', account: 'wujiu@jsph', org: '江苏省人民医院', type: '医院/科研', count: 3, calls: '6,840', createdAt: '2024-04-05', status: '正常' },
  { id: '8', name: '钱十', account: 'qianshi@zero', org: '零氪科技（北京）有限公司', type: 'AI厂商', count: 1, calls: '4,520', createdAt: '2024-05-18', status: '待审核' },
];

const filteredDevs = computed(() => {
  const { keyword: k, type, status } = applied.value;
  return devs.filter((d) => {
    if (k && !d.name.includes(k) && !d.org.includes(k)) return false;
    if (type && d.type !== type) return false;
    if (status && d.status !== status) return false;
    return true;
  });
});

function onView(record: any) {
  viewDrawer.value = { visible: true, record };
}
function onApprove(record: any) { message.success(`${record.name} 已通过审核`); }
function onEdit(record: any) {
  editModal.value = { visible: true, record: { ...record } };
}
function onDisable(record: any) { message.warning(`已停用 ${record.name}`); }

const viewDrawer = ref<{ visible: boolean; record: any }>({ visible: false, record: null });
const editModal = ref<{ visible: boolean; record: any }>({ visible: false, record: null });

function confirmEdit() {
  message.success(`开发者「${editModal.value.record?.name}」信息已更新`);
  editModal.value.visible = false;
}
</script>
