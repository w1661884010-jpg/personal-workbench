# 2026-09-05：实验演练页 UI 优化（信息层级、空间比例、可读性）

仅修改 3010 副本（`personal-workbench-shell`）。不改实验公式、计算算法、输入范围、默认值、
图表数据、完成判定与状态存储；不改数字/模拟工作台；不动原站。

## 一、现状证据（只读核验，2026-09-05）

**Git**：`main @ 379253c`（干净）；已有 6 个恢复标签；本轮将新增修改前
`restore-2026-09-05-before-practice-polish` 与完成后 `restore-2026-09-05-after-practice-polish`。

**数据（courses.js 真实数据，非数组位置猜测）**——信号课 6 个 notebook 实验：

| 实验 ID | 完整标题 | 章节 | 短标题（建议） | 演示 |
|---|---|---|---|---|
| signals-intro-notebook | 连续与离散信号观察 | 绪论 | 信号观察 | ✅ canvas（4 参数） |
| signals-ch1-convolution | 数值卷积验证三角脉冲 | ch1 | 卷积验证 | ✅ canvas（2 参数） |
| signals-ch2-aliasing | 采样率改变与混叠 | ch2 | 采样混叠 | ✅ canvas（4 参数） |
| signals-ch3-first-order-lti | 一阶 LTI 系统的递推与卷积核对 | ch3 | LTI 系统 | ❌ 占位提示（无参数/图表） |
| signals-ch4-moving-average | 移动平均 FIR 的降噪与频率响应 | ch4 | FIR 滤波 | ❌ 占位提示 |
| signals-ch5-random-average | 固定随机种子的方差验证 | ch5 | 方差验证 | ❌ 占位提示 |

**渲染入口**：`app.js` `renderNotebookView()`（725-871）构建整页；
openNotebookExperiment（894-901）→ `practiceShown` 内存态 + `renderNotebookView` + `setView("notebook")`；
`collectPracticeExperiments()`（712-723）从 signals 课程各 chapter 过滤 `workbench==="notebook"`；
`updateTabsCompletion()`（874-892）勾选后刷新 tab 完成标记与总进度（**以 .practice-tab-title 文本反查实验 = 风险点**）；
三个 canvas 渲染器在 `SIGNAL_DEMOS` 注册表（904-908），共用 `draw()` 模式：
`canvas.width = rect.width × dpr` + `ResizeObserver` + 400ms 兜底 + window resize 重绘（已具备自适应，不会 CSS 拉伸模糊）。

**样式**：styles.css 151-419（notebook-page/practice-* /demo-*）；当前右栏
`minmax(240px, 320px)` 固定宽；`.practice-tabs` flex-wrap 长胶囊；`.practice-overview` 总进度；
`.step-check` 大卡片（padding 13/14、border）；`.notebook-evidence` 左边框装饰；移动断点 620px。

**基线截图**：`D:\pw-practice-before.png`（1440×900）——
顶部 6 长胶囊 + “已完成 0/6 个演练”；h1 有**程序主动聚焦**产生的黑色 outline
（来源：`setView()` 1583-1586 `notebookRoot.querySelector("h1").focus()`，非用户键盘聚焦）；
“实验目标”独立标题；4 参数行；图例 3 项；3 结果格；右侧 3 张步骤大卡（含“待完成”）+ 预期证据。

## 二、需求映射

