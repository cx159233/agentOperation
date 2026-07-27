<template>
  <aside class="absolute top-[60px] bottom-0 left-0 w-[220px] bg-white border-r border-border overflow-y-auto flex flex-col items-start p-0">
    <nav class="flex-1 py-[8px] px-[12px] w-full" aria-label="工作台菜单">
      <template v-for="(item, idx) in menus" :key="item.path">
        <template v-if="flatSidebar && item.children && item.children.length">
          <div class="px-[8px] pt-[12px] pb-[4px]">
            <span class="text-[11px] font-semibold text-text-tertiary tracking-wider">{{ item.label }}</span>
          </div>
          <router-link
            v-for="child in item.children"
            :key="child.path"
            :to="child.path"
            class="flex items-center h-[40px] mb-[2px] px-[8px] rounded-[6px] text-[14px] transition-all duration-200 overflow-hidden"
            :class="isActive(child.path) ? 'bg-[#f2f3f5] text-[#165DFF] font-medium' : 'text-text-secondary font-normal hover:bg-bg-soft hover:text-[#165DFF]'"
          >
            <span v-if="child.icon" class="w-[18px] h-[18px] flex items-center justify-center shrink-0 mr-[10px]">
              <component :is="iconMap[child.icon]" class="text-[16px] transition-colors" :class="isActive(child.path) ? 'text-[#165DFF]' : 'text-text-tertiary hover:text-[#165DFF]'" />
            </span>
            <span class="flex-1 truncate">{{ child.label }}</span>
          </router-link>
        </template>

        <div v-else-if="item.children && item.children.length" class="mb-[2px]">
          <button
            type="button"
            class="relative w-full flex items-center gap-[10px] h-[40px] px-[8px] rounded-[6px] text-[14px] transition-all duration-200 group overflow-hidden"
            :class="isParentActive(item) ? 'text-[#165DFF] font-medium' : 'text-text-secondary font-normal hover:bg-bg-soft hover:text-[#165DFF]'"
            @click="toggleExpand(item.path)"
          >
            <span class="w-[18px] h-[18px] flex items-center justify-center shrink-0">
              <component :is="iconMap[item.icon]" class="text-[16px] transition-colors" :class="isParentActive(item) ? 'text-[#165DFF]' : 'text-text-tertiary group-hover:text-[#165DFF]'" />
            </span>
            <span class="flex-1 text-left">{{ item.label }}</span>
            <DownOutlined class="text-[10px] transition-all duration-200 shrink-0" :class="[expandedSet.has(item.path) || isParentActive(item) ? 'rotate-180 text-[#165DFF]/70' : 'text-text-tertiary/60']" />
          </button>
          <div v-show="expandedSet.has(item.path) || isParentActive(item)" class="pt-[2px]">
            <router-link
              v-for="child in item.children"
              :key="child.path"
              :to="child.path"
              class="flex items-center h-[40px] mb-[2px] pl-[34px] pr-[8px] rounded-[6px] text-[14px] transition-all duration-200 overflow-hidden"
              :class="isActive(child.path) ? 'bg-[#f2f3f5] text-[#165DFF] font-medium' : 'text-text-secondary font-normal hover:bg-bg-soft hover:text-[#165DFF]'"
            >
              <span class="truncate">{{ child.label }}</span>
            </router-link>
          </div>
        </div>

        <router-link
          v-else
          :to="item.path"
          class="relative flex items-center gap-[10px] h-[40px] px-[8px] rounded-[6px] text-[14px] transition-all duration-200 group overflow-hidden mb-[2px]"
          :class="isActive(item.path) ? 'text-[#165DFF] font-medium' : 'text-text-secondary font-normal hover:bg-bg-soft hover:text-[#165DFF]'"
        >
          <span class="w-[18px] h-[18px] flex items-center justify-center shrink-0">
            <component :is="iconMap[item.icon]" class="text-[16px] transition-colors" :class="isActive(item.path) ? 'text-[#165DFF]' : 'text-text-tertiary group-hover:text-[#165DFF]'" />
          </span>
          <span>{{ item.label }}</span>
        </router-link>
      </template>
    </nav>

    <div class="shrink-wrapper flex flex-row justify-end items-center p-[12px] gap-[10px] w-[220px] h-[48px] bg-white border-t border-border-soft">
      <button
        type="button"
        class="w-[24px] h-[24px] bg-[#F7F8FA] rounded-[2px] grid place-items-center transition-colors hover:bg-bg-soft"
        @click="toggleSidebar"
      >
        <MenuUnfoldOutlined v-if="!collapsed" class="text-[16px] text-text-tertiary" />
        <MenuFoldOutlined v-else class="text-[16px] text-text-tertiary" />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  AppstoreOutlined,
  CalculatorOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  FolderOutlined,
  TeamOutlined,
  HomeOutlined,
  BarChartOutlined,
  FileSearchOutlined,
  CodeOutlined,
  DownOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  TableOutlined,
  FormOutlined,
  FileTextOutlined,
  ExceptionOutlined,
  DatabaseOutlined,
  FundOutlined,
  ControlOutlined,
  AuditOutlined,
  WalletOutlined,
  MonitorOutlined,
  BankOutlined,
} from '@ant-design/icons-vue';
import { roleSidebarMenus } from '../../data';
import { useAuthStore } from '../../stores/auth';
import type { RoleSidebarMenu, SidebarMenuIcon } from '../../types';

