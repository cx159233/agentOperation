<template>
  <a-config-provider :theme="themeConfig" :locale="zhCN">
    <!-- PRD 双屏模式 -->
    <div v-if="showPrd" class="main-layout">
      <div class="demo-panel">
        <router-view />
      </div>
      <div class="prd-divider" @click="prdVisible = !prdVisible" title="点击展开/收起PRD面板">
        <div class="prd-divider-line"></div>
        <div class="prd-divider-btn">
          <svg class="w-3.5 h-3.5" :class="{ 'rotate-180': prdVisible }" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span class="prd-divider-text">PRD</span>
        </div>
        <div class="prd-divider-line"></div>
      </div>
      <transition name="prd-panel">
        <div v-if="prdVisible" class="prd-panel">
          <div class="prd-header">
            <div class="prd-title">
              <svg class="w-4 h-4 text-primary" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/></svg>
              <span class="font-semibold text-sm" style="color:#333">产品需求文档</span>
              <span class="text-xs text-font-gray-400 bg-gray-100 px-2 py-0.5 rounded" style="color:#999">{{ prdPageName }}</span>
            </div>
            <div class="prd-header-actions">
              <button class="prd-export-btn" @click="exportWord" title="导出 Word">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 6l3 3 3-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 10v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
                <span>导出PRD</span>
              </button>
              <div class="prd-close" @click="prdVisible = false">
                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </div>
            </div>
          </div>
          <div class="prd-content">
            <div class="prd-doc" v-html="prdContent"></div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 普通模式（无PRD分屏） -->
    <router-view v-else />
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { theme as antdTheme } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { getAllPrdHtml, shouldShowPrd, getPrdAnchor, getPrdPageName } from './data/prd';
import { dialogAnchor } from './composables/usePrdAnchor';

const route = useRoute();

// ════════════════════════════════════════════════════════════
// PRD 功能开关：true=启用分屏，false=隐藏PRD入口与面板
// ════════════════════════════════════════════════════════════
const PRD_ENABLED = true;

const mvpV2Paths = ['/admin/model-catalog-v2', '/admin/operations/service-provisioning-v2'];
const currentPath = computed(() => route.path);
const prdVisible = ref(mvpV2Paths.includes(route.path));

// MVP V2 页面进入时默认展开 PRD 面板
watch(currentPath, (path) => {
  if (mvpV2Paths.includes(path)) {
    prdVisible.value = true;
  }
});
const isEdit = computed(() => !!route.query.id);
const prdContent = computed(() => getAllPrdHtml());

const showPrd = computed(() => {
  return PRD_ENABLED && shouldShowPrd(currentPath.value || '');
});

const prdPageName = computed(() => {
  return getPrdPageName(currentPath.value || '', isEdit.value);
});

