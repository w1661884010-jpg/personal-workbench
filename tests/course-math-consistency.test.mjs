/* 课程数学一致性测试。
   目的：不再只检查"字段存在 / 字数达标"，而是
     ① 用**独立数值复算**验证正文里出现的关键数学结论（拉普拉斯/傅里叶、矩形卷积、波形变换支撑区间）；
     ② 断言课程数据里的表述与复算结论一致（错话一旦写回正文就会失败）。
   纯 Node，不需要服务器。 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import { plainMath } from "./math-plain.mjs";

const root = new URL("../", import.meta.url);

async function loadCourses() {
  const source = await readFile(new URL("courses.js", root), "utf8");
  const context = vm.createContext({});
  vm.runInContext(source, context, { filename: "courses.js" });
  return context.CoursesData.courses;
}

function chapterOf(courses, id) {
  for (const course of courses) {
    const chapter = course.chapters.find((item) => item.id === id);
    if (chapter) return chapter;
  }
  throw new Error("找不到章节 " + id);
}

function sectionOf(chapter, id) {
  const section = chapter.sections.find((item) => item.id === id);
  assert.ok(section, `找不到小节 ${id}`);
  return section;
}

/** 小节的全部文字（正文 + 展开段 + 要点 + 易混点 + 公式 + 变量）
 *  只归一化散文类字段；section.formula / variables 是作者手写的原始 LaTeX，
 *  原样保留（对它们做 LaTeX→纯文本的还原会误伤嵌套花括号，例如 \frac{1}{3-j\omega}）。 */
function sectionText(section) {
  return plainMath([
    section.title,
    section.content,
    ...(section.detail ?? []),
    ...(section.points ?? []),
    ...(section.pitfalls ?? []),
    ...(section.links ?? []).map((link) => link.why),
  ].join("\n"))
    + "\n" + (section.formula ?? "")
    + "\n" + (section.variables ?? []).join("\n");
}

/* ---------- 数值工具 ---------- */

/** 复积分 ∫ f(t) dt，梯形法 */
function integrate(f, from, to, steps) {
  const h = (to - from) / steps;
  let re = 0;
  let im = 0;
  for (let i = 0; i <= steps; i += 1) {
    const t = from + i * h;
    const weight = i === 0 || i === steps ? 0.5 : 1;
    const value = f(t);
    re += weight * value[0];
    im += weight * value[1];
  }
  return [re * h, im * h];
}

const magnitude = ([re, im]) => Math.hypot(re, im);
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const divide = ([re, im], [cr, ci]) => {
  const d = cr * cr + ci * ci;
  return [(re * cr + im * ci) / d, (im * cr - re * ci) / d];
};

/* ================= ① 数值复算 ================= */

test("数值复算：x(t)=e^(3t)u(−t) 的傅里叶积分收敛，且等于 1/(3−jω)", () => {
  const omega = 1;
  const integrand = (t) => {
    const a = Math.exp(3 * t);           // x(t)=e^{3t}，只在 t<0 非零
    return [a * Math.cos(-omega * t), a * Math.sin(-omega * t)];
  };
  const exact = divide([1, 0], [3, -omega]);   // 1/(3−jω)
  const near = integrate(integrand, -20, 0, 20000);
  const far = integrate(integrand, -60, 0, 60000);

  assert.ok(distance(near, exact) < 1e-6, `T=20 时误差 ${distance(near, exact)}`);
  assert.ok(distance(far, exact) < 1e-6, `T=60 时误差 ${distance(far, exact)}`);
  // 沿虚轴取值收敛 ⇒ 收敛域包含虚轴 ⇒ 傅里叶变换存在
  assert.ok(Math.abs(exact[0] - 0.3) < 1e-12 && Math.abs(exact[1] - 0.1) < 1e-12);
});

