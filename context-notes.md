# Context Notes

## 2026-09-04：正文迁移

- 目标副本是 `C:\Users\Lenovo\Documents\codex_projects\personal-workbench-shell`，由 `node serve.mjs 3010` 提供服务。
- 原站内容源是 `C:\Users\Lenovo\Documents\codex_projects\personal-workbench-sites\app\data\courses\index.ts`；其模电数据已按用户指定官方教案校正。
- 当前 `courses.js` 虽由原站生成，但仍是校正前的旧包；当前 `index.html` 的正文是固定占位文本，`app.js` 切章时只更新标题与检验摘要。
- “迁移正文”解释为迁入章节的课程导读、学习目标、前置知识、知识讲解、公式与变量、例题、实验文字、检验题和复习总结，使原站的可读课程信息不丢失。
- “移除图示内容”解释为不迁入 `StudyDiagram`、教学 canvas、图片或 figure；顶栏功能图标和独立电路工作台不属于正文图示，保持不变。
- 选择更新且已通过原站测试的数据定义作为唯一内容源，不混用 3010 的旧包或硬编码占位正文。
- 3010 项目没有 Git 元数据；本任务不创建仓库、不提交、不推送。
- 用户已直接要求实施，因此计划完成后在当前会话内执行，不再停在执行方式选择。
- 迁移测试首次运行结果为 1 通过、2 失败：旧包仍出现“第四版教材参照”，HTML 缺少 `lessonGuideContent` 等动态挂载点；图示排除测试已通过。该失败与预期一致，证明测试能识别本次迁移目标。
- 首次刷新包的 Node 内联脚本因 Windows 绝对路径不是有效 ESM URL 而失败；改用 `file:///C:/...` 后成功生成 120.9 kB 数据包。刷新后的测试还暴露测试把补充章误写为 `analog-10`，核对实际数据后修正为稳定 ID `analog-11`；`analog-10` 是计入进度的第 9 章“直流电源”。
- 渲染层继续沿用原静态页面结构，只把固定占位文本替换为 `renderLesson(course, chapter)`；所有内容节点使用 `textContent`，没有引入 HTML 字符串、图片、canvas 或新依赖。
- 专项迁移测试最终为 3/3 通过。
- 静态验收：`node --test tests/*.test.mjs` 为 3/3 通过，`node --check app.js` 通过，旧占位/第四版旧标注/教学图示扫描无命中，改动文件尾随空白扫描通过。
- Browser 插件及其 browser skill 未在本会话提供，因此按前端测试技能要求使用 Playwright CLI。验收视口为 1440×900 和 390×844；已验证“模拟电子技术 → 第2章 → h 参数正文”和“第10章 → 不计进度说明”两个状态，正文内 `canvas/figure/img` 数量为 0。
- 浏览器控制台仅有原页面未提供 `favicon.ico` 的 404；没有正文脚本异常或框架错误覆盖层。本任务不顺带修改这一既有静态资源问题。
- Playwright 首次尝试递归删除临时产物目录被工具策略在执行前拒绝；随后核对源目录和目标目录后，将整个 `.playwright-cli` 可恢复地移动到 `C:\Users\Lenovo\AppData\Local\Temp\codex-playwright-course-migration-20260904`，仓库内未残留浏览器产物。
- 桌面与移动截图分别保存为 `C:\Users\Lenovo\AppData\Local\Temp\codex-course-migration-desktop.png` 和 `C:\Users\Lenovo\AppData\Local\Temp\codex-course-migration-mobile.png`。
- 没有修改 3000 原站、3010 的导航/工作台，也没有发布、推送或提交；3010 项目本身没有 Git 元数据。
- 最终 HTTP 检查脚本首次因 PowerShell 不允许直接在 `foreach` 语句后接空管道位置而解析失败；把结果先赋给 `$results` 后重跑，`/`、`app.js`、`courses.js`、`styles.css` 均返回 200。

## 2026-09-04：实践功能区阶段 A

