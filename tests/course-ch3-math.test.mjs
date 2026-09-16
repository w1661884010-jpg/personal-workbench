/* 第三章「信号处理基础」数学一致性测试（2026-09-16）。
   要求：递推 / 卷积 / 解析三条路径互相独立、彼此印证；
   数值结论与正文表述绑定，不测与正文无关的硬编码公式。 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

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

function sectionText(chapter, id) {
  const section = chapter.sections.find((item) => item.id === id);
  assert.ok(section, `找不到小节 ${id}`);
  return [
    section.title, section.content, ...(section.detail ?? []),
    ...(section.points ?? []), ...(section.pitfalls ?? []),
    section.formula ?? "", ...(section.variables ?? []),
  ].join("\n");
}

/* ---------- 独立数值工具 ---------- */

/** 按差分方程 y[n]=x[n]+0.5y[n-1] 直接递推（可带初值 y[-1]） */
function recurse(x, yMinus1) {
  const y = [];
  let prev = yMinus1;
  for (let n = 0; n < x.length; n += 1) {
    prev = x[n] + 0.5 * prev;
    y.push(prev);
  }
  return y;
}

/** 直接按定义做线性卷积 */
function conv(x, h) {
  const y = new Array(x.length + h.length - 1).fill(0);
  x.forEach((a, i) => h.forEach((b, j) => { y[i + j] += a * b; }));
  return y;
}

/** 直接算频率响应 H(z)=1/(1-0.5 z^-1) 在 z=e^{jw} 处的复值 */
function freqResp(omega) {
  const re = 1 - 0.5 * Math.cos(-omega);
  const im = -0.5 * Math.sin(-omega);
  const norm = re * re + im * im;
  return { re: re / norm, im: -im / norm, mag: 1 / Math.hypot(re, im) };
}

const closeTo = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;

/* ================= 一、独立复算 ================= */

test("递推 / 卷积 / 解析式三方一致（y[n]=x[n]+0.5y[n−1]，单位阶跃，零状态）", () => {
  const N = 20;
  const x = new Array(N).fill(1);                       // 单位阶跃的前 N 点

  const byRecursion = recurse(x, 0);
  const h = Array.from({ length: N }, (_, n) => Math.pow(0.5, n));
  const byConvolution = conv(x, h).slice(0, N);
  const byClosedForm = Array.from({ length: N }, (_, n) => 2 * (1 - Math.pow(0.5, n + 1)));

  for (let n = 0; n < N; n += 1) {
    assert.ok(closeTo(byRecursion[n], byClosedForm[n]), `递推与解析在 n=${n} 不一致：${byRecursion[n]} vs ${byClosedForm[n]}`);
    assert.ok(closeTo(byConvolution[n], byClosedForm[n]), `卷积与解析在 n=${n} 不一致：${byConvolution[n]} vs ${byClosedForm[n]}`);
  }
  assert.ok(closeTo(byRecursion[0], 1) && closeTo(byRecursion[3], 1.875), "前几项应为 1、1.5、1.75、1.875");
  assert.ok(byClosedForm[N - 1] > 1.999 && byClosedForm[N - 1] < 2, "第 20 点应已非常接近稳态 2");
});

test("非零初值分解：零输入 0.5^(n+1)，全响应 = 零状态 + 零输入", () => {
  const N = 10;
  const x = new Array(N).fill(1);                        // 单位阶跃
  const zeroState = recurse(x, 0);
  const withInitial = recurse(x, 1);                     // y[-1] = 1
  const zeroInput = Array.from({ length: N }, (_, n) => Math.pow(0.5, n + 1));

  for (let n = 0; n < N; n += 1) {
    assert.ok(closeTo(withInitial[n] - zeroState[n], zeroInput[n]),
      `n=${n} 处差值应为零输入分量 ${zeroInput[n]}，实测 ${withInitial[n] - zeroState[n]}`);
  }
  /* 解析式：全响应 = 2(1−0.5^(n+1)) + 0.5^(n+1) = 2 − 0.5^(n+1) */
  for (let n = 0; n < N; n += 1) {
    assert.ok(closeTo(withInitial[n], 2 - Math.pow(0.5, n + 1)), `n=${n} 全响应解析式应为 2−0.5^(n+1)，实测 ${withInitial[n]}`);
  }
  /* 零输入递推：不加输入、仅靠初值，输出按 0.5^(n+1) 衰减 */
  const pure = recurse(new Array(N).fill(0), 1);
  for (let n = 0; n < N; n += 1) assert.ok(closeTo(pure[n], zeroInput[n]), `零输入响应 n=${n} 不符`);
});

