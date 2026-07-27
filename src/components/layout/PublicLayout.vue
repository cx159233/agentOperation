<template>
  <div class="min-h-screen bg-bg flex flex-col">
    <PublicHeader />
    <main class="flex-1">
      <router-view />
    </main>
    <footer class="bg-[#0B1120] text-white/60 text-[12px] py-[18px] px-[40px] flex items-center justify-between">
      <div>
        <span class="text-white/80 font-semibold">AI与智能体服务管理平台</span>
        <span class="ml-[12px]">© 2026 江苏省医保数据赋能实验室</span>
      </div>
      <div class="flex gap-[16px]">
        <span>苏ICP备 2024000001 号</span>
        <span>联系我们：support@jsyb-ai.cn</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import PublicHeader from './PublicHeader.vue';
</script>
