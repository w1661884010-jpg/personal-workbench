"use client";

import { useMemo } from "react";
import katex from "katex";

export function MathFormula({ expression }: { expression: string }) {
  const html = useMemo(() => katex.renderToString(expression, {
    displayMode: true,
    throwOnError: false,
    strict: false,
  }), [expression]);

  return <div className="math-formula" aria-label={`公式：${expression}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
