export interface PrdChapter {
  id: number
  title: string
  content: string
}

export const prdChapters: PrdChapter[] = [
  {
    id: 0,
    title: '',
    content: `<h1>产品需求文档</h1>
<h2>3. 功能详述</h2>

<h3 id="prd-3.1">3.1 登录</h3>
<p><strong>功能描述：</strong>用户登录系统，接入统一用户中心进行身份认证与权限管理。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>详细设计：</strong></p>
<p>系统接入统一用户中心，用户通过统一用户中心进行身份认证与授权，无需重复注册与登录。统一用户中心负责用户身份管理、角色权限分配与安全认证，平台通过接口获取用户信息与权限数据。</p>

<h3 id="prd-3.2">3.2 模型/智能体编目</h3>
<p><strong>入口页面：</strong>运营管理 / 模型/智能体</p>
<p><strong>页面描述：</strong>将各类模型、智能体纳入统一目录体系，按能力分类与风险等级差异化纳管，管理员可进行新增、编辑、查看详情、上架/下架操作，普通用户可查看详情与申请使用。</p>

<h3 id="prd-3.2.1">3.2.1 模型编目列表</h3>
<p><strong>模块描述：</strong>模型/智能体 / 模型编目列表</p>
<p><strong>功能描述：</strong>展示全量模型编目列表，支持多维度筛选，管理员可进行新增、编辑、查看详情及上架/下架操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>进入页面时自动加载</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>开始时间范围</td><td></td><td>日期范围选择器，支持选择起止日期，按模型开始时间过滤</td></tr>
<tr><td>模型名称</td><td></td><td>文本输入，支持模糊搜索</td></tr>
<tr><td>资产标识</td><td></td><td>文本输入，支持模糊搜索</td></tr>
<tr><td>模型代码</td><td></td><td>文本输入，支持模糊搜索</td></tr>
<tr><td>研发单位</td><td></td><td>文本输入，支持模糊搜索</td></tr>
<tr><td>接入状态</td><td></td><td>枚举：已上线使用、已下架，默认不选中</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空筛选条件，重置列表为全部数据</td></tr>
<tr><td>列设置</td><td></td><td>点击弹出列显示控制面板，可勾选隐藏/显示列表字段</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为全量模型编目数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按开始时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>模型名称</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>资产标识</td><td></td><td>模型名称下方灰色小字展示，<span style="color:#EF4444">格式：MDL-YYYYMMDD-序号（待定）</span>；为空时显示"--"</td></tr>
<tr><td>模型代码</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>研发单位</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>开始时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>状态</td><td></td><td>枚举：已上线使用（绿色徽标）、已下架（红色徽标）</td></tr>
</table>
<p>3、状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
已上线使用 --(下架)--→ 已下架
     ┆                     ┆
     └┄┄(重新上架)┄┄←┄┄┄┄┘
</pre>
<table>
<tr><th style="white-space:nowrap">状态名称</th><th style="white-space:nowrap">状态代码</th><th>状态对应操作</th></tr>
<tr><td>已上线使用</td><td></td><td>详情、编辑、下架</td></tr>
<tr><td>已下架</td><td></td><td>详情、编辑、上架</td></tr>
</table>

<h3 id="prd-3.2.2">3.2.2 模型编目新增</h3>
<p><strong>模块描述：</strong>模型/智能体 / 模型编目新增页面</p>
<p><strong>功能描述：</strong>新增模型编目，可设置基本信息、服务描述、调用说明、数据要求等信息，提交后进入审核流程。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>管理员点击列表页【新增编目-按钮】跳转至独立新增页面</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>模型名称</td><td></td><td>1.必填，限制40汉字，超出不可输入，显示计数器；<br>2.占位提示"如：肺结节CT图像辅助检测"</td></tr>
<tr><td>模型代码</td><td></td><td>1.必填，限制30字符，超出不可输入，显示计数器；<br>2.占位提示"如：LUNG-NUD-CT-001"</td></tr>
<tr><td>研发单位</td><td></td><td>1.必填，下拉选择，支持搜索过滤；<br>2.枚举：平台入驻的所有厂商<br><span style="color:#EF4444;font-size:11px">注：目前厂商数据为前端写死——推想医疗科技股份有限公司（91110108MA002XL790）、深圳市旭东数字医学影像技术有限公司（914403005700203962）、慧影医疗科技（北京）股份有限公司（91110108335563403F）</span></td></tr>
<tr><td>统一社会信用代码</td><td></td><td>系统根据所选研发单位自动填入，不可编辑</td></tr>
</table>
<p>2、服务描述</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>LOGO</td><td></td><td>1.非必填，支持 JPG、PNG、JPEG、SVG、WebP 格式，大小限制 2MB 以内；<br>2.上传图片超过 2MB 时，Toast 提示"图片大小已超过2M，建议压缩图片后重新上传"；<br>3.重复上传覆盖之前图片，自动删除前一个图片；<br>4.删除已上传图片时，Toast 提示"你确定要删除这个图片吗？"</td></tr>
<tr><td>一句话简介</td><td></td><td>非必填，限制30汉字，超出不可输入，显示计数器；占位提示"30 字以内，简明描述模型核心能力"</td></tr>
<tr><td>适用场景</td><td></td><td>非必填，标签输入模式，支持输入逗号分隔多个标签，枚举：辅助诊断</td></tr>
<tr><td>产品介绍</td><td></td><td>非必填，限制1000汉字，超出不可输入，显示计数器；占位提示"详细介绍模型能力、技术原理、临床价值等"</td></tr>
</table>
<p>3、调用说明</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>前端入口地址</td><td></td><td>非必填，机构工作台点击"进入服务"后跳转的页面，选填</td></tr>
<tr><td>推送地址</td><td></td><td>非必填，平台调用该模型推理服务的接口地址</td></tr>
<tr><td>推送查询地址</td><td></td><td>非必填，推送结果查询地址</td></tr>
</table>
<p>4、数据要求</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>配置类别</td><td></td><td>非必填，下拉选择；枚举：影像(IMG)</td></tr>
<tr><td>支持的检查模态</td><td></td><td>非必填，标签输入模式，支持输入逗号分隔多个标签；枚举：CT、DR、DX</td></tr>
<tr><td>符合要求的数据说明</td><td></td><td>非必填，限制500汉字，超出不可输入，显示计数器；占位提示"注明哪些数据符合模型输入要求"</td></tr>
</table>
<p>5、操作-提交审核</p>
<p>点击【提交审核-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填、字符限制等要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">模型名称为空：请输入模型名称</p>
<p style="font-style:italic; color:#999">模型代码为空：请输入模型代码</p>
<p style="font-style:italic; color:#999">研发单位为空：请选择研发单位</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，初始状态为已上线使用，进行消息提示，返回列表页</p>
<p style="font-style:italic; color:#999">Tip：新增成功</p>
<p>b.系统自动生成资产标识（<span style="color:#EF4444">格式：MDL-YYYYMMDD-序号（待定）</span>）</p>
<p>c.系统自动生成审核记录：提交审核时间取创建时间、提交人取当前管理员、审核状态为"已通过"、审核意见为"管理员代开通，即时生效"、审核时间取创建时间、操作人取当前管理员</p>
<p>6、操作-返回</p>
<p>点击【返回-按钮】，返回列表页，不保存任何修改。</p>

<h3 id="prd-3.2.3">3.2.3 模型编目编辑</h3>
<p><strong>模块描述：</strong>模型/智能体 / 模型编目编辑页面</p>
<p><strong>功能描述：</strong>编辑已有模型编目，可修改基本信息、服务描述、调用说明、数据要求等信息。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>管理员点击列表页【编辑-按钮】，跳转至编辑页面，预填当前数据</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>模型名称</td><td></td><td>1.必填，限制40汉字，超出不可输入，显示计数器；<br>2.回显原模型名称，可修改</td></tr>
<tr><td>模型代码</td><td></td><td>1.必填，限制30字符，超出不可输入，显示计数器；<br>2.回显原模型代码，可修改</td></tr>
<tr><td>研发单位</td><td></td><td>1.必填，下拉选择，支持搜索过滤；<br>2.回显原研发单位，可修改</td></tr>
<tr><td>统一社会信用代码</td><td></td><td>系统根据所选研发单位自动填入，不可编辑；回显原信用代码</td></tr>
</table>
<p>2、服务描述</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>LOGO</td><td></td><td>1.非必填，支持 JPG、PNG、JPEG、SVG、WebP 格式，大小限制 2MB 以内；<br>2.回显原LOGO，可修改；<br>3.重复上传覆盖之前图片，自动删除前一个图片</td></tr>
<tr><td>一句话简介</td><td></td><td>非必填，限制30汉字，超出不可输入，显示计数器；回显原简介，可修改</td></tr>
<tr><td>适用场景</td><td></td><td>非必填，标签输入模式，回显原标签，可修改</td></tr>
<tr><td>产品介绍</td><td></td><td>非必填，限制1000汉字，超出不可输入，显示计数器；回显原介绍，可修改</td></tr>
</table>
<p>3、调用说明</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>前端入口地址</td><td></td><td>非必填，回显原地址，可修改</td></tr>
<tr><td>推送地址</td><td></td><td>非必填，回显原地址，可修改</td></tr>
<tr><td>推送查询地址</td><td></td><td>非必填，回显原地址，可修改</td></tr>
</table>
<p>4、数据要求</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>配置类别</td><td></td><td>非必填，下拉选择；回显原类别，可修改</td></tr>
<tr><td>支持的检查模态</td><td></td><td>非必填，标签输入模式；回显原模态，可修改</td></tr>
<tr><td>符合要求的数据说明</td><td></td><td>非必填，限制500汉字，超出不可输入，显示计数器；回显原说明，可修改</td></tr>
</table>
<p>5、操作-提交审核</p>
<p>点击【提交审核-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填、字符限制等要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：具体提示文案同新增页面</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，进行消息提示，返回列表页</p>
<p style="font-style:italic; color:#999">Tip：保存成功</p>
<p>b.系统自动生成审核记录：提交审核时间取创建时间、提交人取当前管理员、审核状态为"已通过"、审核意见为"管理员编辑后重新提交，即时生效"、审核时间取创建时间、操作人取当前管理员</p>
<p>6、操作-返回</p>
<p>点击【返回-按钮】，返回列表页，不保存任何修改。</p>

<h3 id="prd-3.2.4">3.2.4 模型编目详情</h3>
<p><strong>模块描述：</strong>模型/智能体 / 模型编目详情抽屉</p>
<p><strong>功能描述：</strong>查看模型编目的详细信息，包含概览（基本信息、服务描述、调用说明、数据要求）。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表行【详情-按钮】打开右侧抽屉</p>
<p><strong>详细设计：</strong></p>
<p>1、顶部概要</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>LOGO</td><td></td><td>展示模型LOGO，由模型/智能体页面维护</td></tr>
<tr><td>模型名称</td><td></td><td>完整展示，字体加粗</td></tr>
<tr><td>资产标识</td><td></td><td><span style="color:#EF4444">格式：MDL-YYYYMMDD-序号（待定）</span>，灰色小字显示</td></tr>
<tr><td>状态</td><td></td><td>已上线使用（绿色徽标）/ 已下架（红色徽标）</td></tr>
</table>
<p>2、Tab-概览 / 基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>研发单位</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>模型代码</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>统一社会信用代码</td><td></td><td>系统填入，完整展示</td></tr>
<tr><td>开始时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3、Tab-概览 / 服务描述</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>一句话简介</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>适用场景</td><td></td><td>以标签形式展示，为空时显示"--"</td></tr>
<tr><td>产品介绍</td><td></td><td>完整展示，为空时显示"--"</td></tr>
</table>
<p>4、Tab-概览 / 调用说明</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>前端入口</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>推送地址</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>推送查询地址</td><td></td><td>完整展示，为空时显示"--"</td></tr>
</table>
<p>5、Tab-概览 / 数据要求</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>配置类别</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>支持的检查模态</td><td></td><td>以标签形式展示，为空时显示"--"</td></tr>
<tr><td>符合要求的数据说明</td><td></td><td>完整展示，为空时显示"--"</td></tr>
</table>
<p>6、操作-关闭</td>
<p>点击抽屉右上角【关闭按钮】或点击遮罩层，关闭抽屉，停留当前页面。</p>

<h3 id="prd-3.2.5">3.2.5 模型启停用</h3>
<p><strong>模块描述：</strong>模型/智能体 / 启停用操作</p>
<p><strong>功能描述：</strong>管理员在列表中对模型执行上架/下架操作，切换模型的接入状态。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>管理员在列表操作列点击【下架】或【上架-按钮】</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-下架</p>
<p>针对已上线使用状态的模型，管理员点击【下架-按钮】，弹出二次确认框：</p>
<p>1）操作-取消</p>
<p>点击【取消-按钮】，关闭确认框，停留当前页面。</p>
<p>2）操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>a.若网络异常/超时/宕机，关闭确认框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>b.若满足条件，模型状态变更为已下架，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：XXX 已下架</p>
<p>2、操作-上架</p>
<p>针对已下架状态的模型，管理员点击【上架-按钮】，弹出二次确认框：</p>
<p>1）操作-取消</p>
<p>点击【取消-按钮】，关闭确认框，停留当前页面。</p>
<p>2）操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>a.若网络异常/超时/宕机，关闭确认框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>b.若满足条件，模型状态变更为已上线使用，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：XXX 已上架</p>

<h3 id="prd-3.3">3.3 服务开通管理</h3>
<p><strong>入口页面：</strong>运营管理 / 服务开通列表</p>
<p><strong>页面描述：</strong>查看全量机构已开通服务的额度、凭证与审核溯源信息，支持管理员代开通服务，可进行查看详情、停用/启用操作。</p>

<h3 id="prd-3.3.1">3.3.1 服务开通列表</h3>
<p><strong>模块描述：</strong>服务开通管理 / 服务开通列表</p>
<p><strong>功能描述：</strong>展示全量机构已开通服务的台账信息，支持多维度筛选，管理员可进行服务开通、查看详情、编辑及停用/启用操作。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>进入页面时自动加载</p>
<p><strong>详细设计：</strong></p>
<p>1、筛选区域</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>开始时间范围</td><td></td><td>日期范围选择器，支持选择起止日期，按开始时间过滤</td></tr>
<tr><td>服务名称</td><td></td><td>文本输入，支持模糊搜索</td></tr>
<tr><td>资产标识</td><td></td><td>文本输入，支持模糊搜索</td></tr>
<tr><td>研发单位</td><td></td><td>文本输入，支持模糊搜索</td></tr>
<tr><td>申请机构</td><td></td><td>文本输入，支持模糊搜索</td></tr>
<tr><td>状态</td><td></td><td>枚举：未开始、已开通、已过期、已停用，默认不选中</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新列表，响应对应内容</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空筛选条件，重置列表为全部数据</td></tr>
<tr><td>列设置</td><td></td><td>点击弹出列显示控制面板，可勾选隐藏/显示列表字段</td></tr>
</table>
<p>2、列表展示</p>
<p>1）数据范围为全量服务开通台账数据。</p>
<p>2）根据筛选查询条件，刷新列表并根据入参响应对应内容，按开始时间倒序排列。</p>
<p>3）默认加载10条最新数据，通过分页形式分隔长列表，可调整每页加载条数。</p>
<p>4）当前列表数据为空时，显示"暂无数据"。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>开始时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>截止时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>服务名称</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>资产标识</td><td></td><td>服务名称下方灰色小字展示，<span style="color:#EF4444">格式：MDL-YYYYMMDD-序号（待定）</span>；为空时显示"--"</td></tr>
<tr><td>研发单位</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>申请机构</td><td></td><td>完整展示，超出换行，为空时显示"--"</td></tr>
<tr><td>状态</td><td></td><td>根据时间自动计算：当前时间 &lt; 开始时间为未开始（默认灰色徽标）；当前时间 &gt; 截止时间为已过期（红色徽标，优先级最高，覆盖已停用）；管理员手动停用为已停用（红色徽标）；其余为已开通（绿色徽标）</td></tr>
<tr><td>创建时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
</table>
<p>3、状态流转与按钮</p>
<pre style="background:#f5f7fa;padding:12px;border-radius:4px;font-size:13px;line-height:1.8;overflow-x:auto">
未开始 --(到达开始时间)--→ 已开通 --(停用)--→ 已停用 --(启用)--→ 已开通
  ┆                         ┆                     ┆
  └┄┄(超过截止时间)┄┄→ 已过期 ←┄┄(超过截止时间)┄┄┘
</pre>
<table>
<tr><th style="white-space:nowrap">状态名称</th><th style="white-space:nowrap">状态代码</th><th>状态对应操作</th></tr>
<tr><td>未开始</td><td></td><td>详情、编辑</td></tr>
<tr><td>已开通</td><td></td><td>详情、编辑、停用</td></tr>
<tr><td>已过期</td><td></td><td>详情、编辑</td></tr>
<tr><td>已停用</td><td></td><td>详情、编辑、启用</td></tr>
</table>

<h3 id="prd-3.3.2">3.3.2 服务开通</h3>
<p><strong>模块描述：</strong>服务开通管理 / 服务开通弹窗</p>
<p><strong>功能描述：</strong>管理员代为机构开通服务，填写基本信息并选择要开通的服务后提交，即时生效。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>管理员点击列表页【服务开通-按钮】打开弹窗</p>
<p><strong>详细设计：</strong></p>
<p>1、基本信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>申请机构</td><td></td><td>1.必填，下拉选择，支持搜索过滤；<br>2.选择后自动填入统一社会信用代码<br><span style="color:#EF4444;font-size:11px">注：直接调用用户中心API获取启用的所有机构列表</span></td></tr>
<tr><td>统一社会信用代码</td><td></td><td>系统根据所选申请机构自动填入，不可编辑</td></tr>
<tr><td>用途说明</td><td></td><td>必填，多行文本输入，占位提示"请描述机构使用该服务的具体业务场景与预期效果"</td></tr>
<tr><td>联系人</td><td></td><td>非必填，选择机构后自动填入预设联系人，可修改</td></tr>
<tr><td>联系电话</td><td></td><td>非必填，选择机构后自动填入预设联系电话，可修改</td></tr>
<tr><td>开始时间</td><td></td><td>非必填，日期时间选择器，精确到秒；留空则创建后即时生效（带Tooltip提示"留空则创建后即时生效"）</td></tr>
<tr><td>截止时间</td><td></td><td>非必填，日期时间选择器，精确到秒；留空则不限期限（带Tooltip提示"留空则不限期限"）</td></tr>
</table>
<p>2、选择服务</p>
<p>1）以表格形式展示所有状态为"已上线使用"的模型编目，支持多选（复选框）。</p>
<p>2）支持按服务名称、服务代码、研发单位筛选可用服务。</p>
<p>3）必须至少选择一个服务方可提交。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>复选框</td><td></td><td>支持多选，点击行也可切换选中状态</td></tr>
<tr><td>服务名称</td><td></td><td>展示模型名称，左侧有图标</td></tr>
<tr><td>服务代码</td><td></td><td>完整展示</td></tr>
<tr><td>研发单位</td><td></td><td>完整展示</td></tr>
<tr><td>查询按钮</td><td></td><td>点击后以筛选条件为入参，刷新可选服务列表</td></tr>
<tr><td>重置按钮</td><td></td><td>点击后清空筛选条件，重置为全部</td></tr>
</table>
<p>3、操作-提交开通申请</p>
<p>点击【提交开通申请-按钮】，判断逻辑如下：</p>
<p>1）若不满足必填要求，进行表单校验提示</p>
<p style="font-style:italic; color:#999">Tip：</p>
<p style="font-style:italic; color:#999">申请机构为空：请选择申请机构</p>
<p style="font-style:italic; color:#999">用途说明为空：请填写用途说明</p>
<p style="font-style:italic; color:#999">未选择服务：请至少选择一个服务</p>
<p>2）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>3）若满足条件：</p>
<p>a.管理员提交即视为审核通过，即时生效，状态为已开通，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：服务开通成功</p>
<p>b.开始时间如未填写则以创建时间为准，截止时间如未填写则设为不限期限</p>
<p>c.系统自动生成审核记录：提交审核时间取创建时间、提交人取当前管理员、审核状态为"已通过"、审核意见为"管理员代开通，即时生效"、审核时间取创建时间、操作人取当前管理员</p>
<p>4、操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，停留当前页面，不保存任何修改。</p>

<h3 id="prd-3.3.3">3.3.3 服务开通编辑</h3>
<p><strong>模块描述：</strong>服务开通管理 / 服务开通编辑弹窗</p>
<p><strong>功能描述：</strong>编辑已开通服务的联系人、有效期等信息，界面结构同服务开通但不显示下方的服务选择区域，申请机构与信用代码、用途说明置灰不可编辑。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>管理员在列表操作列点击【编辑-按钮】打开弹窗，预填当前数据</p>
<p><strong>详细设计：</strong></p>
<p>1、表单字段</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>申请机构</td><td></td><td>回显原申请机构，置灰不可编辑</td></tr>
<tr><td>统一社会信用代码</td><td></td><td>回显原信用代码，置灰不可编辑</td></tr>
<tr><td>用途说明</td><td></td><td>回显原用途说明，置灰不可编辑</td></tr>
<tr><td>联系人</td><td></td><td>回显原联系人，可修改</td></tr>
<tr><td>联系电话</td><td></td><td>回显原联系电话，可修改</td></tr>
<tr><td>开始时间</td><td></td><td>非必填，日期时间选择器，精确到秒；回显原开始时间，可修改；留空则即时生效</td></tr>
<tr><td>截止时间</td><td></td><td>非必填，日期时间选择器，精确到秒；回显原截止时间，可修改；留空则不限期限</td></tr>
</table>
<p>2、操作-保存</p>
<p>点击【保存-按钮】，判断逻辑如下：</p>
<p>1）若网络异常/超时/宕机，进行消息提示，停留当前页面</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>2）若满足条件，进行消息提示，关闭弹窗，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：保存成功</p>
<p>3、操作-取消</p>
<p>点击【取消-按钮】，关闭弹窗，停留当前页面，不保存任何修改。</p>

<h3 id="prd-3.3.4">3.3.4 服务开通详情</h3>
<p><strong>模块描述：</strong>服务开通管理 / 服务开通详情抽屉</p>
<p><strong>功能描述：</strong>查看服务开通记录的详细信息，包含概览（基本信息、服务信息）。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>点击列表行【详情-按钮】打开右侧抽屉</p>
<p><strong>详细设计：</strong></p>
<p>1、顶部概要</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>LOGO</td><td></td><td>展示服务LOGO，由模型/智能体页面维护</td></tr>
<tr><td>服务名称</td><td></td><td>完整展示，字体加粗</td></tr>
<tr><td>资产标识</td><td></td><td><span style="color:#EF4444">格式：MDL-YYYYMMDD-序号（待定）</span>，灰色小字显示</td></tr>
<tr><td>状态</td><td></td><td>未开始（默认灰色徽标）、已开通（绿色徽标）、已过期（红色徽标）、已停用（红色徽标）</td></tr>
</table>
<p>2、Tab-概览 / 基本信息</p>
<p>基本信息区域每行独占一列。</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>申请机构</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>统一社会信用代码</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>联系人</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>联系电话</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>开始时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss</td></tr>
<tr><td>截止时间</td><td></td><td>格式：yyyy-MM-dd hh:mm:ss，为空时显示"--"</td></tr>
<tr><td>用途说明</td><td></td><td>完整展示，为空时显示"--"</td></tr>
</table>
<p>3、Tab-概览 / 服务信息</p>
<table>
<tr><th style="white-space:nowrap">字段名称</th><th style="white-space:nowrap">字段代码</th><th>字段逻辑</th></tr>
<tr><td>服务名称</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>服务代码</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>研发单位</td><td></td><td>完整展示，为空时显示"--"</td></tr>
<tr><td>统一社会信用代码</td><td></td><td>完整展示，为空时显示"--"</td></tr>
</table>
<p>4、操作-关闭</p>
<p>点击抽屉右上角【关闭按钮】或点击遮罩层，关闭抽屉，停留当前页面。</p>

<h3 id="prd-3.3.5">3.3.5 服务启停用</h3>
<p><strong>模块描述：</strong>服务开通管理 / 启停用操作</p>
<p><strong>功能描述：</strong>管理员在列表中对已开通服务执行停用/启用操作，控制服务的可用状态。</p>
<p><strong>优先级：</strong>P1</p>
<p><strong>输入/前置条件：</strong>管理员在列表操作列点击【停用】或【启用-按钮】</p>
<p><strong>详细设计：</strong></p>
<p>1、操作-停用</p>
<p>针对已开通状态的服务记录，管理员点击【停用-按钮】，弹出二次确认框：</p>
<p>1）操作-取消</p>
<p>点击【取消-按钮】，关闭确认框，停留当前页面。</p>
<p>2）操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>a.若网络异常/超时/宕机，关闭确认框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>b.若满足条件，服务状态变更为已停用，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：XXX 已停用</p>
<p>2、操作-启用</p>
<p>针对已停用状态的服务记录，管理员点击【启用-按钮】，弹出二次确认框：</p>
<p>1）操作-取消</p>
<p>点击【取消-按钮】，关闭确认框，停留当前页面。</p>
<p>2）操作-确定</p>
<p>点击【确定-按钮】，判断逻辑如下：</p>
<p>a.若网络异常/超时/宕机，关闭确认框，停留当前页面，进行消息提示</p>
<p style="font-style:italic; color:#999">Tip：异常处理提示文案开发人员自行定义</p>
<p>b.若满足条件，服务状态变更为已开通，进行消息提示，刷新列表</p>
<p style="font-style:italic; color:#999">Tip：XXX 已启用</p>

`
  },
]

// 路由与PRD章节映射
const routePrdMap: Record<string, { anchor: string; pageName: string }> = {
  '/admin/model-catalog-v2': { anchor: 'prd-3.2', pageName: '模型/智能体' },
  '/admin/model-catalog-v2/edit': { anchor: 'prd-3.2.2', pageName: '模型编目新增' },
  '/admin/operations/service-provisioning-v2': { anchor: 'prd-3.3', pageName: '服务开通列表' },
}

export function getAllPrdHtml(): string {
  return prdChapters.map(c => c.content).join('\n')
}

export function shouldShowPrd(path: string): boolean {
  return path === '/admin/model-catalog-v2/edit' || Object.keys(routePrdMap).includes(path)
}

export function getPrdAnchor(path: string, isEdit?: boolean): string {
  if (path === '/admin/model-catalog-v2/edit') {
    return isEdit ? 'prd-3.2.3' : 'prd-3.2.2'
  }
  return routePrdMap[path]?.anchor || ''
}

export function getPrdPageName(path: string, isEdit?: boolean): string {
  if (path === '/admin/model-catalog-v2/edit') {
    return isEdit ? '模型编目编辑' : '模型编目新增'
  }
  return routePrdMap[path]?.pageName || ''
}
