/* 第五章「随机信号分析与处理基础」数学一致性测试（2026-09-16）。
   随机量的数值验证用固定种子的确定性伪随机序列，保证可复现；
   每条正文断言都绑定实际小节 id，并给出能被数值复算核对的量。 */
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

/* ---------- 确定性伪随机（mulberry32 + Box-Muller，可复现且质量足够） ---------- */
function makeGauss(seedInit) {
  let state = seedInit >>> 0;
  const uniform = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return () => {
    const u1 = Math.max(uniform(), 1e-12);
    const u2 = uniform();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };
}

const dftMag2 = (signal, omega) => {
  let re = 0;
  let im = 0;
  for (let n = 0; n < signal.length; n += 1) {
    re += signal[n] * Math.cos(-omega * n);
    im += signal[n] * Math.sin(-omega * n);
  }
  return (re * re + im * im) / signal.length;
};

const movingAverageMag2 = (M, omega) => Math.pow(Math.abs(Math.sin((M * omega) / 2) / (M * Math.sin(omega / 2))), 2);

/* ================= 一、独立复算 ================= */

test("白噪声通过 M 点移动平均：输出方差 = σ²Σb²（3 点→3，5 点→1.8）", () => {
  const gauss = makeGauss(20260916);
  const N = 120000;
  const sigma = 3;
  const x = Array.from({ length: N }, () => sigma * gauss());

  const varianceOf = (signal) => {
    const mean = signal.reduce((sum, value) => sum + value, 0) / signal.length;
    return signal.reduce((sum, value) => sum + value * value, 0) / signal.length - mean * mean;
  };
  assert.ok(Math.abs(varianceOf(x) - 9) < 0.15, `输入方差应接近 9，实测 ${varianceOf(x).toFixed(4)}`);

  for (const [M, expected] of [[3, 3], [5, 1.8]]) {
    const b = new Array(M).fill(1 / M);
    const y = [];
    for (let n = M - 1; n < N; n += 1) {
      let acc = 0;
      for (let k = 0; k < M; k += 1) acc += b[k] * x[n - k];
      y.push(acc);
    }
    const sumB2 = b.reduce((sum, value) => sum + value * value, 0);
    assert.ok(Math.abs(sumB2 - 1 / M) < 1e-12, `${M} 点移动平均的 Σb\^2 应为 1/M`);
    const measured = varianceOf(y);
    assert.ok(Math.abs(measured - expected) < 0.12,
      `${M} 点移动平均输出方差应为 ${expected}（=9×${sumB2.toFixed(4)}），实测 ${measured.toFixed(4)}`);
  }
});

test("S_y=|H|²S_x：白噪声经 3 点移动平均后，输出/输入谱比逐点接近 |H|²", () => {
  const gauss = makeGauss(777);
  const N = 60000;
  const x = Array.from({ length: N }, () => 3 * gauss());
  const y = [];
  for (let n = 2; n < N; n += 1) y.push((x[n] + x[n - 1] + x[n - 2]) / 3);

  for (const omega of [0.5, 1.0, 1.5, 2.0]) {
    const ratio = dftMag2(y, omega) / dftMag2(x, omega);
    const theory = movingAverageMag2(3, omega);
    assert.ok(Math.abs(ratio - theory) < 0.03,
      `ω=${omega}：实测谱比 ${ratio.toFixed(4)} 应接近 |H|²=${theory.toFixed(4)}`);
  }
  /* 直流处 |H(0)|²=1，说明平均不改变直流分量 */
  assert.ok(Math.abs(movingAverageMag2(3, 1e-9) - 1) < 1e-6, "移动平均的直流增益应为 1");
});

