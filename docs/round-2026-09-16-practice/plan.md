# 演练模块改进计划（2026-09-16）

> 依据：桌面 `信号与系统前两章演练模块工程规划与验收规范.md`（176 行执行版，2026-09-16 修订）。
> 本文是该文档的**执行记录**，不改写其要求；每个阶段完成后**重读该文档**再进入下一阶段。

## 授权范围（严格）

- **仅**在 `C:\Users\Lenovo\Desktop\learning\repositories\personal-workbench-shell-3020` 实施。
- **3010、提交、推送远端均需后续授权**（文档第五节明确）。
- 不改课程数据模型、不引入图表库、不全面重构 app.js。

## 目标与成功标准

**目标**：6 个演练模块（第二章各 3 个），用"先预测 → 动手改变 → 对照证据 → 解释原因"连接前两章概念。

**成功标准**（可判定）：
1. 每批完成后 `experiments.length` 达到文档规定值（A=6、B=8、C=10），且按 ID 路由、顺序与标题与文档第一节表格一致。
2. 每模块的**数值验收**用独立算法复算通过（不匹配源码关键词）。
3. 反例有效：文档列出的错误实现必须让对应测试失败。
4. `npm test`、`npm run build`、`node --check app.js` 全通过；既有 229 项零回退。
5. 390/760/1440 × 浅/深主题逐模块打开无横向溢出、无 console 错误；reduced-motion 不自动播放。
6. 参数状态按文档契约：切 Tab 保留、重进暂停、刷新回默认；离开时注销 rAF/监听器。

## 分批（文档表格）

| 批次 | 模块 | 完成后实验数 | 新增测试文件 |
| --- | --- | ---: | --- |
| **A** | 2 动态卷积、4 采样重建 | 6 | `tests/practice-convolution.test.mjs`、`tests/practice-sampling.test.mjs` |
| B | 5 频谱分析、6 循环卷积 | 8 | `tests/practice-leakage.test.mjs`、`tests/practice-circular.test.mjs` |
| C | 1 波形变换、3 傅里叶表示 | 10 | `tests/practice-waveform.test.mjs`、`tests/practice-fourier.test.mjs` |

每模块独立走"失败用例 → 最小实现 → 定向复测 → 展示解释题"；**不先堆完六项才测试**。

## 阶段门（每阶段必做）

1. **重读**桌面规划文档（用户明确要求）。
2. 对照本文档的模块规格逐条核对实现（数值、控件范围、验收值）。
3. 跑该批的定向测试 + 全量 + 构建。
4. 三档 × 双主题目视。
5. 更新 checklist / context-notes 的检查点。

## 已知的前置事实（任务0 采集）

- 3020 **没有 AGENTS.md**（文档任务0 提到要读；实际不存在，适用工作区级 `~/.dsh/AGENTS.md` 与本文）。
- `npm test` 实际命令：`node --test --test-concurrency=1 tests/*.test.mjs`（并发为 1，与直接 `node --test` 不同）。
- 既有关键调用点：`collectPracticeExperiments`(app.js:1823)、`EXPERIMENT_SHORT_TITLES`(1837)、`SIGNAL_DEMOS[`(1918)、`openNotebookExperiment`(1980)、`renderSignalAliasingDemo`(2213)、`renderSignalConvolutionDemo`(2415)、`findExperimentById`(196)。
- 既有 6 个实验：绪论 `signals-intro-notebook`、第1章 `signals-ch1-convolution`、第2章 `signals-ch2-aliasing`、第3章 `signals-ch3-first-order-lti`、第4章 `signals-ch4-moving-average`、第5章 `signals-ch5-random-average`。
- `tests/practice.behaviour.test.mjs` L60–64 写死了 5 个实验 ID，需按 ID 同步更新（不能删断言、不能放成"大于 0"）。

## 不做（本轮）

- 不做 Z 平面、滤波器设计、时频分析类演练。
- 不把 `limitation` 当演练页 DOM 验收项。
- 不在演练页新增总进度、勾选框、`.notebook-boundary`。
- 不加指数/冲激卷积预设（文档明确留在范围外）。
- 不授权前不迁回 3010。

## 2026-09-17 局部修复（用户授权在已迁回的3010修复）

范围仅 app.js 与卷积/频谱回归测试；3020不覆盖，不提交、不推送。
决定：复用现有同步及清理入口；输入单位幅度与卷积输出峰值分别缩放；窗搜索扩展至奈奎斯特频率并同步绘图区，不改数学模型。

- [x] 新增回归复现控件旧值、短脉冲裁切、播放中退出、L16 Hann 指标缺失。
- [x] 局部修复后运行受影响测试，因触及视图退出路径再运行全量测试及构建。
- [x] 核对最终差异和工作区；记录实际结果，不把全绿替代独立缺陷验证。

验证：修复前四个目标用例均失败；修复后卷积/频谱测试 16/16 通过，全量 279/279 通过（568.6 秒），`node --check app.js`、`npm run build`、`git diff --check` 通过。390/1440 视口浏览器截图核验短脉冲完整显示、L16 Hann 主瓣约 8.53 Hz 且旁瓣指标有效，无页面横向溢出及 JS 异常；既有 favicon.ico 404 未处理，手机真机未复测。

修改限于 app.js、两个回归测试及本段记录；3020未覆盖，未提交、未推送。桌面 ABC 验收报告按历史交付记录读取，未修改；其中迁回前的 3010 状态描述不能作为当前状态结论。
