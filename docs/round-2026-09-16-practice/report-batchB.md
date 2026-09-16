# 批次 B 验收报告（模块 5 频谱分析 · 模块 6 循环卷积）

范围：仅在 `personal-workbench-shell-3020` 实施。3010、提交与推送均**未**触碰。
本报告按规划文档 §四「每批验收」与 §五「验证证据与发布边界」撰写。

## 一、文件清单

| 文件 | 变更 | 说明 |
| --- | --- | --- |
| `app.js` | 改（+708 非空行） | 新增 `renderSignalLeakageDemo`（上：稠密 DTFT + N_fft 点 DFT 谱线；下：窗自身频谱 dB + 主瓣边界/第一旁瓣标记）、`renderSignalCircularDemo`（宽屏左右并排、窄屏纵排：左线性结果与折回箭头，右 x_N[k]·h_N[(m−k) mod N] 与贡献和，含单步按钮）；`practiceCalc` 增模块 5/6 计算接口与 `spectrumBasis` 缓存；`EXPERIMENT_SHORT_TITLES` 增两项 |
| `courses.js` | 改（+34 行） | 第二章新增 `signals-ch2-spectral-leakage`、`signals-ch2-circular-convolution` 两个条目（含预测题、2 组反例、解释题、expected、limitation） |
| `tests/practice-leakage.test.mjs` | 新增 | 6 个用例 |
| `tests/practice-circular.test.mjs` | 新增 | 6 个用例 |
| `tests/notebook-practice-page.test.mjs` | 改 | `experiments.length` 6 → **8**；测试名同步 |
| `tests/practice.behaviour.test.mjs` | 改 | 短/全标题与 ID 清单改为 8 项；两处下标循环改按 ID 路由 |
| `tests/narrow-practice-layout.test.mjs` | 改 | 新增 `openTabById`，卷积用例由下标 1 改为按 ID（批次 C 会插入新实验使下标移位） |
| `docs/round-2026-09-16-practice/screenshots/*.png` | 新增 12 张 | 见第五节 |
| `docs/round-2026-09-16-practice/batchB-evidence.json` | 新增 | 本报告图例/性能/布局原始读数 |

未改动：`styles.css`（本批无 CSS 变更）、`index.html`、`serve.mjs`、其余 29 个测试文件。
一次性脚本 `_batchB-spec.mjs`、`_batchB-evidence.mjs` 已删除。

## 二、复算参数（按规划文档 §三）

先用独立脚本（不引用产品代码）复算文档写明的全部期望值，结果**逐项吻合**后才写测试：

| 规格值 | 文档 | 独立复算 | 结论 |
| --- | --- | --- | --- |
| L=16 双音局部峰 | 1 个，约 11.08 Hz（§五） | 1 个 @ **11.08 Hz** | 一致 |
| L=64 双音局部峰 | 2 个，落在 [9.7,10.3]、[11.7,12.3]（§三.5）；约 9.89/12.14 Hz（§五） | 2 个 @ **9.89 / 12.14 Hz** | 一致 |
| 矩形窗第一旁瓣（L=64） | [−14,−12] dB | **−13.25 dB** | 一致 |
| Hann 第一旁瓣（L=64） | [−33,−30] dB | **−31.47 dB** | 一致 |
| Hann 主瓣更宽（L=64） | 是 | 主瓣边界 2.032 Hz vs 矩形 1.000 Hz | 一致 |
| (4,4,N4) 线性 / 循环 / E | [1,2,3,4,3,2,1] / [4,4,4,4] / 6 | 完全相同 | 一致 |
| (4,4,N7) / (4,4,N10) | 与线性一致 / 尾部 3 零 | 完全相同 | 一致 |
| (8,8,N2) / 折回 / 受影响桶 | [32,32] / 13 / 2 | 完全相同 | 一致 |

**实现要点**：f_s 固定 64 Hz；谱归一化 `|Σw[n]x[n]e^{−j2πfn/fs}|/Σw[n]`（单位幅度单音谱峰 = 0.5，**不作单边翻倍**）；补零只改网格不改同频率谱值；循环卷积的 DFT 核对路线**先按模 N 折叠两个输入**，不使用会截断长输入的 N 点变换；浮点归零阈值 1e-9。