test("维纳—辛钦自洽性：洛伦兹谱的面积等于 R_x(0)", () => {
  /* R_x(τ)=e^{−a|τ|} ↔ S_x(ω)=2a/(a²+ω²) */
  const a = 2;
  const S = (omega) => (2 * a) / (a * a + omega * omega);
  /* 截断误差为 O(a/limit)：limit=2000、a=2 时约 3e-4，故容差取 1e-3。
     这个精度足以抓住量纲或系数级错误（例如漏掉 1/2π 会差 6.28 倍）。 */
  const limit = 2000;
  const steps = 200000;
  let integral = 0;
  for (let i = 0; i <= steps; i += 1) {
    const omega = -limit + (2 * limit * i) / steps;
    const weight = i === 0 || i === steps ? 0.5 : 1;
    integral += weight * S(omega);
  }
  integral *= (2 * limit) / steps;
  const power = integral / (2 * Math.PI);
  assert.ok(Math.abs(power - 1) < 1e-3, `(1/2π)∫S_x dω 应等于 R_x(0)=1（截断误差 O(a/limit)），实测 ${power.toFixed(6)}`);
  assert.ok(Math.abs(S(0) - 2 / a) < 1e-12, "洛伦兹谱在 ω=0 处应为 2/a");
});

test("过渡过程：σ_y²[n]=σ_x²Σ_{k≤n}h²[k] 单调升到稳态值", () => {
  const h = (k) => Math.pow(0.8, k);          /* h[n]=0.8^n u[n] */
  const sigma2 = 1;
  const partial = [];
  let acc = 0;
  for (let n = 0; n < 40; n += 1) {
    acc += sigma2 * h(n) * h(n);
    partial.push(acc);
  }
  for (let n = 1; n < partial.length; n += 1) {
    assert.ok(partial[n] >= partial[n - 1] - 1e-15, `第 ${n} 点累积方差不应下降`);
  }
  const steady = sigma2 / (1 - 0.64);
  assert.ok(Math.abs(partial[partial.length - 1] - steady) < 1e-4, `稳态方差应为 ${steady.toFixed(4)}`);
  assert.ok(partial[10] / steady > 0.99, "第 10 点应已达稳态的 99% 以上（预热长度约 10）");
});

test("LMS 收敛到维纳解，且步长超过约束会发散", () => {
  const gauss = makeGauss(4242);
  const N = 80000;
  const sigma = 3;
  const x = Array.from({ length: N }, () => sigma * gauss());
  const wTrue = [0.8, -0.5];

  const train = (mu) => {
    let w = [0, 0];
    for (let n = 2; n < N; n += 1) {
      const u = [x[n], x[n - 1]];
      const d = wTrue[0] * u[0] + wTrue[1] * u[1] + 0.1 * gauss();
      const e = d - (w[0] * u[0] + w[1] * u[1]);
      w = [w[0] + mu * e * u[0], w[1] + mu * e * u[1]];
    }
    return w;
  };

  const converged = train(0.01);
  assert.ok(Math.abs(converged[0] - 0.8) < 0.05, `w0 应收敛到 0.8，实测 ${converged[0].toFixed(3)}`);
  assert.ok(Math.abs(converged[1] + 0.5) < 0.05, `w1 应收敛到 −0.5，实测 ${converged[1].toFixed(3)}`);

  /* 步长约束 0<μ<2/((M+1)P_x)=2/(3×9)≈0.074：超过则发散 */
  const diverged = train(0.2);
  assert.ok(Math.abs(diverged[0]) > 10 || Number.isNaN(diverged[0]),
    `μ=0.2 超过约束应导致发散，实测 w=[${diverged[0].toFixed(3)}, ${diverged[1].toFixed(3)}]`);
});

/* ================= 二、正文与复算一致 ================= */

