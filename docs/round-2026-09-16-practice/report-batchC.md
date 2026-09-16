# 批次 C 验收报告（模块 1 波形变换 · 模块 3 傅里叶表示）

范围：仅在 `personal-workbench-shell-3020` 实施。3010、提交与推送均**未**触碰。
本报告按规划文档 §四「每批验收」与 §五「验证证据与发布边界」撰写。
**批次 C 完成后六个演练模块全部就位，实验总数 10 项。**

## 一、文件清单

| 文件 | 变更 | 说明 |
| --- | --- | --- |
| `app.js` | 改（+541 非空行） | 新增 `renderSignalWaveformDemo`（上下视口共用同一 toX、同一横坐标比例，虚线连接四个对应特征点，原支撑 [0,3] 底色）、`renderSignalFourierDemo`（上：目标方波 + 部分和 + 1.08949 渐近参考线；下：\|k/T\|≤4 Hz 带符号谱点 + 连续包络 sinc(f)）；`practiceCalc` 增模块 1/3 计算接口与 `mseCache`；`EXPERIMENT_SHORT_TITLES` 增两项 |
| `courses.js` | 改（+30 行） | 第一章按 1→2→3 插入 `signals-ch1-waveform-transform`（在卷积之前）与 `signals-ch1-fourier-synthesis`（在卷积之后） |
| `tests/practice-waveform.test.mjs` | 新增 | 6 个用例 |
| `tests/practice-fourier.test.mjs` | 新增 | 8 个用例 |
| `tests/notebook-practice-page.test.mjs` | 改 | `experiments.length` 8 → **10**；测试名同步 |
| `tests/practice.behaviour.test.mjs` | 改 | 短/全标题与 ID 清单改为 10 项；两处下标循环上界改 10 |
| `docs/round-2026-09-16-practice/screenshots/*.png` | 新增 12 张 | 见第五节 |
| `docs/round-2026-09-16-practice/batchC-evidence.json` | 新增 | 本报告图例/性能/布局原始读数 |

未改动：`styles.css`（本批无 CSS 变更）、`index.html`、`serve.mjs`、其余 31 个测试文件。
一次性脚本 `_batchC-spec.mjs`、`_batchC-evidence.mjs` 已删除。

## 二、复算参数（按规划文档 §三.1 / §三.3）

先用独立脚本（不引用产品代码）复算文档写明的全部期望值，**逐项吻合**后才写测试：

| 规格值 | 文档 | 独立复算 | 结论 |
| --- | --- | --- | --- |
| a=2,b=−4 支撑 | [2, 3.5] | [2, 3.5] | 一致 |
| a=−1,b=0 支撑 | [−3, 0] | [−3, 0] | 一致 |
| 四个特征点代回误差 | ≤1e-10 | **0**（浮点精确） | 一致 |
| T=2 / T=8 谱点数 | 17 / 65 | 17 / 65 | 一致 |
| 谱点落在包络上 | ≤1e-10 | **0** | 一致 |
| T=4,k=2 的 c₂ | 1/(2π) | 0.15915494309189535（差 0） | 一致 |
| T=4,N=101 的 x_N(0) | 1±0.02 | 1.003225（偏差 0.0032） | 一致 |
| T=2,N=101 过冲 | 8.8%–9.2% | **8.951%** | 一致 |
| 渐近参考线 | 1.08949 | N=11/51/101 峰值 1.090651/1.089551/1.089506，收敛到 1.08949 | 一致 |

模块 1 波形：梯形 `x(τ)=2τ（0≤τ<1）/ 2（1≤τ≤2）/ 2(3−τ)（2<τ≤3）/ 0`，特征点 (0,0)(1,2)(2,2)(3,0)；
a∈[−3,3] 步长 0.1 默认 1，b∈[−4,4] 步长 0.2 默认 0，**a=0 拒绝并保留上一个有效值**。
模块 3：单位高度中心对称周期矩形、脉宽 τ=1；T∈[2,10] 步长 0.5 默认 2，N∈[1,101] 步长 1 默认 5；
`c_k=(τ/T)sinc(kτ/T)`、`x_N(t)=c₀+2Σ(k=1…N)c_k cos(2πkt/T)`；MSE 用一个周期 4096 个中点等权。

