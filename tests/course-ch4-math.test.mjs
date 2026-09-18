/* 第四章「滤波器」数学一致性测试（2026-09-16）。
   独立复算巴特沃思截止点与阶数、切比雪夫纹波、双线性预畸变、FIR 群延迟与移动平均幅频；
   数值结论与正文表述绑定，不用关键词命中代替数学正确性。 */
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
    section.title, section.content, ...(section.detail ?? []),
    ...(section.points ?? []), ...(section.pitfalls ?? []),
    ].join("\n"))
    + "\n" + (section.formula ?? "")
    + "\n" + (section.variables ?? []).join("\n");
}

/* ---------- 独立数值工具 ---------- */

const dB = (mag) => 20 * Math.log10(mag);

/** 巴特沃思幅频 */
const butterMag = (omega, omegaC, N) => 1 / Math.sqrt(1 + Math.pow(omega / omegaC, 2 * N));

/** N 阶切比雪夫多项式 */
function chebT(x, N) {
  return Math.abs(x) <= 1 ? Math.cos(N * Math.acos(x)) : Math.cosh(N * Math.acosh(x));
}

/** 切比雪夫 I 型幅频 */
const chebMag = (omega, omegaC, N, eps) => 1 / Math.sqrt(1 + eps * eps * Math.pow(chebT(omega / omegaC, N), 2));

const closeTo = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;

/* ================= 一、独立复算 ================= */

test("巴特沃思：Ω=Ωc 处恒为 −3.0103 dB（与阶数无关），且在通带内单调下降", () => {
  for (const N of [1, 2, 4, 8]) {
    const mag = butterMag(1, 1, N);
    assert.ok(closeTo(mag, 1 / Math.SQRT2, 1e-12), `N=${N} 在 Ωc 处 |H| 应为 1/√2，实测 ${mag}`);
    assert.ok(closeTo(dB(mag), -3.0103, 1e-4), `N=${N} 在 Ωc 处应为 −3.0103 dB，实测 ${dB(mag).toFixed(4)}`);
  }
  /* 单调性：Ω 增大则 |H| 不增 */
  for (const N of [2, 5, 8]) {
    let prev = Infinity;
    for (let i = 1; i <= 200; i += 1) {
      const mag = butterMag(i / 20, 1, N);
      assert.ok(mag <= prev + 1e-15, `N=${N} 在 Ω=${i / 20} 处不单调`);
      prev = mag;
    }
  }
});

test("巴特沃思阶数公式：Ap=1 dB、As=40 dB、Ωs/Ωp=2 → N≥7.6185 取 8，校验 42.297 dB", () => {
  const Ap = 1;
  const As = 40;
  const ratio = 2;
  const required = Math.log10((Math.pow(10, As / 10) - 1) / (Math.pow(10, Ap / 10) - 1)) / (2 * Math.log10(ratio));
  assert.ok(closeTo(required, 7.6185, 1e-3), `阶数下界应为 7.6185，实测 ${required.toFixed(4)}`);
  const N = Math.ceil(required);
  assert.equal(N, 8, "取不小于下界的最小整数应为 8");

  /* 代回校验：Ωc 不是 Ωp，而是由「Ωp 处衰减恰为 Ap」确定 */
  const omegaC = Math.pow(1 / (Math.pow(10, Ap / 10) - 1), 1 / (2 * N));
  const atPass = -dB(butterMag(1, omegaC, N));
  assert.ok(closeTo(atPass, Ap, 1e-9), `通带边界衰减应恰为 Ap=${Ap} dB，实测 ${atPass.toFixed(6)}`);
  const atStop = -dB(butterMag(ratio, omegaC, N));
  assert.ok(closeTo(atStop, 42.297, 1e-2), `N=8 在 Ωs 处衰减应为 42.297 dB，实测 ${atStop.toFixed(3)}`);
  assert.ok(atStop >= As, "阻带衰减必须满足 ≥40 dB");
  assert.ok(omegaC > 1, `Ap=1 dB < 3.0103 dB 时 Ωc 应略大于 Ωp，实测 Ωc=${omegaC.toFixed(4)}`);
});