- 用户给出的 `C:\Users\Lenovo\Documents\codex\_projects\...` 不存在；核验到实际项目为 `C:\Users\Lenovo\Documents\codex_projects\personal-workbench-shell`，计划文件名一致，因此按实际路径推进。
- 主计划是分期计划且明确推荐 A→B→C；本轮只实施可独立验收的阶段 A，避免把 Notebook 缺口与工作台草稿策略混为一个变更。
- 当前确定性盘点为 Notebook 6、数字工作台 8、模拟工作台 11；`http://localhost:3010/` 返回 200，既有测试 3/3 通过，`app.js` 语法检查通过。
- 当前 Notebook 实验卡按钮文案为「查看使用方式」，点击后只显示 toast；数据已经包含标题、目标、步骤、预期证据和边界说明，足够生成静态实践页。
- 采用主计划推荐的 D1/A1 静态步骤页；勾选态只存页面内存。阶段 A 不处理 D2 数字/模拟草稿、不增加可选顶栏 Notebook 入口。
- 主计划提到「复制表达式」，但实验 schema 没有独立表达式字段；从步骤自然语言推断公式不可靠，核验后将其从阶段 A 最小实现中排除。
- Browser 插件及其 browser skill 未提供，按前端测试技能使用 Playwright CLI。基线页面身份正确，当前控制台只有既有 `/favicon.ico` 404。
- Playwright 临时工作目录首次在目录创建前被作为 `workdir` 使用，进程启动失败；随后从现有目录创建目标。`New-Item -LiteralPath` 在当前 PowerShell 中不是有效参数，读取错误后改用 `-Path` 成功。
- Notebook 契约测试首次运行结果为 3 项中 1 项通过、2 项失败：六条实验数据完整性已通过；缺少 `#notebookRoot`、`renderNotebookView` 与内存勾选状态的两项按预期失败。
- 最小实现只改 `index.html`、`app.js`、`styles.css`：新增独立 `notebookRoot`，把 Notebook 实验卡按钮改为「打开实验」，扩展既有 `setView` 分支，并用 `notebookChecks[experiment.id]` 保存页面内勾选态。
- Notebook 页面渲染实验目标、步骤、完成计数、预期证据和数据中已有的边界说明；返回按钮沿用既有 `setView(null)` 与 `jumpToChapter(chapter.id)` 调用链。
- 新增契约测试实现后为 3/3 通过，`node --check app.js` 通过；真实浏览器回归尚待执行。
- 最终自动验收为 6/6 测试通过、0 失败、0 跳过；`node --check app.js` 通过，旧 Notebook toast 文案无命中，改动文件无尾随空白。
- `http://localhost:3010/` 及 `app.js`、`courses.js`、`styles.css`、`katex.bundle.js`、`workbench.bundle.js` 均返回 HTTP 200。
- Playwright 桌面流在 1440×900 验证：打开实验显示 0/3，勾选第一步后显示 1/3 且按钮为 `aria-pressed=true`，返回正文后再次打开仍保持 1/3。
- Playwright 移动流在 390×844 验证 Notebook 页面可读且 `scrollWidth === clientWidth === 390`；从 Notebook 直接点击「数字台」可正常挂载原数字电路工作台。
- 基线首次打开时记录到既有 `/favicon.ico` 404；完成交互后的最终 `console error` 查询为 0 条，没有脚本异常或框架错误覆盖层。本阶段未增加 favicon。
- 桌面与移动截图分别保存为 `C:\Users\Lenovo\AppData\Local\Temp\codex-practice-area-desktop.png` 和 `C:\Users\Lenovo\AppData\Local\Temp\codex-practice-area-mobile.png`。
- 阶段 A 已完成；阶段 B（数字/模拟统一切换与草稿策略）和阶段 C（入口文案/课程首页快捷入口）均未开始。

## 2026-09-04：实践功能区阶段 B

- 用户明确要求推进阶段 B；本轮只处理数字/模拟工作台内部切换，不实施阶段 C 的入口统一或 Dashboard。
- 阶段 B 主计划存在冲突：Global Constraints 要求切换不丢草稿，D2 推荐却是确认后丢弃。按目标约束优先，选择“不丢草稿”，不混合两种行为。
- 原站 `CircuitWorkbench` 的电路状态封装在组件内部，未暴露 draft 回调；但副本入口可以为数字/模拟各维护一个独立 React root，切换时只改显隐，退出工作台才统一卸载。该方案不修改原站源码、不新增依赖，也不需要序列化内部状态。
- 草稿保留范围定义为“同一次工作台会话”：数字/模拟往返时保留；返回教材或刷新页面后清空。已保存电路仍沿用原组件的浏览器本地存储。
- 原型项目没有 Git 元数据；本阶段不创建仓库、不提交或推送。
- 当前基线为 6/6 测试通过，`node --check app.js` 通过，`http://localhost:3010/` 返回 200。
- Browser 插件及其 `browser` skill 未在本会话提供；渲染验收将按技能要求使用 Playwright CLI，并记录此回退原因。
- 阶段 B 契约测试首次运行 3/3 失败：分别确认缺少 `workbenchStage/kindSwitcher`、bundle 的双 root/`setKind` 接口、shell 的就地切换与状态同步；失败原因与预期一致。
- 最小实现新增 `workbenchStage`，把分段切换器放在 `workbenchRoot` 外；`workbench-entry.tsx` 按需创建数字/模拟两个 React root，`setKind` 只切换容器显隐，`unmount` 才统一还原 instruments 并销毁两个会话。
- `app.js` 对 circuit → circuit 直接调用 `PrototypeWorkbench.setKind`，不走 150ms 卸载/重挂流程；顶栏工作台按钮与内部分段按钮分别同步选中态和 `aria-pressed`。
- 阶段 B 专项测试实现后为 3/3 通过，`node build-workbench.mjs` 成功生成约 249.1 kB JS 与 11.3 kB CSS，`node --check app.js` 通过；完整回归与浏览器验收尚待执行。
- 首轮移动验收暴露页面级横向溢出：390px viewport 的 CSS client width 为 375px，而 document scroll width 为 433px；定位到全局紧凑样式把 `.cw-storage-bar` 固定成 5 列，且样式表末尾原有一个多余 `}` 导致随后新增的移动 media query 未被浏览器解析。
- 为该问题新增意图测试后，测试按预期以 `{`/`}` 数量 295/296 失败；移除多余闭合括号，并在 760px 以下把实验操作排成三行、存储操作排成自适应三列。专项测试最终 4/4 通过。
- Playwright 双草稿流：数字台加入 1 个“开关”，切到模拟台加入 1 个“接地”，再切回数字与模拟；DOM 快照分别仍有 1 个元件，且顶栏按钮与内部分段按钮的 pressed 状态同步。
- 最终移动复验为 `scrollWidth === clientWidth === 375`，存储区计算列宽为 `178.5px 65.4167px 65.4167px`，最终 media query 已进入 CSSOM；视觉截图中名称、存储和操作文字均正常横排。
- 浏览器页面身份为 `http://localhost:3010/` / `个人电子工作台`，无空白页或框架错误覆盖层；首次载入只记录既有 `/favicon.ico` 404，最终刷新后控制台为 0 错误、0 警告。
- 桌面与移动截图保存为 `C:\Users\Lenovo\AppData\Local\Temp\codex-stage-b-desktop.png` 与 `C:\Users\Lenovo\AppData\Local\Temp\codex-stage-b-mobile.png`；浏览器会话结束前将关闭。
- 阶段 B 已完成；阶段 C（实践入口文案与课程首页快捷入口）仍未实施。
- 最终计划扫描首次用宽泛模式匹配到计划头部对复选框语法的说明文字，并以非零码中止；确认不是未完成步骤后，改用行首锚定规则重新扫描。
- 最终自动验证为 10/10 测试通过、0 失败、0 跳过；`node --check app.js` 与 `node build-workbench.mjs` 均成功，目标 HTML/JS/CSS 资源全部返回 HTTP 200，改动文件无尾随空白，CSS 花括号计数为 295/295。
- 桌面 1440×900 复验为 `scrollWidth === clientWidth === 1425`，移动 390×844 复验为 375/375；Playwright 会话已正常关闭。