test("数值复算：x(t)=e^(2t)u(t) 的傅里叶积分发散（对照组，说明判据不是“极点在右半平面”）", () => {
  const omega = 1;
  const integrand = (t) => [Math.exp(2 * t) * Math.cos(-omega * t), Math.exp(2 * t) * Math.sin(-omega * t)];
  const at6 = magnitude(integrate(integrand, 0, 6, 6000));
  const at12 = magnitude(integrate(integrand, 0, 12, 12000));
  assert.ok(at12 > 100 * at6, `应当指数发散：T=6 时 ${at6}，T=12 时 ${at12}`);
});

test("数值复算：矩形卷积的峰值是 min(w₁,w₂)，总面积是 w₁·w₂", () => {
  for (const [w1, w2] of [[1, 1], [1, 3], [2, 5], [3, 1]]) {
    const rect = (t, w) => (t >= 0 && t <= w ? 1 : 0);
    const dt = 0.001;
    const total = w1 + w2;
    let peak = 0;
    let area = 0;
    for (let t = 0; t <= total; t += dt) {
      let value = 0;
      for (let tau = 0; tau <= t; tau += dt) value += rect(tau, w1) * rect(t - tau, w2) * dt;
      peak = Math.max(peak, value);
      area += value * dt;
    }
    assert.ok(Math.abs(peak - Math.min(w1, w2)) < 0.01, `w=(${w1},${w2}) 峰值应为 ${Math.min(w1, w2)}，实测 ${peak}`);
    assert.ok(Math.abs(area - w1 * w2) < 0.02, `w=(${w1},${w2}) 总面积应为 ${w1 * w2}，实测 ${area}`);
  }
});

test("数值复算：x(2−t) 的支撑是 [1,2]；“先右移再翻转”得到的是 x(−t−2)，支撑 [−3,−2]", () => {
  const x = (t) => (t >= 0 && t <= 1 ? 1 : 0);
  /** 数值扫描支撑区间（网格步长 0.001，端点允许 ±0.002 的网格误差） */
  const scan = (f) => {
    let lo = null;
    let hi = null;
    for (let i = 0; i <= 10000; i += 1) {
      const t = -5 + i * 0.001;
      if (f(t) === 0) continue;
      if (lo === null) lo = t;
      hi = t;
    }
    return [lo, hi];
  };
  const near = (value, target) => Math.abs(value - target) < 0.002;

  const [yLo, yHi] = scan((t) => x(2 - t));
  assert.ok(near(yLo, 1) && near(yHi, 2), `x(2−t) 的支撑应为 [1,2]，实测 [${yLo}, ${yHi}]`);

  const [zLo, zHi] = scan((t) => x(-t - 2));
  assert.ok(near(zLo, -3) && near(zHi, -2), `先右移再翻转得到 x(−t−2)，支撑应为 [−3,−2]，实测 [${zLo}, ${zHi}]`);
});

test("数值复算：R_xy(τ)=0.5cos[2π(τ+0.25)]，R_xy(−0.25)=+0.5、R_xy(+0.25)=−0.5，峰值按 T 重复", () => {
  const T = 1;
  const w = 2 * Math.PI;
  const x = (t) => Math.sin(w * t);
  const y = (t) => Math.sin(w * (t - 0.25));
  /* 按正文采用的定义做时间平均（功率）相关 (1/T)∫_0^T x(t)y(t−τ)dt */
  const R = (tau) => {
    const steps = 200000;
    const h = T / steps;
    let sum = 0;
    for (let i = 0; i <= steps; i += 1) {
      const t = i * h;
      sum += (i === 0 || i === steps ? 0.5 : 1) * x(t) * y(t - tau);
    }
    return (sum * h) / T;
  };
  const closed = (tau) => 0.5 * Math.cos(w * (tau + 0.25));

  for (const tau of [-1.25, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1.75]) {
    assert.ok(Math.abs(R(tau) - closed(tau)) < 1e-6, `R_xy(${tau}) 数值 ${R(tau).toFixed(6)} 与闭式 ${closed(tau).toFixed(6)} 不符`);
  }
  assert.ok(Math.abs(R(-0.25) - 0.5) < 1e-6, `R_xy(−0.25) 应为 +0.5，实测 ${R(-0.25).toFixed(6)}`);
  assert.ok(Math.abs(R(0.25) + 0.5) < 1e-6, `R_xy(+0.25) 应为 −0.5，实测 ${R(0.25).toFixed(6)}`);
  assert.ok(R(-0.25) > 0 && R(0.25) < 0, "两个符号必须相反：−0.25 处为正峰、+0.25 处为负峰");
  /* 峰值按 T=1 s 重复：−0.25 + kT 都是峰值 */
  for (const peak of [-1.25, -0.25, 0.75, 1.75]) {
    assert.ok(Math.abs(R(peak) - 0.5) < 1e-6, `τ=${peak}（=−0.25+kT）应是峰值 +0.5，实测 ${R(peak).toFixed(6)}`);
  }
});