test("逆系统反例：H(z)=1−2z^{−1} 的因果逆按 2^n 发散", () => {
  /* 原系统是 FIR：h=[1,-2]，绝对和有限 ⇒ BIBO 稳定 */
  const h = [1, -2];
  assert.ok(h.reduce((sum, value) => sum + Math.abs(value), 0) === 3, "原系统冲激响应绝对和为 3，有限");

  /* 因果逆 y[n]=x[n]+2y[n-1]：有界输入下无界 */
  let value = 0;
  for (let n = 0; n < 40; n += 1) value = 1 + 2 * value;
  assert.ok(value > 1e11, `因果逆在第 40 点应已发散，实测 ${value}`);
  assert.ok(closeTo(value, Math.pow(2, 40) - 1, 1), "递推结果应等于 2^40−1");
});

test("量化误差界：无溢出时 |Q(x)−x| ≤ Δ/2（确定性界，逐点成立）", () => {
  const delta = 0.1;
  const quantize = (x) => delta * Math.round(x / delta);
  let worst = 0;
  /* 覆盖整数量化级、半级与随机点，避免只测“好看”的样本 */
  const samples = [];
  for (let i = -200; i <= 200; i += 1) samples.push(i * delta, i * delta + delta / 2, i * delta + delta / 3);
  for (let i = 0; i < 5000; i += 1) samples.push((Math.random() - 0.5) * 40);
  for (const x of samples) worst = Math.max(worst, Math.abs(quantize(x) - x));
  assert.ok(worst <= delta / 2 + 1e-12, `误差上界应不超过 Δ/2，实测 ${worst}`);
  /* 界是可以取到的：半级点处误差恰为 Δ/2 */
  assert.ok(closeTo(Math.abs(quantize(delta / 2) - delta / 2), delta / 2, 1e-12), "半级点处误差应恰为 Δ/2");
});

test("直流增益与阶跃稳态值一致：H(1)=2", () => {
  assert.ok(closeTo(freqResp(0).mag, 2, 1e-12), `H(1) 应为 2，实测 ${freqResp(0).mag}`);
  assert.ok(closeTo(freqResp(Math.PI).mag, 1 / 1.5, 1e-12), `H(-1) 应为 2/3，实测 ${freqResp(Math.PI).mag}`);
  /* 与时域稳态值 2 自洽 */
  const steady = recurse(new Array(200).fill(1), 0).pop();
  assert.ok(Math.abs(steady - freqResp(0).mag) < 1e-9, "时域稳态值应与 H(1) 一致");
});

/* ================= 二、正文与复算一致 ================= */

test("正文一致：两个反例必须齐全，且不得由线性推出稳定", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch3");
  const text = sectionText(chapter, "signals-ch3-properties");

  assert.match(text, /y\[n\]=n·x\[n\]/, "必须给出 y=n·x 反例");
  assert.match(text, /时变/, "y=n·x 必须指出时变");
  assert.match(text, /无界/, "y=n·x 的不稳定必须用“无界”说明");
  assert.match(text, /\(x\[n\]\)²/, "必须给出 y=x² 反例");
  assert.match(text, /非线性/, "y=x² 必须指出非线性");
  assert.doesNotMatch(text, /线性[^。；]{0,12}(所以|因此|故)[^。；]{0,12}稳定/, "不得由线性推出稳定");
  assert.match(text, /彼此不能互推|逐项检验/, "必须点明性质之间不能互推");
  assert.match(text, /Σ\|h\[n\]\|<∞|Σ\|h\[n\]\|/, "必须给出 LTI 的 BIBO 判据");
});