## 2026-09-04：顶栏工作台入口合并

- 用户截图指向顶栏“数字台 / 模拟台”两个入口，并要求统一成一个；结合阶段 B 已有内部类型切换，本轮解释为合并成单一“工作台”入口，而不是仅把两个 SVG 画成同样图标。
- 单一入口复用现有芯片 SVG；从教材或 Notebook 打开时默认进入数字台，在数字或模拟工作台内点击时统一退出。类型选择继续由工作台内部“数字 / 模拟”分段控件承担。
- 本轮不修改 `workbench-entry.tsx`、bundle、草稿策略或课程实验卡，属于阶段 C 的局部入口收敛，不代表阶段 C 全部完成。
- 基线为 10/10 测试通过，`node --check app.js` 通过；项目仍无 Git 元数据。
- Browser 插件及其 `browser` skill 未提供，渲染验收继续使用 Playwright CLI。
- 单入口契约测试首次运行 5 项中 4 项通过、1 项按预期失败：顶栏仍有两个 `.workbench-button`，证明测试确实覆盖本轮待改行为。
- 最小实现仅修改 `index.html` 与 `app.js`：两个入口合并为 `#workbenchToggle`，标签改为「工作台」；顶栏高亮覆盖数字/模拟两种状态，点击激活入口时退出，未激活时默认进入数字台。
- 专项测试实现后为 5/5 通过，`node --check app.js` 通过；完整回归与真实浏览器验收尚待执行。
- 最终自动回归为 11/11 测试通过、0 失败、0 跳过；`node --check app.js` 通过，页面及 `app.js`、`styles.css`、`workbench.bundle.js` 均返回 HTTP 200。
- Playwright 桌面流验证顶栏只有一个「工作台」按钮：从教材进入默认数字台，内部切到模拟台后顶栏继续保持 `aria-pressed=true`，再次点击顶栏入口可返回教材并变为 `false`。
- 390×844 移动视口验证顶栏入口数为 1、默认数字台状态同步，且页面 `scrollWidth === clientWidth === 375`，无新增横向溢出。
- 浏览器控制台唯一错误为项目既有的 `/favicon.ico` 404，没有与本次入口合并相关的脚本错误。桌面和移动截图分别保存为 `C:\Users\Lenovo\AppData\Local\Temp\codex-single-workbench-entry-desktop.png` 与 `C:\Users\Lenovo\AppData\Local\Temp\codex-single-workbench-entry-mobile.png`。
- 本轮只完成阶段 C 的顶栏入口收敛；课程首页快捷入口等阶段 C 其余内容仍未实施。

## 2026-09-04：工作台顶部控制区密度优化

