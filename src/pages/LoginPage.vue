<template>
  <div class="min-h-[calc(100vh-60px)] bg-[#0B1120] grid place-items-center px-[20px] py-[40px] relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 opacity-[0.15] pointer-events-none">
      <div class="absolute -top-[60px] -right-[60px] w-[420px] h-[420px] rounded-full" style="background: radial-gradient(circle, #165DFF 0%, transparent 70%); filter: blur(40px);" />
      <div class="absolute bottom-[-100px] left-[10%] w-[380px] h-[380px] rounded-full" style="background: radial-gradient(circle, #13B8C6 0%, transparent 70%); filter: blur(50px);" />
    </div>
    <div class="absolute inset-0 opacity-[0.06] pointer-events-none" style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 56px 56px;" />

    <div class="relative w-full max-w-[440px]">
      <!-- Logo & 标题 -->
      <div class="text-center mb-[28px] text-white">
        <div class="w-[56px] h-[56px] mx-auto rounded-[12px] bg-primary grid place-items-center mb-[14px] shadow-card-hover">
          <RobotOutlined class="text-[28px] text-white" />
        </div>
        <div class="text-[22px] font-bold">AI与智能体服务管理平台</div>
        <div class="mt-[6px] text-[12px] text-white/60">江苏省医保数据赋能实验室</div>
      </div>

      <!-- 登录卡片 -->
      <div class="bg-surface rounded-[10px] border border-border p-[28px]" style="box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);">
        <div class="text-[18px] font-semibold text-text-primary mb-[4px]">欢迎登录</div>
        <div class="text-[12px] text-text-secondary mb-[20px]">请选择您的角色进入对应工作台</div>

        <a-form layout="vertical" :model="form" @finish="onLogin">
          <a-form-item label="账号" name="account" :rules="[{ required: true, message: '请输入账号' }]">
            <a-input v-model:value="form.account" size="large" placeholder="请输入账号 / 手机号">
              <template #prefix><UserOutlined class="text-text-tertiary" /></template>
            </a-input>
          </a-form-item>

          <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
            <a-input-password v-model:value="form.password" size="large" placeholder="请输入密码">
              <template #prefix><LockOutlined class="text-text-tertiary" /></template>
            </a-input-password>
          </a-form-item>

          <a-form-item label="登录角色" name="role" :rules="[{ required: true, message: '请选择登录角色' }]">
            <div class="grid grid-cols-3 gap-[8px]">
              <div
                v-for="r in roleOptions"
                :key="r.value"
                class="cursor-pointer rounded-[6px] border p-[12px] text-center transition"
                :class="form.role === r.value ? 'border-primary bg-primary-50' : 'border-border hover:border-primary-light hover:bg-bg-soft'"
                @click="selectRole(r.value)"
              >
                <component :is="r.icon" class="text-[20px]" :class="form.role === r.value ? 'text-primary' : 'text-text-secondary'" />
                <div class="mt-[4px] text-[11px] font-semibold" :class="form.role === r.value ? 'text-primary' : 'text-text-primary'">{{ r.label }}</div>
                <div class="text-[10px] text-text-tertiary mt-[2px]">{{ r.desc }}</div>
              </div>
            </div>
          </a-form-item>

          <div class="flex items-center justify-between mb-[14px]">
            <a-checkbox v-model:checked="form.remember">记住我</a-checkbox>
            <a class="text-[12px] text-primary">忘记密码？</a>
          </div>

          <a-button type="primary" html-type="submit" size="large" block :loading="loading" class="!h-[42px] !font-semibold">登 录</a-button>
        </a-form>

        <a-alert class="mt-[14px]" type="info" show-icon>
          <template #message>
            演示环境：已为当前角色预置账号
            <span class="font-mono text-primary">{{ demoCreds.account }}</span>
            / 密码
            <span class="font-mono text-primary">{{ demoCreds.password }}</span>
            ，点击登录即可进入对应工作台
          </template>
        </a-alert>

        <div class="mt-[14px] text-center text-[12px] text-text-secondary">
          还没有账号？
          <router-link to="/onboarding" class="text-primary font-semibold">申请入驻</router-link>
        </div>
      </div>

      <div class="mt-[16px] text-center">
        <router-link to="/portal" class="text-[12px] text-white/60 hover:text-white">← 返回门户首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { RobotOutlined, UserOutlined, LockOutlined, HomeOutlined, CodeOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue';
import { useAuthStore, roleHomePath } from '../stores/auth';
import type { AuthRole } from '../types';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const form = ref({
  account: 'org@dongtai-hosp',
  password: 'demo123456',
  role: 'org' as AuthRole,
  remember: true,
});

const loading = ref(false);

const roleOptions: { value: AuthRole; label: string; desc: string; icon: any; account: string; password: string }[] = [
  { value: 'org', label: '机构用户', desc: '医疗机构', icon: HomeOutlined, account: 'org@dongtai-hosp', password: 'demo123456' },
  { value: 'developer', label: '开发者', desc: 'AI 厂商', icon: CodeOutlined, account: 'dev@deepseek', password: 'demo123456' },
  { value: 'admin', label: '运营管理', desc: '医保局及指定运营单位', icon: SafetyCertificateOutlined, account: 'admin@jscnylab', password: 'demo123456' },
];

const demoCreds = computed(() => roleOptions.find((r) => r.value === form.value.role)!);

function selectRole(r: AuthRole) {
  form.value.role = r;
  const opt = roleOptions.find((x) => x.value === r);
  if (opt) {
    form.value.account = opt.account;
    form.value.password = opt.password;
  }
}

function onLogin() {
  loading.value = true;
  setTimeout(() => {
    auth.login(form.value.role);
    message.success(`欢迎回来，${auth.userInfo?.name}`);
    const redirect = route.query.redirect as string | undefined;
    router.push(redirect && !redirect.includes('/login') ? redirect : roleHomePath[form.value.role]);
    loading.value = false;
  }, 600);
}
</script>