test("正文一致：零输入/零状态必须分离，Y=HX 有无条件前提", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch3");
  const time = sectionText(chapter, "signals-ch3-time");
  const freq = sectionText(chapter, "signals-ch3-frequency");

  assert.match(time, /零输入/, "必须出现零输入响应");
  assert.match(time, /2\(1−0\.5\^\(n\+1\)\)/, "必须给出阶跃响应解析式");
  assert.match(time, /0\.5\^\(n\+1\)/, "必须给出 y[−1]=1 时的零输入分量");
  assert.match(freq, /零状态/, "频域法必须声明零状态前提");
  assert.match(freq, /Y=HX 只在零状态下|零状态下无条件/, "必须点明 Y=HX 的前提");
});

test("正文一致：逆滤波反例与“能除不等于可实现”", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch3");
  const text = sectionText(chapter, "signals-ch3-inverse");

  assert.match(text, /1−2z\^\{−1\}/, "必须给出 H=1−2z^{−1}");
  assert.match(text, /z=2/, "必须指出极点在 z=2");
  assert.match(text, /不稳定/, "必须指出因果逆不稳定");
  assert.match(text, /不代表逆系统可实现|不保证逆系统可稳定实现/, "必须点明“处处非零”不等于可实现");
});

test("正文一致：有限字长的界与 Δ²/12 的条件", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch3");
  const text = sectionText(chapter, "signals-ch3-finite-word");

  assert.match(text, /Q\(x\)=Δ·round\(x\/Δ\)|Δ·round/, "必须给出舍入量化模型");
  assert.match(text, /Δ\/2/, "必须给出 |Q−x|≤Δ/2");
  assert.match(text, /Δ²\/12/, "必须提到 Δ²/12");
  assert.match(text, /额外前提|假设/, "Δ²/12 必须写明成立假设");
  assert.match(text, /不相关/, "必须列出误差不相关这一条假设");
  /* 正文的警示语本身会提到错误说法，因此这里禁止的是“把它当结论断言”的写法 */
  assert.doesNotMatch(text, /量化噪声功率恒为|噪声功率就是 Δ²\/12/, "不得把 Δ²/12 写成无条件的结论");
});

test("正文一致：MATLAB 小节的 zi 与“前 20 点”措辞", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch3");
  const text = sectionText(chapter, "signals-ch3-matlab-time");
  const chapterAll = chapter.sections.map((section) => sectionText(chapter, section.id)).join("\n");

  assert.match(text, /filtic/, "必须说明 zi 与方程初值需用 filtic 换算");
  assert.match(text, /内部状态/, "必须说明 zi 是内部状态");
  assert.doesNotMatch(chapterAll, /长度 20 的单位阶跃/, "演练/正文不得再写“长度 20 的单位阶跃”");
  assert.match(text, /前 20 点/, "应改成“观察单位阶跃输入的前 20 点”");
  assert.match(text, /衰减到 0|不会停在 2/, "必须说明 20 点矩形停输入后输出会衰减");
});