test("切比雪夫：ε=√(10^{Ap/10}−1)，Ωc 处恰为 −Ap dB，通带内等波纹于 [1/√(1+ε²), 1]", () => {
  const Ap = 1;
  const eps = Math.sqrt(Math.pow(10, Ap / 10) - 1);
  assert.ok(closeTo(eps, 0.5088, 1e-4), `Ap=1 dB 时 ε 应为 0.5088，实测 ${eps.toFixed(4)}`);

  const N = 5;
  assert.ok(closeTo(dB(chebMag(1, 1, N, eps)), -Ap, 1e-9), `Ωc 处应为 −${Ap} dB`);

  /* 通带内起伏范围 */
  let max = 0;
  let min = 1;
  for (let i = 0; i <= 2000; i += 1) {
    const mag = chebMag(i / 2000, 1, N, eps);
    max = Math.max(max, mag);
    min = Math.min(min, mag);
  }
  assert.ok(closeTo(max, 1, 1e-9), `通带峰值应为 1，实测 ${max.toFixed(6)}`);
  assert.ok(closeTo(min, 1 / Math.sqrt(1 + eps * eps), 1e-3), `通带谷值应为 1/√(1+ε^2)=0.8913，实测 ${min.toFixed(4)}`);

  /* 等波纹：通带内 |H| 必须非单调。T_5 在 [0,1] 上有 3 个零点
     （arccos x = 0.1π/0.3π/0.5π），对应 3 个 |H|=1 的峰，峰间有 2 次起伏。 */
  let rises = 0;
  let prev = chebMag(0, 1, N, eps);
  let falling = false;
  for (let i = 1; i <= 4000; i += 1) {
    const value = chebMag(i / 4000, 1, N, eps);
    if (value < prev - 1e-12) falling = true;
    if (falling && value > prev + 1e-12) { rises += 1; falling = false; }
    prev = value;
  }
  assert.ok(rises >= 2, `N=5 通带内应有 2 次起伏（实测 ${rises} 次）——这是与巴特沃思单调性的关键区别`);
  /* 对照：巴特沃思在同一区间严格单调，起伏次数为 0 */
  let butterRises = 0;
  let butterPrev = butterMag(0, 1, N);
  let butterFalling = false;
  for (let i = 1; i <= 4000; i += 1) {
    const value = butterMag(i / 4000, 1, N);
    if (value < butterPrev - 1e-12) butterFalling = true;
    if (butterFalling && value > butterPrev + 1e-12) { butterRises += 1; butterFalling = false; }
    butterPrev = value;
  }
  assert.equal(butterRises, 0, "巴特沃思通带内应严格单调（起伏 0 次）");
});

test("双线性变换：预畸变 Ω=(2/T)tan(ω/2) 与其反变换精确往返", () => {
  const T = 1e-3;
  for (const omega of [0.1 * Math.PI, 0.4 * Math.PI, 0.9 * Math.PI]) {
    const Omega = (2 / T) * Math.tan(omega / 2);
    const back = 2 * Math.atan((Omega * T) / 2);
    assert.ok(closeTo(back, omega, 1e-12), `ω=${omega} 往返不一致：${back}`);
  }
  /* 教材算例 */
  const omegaP = 0.4 * Math.PI;
  const omegaPre = (2 / T) * Math.tan(omegaP / 2);
  assert.ok(closeTo(omegaPre, 1453.085, 1e-2), `T=1ms、ωp=0.4π 时预畸变频率应为 1453.085 rad/s，实测 ${omegaPre.toFixed(3)}`);
});

test("FIR：线性相位群延迟为 M/2；5 点移动平均群延迟 2 样点、|H(e^{jπ/4})|=0.4828、DC 增益 1", () => {
  const M = 10;
  const h = Array.from({ length: M + 1 }, (_, n) => Math.exp(-0.2 * Math.abs(n - M / 2)));
  /* 对称 FIR 的相位是严格线性的：群延迟（相位导数的负值）在所有频率上恒为 M/2。
     注意实对称 FIR 的幅度函数可能取负值，相位会出现 ±π 跳变，
     因此判据要用「群延迟恒为常数」，而不是「相位等于 −ωM/2」。 */
  const step = 1e-4;
  const phaseOf = (omega) => {
    let re = 0;
    let im = 0;
    h.forEach((value, n) => {
      re += value * Math.cos(-omega * n);
      im += value * Math.sin(-omega * n);
    });
    return Math.atan2(im, re);
  };
  const unwrap = (a, b) => {
    let delta = b - a;
    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta < -Math.PI) delta += 2 * Math.PI;
    return delta;
  };
  for (const omega of [0.3, 0.8, 1.4, 2.0]) {
    const slope = unwrap(phaseOf(omega - step), phaseOf(omega + step)) / (2 * step);
    const groupDelay = -slope;
    assert.ok(Math.abs(groupDelay - M / 2) < 1e-6, `ω=${omega} 群延迟应为 ${M / 2}，实测 ${groupDelay.toFixed(6)}`);
  }

  /* 5 点移动平均 */
  const mag = (omega) => Math.abs(Math.sin((5 * omega) / 2) / (5 * Math.sin(omega / 2)));
  assert.ok(closeTo(mag(Math.PI / 4), 0.4828, 1e-4), `|H(e\^{jπ/4})| 应为 0.4828，实测 ${mag(Math.PI / 4).toFixed(4)}`);
  assert.ok(closeTo(mag(1e-9), 1, 1e-6), "DC 增益应为 1");
  assert.equal((5 - 1) / 2, 2, "长度 5 的对称 FIR 群延迟为 2 个样点");
});

/* ================= 二、正文与复算一致 ================= */

test("正文一致：指标四项与衰减定义必须齐全", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch4");
  const text = sectionText(chapter, "signals-ch4-specs");
  assert.match(text, /A\(Ω\)=−20lg\|H\(jΩ\)\||−20lg/, "必须给出衰减定义");
  assert.match(text, /Ap/, "必须有通带最大衰减 Ap");
  assert.match(text, /As/, "必须有阻带最小衰减 As");
  assert.match(text, /过渡带/, "必须说明过渡带");
  assert.match(text, /Ωs\/Ωp/, "必须点明 Ωs/Ωp 决定陡度");
});

