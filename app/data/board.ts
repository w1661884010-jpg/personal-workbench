import type { SignalPath } from "../lib/model";

export const signalPaths = [
  {
    id: "power-path",
    title: "电源",
    summary: "外部供电 → 电源轨 → DSP/外围器件 → GND",
    nodes: [
      {
        id: "power-external-supply",
        label: "外部供电",
        detail: "核对接口、电压、极性和电源能力",
      },
      {
        id: "power-protection-regulation",
        label: "保护与稳压",
        detail: "保险、反接保护、稳压器和去耦网络",
      },
      {
        id: "power-rails",
        label: "电源轨",
        detail: "区分内核、I/O、模拟与外围器件电源",
      },
      {
        id: "power-dsp-peripherals",
        label: "DSP / 外围器件",
        detail: "确认各器件电源脚和复位条件",
      },
      {
        id: "power-ground",
        label: "GND",
        detail: "所有测量都要说明参考地与回流路径",
      },
    ],
    knowledgePoints: [
      "先确认板卡允许的外部供电，再看各级电源轨",
      "数字电源正常不代表模拟电源与参考电压正常",
      "示波器和万用表测量必须选择安全、明确的参考地",
    ],
    beforeYouStart: [
      "断电检查供电接口和极性",
      "查原理图与芯片数据手册的额定范围",
    ],
    keyNodes: ["供电入口", "稳压器输入/输出", "VDD/VDDIO/VDDA", "复位", "GND"],
    relatedLocations: [
      "开发板原理图的 Power、DSP Supply 与 Analog Supply 页",
      "芯片数据手册的 Recommended Operating Conditions",
    ],
    tasks: [
      "在断电状态下标出供电入口、稳压器和主要电源轨",
      "上电后按入口到负载顺序测量并记录各电源轨",
      "确认测量参考地与探头连接安全",
    ],
    commonErrors: [
      {
        issue: "只测一个电源点就判断整板供电正常",
        check: "分别检查入口、稳压输出、内核/I/O/模拟电源和参考电压",
      },
      {
        issue: "探头接地位置不当导致短路风险",
        check: "连接前确认设备接地方式与板卡 GND，优先断电接线",
      },
    ],
    conclusion: "先沿能量流向确认每一级电压和回流，再进入寄存器与代码。",
    relatedTopicIds: ["f28335-clock-gpio", "adc-sampling"],
  },
  {
    id: "digital-input-path",
    title: "数字输入",
    summary: "按键 → 上拉/下拉 → GPIO → 输入寄存器 → 程序",
    nodes: [
      {
        id: "digital-input-button",
        label: "按键",
        detail: "动作把信号接向电源或 GND，并可能产生抖动",
      },
      {
        id: "digital-input-bias",
        label: "上拉 / 下拉",
        detail: "在按键未动作时给输入一个确定电平",
      },
      {
        id: "digital-input-gpio",
        label: "GPIO",
        detail: "核对引脚、输入范围、MUX、方向与输入限定",
      },
      {
        id: "digital-input-register",
        label: "输入寄存器",
        detail: "从 GPIO 数据寄存器读取引脚状态",
      },
      {
        id: "digital-input-program",
        label: "程序",
        detail: "轮询或中断解释有效电平并执行动作",
      },
    ],
    knowledgePoints: [
      "有效电平由原理图连接决定，不能只凭代码变量名猜测",
      "浮空、抖动和输入限定会影响程序读取的稳定性",
      "先看引脚电压，再看输入寄存器，最后看程序分支",
    ],
    beforeYouStart: ["确认按键未按/按下时的连接关系和安全电平"],
    keyNodes: ["按键触点", "上拉/下拉电阻", "GPIO MUX", "GPxDIR/QSEL", "GPxDAT"],
    relatedLocations: [
      "原理图按键网络",
      "F28335 对应 GPIO 引脚",
      "GPIO 控制与数据寄存器",
    ],
    tasks: [
      "预测按键未按和按下时的引脚电平",
      "在调试器中观察输入寄存器随按键变化",
      "修改程序使 LED 明确表示按键有效状态",
    ],
    commonErrors: [
      {
        issue: "输入浮空、极性相反或按一次触发多次",
        check: "检查偏置电阻、有效电平、输入限定和软件消抖",
      },
      {
        issue: "引脚电平变化但程序不响应",
        check: "依次查看 MUX/DIR、GPxDAT、条件判断与中断标志",
      },
    ],
    conclusion: "先确认物理电平和偏置，再顺着寄存器走到程序判断。",
    relatedTopicIds: ["f28335-clock-gpio", "polling-interrupt-timer"],
  },
  {
    id: "digital-output-path",
    title: "数字输出",
    summary: "程序 → 输出寄存器 → GPIO → 驱动/限流 → LED",
    nodes: [
      {
        id: "digital-output-program",
        label: "程序",
        detail: "决定何时置位、清零或翻转输出",
      },
      {
        id: "digital-output-register",
        label: "输出寄存器",
        detail: "GPxSET / CLEAR / TOGGLE 改变锁存状态",
      },
      {
        id: "digital-output-gpio",
        label: "GPIO",
        detail: "MUX 选择 GPIO 功能，DIR 配置为输出",
      },
      {
        id: "digital-output-drive",
        label: "驱动 / 限流",
        detail: "驱动级和限流电阻决定电流与逻辑极性",
      },
      {
        id: "digital-output-led",
        label: "LED",
        detail: "用亮灭或闪烁提供可见状态",
      },
    ],
    knowledgePoints: [
      "先在 GPIO MUX 选择 GPIO 功能，再把方向设为输出",
      "SET/CLEAR/TOGGLE 比读改写数据寄存器更适合位操作",
      "LED 亮灭还取决于限流电阻、极性和是否有反相驱动",
    ],
    beforeYouStart: ["在原理图确认 LED 引脚、有效电平和限流电阻"],
    keyNodes: ["GPIO MUX", "GPxDIR", "GPxSET/CLEAR/TOGGLE", "限流电阻", "LED 极性"],
    relatedLocations: ["原理图 LED 网络", "开发板 GPIO 引脚", "GPIO 控制与数据寄存器"],
    tasks: [
      "让板载 LED 以 1 Hz 闪烁",
      "预测并反转 LED 有效电平",
      "修改翻转周期并记录预测与实际结果",
    ],
    commonErrors: [
      {
        issue: "引脚未设为输出、MUX 错误或 LED 极性接反",
        check: "按程序、输出寄存器、GPIO 电平、驱动与 LED 顺序逐点检查",
      },
      {
        issue: "LED 常亮或肉眼看不出闪烁",
        check: "检查延时单位、系统时钟与输出翻转是否实际发生",
      },
    ],
    conclusion: "先看信号怎样走，再回到寄存器与代码。",
    relatedTopicIds: ["f28335-clock-gpio"],
  },
  {
    id: "timed-output-path",
    title: "定时输出",
    summary: "时钟 → Timer/ePWM → GPIO 复用 → 输出波形",
    nodes: [
      {
        id: "timed-output-clock",
        label: "时钟",
        detail: "系统与外设时钟决定计数基础",
      },
      {
        id: "timed-output-peripheral",
        label: "Timer / ePWM",
        detail: "周期、比较和动作配置生成定时事件",
      },
      {
        id: "timed-output-mux",
        label: "GPIO 复用",
        detail: "把外设输出路由到指定引脚",
      },
      {
        id: "timed-output-waveform",
        label: "输出波形",
        detail: "用 LED、逻辑分析仪或示波器观测频率和占空比",
      },
    ],
    knowledgePoints: [
      "周期计算必须写清时钟源、分频和计数模式",
      "CPU Timer 通过中断驱动软件动作，ePWM 可由硬件直接输出",
      "寄存器正确仍需 GPIO MUX 才能在引脚看到波形",
    ],
    beforeYouStart: ["确认系统时钟频率与目标输出引脚"],
    keyNodes: ["SYSCLKOUT", "预分频", "PRD/TBPRD", "CMPA", "GPIO MUX"],
    relatedLocations: [
      "系统时钟与外设时钟配置",
      "CPU Timer/ePWM 寄存器",
      "原理图排针与输出引脚",
    ],
    tasks: [
      "写出从已知时钟到目标周期的计算过程",
      "修改周期前预测 LED 或波形变化",
      "在调试器或示波器中验证频率与占空比",
    ],
    commonErrors: [
      {
        issue: "实测频率与计算相差整数倍",
        check: "复查外设时钟分频、计数模式和单位换算",
      },
      {
        issue: "外设计数但引脚无输出",
        check: "核对 GPIO MUX、动作限定、TBCLKSYNC 与物理引脚",
      },
    ],
    conclusion: "先从时钟算出事件，再沿外设和复用走到物理波形。",
    relatedTopicIds: ["polling-interrupt-timer", "epwm"],
  },
  {
    id: "analog-sampling-path",
    title: "模拟采样",
    summary: "模拟信号 → 调理/滤波 → ADC → 结果寄存器 → 程序",
    nodes: [
      {
        id: "analog-sampling-signal",
        label: "模拟信号",
        detail: "先确认幅值、源阻抗、频率与参考地",
      },
      {
        id: "analog-sampling-conditioning",
        label: "调理 / 滤波",
        detail: "分压、缓冲、保护与 RC 限制输入并降低噪声",
      },
      {
        id: "analog-sampling-adc",
        label: "ADC",
        detail: "通道、触发、采样窗口和参考电压决定转换",
      },
      {
        id: "analog-sampling-result",
        label: "结果寄存器",
        detail: "按器件规定的对齐方式读取转换结果",
      },
      {
        id: "analog-sampling-program",
        label: "程序",
        detail: "换算电压、判断范围并记录验证数据",
      },
    ],
    knowledgePoints: [
      "输入必须处于 ADC 允许范围，不能用软件配置弥补过压",
      "源阻抗与采样窗口会影响采样保持电容能否稳定",
      "预期码值要同时说明参考电压、分辨率和结果对齐",
    ],
    beforeYouStart: ["确认 ADC 输入范围、参考电压、信号源和共地方式"],
    keyNodes: ["输入保护", "分压/RC", "ADC 通道", "触发源", "ADCRESULT"],
    relatedLocations: [
      "原理图模拟输入与参考电压",
      "ADC 控制、通道和结果寄存器",
      "调试器观察窗口或数据缓冲区",
    ],
    tasks: [
      "测量一个安全稳定的输入电压并预测 ADC 码值",
      "配置对应通道和触发，读取结果寄存器",
      "比较预测与实测并记录误差来源",
    ],
    commonErrors: [
      {
        issue: "结果饱和、偏零或噪声很大",
        check: "按输入电压、参考电压、调理网络、通道和采样窗口顺序检查",
      },
      {
        issue: "码值换算比例固定错误",
        check: "核对分辨率、结果对齐、参考电压与整数/浮点换算",
      },
    ],
    conclusion: "先保证模拟信号安全可信，再解释 ADC 寄存器中的数字结果。",
    relatedTopicIds: ["adc-sampling", "integrated-example"],
  },
] as const satisfies readonly SignalPath[];

export const signalPathById = Object.fromEntries(
  signalPaths.map((path) => [path.id, path]),
) as {
  [Path in (typeof signalPaths)[number] as Path["id"]]: Path;
};