## 三、测试数量与结果

| 命令 | 结果 | 耗时 |
| --- | --- | --- |
| `npm test`（36 个文件，`--test-concurrency=1`） | **268 / 268 通过**，fail 0、skipped 0、cancelled 0 | 426.8 s |
| 批次 B 结束时（同命令） | 254 / 254 通过 | 359.6 s |
| `node --test tests/practice-waveform.test.mjs tests/practice-fourier.test.mjs` | 14 / 14 | 8.2 s |
| `node --test tests/notebook-practice-page.test.mjs tests/course-content.test.mjs` | 7 / 7 | — |
| `node --test tests/practice.behaviour.test.mjs tests/mistakes.behaviour.test.mjs` | 10 / 10 | — |
| `node --test tests/narrow-practice-chart.test.mjs tests/narrow-practice-layout.test.mjs` | 10 / 10 | — |
| `node --check app.js` | 通过（exit 0） | — |
| `npm run build`（workbench / katex / pages） | 三项 exit 0 | 35 / 30 ms / 校验通过 |

净增 14 个用例（254 → 268）。`experiments.length` 8 → **10**，六个演练模块全部就位。

### 先失败后实现（文档任务0）
两个测试文件先写，实测 14/14 全失败，原因是**目标实验标签不存在**（`.practice-tab[data-experiment-id="…"]` 超时），
不是选择器写错。实现后**一次通过 14/14**——因为规格值已先独立复算，实现是按已确认的值写的。

### 变异测试（含文档 §四 点名的「删掉傅里叶偶次项」）

| # | 变异 | 结果 |
| --- | --- | --- |
| M1a | 支撑区间 min/max 互换（破坏 a<0） | **抓住**（fail 2） |
| M1b | t₀ 漏掉除以 a（返回 −b） | **抓住**（fail 1） |
| M3a | 系数漏掉 τ/T 因子 | **抓住**（fail 5） |
| M3b | **删掉傅里叶偶次项**（只累加奇次） | **抓住**（fail 2） |
| M3c | 包络取幅度丢掉符号（违反「保留符号而非混用幅度」） | **抓住**（fail 1） |

`app.js` 还原后 SHA256 与变异前一致。

## 四、截图与布局

> **证据存放说明**：本批 12 张截图位于 3020 试验副本 `docs/round-2026-09-16-practice/screenshots/`。
> 该目录按本仓库 `docs/` 既有约定（前几轮只提交文本记录）**未纳入 git**；文件名即「实验-视口-主题」。

`screenshots/` 本批新增 12 张：`{ch1-waveform-transform, ch1-fourier-synthesis} × {390,760,1440}px × {light,dark}`，累计 **36 张 / 3.29 MB**。
每张 `data-theme` 与文件名逐一核对一致。标签页现为 **10 项**：
信号观察 / **波形变换** / 动态卷积 / **傅里叶表示** / 采样与重建 / 频谱分析 / 循环卷积 / LTI 系统 / FIR 滤波 / 方差验证。
两个新模块的图例均为单一符号（无批次 B 记录的重复渲染问题）。

| 视口 | 模块 | 文档 scrollWidth | 视口宽 | 横向溢出 | 参数行数 | 结果行数 | 画布宽 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390px | 波形变换 | 390 | 390 | 无 | 1（2 参数并排） | 3（4 结果） | 298 |
| 390px | 傅里叶表示 | 390 | 390 | 无 | 1 | 4（5 结果） | 298 |
| 620px | 两者 | 620 | 620 | 无 | 1 | 3 / 4 | 528 |
| 1440px | 两者 | 1440 | 1440 | 无 | 1 | 1 | 971 |

