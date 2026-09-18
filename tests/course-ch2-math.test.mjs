/* 第二章数学一致性测试（2026-09-16 纠错轮）。
   要求：用与正文实现无关的独立数值方法复算，再把复算结论与正文表述绑定；
   不用字数或关键词命中代替数学正确性。 */
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

function sectionText(chapter, id) {
  const section = chapter.sections.find((item) => item.id === id);
  assert.ok(section, `找不到小节 ${id}`);
  return plainMath([
    section.title,
    section.content,
    ...(section.detail ?? []),
    ...(section.points ?? []),
    ...(section.pitfalls ?? []),
    ].join("\n"))
    + "\n" + (section.formula ?? "")
    + "\n" + (section.variables ?? []).join("\n");
}

const chapterText = (chapter) => plainMath([
  chapter.sections.map((section) => sectionText(chapter, section.id)).join("\n"),
  chapter.examples.map((item) => [item.prompt, ...item.steps, item.answer].join("\n")).join("\n"),
  chapter.check.map((item) => [item.prompt, ...item.options, item.explanation].join("\n")).join("\n"),
].join("\n"));

/* ---------- 独立数值工具（不复用正文里的任何实现） ---------- */

/** 直接按定义算 DFT（O(N²)，不使用 fft） */
function dft(x) {
  const N = x.length;
  const out = [];
  for (let k = 0; k < N; k += 1) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n += 1) {
      const angle = (-2 * Math.PI * k * n) / N;
      re += x[n] * Math.cos(angle);
      im += x[n] * Math.sin(angle);
    }
    out.push([re, im]);
  }
  return out;
}

function idft(X) {
  const N = X.length;
  const out = [];
  for (let n = 0; n < N; n += 1) {
    let sum = 0;
    for (let k = 0; k < N; k += 1) {
      const angle = (2 * Math.PI * k * n) / N;
      sum += X[k][0] * Math.cos(angle) - X[k][1] * Math.sin(angle);
    }
    out.push(sum / N);
  }
  return out;
}

/** 直接按定义算循环卷积 */
function circularConvolution(x, h, N) {
  const y = new Array(N).fill(0);
  x.forEach((a, i) => h.forEach((b, j) => { y[(i + j) % N] += a * b; }));
  return y;
}

/** 直接按定义算线性卷积 */
function linearConvolution(x, h) {
  const y = new Array(x.length + h.length - 1).fill(0);
  x.forEach((a, i) => h.forEach((b, j) => { y[i + j] += a * b; }));
  return y;
}

const closeTo = (a, b, tol = 1e-10) => Math.abs(a - b) <= tol;

/* ================= 一、独立复算 ================= */

test("采样临界点：fs=2fmax 时 sin(2πfmax t) 的样点全零，与零信号不可区分", () => {
  const samples = Array.from({ length: 32 }, (_, n) => Math.abs(Math.sin(Math.PI * n)));
  assert.ok(Math.max(...samples) < 1e-12, `等号处样点应全零，实测最大 ${Math.max(...samples)}`);
  /* 反面对照：fs 略大于 2fmax 时不再全零 */
  const fs = 2.02;
  const nonZero = Array.from({ length: 32 }, (_, n) => Math.abs(Math.sin((Math.PI * fs * n) / 2)));
  assert.ok(Math.max(...nonZero) > 0.5, "fs>2fmax 时应能取到非零样点");
});

test("频域取样的时域后果是周期求和，不是截断", () => {
  const x = [1, 2, 3, 4];
  const wrapped = new Array(2).fill(0);
  x.forEach((v, n) => { wrapped[n % 2] += v; });
  assert.deepEqual(wrapped, [4, 6]);
  assert.notDeepEqual(wrapped, [1, 2]);   // 截断会得到前两点
});

test("补零后与原网格重合的频点：L=300 补到 1024 只有 4 对", () => {
  const common = [];
  for (let k = 0; k < 300; k += 1) if ((k * 1024) % 300 === 0) common.push([k, (k * 1024) / 300]);
  assert.deepEqual(common, [[0, 0], [75, 256], [150, 512], [225, 768]]);
  /* 整数倍关系（L=256 → 1024）才全部重合 */
  const allCommon = [];
  for (let k = 0; k < 256; k += 1) if ((k * 1024) % 256 === 0) allCommon.push(k);
  assert.equal(allCommon.length, 256, "256 整除 1024 时原频点应全部落在新网格上");
});