test("数值复算：±1 方波部分和的吉布斯过冲 N=1/3/5 → 13.66/10.02/9.42 %，渐近 8.95 %", () => {
  const w = 2 * Math.PI;
  /* N = 最高奇次谐波（不是项数）；跳变量 = 2（从 −1 跳到 +1） */
  const partialSum = (t, N) => {
    let sum = 0;
    for (let k = 1; k <= N; k += 2) sum += Math.sin(w * k * t) / k;
    return (4 / Math.PI) * sum;
  };
  const overshootPercent = (N) => {
    const steps = 20001;   /* 与 50 万点细网格的差异 < 1e-3 %（已验证） */
    let max = -Infinity;
    for (let i = 0; i <= steps; i += 1) max = Math.max(max, partialSum((i * 0.5) / steps, N));
    return ((max - 1) / 2) * 100;
  };

  for (const [N, expected] of [[1, 13.66], [3, 10.02], [5, 9.42]]) {
    const actual = overshootPercent(N);
    assert.ok(Math.abs(actual - expected) < 0.02, `N=${N} 过冲应约 ${expected}%，实测 ${actual.toFixed(3)}%`);
  }
  const asymptotic = overshootPercent(2001);
  assert.ok(Math.abs(asymptotic - 8.95) < 0.01, `较大 N 应趋近 8.95%，实测 ${asymptotic.toFixed(3)}%`);
  /* 关键：有限项过冲大于渐近值——“有限项略小于极限”与复算直接矛盾 */
  assert.ok(overshootPercent(5) > asymptotic, `N=5（${overshootPercent(5).toFixed(3)}%）应大于渐近值（${asymptotic.toFixed(3)}%）`);
  assert.ok(overshootPercent(1) > overshootPercent(3) && overshootPercent(3) > overshootPercent(5), "过冲随 N 增大而下降");
});

/* ================= ② 正文与复算一致 ================= */

test("正文一致：拉普拉斯例题必须说“收敛域含虚轴、傅里叶变换存在”，且不得再写反", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch1");
  const example = chapter.examples.find((item) => item.title.includes("拉普拉斯"));
  assert.ok(example, "找不到拉普拉斯例题");
  const text = [example.prompt, ...example.steps, example.answer].join("\n");

  assert.match(text, /包含虚轴|含虚轴/, "必须点明收敛域包含虚轴");
  assert.match(text, /傅里叶变换存在/, "必须给出“傅里叶变换存在”的结论");
  assert.match(text, /1\/\(3−jω\)|1\/\(3-jω\)|\\frac\{1\}\{3-j\\omega\}/, "必须给出 X(jω)=1/(3−jω)");
  assert.doesNotMatch(text, /不包含虚轴/, "不得再说“不包含虚轴”");
  assert.doesNotMatch(text, /傅里叶变换不存在/, "不得再说“傅里叶变换不存在”");
  assert.doesNotMatch(text, /指数增长/, "不得再说信号沿 −∞ 方向指数增长");
});