- 用户截图指向工作台顶部运行、实验目标和电路存档三区，问题是超宽屏空白过多且宽度比例失衡；本轮不改变控件数量或行为。
- 2037×900 真实页面基线：工作台内容宽 1998px，运行区 170px、实验区 914px、存档区 914px；名称输入与本地电路下拉仍各固定 150px，确认主要空白来自等分外层列和固定宽度存档控件。
- 选择只在 ≥1500px 启用 CSS 覆盖：运行区固定 220px且按钮等分，实验操作与下拉同行，存档区使用弹性主列加三列动作。这样不影响既有普通桌面与移动端布局，也不需要修改原站 React 组件或 bundle。
- 视觉令牌保持现状：不改颜色、字体、圆角、边框和 32px 控件高度；本次设计辨识点是三组操作形成连续、对齐的仪器控制条，而不是增加装饰。
- Browser 插件及其 `browser` skill 未提供，按前端测试技能使用 Playwright CLI；修改前截图保存为 `C:\Users\Lenovo\AppData\Local\Temp\codex-workbench-controls-before.png`。
- 修改前完整测试为 11 项中 9 项通过、2 项失败：课程演练新代码创建 `canvas`，与旧“正文不含图示”契约冲突；顶栏新增「演练」按钮复用了 `.workbench-button`，与旧“仅一个工作台按钮”契约冲突。两项均早于本轮 CSS 修改且不在本轮范围内。
- 项目仍无 Git 元数据，不执行提交。
- 宽屏密度专项测试首次运行 1/1 按预期失败，错误为缺少 `@media (min-width: 1500px)`；测试已证明能够在旧布局下失败。
- 最小实现只修改 `styles.css`：新增 ≥1500px 覆盖，不修改 DOM、JavaScript、React 组件或 bundle；专项测试实现后为 1/1 通过。
- 首次真实渲染发现外层 220/960/818 列宽已生效，但实验操作和存档弹性列被后续基础规则覆盖。计算样式仍为 `grid-area: 2 / 2`、五列存档网格，根因是宽屏块被插在文件中部而非最终规则之后。
- 为层叠顺序补充意图断言后，测试按预期失败；将同一宽屏块移动到最终移动端规则之后，未增加选择器权重或重复样式，测试恢复为 1/1 通过。
- 2037×900 最终尺寸为运行 220px、实验 960px、存档 818px；名称输入由 150px 扩展到 500px，本地电路下拉由 150px 扩展到 549px，实验操作计算位置为 `1 / 2`，页面 `scrollWidth === clientWidth === 2022`。
- 深色模式验证数字/模拟切换正常；模拟台三个运行按钮保持完整可用且无容器溢出。1440×900 下宽屏媒体查询不生效，页面宽度为 1425/1425；390×844 下存档区仍为原三列移动布局，页面宽度为 375/375。
- 最终浏览器控制台为 0 错误、0 警告，没有框架错误覆盖层。宽屏深色与移动截图分别保存为 `C:\Users\Lenovo\AppData\Local\Temp\codex-workbench-controls-after-wide-dark.png` 和 `C:\Users\Lenovo\AppData\Local\Temp\codex-workbench-controls-after-mobile.png`。
- 本轮新增宽屏测试通过；完整套件为 12 项中 10 项通过、2 项失败，失败项与修改前完全相同，仍是外部新增 canvas 演练和第二个 `.workbench-button` 与旧契约冲突。本轮未修改这些功能或测试。
- 最终回归期间 `courses.js` 在 00:11 被外部流程重写，第一次读取撞到未完成文件而临时新增 2 个语法失败；文件写入完成后 `node --check courses.js` 通过，完整套件复跑恢复为上述 10 通过、2 个既有失败。该文件不在本轮修改范围。
## 2026-09-05：顶部操作关系整理

- 仅调整 3010 副本样式。移除两种工作台的能力说明；≥1200px 用两行操作条，上排仿真及实验，下排存档，保留按钮功能。
- 现有样式已由其他修改统一为无 1500px 断点；旧宽屏测试失效。沿用当前统一样式，不恢复旧布局。
- 成功标准：说明不可见、按钮无重叠、两种工作台切换正常、记录完整测试结果。使用应用内浏览器验证。
- 验收：1920px 两行排列，1200px 存档容器 clientWidth/scrollWidth 均 1159；390px 页面宽度 375 无横向溢出；两种能力说明均 display:none，数字切模拟正常，控制台无错误或警告。完整测试 10/12 通过；剩余为正文 canvas 与旧无图契约冲突、演练按钮复用工作台样式与旧单按钮计数冲突，均在修改前存在。已更新本轮相关旧宽屏断言；app.js 语法检查通过。
## 2026-09-05：Git 与工作台风格统一