test("卷积三方交叉验证：直接线性卷积 / 直接循环卷积 / DFT-频域相乘", () => {
  const x = [1, 1, 1, 1];
  const h = [1, 1];

  const linear = linearConvolution(x, h);
  assert.deepEqual(linear, [1, 2, 2, 2, 1]);

  assert.deepEqual(circularConvolution(x, h, 4), [2, 2, 2, 2]);

  /* 补零到 8：前 5 点等于线性卷积，后 3 点近零 */
  const x8 = [...x, 0, 0, 0, 0];
  const h8 = [...h, 0, 0, 0, 0, 0, 0];
  const X8 = dft(x8);
  const H8 = dft(h8);
  const Y8 = X8.map((value, k) => [
    value[0] * H8[k][0] - value[1] * H8[k][1],
    value[0] * H8[k][1] + value[1] * H8[k][0],
  ]);
  const got = idft(Y8);
  for (let i = 0; i < linear.length; i += 1) assert.ok(closeTo(got[i], linear[i]), `第 ${i} 点应为 ${linear[i]}，实测 ${got[i]}`);
  for (let i = linear.length; i < got.length; i += 1) assert.ok(closeTo(got[i], 0), `尾部第 ${i} 点应近零，实测 ${got[i]}`);
  /* 4 点频域相乘得到的是循环卷积，与线性结果不同 */
  const X4 = dft(x);
  const H4 = dft([...h, 0, 0]);
  const Y4 = idft(X4.map((value, k) => [
    value[0] * H4[k][0] - value[1] * H4[k][1],
    value[0] * H4[k][1] + value[1] * H4[k][0],
  ]));
  assert.ok(closeTo(Y4[0], 2) && closeTo(Y4[3], 2), "4 点频域相乘应给出循环卷积 [2,2,2,2]");
});

test("单边幅度谱：偶数 N 的直流与奈奎斯特不翻倍，奇数 N 无奈奎斯特端点", () => {
  const mag = (x) => dft(x).map(([re, im]) => Math.hypot(re, im) / x.length);

  const ones8 = mag(new Array(8).fill(1));
  assert.ok(closeTo(ones8[0], 1), "全 1 序列的直流分量应为 1（不翻倍）");
  assert.ok(ones8.slice(1).every((value) => closeTo(value, 0)), "全 1 其余分量为 0");

  const alt8 = mag(Array.from({ length: 8 }, (_, n) => (n % 2 === 0 ? 1 : -1)));
  assert.ok(closeTo(alt8[4], 1), "(-1)\^n 的奈奎斯特分量应为 1（不翻倍）");
  assert.ok(alt8.slice(0, 4).every((value) => closeTo(value, 0)));

  const ones7 = mag(new Array(7).fill(1));
  assert.ok(closeTo(ones7[0], 1), "奇数 N 的直流分量同样不翻倍");
});

test("连续→离散变换的反例：s=ln(z)/T 代入原拉普拉斯式不等于 Z 变换", () => {
  const T = 0.3;
  const z = 1.4;
  const viaSubstitution = 1 / (Math.log(z) / T + 1);   // 把 s=ln(z)/T 代入 1/(s+1)
  const zTransform = 1 / (1 - Math.exp(-T) / z);        // 序列 e^{-nT}u[n] 的真实 Z 变换
  assert.ok(!closeTo(viaSubstitution, zTransform, 1e-6), "两种结果不应相等（代入法不成立）");
  /* 单位圆上确实对应 DTFT：z=e^{jω} 时闭式与序列求和一致（手工复数运算，不依赖复数库） */
  const omega = 0.7;
  let sumRe = 0;
  let sumIm = 0;
  for (let n = 0; n < 4000; n += 1) {
    const a = Math.exp(-n * T);
    sumRe += a * Math.cos(-omega * n);
    sumIm += a * Math.sin(-omega * n);
  }
  const denomRe = 1 - Math.exp(-T) * Math.cos(-omega);
  const denomIm = -Math.exp(-T) * Math.sin(-omega);
  const norm = denomRe * denomRe + denomIm * denomIm;
  const expectRe = denomRe / norm;
  const expectIm = -denomIm / norm;
  assert.ok(Math.hypot(sumRe - expectRe, sumIm - expectIm) < 1e-6, "单位圆取值应等于序列求和的极限");
});

/* ================= 二、正文与复算一致 ================= */

test("正文一致：采样定理必须写成严格不等式，并给出等号反例", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch2");
  const text = sectionText(chapter, "signals-ch2-sampling-time");

  assert.match(text, /f_s>2f_\{?\\?max\}?/, "公式必须是严格不等式 f_s>2f_max");
  assert.match(text, /sin\(2πf_\{?\\?\{?max\}?\}?\s*t\)/, "必须给出等号处的反例信号");
  assert.match(text, /sin\(πn\)/, "必须写出反例的样点形式 sin(πn)");
  assert.match(text, /符号相反/, "必须说明 99/101 Hz 的正弦样点符号相反（余弦相同）");
  assert.doesNotMatch(text, /f_s[≥>=]+2f_max[，。；]?\s*时.*唯一重建/, "不得写成 fs≥2fmax 即可唯一恢复");
  assert.doesNotMatch(text, /都呈现为 1 Hz/, "不得把余弦结论套到正弦上");
});