## 三、测试数量与结果

| 命令 | 结果 | 耗时 |
| --- | --- | --- |
| `npm test`（34 个文件，`--test-concurrency=1`） | **254 / 254 通过**，fail 0、skipped 0、cancelled 0 | 359.6 s |
| 批次 A 结束时（同命令） | 242 / 242 通过 | 393.7 s |
| `node --test tests/practice-leakage.test.mjs tests/practice-circular.test.mjs` | 12 / 12 | 5.8 s |
| `node --test tests/notebook-practice-page.test.mjs tests/course-content.test.mjs` | 7 / 7 | — |
| `node --test tests/narrow-practice-chart.test.mjs tests/narrow-practice-layout.test.mjs` | 10 / 10 | — |
| `node --test tests/practice.behaviour.test.mjs tests/mistakes.behaviour.test.mjs` | 10 / 10 | — |
| `node --check app.js` | 通过（exit 0） | — |
| `npm run build`（workbench / katex / pages） | 三项 exit 0 | 184 / 112 ms / 校验通过 |

净增 12 个用例（242 → 254）。`experiments.length` 6 → **8**（符合文档 §四 分批表）。

### 先失败后实现（文档任务0）
两个测试文件先写，实测 12/12 全失败，失败原因是**目标实验标签不存在**（`.practice-tab[data-experiment-id="…"]` 超时），
而不是选择器写错——同一个选择器对既有 6 个实验可用。实现后转绿。

### 变异测试（文档 §四「反例必须有效」点名两类）

| # | 变异 | 结果 |
| --- | --- | --- |
| M5a | 让补零改变 DTFT 值（`dftMagnitude` 乘 `L/N_fft`） | **抓住**（fail 2） |
| M5b | 归一化分母由 Σw[n] 改为 L | **抓住**（fail 2） |
| M6a | 循环折叠改为截断（`out[i % n] += 1` → 截断） | **抓住**（fail 1） |
| M6b | 受影响桶漏掉 `min(N, …)` | **抓住**（fail 2） |

`app.js` 还原后 SHA256 与变异前一致。

### 本批修正的测试缺陷（均为测试自身写错，非产品缺陷）
1. `practice.behaviour.test.mjs`：LTI/FIR/方差用例用**数组下标** 3/4/5 定位，批次 B 后下标移位而失败 → 改为按实验 ID 路由（规划文档第一节明确"不能依赖数组下标"）。
2. `narrow-practice-layout.test.mjs`：卷积用例用 `openTab(page, 1)` → 改 `openTabById`，避免批次 C 插入模块 1 后再次失效。
3. 新写的模块 5 指标用例最初把 `f_s/L` 期望写成 128 Hz、网格写成 64 → 实际 `64/32 = 2 Hz`（实现正确），已改为精确断言。
4. 模块 6 用例的字段查找串 `^N\b` 先命中「N₁ / 样点」→ 收窄为 `/循环长度/`。

## 四、图例类名的历史冲突（本批只保证新模块正确，未扩散修改）

实测发现既有 6 处图例**重复渲染符号**：标签文本自带符号（如 `"— 连续信号 x(t)"`）且 CSS `.demo-legend-line::before` 又补一个 `"—"`，渲染成 `— — 连续信号 x(t)`；
而 `demo-legend-dash` / `demo-legend-fill` 在 `styles.css` 中**根本没有规则**。

按规则 11（冲突时选一种，不混用）：本批**新模块只使用有 CSS 支撑的类**（`demo-legend-line/-stem/-peak`），标签不带符号。
实测两个新模块的图例均为单一符号（`稠密 DTFT`→`—`、`DFT 谱线`→`│`、`第一旁瓣`→`◆`；`线性结果 y_lin`→`│`、`折回 n mod N`→`◆`、`循环结果 y_circ`→`—`）。
**既有 6 处重复渲染属批次 A 之前的既有问题，本批未修改**（超出范围），在此披露待后续统一处理。

## 五、截图与布局

> **证据存放说明**：本批 12 张截图位于 3020 试验副本 `docs/round-2026-09-16-practice/screenshots/`。
> 该目录按本仓库 `docs/` 既有约定（前几轮只提交文本记录）**未纳入 git**；文件名即「实验-视口-主题」。