- 基线标签 baseline-3010 保存全部运行文件；只建立本地 Git，不发布远程。浏览器 localStorage 不属于 Git 恢复内容。
- 风格：沿用 --bg/#181a1e、--panel/#22252a、--panel-2/#2a2d33、--ink/#f0f1f3、--ink-soft/#a9adb4；原有正文及数值字体不换。保留最近确认的两行和短字段布局，弱化面板边框，圆角与演练截图一致。
- 将组件复制到副本独立维护，继续复用原站计算库；构建产物纳入 Git，恢复页面无需重编译。按钮优化为空画布禁用清空、空库禁用删除全部、模式按钮 aria-pressed、复制文案明确保存行为。
- 验收标准：可见模式状态、禁用无效操作、数字/模拟切换保留会话；完整测试及浏览器检查完成后提交。
- 实际批量删除改为仅当前类型，按钮名为“删除本类存档”，保留确认提示；无当前类型存档时禁用。未在用户浏览器执行存档删除。
- JSX 组件移入副本后不再继承原站 tsconfig，初次渲染出现 React 未定义；加入显式 React 引用并重新构建，刷新后加载及交互恢复正常。
- 浏览器 1440px 验证灰阶圆角及胶囊模式；空画布清空禁用，添加开关后启用，探针 aria-pressed 正确，切换模拟再返回数字保留元件及模式。390px 页面 scrollWidth 为375，无横向溢出。修复后无新增控制台错误（日志保留修复前一条错误）。
- 经用户“继续推进”后修正两个旧测试的检查范围：无图要求仅约束正文渲染函数，单工作台入口检查按 id 而非共享样式类；保留独立演练 canvas。最终完整测试12/12通过、app.js语法及git diff --check通过。
- 恢复说明在 docs/restore.md；Git只管理本地文件，不管理浏览器学习进度及电路存档。
## 2026-09-05：数字/模拟切换滑块与内容淡入淡出

- 用户明确指定：仅修改 3010 副本；先写计划/checklist/context-notes 再编码；不使用新动画库（CSS transform + React 定时编排，零依赖）；先做滑块并检查效果，再接入内容过渡，最后边界与回归。
- 基线：git `main` 干净；标签 `baseline-3010`、`workbench-ui-v1` 已有；本次新增修改前标签 `restore-2026-09-05-before-kind-switcher-slider`（HEAD `1c6cdf9`）；测试 12/12 通过。
- 结构确认：`#kindSwitcher` 是 `#workbenchRoot` 外的原生 DOM（非 React），`setView()` 对 circuit→circuit 走 `PrototypeWorkbench.setKind()` 直切分支（不走 150ms 卸载/重挂）；`syncKindSwitcher()`（app.js 1603）同步 `is-active`/`aria-pressed`；`workbench-entry.tsx` 的 `ensureSession` 轮询（40ms×20）等待 instruments 出现后桥接 inspector，可作为挂载就绪判断的既有先例。
- 决定：滑块指示 `transform: translateX(0|100%)` 由 `syncKindSwitcher` 驱动（CSS 180ms 缓动），点击当前项时 `setView` 已有 `prev===wbKind` 短路，不重播；键盘（ArrowLeft/Right/Home/End）与 `prefers-reduced-motion` 走即时路径（`.is-instant` 帧级取消 thumb 过渡 + entry 的 `immediate` 直切）。
- 内容过渡只改会话容器 `opacity` 与 `pointer-events`，会话 `hidden` 切换时机由挂载就绪（容器出现 `.circuit-workbench`）决定；`switchSeq` 代号使过期回调失效；`unmount()` 使代号失效并清定时器/观察器。
- 首次挂载/回教材等边界复用外层 `setView` 的 stage 淡入淡出，entry 的 `mount` 走即时路径避免双重动画。
- 旧样式 1576-1578（移动端把 switcher 透明化+按钮胶囊）与本轮统一规则互相覆盖，按“清理切换器自身相互覆盖的旧样式”要求删除。
- 字符串契约测试（node:test 读文件断言）用于结构保护；状态一致性/快速切换/清理行为由 Playwright 真实浏览器验收并如实报告。
- 实施中先完成滑块并验证（实测 184×44、thumb (4,4) 88×36、等宽 88×36、transition `transform 0.18s cubic-bezier(.22,1,.36,1)`、点击当前项经 setView 短路不重播），再接入内容过渡。
- 快速连点首测暴露不一致：entry 的 `activeKind` 在内容完成切换（80ms 后）才更新，而 shell 滑块/aria 立即同步，25ms 连点时二者窗口错位，出现“滑块数字、内容模拟”。修复为 `activeKind` 立即锁定最后目标 + 新增 `visibleKind` 独立跟踪实际显示面板（动画期间保持旧值），并特判“目标即当前可见面板”时直接落地。修复后正反双向 10 次连点（25ms 间隔）均一致。
- 首次打开模拟台为懒创建（容器 hidden 挂载中）：等待 `.circuit-workbench` 出现在容器内再切换（40ms 轮询、1500ms 超时→ onNotify 错误并保留旧内容），无需固定延迟；实测 t30 数字台 opacity≈0.37（淡出中）、t80 已切显隐、t180 opacity≈0.98、t500 =1，无空白页。
- 动画中返回教材（点击切模拟 30ms 后点顶栏退出）：600ms 后 `sessions=0`（unmount 清理无残留、无旧回调重显），重进工作台仅数字台显示、模拟台重新懒创建。
- 状态保留：数字台 100%→放大至 120%，切模拟再切回仍 120%。键盘 ArrowRight/Home/End：40ms 内完成切换（即时）、焦点留在切换器、thumb 同步；`is-instant` 类一帧后移除。reduced-motion：重写 matchMedia 模拟后点击 30ms 内即完成切换（JS 路径）；CSS 侧规则与静态断言覆盖（Playwright CLI 无 emulateMedia 命令，未在真 CSSOM 环境复验）。
- 移动端 390×844：scrollWidth=clientWidth=390 无溢出，滑块 184px 正常；桌面 1440×900 与深色模式截图均正常（深色主题下选中底块 #3a4048、轨道 #23262c，文字清晰）。
- 完整测试 15/15 通过（原 12 + 新增 3 项结构断言），`node --check app.js` 通过；`workbench.bundle.js` 重新构建（249.8kB）。既有 `favicon.ico` 404 未处理（不在本轮范围）。
- 恢复标签：修改前 `restore-2026-09-05-before-kind-switcher-slider`（1c6cdf9），完成后 `restore-2026-09-05-after-kind-switcher-slider`（提交后创建）。
## 2026-09-05：滑块与内容过渡核验修正（review 反馈 8c32b85 之后）