test("正文一致：R_x(0) 必须写成平均功率，方差要减直流功率", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch5");
  const text = sectionText(chapter, "signals-ch5-description");
  /* 宽平稳的两个条件写在「概率结构」小节，数字特征的必然性在此小节 */
  const probability = sectionText(chapter, "signals-ch5-probability");

  assert.match(text, /R_x\(0\)/, "必须给出 R_x(0)");
  assert.match(text, /平均功率/, "R_x(0) 必须解释为平均功率");
  assert.match(text, /σ_x\^2=R_x\(0\)−μ_x\^2/, "必须给出方差与平均功率、均值的关系");
  assert.match(probability, /只依赖时间差|只依赖 τ/, "宽平稳的第二个条件必须写清");
  assert.match(probability, /均值为常数|均值.{0,6}常数/, "宽平稳的第一个条件必须写清");
  assert.doesNotMatch(text, /R_x\(0\)（?就是方差/, "不得把 R_x(0) 直接说成方差");
});

test("正文一致：功率谱必须用维纳—辛钦与功率守恒说明", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch5");
  const text = sectionText(chapter, "signals-ch5-spectrum");
  assert.match(text, /维纳—辛钦/, "必须提到维纳—辛钦关系");
  assert.match(text, /R_x\(0\)=\(1\/2π\)∫S_x/, "必须给出功率守恒恒等式");
  assert.match(text, /周期图/, "必须说明周期图估计的局限");
});

test("互相关与互谱的共轭约定：按 R_xy(τ)=E{x(t)y*(t−τ)}，应得 S_xy=H*·S_x", () => {
  const gauss = makeGauss(31415);
  const N = 262144;
  const L = 4096;
  const segments = Math.floor(N / L);
  const x = Array.from({ length: N }, () => gauss());
  const h = [1, -2];
  const y = new Array(N).fill(0);
  for (let n = 1; n < N; n += 1) y[n] = h[0] * x[n] + h[1] * x[n - 1];

  const dft = (signal, offset, length, omega) => {
    let re = 0;
    let im = 0;
    for (let n = 0; n < length; n += 1) {
      const value = signal[offset + n];
      re += value * Math.cos(-omega * n);
      im += value * Math.sin(-omega * n);
    }
    return [re, im];
  };

  for (const omega of [0.7, 1.6, 2.4]) {
    let sxyRe = 0;
    let sxyIm = 0;
    let sxx = 0;
    for (let s = 0; s < segments; s += 1) {
      const [xr, xi] = dft(x, s * L, L, omega);
      const [yr, yi] = dft(y, s * L, L, omega);
      sxyRe += xr * yr + xi * yi;          /* Re{X·conj(Y)} */
      sxyIm += xi * yr - xr * yi;          /* Im{X·conj(Y)} */
      sxx += xr * xr + xi * xi;
    }
    const estimate = [sxyRe / sxx, sxyIm / sxx];
    const H = [h[0] + h[1] * Math.cos(-omega), h[1] * Math.sin(-omega)];
    const toH = Math.hypot(estimate[0] - H[0], estimate[1] - H[1]);
    const toHconj = Math.hypot(estimate[0] - H[0], estimate[1] + H[1]);
    assert.ok(toHconj < 0.05, `ω=${omega}：实测互谱比应接近 H*，距 H* = ${toHconj.toFixed(4)}`);
    assert.ok(toH > 1, `ω=${omega}：实测互谱比不应接近 H（距 H = ${toH.toFixed(4)}）——这正是共轭约定的判据`);
  }

  /* 相关函数层面同样带反折：R_xy(τ)=R_x(τ)*h*(−τ)，不是 R_x(τ)*h(τ) */
  const hReal = (k) => (k === 0 ? 1 : k === 1 ? -2 : 0);
  const forward = (tau) => hReal(tau);        /* R_x*h(τ) 的核 */
  const reversed = (tau) => hReal(-tau);      /* R_x*h*(−τ) 的核 */
  assert.equal(forward(-1), 0, "R_x*h(τ) 在 τ=−1 处取 h(−1)=0");
  assert.equal(reversed(-1), -2, "R_x*h*(−τ) 在 τ=−1 处取 h(1)=−2");
});

