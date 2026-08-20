"use client";

import { useEffect, useRef } from "react";
import type { DiagramKind } from "../../lib/semester-model";

interface StudyDiagramProps {
  kind: DiagramKind;
  title: string;
}
function arrow(context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  const angle = Math.atan2(y2 - y1, x2 - x1);
  context.beginPath();
  context.moveTo(x2, y2);
  context.lineTo(x2 - 8 * Math.cos(angle - Math.PI / 6), y2 - 8 * Math.sin(angle - Math.PI / 6));
  context.moveTo(x2, y2);
  context.lineTo(x2 - 8 * Math.cos(angle + Math.PI / 6), y2 - 8 * Math.sin(angle + Math.PI / 6));
  context.stroke();
}

function axes(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, label: string) {
  context.strokeStyle = "#738896";
  context.lineWidth = 1.5;
  arrow(context, x, y + height, x + width, y + height);
  arrow(context, x, y + height, x, y);
  context.fillStyle = "#526977";
  context.font = "14px ui-monospace, monospace";
  context.fillText(label, x + 8, y + 14);
}

export function StudyDiagram({ kind, title }: StudyDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const width = canvas.width;
    const height = canvas.height;
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#f8fbfa";
    context.fillRect(0, 0, width, height);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#18384a";
    context.fillStyle = "#18384a";
    context.lineWidth = 2;
    context.font = "15px ui-monospace, monospace";

    if (kind === "logic") {
      const labels = title.includes("卡诺") ? ["AB", "00", "01", "11", "10"] : ["A", "B", "逻辑", "Y"];
      if (title.includes("卡诺")) {
        context.strokeRect(250, 30, 400, 160);
        for (let index = 1; index < 4; index += 1) {
          context.beginPath(); context.moveTo(250 + index * 100, 30); context.lineTo(250 + index * 100, 190); context.stroke();
          context.beginPath(); context.moveTo(250, 30 + index * 40); context.lineTo(650, 30 + index * 40); context.stroke();
        }
        ["1", "1", "1", "1"].forEach((value, index) => context.fillText(value, 294 + index * 100, 58));
        context.strokeStyle = "#158579"; context.lineWidth = 4; context.strokeRect(256, 36, 388, 28);
        context.fillStyle = "#526977"; context.fillText("格雷码相邻圈组 → 保留不变量", 310, 215);
      } else {
        context.strokeRect(330, 55, 220, 110);
        context.fillText(labels[2], 415, 115);
        arrow(context, 120, 85, 330, 85); arrow(context, 120, 140, 330, 140); arrow(context, 550, 112, 760, 112);
        context.fillText(labels[0], 92, 90); context.fillText(labels[1], 92, 145); context.fillText(labels[3], 780, 117);
      }
    } else if (kind === "circuit") {
      context.fillText(title.includes("运放") ? "V+" : "+VCC", 430, 22);
      context.beginPath(); context.moveTo(450, 28); context.lineTo(450, 52); context.stroke();
      context.strokeRect(430, 52, 40, 60); context.fillText("R", 445, 88);
      context.beginPath(); context.moveTo(450, 112); context.lineTo(450, 160); context.stroke();
      context.beginPath(); context.moveTo(180, 135); context.lineTo(405, 135); context.stroke();
      context.strokeStyle = "#158579"; context.beginPath(); context.moveTo(405, 110); context.lineTo(405, 160); context.lineTo(455, 135); context.closePath(); context.stroke();
      context.strokeStyle = "#18384a"; arrow(context, 455, 135, 710, 135);
      context.fillText("vᵢ", 145, 140); context.fillText("vₒ", 730, 140); context.fillText(title.includes("小信号") ? "gₘvπ" : "Q 点附近的小信号通路", 340, 205);
    } else if (kind === "wave") {
      axes(context, 60, 35, 310, 140, "x(τ)"); axes(context, 510, 35, 310, 140, title.includes("卷积") ? "h(t−τ)" : "Q / CLK");
      context.strokeStyle = "#158579"; context.lineWidth = 3;
      context.beginPath(); context.moveTo(60, 175); context.lineTo(115, 175); context.lineTo(115, 75); context.lineTo(265, 75); context.lineTo(265, 175); context.lineTo(365, 175); context.stroke();
      context.strokeStyle = "#d9772f";
      context.beginPath(); context.moveTo(510, 175); context.lineTo(600, 175); context.lineTo(600, 100); context.lineTo(735, 100); context.lineTo(735, 175); context.lineTo(815, 175); context.stroke();
      context.fillStyle = "#526977"; context.fillText(title.includes("卷积") ? "翻转 → 平移 → 找重叠区间 → 积分" : "只在有效时钟边沿更新状态", 300, 215);
    } else if (kind === "spectrum") {
      axes(context, 80, 25, 730, 165, "|X(jω)|");
      context.strokeStyle = "#158579"; context.lineWidth = 4;
      [-240, -120, 0, 120, 240].forEach((offset, index) => {
        context.beginPath(); context.moveTo(445 + offset, 190); context.lineTo(445 + offset, 65 + Math.abs(index - 2) * 25); context.stroke();
      });
      context.fillStyle = "#526977"; context.fillText("−2ω₀   −ω₀      0      ω₀      2ω₀", 260, 215);
    } else if (kind === "sampling") {
      axes(context, 55, 25, 770, 165, "x(t), x[n]");
      context.strokeStyle = "#91a7b2"; context.lineWidth = 2; context.beginPath();
      for (let x = 55; x <= 820; x += 4) {
        const y = 125 - 55 * Math.sin((x - 55) / 62);
        if (x === 55) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.stroke(); context.fillStyle = "#158579";
      for (let x = 80; x <= 800; x += 58) {
        const y = 125 - 55 * Math.sin((x - 55) / 62);
        context.beginPath(); context.arc(x, y, 5, 0, Math.PI * 2); context.fill();
        context.beginPath(); context.moveTo(x, 190); context.lineTo(x, y); context.strokeStyle = "#158579"; context.stroke();
      }
      context.fillStyle = "#526977"; context.fillText("采样点必须足够密，频谱副本才不会重叠", 300, 215);
    } else {
      const boxes = ["输入 x", "LTI 系统 h", "输出 y"];
      boxes.forEach((label, index) => {
        const x = 90 + index * 290;
        context.strokeStyle = index === 1 ? "#158579" : "#8ca0aa";
        context.lineWidth = index === 1 ? 3 : 2;
        context.strokeRect(x, 65, 190, 90);
        context.fillStyle = "#18384a"; context.fillText(label, x + 55, 116);
        if (index < 2) { context.strokeStyle = "#18384a"; arrow(context, x + 190, 110, x + 275, 110); }
      });
      context.fillStyle = "#526977"; context.fillText("输入分解 → 系统响应 → 线性叠加", 320, 205);
    }
  }, [kind, title]);

  return <canvas ref={canvasRef} className="study-diagram" width={900} height={230} aria-label={`${title}的${kind === "circuit" ? "电路图" : kind === "wave" ? "波形图" : "示意图"}`} role="img" />;
}
