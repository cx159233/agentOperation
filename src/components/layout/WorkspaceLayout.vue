<template>
  <div class="relative min-h-screen bg-bg">
    <Header />
    <WorkspaceSidebar />
    <main class="pt-[60px] ml-[220px] min-h-[calc(100vh-60px)]">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from './Header.vue';
import WorkspaceSidebar from './WorkspaceSidebar.vue';
</script>