test("维纳解的共轭约定：最小二乘最优滤波器的频响等于 S_xs*/S_x", () => {
  const gauss = makeGauss(31337);
  const N = 300000;
  /* 观测 x 为白噪声，期望信号 s 是 x 的单边（因果）滤波 + 独立噪声：
     这样互相关非对称，才能把"带共轭"与"不带共轭"两种写法区分开 */
  const x = Array.from({ length: N }, () => gauss());
  const s = new Array(N).fill(0);
  for (let n = 2; n < N; n += 1) s[n] = x[n - 1] + 0.6 * x[n - 2] + 0.3 * gauss();

  const M = 4;
  const L = 2 * M + 1;
  const Rx = (lag) => {
    let sum = 0;
    let count = 0;
    for (let i = Math.max(0, lag); i < Math.min(N, N + lag); i += 1) { sum += x[i] * x[i - lag]; count += 1; }
    return sum / count;
  };
  const rho = (k) => {
    let sum = 0;
    let count = 0;
    for (let i = Math.max(0, k); i < Math.min(N, N + k); i += 1) { sum += s[i] * x[i - k]; count += 1; }
    return sum / count;
  };

  /* 解正规方程 Σ_j R_x(k−j)h_j = ρ(k)，得到最小二乘最优抽头 */
  const matrix = Array.from({ length: L }, (_, i) =>
    Array.from({ length: L + 1 }, (_, j) => (j < L ? Rx((i - M) - (j - M)) : rho(i - M))));
  for (let col = 0; col < L; col += 1) {
    let pivot = col;
    for (let row = col + 1; row < L; row += 1) if (Math.abs(matrix[row][col]) > Math.abs(matrix[pivot][col])) pivot = row;
    [matrix[col], matrix[pivot]] = [matrix[pivot], matrix[col]];
    for (let row = 0; row < L; row += 1) {
      if (row === col) continue;
      const factor = matrix[row][col] / matrix[col][col];
      for (let k = col; k <= L; k += 1) matrix[row][k] -= factor * matrix[col][k];
    }
  }
  const h = matrix.map((row, index) => row[L] / matrix[index][index]);

  const crossSpectrum = (omega, conjugate) => {
    let re = 0;
    let im = 0;
    for (let k = -30; k <= 30; k += 1) {
      const value = rho(k);
      re += value * Math.cos(-omega * k);
      im += value * Math.sin(-omega * k);
    }
    return conjugate ? [re, -im] : [re, im];
  };
  const autoSpectrum = (omega) => {
    let re = 0;
    for (let k = -30; k <= 30; k += 1) re += Rx(k) * Math.cos(-omega * k);
    return re;
  };
  const responseAt = (omega) => {
    let re = 0;
    let im = 0;
    h.forEach((value, index) => {
      const k = index - M;
      re += value * Math.cos(-omega * k);
      im += value * Math.sin(-omega * k);
    });
    return [re, im];
  };

  for (const omega of [0.6, 1.5, 2.3]) {
    const response = responseAt(omega);
    const sx = autoSpectrum(omega);
    /* rho 的变换就是 S_xs*（按本站 R_xs(τ)=E{x(t)s*(t−τ)} 的定义） */
    const hypothesis = crossSpectrum(omega, false).map((value) => value / sx);
    const alternative = crossSpectrum(omega, true).map((value) => value / sx);
    const toHypothesis = Math.hypot(response[0] - hypothesis[0], response[1] - hypothesis[1]);
    const toAlternative = Math.hypot(response[0] - alternative[0], response[1] - alternative[1]);
    assert.ok(toHypothesis < 0.05, `ω=${omega}：最小二乘解应等于 S_xs*/S_x，距其 ${toHypothesis.toFixed(4)}`);
    assert.ok(toAlternative > 0.1, `ω=${omega}：不应等于 S_xs/S_x（距其 ${toAlternative.toFixed(4)}）——这是共轭约定的判据`);
  }
});