test("正文一致：重建滤波器截止不唯一；抽取可逆性有条件", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch2");

  const check2 = chapter.check.find((item) => item.id === "signals-ch2-check-2");
  assert.ok(check2, "找不到 check-2");
  /* 正确项必须是"区间"说法；fs/2 只能作为干扰项出现 */
  const correct2 = check2.options[check2.answer];
  assert.match(correct2, /B 与 fs−B 之间|B<fc<fs−B/, `check-2 的正确项应给出截止频率的可行区间，实际是「${correct2}」`);
  assert.match(check2.explanation, /不是唯一|不唯一/, "解析必须点明 fs/2 不是唯一选择");
  assert.ok(
    check2.options.some((option) => option !== correct2 && /只能.*fs\/2/.test(option)),
    "把“只能是 fs/2”保留为干扰项，用于检验这一误解",
  );

  const check9 = chapter.check.find((item) => item.id === "signals-ch2-check-9");
  assert.ok(check9, "找不到 check-9");
  assert.match(check9.options.join(" "), /限带|可插值重建/, "check-9 必须给出可逆的附加条件");
  assert.doesNotMatch(check9.options.join(" "), /抽取，会丢样点且不可逆/, "不得把抽取写成无条件不可逆");

  const ops = sectionText(chapter, "signals-ch2-discrete-time");
  assert.match(ops, /反折/, "必须区分反折与抽取");
  assert.match(ops, /插零|插值滤波/, "插零与插值必须分开写");
  assert.doesNotMatch(ops, /没有分段函数/, "不得否认离散卷积可以分段表达");
});

test("正文一致：频域取样不得写成“截断误差”；网格与分辨能力必须分开", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch2");
  const freq = sectionText(chapter, "signals-ch2-sampling-freq");
  assert.match(freq, /周期求和|x_N\[n\]=Σ_r/, "必须给出周期求和式");
  assert.doesNotMatch(freq, /截断误差的另一种说法/, "不得把周期求和说成截断误差");

  const dftText = sectionText(chapter, "signals-ch2-dft") + sectionText(chapter, "signals-ch2-fft-apps");
  assert.match(dftText, /网格间距/, "必须区分网格间距与分辨能力");
  assert.match(dftText, /记录时长|T_rec/, "分辨能力必须归到记录时长");

  const check18 = chapter.check.find((item) => item.id === "signals-ch2-check-18");
  assert.match(check18.options.join(" "), /记录时长/, "check-18 的正确项应是记录时长");
  assert.doesNotMatch(check18.explanation, /Δf=1\/T/, "不得再把 Δf=1/T 当作分辨能力");
});

test("正文一致：补零只在与原网格重合处保留原值", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch2");
  const text = sectionText(chapter, "signals-ch2-fft-radix2") + sectionText(chapter, "signals-ch2-matlab-fft")
    + chapter.examples.map((item) => [item.steps.join(" "), item.answer].join(" ")).join(" ");
  assert.match(text, /75、150、225|75, 150, 225/, "必须给出 300→1024 的重合频点");
  assert.doesNotMatch(text, /原有频点上一致，中间频点是插值/, "不得声称原频点全部保留");
  assert.doesNotMatch(text, /原 256 个频点上的值完全不变/, "256→1024 也应说明是整数倍关系下成立");
});

test("正文一致：MATLAB 知识修正（ztrans 存在、1j 而非 j 未定义、fft 不限基2）", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch2");
  const text = chapterText(chapter);

  assert.match(text, /ztrans/, "必须提到 Symbolic Math Toolbox 的 ztrans");
  assert.match(text, /单边/, "必须说明 ztrans 是单边定义");
  assert.doesNotMatch(text, /没有符号化的 Z 变换/, "不得再声称 MATLAB 没有符号 Z 变换");
  assert.doesNotMatch(text, /j 未定义/, "不得说 j 未定义（它是内置虚数单位，会被覆盖）");
  assert.match(text, /1j/, "应建议使用 1j");
  assert.match(text, /不要求 N 是 2 的幂|不限基2|不要求 N 为 2 的幂/, "必须说明 fft 不限基2");
  assert.doesNotMatch(text, /耗时比值应接近 N\/log₂N/, "不得把耗时比等同于运算量比");
  assert.match(text, /fft\(x,8\)/, "卷积示例应统一写成 fft(x,8) 与 fft(h,8)");
});

test("正文一致：z 与 s 的关系不得写成原连续变换的变量替换", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch2");
  const text = sectionText(chapter, "signals-ch2-z-relations");

  assert.match(text, /采样冲激串/, "必须说明 z=e\^{sT} 联系的是采样冲激串的拉普拉斯变换");
  assert.match(text, /1\/\(1−e\^\{?−T\}?z\^\{?−1\}?\)/, "应给出反例中的 Z 变换");
  assert.match(text, /不能由任何有限的 s 到达|不取 z=0/, "必须说明 z=0 不由有限 s 到达");
  assert.doesNotMatch(text, /讨论稳定性时要指明落在哪条横带/, "稳定性判断不依赖选择横带");
  assert.doesNotMatch(text, /DTFT 存在 ⟺/, "ROC 含单位圆只是充分条件");
  assert.match(text, /充分条件/, "必须写成充分条件");
});