`screenshots/` 本批新增 12 张：`{ch2-spectral-leakage, ch2-circular-convolution} × {390,760,1440}px × {light,dark}`，累计 24 张 / 2.19 MB。
每张 `data-theme` 与文件名逐一核对一致。标签页现为 8 项：信号观察 / 动态卷积 / 采样与重建 / **频谱分析** / **循环卷积** / LTI 系统 / FIR 滤波 / 方差验证。

| 视口 | 文档 scrollWidth | 视口宽 | 横向溢出 | 参数行数 | 画布宽 |
| --- | --- | --- | --- | --- | --- |
| 390px | 390 | 390 | 无（−34） | 3（5 参数 / 2 列） | 298 |
| 620px | 620 | 620 | 无（−34） | 3 | 528 |
| 1440px | 1440 | 1440 | 无（−44） | 1 | 971 |

模块 6 两幅图按文档「左图/右图」在 ≥620px 并排、窄屏纵排（不缩小内容）。
console 错误仅 1 条 `favicon.ico` 404（既有噪声）；其余 HTTP ≥400 响应为 0。

## 六、性能测量环境与读数

环境：Windows x64；**HeadlessChrome 152.0.0.0**（Playwright，`channel: chrome`）；DPR = 1；
画布 CSS 971×340；`hardwareConcurrency` = 32。

| 场景 | 同步处理（含强制布局）中位 | max |
| --- | --- | --- |
| 模块 5 默认（L=32、M=0） | 2.9 ms | 3.6 ms |
| 模块 5 **上限**（L=128、M=224，N_fft=352） | **8.8 ms** | 9.5 ms |
| 模块 6 上限（N₁=N₂=8、N=16，单步推进） | 0.6 ms | 0.8 ms |

优化前后：模块 5 上限由 **14.9 ms → 8.1 ms**（默认 4.4 → 2.6 ms）。做法是新增 `spectrumBasis` 缓存——
窗值与场景样点只取决于 `(scene, L, win)`，与频率无关，缓存后每个频点只剩 2 次三角函数而不是重新求窗值+场景样点。
缓存不改变任何数值（模块 5 用例仍 6/6）。

**长任务（未完全归因，如实报告）**：切到最大参数时观察到 2 条长任务，**73 ms** 与 **217 ms**，
其起点分别与两次 `setField` 调用对齐（141 ms / 360 ms）。但在页面内测得的同步处理+强制同步布局只有 ~9 ms，
因此其余耗时**不是**演练的 JS 计算，属浏览器渲染/合成阶段；该部分**本批未进一步查明**。
模块 6 与模块 5 默认参数下长任务为 0 条。

**不作过度声明**：headless 无 vsync，上述数字是单次控件变更的成本，不是帧率；
模块 5、6 均无播放循环，不存在逐帧开销问题。

## 七、未验证项（明确列出）

1. **73/217 ms 长任务未归因完成**（见第六节），未定位到具体渲染阶段。
2. **带 vsync 的真实桌面浏览器帧率未测**；模块 5/6 无播放，仅测控件变更成本。
3. **触屏真机手势未测**（仅 Playwright 合成事件）。
4. **3010 未运行本批测试**；两侧 `app.js`/`courses.js`/`styles.css` 哈希不同（预期）。
5. **模块 1、3 尚未实施**（批次 C）；批次 B 只完成文档表格中的模块 5 与 6。
6. 前轮遗留且与本批无关：Wavelet/Symbolic 相关声明（本机未装工具箱）、教材正文未逐页核对。
7. 文档 §三.5 中「矩形窗第一旁瓣 [−14,−12] dB」等区间只在 L=64、步长 0.001 Hz 下验证；
   其他 L 与步长未逐一复核。

## 八、预算与流程披露

- 本批同样超出 `~/.dsh/AGENTS.md` 规则 10 的单次思考 20,000 tokens 软预算。**无可靠用量统计，不虚报具体数值**，仅声明已超支。
- 全量套件在 `npm run build` 期间并行运行了一次（构建会重写 bundle）。本次未出现失败，但该并行不是有意设计；
  若后续出现疑似 bundle 竞争的失败，应串行重跑后再判断。
- 未跳过任何必要验证：报告中所有"通过"结论均来自本轮实际执行。