test("卡尔曼稳态增益：标量 Riccati 的稳态解与递推仿真一致", () => {
  const Q = 1e-4;
  const R = 1;
  /* 解析：K²R + QK − Q = 0 ⇒ K = (−Q + √(Q²+4QR)) / (2R) */
  const analytic = (-Q + Math.sqrt(Q * Q + 4 * Q * R)) / (2 * R);
  assert.ok(Math.abs(analytic - 0.009950) < 1e-5, `稳态增益应约 0.009950，实测 ${analytic.toFixed(6)}`);

  /* 递推仿真：A=1、H=1，P⁻=P+Q、K=P⁻/(P⁻+R)、P=(1−K)P⁻ */
  let P = 1;
  let K = 0;
  for (let step = 0; step < 20000; step += 1) {
    const pMinus = P + Q;
    K = pMinus / (pMinus + R);
    P = (1 - K) * pMinus;
  }
  assert.ok(Math.abs(K - analytic) < 1e-6, `递推稳态增益 ${K.toFixed(6)} 应与解析解 ${analytic.toFixed(6)} 一致`);
  assert.ok(Math.abs(P - analytic) < 1e-6, `稳态估计方差 ${P.toFixed(6)} 应等于增益量级`);
  assert.ok(P < 0.02, `输出方差应压到观测方差（R=1）的 2% 以内，实测 ${P.toFixed(6)}`);
});

test("正文一致：LTI 三条结论与白噪声方差公式", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch5");
  const cont = sectionText(chapter, "signals-ch5-lti-continuous");
  const disc = sectionText(chapter, "signals-ch5-lti-discrete");
  assert.match(cont, /S_y\(ω\)=\|H\(jω\)\|\^2S_x\(ω\)/, "连续系统必须给出输出功率谱");
  assert.match(cont, /H\(0\)/, "必须给出均值乘直流增益的结论");
  assert.match(cont, /S_xy\(ω\)=H\*\(jω\)S_x\(ω\)/, "互谱必须写成 H*·S_x（与本站互相关定义一致）");
  assert.doesNotMatch(cont, /S_xy\(ω\)=H\(jω\)S_x\(ω\)/, "不得写成不带共轭的 H·S_x");
  assert.match(cont, /共轭|约定/, "必须说明该式依赖互相关的定义约定");
  assert.match(disc, /Σ_k\|h\[k\]\|\^2|Σ\|h\[k\]\|\^2/, "离散系统必须给出方差用系数平方和的公式");
  assert.match(disc, /3\.0053|1\.8/, "必须给出移动平均算例的数值");
});

test("正文一致：过渡过程必须说明要丢弃预热样本", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch5");
  const text = sectionText(chapter, "signals-ch5-transient");
  assert.match(text, /预热/, "必须提到预热样本");
  assert.match(text, /σ_y\^2\[n\]=σ_x\^2Σ/, "必须给出过渡期方差的累积式");
});

test("正文一致：三种最优滤波的定位与前提", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch5");
  const wiener = sectionText(chapter, "signals-ch5-wiener");
  const kalman = sectionText(chapter, "signals-ch5-kalman");
  const adaptive = sectionText(chapter, "signals-ch5-adaptive");

  assert.match(wiener, /S_s\/\(S_s\+S_n\)/, "维纳解必须给出信号噪声不相关时的形式");
  assert.match(wiener, /不相关/, "必须写明该形式的前提条件");
  assert.match(wiener, /H_opt\(jω\)=S_xs\*\(jω\)\/S_x\(ω\)/, "维纳解必须写成 S_xs*/S_x（与本站互相关定义一致）");
  assert.doesNotMatch(wiener, /H_opt\(jω\)=S_xs\(ω\)\/S_x\(ω\)/, "不得写成不带共轭的 S_xs/S_x");
  assert.match(kalman, /预测/, "卡尔曼必须写到预测步");
  assert.match(kalman, /校正/, "卡尔曼必须写到校正步");
  assert.match(kalman, /Q|R/, "必须说明噪声协方差的作用");
  assert.match(adaptive, /0<μ<2\//, "必须给出 LMS 步长约束");
  assert.match(adaptive, /0\.796|−0\.489/, "必须给出 LMS 收敛的数值验证");
});

