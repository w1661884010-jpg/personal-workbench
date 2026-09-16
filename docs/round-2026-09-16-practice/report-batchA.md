# 批次 A 验收报告（模块 2 动态卷积 · 模块 4 采样重建）

范围：仅在 `personal-workbench-shell-3020` 实施。3010、提交与推送均**未**触碰。
本报告按规划文档 §四「每批验收」与 §五「验证证据与发布边界」撰写。

## 一、文件清单

| 文件 | 变更 | 说明 |
| --- | --- | --- |
| `app.js` | 改（+298 非空行） | 新增 `window.__practiceCalc` / `window.__practiceState`；重写 `renderSignalConvolutionDemo`（双视口：上 x(τ)/h(t−τ)/乘积阴影，下 y(t)+游标，点击读 τ 与 t−τ）、`renderSignalAliasingDemo`（时域+频域）；`EXPERIMENT_SHORT_TITLES` 两项改为「动态卷积」「采样与重建」 |
| `courses.js` | 改（2 个条目） | `signals-ch1-convolution` →「连续卷积与图解五步动态演示」；`signals-ch2-aliasing` →「时频双域采样、混叠与模拟重建」；含 goal/expected/limitation 与预测题、反例、解释题步骤 |
| `styles.css` | 改（+18 非空行） | 新增 `.demo-range-row`（`minmax(0,1fr) 4.6rem`；range `height:40px`），使窄屏输入高度落在 40–44px |
| `tests/practice-convolution.test.mjs` | 新增 | 7 个用例 |
| `tests/practice-sampling.test.mjs` | 新增 | 6 个用例 |
| `tests/notebook-practice-page.test.mjs` | 改 | 新增 id/title/limitation 非空断言 + 全局实验 ID 查重（Set，未调用不存在的 `index()`） |
| `tests/practice.behaviour.test.mjs` | 改 | 短/全标题写死预期按 ID 同步 |
| `docs/round-2026-09-16-practice/{plan,checklist,context-notes}.md` | 新增 | 本轮规划与决策记录 |
| `docs/round-2026-09-16-practice/screenshots/*.png` | 新增 12 张 | 见第四节（合计 1.09 MB） |
| `docs/round-2026-09-16-practice/batchA-evidence.json` | 新增 | 本报告性能与 reduced-motion 原始读数 |

未改动：`index.html`（与 3010 哈希一致）、`serve.mjs`（仅端口不同）、其余 28 个测试文件。
一次性脚本 `_batchA-visual.mjs`、`_batchA-evidence.mjs` 已在用完后删除。

## 二、复算参数（按规划文档 §三）

**模块 2 `signals-ch1-convolution`**
- 仅单位高度矩形，支撑 [0,w₁]、[0,w₂]，**端点半高**；预设 (1,1)、(1,2)
- w₁,w₂ ∈ [0.5,3] 步长 0.1；t ∈ [−1, w₁+w₂+1] 步长 0.02 默认 −1，改宽度后夹紧
- `a=max(0,t−w₂)`，`b=min(w₁,t)`，`y=max(0,b−a)`；峰值 `min(w₁,w₂)`；总面积 `w₁w₂`
- 数值对照：dτ = 0.005 复合梯形，**绝对误差 < 0.01**（测非网格对齐点与跳变前后；不用零点附近相对误差）

**模块 4 `signals-ch2-aliasing`**
- 零相位 x(t)=cos(2π f_in t)；f_in ∈ [1,15] 整数默认 7；fs ∈ [2,30] 整数默认 20
- 重建：sinc `Σ x[n]sinc(fs·t−n)`、ZOH（floor(fs·t)）、线性；n = −32…32
- RMSE 在 t_i = −0.5 + i/1000（i = 0…1000）等权计算
- 观测频率 `min(r, fs−r)`，`r = f_in mod fs`；术语为「所需采样率临界值 2f_in」「奈奎斯特频率 fs/2」

## 三、测试数量与结果

| 命令 | 结果 | 耗时 |
| --- | --- | --- |
| `npm test`（`--test-concurrency=1`，32 个文件） | **242 / 242 通过，fail 0、skipped 0、cancelled 0** | 393.7 s |
| 基线（本批开工前，同命令） | 229 / 229 通过 | 338 s |
| `node --test tests/practice-convolution.test.mjs` | 7 / 7 | 7.4 s |
| `node --test tests/practice-sampling.test.mjs` | 6 / 6 | — |
| `node --test tests/course-content.test.mjs tests/notebook-practice-page.test.mjs` | 7 / 7 | — |
| `node --check app.js` | 通过（exit 0） | — |
| `npm run build`（workbench / katex / pages） | 三项 exit 0 | 36 ms / 30 ms / 校验通过 |

净增 13 个用例（229 → 242）。`experiments.length` 保持 **6**（模块 2、4 为原地 ID 升级，不新增）。

### 变异测试（验证"删掉规格会失败"）