test("正文一致：卷积小节必须给出 min(w₁,w₂) 规则，不得把峰值说成面积之积", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch1");
  const text = sectionText(sectionOf(chapter, "signals-ch1-time-convolution"));

  assert.match(text, /min\(w_1,w_2\)|min\(w1,w2\)/, "必须写明峰值 = min(w_1,w_2)");
  assert.match(text, /总面积/, "必须区分“总面积”");
  assert.doesNotMatch(text, /峰值等于两个脉冲面积之积/, "不得把峰值写成两个脉冲面积之积");
});

test("正文一致：阶跃响应不得与“h=u(t) 的系统对任意输入的输出”混用", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch1");
  const example = chapter.examples.find((item) => item.title.includes("与冲激") || item.prompt.includes("h(t)=u(t)"));
  assert.ok(example, "找不到“与冲激、阶跃卷积”例题");
  const text = [example.prompt, ...example.steps, example.answer].join("\n");

  assert.match(text, /滑动积分/, "应说明 ∫x 是输入的滑动积分");
  assert.match(text, /该系统的阶跃响应是/, "应另行给出该系统的阶跃响应");
  assert.doesNotMatch(text, /即该系统的阶跃响应/, "不得把 ∫x 直接称作该系统的阶跃响应");
  assert.doesNotMatch(text, /∫（/, "积分表达式必须写明上下限，不用“∫（从…到…）”的中文写法");

  const decomposition = sectionText(sectionOf(chapter, "signals-ch1-time-decomposition"));
  assert.match(decomposition, /g\(t\)=∫_\{?−∞\}?\^\{?t\}?h\(τ\)dτ/, "阶跃响应表达式必须带积分限");
});

test("正文一致：x(2−t) 在正文 / 例题 / 检验三处都必须是“先翻转再右移”", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch1");
  const section = sectionText(sectionOf(chapter, "signals-ch1-time-composite"));
  assert.match(section, /先翻转/, "混合运算正文必须写“先翻转、再右移 2”");
  assert.match(section, /x\(−t−2\)/, "正文应点明先移后翻得到的是 x(−t−2)");

  const example = chapter.examples.find((item) => item.title.includes("镜像"));
  assert.ok(example, "找不到镜像变换例题");
  const exampleText = plainMath([example.prompt, ...example.steps, example.answer].join("\n"));
  assert.match(exampleText, /先翻转/, "例题步骤必须写“先翻转”");
  assert.match(exampleText, /0≤2−t≤1/, "例题必须给出交叉验证");

  const check = chapter.check.find((item) => item.id === "signals-ch1-check-11");
  assert.ok(check, "找不到 check-11");
  assert.match(check.explanation, /先翻转/, "检验解析必须写“先翻转”");
  assert.doesNotMatch(check.explanation, /先右移 2 得到/, "检验解析不得再把“先右移 2”写成正确顺序");
});

test("正文一致：相关函数的时延符号必须与所用定义一致（符号写错即失败）", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch1");
  const text = sectionText(sectionOf(chapter, "signals-ch1-correlation"));

  /* 正向要求：闭式、峰值位置、两个取样值、符号说明 */
  assert.match(text, /R_xy\(τ\)=0\.5cos\[2π\(τ\+0\.25\)\]/, "必须给出闭式 R_xy(τ)=0.5cos[2π(τ+0.25)]");
  assert.match(text, /τ=−0\.25\+kT/, "峰值位置必须写成 τ=−0.25+kT");
  assert.match(text, /R_xy\(−0\.25\)=\+0\.5/, "必须给出 R_xy(−0.25)=+0.5");
  assert.match(text, /R_xy\(\+0\.25\)=−0\.5/, "必须给出 R_xy(+0.25)=−0.5");
  assert.match(text, /符号相反/, "必须显式说明“峰值时移与延迟符号相反”");

  /* 反向禁止：把符号写回去就会失败 */
  assert.doesNotMatch(text, /峰值出现在 τ=0\.25/, "不得再写峰值在 +0.25");
  assert.doesNotMatch(text, /正好是 y 相对 x 的延迟/, "不得再写“正好是延迟”这类反向解释");
  assert.doesNotMatch(text, /τ=0\.25\+kT/, "峰值位置不得再写成 +0.25+kT");

  /* 功率相关仍是前提 */
  assert.match(text, /功率相关|时间平均/, "周期信号必须改用时间平均的功率相关");
  assert.match(text, /换下标|R_yx/, "必须说明换下标的关系");

  /* 白噪声：区分互相关期望与样本残差 */
  assert.match(text, /期望/, "噪声与被测信号的相关必须写成“期望在所有时延处为零”");
  assert.match(text, /残差/, "必须说明有限数据估计存在残差");
  assert.match(text, /所有时延/, "必须点明是“所有时延处”而不是“τ≠0 处”");
  assert.doesNotMatch(text, /τ≠0 处取值接近 0/, "不得再用“τ≠0 时接近零”概括噪声互相关");
});

