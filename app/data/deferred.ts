import type {
  DeferredGroup,
  DeferredItem,
  DeferredItemId,
} from "../lib/model";

const foundationFirstReason =
  "先完成 F28335/CCS 基础主线，避免在工具链和外设基础尚未闭环时并行扩展。";

export const deferredGroups = [
  {
    id: "platform-communication",
    title: "平台与通信",
    items: [
      {
        id: "stm32",
        title: "STM32",
        reason: "与当前 MCU 基础学习高度重叠，完成 F28335 主线后再迁移比较。",
      },
      {
        id: "plc",
        title: "PLC",
        reason: "属于后续自动化平台路线，当前先巩固嵌入式工具链和信号路径。",
      },
      {
        id: "can",
        title: "CAN",
        reason: "需要先具备稳定的时钟、GPIO、中断与调试基础。",
      },
      {
        id: "dma",
        title: "DMA",
        reason: "属于数据搬运优化，基础采样闭环完成前不引入。",
      },
      {
        id: "ecap-eqep",
        title: "eCAP/eQEP",
        reason: "属于进阶定时和位置接口，先完成 CPU Timer 与 ePWM。",
      },
    ],
  },
  {
    id: "control-algorithms",
    title: "控制与算法",
    items: [
      {
        id: "motor-control",
        title: "电机控制",
        reason: foundationFirstReason,
      },
      {
        id: "svpwm",
        title: "SVPWM",
        reason: "依赖 ePWM、采样、坐标变换与电机控制基础，当前不展开。",
      },
      {
        id: "pmsm",
        title: "PMSM",
        reason: foundationFirstReason,
      },
      {
        id: "bldc",
        title: "BLDC",
        reason: foundationFirstReason,
      },
      {
        id: "pid",
        title: "PID",
        reason: "V1 只做硬件基础闭环，不提前进入控制器设计与整定。",
      },
    ],
  },
  {
    id: "systems-signal-processing",
    title: "系统与信号处理",
    items: [
      {
        id: "operating-system",
        title: "操作系统",
        reason: "当前例程采用裸机最小结构，先看清中断和调度的硬件基础。",
      },
      {
        id: "advanced-dsp",
        title: "高级 DSP",
        reason: foundationFirstReason,
      },
      {
        id: "fft-digital-filter",
        title: "完整 FFT 与数字滤波",
        reason: "仅在具体采样问题中补充必要概念，完整算法放到基础采样闭环之后。",
      },
    ],
  },
] as const satisfies readonly DeferredGroup[];

export const deferredItems: readonly DeferredItem[] = deferredGroups.flatMap(
  (group) => [...group.items],
);

export const deferredItemById = Object.fromEntries(
  deferredItems.map((item) => [item.id, item]),
) as unknown as Record<DeferredItemId, DeferredItem>;