test("正文一致：非平稳三条路线与 HHT 的边界", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch5");
  const timefreq = sectionText(chapter, "signals-ch5-timefreq");
  const wavelet = sectionText(chapter, "signals-ch5-wavelet");
  const hht = sectionText(chapter, "signals-ch5-hht");

  assert.match(timefreq, /不确定性原理|分辨/, "时频分析必须说明分辨率折中");
  assert.match(wavelet, /等 Q|等带宽/, "必须说明小波与 STFT 的带宽差别");
  assert.match(hht, /端点效应|模态混叠/, "HHT 必须写明失效条件");
  assert.match(hht, /交叉验证/, "HHT 结论必须要求交叉验证");
  /* 正文的警示语本身会提到错误说法（如“无严格数学证明”），因此禁止的是反向断言 */
  assert.doesNotMatch(hht, /EMD 已有严格|HHT 有严格的收敛证明|IMF 就是物理/, "不得把 IMF 说成真实分量、也不得声称 EMD 有严格证明");
});

test("正文一致：第五章五节 19 个小节与教材子目一一对应", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch5");
  const groups = [...new Set(chapter.sections.map((section) => section.group))];
  assert.deepEqual(groups, [
    "第一节 随机信号的描述与分析",
    "第二节 随机信号通过线性系统的分析",
    "第三节 最优线性滤波",
    "第四节 非平稳随机信号的分析",
    "第五节 应用MATLAB的随机信号分析、处理",
  ], "五节名称必须与教材目录一致");
  assert.equal(chapter.sections.length, 19, "19 个小节对应教材 19 个子目");
  const perGroup = groups.map((group) => chapter.sections.filter((section) => section.group === group).length);
  assert.deepEqual(Array.from(perGroup), [3, 3, 3, 3, 7], "各节小节数应为 3/3/3/3/7");
});

test("正文一致：使用时间平均估计统计量必须提各态历经性", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch5");
  const text = sectionText(chapter, "signals-ch5-description");
  assert.match(text, /各态历经/, "用时间平均估计统计量时必须提各态历经性");
  assert.doesNotMatch(text, /绝对时间无关，因而可以用时间平均/, "不得由宽平稳直接推出可用时间平均");
});

test("正文一致：LMS 步长上界与两抽头算例必须自洽", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch5");
  const text = sectionText(chapter, "signals-ch5-adaptive")
    + chapter.examples.filter((item) => item.title.includes("LMS")).map((item) => [item.prompt, ...item.steps, item.answer].join(" ")).join(" ");
  assert.match(text, /2\/\(N·P_x\)|抽头数/, "步长上界必须按抽头数（不是阶数+1）表述");
  assert.match(text, /0\.111/, "两抽头时应给出 0.111");
  assert.doesNotMatch(text, /0\.074/, "不得再写 0.074（两抽头的错误上界）");
  assert.match(text, /充分条件/, "必须说明这是充分条件而不是精确发散阈值");
  assert.match(text, /噪声|方差 0\.1/, "含噪仿真必须写明噪声前提，否则 [0.796,−0.489] 不可复现");
});

test("正文一致：离散功率谱的积分区间必须覆盖 2π", async () => {
  const chapter = chapterOf(await loadCourses(), "signals-ch5");
  const text = sectionText(chapter, "signals-ch5-lti-discrete");
  assert.match(text, /2π 周期|覆盖一个 2π/, "必须说明积分覆盖一个 2π 周期");
  assert.doesNotMatch(text, /差别只在频率区间是 0≤ω≤π/, "不得只说区间是 0≤ω≤π");
});