test("正弦稳态相位：递推拟合与解析式必须同时给出 −0.4636", () => {
  /* y[n]=x[n]+0.5y[n−1]，x[n]=cos(0.5πn)：独立拟合递推结果的稳态正弦 */
  const omega = 0.5 * Math.PI;
  const y = [];
  let state = 0;
  for (let n = 0; n < 60; n += 1) {
    state = Math.cos(omega * n) + 0.5 * state;
    y.push(state);
  }
  let saa = 0;
  let sab = 0;
  let sbb = 0;
  let say = 0;
  let sby = 0;
  for (let n = 30; n < 60; n += 1) {
    const c = Math.cos(omega * n);
    const s = Math.sin(omega * n);
    saa += c * c; sab += c * s; sbb += s * s; say += c * y[n]; sby += s * y[n];
  }
  const det = saa * sbb - sab * sab;
  const a = (say * sbb - sby * sab) / det;
  const b = (saa * sby - sab * say) / det;
  const amplitude = Math.hypot(a, b);
  const phase = Math.atan2(-b, a);

  assert.ok(Math.abs(amplitude - 0.894427) < 1e-5, `幅度应为 0.894427，实测 ${amplitude.toFixed(6)}`);
  assert.ok(Math.abs(phase + 0.463648) < 1e-5, `相位应为 −0.463648 rad，实测 ${phase.toFixed(6)}`);

  /* 解析式：H(e^{jπ/2})=1/(1+0.5j)=0.8−0.4j */
  assert.ok(Math.abs(Math.atan2(-0.4, 0.8) - phase) < 1e-9, "解析相位应与递推拟合一致");

  /* 逐点反证：正相位写法在 n=41 处给 −0.4，与递推的 +0.4 不符 */
  const positive = amplitude * Math.cos(omega * 41 + 0.463648);
  const negative = amplitude * Math.cos(omega * 41 - 0.463648);
  assert.ok(Math.abs(y[41] - negative) < 1e-4, `n=41 处递推 ${y[41].toFixed(4)} 应等于负相位写法 ${negative.toFixed(4)}`);
  assert.ok(Math.abs(y[41] - positive) > 0.5, `n=41 处不应等于正相位写法 ${positive.toFixed(4)}`);
});

test("正文一致：例题 4 的相位与代入必须写对", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch3");
  const example = chapter.examples.find((item) => item.title.includes("频率响应"));
  assert.ok(example, "找不到频率响应例题");
  const text = [example.prompt, ...example.steps, example.answer].join("\n");
  assert.match(text, /−0\.4636/, "相位必须写成 −0.4636");
  assert.doesNotMatch(text, /\+0\.4636/, "不得写成 +0.4636");
  assert.match(text, /1\+0\.5j/, "代入必须写成 1/(1+0.5j)（因为 z^{−1}=−j）");
});

test("正文一致：稳定系统的零输入分量不得被说成造成稳态偏差", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch3");
  const example = chapter.examples.find((item) => item.title.includes("直流增益"));
  assert.ok(example, "找不到直流增益校验例题");
  const text = [example.prompt, ...example.steps, example.answer].join("\n");
  assert.doesNotMatch(text, /零输入分量[^。]{0,20}抬高/, "不得把稳态偏差归因于零输入分量");
  assert.match(text, /衰减到 0|未到稳态/, "应说明零输入分量衰减到 0、问题在记录未到稳态");
});

test("正文一致：第三章五节 15 个小节与教材子目一一对应", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch3");
  const groups = [...new Set(chapter.sections.map((section) => section.group))];
  assert.deepEqual(groups, [
    "第一节 系统及其性质",
    "第二节 信号的线性系统处理",
    "第三节 解卷积（逆滤波与系统辨识）",
    "第四节 数字信号处理技术",
    "第五节 应用MATLAB的信号处理",
  ], "五节名称必须与教材目录一致");
  assert.equal(chapter.sections.length, 15, "15 个小节对应教材 15 个子目");
  /* 可选（选择学习）的小节：同态解卷积 + 第五节全部 4 个 MATLAB 小节。
     注意 courses.js 在 vm 上下文里求值，数组原型与宿主不同，需先转成宿主数组再严格比较。 */
  const optional = Array.from(chapter.sections.filter((section) => section.importance === "optional"), (section) => section.id).sort();
  assert.deepEqual(optional, [
    "signals-ch3-homomorphic",
    "signals-ch3-matlab-complex",
    "signals-ch3-matlab-frequency",
    "signals-ch3-matlab-identification",
    "signals-ch3-matlab-time",
  ], "可选小节的集合应符合规划");
});
