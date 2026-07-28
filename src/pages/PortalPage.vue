<template>
  <div class="bg-bg">
    <!-- ============ Hero ============ -->
    <section class="relative overflow-hidden bg-[#070B18] text-white">
      <!-- 精致 mesh 渐变层 -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-[-200px] right-[-100px] w-[680px] h-[680px] rounded-full" style="background: radial-gradient(circle, rgba(22,93,255,0.22) 0%, transparent 60%);" />
        <div class="absolute bottom-[-200px] left-[-100px] w-[560px] h-[560px] rounded-full" style="background: radial-gradient(circle, rgba(6,182,212,0.16) 0%, transparent 60%);" />
        <div class="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full" style="background: radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 60%);" />
      </div>
      <!-- 极淡网格底纹 -->
      <div class="absolute inset-0 opacity-[0.035] pointer-events-none" style="background-image: linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px); background-size: 72px 72px;" />

      <!-- Hero 主体 -->
      <div class="relative max-w-[1280px] mx-auto px-[40px] pt-[120px] pb-[72px]">
        <div class="grid grid-cols-12 gap-[48px] items-center">
          <div class="col-span-7">
            <div class="inline-flex items-center gap-[8px] px-[12px] py-[5px] rounded-full bg-white/[0.06] border border-white/[0.10] text-[12px] font-medium mb-[28px]">
              <span class="w-[6px] h-[6px] rounded-full bg-[#3B82F6] animate-pulse" />
              江苏省医保局统筹建设 · 三类角色协同
            </div>
            <h1 class="text-[56px] font-bold leading-[1.1] tracking-[-0.8px]">
              <span class="block" style="background: linear-gradient(90deg, #FFFFFF 0%, #B4D0FF 50%, #06B6D4 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">江苏医保 AI 服务管理平台</span>
            </h1>
            <p class="mt-[24px] text-[16px] text-white/65 leading-[1.85] max-w-[580px]">
              统一管理医疗机构、AI开发者、运营管理三方协同，覆盖模型、智能体、数据资源、知识资源、平台工具的全生命周期管理与计量计费。
            </p>

            <!-- Hero 底部数据条 -->
            <div class="mt-[56px] grid grid-cols-3 gap-[32px] max-w-[560px] pt-[32px] border-t border-white/[0.08]">
              <div v-for="stat in heroStats" :key="stat.label">
                <div class="font-num text-[32px] font-bold leading-none" style="background: linear-gradient(135deg, #FFFFFF 0%, #B4D0FF 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">{{ stat.value }}</div>
                <div class="text-[12px] text-white/55 mt-[8px]">{{ stat.label }}</div>
              </div>
            </div>
          </div>

          <!-- 右侧浮动能力卡（玻璃质感） -->
          <div class="col-span-5">
            <div class="relative">
              <!-- 主卡 -->
              <div class="rounded-[16px] bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] p-[24px] shadow-2xl shadow-black/40">
                <div class="flex items-center justify-between mb-[20px]">
                  <div class="text-[14px] font-semibold">平台核心定位</div>
                  <span class="text-[11px] text-white/40 px-[8px] py-[3px] rounded-full bg-white/[0.05] border border-white/[0.08]">面向三类角色</span>
                </div>
                <div class="space-y-[10px]">
                  <div v-for="f in heroFeatures" :key="f.title" class="flex items-start gap-[12px] p-[12px] rounded-[10px] hover:bg-white/[0.04] transition-all duration-300 group">
                    <div class="w-[36px] h-[36px] rounded-[10px] grid place-items-center shrink-0 transition-transform duration-300 group-hover:scale-110" :style="{ background: f.bg }">
                      <component :is="f.icon" class="text-[18px]" :style="{ color: f.color }" />
                    </div>
                    <div class="flex-1">
                      <div class="text-[14px] font-semibold leading-none">{{ f.title }}</div>
                      <div class="text-[12px] text-white/55 leading-[16px] mt-[5px]">{{ f.desc }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 装饰浮卡 - 移除冗余信息 -->
            </div>
          </div>
        </div>
      </div>

      <!-- Hero 底部过渡弧线 -->
      <div class="absolute bottom-0 left-0 right-0 h-[1px]" style="background: linear-gradient(90deg, transparent 0%, rgba(22,93,255,0.4) 50%, transparent 100%);" />
    </section>

    <!-- ============ 平台核心能力 ============ -->
    <section class="py-[80px] px-[40px]">
      <div class="max-w-[1280px] mx-auto">
        <div class="flex items-end justify-between mb-[40px]">
          <div>
            <div class="text-[12px] font-semibold text-primary tracking-[2px] mb-[12px] uppercase">CORE CAPABILITIES</div>
            <h2 class="text-[36px] font-bold text-text-primary tracking-[-0.4px] leading-[1.2]">平台核心能力</h2>
            <p class="text-[14px] text-text-secondary mt-[10px]">覆盖数据治理、模型研发、能力扩展、智能体搭建、测试评估与部署运维全流程</p>
          </div>
          <div class="hidden md:flex items-center gap-[6px] text-[12px] text-text-tertiary px-[12px] py-[6px] rounded-full bg-bg-soft border border-border-soft">
            <InfoCircleOutlined /> 6 项核心能力
          </div>
        </div>
        <div class="grid grid-cols-3 gap-[20px]">
          <div
            v-for="(cap, idx) in capabilities"
            :key="cap.title"
            class="group relative bg-white border border-border-soft rounded-[12px] p-[28px] transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
          >
            <!-- 顶部渐变条 -->
            <div class="absolute top-0 left-[28px] right-[28px] h-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" :style="{ background: `linear-gradient(90deg, ${cap.accent} 0%, transparent 100%)` }" />
            <div class="flex items-start justify-between mb-[20px]">
              <div class="w-[52px] h-[52px] rounded-[12px] grid place-items-center transition-transform duration-300 group-hover:scale-110" :style="{ background: cap.iconBg }">
                <component :is="cap.icon" class="text-[26px]" :style="{ color: cap.accent }" />
              </div>
              <div class="font-num text-[40px] font-bold leading-none" :style="{ color: cap.accent + '15' }">{{ String(idx + 1).padStart(2, '0') }}</div>
            </div>
            <div class="text-[18px] font-semibold text-text-primary">{{ cap.title }}</div>
            <p class="mt-[10px] text-[13px] text-text-secondary leading-[22px]">{{ cap.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 五类 AI 能力分类 ============ -->
    <section class="py-[80px] px-[40px] bg-gradient-to-b from-[#F7F8FA] to-white border-y border-border-soft">
      <div class="max-w-[1280px] mx-auto">
        <div class="flex items-end justify-between mb-[40px]">
          <div>
            <div class="text-[12px] font-semibold text-primary tracking-[2px] mb-[12px] uppercase">CAPABILITY CATEGORIES</div>
            <h2 class="text-[36px] font-bold text-text-primary tracking-[-0.4px] leading-[1.2]">五类 AI 能力分类</h2>
            <p class="text-[14px] text-text-secondary mt-[10px]">按开发主体与风险属性分类管理，实施差异化准入与计量策略</p>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-[16px]">
          <div
            v-for="(cat, idx) in serviceCategories"
            :key="cat.id"
            class="group relative bg-white border border-border-soft rounded-[12px] p-[24px] block overflow-hidden transition-all duration-300 hover:border-transparent hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1"
          >
            <!-- 悬浮背景渐变 -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" :style="{ background: `linear-gradient(135deg, ${cat.color}08 0%, transparent 100%)` }" />
            <div class="relative">
              <div class="flex items-center justify-between mb-[18px]">
                <div class="w-[44px] h-[44px] rounded-[10px] grid place-items-center transition-transform duration-300 group-hover:scale-110" :style="{ background: cat.color + '14' }">
                  <component :is="catIcons[cat.id]" class="text-[22px]" :style="{ color: cat.color }" />
                </div>
                <span class="font-num text-[12px] font-semibold opacity-30 group-hover:opacity-100 transition-opacity" :style="{ color: cat.color }">0{{ idx + 1 }}</span>
              </div>
              <div class="text-[15px] font-semibold text-text-primary leading-[1.4]">{{ cat.label }}</div>
              <p class="mt-[8px] text-[12px] text-text-tertiary leading-[18px] h-[54px]">{{ cat.description }}</p>
              <div class="mt-[14px] pt-[14px] border-t border-border-soft text-[12px] font-medium flex items-center gap-[4px] group-hover:gap-[8px] transition-all" :style="{ color: cat.color }">
                查看服务 <ArrowRightOutlined class="text-[10px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 精选 AI 服务 ============ -->
    <section class="py-[80px] px-[40px]">
      <div class="max-w-[1280px] mx-auto">
        <div class="flex items-end justify-between mb-[40px]">
          <div>
            <div class="text-[12px] font-semibold text-primary tracking-[2px] mb-[12px] uppercase">FEATURED SERVICES</div>
            <h2 class="text-[36px] font-bold text-text-primary tracking-[-0.4px] leading-[1.2]">精选 AI 服务</h2>
            <p class="text-[14px] text-text-secondary mt-[10px]">平台热门 AI 模型与智能体，已通过合规审核并稳定运行</p>
          </div>
        </div>
        <div class="grid grid-cols-4 gap-[16px]">
          <ServiceCard v-for="item in featuredServices" :key="item.id" :item="item" />
        </div>
      </div>
    </section>

    <!-- ============ 典型应用场景 ============ -->
    <section class="py-[80px] px-[40px] bg-gradient-to-b from-white to-[#F7F8FA] border-y border-border-soft">
      <div class="max-w-[1280px] mx-auto">
        <div class="mb-[40px]">
          <div class="text-[12px] font-semibold text-primary tracking-[2px] mb-[12px] uppercase">USE CASES</div>
          <h2 class="text-[36px] font-bold text-text-primary tracking-[-0.4px] leading-[1.2]">典型应用场景</h2>
          <p class="text-[14px] text-text-secondary mt-[10px]">覆盖医保监管、临床辅助、疾病筛查等核心业务场景</p>
        </div>
        <div class="grid grid-cols-3 gap-[20px]">
          <div v-for="uc in useCases" :key="uc.title" class="group relative bg-white border border-border-soft rounded-[12px] p-[24px] transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
            <div class="flex items-center gap-[12px] mb-[14px]">
              <div class="w-[40px] h-[40px] rounded-[10px] grid place-items-center transition-transform duration-300 group-hover:scale-110" :style="{ background: uc.iconBg }">
                <component :is="uc.icon" class="text-[20px]" :style="{ color: uc.iconColor }" />
              </div>
              <span class="text-[16px] font-semibold text-text-primary">{{ uc.title }}</span>
            </div>
            <p class="text-[13px] text-text-secondary leading-[22px]">{{ uc.desc }}</p>
            <div class="mt-[16px] pt-[16px] border-t border-border-soft flex flex-wrap gap-[6px]">
              <span v-for="tag in uc.tags" :key="tag" class="text-[11px] px-[8px] py-[3px] rounded-[4px] bg-bg-soft text-text-secondary">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- ============ 底部 CTA ============ -->
  <section class="relative bg-[#070B18] px-[64px] py-[64px] text-center text-white">
    <!-- mesh 渐变 -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[-100px] right-[-50px] w-[400px] h-[400px] rounded-full" style="background: radial-gradient(circle, rgba(22,93,255,0.25) 0%, transparent 60%);" />
      <div class="absolute bottom-[-100px] left-[-50px] w-[400px] h-[400px] rounded-full" style="background: radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 60%);" />
    </div>
    <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px); background-size: 48px 48px;" />
    <div class="relative">
      <h2 class="text-[32px] font-bold tracking-[-0.4px]">立即加入江苏医保 AI 服务生态</h2>
      <p class="mt-[12px] text-[15px] text-white/65">提交资质材料，触达全省 128 家接入机构，共享 AI 服务能力</p>
      <div class="mt-[32px] flex justify-center gap-[14px]">
        <router-link to="/onboarding">
          <a-button size="large" class="!h-[48px] !w-[148px] !bg-[#165DFF] !border-[#165DFF] !text-white !font-semibold hover:!bg-[#4080FF] !shadow-lg !shadow-[#165DFF]/30">
            申请入驻
          </a-button>
        </router-link>
        <router-link to="/login">
          <a-button size="large" ghost class="!h-[48px] !w-[148px] !text-white !border-white/25 hover:!bg-white/[0.06]">
            立即登录
          </a-button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  RobotOutlined, AppstoreOutlined, SafetyCertificateOutlined, CalculatorOutlined,
  BarChartOutlined, AuditOutlined, MedicineBoxOutlined, ScanOutlined,
  FileTextOutlined, ThunderboltOutlined, BulbOutlined,
  WalletOutlined, InfoCircleOutlined, ArrowRightOutlined,
} from '@ant-design/icons-vue';
import { capabilityGroups, serviceCategories } from '../data';
import type { ServiceCategory } from '../types';
import ServiceCard from '../components/capability/ServiceCard.vue';

const heroStats = [
  { label: '上架 AI 服务', value: '256+' },
  { label: '接入机构', value: '128' },
  { label: '日调用量', value: '1.84M' },
];

const heroFeatures = [
  { title: '五类能力分类', desc: '通用基础 / 医保自研 / 基金监管 / 共建垂直 / 市场生态', icon: MedicineBoxOutlined, bg: 'linear-gradient(135deg, rgba(6,182,212,0.20) 0%, rgba(6,182,212,0.08) 100%)', color: '#22D3EE' },
  { title: '统一对接入口', desc: 'API 与 SDK 一键接入，全省机构可订阅', icon: ThunderboltOutlined, bg: 'linear-gradient(135deg, rgba(245,158,11,0.20) 0%, rgba(245,158,11,0.08) 100%)', color: '#FBBF24' },
  { title: '安全合规底座', desc: '网信办备案 + 医疗器械证 + 算法备案', icon: SafetyCertificateOutlined, bg: 'linear-gradient(135deg, rgba(16,185,129,0.20) 0%, rgba(16,185,129,0.08) 100%)', color: '#34D399' },
];

const capabilities = [
  { title: '统一纳管', desc: '将各类模型、智能体、数据资源、知识资源、平台工具纳入统一目录体系，形成清晰的服务分类与业务档案。', icon: AppstoreOutlined, accent: '#165DFF', iconBg: '#E8F3FF' },
  { title: '三级审核', desc: '按临床应用风险实行差异化审核：高风险全流程、中风险简化测试、低风险备案上架。', icon: SafetyCertificateOutlined, accent: '#16A34A', iconBg: '#E7F7EE' },
  { title: '词元计量', desc: '将不同类型 AI 服务转化为统一可核算的词元消耗，支撑使用可计量、成本可核算。', icon: CalculatorOutlined, accent: '#06B6D4', iconBg: '#E0F7FA' },
  { title: '多方分润', desc: '医保结算分润、运营服务费、AI 厂商收益分成、平台运维费，形成多方分润闭环。', icon: WalletOutlined, accent: '#F59E0B', iconBg: '#FEF3E7' },
  { title: '运行监测', desc: '接入机构、上架服务、调用总量、活跃用户、调用趋势和异常预警综合监测。', icon: BarChartOutlined, accent: '#7C3AED', iconBg: '#F1E7FE' },
  { title: '安全审计', desc: '服务调用、权限变更、材料审核、额度调整、账单确认等关键行为纳入审计管理。', icon: AuditOutlined, accent: '#EF4444', iconBg: '#FEE7EB' },
];

const catIcons: Record<ServiceCategory, any> = {
  通用基础大模型: RobotOutlined,
  医保自研专属大模型: MedicineBoxOutlined,
  医保基金监管共建模型: SafetyCertificateOutlined,
  省头部医疗机构共建垂直模型: ScanOutlined,
  市场化合规生态AI产品: AppstoreOutlined,
};

const featuredServices = computed(() => {
  const all = capabilityGroups.flatMap((g) => g.columns.flatMap((c) => c.items));
  return all.filter((s) => s.status === '已上线使用').slice(0, 8);
});

const useCases = [
  { title: '医保监管', desc: '高值耗材比对、检查检验比对、电子处方合规审查，识别违规风险。', icon: SafetyCertificateOutlined, tags: ['高值耗材', '检查检验', '处方审查'], iconBg: '#F1E7FE', iconColor: '#7C3AED' },
  { title: '临床辅助', desc: '影像辅助诊断、心电分析、医嘱辅助判断，提升临床决策效率。', icon: MedicineBoxOutlined, tags: ['影像', '心电', '医嘱'], iconBg: '#E8F3FF', iconColor: '#165DFF' },
  { title: '疾病筛查', desc: '肺结节、眼底、肝癌等专科疾病早期筛查，支持大规模人群随访。', icon: ScanOutlined, tags: ['肺结节', '眼底', '肝癌'], iconBg: '#E0F7FA', iconColor: '#06B6D4' },
  { title: '电子病历', desc: '病历辅助生成、规范稽核、全结构化录入，减轻医师文书负担。', icon: FileTextOutlined, tags: ['生成', '稽核', '结构化'], iconBg: '#E7F7EE', iconColor: '#16A34A' },
  { title: '智能导诊', desc: '基于症状的智能导诊与健康助手，引导患者合理就医。', icon: BulbOutlined, tags: ['导诊', '健康助手'], iconBg: '#FEF3E7', iconColor: '#F59E0B' },
  { title: '健康筛查', desc: '面向体检中心与基层医疗的多病种一扫多查与慢病管理。', icon: ThunderboltOutlined, tags: ['多病种', '慢病'], iconBg: '#FEE7EB', iconColor: '#EF4444' },
];
</script>