const route = useRoute();
const auth = useAuthStore();

const iconMap: Record<SidebarMenuIcon, any> = {
  service: AppstoreOutlined,
  token: CalculatorOutlined,
  ops: SafetyCertificateOutlined,
  setting: SettingOutlined,
  resource: FolderOutlined,
  user: TeamOutlined,
  portal: HomeOutlined,
  analytics: BarChartOutlined,
  reconciliation: FileSearchOutlined,
  developer: CodeOutlined,
  dashboard: DashboardOutlined,
  table: TableOutlined,
  form: FormOutlined,
  result: FileTextOutlined,
  exception: ExceptionOutlined,
  database: DatabaseOutlined,
  fund: FundOutlined,
  control: ControlOutlined,
  audit: AuditOutlined,
  wallet: WalletOutlined,
  monitor: MonitorOutlined,
  org: BankOutlined,
};

const menus = computed<RoleSidebarMenu[]>(() => {
  if (!auth.role) return [];
  return roleSidebarMenus[auth.role];
});

// 机构/开发者侧边栏平铺展示：一级菜单作为小字分组标题，二级菜单直接展开
const flatSidebar = computed(() => auth.role === 'org' || auth.role === 'developer');

const expandedSet = ref<Set<string>>(new Set());

function toggleExpand(path: string) {
  if (expandedSet.value.has(path)) {
    expandedSet.value.delete(path);
  } else {
    expandedSet.value.add(path);
  }
  expandedSet.value = new Set(expandedSet.value);
}

function isActive(path: string) {
  if (path === '/org-workbench' || path === '/developer-center' || path === '/admin') {
    return route.path === path;
  }
  return route.path === path || route.path.startsWith(path + '/');
}

function isParentActive(item: RoleSidebarMenu) {
  return item.children?.some((c) => isActive(c.path)) ?? false;
}

watch(
  () => route.path,
  (path) => {
    for (const item of menus.value) {
      if (item.children?.some((c) => path === c.path || path.startsWith(c.path + '/'))) {
        expandedSet.value.add(item.path);
      }
    }
    expandedSet.value = new Set(expandedSet.value);
  },
  { immediate: true },
);

// 侧边栏折叠功能（emit to parent if needed, currently self-contained）
const collapsed = ref(false);
function toggleSidebar() {
  collapsed.value = !collapsed.value;
  // TODO: 如果需要父组件响应，可以添加 emit
}
</script>
