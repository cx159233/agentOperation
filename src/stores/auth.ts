import { defineStore } from 'pinia';
import type { AuthRole, UserInfo } from '../types';

const STORAGE_KEY = 'ai-platform-auth';

const roleUsers: Record<AuthRole, UserInfo> = {
  org: { name: '张三', orgName: '常州市人民医院', avatarText: '张', roleLabel: '机构用户' },
  admin: { name: '李四', orgName: '江苏省医保局', avatarText: '李', roleLabel: '运营管理' },
  developer: { name: '王五', orgName: '智联AI科技有限公司', avatarText: '王', roleLabel: '开发者' },
  endUser: { name: '赵医生', orgName: '常州市人民医院', avatarText: '赵', roleLabel: '终端用户' },
};

export const roleHomePath: Record<AuthRole, string> = {
  org: '/org-workbench',
  admin: '/admin/workbench',
  developer: '/developer-center',
  endUser: '/terminal-user',
};

type PersistedState = { role: AuthRole; userInfo: UserInfo };

function loadFromStorage(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (parsed?.role && parsed?.userInfo) return parsed;
    return null;
  } catch {
    return null;
  }
}

function saveToStorage(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const persisted = loadFromStorage();
    return {
      role: persisted?.role ?? null,
      userInfo: persisted?.userInfo ?? null,
    } as { role: AuthRole | null; userInfo: UserInfo | null };
  },
  getters: {
    isAuthenticated: (state) => state.role !== null && state.userInfo !== null,
  },
  actions: {
    login(role: AuthRole) {
      this.role = role;
      this.userInfo = roleUsers[role];
      saveToStorage({ role, userInfo: roleUsers[role] });
    },
    switchRole(role: AuthRole) {
      this.role = role;
      this.userInfo = roleUsers[role];
      saveToStorage({ role, userInfo: roleUsers[role] });
    },
    logout() {
      this.role = null;
      this.userInfo = null;
      clearStorage();
    },
  },
});