- 核验确认三个真实缺陷：(1) `mount()` 中 `setKind()` 的 `clearPendingTimers()` 会取消 `ensureSession()` 排入同一列表的仪器桥接任务（scheduleBridge 40ms 轮询链被掐断，首次挂载布局任务失效）；(2) 切换序列先淡出旧内容再等目标就绪，慢加载/失败时旧内容被提前隐藏 1.5s 空白；(3) 失败分支只回滚 bundle 内部 `activeKind`，shell 的 `activeWorkbench`/滑块/aria 停留在失败目标上。
- 修复一：任务生命周期分离——`layoutTimers`（挂载/桥接）与 `pendingTimers`（切换动画）两个队列；`setKind` 只清切换队列，`unmount()` 才清理全部（含 ready 观察器）。行为测试断言首次进入两种工作台后 `cw-instruments` 恰好各 1 个且在 `cw-inspector` 内。
- 修复二：切换顺序反转为“等目标就绪（旧内容保持可见）→ 就绪后淡出 80ms → 切显隐 → 淡入 120ms”。行为测试用 `?cwReadyDelay=900` 注入慢就绪：120ms/550ms 采样数字台 opacity 恒 1、hidden 恒 false，完成后目标 opacity=1；失败时旧内容从未隐藏。
- 修复三：新增 `MountOptions.onKindChange`，切换落地/失败回滚时通知 shell；`syncKindFromBundle()` 将 `activeWorkbench`/滑块/aria/tabindex 一并回滚（失败路径用即时同步 `syncKindSwitcher(true)`）。故障注入支持 `cwMountFail=once`（失败一次后清除参数），行为测试验证回滚一致且再次点击可成功重试。
- 修复四：键盘补全 Enter/空格（kindSwitcher keydown 拦截 `preventDefault` + click handler `event.detail===0` 兜底走即时路径）；roving tabindex（激活 0/未激活 -1，`syncKindSwitcher` 同步）；`inert` 代替仅 pointer-events：过渡中旧/新面板 inert（不可点击、聚焦、键盘触发），结束仅目标可操作；切换控件在 workbenchRoot 外不受影响。
- 行为测试（9 项，node:test + playwright 系统 Chrome channel，隔离 context 不触碰用户 localStorage）：仪器桥接两 kind、慢就绪可见性、失败回滚+重试、25ms 连点 10 次一致性、过渡中离开清理+零运行时错误、Enter/Space/Arrow/Home/End 40ms 即时、emulateMedia reduced-motion 真媒体模拟（thumb/session computed transition 0s/none + 40ms 即时）、inert 隔离+过渡中切换器可响应、探针模式与缩放 120% 往返保留。
- 测试自身踩坑记录：`[data-kind="..."]` 会先匹配到切换按钮（按钮同样带 data-kind），会话容器必须用 `.prototype-workbench-session[data-kind=...]`；ArrowLeft 在 digital 上夹取停留无切换，行为测试从 analog 出发验证。
- 手动验收（应用内浏览器 + CLI）：移动 390×844 scrollWidth=clientWidth=390、数字台显示正常；桌面/深色此前已验收未回退。浏览器环境依赖说明：playwright 库从 npx 缓存加载（1.62.1，channel chrome），行为测试前探测 3010 可访问性，否则明确报错。
- 未覆盖/已知限制：元件拖放放置与连线绘制交互未纳入自动化（需画布级人工交互），会话身份与探针/缩放状态保留已自动化验证；失败反馈 notify 触发仅 at once 注入路径验证；inert 兼容性按 Chromium/现代浏览器（原型目标环境）；真实 OS 级 reduced-motion 由 emulateMedia 媒体模拟覆盖（与 Chromium 真实媒体查询同一 CSSOM 路径）。
## 2026-09-05：实验演练页 UI 优化（计划核验阶段）

