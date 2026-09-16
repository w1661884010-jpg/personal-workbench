# 决策与已知余项

- coding-task-discipline：先核验/规划，再按文件暂存；不使用git add -A。
- 3010已有章节渲染、导航、类型及一二章扩充改动，与3020对应文件一致，属于本次课程检查点的依赖与成果。
- 3020仅courses.js有新增运行差异，新增tests/course-ch2-math.test.mjs；sync工具因目标脏会阻止批量同步，故审阅后按明确文件复制，不修改同步工具。
- tests/narrow-workbench-switcher.test.mjs仅将固定等待改为带超时的目标transform等待，几何断言保留；单独提交。
- tests/workbench-space.test.mjs git diff无内容差异，不暂存。
- 后续小修：第二章summary仍写fs≥2fmax，需与正文严格条件和端点说明统一；course-ch2-math采样反面对照应使用sin(2π*fmax*n/fs)，现写sin(π*fs*n/2)，数值非零但不是声明的采样模型。
- 后续测试补强：单边谱测试目前只测归一化双边谱与直流/Nyquist，需真正构造单边谱并补整频余弦、奇数最高正频案例；内容聚合断言需涵盖summary和links。
- MATLAB未实际执行，教材原页未逐页复核；保持此前证据边界。

## 本轮验证

- 3010执行 `node --test --test-concurrency=3 tests/*.test.mjs`：184 passed / 0 failed / 0 skipped，118秒。
- `npm run build`：工作台、KaTeX、Pages构建均成功；构建资源无实质Git差异。
- `git diff --check` 通过；测试含两章390/760/1440公式卡与章节导航验证。
- 同步前courses.js另存于临时目录workbench-review-df88b01bc68d44719304d39e1ecabccd，便于对比。
- 起始HEAD=f3f0ace，origin/main=2a3c172；本轮不fetch、不push，远端跟踪引用并非远端实时查询。
