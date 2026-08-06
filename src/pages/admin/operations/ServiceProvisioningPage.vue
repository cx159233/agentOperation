<template>
  <div class="p-[20px]">
    <PageHeader title="服务开通列表" description="查看全量机构已开通服务的额度、凭证与审核溯源信息，支持管理员代开通" />

    <!-- KPI -->
    <section class="grid grid-cols-4 gap-[14px] mb-[14px]">
      <StatCard label="总开通数" :value="kpi.total" tone="primary" delta="近30天 +2" iconTone="primary">
        <template #icon><AppstoreOutlined /></template>
      </StatCard>
      <StatCard label="即将到期" :value="kpi.expiring" tone="warning" delta="30 天内到期" iconTone="warning">
        <template #icon><ClockCircleOutlined /></template>
      </StatCard>
      <StatCard label="已到期" :value="kpi.expired" tone="danger" delta="需续订或停用" iconTone="danger">
        <template #icon><ExclamationCircleOutlined /></template>
      </StatCard>
      <StatCard label="本月新增" :value="kpi.monthNew" tone="success" delta="较上月 +1" iconTone="success">
        <template #icon><RiseOutlined /></template>
      </StatCard>
    </section>

    <!-- 表格区 -->
    <section class="cloud-card p-[0] overflow-hidden">
      <FilterBar class="!rounded-none !border-0 !mb-0 !p-[16px]" @search="onSearch" @reset="onReset">
        <template #actions>
          <a-button type="primary" @click="onOpenProvision">
            <template #icon><PlusOutlined /></template>
            服务开通
          </a-button>
          <a-button @click="onExport">
            <template #icon><DownloadOutlined /></template>
            导出开通清单
          </a-button>
        </template>
        <a-input v-model:value="filter.orgName" style="width: 200px" placeholder="机构名称" allow-clear />
        <a-input v-model:value="filter.serviceName" style="width: 200px" placeholder="服务名称" allow-clear />
        <a-select v-model:value="filter.status" style="width: 140px" placeholder="状态" allow-clear>
          <a-select-option value="正常">正常</a-select-option>
          <a-select-option value="即将到期">即将到期</a-select-option>
          <a-select-option value="已到期">已到期</a-select-option>
        </a-select>
        <a-select v-model:value="filter.billingMethod" style="width: 160px" placeholder="计费方式" allow-clear>
          <a-select-option v-for="m in billingMethods" :key="m" :value="m">{{ m }}</a-select-option>
        </a-select>
        <a-range-picker v-model:value="filter.range" style="width: 240px" :placeholder="['开通开始', '开通结束']" />
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="border-t border-[#e8e8e8] mx-[16px]"></div>

      <div class="px-[16px] py-[16px]">
        <a-table :columns="visibleColumns" :data-source="filteredData" :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (t: number) => `共 ${t} 条` }" size="middle">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'orgName'">
              <span>{{ record.orgName }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'name'">
              <span class="font-semibold text-text-primary">{{ record.name }}</span>
              <div class="text-[12px] text-text-tertiary mt-[2px] font-num">{{ record.internalId || '--' }}</div>
            </template>
            <template v-else-if="column.dataIndex === 'usage'">
              <div class="flex items-center gap-[8px]">
                <a-progress :percent="Math.min(record.ratio, 100)" :show-info="false" size="small" :stroke-color="ratioColor(record.ratio, record.alertThreshold)" style="width: 100px" />
                <span class="text-[12px]" :class="ratioTextClass(record.ratio, record.alertThreshold)">{{ record.ratio }}%</span>
              </div>
              <div class="text-[11px] text-text-tertiary mt-[2px]">{{ record.used }} / {{ record.quota }}</div>
            </template>
            <template v-else-if="column.dataIndex === 'subAccounts'">
              <span class="font-num">{{ record.subAccounts.length }} 个</span>
            </template>
            <template v-else-if="column.dataIndex === 'provisionedAt'">
              <span class="font-num whitespace-nowrap">{{ record.provisionedAt }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'validUntil'">
              <span class="font-num whitespace-nowrap">{{ record.validUntil }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-badge :status="statusBadge(record.status)" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'workbenchMode'">
              <a-tag :color="record.workbenchMode === 'direct' ? 'blue' : 'cyan'" class="!m-0 !text-[11px]">{{ record.workbenchMode === 'direct' ? '直接跳转' : '工作台入口' }}</a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button type="link" size="small" class="!p-0" @click="onViewDetail(record)">查看详情</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0" @click="onOpenSetting(record)">设置</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0" @click="onOpenGrant(record)">授权</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </section>

    <!-- 代开通弹窗 -->
    <a-modal v-model:open="provisionModal.visible" :title="provisionModal.step === 1 ? '服务开通 · 选择模型' : '服务开通'" :width="880" :footer="null" :mask-closable="false">
      <!-- Step 1: 选模型 -->
      <template v-if="provisionModal.step === 1">
        <div class="grid grid-cols-3 gap-[10px] mb-[12px]">
          <a-input v-model:value="provisionModal.keyword" placeholder="按模型名称搜索" allow-clear>
            <template #prefix><SearchOutlined /></template>
          </a-input>
          <a-select v-model:value="provisionModal.category" placeholder="能力分类" allow-clear>
            <a-select-option v-for="opt in categoryOptions" :key="opt" :value="opt">{{ opt }}</a-select-option>
          </a-select>
          <a-select v-model:value="provisionModal.riskLevel" placeholder="风险等级" allow-clear>
            <a-select-option value="高风险">高风险</a-select-option>
            <a-select-option value="中风险">中风险</a-select-option>
            <a-select-option value="低风险">低风险</a-select-option>
          </a-select>
          <a-select v-model:value="provisionModal.billingMethod" placeholder="计费方式" allow-clear>
            <a-select-option value="按Token">按 Token</a-select-option>
            <a-select-option value="按检查例次">按检查例次</a-select-option>
            <a-select-option value="按调用次数">按调用次数</a-select-option>
          </a-select>
          <a-select v-model:value="provisionModal.unit" placeholder="研发单位" allow-clear show-search :filter-option="filterUnitOpt">
            <a-select-option v-for="u in unitOptions" :key="u" :value="u">{{ u }}</a-select-option>
          </a-select>
          <a-select v-model:value="provisionModal.status" placeholder="接入状态" allow-clear>
            <a-select-option value="已上线使用">已上线使用</a-select-option>
            <a-select-option value="对接上线中">对接上线中</a-select-option>
            <a-select-option value="对接测试中">对接测试中</a-select-option>
            <a-select-option value="停止使用">停止使用</a-select-option>
          </a-select>
        </div>
        <div class="max-h-[420px] overflow-y-auto pr-[4px]">
          <a-table
            :columns="modelColumns"
            :data-source="filteredModels"
            :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50'], showTotal: (t: number) => `共 ${t} 项` }"
            size="middle"
            :row-key="(r: any) => r.id"
            :row-selection="{ type: 'radio', selectedRowKeys: provisionModal.selectedId ? [provisionModal.selectedId] : [], onChange: onModelSelect }"
            :custom-row="modelRowEvents"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'title'">
                <span class="font-semibold text-text-primary">{{ record.title }}</span>
                <div class="text-[12px] text-text-tertiary mt-[2px] font-num">{{ record.internalId || '--' }}</div>
              </template>
              <template v-else-if="column.dataIndex === 'category'">
                <a-tag :color="categoryColorMap[record.category]" class="!m-0 !text-[11px]">{{ record.category }}</a-tag>
              </template>
              <template v-else-if="column.dataIndex === 'riskLevel'">
                <a-tag :color="riskTagColor(record.riskLevel)" class="!m-0 !text-[11px]">{{ record.riskLevel }}</a-tag>
              </template>
              <template v-else-if="column.dataIndex === 'status'">
                <a-badge :status="modelStatusBadge(record.status)" :text="record.status" />
              </template>
            </template>
          </a-table>
          <a-empty v-if="filteredModels.length === 0" description="未找到匹配的模型" class="py-[40px]" />
        </div>
        <div class="mt-[14px] flex justify-end gap-[8px]">
          <a-button @click="provisionModal.visible = false">取消</a-button>
          <a-button type="primary" :disabled="!provisionModal.selectedId" @click="goToStep2">下一步</a-button>
        </div>
      </template>

      <!-- Step 2: 填表单 -->
      <template v-else-if="provisionModal.step === 2 && selectedModel">
        <div class="rounded-[6px] bg-bg p-[10px] mb-[14px]">
          <div class="text-[13px] font-semibold text-text-primary">{{ selectedModel.title }}</div>
          <div class="text-[11px] text-text-secondary mt-[2px]">{{ selectedModel.category }} · {{ selectedModel.billingMethod }} · {{ selectedModel.riskLevel }}</div>
        </div>
        <a-form layout="vertical">
          <div class="grid grid-cols-2 gap-[12px]">
            <a-form-item label="机构名称" required>
              <a-select v-model:value="provisionModal.orgName" placeholder="请选择机构" show-search allow-clear>
                <a-select-option v-for="o in orgOptions" :key="o" :value="o">{{ o }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="订阅周期" required>
              <a-radio-group v-model:value="provisionModal.period">
                <a-radio-button value="1年">1 年</a-radio-button>
                <a-radio-button value="2年">2 年（9.5 折）</a-radio-button>
                <a-radio-button value="3年">3 年（9 折）</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="使用范围" required>
              <a-select v-model:value="provisionModal.scope" placeholder="请选择使用范围">
                <a-select-option value="全院">全院</a-select-option>
                <a-select-option value="门诊+住院">门诊+住院</a-select-option>
                <a-select-option value="指定科室">指定科室</a-select-option>
                <a-select-option value="互联网医院">互联网医院</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="额度方式" required>
              <a-radio-group v-model:value="provisionModal.billingType">
                <a-radio-button value="package">按词元包</a-radio-button>
                <a-radio-button value="quota">自定义额度</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </div>
          <a-form-item v-if="provisionModal.billingType === 'package'" label="词元包" required>
            <a-select v-model:value="provisionModal.package" placeholder="请选择词元包">
              <a-select-option v-for="pkg in tokenPackages" :key="pkg.name" :value="pkg.name">{{ pkg.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-else label="申请额度" required>
            <a-input v-model:value="provisionModal.quota" :placeholder="quotaPlaceholder" />
          </a-form-item>
          <a-form-item label="用途说明" required>
            <a-textarea v-model:value="provisionModal.purpose" :rows="3" placeholder="请描述机构使用该服务的具体业务场景与预期效果" />
          </a-form-item>
          <div class="grid grid-cols-2 gap-[12px]">
            <a-form-item label="联系人" required>
              <a-input v-model:value="provisionModal.contactName" placeholder="请输入联系人姓名" />
            </a-form-item>
            <a-form-item label="联系电话" required>
              <a-input v-model:value="provisionModal.contactPhone" placeholder="请输入手机号" />
            </a-form-item>
          </div>
          <a-form-item required>
            <a-checkbox v-model:checked="provisionModal.agreed">
              我已阅读并同意 <a class="text-primary">《AI 服务接入协议》</a> 与 <a class="text-primary">《数据安全使用承诺书》</a>
            </a-checkbox>
          </a-form-item>
          <a-alert type="info" show-icon message="代开通提交后即视为审核通过，记录将出现在开通台账中，机构可在服务订阅管理中查看调用凭证" />
        </a-form>
        <div class="mt-[14px] flex justify-end gap-[8px]">
          <a-button @click="provisionModal.step = 1">上一步</a-button>
          <a-button type="primary" @click="confirmProvision">提交开通申请</a-button>
        </div>
      </template>
    </a-modal>

    <!-- 详情抽屉 -->
    <a-drawer v-model:open="drawer.visible" title="服务开通详情" :width="860" placement="right">
      <template v-if="drawer.record">
        <div class="drawer-header-row">
          <div class="drawer-header-icon">
            <img v-if="drawer.record.logo" :src="drawer.record.logo" class="w-full h-full object-cover rounded-[10px]" alt="" />
            <RobotOutlined v-else class="text-[28px] text-white" />
          </div>
          <div class="drawer-header-info">
            <div class="drawer-header-title-row">
              <span class="drawer-header-title">{{ drawer.record.name }}</span>
              <a-badge :status="statusBadge(drawer.record.status)" :text="drawer.record.status" />
            </div>
            <div class="drawer-header-sub">
              <span>资产标识：{{ drawer.record.internalId || '--' }}</span>
            </div>
          </div>
        </div>
        <a-tabs v-model:activeKey="drawer.activeTab">
          <!-- Tab1 调用说明 -->
          <a-tab-pane key="call" tab="调用说明">
            <div class="text-[13px] font-semibold text-text-primary mb-[10px]">接入凭证</div>
            <a-descriptions :column="1" bordered size="small">
              <a-descriptions-item label="API 端点">
                <span class="font-num text-[12px]">{{ drawer.record.endpoint }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="AccessKey">
                <span class="font-num text-[12px]">{{ drawer.record.accessKey }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="SecretKey">
                <span class="font-num text-[12px]">••••••••••••</span>
              </a-descriptions-item>
            </a-descriptions>
            <a-alert class="!mt-[8px] !mb-[16px]" type="info" show-icon message="出于安全考虑，机构密钥不向运营侧完整展示，如需核查请联系机构管理员" />

            <div class="flex items-center justify-between mb-[10px]">
              <div class="text-[13px] font-semibold text-text-primary">子账户额度分配</div>
            </div>
            <a-table :columns="subAccountColumns" :data-source="drawer.record.subAccounts" :pagination="false" size="small" row-key="code" class="mb-[16px]">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'code'">
                  <span class="font-num text-[12px] text-primary">{{ record.code }}</span>
                </template>
                <template v-else-if="column.dataIndex === 'ratio'">
                  <span class="text-[12px] font-semibold" :class="ratioTextClass(record.ratio, 80)">{{ record.ratio }}%</span>
                </template>
              </template>
            </a-table>

            <div class="text-[13px] font-semibold text-text-primary mb-[10px]">调用示例</div>
            <div class="text-[11px] text-text-secondary mb-[6px]">cURL 请求</div>
            <pre class="rounded-[6px] bg-sidebar text-white/90 p-[12px] text-[11px] leading-[18px] overflow-x-auto font-num">{{ drawer.record.callExample }}</pre>
            <div class="text-[11px] text-text-secondary mt-[10px] mb-[6px]">请求体示例（JSON）</div>
            <pre class="rounded-[6px] bg-sidebar text-white/90 p-[12px] text-[11px] leading-[18px] overflow-x-auto font-num">{{ drawer.record.payloadExample }}</pre>
          </a-tab-pane>

          <!-- Tab2 机构信息 -->
          <a-tab-pane key="org" tab="机构信息">
            <a-descriptions :column="2" bordered size="small">
              <a-descriptions-item label="机构名称" :span="2">{{ drawer.record.orgName }}</a-descriptions-item>
              <a-descriptions-item label="联系人">{{ drawer.record.contactName }}</a-descriptions-item>
              <a-descriptions-item label="联系电话">{{ drawer.record.contactPhone }}</a-descriptions-item>
              <a-descriptions-item label="使用范围" :span="2">{{ drawer.record.scope }}</a-descriptions-item>
              <a-descriptions-item label="计费方式">{{ drawer.record.billingMethod }}</a-descriptions-item>
              <a-descriptions-item label="子账户数">{{ drawer.record.subAccounts.length }} 个</a-descriptions-item>
              <a-descriptions-item label="总额度">{{ drawer.record.quota }}</a-descriptions-item>
              <a-descriptions-item label="已用">{{ drawer.record.used }}</a-descriptions-item>
              <a-descriptions-item label="使用占比" :span="2">
                <div class="flex items-center gap-[8px]">
                  <a-progress :percent="Math.min(drawer.record.ratio, 100)" :show-info="false" size="small" :stroke-color="ratioColor(drawer.record.ratio, drawer.record.alertThreshold)" style="width: 200px" />
                  <span class="text-[12px]" :class="ratioTextClass(drawer.record.ratio, drawer.record.alertThreshold)">{{ drawer.record.ratio }}%</span>
                </div>
              </a-descriptions-item>
              <a-descriptions-item label="预警阈值" :span="2">{{ drawer.record.alertThreshold }}%</a-descriptions-item>
            </a-descriptions>
          </a-tab-pane>

          <!-- Tab3 审核信息 -->
          <a-tab-pane key="audit" tab="审核信息">
            <div class="flex items-center gap-[8px] mb-[10px]">
              <div class="w-[3px] h-[14px] bg-primary rounded-full" />
              <span class="text-[14px] font-semibold text-text-primary">审核流水</span>
              <span class="text-[12px] text-text-tertiary">共 {{ drawer.record.auditLogs.length }} 条</span>
            </div>
            <a-table :columns="auditColumns" :data-source="drawer.record.auditLogs.map((l, i) => ({ key: i, ...l }))" :pagination="{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'], showTotal: (t: number) => `共 ${t} 条` }" size="small">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'status'">
                  <a-tag :color="record.status === '已通过' ? 'success' : record.status === '已驳回' ? 'error' : 'processing'" class="!m-0 !text-[11px]">{{ record.status }}</a-tag>
                </template>
                <template v-else-if="column.dataIndex === 'auditAt'">
                  <span class="font-num text-[12px]">{{ record.auditAt }}</span>
                </template>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </template>
    </a-drawer>

    <!-- 设置弹窗 -->
    <a-modal v-model:open="settingModal.visible" :title="`工作台设置 - ${settingModal.record?.orgName ?? ''} · ${settingModal.record?.name ?? ''}`" :width="480" @ok="confirmSetting" ok-text="保存" cancel-text="取消">
      <template v-if="settingModal.record">
        <a-form layout="vertical">
          <a-form-item label="工作台展示方式" required>
            <a-radio-group v-model:value="settingModal.workbenchMode">
              <a-radio-button value="entry">工作台入口</a-radio-button>
              <a-radio-button value="direct">直接跳转</a-radio-button>
            </a-radio-group>
            <div class="text-[11px] text-text-tertiary mt-[4px]">工作台入口：在工作台展示卡片，点击后跳转；直接跳转：不展示卡片，从侧边栏/快捷入口直奔业务系统</div>
          </a-form-item>
          <a-form-item label="跳转地址">
            <a-input v-model:value="settingModal.overrideUrl" :placeholder="`默认使用服务级地址：${settingModal.defaultUrl ?? '未配置'}`" />
            <div class="text-[11px] text-text-tertiary mt-[4px]">留空则使用服务级默认地址，填写后将覆盖该机构的跳转地址</div>
          </a-form-item>
        </a-form>
      </template>
    </a-modal>

    <!-- 授权弹窗 -->
    <a-modal v-model:open="grantModal.visible" :title="`授权对象 - ${grantModal.record?.orgName ?? ''} · ${grantModal.record?.name ?? ''}`" :width="640" :footer="null">
      <template v-if="grantModal.record">
        <div class="rounded-[6px] bg-bg p-[10px] mb-[14px]">
          <div class="text-[13px] font-semibold text-text-primary">{{ grantModal.record.name }}</div>
          <div class="text-[11px] text-text-secondary mt-[2px]">{{ grantModal.record.orgName }} · {{ grantModal.record.category }}</div>
        </div>

        <!-- 添加授权 -->
        <div class="rounded-[8px] border border-border-soft p-[12px] mb-[16px]">
          <div class="text-[13px] font-semibold text-text-primary mb-[10px]">添加授权</div>
          <a-form layout="vertical">
            <a-form-item label="授权层级" required>
              <a-radio-group v-model:value="grantModal.level">
                <a-radio-button value="org">机构</a-radio-button>
                <a-radio-button value="department">科室</a-radio-button>
                <a-radio-button value="person">医生/技师</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item v-if="grantModal.level === 'department'" label="选择科室" required>
              <a-select v-model:value="grantModal.target" placeholder="请选择科室" allow-clear>
                <a-select-option v-for="d in departmentOptions" :key="d" :value="d">{{ d }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item v-else-if="grantModal.level === 'person'" label="选择人员" required>
              <a-select v-model:value="grantModal.personId" placeholder="请选择人员" allow-clear show-search @change="onPersonChange">
                <a-select-option v-for="p in personOptions" :key="p.id" :value="p.id">{{ p.name }}（{{ p.department }} · {{ p.role }}）</a-select-option>
              </a-select>
            </a-form-item>
            <a-alert v-else type="info" show-icon message="机构级授权默认该机构全员可用，无需选择对象" />
          </a-form>
          <div class="flex justify-end">
            <a-button type="primary" :disabled="!canAddGrant" @click="onAddGrant">授予</a-button>
          </div>
        </div>

        <!-- 已授权列表 -->
        <div class="flex items-center gap-[8px] mb-[10px]">
          <div class="w-[3px] h-[14px] bg-primary rounded-full" />
          <span class="text-[14px] font-semibold text-text-primary">已授权对象</span>
          <span class="text-[12px] text-text-tertiary">共 {{ grantModal.record.grants.length }} 条</span>
        </div>
        <a-table :columns="grantColumns" :data-source="grantModal.record.grants.map((g) => ({ key: g.id, ...g }))" :pagination="{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'], showTotal: (t: number) => `共 ${t} 条` }" size="small">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'level'">
              <a-tag :color="record.level === 'org' ? 'blue' : record.level === 'department' ? 'cyan' : 'purple'" class="!m-0 !text-[11px]">{{ levelLabel(record.level) }}</a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'grantedAt'">
              <span class="font-num text-[12px]">{{ record.grantedAt }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'op'">
              <a-popconfirm title="确认移除该授权？" @confirm="onRemoveGrant(record)">
                <a class="text-error text-[11px]">移除</a>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
        <div class="mt-[14px] flex justify-end">
          <a-button @click="grantModal.visible = false">关闭</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { DownloadOutlined, PlusOutlined, AppstoreOutlined, ClockCircleOutlined, ExclamationCircleOutlined, RiseOutlined, SearchOutlined, RobotOutlined } from '@ant-design/icons-vue';
import dayjs, { type Dayjs } from 'dayjs';
import { provisionedServices } from '../../../data/operations';
import type { ProvisionedService, Grant, GrantLevel } from '../../../data/operations';
import { capabilityGroups, tokenPackages } from '../../../data';
import { orgMembers } from '../../../data/orgMembers';
import type { CapabilityCardData } from '../../../types';
import PageHeader from '../../../components/common/PageHeader.vue';
import FilterBar from '../../../components/common/FilterBar.vue';
import ColumnSettings from '../../../components/common/ColumnSettings.vue';
import StatCard from '../../../components/common/StatCard.vue';

const services = reactive(provisionedServices);

const columns = [
  { title: '机构名称', dataIndex: 'orgName', key: 'orgName' },
  { title: '服务名称', dataIndex: 'name', key: 'name' },
  { title: '计费方式', dataIndex: 'billingMethod', key: 'billingMethod', width: 110 },
  { title: '额度使用', dataIndex: 'usage', key: 'usage', width: 220 },
  { title: '子账户', dataIndex: 'subAccounts', key: 'subAccounts', width: 90 },
  { title: '开通时间', dataIndex: 'provisionedAt', key: 'provisionedAt', width: 160 },
  { title: '有效期至', dataIndex: 'validUntil', key: 'validUntil', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 110 },
  { title: '工作台模式', dataIndex: 'workbenchMode', key: 'workbenchMode', width: 120 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 200 },
];

const subAccountColumns = [
  { title: '子账户', dataIndex: 'name', key: 'name' },
  { title: '编码', dataIndex: 'code', key: 'code', width: 130 },
  { title: '额度', dataIndex: 'quota', key: 'quota', width: 130 },
  { title: '已用', dataIndex: 'used', key: 'used', width: 130 },
  { title: '占比', dataIndex: 'ratio', key: 'ratio', width: 80 },
];

const auditColumns = [
  { title: '时间', dataIndex: 'auditAt', key: 'auditAt', width: 160 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '操作人', dataIndex: 'auditor', key: 'auditor', width: 120 },
  { title: '审核意见', dataIndex: 'opinion', key: 'opinion' },
];

const grantColumns = [
  { title: '层级', dataIndex: 'level', key: 'level', width: 100 },
  { title: '对象', dataIndex: 'target', key: 'target', width: 140 },
  { title: '科室', dataIndex: 'department', key: 'department', width: 120 },
  { title: '角色', dataIndex: 'role', key: 'role', width: 100 },
  { title: '授权时间', dataIndex: 'grantedAt', key: 'grantedAt', width: 160 },
  { title: '操作', dataIndex: 'op', key: 'op', width: 80 },
];

const billingMethods = Array.from(new Set(services.map((s) => s.billingMethod)));
const orgOptions = Array.from(new Set(services.map((s) => s.orgName)));

const filter = ref<{ orgName: string; serviceName: string; status?: string; billingMethod?: string; range?: [Dayjs, Dayjs] }>({
  orgName: '',
  serviceName: '',
  status: undefined,
  billingMethod: undefined,
  range: undefined,
});
const applied = ref<{ orgName: string; serviceName: string; status?: string; billingMethod?: string; range?: [Dayjs, Dayjs] }>({
  orgName: '',
  serviceName: '',
  status: undefined,
  billingMethod: undefined,
  range: undefined,
});
const hiddenKeys = ref<string[]>([]);
const visibleColumns = computed(() => columns.filter((c) => !hiddenKeys.value.includes(c.key)));

function onSearch() {
  applied.value = { ...filter.value };
}
function onReset() {
  filter.value = { orgName: '', serviceName: '', status: undefined, billingMethod: undefined, range: undefined };
  applied.value = { orgName: '', serviceName: '', status: undefined, billingMethod: undefined, range: undefined };
}

const kpi = computed(() => {
  const now = dayjs();
  return {
    total: services.length,
    expiring: services.filter((s) => s.status === '即将到期').length,
    expired: services.filter((s) => s.status === '已到期').length,
    monthNew: services.filter((s) => dayjs(s.provisionedAt).isSame(now, 'month')).length,
  };
});

const filteredData = computed(() => {
  const f = applied.value;
  return services
    .filter((s) => {
      if (f.orgName && !s.orgName.includes(f.orgName)) return false;
      if (f.serviceName && !s.name.includes(f.serviceName)) return false;
      if (f.status && s.status !== f.status) return false;
      if (f.billingMethod && s.billingMethod !== f.billingMethod) return false;
      if (f.range && f.range.length === 2) {
        const start = f.range[0].format('YYYY-MM-DD 00:00:00');
        const end = f.range[1].format('YYYY-MM-DD 23:59:59');
        if (s.provisionedAt < start || s.provisionedAt > end) return false;
      }
      return true;
    })
    .map((s) => ({ key: s.id, ...s }));
});

function statusBadge(status: string): 'success' | 'warning' | 'error' {
  if (status === '正常') return 'success';
  if (status === '即将到期') return 'warning';
  return 'error';
}

function ratioColor(ratio: number, threshold: number) {
  if (ratio >= 100) return '#EF4444';
  if (ratio >= threshold) return '#F59E0B';
  return '#165DFF';
}

function ratioTextClass(ratio: number, threshold: number) {
  if (ratio >= 100) return 'text-error font-bold';
  if (ratio >= threshold) return 'text-warning font-bold';
  return 'text-text-secondary';
}

// ===================== 详情抽屉 =====================
const drawer = ref<{ visible: boolean; record: ProvisionedService | null; activeTab: string }>({
  visible: false,
  record: null,
  activeTab: 'call',
});

function onViewDetail(record: any) {
  const full = services.find((s) => s.id === record.id);
  if (!full) return;
  drawer.value = { visible: true, record: full, activeTab: 'call' };
}

// ===================== 代开通弹窗 =====================
const allModels = computed(() => capabilityGroups.flatMap((g) => g.columns.flatMap((c) => c.items)));
const categoryOptions = computed(() => Array.from(new Set(allModels.value.map((m) => m.category))));
const unitOptions = computed(() => Array.from(new Set(allModels.value.map((m) => m.unit).filter(Boolean))));
const modelColumns = [
  { title: '模型名称', dataIndex: 'title', key: 'title' },
  { title: '研发单位', dataIndex: 'unit', key: 'unit', width: 200 },
  { title: '能力分类', dataIndex: 'category', key: 'category', width: 160 },
  { title: '风险等级', dataIndex: 'riskLevel', key: 'riskLevel', width: 90 },
  { title: '计费方式', dataIndex: 'billingMethod', key: 'billingMethod', width: 110 },
  { title: '接入状态', dataIndex: 'status', key: 'status', width: 110 },
];
const categoryColorMap: Record<string, string> = {
  通用基础大模型: 'blue',
  医保自研专属大模型: 'cyan',
  医保基金监管共建模型: 'purple',
  省头部医疗机构共建垂直模型: 'green',
  市场化合规生态AI产品: 'orange',
};
function riskTagColor(level?: string): 'error' | 'warning' | 'success' | 'default' {
  if (level === '高风险') return 'error';
  if (level === '中风险') return 'warning';
  if (level === '低风险') return 'success';
  return 'default';
}
function modelStatusBadge(status?: string) {
  if (status === '已上线使用') return 'success';
  if (status === '对接测试中') return 'processing';
  if (status === '对接上线中') return 'warning';
  if (status === '停止使用') return 'error';
  return 'default';
}
function filterUnitOpt(input: string, option: any) {
  return (option?.children?.[0]?.children ?? option?.value ?? '').toLowerCase().includes(input.toLowerCase());
}
function onModelSelect(selectedKeys: string[]) {
  provisionModal.value.selectedId = selectedKeys[0] ?? '';
}
const modelRowEvents = (record: any) => ({
  onClick: () => {
    provisionModal.value.selectedId = record.id;
  },
});

const provisionModal = ref<{
  visible: boolean;
  step: 1 | 2;
  keyword: string;
  category: string | undefined;
  riskLevel: string | undefined;
  billingMethod: string | undefined;
  unit: string | undefined;
  status: string | undefined;
  selectedId: string;
  orgName: string;
  period: string;
  billingType: 'package' | 'quota';
  package: string;
  scope: string;
  quota: string;
  purpose: string;
  contactName: string;
  contactPhone: string;
  workbenchMode: 'entry' | 'direct';
  overrideUrl: string;
  agreed: boolean;
}>({
  visible: false,
  step: 1,
  keyword: '',
  category: '全部',
  selectedId: '',
  orgName: '',
  period: '1年',
  billingType: 'package',
  package: '',
  scope: '',
  quota: '',
  purpose: '',
  contactName: '',
  contactPhone: '',
  riskLevel: undefined,
  billingMethod: undefined,
  unit: undefined,
  status: undefined,
  workbenchMode: 'entry',
  overrideUrl: '',
  agreed: false,
});

const filteredModels = computed(() => {
  const kw = provisionModal.value.keyword.trim().toLowerCase();
  return allModels.value.filter((m) => {
    if (provisionModal.value.category && m.category !== provisionModal.value.category) return false;
    if (provisionModal.value.riskLevel && m.riskLevel !== provisionModal.value.riskLevel) return false;
    if (provisionModal.value.billingMethod && m.billingMethod !== provisionModal.value.billingMethod) return false;
    if (provisionModal.value.unit && m.unit !== provisionModal.value.unit) return false;
    if (provisionModal.value.status && m.status !== provisionModal.value.status) return false;
    if (kw && !m.title.toLowerCase().includes(kw)) return false;
    return true;
  });
});

const selectedModel = computed<CapabilityCardData | null>(() => {
  if (!provisionModal.value.selectedId) return null;
  return allModels.value.find((m) => m.id === provisionModal.value.selectedId) ?? null;
});

const quotaPlaceholder = computed(() => {
  const m = selectedModel.value?.billingMethod ?? '';
  if (m.includes('Token')) return '如：5,000 万词元/月';
  if (m.includes('检查例次')) return '如：800 例/月';
  if (m.includes('调用次数')) return '如：3,000 次/月';
  return '请输入申请额度';
});

function onOpenProvision() {
  provisionModal.value = {
    visible: true,
    step: 1,
    keyword: '',
    category: undefined,
    riskLevel: undefined,
    billingMethod: undefined,
    unit: undefined,
    status: undefined,
    selectedId: '',
    orgName: '',
    period: '1年',
    billingType: 'package',
    package: '',
    scope: '',
    quota: '',
    purpose: '',
    contactName: '',
    contactPhone: '',
    workbenchMode: 'entry',
    overrideUrl: '',
    agreed: false,
  };
}

function goToStep2() {
  if (!provisionModal.value.selectedId) {
    message.warning('请先选择一个模型');
    return;
  }
  provisionModal.value.overrideUrl = selectedModel.value?.entryUrl ?? '';
  provisionModal.value.step = 2;
}

function confirmProvision() {
  const m = provisionModal.value;
  if (!m.orgName) {
    message.warning('请选择机构');
    return;
  }
  if (!m.scope || !m.purpose || !m.contactName || !m.contactPhone) {
    message.warning('请完整填写开通信息');
    return;
  }
  if (m.billingType === 'package' && !m.package) {
    message.warning('请选择词元包');
    return;
  }
  if (m.billingType === 'quota' && !m.quota) {
    message.warning('请填写申请额度');
    return;
  }
  if (!m.agreed) {
    message.warning('请阅读并同意接入协议');
    return;
  }
  const model = selectedModel.value;
  if (!model) return;
  const pkg = tokenPackages.find((p) => p.name === (m.billingType === 'package' ? m.package : '标准包')) ?? tokenPackages[1];
  const now = dayjs();
  const newRecord: ProvisionedService = {
    id: `ps-${Date.now()}`,
    orgName: m.orgName,
    name: model.title,
    code: model.code || model.id?.toUpperCase(),
    unit: model.unit,
    purpose: m.purpose || '-',
    orgCreditCode: '--',
    unitCreditCode: '--',
    entryUrl: model.entryUrl || '',
    category: model.category,
    billingMethod: model.billingMethod ?? '按Token',
    validUntil: now.add(m.period === '3年' ? 3 : m.period === '2年' ? 2 : 1, 'year').format('YYYY-MM-DD'),
    scope: m.scope,
    status: '正常',
    quota: m.billingType === 'quota' ? m.quota : pkg.amount,
    used: '0',
    ratio: 0,
    alertThreshold: 80,
    endpoint: `https://api.jsyb-ai.cn/v1/llm/${model.id}/invoke`,
    accessKey: `AK_JSYB_2026_${Date.now().toString(36).toUpperCase()}`,
    secretKey: `SK_${Math.random().toString(16).slice(2, 34)}`,
    subAccounts: [],
    provisionedAt: now.format('YYYY-MM-DD HH:mm'),
    packageName: m.billingType === 'package' ? m.package : pkg.name,
    discountPrice: pkg.price,
    contactName: m.contactName,
    contactPhone: m.contactPhone,
    auditor: '李四（代开通）',
    auditOpinion: '管理员代开通，即时生效',
    submittedAt: now.format('YYYY-MM-DD HH:mm'),
    callExample: `curl -X POST ${'${ENDPOINT}'} \\
  -H "Authorization: Bearer ${'${AK}'}:${'${SK}'}" \\
  -H "X-Sub-Account: ${'${DEPT_CODE}'}" \\
  -H "Content-Type: application/json" \\
  -d '${'${PAYLOAD}'}'`,
    payloadExample: `{
  "model": "${model.id}",
  "messages": [
    { "role": "user", "content": "示例请求内容" }
  ]
}`,
    auditLogs: [
      { action: '提交申请', status: '审核中', submittedAt: now.format('YYYY-MM-DD HH:mm'), submitter: '当前用户', auditAt: now.format('YYYY-MM-DD HH:mm') },
      { action: '审核通过', status: '已通过', submittedAt: now.format('YYYY-MM-DD HH:mm'), submitter: '当前用户', auditAt: now.format('YYYY-MM-DD HH:mm'), auditor: '李四（代开通）', opinion: '管理员代开通，即时生效' },
    ],
    workbenchMode: m.workbenchMode,
    overrideUrl: m.overrideUrl.trim() || undefined,
    grants: [
      { id: `g-${Date.now()}-1`, level: 'org', target: m.orgName, grantedAt: now.format('YYYY-MM-DD HH:mm') },
    ],
  };
  services.unshift(newRecord);
  message.success('服务开通成功，记录已加入台账');
  provisionModal.value.visible = false;
}

function onExport() {
  message.success('开通清单导出请求已提交');
}

// ===================== 设置弹窗 =====================
const settingModal = ref<{
  visible: boolean;
  record: ProvisionedService | null;
  workbenchMode: 'entry' | 'direct';
  overrideUrl: string;
  defaultUrl: string | undefined;
}>({
  visible: false,
  record: null,
  workbenchMode: 'entry',
  overrideUrl: '',
  defaultUrl: undefined,
});

function onOpenSetting(record: any) {
  const full = services.find((s) => s.id === record.id);
  if (!full) return;
  const model = allModels.value.find((m) => m.title === full.name);
  settingModal.value = {
    visible: true,
    record: full,
    workbenchMode: full.workbenchMode,
    overrideUrl: full.overrideUrl ?? '',
    defaultUrl: model?.entryUrl,
  };
}

function confirmSetting() {
  const r = settingModal.value.record;
  if (!r) return;
  r.workbenchMode = settingModal.value.workbenchMode;
  r.overrideUrl = settingModal.value.overrideUrl.trim() || undefined;
  settingModal.value.visible = false;
  message.success('工作台设置已保存');
}

// ===================== 授权弹窗 =====================
const grantModal = ref<{
  visible: boolean;
  record: ProvisionedService | null;
  level: GrantLevel;
  target: string;
  personId: string;
}>({
  visible: false,
  record: null,
  level: 'org',
  target: '',
  personId: '',
});

const departmentOptions = computed(() => {
  const r = grantModal.value.record;
  if (!r) return [];
  const fromSub = r.subAccounts.map((s) => s.name);
  const fromMembers = orgMembers.map((m) => m.department);
  return Array.from(new Set([...fromSub, ...fromMembers]));
});

const personOptions = computed(() => {
  return orgMembers.filter((m) => m.role === '医生' || m.role === '技师');
});

function onPersonChange(personId: string) {
  const p = orgMembers.find((m) => m.id === personId);
  if (p) {
    grantModal.value.target = p.name;
  }
}

const canAddGrant = computed(() => {
  const g = grantModal.value;
  if (g.level === 'org') return true;
  if (g.level === 'department') return !!g.target;
  return !!g.personId;
});

function levelLabel(level: GrantLevel): string {
  if (level === 'org') return '机构';
  if (level === 'department') return '科室';
  return '医生/技师';
}

function onAddGrant() {
  const r = grantModal.value.record;
  if (!r) return;
  const g = grantModal.value;
  const now = dayjs().format('YYYY-MM-DD HH:mm');
  if (g.level === 'org') {
    r.grants.push({ id: `g-${Date.now()}`, level: 'org', target: r.orgName, grantedAt: now });
  } else if (g.level === 'department') {
    if (r.grants.some((x) => x.level === 'department' && x.target === g.target)) {
      message.warning('该科室已授权');
      return;
    }
    r.grants.push({ id: `g-${Date.now()}`, level: 'department', target: g.target, grantedAt: now });
  } else {
    const p = orgMembers.find((m) => m.id === g.personId);
    if (!p) return;
    if (r.grants.some((x) => x.level === 'person' && x.targetId === p.id)) {
      message.warning('该人员已授权');
      return;
    }
    r.grants.push({ id: `g-${Date.now()}`, level: 'person', target: p.name, targetId: p.id, department: p.department, role: p.role, grantedAt: now });
  }
  message.success('授权已添加');
  grantModal.value.target = '';
  grantModal.value.personId = '';
}

function onRemoveGrant(record: any) {
  const r = grantModal.value.record;
  if (!r) return;
  const idx = r.grants.findIndex((g) => g.id === record.id);
  if (idx >= 0) {
    r.grants.splice(idx, 1);
    message.success('授权已移除');
  }
}

function onOpenGrant(record: any) {
  const full = services.find((s) => s.id === record.id);
  if (!full) return;
  grantModal.value = {
    visible: true,
    record: full,
    level: 'org',
    target: '',
    personId: '',
  };
}
</script>

<style scoped>
/* 抽屉头部样式 */
.drawer-header-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0 8px;
  margin-bottom: 8px;
}
.drawer-header-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #165DFF 0%, #4096ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}
.drawer-header-info {
  flex: 1;
  min-width: 0;
}
.drawer-header-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}
.drawer-header-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}
.drawer-header-sub {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
}
</style>