- 需求已确认（用户原文）：深灰风格保留；移除“已完成 x/6 个演练”总进度（仅 UI 与占位，不删状态）；长胶囊→短标题导航（短标题与实验 ID 显式映射，不按位置/模糊匹配）；标题区“完整标题+一句目标”，课程来源弱化，返回按钮右上；参数桌面等宽填满（按实际数量，不强行 4 项）；图表可读性（刻度/图例，连续与离散区分）；结果格等高统一；步骤卡→紧凑勾选列表（保留编号/全文/完成标记/进度，删“待完成”）；预期证据常驻弱化；75/25 起始比例、右栏 ≥260px；窄屏单列、tabs 自身横向滚动；不新增动画；不改计算与学习规则。
- 数据核验（courses.js 真实数据）：6 个 notebook 实验 id 与标题——signals-intro-notebook（连续与离散信号观察/绪论）、signals-ch1-convolution（数值卷积验证三角脉冲/ch1）、signals-ch2-aliasing（采样率改变与混叠/ch2）、signals-ch3-first-order-lti（一阶 LTI 系统的递推与卷积核对/ch3）、signals-ch4-moving-average（移动平均 FIR 的降噪与频率响应/ch4，注意实验 id 非章节 id signals-ch4-fir）、signals-ch5-random-average（固定随机种子的方差验证/ch5）。短标题映射：信号观察/卷积验证/采样混叠/LTI 系统/FIR 滤波/方差验证。
- 结构差异（重要）：仅前 3 个实验有 canvas 演示（参数数 4/2/4，结果格 3/2/3 行）；后 3 个为占位提示（无参数、无图表）。计划对两类分别验收，不以前三推断全部。
- 风险核验：总进度 remove 后无空引用（updateTabsCompletion 890 已有 if(overview) 保护，且本轮删除该段与创建点 763-764；全文件无其他引用）；updateTabsCompletion 880-881 按 .practice-tab-title **文本反查**实验——本轮替换为 data-experiment-id 匹配；步骤列表每次整页重建，闭包绑定 states[index]，无重复绑定；canvas 用 rect×dpr + ResizeObserver + 400ms 兜底 + resize 重绘，无 CSS 拉伸；canvas 无点击/拖动交互（仅绘制）；标题焦点黑框来源为 setView() 1583-1586 程序 h1.focus()（tabIndex=-1，键盘不会聚焦），定点加 `.notebook-heading h1:focus { outline:none }`，不动全局 outline。
- 基线截图：D:\pw-practice-before.png（1440×900，观察实验）。
- 未知风险（实施中验证）：短标题 720px 内 6 项是否单行；narrow 下 tabs overflow 的滚动位置保持；consistency 左栏 75% 后 chart 宽度变化触发 RO 重绘的正确性。
## 2026-09-05：实验演练页 UI 优化（实施完成）