| # | 需求 | 修改位置 | 预期效果 | 验收 |
|---|---|---|---|---|
| 1 | 移除总进度展示与占位 | app.js 763-764 删除 overview 节点；890-891 删除 overview 更新；745/877 的 totalCompleted 计算仅保留 tab ✓ 标记 | 顶部无进度文字、无空白 | 截图/查询 `.practice-overview` 不存在，无残留边距 |
| 2 | 长胶囊→短标题导航 | 746-747：删章号 span（或弱化），title 用短标题；**tab 加 data-experiment-id**（修复 880 文本反查风险→按 id 匹配） | 紧凑、无换行（6 项 ≈ 720px） | 逐实验点击验证跳转正确；id 映射表 |
| 3 | 标题区重排 | 777 eyebrow 弱化为辅助文字（移出主视觉）；title 保留；goal 区删除 h2、目标一句随标题；back 按钮右上 | 标题层级清楚、返回按钮右上角 | 截图 + 焦点边框核验（见风险 5） |
| 4 | 参数等宽填满 | styles.css `.demo-controls` → grid `repeat(auto-fit, minmax(0,1fr))`；`.demo-field` label 行内或上、input width:100%、统一 padding/高 | 4 参数 4 列等宽填满；卷积 2 参数 2 列等宽；窄屏 2 列/1 列 | 1920/1440/390 测量各列宽 |
| 5 | 图表可读性 | 三个 draw() 内：坐标轴/刻度字 10→11px、gridText 加深、图例按 3 类区分明度/线型/标记（连续实线浅、离散深色 stem+点、峰值实心标记）；不改任何计算与数据 | 坐标轴刻度清晰；曲线/采样明确区分 | 截图对比；切换实验复查 |
| 6 | 结果格统一 | `.demo-metrics` auto-fit minmax(150px,1fr)+ gap 统一；`.demo-metric` 等高（行内 stretch 默认）；value 加字重/字号突出、label 弱化；长值自然换行 | 同行等高、数值突出、不裁切 | 3 实验结果格截图 |
| 7 | 步骤卡紧凑列表 | 改为 li 紧凑行（去卡片边框 → 背景差分层级）：保留编号/全文/完成标记/进度“已完成 x/3”；去掉“待完成”文案（status 空格？需求：去掉每项重复的“待完成”）；勾选逻辑不变 | 紧凑列表、同现有完成行为 | 勾选/取消状态与进度验证 |
| 8 | 预期证据常驻 | 767-777 样式弱化（去左边框或减淡），不折叠 | 低调常驻 | 截图 |
| 9 | 响应式 | `.practice-layout` 桌面 `minmax(0,75fr) minmax(260px,25fr)` 起（实际微调）；760px 单列；tabs nowrap + overflow-x:auto；620px 参数 2 列 | 右栏 ≥260px 不频繁断行；窄屏无页面横向溢出 | 1920/1440/390 滚动宽度与布局截图 |
| 10 | 键盘焦点 | 不全局删 outline；h1 程序聚焦问题定点处理；tab/input/step-check/back 保留 focus-visible | 键盘可达、无截图焦点边框误伤 | Tab 遍历验证 |

## 三、状态边界（谁管理什么）

- **总进度展示**：仅 `practice-overview` 节点（app.js 763-764/890-891）→ 本轮删除展示与更新调用；
  底层 `notebookChecks` 状态与“已完成 x/3”步骤进度（`notebook-progress`）**不变**。
- **实验步骤状态**：`notebookChecks[experiment.id] = boolean[]`（812-815 初始化，勾选 847-851 翻转），
  只存内存，切换演练/离开视图不丢；不因参数变化自动判定。
- **当前实验选择**：`practiceShown`（898）记忆上次演练；`activeNotebook` 元数据；tab 高亮由渲染闭包绑定。
- 移除 overview 后 `updateTabsCompletion` 仅保留 tab ✓ 标记刷新（按 data-experiment-id），
  不再存在对已删除节点的写入（原代码已有 `if (overview)` 保护，仍删除该段避免死代码）。

## 四、影响范围（选择器限定）

- 所有演练样式类（`.practice-*`、`.notebook-*`、`.demo-*`）**仅被演练页使用**（grep 确认），
  不影响课程正文（`.lesson-*`/`.text-card`）与工作台（`.cw-*`/`.circuit-workbench`）；
  `.step-check`/`.demo-controls` 等无跨页共用。改动限定在 styles.css 151-419 区块与 app.js 725-901。
- 唯一共享点：`notebookRoot` 内 `h1` 焦点获取在 `setView()`——只精确定位
  `.notebook-heading h1:focus` 规则，不动全局 outline。

## 五、响应式方案

