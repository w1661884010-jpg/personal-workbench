# Context Notes（2026-09-16 演练模块改进）

> 与本轮 `plan.md`、`checklist.md` 同属独立段；不改动既有各轮记录。

## 1. 决策记录

### D1：批次 A 的测试先于实现（文档任务0 要求）
文档明确"先写本批模块的数值反例与行为用例，确认错误实现会失败再实现"。已落地：
`tests/practice-convolution.test.mjs`、`tests/practice-sampling.test.mjs` 先写，**实测因缺少
`window.__practiceCalc` 而失败**（不是因选择器写错）。这是本批的"失败基线"，实现后必须转绿。

### D2：计算与绘制分离 → 暴露纯计算接口供测试调用
文档要求"计算和绘制分离，测试调用实际计算实现，不复制产品算法自证"。
因此约定 app.js 的演练 demo 暴露：

```js
window.__practiceCalc = {
  // 模块 2
  convolutionAnalytic(t, w1, w2),        // 解析分段式
  convolutionNumeric(t, w1, w2, dtau),   // 复合梯形积分
  // 模块 4
  aliasObserved(fin, fs),                // min(r, fs-r)，r = fin mod fs
  aliasStatus(fin, fs),                  // 文案：满足严格条件 / 临界 / 混叠
  reconstruct(mode, fin, fs, t),         // 'sinc' | 'zoh' | 'linear'
  rmse(mode, fin, fs),                   // 文档规定的 1001 点等权
};
window.__practiceState = (id) => practiceDemoStates[id];   // 供行为测试读取状态
```

测试用**独立复算**作期望值（解析分段式、直接求和、手算数组），不引用产品内部实现。

### D3：3020 没有 AGENTS.md
文档任务0 说"读取3020目录AGENTS.md"，实测**该文件不存在**（`Test-Path` = False）。
适用的是工作区级 `~/.dsh/AGENTS.md` 与项目既有约定。已记录，未擅自创建。

### D4：`npm test` 的真实语义与耗时
`package.json` 的 `test` 脚本是 `node --test --test-concurrency=1 tests/*.test.mjs`，
**并发为 1**，与本会话此前直接跑 `node --test "tests/*.test.mjs"`（默认并发）不同。

| 跑法 | 结果 | 耗时 |
| --- | --- | --- |
| `npm test` 等价（并发 1） | 229/229 通过 | **338 s** |
| 直接 `node --test`（默认并发） | 229/229 通过 | 约 45 s |

基线复跑用的是前者（与 `npm test` 一致）。后续每批验收都用它。

### D5：实验数量的实际情况与文档表格的差异
文档第一节表格说批次 A 完成后实验数为 **6**（模块 2、4 是**原地升级**既有 ID，不新增）。
所以批次 A **不改** `experiments.length`（仍为 6）；B 批加到 8，C 批加到 10。
`tests/notebook-practice-page.test.mjs` 的 `assert.equal(experiments.length, 6)` 在 A 批**保持不变**，
到 B/C 批才递增——与文档"完成后实验数 6/8/10"一致。

### D6：沿用既有打开方式，不自创
我第一版 `openDemo` 用了不存在的卡片选择器，导致测试因**选择器**而非**缺实现**失败。
已改为沿用 `tests/practice.behaviour.test.mjs` 的既有路径：
`#practiceToggle` → `.practice-tab` → `.practice-tab[data-experiment-id="<id>"]`（按 ID 路由）。

## 2. 已核验的事实（本轮实测）

| 项 | 结果 |
| --- | --- |
| 3020 无独立 Git | ✓（无 `.git`） |
| 3010 基线 | `4973369`，工作区干净 |
| 3020 ↔ 3010 运行文件 | `courses.js`/`app.js`/`styles.css`/`course-model.ts` 哈希一致 |
| 既有 6 个实验 id | 与文档第一节表格**逐字一致** |
| `node --check app.js` | 通过 |
| `npm run build` | 通过（0.7 s） |
| `npm test` | **229/229 通过**（338 s），无跳过、无取消 |

## 3. 未决与风险

1. **模块 5 场景B**：文档已主动删除"1% 弱信号必定显露"，改为"窗对照单独画窗自身归一化频谱"，
   与我此前的复算结论一致 ✓ 不再是风险。
2. **播放与 rAF 生命周期**：文档要求"离开、重新渲染时注销旧 rAF/监听器；隐藏页面暂停"。
   实现时必须显式 `cancelAnimationFrame` 并把句柄挂在 demo 闭包内，否则批次验收的
   "播放退出后无旧回调"会失败。
3. **`--test-concurrency=1` 下全量 338 s**：批次验收（3 次全量）约需 17 分钟，需计入时间预算。
4. **性能声明**：文档要求"60fps 是目标，不对所有设备硬保证；记录设备、最大参数下耗时"，
   不能虚报——报告时只给本机实测值与环境。

## 4. 下一阶段入口（批次 A 实现）

按 `checklist.md` 顺序：模块 2 → 模块 4 → 守卫与同步 → 批次验收 → **重读规划文档** → 批次 B。