console 错误仅 1 条 `favicon.ico` 404（既有噪声）；其余 HTTP ≥400 响应为 0。

## 五、性能测量环境与读数

环境：Windows x64；**HeadlessChrome 152.0.0.0**（Playwright，`channel: chrome`）；DPR = 1；
画布 CSS 971×340；`hardwareConcurrency` = 32。

| 场景 | 同步处理（含强制布局）中位 | max | 长任务 |
| --- | --- | --- | --- |
| 模块 1 上限（\|a\|=3、\|b\|=4 交替） | **0.3 ms** | 0.8 ms | **0 条** |
| 模块 3 上限（T=10、N=101 交替） | 5.9 ms | **27.2 ms** | 1 条（110 ms） |

模块 3 的 max（≈27 ms）出现在**换到新 N 的第一次重绘**：MSE 要按文档规定重算 4096 个中点 × N 次谐波；
结果按 `(T,N)` 记忆（`mseCache`），同一参数下的后续重绘不再付出该成本，因此中位数只有 5.9 ms。

**长任务未完全归因**：测量期间出现 1 条 110 ms 长任务，起点落在换 N 的测量循环内；
而页面内测得的同步处理+强制同步布局最大为 27.2 ms，其余耗时属浏览器渲染/合成阶段，**本批未进一步查明**（同批次 B）。

**不作过度声明**：headless 无 vsync；两个模块都没有播放循环，上述数字是单次控件变更成本，不是帧率。

## 六、未验证项（明确列出）

1. **模块 3 换 N 首帧的 27 ms 与 110 ms 长任务未归因完成**（见第五节）。
2. **带 vsync 的真实桌面浏览器帧率未测**；模块 1/3 无播放，只测控件变更成本。
3. **触屏真机手势未测**（仅 Playwright 合成事件）。
4. **3010 未运行本批测试**；两侧 `app.js`/`courses.js`/`styles.css` 哈希不同（预期）。
5. **「上下轴采用相同横坐标比例」只在代码结构上保证**（两轴共用同一个 `toX`），
   测试只断言了 `viewRange` 同时覆盖原支撑与新支撑，没有对渲染像素做比例断言。
6. 前轮遗留且与本批无关：Wavelet/Symbolic 相关声明（本机未装工具箱）、教材正文未逐页核对。
7. 批次 B 报告第四节披露的**既有 6 处图例符号重复渲染仍未处理**（本批新模块不受影响）。

## 七、六个模块的整体状态（批次 C 完成后）

| 模块 | 实验 ID | 状态 | 用例数 |
| --- | --- | --- | ---: |
| 1 波形变换 | `signals-ch1-waveform-transform` | ✅ | 6 |
| 2 动态卷积 | `signals-ch1-convolution` | ✅（批次 A） | 7 |
| 3 傅里叶表示 | `signals-ch1-fourier-synthesis` | ✅ | 8 |
| 4 采样重建 | `signals-ch2-aliasing` | ✅（批次 A） | 6 |
| 5 频谱分析 | `signals-ch2-spectral-leakage` | ✅（批次 B） | 6 |
| 6 循环卷积 | `signals-ch2-circular-convolution` | ✅（批次 B） | 6 |

六个模块均含预测问题、≥2 组反例对照与「用自己的话解释」步骤（由每个测试文件的同名用例断言）。

## 八、预算与流程披露

- 本批同样超出 `~/.dsh/AGENTS.md` 规则 10 的单次思考 20,000 tokens 软预算。**无可靠用量统计，不虚报具体数值**，仅声明已超支。
- 批次 B 报告中记录的「全量套件与 `npm run build` 并行」瑕疵本批已避免：本批**先构建、后跑套件**。
- 未跳过任何必要验证：报告中所有"通过"结论均来自本轮实际执行。