| 断面 | 布局 |
|---|---|
| 1920/1440 桌面 | 左 `minmax(0,3fr)` / 右 `minmax(260px,1fr)`（≈75/25）；tabs 单行 nowrap；参数 auto-fit 等宽（4 参数 4 列、2 参数 2 列） |
| ≤900px | 右栏降为内容流（sticky 取消），两/单列过渡由 auto-fit 处理 |
| ≤760px | 单列：标题→参数→图表→结果→步骤→证据；tabs overflow-x:auto 横向滚（`scrollbar-width: thin`），选中项滚动进入视野（切换时 scrollIntoView 但不改页面滚动位置——只滚 tabs 自身） |
| ≤620px | 参数 2 列（auto-fit minmax(150px,1fr) 自然形成），heading 上下排列 |

## 六、风险核验结论（重点项）

1. **移除总进度后空引用**：`updateTabsCompletion` 890 已有 `if (overview)` 保护，仍将随本轮删除；
   全文件无其他 `.practice-overview` 引用（grep 3 处：创建、更新、样式）→ 无空引用风险。
2. **短标题 ↔ 实验 ID**：建立显式映射
   `EXPERIMENT_SHORT_TITLES = { "signals-intro-notebook": "信号观察", ... }`（六项全部来自上表核对），
   tab 带 `data-experiment-id`；**替换** `updateTabsCompletion` 按 title 文本反查（880-881）的
   模糊匹配为按数据属性匹配；跳转闭包（755-758）仍绑定真实 entry 对象，不依赖位置。
   标题无重复（六个完整 title 互异）。占位待实现实验（LTI/FIR/方差）同样有短标题导航。
3. **步骤 DOM 调整**：步骤列表在 `renderNotebookView` 内整体重建（先 `notebookRoot.textContent=""` 清空），
   每次渲染新按钮 + 新闭包（states[index] 引用当下数组）→ 无重复绑定；勾选逻辑只翻状态 + 局部重绘样式，
   参数变化不触碰步骤。改造为紧凑行时保留同一 click 绑定结构与 `updateTabsCompletion` 调用。
4. **图表尺寸**：canvas 已用 `getBoundingClientRect` + dpr 设置位图尺寸，`ResizeObserver` 监听画布 →
   列宽变化（左栏 75% 弹性）自动重绘，无 CSS 拉伸模糊；本轮不改该机制，只改绘制内容（刻度/图例）。
   无点击/拖动测量交互（canvas 仅绘制，无事件绑定）→ 无需坐标映射，验收只验证重绘正确性。
5. **标题焦点边框**：确认由 `setView()` 1583-1586 程序 `h1.focus()` 产生（截图黑色 outline）。
   处理：保留聚焦行为（进入页面定位阅读起点）；新增精确规则
   `.notebook-heading h1:focus { outline: none; }`（该元素 tabIndex=-1，
   键盘 Tab 永远无法聚焦，焦点环只有程序路径会出现，故不伤键盘可达性），**不动全局 outline**。
6. **6 个实验结构差异**：前 3 有 canvas 演示（参数 4/2/4、结果格 3/3/2 行）；后 3 无演示
   （占位提示 + 步骤 + 证据）。计划对两类分别验收，不以前三推断全部；后三重点验收
   “无参数/图表”布局仍均衡（占位区与左右比例协调）。
7. **不修改计算**：格式化函数（formatNumber 等）与测量算式全部保留；仅在 draw() 内调整
   视觉绘制参数（字体、颜色、线型、标记），不改采样点数、刻度值计算、数据序列。
   修改前后用同一默认输入对比结果文字（如“0.5 s”“10 个样点”）验证一致。

## 七、恢复方案

- 当前 `main @ 379253c` 工作区干净；修改前标签 `restore-2026-09-05-before-practice-polish`。
- 完成后提交 + 标签 `restore-2026-09-05-after-practice-polish`；不推送远程。
- 恢复方式：`git status` 确认 → `git switch -c review-<标签> <标签>` 查看 →
  `git switch -c restore-<标签>-ws <标签>` 切换；默认不用 `git reset --hard`（见 docs/restore.md）。

## 八、实施顺序（每步完成后实际渲染检查再下一步）

1. 保存修改前恢复标签 → 移除总进度、压缩导航与标题区（需求 1-3）
2. 左右比例、参数行、图表与结果格（需求 4-6、9 的桌面部分）
3. 步骤紧凑列表 + 证据弱化（需求 7-8）
4. 响应式、键盘、6 实验全量回归 + 完整测试/构建/语法/diff-check（需求 9-10）
