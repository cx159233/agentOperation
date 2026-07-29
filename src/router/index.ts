import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore, roleHomePath } from '../stores/auth';
import type { AuthRole } from '../types';

const router = createRouter({
  history: createWebHashHistory('/'),
  routes: [
    { path: '/', redirect: '/portal' },

    // ========== Public 路由（PublicLayout，无需登录） ==========
    {
      path: '/',
      component: () => import('../components/layout/PublicLayout.vue'),
      children: [
        { path: 'portal', name: 'Portal', component: () => import('../pages/PortalPage.vue'), meta: { title: '门户首页' } },
        { path: 'login', name: 'Login', component: () => import('../pages/LoginPage.vue'), meta: { title: '登录' } },
        { path: 'onboarding', name: 'Onboarding', component: () => import('../pages/DeveloperOnboardingPage.vue'), meta: { title: '开发者入驻' } },
      ],
    },

    // ========== 机构工作台（WorkspaceLayout，role=org） ==========
    {
      path: '/org-workbench',
      component: () => import('../components/layout/WorkspaceLayout.vue'),
      meta: { requiresAuth: true, role: 'org' },
      children: [
        { path: '', name: 'OrgWorkbench', component: () => import('../pages/org/OrgWorkbenchIndexPage.vue'), meta: { title: '工作台总览' } },
        { path: 'model-plaza', name: 'ModelPlaza', component: () => import('../pages/ServiceHallPage.vue'), meta: { title: '模型广场' } },
        { path: 'model-plaza/:id', name: 'ModelPlazaDetail', component: () => import('../pages/ServiceDetailPage.vue'), meta: { title: '服务详情' } },
        { path: 'subscriptions', name: 'OrgSubscriptions', component: () => import('../pages/org/SubscriptionsPage.vue'), meta: { title: '服务订阅管理' } },
        { path: 'quota', name: 'OrgQuota', component: () => import('../pages/org/QuotaPage.vue'), meta: { title: '用量配额管理' } },
        { path: 'billing', redirect: '/org-workbench/bills' },
        { path: 'bills', name: 'OrgBills', component: () => import('../pages/org/BillPage.vue'), meta: { title: '账单管理' } },
        { path: 'billing/detail', name: 'OrgBillingDetail', component: () => import('../pages/org/BillingQueryPage.vue'), meta: { title: '用量明细' } },
        { path: 'members', name: 'OrgMembers', component: () => import('../pages/org/MemberMgmtPage.vue'), meta: { title: '机构子账户' } },
      ],
    },

    // ========== 开发者中心（WorkspaceLayout，role=developer） ==========
    {
      path: '/developer-center',
      component: () => import('../components/layout/WorkspaceLayout.vue'),
      meta: { requiresAuth: true, role: 'developer' },
      children: [
        { path: '', name: 'DeveloperCenter', component: () => import('../pages/DeveloperCenterPage.vue'), meta: { title: '开发者总览' } },
        { path: 'listing', name: 'DeveloperListing', component: () => import('../pages/developer/ListingMgmtPage.vue'), meta: { title: '服务上架' } },
        { path: 'listing/create', name: 'DeveloperListingCreate', component: () => import('../pages/developer/CreateListingPage.vue'), meta: { title: '新增上架申请' } },
        { path: 'testing', name: 'DeveloperTesting', component: () => import('../pages/developer/TestingPage.vue'), meta: { title: '服务整改' } },
        { path: 'revenue', name: 'DeveloperRevenue', component: () => import('../pages/developer/RevenuePage.vue'), meta: { title: '账单管理' } },
        { path: 'revenue/:id', name: 'DeveloperBillDetail', component: () => import('../pages/developer/BillDetailPage.vue'), meta: { title: '账单明细' } },
        { path: 'billing/detail', name: 'DeveloperBillingDetail', component: () => import('../pages/developer/BillingDetailPage.vue'), meta: { title: '用量明细' } },
      ],
    },

    // ========== 管理中心（WorkspaceLayout，role=admin） ==========
    {
      path: '/admin',
      component: () => import('../components/layout/WorkspaceLayout.vue'),
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        { path: '', redirect: '/admin/workbench' },
        { path: 'workbench', name: 'OperationsWorkbench', component: () => import('../pages/admin/OperationsWorkbenchPage.vue'), meta: { title: '运营工作台' } },
        { path: 'model-catalog', name: 'ModelCatalog', component: () => import('../pages/ModelCatalogPage.vue'), meta: { title: '模型资源' } },
        { path: 'resource/data', name: 'DataResource', component: () => import('../pages/DataResourcePage.vue'), meta: { title: '数据资源' } },
        { path: 'resource/knowledge', name: 'KnowledgeSystem', component: () => import('../pages/KnowledgeSystemPage.vue'), meta: { title: '知识体系' } },
        { path: 'resource/tools', name: 'PlatformTools', component: () => import('../pages/PlatformToolsPage.vue'), meta: { title: '平台工具' } },
        { path: 'billing', name: 'Billing', component: () => import('../pages/BillingDashboardPage.vue'), meta: { title: '词元计费配置' } },
        // 交易结算
        { path: 'reconciliation/calls', name: 'ReconciliationCalls', component: () => import('../pages/admin/reconciliation/CallDetailsPage.vue'), meta: { title: '用量明细查询' } },
        { path: 'reconciliation/bills', name: 'ReconciliationBills', component: () => import('../pages/admin/reconciliation/PeriodBillsPage.vue'), meta: { title: '周期账单管理' } },
        { path: 'reconciliation/bills/:id', name: 'BillDetail', component: () => import('../pages/admin/reconciliation/BillDetailPage.vue'), meta: { title: '账单明细' } },
        { path: 'reconciliation/exceptions', name: 'ReconciliationExceptions', component: () => import('../pages/admin/reconciliation/ExceptionsPage.vue'), meta: { title: '异常对账管理' } },
        // 运营管理
        { path: 'operations/access', redirect: '/admin/operations/service-access' },
        { path: 'operations/service-access', name: 'OperationsServiceAccess', component: () => import('../pages/admin/operations/ServiceAccessPage.vue'), meta: { title: '服务上架审核' } },
        { path: 'operations/org-access', name: 'OperationsOrgAccess', component: () => import('../pages/admin/operations/OrgAccessPage.vue'), meta: { title: '机构入驻审核' } },
        { path: 'operations/subscription-audit', name: 'OperationsSubscriptionAudit', component: () => import('../pages/admin/operations/SubscriptionAuditPage.vue'), meta: { title: '服务订阅审核' } },
        { path: 'operations/service-provisioning', name: 'OperationsServiceProvisioning', component: () => import('../pages/admin/operations/ServiceProvisioningPage.vue'), meta: { title: '服务开通管理' } },
        { path: 'operations/monitoring', name: 'OperationsMonitoring', component: () => import('../pages/admin/operations/MonitoringPage.vue'), meta: { title: '调用日志' } },
        { path: 'operations/quality', name: 'OperationsQuality', component: () => import('../pages/admin/operations/QualityPage.vue'), meta: { title: '质量考核管理' } },
        { path: 'operations/audit', redirect: '/admin/operations/audit/operation' },
        { path: 'operations/audit/operation', name: 'OperationLogs', component: () => import('../pages/admin/operations/AuditPage.vue'), meta: { title: '操作日志' } },
        { path: 'operations/audit/login', name: 'LoginLogs', component: () => import('../pages/admin/operations/LoginLogPage.vue'), meta: { title: '登录日志' } },
        // 数据分析
        { path: 'ops-analytics', name: 'OpsAnalytics', component: () => import('../pages/OpsAnalyticsPage.vue'), meta: { title: '运行监测分析' } },
        // 机构管理
        { path: 'developer-mgmt', name: 'DeveloperMgmt', component: () => import('../pages/DeveloperMgmtPage.vue'), meta: { title: '开发者管理' } },
        { path: 'user-mgmt', name: 'UserMgmt', component: () => import('../pages/UserMgmtPage.vue'), meta: { title: '用户管理' } },
        // 系统管理
        { path: 'settings', name: 'Settings', component: () => import('../pages/SettingsPage.vue'), meta: { title: '字典管理' } },
        { path: 'settings/audit', name: 'AuditConfig', component: () => import('../pages/AuditConfigPage.vue'), meta: { title: '审核配置' } },
        { path: 'org-mgmt', name: 'OrgMgmt', component: () => import('../pages/admin/OrgMgmt/OrgListPage.vue'), meta: { title: '机构列表' } },
        { path: 'org-mgmt/:orgKey/detail', name: 'OrgDetail', component: () => import('../pages/admin/OrgMgmt/OrgDetailPage.vue'), meta: { title: '机构用户详情' } },
        { path: 'org-users', name: 'OrgUsers', component: () => import('../pages/admin/OrgMgmt/OrgUserListPage.vue'), meta: { title: '用户列表' } },
      ],
    },

    { path: '/:pathMatch(.*)*', redirect: '/portal' },
  ],
});

// 路由守卫
router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();

  // 找到最近一层带 meta 的路由
  const matched = to.matched.find((r) => r.meta?.requiresAuth);
  if (!matched) {
    // 公开页面：已登录用户访问 /login 时跳转到自己工作台
    if (to.path === '/login' && auth.isAuthenticated && auth.role) {
      next(roleHomePath[auth.role]);
      return;
    }
    next();
    return;
  }

  // 需要登录
  if (!auth.isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath } });
    return;
  }

  // 角色不匹配：跳到自己工作台
  const requiredRole = matched.meta.role as AuthRole | undefined;
  const currentRole = auth.role;
  if (requiredRole && currentRole && currentRole !== requiredRole) {
    next(roleHomePath[currentRole]);
    return;
  }

  next();
});

export default router;