test("正文一致：吉布斯必须写成不一致收敛 + 渐近 8.95%，不得断言有限项小于极限", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch1");
  const text = sectionText(sectionOf(chapter, "signals-ch1-advanced"));

  assert.match(text, /不一致收敛/, "必须写成“不一致收敛现象”");
  assert.match(text, /逐点收敛/, "必须说明这不否定逐点收敛");
  assert.match(text, /8\.95/, "必须给出渐近值 8.95%");
  assert.match(text, /最高奇次谐波/, "必须明确 N 是最高奇次谐波，不是项数");
  assert.match(text, /不能一概断言/, "必须写明有限项的值要具体计算");
  assert.match(text, /13\.66/, "必须给出 N=1 的实测过冲 13.66%");

  assert.doesNotMatch(text, /略小于/, "不得再写“略小于”");
  assert.doesNotMatch(text, /均小于该极限|都小于该极限/, "不得一概断言有限项小于该极限");
  assert.doesNotMatch(text, /与项数无关/, "不得写成“与项数无关”");
  assert.doesNotMatch(text, /收敛”最直观的反例|收敛的反例/, "不得再写成“收敛的反例”");
});

test("正文一致：绝对可积必须写成充分条件，且稳定性表述要带前提", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch1");
  const laplace = sectionText(sectionOf(chapter, "signals-ch1-laplace"));

  assert.match(laplace, /充分条件/, "绝对可积是充分条件，必须写明");
  assert.match(laplace, /广义函数|冲激谱/, "应点明非绝对可积信号可用广义函数处理");
  assert.match(laplace, /因果/, "稳定性判据必须带“因果系统”前提");
  assert.doesNotMatch(laplace, /傅里叶变换要求信号绝对可积/, "不得再写成“要求绝对可积”");
});

/* ================= ③ 公式卡 ================= */

test("公式卡：四个小节已补卡且变量说明齐全，混合运算不强行补卡", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch1");
  const withCard = ["signals-ch1-time-basic", "signals-ch1-time-singular", "signals-ch1-time-ops", "signals-ch1-time-decomposition"];

  for (const id of withCard) {
    const section = sectionOf(chapter, id);
    assert.ok(section.formula, `${id} 应有 formula`);
    assert.ok((section.variables ?? []).length >= 4, `${id} 的变量说明应至少 4 条`);
  }

  const composite = sectionOf(chapter, "signals-ch1-time-composite");
  assert.equal(composite.formula, undefined, "混合运算以流程为主，不补公式卡");

  /* 尺度条件与积分限必须写明 */
  assert.match(sectionOf(chapter, "signals-ch1-time-singular").formula, /a\\neq 0/, "δ(at) 必须写明 a≠0");
  assert.match(sectionOf(chapter, "signals-ch1-time-ops").formula, /a\\neq 0/, "x(at−b) 必须写明 a≠0");
  assert.match(sectionOf(chapter, "signals-ch1-time-decomposition").formula, /\\int_\{-\\infty\}\^\{t\}h/, "阶跃响应必须带积分限");
});
