// 机构子账户/成员管理数据

export type MemberRole = '管理员' | '调用员' | '审核员' | '财务';

export type MemberStatus = '启用' | '禁用';

export type OrgMember = {
  id: string;
  name: string;
  account: string;
  role: MemberRole;
  department: string;
  services: string[];
  apiKey: string;
  apiKeyStatus: '正常' | '已禁用' | '已过期';
  status: MemberStatus;
  lastLogin: string;
  createdAt: string;
  ipWhitelist?: string;
};

export const orgMembers: OrgMember[] = [
  {
    id: 'm-001',
    name: '张三',
    account: 'zhang.san',
    role: '管理员',
    department: '信息科',
    services: ['AI健康助手', '病历文书规范稽核智能体', '肺结节CT图像辅助检测', '远程心电AI诊断'],
    apiKey: 'sk-org-********************a1b2',
    apiKeyStatus: '正常',
    status: '启用',
    lastLogin: '2024-07-17 09:42',
    createdAt: '2024-01-15 10:00',
    ipWhitelist: '10.2.3.0/24',
  },
  {
    id: 'm-002',
    name: '孙七',
    account: 'sun.qi',
    role: '调用员',
    department: '门诊办',
    services: ['AI健康助手', '病历文书规范稽核智能体'],
    apiKey: 'sk-org-********************c3d4',
    apiKeyStatus: '正常',
    status: '启用',
    lastLogin: '2024-07-16 11:30',
    createdAt: '2024-02-20 14:00',
  },
  {
    id: 'm-003',
    name: '周八',
    account: 'zhou.ba',
    role: '审核员',
    department: '医保办',
    services: ['病历文书规范稽核智能体'],
    apiKey: 'sk-org-********************e5f6',
    apiKeyStatus: '正常',
    status: '启用',
    lastLogin: '2024-07-15 16:45',
    createdAt: '2024-03-10 09:30',
  },
  {
    id: 'm-004',
    name: '郑十一',
    account: 'zheng.shiyi',
    role: '财务',
    department: '财务科',
    services: [],
    apiKey: '-',
    apiKeyStatus: '已禁用',
    status: '禁用',
    lastLogin: '2024-06-28 17:20',
    createdAt: '2024-04-05 11:00',
  },
  {
    id: 'm-005',
    name: '王十二',
    account: 'wang.shier',
    role: '调用员',
    department: '放射科',
    services: ['肺结节CT图像辅助检测', '骨密度CT影像辅助'],
    apiKey: 'sk-org-********************g7h8',
    apiKeyStatus: '正常',
    status: '启用',
    lastLogin: '2024-07-17 08:15',
    createdAt: '2024-05-12 10:30',
  },
];

export const memberRoleOptions: { label: string; value: MemberRole }[] = [
  { label: '管理员（可管理子账户、查看所有数据）', value: '管理员' },
  { label: '调用员（可调用授权范围内的服务）', value: '调用员' },
  { label: '审核员（可审核调用记录与异常）', value: '审核员' },
  { label: '财务（可查看账单与用量明细）', value: '财务' },
];