- 计划经用户批准后实施；修改前标签 `restore-2026-09-05-before-practice-polish`（HEAD 379253c）。实施中一次 PowerShell Get-Content -Raw 以 GBK 读取 app.js 造成中文损坏，立即 `git checkout -- app.js` 恢复，全部 app.js 编辑改用 UTF-8 安全的 edit 工具重放成功——此后禁止用 pwsh 原样读写含中文的源文件。
- 实施结果：总进度 `.practice-overview` 全链路移除（创建点+updateTabsCompletion 更新段+样式规则）；6 tab 短标题映射 `EXPERIMENT_SHORT_TITLES`（6 个 id 显式登记）与 `data-experiment-id`；`updateTabsCompletion` 改为按 id 精确匹配（原按 .practice-tab-title 文本反查已弃用）；标题区 eyebrow 弱化为 ink-faint 辅助文字、标题下直接跟一句目标（删“实验目标”h2 与 section）、返回按钮右上；h1 程序聚焦（tabIndex=-1，键盘不可达）加精确 `.notebook-heading h1:focus { outline:none }`，未动全局 outline；参数 `.demo-controls` 改 `repeat(auto-fit, minmax(150px,1fr))`（4 参数 4 列、卷积 2 参数 2 列、窄屏自然回落）；图表 margin left 34→40、刻度字 10→11px、gridText 0.5→0.72、观察实验连续曲线加 `setLineDash([7,4])` 虚线区分（混叠/卷积原有区分已够）；结果格 gap 10、value 0.92rem/750、label 弱化；步骤卡改紧凑勾选行（padding 8/10、无卡片边框、hover panel、is-done accent-soft；完成 ✓ span 用 visibility 占位对齐；删“待完成”/“已完成”逐项文字）；预期证据去左边框、panel 底；布局 `minmax(0,3fr) minmax(260px,1fr)`（实测 1440 下 879/293 ≈75/25）；tabs nowrap + 自身 overflow-x:auto（390 下 504/338），选中项滚入视野函数 `scrollActiveTabIntoView()` 放在 `notebookRoot.appendChild(page)` 之后（首次实现放在挂载前，getBoundingClientRect 全 0 导致滚动失效——行为测试捕获并修复）。
- 验证：6 tab 逐一跳转（短标题→完整标题→active id 一致）；勾选/取消进度（0/3→1/3→3/3→2/3）与 aria-pressed、✓ 可见性、tab 完成标记；参数频率 2→3 后结果 0.5s→0.333s、10→6.667 个样点（默认值基线不变）；canvas 位图=CSS 宽（851/851，dpr=1，无拉伸）；返回教材落在绪论章“信号分析与处理概览”；快速切 6+1 tab 无运行时错误、页面 scrollY 稳定；390px 文档无溢出、tabs 自身滚动、单列、选中项可见；键盘可聚焦 step-check/tabs/back，Enter 可勾选；深色模式（1920×1000）截图正常。
- 新增 `tests/practice.behaviour.test.mjs` 7 项（Playwright 系统 Chrome，隔离 context）：六 tab 映射、总进度移除+勾选状态机、参数更新+canvas 尺寸、状态往返保留+返回章节、快速切换滚动稳定+零错误、390 窄屏溢出/自身滚动/选中可见、键盘可达+Enter 勾选。完整套件 33/33 通过（11 切换结构 + 9 开关行为 + 7 演练行为 + 6 既有）。
- 截图：D:\pw-practice-before.png（1440 基线）、pw-practice-step1.png（1440 第一步后）、pw-practice-conv.png（卷积 2 参数）、pw-practice-dark.png（1920 深色）。修复期间误用 PowerShell 读写含中文文件的风险已在之前 context 记录。未验证项：非 Chromium 浏览器（inert/scrollbar-width 兼容性）、真机触控。
# 2026-09-05 切换排版稳定性
- 用户要求消除进入/切换时工具栏骤高骤低，保持稳定态样式。
- 假设：cw-bridging 只用 visibility 隐藏仪器卡，卡片仍是固定高度工作台的直接网格子项；异步移入 inspector 后网格再次分配高度。
- 先用同一真实 DOM 在桥接前后测量工具栏矩形验证，不靠延长动画或固定工具栏高度掩盖。
- 验证假设成立：1440px 数字工作台 heading 高度稳定 53px、桥接前 164.4375px。改为仅隐藏未迁移的直接子仪器卡（display:none），迁入 inspector 自动恢复显示；未改动画时序/业务逻辑。
- 新回归覆盖两种工作台 1440/2300/390px 下三块工具栏矩形；2300px 下 requestAnimationFrame 采样首次进入、重进和快速切换，行高及存档行相对位置变化不超过 1px。完整测试 38/38。未验证非 Chromium 浏览器。
# Narrow chapters UI
- Mobile rule changes direction but retains desktop 186px chapter-list width, 48px rail, and collapsed shell columns. Fix responsive overrides only; keep chapter logic and desktop rules intact.
- Retain existing colors/type; full-width rounded navigation, thin scrollbar and in-flow pager are limited to the existing mobile breakpoint.
- Browser found align-self:start also retained max-content sizing; overriding to stretch fixed measured overflow (932px down to viewport 375px including scrollbar). Collapsed title needed matching selector specificity. 390/760px navigation and last chapter selection passed, desktop 1440 retained 186px vertical list/fixed pager. No console errors; full suite 38/38. Tested Chromium only.
# Stable 3010 release
- User confirmed replacing old 3000 site online. Destination w1661884010-jpg/personal-workbench main; existing Pages workflow currently builds old Vite sources.
- Local 3010 clean at 0a8cee4; full tests 38/38. Old main ae25963 fetched. Tags preserve both snapshots. Git CLI requires host permission for Windows TLS; gh CLI auth fails, connector is authenticated.
- Keep source bundle rebuild dependence on sibling old project explicit. Deployment uses tested committed bundles, not unverified rebuilding. No localStorage upload/migration.
- Released merge 481564401b7f386cce7671c984f0f9bded02fdf4 (first parent 3010, second old origin/main). Runtime tree unchanged by merge. Pages run https://github.com/w1661884010-jpg/personal-workbench/actions/runs/33950935490 succeeded; public /personal-workbench/ renders new lesson, both workbenches verified, zero console errors. Local 3000 untouched. release-3010-2026-09-05 identifies deployed commit including workflow.
# Repository relocation
- Target folders: Desktop/learning/repositories/personal-workbench-sites-3000 and personal-workbench-shell-3010. Preserve existing four other repositories.
- Both working trees clean before move. 3010 imports source/dependencies from sibling sites; replace absolute build paths with relative sibling references. Historical docs/comments remain historical.
- Windows Move-Item partially moved 3010 then stopped at an empty hidden directory. Completed only remaining non-colliding files, then removed verified-empty source directories. No source files deleted or overwritten; both old roots now absent.
- New-root verification: workbench/KaTeX/Pages build passed; generated bundles have no Git content differences. Original npm test 79/79, shell node tests 38/38; servers restarted hidden on 3000/3010. No push/deployment for this local relocation.
