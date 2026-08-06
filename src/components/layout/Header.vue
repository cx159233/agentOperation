<template>
  <header class="fixed top-0 left-0 right-0 z-30 h-[60px] flex items-center justify-between bg-surface border-b border-border px-[16px] py-[10px] shadow-[0_4px_10px_rgba(78,89,105,0.06)]">
    <!-- Logo + 平台名称 -->
    <div class="flex items-center gap-[12px] h-[32px]">
      <div class="w-[28px] h-[28px] grid place-items-center rounded-[6px] bg-primary">
        <CloudOutlined class="text-[16px] text-white" />
      </div>
      <div class="leading-none">
        <div class="text-[15px] font-semibold tracking-[-0.2px] text-text-primary">{{ platformTitle }}</div>
      </div>
    </div>

    <!-- 右侧操作 -->
    <div class="flex items-center gap-[10px]">
      <a-tooltip title="公告动态">
        <button class="relative w-[32px] h-[32px] grid place-items-center rounded-[6px] text-text-secondary hover:bg-bg-soft hover:text-primary transition">
          <BellOutlined class="text-[16px]" />
          <span class="absolute top-[6px] right-[6px] w-[6px] h-[6px] rounded-full bg-danger ring-2 ring-surface" />
        </button>
      </a-tooltip>

      <a-tooltip v-if="auth.role === 'org'" title="词元余量">
        <div class="flex items-center gap-[8px] px-[10px] h-[32px] rounded-[6px] bg-bg-soft border border-border-soft">
          <DatabaseOutlined class="text-[14px] text-primary" />
          <div class="text-[11px] leading-none">
            <div class="text-text-tertiary">词元余量</div>
            <div class="font-num font-semibold text-text-primary mt-[2px]">1,258,560,000</div>
          </div>
        </div>
      </a-tooltip>

      <div class="h-[20px] w-[1px] bg-border" />

      <a-dropdown placement="bottomRight">
        <button class="flex items-center gap-[8px] h-[32px] px-[6px] rounded-[6px] hover:bg-bg-soft transition">
          <a-avatar :size="28" style="background: linear-gradient(135deg, #165DFF, #0E42D2);">{{ auth.userInfo?.avatarText ?? '医' }}</a-avatar>
          <div class="text-left leading-none">
            <div class="text-[13px] font-semibold text-text-primary">{{ auth.userInfo?.name ?? '医小保' }}</div>
            <div class="text-[11px] text-text-tertiary mt-[2px]">{{ auth.userInfo?.orgName ?? '江苏省医保数据赋能实验室' }}</div>
          </div>
          <DownOutlined class="text-[11px] text-text-tertiary" />
        </button>
        <template #overlay>
          <a-menu>
            <a-menu-item key="settings"><SettingOutlined /> 账户设置</a-menu-item>
          <a-menu-divider />
          <div class="px-[8px] py-[6px]">
            <div class="text-[12px] text-text-tertiary mb-[4px]">点击切换演示用户</div>
          </div>
          <a-menu-item
            v-for="user in demoUsers"
            :key="user.role"
            :class="{ 'is-active': auth.role === user.role }"
            @click="switchUser(user)"
          >
            {{ user.orgName }} ({{ user.roleLabel }})
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="portal" @click="goPortal"><RollbackOutlined /> 返回门户</a-menu-item>
          <a-menu-item key="logout" @click="onLogout"><LogoutOutlined /> 退出登录</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { BellOutlined, DatabaseOutlined, DownOutlined, SettingOutlined, LogoutOutlined, RollbackOutlined, CloudOutlined, UserOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const platformTitle = computed(() =>
  auth.role === 'admin' ? '模型与智能体运营管理平台' : '模型与智能体运营服务平台',
);

// 演示用户切换列表
const demoUsers = [
  { role: 'org' as const, orgName: '常州市人民医院', roleLabel: '机构' },
  { role: 'developer' as const, orgName: '智联AI科技', roleLabel: '开发者' },
  { role: 'admin' as const, orgName: '江苏省医保局', roleLabel: '管理员' },
  { role: 'endUser' as const, orgName: '常州市人民医院', roleLabel: '终端用户' },
];

function goPortal() {
  router.push('/portal');
}

function switchUser(user: { role: 'org' | 'developer' | 'admin' | 'endUser', orgName: string, roleLabel: string }) {
  // 终端用户在新标签页中打开 HIS 界面，当前标签页角色不变
  if (user.role === 'endUser') {
    const href = router.resolve('/terminal-user').href;
    window.open(href, '_blank');
    return;
  }
  auth.switchRole(user.role);
  // 切换后默认跳转到对应角色的工作台
  const defaultRoutes: Record<string, string> = {
    org: '/org-workbench',
    developer: '/developer-center',
    admin: '/admin/workbench',
  };
  router.push(defaultRoutes[user.role]);
}

function onLogout() {
  auth.logout();
  router.push('/portal');
}
</script>
