import type { RoadmapTopic } from "../lib/model";

export const roadmapTopics = [
  {
    id: "ccs-project-structure",
    order: 1,
    title: "CCS 与工程结构",
    question: "怎样从现有例程中识别一个最小 CCS 工程的关键结构？",
    prerequisites: ["无；先确认开发板型号与 CCS 12.3 已可启动"],
    explanation:
      "最小工程由器件与构建配置、入口源文件、头文件与库、链接命令文件共同组成。先看清“入口—编译—链接—下载—调试”的关系，再修改任何外设代码。",
    relatedLocations: [
      "Project Explorer：源文件、头文件与链接命令文件",
      "Project Properties：器件、编译器与链接器配置",
      "Debug 视图：目标连接、断点、寄存器与变量",
    ],
    tasks: [
      {
        id: "ccs-open-and-build",
        title: "打开最小工程并完成一次 Clean Build",
      },
      {
        id: "ccs-find-entry-and-linker",
        title: "找到入口文件与链接命令文件",
      },
      {
        id: "ccs-debug-main",
        title: "连接目标板、下载程序并在 main() 命中断点",
      },
    ],
    commonErrors: [
      {
        issue: "旧教程菜单或按钮与 CCS 12.3 不一致",
        check: "按功能名在 Project、Run 和 Debug 菜单中定位，不机械照抄界面位置",
      },
      {
        issue: "工程器件、编译器或链接命令文件不匹配",
        check: "先核对 Project Properties、目标器件和内存映射，再处理源码错误",
      },
    ],
    completionCriteria: [
      "能说明入口、编译、链接、加载和调试之间的顺序",
      "能指出入口文件、链接命令文件与目标配置的位置",
      "能独立完成一次无错误构建并在 main() 命中断点",
    ],
    nextTopicId: "f28335-clock-gpio",
  },
  {
    id: "f28335-clock-gpio",
    order: 2,
    title: "F28335 时钟、GPIO、LED 和按键",
    question: "时钟和 GPIO 配置怎样让程序可靠地读到按键并驱动 LED？",
    prerequisites: [
      "能构建、下载并调试最小 CCS 工程",
      "能在原理图中找到供电、LED、按键和对应引脚",
    ],
    explanation:
      "先确认系统时钟和外设时钟，再通过 GPIO MUX、方向、上拉与输入限定配置引脚。输出路径写 SET/CLEAR/TOGGLE，输入路径读 DAT；有效电平必须同时结合原理图判断。",
    relatedLocations: [
      "系统初始化与时钟配置文件",
      "GPIO 控制寄存器和数据寄存器",
      "开发板原理图中的 LED、按键、限流与上拉网络",
    ],
    tasks: [
      {
        id: "gpio-trace-led",
        title: "在原理图和工程中追踪 LED 的完整数字输出路径",
        targetSignalPathId: "digital-output-path",
      },
      {
        id: "gpio-blink-led",
        title: "让 LED 以 1 Hz 闪烁，并在修改延时前预测结果",
        targetSignalPathId: "digital-output-path",
      },
      {
        id: "gpio-read-button",
        title: "读取按键有效电平并用 LED 表示输入状态",
        targetSignalPathId: "digital-input-path",
      },
    ],
    commonErrors: [
      {
        issue: "MUX 或方向配置错误，GPIO 没有按预期输入或输出",
        check: "依次核对 MUX、DIR、PUD/QSEL 和 DAT/SET/CLEAR 寄存器",
      },
      {
        issue: "LED 极性或按键有效电平判断反了",
        check: "从原理图沿电阻和器件回到 GPIO，测量空闲态与动作态电平",
      },
    ],
    completionCriteria: [
      "能解释时钟、MUX、方向和数据寄存器各自作用",
      "能修改闪烁频率并验证预测",
      "能指出按键输入和 LED 输出的完整信号路径",
    ],
    nextTopicId: "polling-interrupt-timer",
  },
  {
    id: "polling-interrupt-timer",
    order: 3,
    title: "轮询、中断与 CPU Timer",
    question: "什么时候用轮询，什么时候让 CPU Timer 通过中断驱动周期任务？",
    prerequisites: [
      "能配置 GPIO 输入与输出",
      "理解主循环、函数调用和位操作在例程中的作用",
    ],
    explanation:
      "轮询由主循环主动检查状态，结构直观但会持续占用执行时间；中断由事件暂停主流程并进入服务函数。CPU Timer 的周期来自时钟、预分频和计数值，中断还必须打通 PIE、CPU 中断组和全局中断。",
    relatedLocations: [
      "CPU Timer 配置与初始化函数",
      "中断向量表、PIEIER/PIEIFR 与 CPU IER/IFR",
      "中断服务函数和主循环",
    ],
    tasks: [
      {
        id: "timer-compare-polling-interrupt",
        title: "画出同一按键任务的轮询与中断执行顺序",
      },
      {
        id: "timer-predict-period",
        title: "计算 CPU Timer 周期，修改参数前预测 LED 翻转速度",
        targetSignalPathId: "timed-output-path",
      },
      {
        id: "timer-debug-isr",
        title: "在中断服务函数命中断点并检查标志清除与 PIEACK",
      },
    ],
    commonErrors: [
      {
        issue: "中断服务函数从未进入",
        check: "按外设源、PIE、CPU IER 和全局中断四层逐项检查使能与标志",
      },
      {
        issue: "只进入一次中断或中断频率错误",
        check: "检查标志清除、PIEACK、时钟单位、预分频和周期换算",
      },
    ],
    completionCriteria: [
      "能比较轮询与中断的执行特点",
      "能由时钟和计数参数算出 CPU Timer 周期",
      "能独立定位一次中断未触发或只触发一次的问题",
    ],
    nextTopicId: "epwm",
  },
  {
    id: "epwm",
    order: 4,
    title: "ePWM",
    question: "ePWM 的时基、比较与动作限定怎样共同产生目标频率和占空比？",
    prerequisites: [
      "理解系统时钟、外设时钟与 GPIO 复用",
      "能计算 CPU Timer 的基本周期",
    ],
    explanation:
      "ePWM 先由时基计数器定义周期和计数模式，再由比较事件与动作限定决定引脚何时置位或清零。频率计算必须包含 TBCLK 分频和计数模式，占空比则由 CMPA/CMPB 相对 TBPRD 的位置决定。",
    relatedLocations: [
      "ePWM 时基、比较与动作限定寄存器",
      "GPIO MUX 中的 ePWM 引脚复用",
      "原理图或排针上的对应 ePWM 输出",
    ],
    tasks: [
      {
        id: "epwm-trace-output",
        title: "从系统时钟追踪到 ePWM 引脚的定时输出路径",
        targetSignalPathId: "timed-output-path",
      },
      {
        id: "epwm-predict-frequency",
        title: "计算并生成 1 kHz、50% 占空比波形",
      },
      {
        id: "epwm-change-duty",
        title: "修改 CMPA 前预测占空比，并用示波器或调试数据验证",
      },
    ],
    commonErrors: [
      {
        issue: "计算频率与实测相差两倍",
        check: "确认是向上计数还是上下计数，并核对 TBCLK 分频",
      },
      {
        issue: "寄存器变化但引脚没有波形",
        check: "检查时钟使能、TBCLKSYNC、GPIO MUX、动作限定和输出引脚",
      },
    ],
    completionCriteria: [
      "能解释 TBPRD、CMPA 和动作限定的关系",
      "能在修改前计算频率与占空比",
      "能用现象或测量结果验证至少一次参数预测",
    ],
    nextTopicId: "adc-sampling",
  },
  {
    id: "adc-sampling",
    order: 5,
    title: "ADC 与采样",
    question: "模拟信号经过哪些环节，才能成为可信的 ADC 结果？",
    prerequisites: [
      "能读懂开发板供电与模拟输入附近的原理图",
      "理解定时触发、采样周期和寄存器读取",
    ],
    explanation:
      "ADC 结果不仅由软件配置决定，还受输入范围、参考电压、调理/滤波、采样保持时间和触发源影响。先保证信号安全，再配置通道、排序器或 SOC、采样窗口和结果读取。",
    relatedLocations: [
      "ADC 输入范围、参考电压与模拟电源说明",
      "原理图中的分压、RC 和输入保护",
      "ADC 控制、通道选择、触发与结果寄存器",
    ],
    tasks: [
      {
        id: "adc-trace-signal",
        title: "从模拟输入端追踪到结果寄存器的完整路径",
        targetSignalPathId: "analog-sampling-path",
      },
      {
        id: "adc-check-range",
        title: "确认输入范围与参考电压，计算一个安全测试电压的预期码值",
      },
      {
        id: "adc-sample-verify",
        title: "采集稳定输入并比较预测码值、调试数据和误差来源",
      },
    ],
    commonErrors: [
      {
        issue: "结果饱和、跳变或与输入电压比例不符",
        check: "先测输入与参考电压，再核对通道、采样窗口、结果对齐和接地",
      },
      {
        issue: "软件一直读到旧结果",
        check: "检查触发源、转换完成标志、清除顺序与结果寄存器",
      },
    ],
    completionCriteria: [
      "能指出输入调理、ADC 和结果寄存器的完整信号路径",
      "能按输入范围预测码值并解释主要误差",
      "能完成一次安全的采样验证并留下调试或测量证据",
    ],
    nextTopicId: "integrated-example",
  },
  {
    id: "integrated-example",
    order: 6,
    title: "基础例程综合验证",
    question: "怎样把已经验证的基础模块组合起来，同时仍能逐段定位问题？",
    prerequisites: [
      "完成 GPIO、CPU Timer/中断、ePWM 和 ADC 的最小独立验证",
      "每个模块至少留有一条可复现的操作或调试证据",
    ],
    explanation:
      "综合验证不是一次堆入全部功能，而是保留已知可工作的基线，每次只增加一个模块或连接点。明确输入、周期行为、输出和观测位置，用分层检查保持问题可定位。",
    relatedLocations: [
      "系统初始化、外设初始化与主循环/中断服务函数",
      "工程构建配置、链接命令文件和调试观察窗口",
      "开发板电源、数字输入输出、定时输出与模拟输入节点",
    ],
    tasks: [
      {
        id: "integration-define-baseline",
        title: "保存可工作的最小基线并列出各模块的输入、输出与观测点",
      },
      {
        id: "integration-add-one-module",
        title: "一次只加入一个模块，预测新行为后构建、下载并验证",
      },
      {
        id: "integration-fix-one-fault",
        title: "主动制造或定位一个错误，记录检查顺序、原因与修正结果",
      },
    ],
    commonErrors: [
      {
        issue: "多个模块同时加入，失败后无法判断问题边界",
        check: "回到最后一个可工作提交，用二分或逐模块方式恢复",
      },
      {
        issue: "只看最终现象，没有中间观测点",
        check: "为输入寄存器、状态变量、中断计数和输出寄存器分别设置观察证据",
      },
    ],
    completionCriteria: [
      "能从可工作基线逐步组合至少两个外设模块",
      "能解释完整输入—处理—输出路径和各观测点",
      "能定位并改正一个综合例程错误，留下可复现证据",
    ],
    nextTopicId: null,
  },
] as const satisfies readonly RoadmapTopic[];

export const roadmapTopicById = Object.fromEntries(
  roadmapTopics.map((topic) => [topic.id, topic]),
) as {
  [Topic in (typeof roadmapTopics)[number] as Topic["id"]]: Topic;
};
