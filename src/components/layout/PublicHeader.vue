<template>
  <header class="sticky top-0 z-50 h-[60px] bg-surface border-b border-border flex items-center px-[40px]">
    <!-- Logo -->
    <router-link to="/portal" class="flex items-center gap-[10px] shrink-0">
      <div class="w-[30px] h-[30px] rounded-[6px] bg-primary grid place-items-center">
        <RobotOutlined class="text-[17px] text-white" />
      </div>
      <div class="leading-[1.2]">
        <div class="text-[14px] font-semibold text-text-primary">AI与智能体服务管理平台</div>
        <div class="text-[10px] text-text-tertiary">江苏省医保数据赋能实验室</div>
      </div>
    </router-link>

    <!-- 主导航 -->
    <nav class="ml-[36px] flex items-center gap-[4px]">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="px-[14px] py-[6px] rounded-[6px] text-[13px] font-medium transition"
        :class="isActive(item.path) ? 'bg-primary-50 text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-bg-soft'"
      >
        {{ item.label }}
      </router-link>
    </nav>

    <!-- 右侧用户区 -->
    <div class="ml-auto flex items-center gap-[12px]">
      <template v-if="auth.isAuthenticated">
        <a-dropdown>
          <div class="flex items-center gap-[8px] cursor-pointer px-[10px] py-[5px] rounded-[6px] hover:bg-bg-soft">
            <div class="w-[28px] h-[28px] rounded-full grid place-items-center text-[12px] font-bold text-white" style="background: linear-gradient(135deg, #165DFF, #0E42D2);">{{ auth.userInfo?.avatarText }}</div>
            <div class="leading-[1.2]">
              <div class="text-[12px] font-semibold text-text-primary">{{ auth.userInfo?.name }}</div>
              <div class="text-[10px] text-text-tertiary">{{ auth.userInfo?.roleLabel }}</div>
            </div>
            <DownOutlined class="text-[10px] text-text-tertiary" />
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="goWorkspace">进入工作台</a-menu-item>
              <a-menu-divider />
              <a-menu-item @click="onLogout">退出登录</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
      <template v-else>
        <router-link to="/login" class="px-[14px] py-[6px] text-[13px] font-medium text-text-secondary hover:text-primary">登录</router-link>
        <router-link to="/onboarding" class="px-[14px] py-[6px] rounded-[6px] bg-primary text-white text-[13px] font-medium hover:bg-primary-600">申请入驻</router-link>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { RobotOutlined, DownOutlined } from '@ant-design/icons-vue';
import { useAuthStore, roleHomePath } from '../../stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const navItems = [
  { label: '门户首页', path: '/portal' },
];

function isActive(path: string) {
  if (path === '/portal') return route.path === '/portal';
  return false;
}

function goWorkspace() {
  if (auth.role) router.push(roleHomePath[auth.role]);
}

function onLogout() {
  auth.logout();
  router.push('/portal');
}
</script>