// 锚点滚动（弹窗锚点优先，其次路由锚点）
function scrollToAnchor() {
  const anchor = dialogAnchor.value || getPrdAnchor(currentPath.value || '', isEdit.value);
  if (!anchor) return;
  nextTick(() => {
    requestAnimationFrame(() => {
      const el = document.getElementById(anchor);
      if (el) {
        el.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    });
  });
}

// 路由切换时滚动PRD到对应锚点（同时监听 path 和 query.id 以区分新增/编辑）
watch([currentPath, () => route.query.id], () => {
  dialogAnchor.value = '' // 路由切换时清除弹窗锚点，使用路由锚点
  if (prdVisible.value) {
    nextTick(() => {
      setTimeout(() => scrollToAnchor(), 100);
    });
  }
});

// 弹窗/抽屉打开时滚动PRD到对应章节
watch(dialogAnchor, (anchor) => {
  if (anchor && prdVisible.value) {
    nextTick(() => {
      setTimeout(() => scrollToAnchor(), 100);
    });
  }
});

// 展开PRD面板时滚动
watch(prdVisible, (v) => {
  if (v) {
    setTimeout(() => scrollToAnchor(), 350);
  }
});

// 首次加载时若 PRD 面板已展开，执行锚点滚动
onMounted(() => {
  if (prdVisible.value) {
    setTimeout(() => scrollToAnchor(), 350);
  }
});

// 导出Word
function exportWord() {
  let html = prdContent.value;
  html = html.replace(/<h3\s+id="prd-([\d.]+)"([^>]*)>([\s\S]*?)<\/h3>/g, (_match: string, num: string, attrs: string, content: string) => {
    const segments = num.split('.').length;
    const level = Math.min(segments + 1, 6);
    if (level === 3) return _match;
    return `<h${level} id="prd-${num}"${attrs}>${content}</h${level}>`;
  });

  const wordHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>产品需求文档</title>
<!--[if gte mso 9]><xml>
<w:WordDocument>
  <w:View>Print</w:View>
  <w:Zoom>100</w:Zoom>
  <w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml><![endif]-->
<style>
  @page WordSection1 {
    size: 595.3pt 841.9pt;
    margin: 72pt 90pt 72pt 90pt;
    mso-header-margin: 35.4pt;
    mso-footer-margin: 35.4pt;
    mso-paper-source: 0;
  }
  div.WordSection1 { page: WordSection1; }
  body, h1, h2, h3, h4, h5, h6, p, th, td, li, strong, span, a, div {
    font-family: '微软雅黑', 'Microsoft YaHei', Arial, sans-serif;
  }
  h1 { font-size: 22px; font-weight: 700; border-bottom: 2px solid #035BFE; padding-bottom: 12px; margin-bottom: 20px; }
  h2 { font-size: 17px; font-weight: 600; border-left: 3px solid #035BFE; padding-left: 10px; margin-top: 24px; margin-bottom: 12px; }
  h3 { font-size: 15px; font-weight: 600; margin-top: 16px; margin-bottom: 8px; }
  h4 { font-size: 14px; font-weight: 600; margin-top: 14px; margin-bottom: 6px; }
  h5 { font-size: 13px; font-weight: 600; margin-top: 12px; margin-bottom: 6px; }
  h6 { font-size: 12px; font-weight: 600; margin-top: 10px; margin-bottom: 4px; }
  p { margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
  th { background: #f5f7fa; padding: 8px 12px; text-align: left; border: 1px solid #e8ecf0; font-weight: 600; }
  td { padding: 8px 12px; border: 1px solid #e8ecf0; }
  pre { background: #f5f7fa; padding: 12px; font-family: 'Courier New', Courier, monospace; font-size: 12px; line-height: 1.8; }
</style>
</head>
<body>
<div class="WordSection1">${html}</div>
</body>
</html>`;

  const blob = new Blob(['﻿' + wordHtml], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '产品需求文档.doc';
  a.click();
  URL.revokeObjectURL(url);
}

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

<style>
/* ════════════════════════════════════════════════════════════
   PRD 双屏布局
   ════════════════════════════════════════════════════════════ */
.main-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.demo-panel {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  position: relative;
  transform: translateZ(0); /* 创建新的 fixed 定位包含块，限制弹窗/抽屉遮罩在 demo 区域内 */
}

/* ── PRD 分隔条 ── */
.prd-divider {
  width: 28px;
  flex-shrink: 0;
  cursor: pointer;
  background: #f8fafc;
  border-left: 1px solid #e8ecf0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 51;
  transition: background 0.2s;
}
.prd-divider:hover {
  background: #eef3ff;
}
.prd-divider-line {
  width: 1px;
  flex: 1;
  background: #e2e8f0;
}
.prd-divider-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 4px;
  color: #035BFE;
  transition: background 0.2s;
}
.prd-divider:hover .prd-divider-btn {
  background: rgba(3, 91, 254, 0.08);
}
.prd-divider-btn svg {
  transition: transform 0.3s;
}
.prd-divider-btn svg.rotate-180 {
  transform: rotate(180deg);
}
.prd-divider-text {
  font-size: 10px;
  font-weight: 600;
  color: #035BFE;
  writing-mode: vertical-lr;
  letter-spacing: 2px;
}

/* ── PRD 面板 ── */
.prd-panel {
  width: 480px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: white;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.08);
}

.prd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e8ecf0;
  flex-shrink: 0;
}

.prd-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.prd-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.prd-export-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid #d4e5ff;
  border-radius: 4px;
  background: #eef6ff;
  color: #035BFE;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.prd-export-btn:hover {
  background: #d4e5ff;
  border-color: #035BFE;
}

.prd-close {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  color: #999;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.2s;
}
.prd-close:hover {
  background: #f5f7fa;
  color: #035BFE;
}

.prd-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* ── PRD 文档样式 ── */
.prd-doc {
  color: #333;
  font-size: 14px;
  line-height: 1.8;
}

.prd-doc h1 {
  font-size: 22px;
  line-height: 1.8;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #035BFE;
}

.prd-doc h2 {
  font-size: 17px;
  line-height: 1.8;
  font-weight: 600;
  color: #1a1a1a;
  margin-top: 24px;
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 3px solid #035BFE;
}

.prd-doc h3 {
  font-size: 15px;
  line-height: 1.8;
  font-weight: 600;
  color: #333;
  margin-top: 16px;
  margin-bottom: 8px;
}

.prd-doc p {
  margin-bottom: 12px;
  color: #555;
}

.prd-doc strong {
  color: #1a1a1a;
}

.prd-doc table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 13px;
}

.prd-doc th {
  background: #f5f7fa;
  padding: 8px 12px;
  text-align: left;
  border: 1px solid #e8ecf0;
  font-weight: 600;
  color: #333;
}

.prd-doc td {
  padding: 8px 12px;
  border: 1px solid #e8ecf0;
  color: #555;
}

.prd-doc ul {
  padding-left: 20px;
  margin-bottom: 12px;
}

.prd-doc li {
  margin-bottom: 6px;
  color: #555;
}

/* ── PRD 面板过渡动画 ── */
.prd-panel-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.prd-panel-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.prd-panel-enter-from,
.prd-panel-leave-to {
  width: 0 !important;
  opacity: 0;
  overflow: hidden;
}
</style>
