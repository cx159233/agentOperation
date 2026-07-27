<template>
  <a-config-provider :theme="themeConfig" :locale="zhCN">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { theme as antdTheme } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

const themeConfig = {
  token: {
    colorPrimary: '#165DFF',
    colorInfo: '#165DFF',
    colorSuccess: '#16A34A',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorLink: '#165DFF',
    borderRadius: 6,
    fontFamily: '"PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", "Hiragino Sans GB", "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: 14,
  },
  components: {
    Table: {
      headerBg: '#FAFBFC',
      headerColor: 'rgba(0, 0, 0, 0.85)',
      headerSortActiveBg: '#F2F3F5',
      borderColor: '#e8e8e8',
      rowHoverBg: '#FAFBFC',
      rowSelectedBg: '#E8F3FF',
      rowSelectedHoverBg: '#BEDAFF',
      footerColor: 'rgba(0, 0, 0, 0.85)',
      cellPaddingBlock: 16,
      cellPaddingInline: 16,
      cellFontSize: 14,
    },
  },
  algorithm: antdTheme.defaultAlgorithm,
};
</script>
