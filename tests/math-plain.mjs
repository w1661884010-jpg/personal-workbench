/* 把 \(...\) / \[...\] 里的 LaTeX 还原成正文惯用的纯文本写法。
 *
 * 为什么需要它：正文里的公式有两种编码状态——
 *   ① 未包裹：sin(πn)、σ_x²、y[n]=n·x[n]
 *   ② 已包裹：\(\sin(\pi n)\)、\(\sigma _x^2\)、\(y[n]=n\cdot x[n]\)
 * 两种写法表达同一件事。"正文一致"守卫不该因为编码变化就失败，
 * 也不该被编码差异哄骗着通过，所以这里只归一化数学片段**内部**，
 * 片段之外的正文原样保留。
 */
const SYMBOLS = {
  pi: "π", Pi: "Π", omega: "ω", Omega: "Ω", sigma: "σ", Sigma: "Σ", mu: "μ",
  Delta: "Δ", delta: "δ", tau: "τ", theta: "θ", Theta: "Θ", varphi: "φ", phi: "φ",
  Phi: "Φ", alpha: "α", beta: "β", gamma: "γ", Gamma: "Γ", lambda: "λ", Lambda: "Λ",
  rho: "ρ", eta: "η", xi: "ξ", Xi: "Ξ", psi: "ψ", Psi: "Ψ", varepsilon: "ε",
  epsilon: "ε", infty: "∞", le: "≤", leq: "≤", ge: "≥", geq: "≥", ne: "≠", neq: "≠",
  approx: "≈", to: "→", cdot: "·", times: "×", pm: "±", mp: "∓", propto: "∝",
  int: "∫", sum: "Σ", sqrt: "√", partial: "∂", nabla: "∇",
};

const WORDS = {
  sin: "sin", cos: "cos", tan: "tan", cot: "cot", log: "log", lg: "lg", ln: "ln",
  exp: "exp", lim: "lim", max: "max", min: "min", sinc: "sinc", round: "round",
  Re: "Re", Im: "Im", mathrm: "", operatorname: "", text: "", left: "", right: "",
};

const SUPERSCRIPT = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
  "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-", "ⁿ": "n" };
const SUBSCRIPT = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4",
  "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };

/** 全文规范化：Unicode 上下标 → ^n / _n，使"包裹前后"两种写法落到同一形式 */
function canonicalScripts(text) {
  return String(text)
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻ⁿ]+/g, (run) => "^" + run.split("").map((c) => SUPERSCRIPT[c]).join(""))
    .replace(/[₀₁₂₃₄₅₆₇₈₉]+/g, (run) => "_" + run.split("").map((c) => SUBSCRIPT[c]).join(""));
}

function plainSpan(latex) {
  let out = String(latex);
  /* \frac：兼容 \frac{1}{x} 与 \frac1{x} 两种写法，允许一层嵌套花括号；
     分子/分母含运算符或空格时补括号，与正文里手写的 1/(...) 写法对齐 */
  const wrapPart = (part) => (/[-−+\s]/.test(part.trim()) ? "(" + part.trim() + ")" : part.trim());
  out = out.replace(/\\frac\s*([0-9A-Za-z])\s*\{((?:[^{}]|\{[^{}]*\})*)\}/g,
    (whole, num, den) => wrapPart(num) + "/" + wrapPart(den));
  out = out.replace(/\\frac\s*\{((?:[^{}]|\{[^{}]*\})*)\}\s*\{((?:[^{}]|\{[^{}]*\})*)\}/g,
    (whole, num, den) => wrapPart(num) + "/" + wrapPart(den));
  /* \mathrm{max} / \operatorname{sinc} / \text{中心} 的括号是命令语法，直接脱掉 */
  out = out.replace(/\\(?:mathrm|operatorname|text|mathbf|mathit)\s*\{([^{}]*)\}/g, "$1");
  /* LaTeX 命令后的那个空格只是命令终止符，数学上不表示间隔，一并吃掉 */
  out = out.replace(/\\([A-Za-z]+) ?/g, (whole, name) => {
    if (Object.prototype.hasOwnProperty.call(WORDS, name)) return WORDS[name];
    if (Object.prototype.hasOwnProperty.call(SYMBOLS, name)) return SYMBOLS[name];
    return whole;
  });
  /* 上下标的括号：纯字母数字（f_{max}）脱掉，与未包裹写法 f_max 对齐；
     含运算符或单字符（_{−∞}、^{t}、^{−1}）保留，因为原文本来就是这么写的 */
  out = out.replace(/([_^])\s*\{([^{}]*)\}/g, (whole, mark, body) =>
    (/^[A-Za-z0-9]+$/.test(body) ? mark + body : mark + "{" + body + "}"));
  out = out.replace(/[{}]/g, "");
  out = out.replace(/\\[,\;!:\s]/g, "");
  out = out.replace(/\s+/g, " ");
  /* 数学片段里的 ASCII 连字符就是减号，正文惯用 U+2212 */
  out = out.replace(/-/g, "−");
  return out.trim();
}

/** 把文本归一成"与编码无关"的形式：已包裹的 LaTeX 还原，未包裹的原样保留。 */
export function plainMath(text) {
  const unwrapped = String(text)
    .replace(/\\\(([\s\S]+?)\\\)/g, (whole, body) => plainSpan(body))
    .replace(/\\\[([\s\S]+?)\\\]/g, (whole, body) => plainSpan(body));
  return canonicalScripts(unwrapped);
}