| # | 变异 | 首轮 | 处理 |
| --- | --- | --- | --- |
| 1 | 峰值 `min(w₁,w₂)` → `max` | **抓住**（fail 3） | — |
| 2 | 反折/平移公式改错 | **抓住**（fail 1） | — |
| 3 | sinc 重建退化为最近样点 | **抓住**（fail 1） | — |
| 4 | 删除 `if (t === 0 \|\| t === width) return 0.5;`（端点半高） | **未抓住** | 文档容差 0.01 覆盖了它（对齐情形丢半高只差 0.0025）。已补断言：端点必须取 0.5，且对齐情形数值积分必须等于 `解析值 − dτ/2` = 0.9975（丢半高则为 1.0）。**复验：抓住（fail 1）**，`app.js` 还原后 SHA256 与变异前一致 |

覆盖缺口补齐：规划文档 §三.2「点击一个历史位置显示 τ 和经历时间 t−τ」原先无任何测试。
已补用例，断言读数自洽（τ 落在输入支撑内、已历经时间 = t−τ、h(t−τ) 与计算契约独立取值一致）；
该读数仅由点击处理函数写入（`app.js:2758/2760`），删除处理函数即失败。

## 四、截图

> **证据存放说明**：本批 12 张截图位于 3020 试验副本 `docs/round-2026-09-16-practice/screenshots/`。
> 该目录按本仓库 `docs/` 既有约定（前几轮只提交文本记录）**未纳入 git**；文件名即「实验-视口-主题」。

`screenshots/` 共 12 张：`{ch1-convolution,ch2-aliasing} × {390,760,1440}px × {light,dark}`。
每张的 `data-theme` 已与文件名逐一核对一致（主题是 auto/light/dark **三态循环**，首版一次点击不足以命中目标主题，已改为点到匹配为止）。
390px 为移动端纵排、1440px 含两卡侧栏（实验步骤 / 预期证据）；无横向溢出、图例在画布下方文档流内、数值卡 `--mono` 显示。

## 五、性能测量环境与读数

环境：Windows x64；**HeadlessChrome 152.0.0.0**（Playwright，`channel: chrome`）；DPR = 1；
画布 CSS 971×340 → backing store 971×340 px；`navigator.hardwareConcurrency` = 32。
参数取文档上限 w₁ = w₂ = 3。

| 指标 | 读数 |
| --- | --- |
| 同步重绘（计算 + 画布重绘，61 次采样） | 中位 **0.5 ms**，p95 **0.8 ms**，max **1.0 ms** |
| 播放中 rAF 帧间隔（480 帧） | 中位 **4.2 ms**，p95 **4.3 ms**，max **4.6 ms** |
| 长任务（PerformanceObserver `longtask`） | **0 条** |

**不作过度声明**：headless 环境无 vsync，rAF 间隔约等于每帧实际成本，**不能**等同于带垂直同步的桌面显示器上的 60fps 表现；
该环境下的 60fps 未实测（见第七节）。可确证的只是：单帧成本（≈4.2 ms）明显低于 16.7 ms 预算，且无长任务。

## 六、reduced-motion 与生命周期

| 检查 | 结果 |
| --- | --- |
| `prefers-reduced-motion: reduce` 命中 | ✓ |
| 进入后不自动播放 | ✓ 按钮初始为「▶ 播放」；画布指纹 8 次采样（间隔 250 ms）在首帧后**恒定不变** |
| 首帧差异归因 | 与我为修 DPR/布局加的延迟 `requestAnimationFrame(draw)` 重合，**非**自动播放 |
| 单步可用 | ✓ 用「观察时刻」控件推进后 5 张数值卡同步更新（−1 s/无交集/0 → 1.5 s/[0.5,1] s/0.5） |
| 播放推进 | ✓ 画面随之变化 |
| 暂停后无旧帧覆盖 | ✓ 暂停后 700 ms 内画布指纹不变 |
| 重复计时器 | ✓ 播放/暂停 8 轮后复位回 −1；再播放 1.2 s 推进到 0.228（≈1× 速度），无加速叠加 |
| console 错误 | 仅 1 条 404，URL = `http://localhost:3020/favicon.ico`（既有噪声，非本批引入） |

## 七、未验证项（明确列出，不声称已完成）

1. **带 vsync 的真实桌面浏览器 60fps 未实测**——只在 headless Chrome 上测了单帧成本。
2. **触屏真机手势未测**——仅用 Playwright 合成事件；`y > 170` 的上视口点击判定基于鼠标坐标。
3. **3010 未运行本批测试**——本轮只改 3020；两侧 `app.js`/`courses.js`/`styles.css` 哈希目前不同（预期）。
4. **模块 1、3、5、6 尚未实施**（批次 B、C）；批次 A 只完成文档表格中的模块 2 与 4。
5. 前轮遗留未验证项与演练模块无关，但仍未消除：Wavelet/Symbolic 相关声明（本机未装这两个工具箱）、教材正文未逐页核对。
6. 规划文档 §五 引用的两项独立数值抽查（sinc RMSE ≈ .002145、ZOH ≈ .7847；矩形窗双音谱峰）属于**批次 B** 模块 5 的规格，本批未复算。

## 八、预算与流程披露

- 本批为多阶段长任务，实际远超 `~/.dsh/AGENTS.md` 规则 10 的 20,000 tokens 软预算。**无可靠用量统计，不虚报具体数值**，仅明确声明已超支。
- 未跳过任何必要验证：本报告所有"通过"结论均来自本轮实际执行，无沿用历史结论。
- 全量套件共跑 3 次（前两次因中途修改测试文件而作废，未计入上表），最终一次为定稿后运行。