test("正文一致：巴特沃思的截止点与阶数公式", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch4");
  const text = sectionText(chapter, "signals-ch4-butterworth");
  assert.match(text, /−3\.0103 dB/, "必须写明 Ωc 处恒为 −3.0103 dB");
  assert.match(text, /7\.6185/, "必须给出阶数算例的下界 7.6185");
  assert.match(text, /42\.297/, "必须给出取整后的校验值 42.297 dB");
  assert.match(text, /单调下降|单调/, "必须说明幅频单调下降");
});

test("正文一致：切比雪夫的 ε 关系与等波纹", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch4");
  const text = sectionText(chapter, "signals-ch4-chebyshev");
  assert.match(text, /ε=√\(10\^\{Ap\/10\}−1\)|ε=√\(10/, "必须给出 ε 与 Ap 的关系式");
  assert.match(text, /0\.5088/, "必须给出 Ap=1 dB 时的 ε=0.5088");
  assert.match(text, /0\.8913/, "必须给出通带谷值 0.8913");
  assert.match(text, /等波纹/, "必须说明通带是等波纹而非单调");
});

test("正文一致：双线性变换需预畸变、冲激响应不变法有混叠", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch4");
  const text = sectionText(chapter, "signals-ch4-iir");
  assert.match(text, /预畸变/, "必须提到预畸变");
  assert.match(text, /1453\.085/, "必须给出预畸变算例 1453.085 rad/s");
  assert.match(text, /混叠/, "必须说明冲激响应不变法的混叠");
  assert.match(text, /1−z\^\{?−1\}?/, "必须给出双线性变换式");
});

test("正文一致：FIR 线性相位条件与窗函数取舍", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch4");
  const text = sectionText(chapter, "signals-ch4-fir");
  assert.match(text, /h\[n\]=±h\[M−n\]|h\[n\]=h\[M−n\]/, "必须给出对称条件");
  assert.match(text, /M\/2/, "必须给出群延迟 M/2");
  assert.match(text, /主瓣/, "必须说明主瓣宽度");
  assert.match(text, /旁瓣/, "必须说明旁瓣高度");
  assert.doesNotMatch(text, /线性相位就是没有延迟|群延迟为 0|延迟为零/, "不得把线性相位说成无延迟");
  assert.match(text, /群延迟恒为 M\/2|M\/2 个样点/, "必须说明线性相位意味着 M/2 的固定群延迟");
});

test("切比雪夫阶数必须用 arcosh 公式（同指标下低于巴特沃思）", () => {
  const Ap = 1;
  const As = 40;
  const ratio = 2;
  const inner = Math.sqrt((Math.pow(10, As / 10) - 1) / (Math.pow(10, Ap / 10) - 1));
  const arcosh = (x) => Math.log(x + Math.sqrt(x * x - 1));
  const chebRequired = arcosh(inner) / arcosh(ratio);
  const butterRequired = Math.log10((Math.pow(10, As / 10) - 1) / (Math.pow(10, Ap / 10) - 1)) / (2 * Math.log10(ratio));

  assert.ok(closeTo(chebRequired, 4.536, 1e-3), `切比雪夫阶数下界应为 4.536，实测 ${chebRequired.toFixed(4)}`);
  assert.equal(Math.ceil(chebRequired), 5, "切比雪夫应取 N=5");
  assert.equal(Math.ceil(butterRequired), 8, "巴特沃思同指标应取 N=8");
  assert.ok(chebRequired < butterRequired, "同指标下切比雪夫阶数必须低于巴特沃思");
  /* 若误用巴特沃思的 lg/(2lg) 形式，会得到 7.62→8，与正确值 5 明显不同 */
  assert.ok(Math.abs(butterRequired - chebRequired) > 3, "两种公式结果差异显著，不能混用");
});

test("正文一致：切比雪夫阶数公式不能写成“与巴特沃思同形”", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch4");
  const text = sectionText(chapter, "signals-ch4-chebyshev");
  assert.match(text, /arcosh/, "必须给出 arcosh 形式的阶数公式");
  assert.match(text, /4\.536|N=5|取 N=5/, "必须给出切比雪夫阶数算例");
  assert.doesNotMatch(text, /与巴特沃思同形/, "不得写成“与巴特沃思同形”");
});

test("正文一致：第四章四节 13 个小节与教材子目一一对应", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch4");
  const groups = [...new Set(chapter.sections.map((section) => section.group))];
  assert.deepEqual(groups, [
    "第一节 滤波器概述",
    "第二节 模拟滤波器",
    "第三节 数字滤波器",
    "第四节 应用MATLAB的滤波器设计",
  ], "四节名称必须与教材目录一致");
  assert.equal(chapter.sections.length, 13, "13 个小节对应教材 13 个子目");
  const perGroup = groups.map((group) => chapter.sections.filter((section) => section.group === group).length);
  assert.deepEqual(Array.from(perGroup), [3, 5, 3, 2], "各节小节数应为 3/5/3/2");
});
