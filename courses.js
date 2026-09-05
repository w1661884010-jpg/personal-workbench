"use strict";
var CoursesData = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // ../codex_projects/personal-workbench-sites/app/data/courses/index.ts
  var index_exports = {};
  __export(index_exports, {
    courseById: () => courseById,
    courses: () => courses
  });

  // ../codex_projects/personal-workbench-sites/app/data/courses/analog.ts
  var analogCourse = {
    id: "analog",
    title: "模拟电子技术",
    shortTitle: "模电",
    textbook: "童诗白、华成英《模拟电子技术基础》第六版（官方电子教案章序）",
    sourceNote: "第 0—9 章以高等教育出版社官方电子教案为主线；第 10 章读图内容由已核对的本地教材资料补充，不计入官方课程进度。HIT 模电笔记与 USTC 模拟电路教程仅用于交叉理解。",
    role: "在连续电信号进入数字系统前完成器件变换、放大、运算、反馈和波形处理。",
    accent: "#7f8791",
    chapters: [
      {
        id: "analog-00",
        number: "0",
        title: "绪论",
        counted: true,
        sourceStatus: "verified_local",
        objectives: ["了解电子技术及半导体元器件的发展脉络", "区分模拟信号和数字信号并说明模拟电路的基本任务", "说明电子信息系统的组成以及本课程的学习方法"],
        prerequisites: ["电压、电流和电阻的基本概念", "基尔霍夫定律的直观认识"],
        sections: [
          { id: "analog-00-s1", title: "电子技术的发展", importance: "core", sourceStatus: "verified_local", content: "电子技术广泛用于通信、工业、交通、医学和消费电子。元器件由电子管发展到半导体器件和集成电路，器件集成度的提高持续推动电子系统发展。" },
          { id: "analog-00-s2", title: "模拟信号与模拟电路", importance: "core", sourceStatus: "verified_local", content: "模拟信号在时间和数值上连续，数字信号具有离散性。模拟电路用于处理模拟信号，最基本的任务是放大，运算、转换、比较和功率驱动等电路也以放大电路为基础。" },
          { id: "analog-00-s3", title: "电子信息系统的组成", importance: "core", sourceStatus: "verified_local", content: "电子信息系统从传感器或接收器取得信号，模拟电路承担隔离、滤波、放大、运算、转换、比较和功率放大，再与数字电路或执行环节衔接。" },
          { id: "analog-00-s4", title: "模拟电子技术基础课的特点", importance: "core", sourceStatus: "verified_local", content: "模电具有工程性和实践性。分析既要用电路模型，也要重视定性判断与合理近似；实验学习还包括仪器使用、电路测试、故障判断和 EDA 软件应用。" },
          { id: "analog-00-s5", title: "如何学习这门课程", importance: "core", sourceStatus: "verified_local", content: "学习主线是掌握基本概念、基本电路和基本分析方法，并在具体条件下选择合理模型。定性分析先判断趋势和工作状态，定量分析再进行估算，同时用电路定理和实验结果复核。" },
          { id: "analog-00-s6", title: "课程的目的", importance: "optional", sourceStatus: "verified_local", content: "课程目标是掌握模拟电子技术的基本概念、基本电路、分析方法和实验技能，形成系统与工程观念，为后续电子技术学习及专业应用建立基础。" }
        ],
        examples: [{ title: "信号类型判断", prompt: "传感器输出随温度连续变化的电压，应按模拟量还是数字量处理？", steps: ["观察时间轴是否连续", "观察取值是否可在范围内连续变化", "两者均连续"], answer: "应先按模拟量处理，需要数字系统时再采样和量化。" }],
        experiments: [{ id: "analog-00-exp", title: "连续输入观察", workbench: "analog", goal: "观察信号源幅值连续调节时节点电压的连续变化。", steps: ["放置信号源与接地", "把电压表接到输出节点", "逐步改变幅值并记录读数"], expected: "电压读数随设置连续变化，体现模拟量的连续取值。", presetId: "analog-continuous-input", limitation: "工作台只显示内置信号源与测量结果，不包含真实传感器的误差、噪声和带宽模型。" }],
        check: [
          { id: "analog-00-q1", prompt: "模拟信号的基本特征是？", options: ["只在时间上连续", "只在数值上连续", "时间和数值均连续", "只能取 0 和 1"], answer: 2, explanation: "模拟信号在时间和数值上都具有连续性。" },
          { id: "analog-00-q2", prompt: "模电分析为什么经常采用合理近似？", options: ["工程分析先抓主要矛盾并允许规定范围内的误差", "近似可以省略工作条件", "所有器件都完全相同", "近似能替代实验"], answer: 0, explanation: "教案强调定性分析和合理近似，但近似必须以工作条件和性能要求为依据。" }
        ],
        summary: ["模拟电路以放大为基础，处理连续变化的电信号。", "电子信息系统把传感、模拟处理、数字处理和功率驱动连接起来。", "模电学习重视基本概念、基本电路、合理近似和实验复核。"],
        tags: ["绪论", "电子技术", "模拟信号", "电子信息系统"]
      },
      {
        id: "analog-01",
        number: "1",
        title: "常用半导体器件",
        counted: true,
        sourceStatus: "verified_local",
        objectives: ["解释本征、杂质半导体和 PN 结的基本关系", "使用二极管等效模型分析基础电路", "识别 BJT 的端子、电流关系、工作区和主要参数"],
        prerequisites: ["电流方向与电压极性", "基本材料与电荷概念"],
        sections: [
          { id: "analog-01-s1", title: "半导体与 PN 结", importance: "core", sourceStatus: "verified_local", content: "本征半导体中的自由电子和空穴成对产生；掺杂形成 N 型、P 型半导体。PN 结的扩散与漂移达到动态平衡后形成内电场，并表现出单向导电性。" },
          { id: "analog-01-s2", title: "二极管特性与模型", importance: "core", sourceStatus: "verified_local", content: "二极管伏安特性是非线性的。分析前先根据极性判断可能的工作区，再按题目精度选择理想、恒压降、折线或小信号模型；求得结果后还要回查最初的导通假设。", formula: "I_D=I_S\\left(e^{u_D/U_T}-1\\right),\\qquad r_d\\approx\\frac{U_T}{I_D}", variables: ["I_D：二极管静态电流", "I_S：反向饱和电流", "u_D：二极管端电压", "U_T：温度电压当量", "r_d：工作点附近的微变电阻"] },
          { id: "analog-01-s3", title: "二极管参数与稳压管", importance: "core", sourceStatus: "verified_local", content: "二极管选用需核对最大整流电流、最高反向工作电压、反向电流和最高工作频率。稳压管必须反向工作在规定稳定电流范围内并串联限流电阻；动态电阻反映稳压区电压随电流变化的斜率，温度系数说明环境温度变化引起的稳压值漂移。", formula: "r_z=\\frac{\\Delta u_Z}{\\Delta i_Z},\\qquad R=\\frac{U_I-U_Z}{I_Z+I_L}", variables: ["r_z：稳压管动态电阻", "I_Z：稳压电流", "I_L：负载电流", "R：串联限流电阻"] },
          { id: "analog-01-s4", title: "晶体三极管的放大原理、特性与参数", importance: "core", sourceStatus: "verified_local", content: "BJT 的发射结正偏后，多数载流子从发射区扩散进入薄基区；少量在基区复合形成基极电流，多数被反偏集电结的电场漂移收集，形成集电极电流。共射输入、输出特性曲线分别用于判断发射结导通和截止/放大/饱和工作区；设计还必须核对 ICM、PCM、U(BR)CEO 与安全工作区。", formula: "I_E=I_B+I_C,\\qquad \\alpha=\\frac{I_C}{I_E},\\qquad \\beta=\\frac{I_C}{I_B}=\\frac{\\alpha}{1-\\alpha}", variables: ["I_E、I_B、I_C：发射极、基极、集电极电流", "α：共基电流放大系数", "β：共射电流放大系数"] },
          { id: "analog-01-s5", title: "PN 结电容、温度与辅助分析", importance: "optional", sourceStatus: "verified_local", content: "势垒电容和扩散电容使 PN 结在高频下偏离理想单向导电模型；温度还会影响反向电流、导通电压和晶体管参数。" }
        ],
        examples: [{ title: "恒压降模型判断", prompt: "硅二极管恒压降模型取 0.7 V，阳极 1.2 V、阴极 0 V，串有限流电阻。二极管状态如何？", steps: ["计算阳阴极电压差为 1.2 V", "该值超过模型导通压降 0.7 V", "串联电阻允许形成正向电流"], answer: "二极管按导通处理，管压降约 0.7 V。" }],
        experiments: [{ id: "analog-01-exp", title: "二极管方向与偏置核对", workbench: "analog", goal: "在画布上核对二极管方向、偏置极性和负载连接。", steps: ["放置直流源、电阻、二极管和接地并完成连线", "标出阳极、阴极及电源极性", "翻转二极管并说明理论上的偏置变化", "根据等效模型手算两种方向的理论结果"], expected: "完成正向和反向偏置的拓扑判断，并写出所用二极管模型。", limitation: "当前模拟核心只求解线性 R/C、独立源和表计，二极管与 BJT 暂无求解模型。" }],
        check: [
          { id: "analog-01-q1", prompt: "分析二极管电路首先应做什么？", options: ["假定永远导通", "判断偏置和工作状态", "删除限流电阻", "只看电源正负"], answer: 1, explanation: "必须先依据端电压和模型判断导通或截止。" },
          { id: "analog-01-q2", prompt: "BJT 工作在放大区时，两个 PN 结应如何偏置？", options: ["发射结正偏、集电结反偏", "两个结都反偏", "两个结都正偏", "发射结反偏、集电结正偏"], answer: 0, explanation: "放大区要求发射结正偏、集电结反偏。" }
        ],
        summary: ["器件分析始终从工作状态判断开始。", "等效模型是对器件特性的有条件简化。", "PN 结、二极管和 BJT 是后续基本放大电路的器件基础。"],
        tags: ["PN结", "二极管", "稳压管", "BJT"]
      },
      {
        id: "analog-02",
        number: "2",
        title: "基本放大电路",
        counted: true,
        sourceStatus: "verified_local",
        objectives: ["建立放大电路静态与动态分开分析的方法", "求解静态工作点和小信号增益", "比较共射、共集和共基组态"],
        prerequisites: ["第 1 章晶体管工作区", "基尔霍夫定律", "戴维南等效"],
        sections: [
          { id: "analog-02-s1", title: "放大与性能指标", importance: "core", sourceStatus: "verified_local", content: "放大的对象是变化量，本质是用输入信号控制电源能量；不失真是放大的前提。电压、电流和功率增益以及输入、输出电阻描述二端口放大电路的基本性能。" },
          { id: "analog-02-s2", title: "静态工作点与稳定偏置", importance: "core", sourceStatus: "verified_local", content: "无输入信号时的直流电压电流构成 Q 点；合适偏置使器件在放大区内保留正、负信号摆幅。分压偏置配合发射极电阻形成直流负反馈：温度升高使 IC 增大时，发射极电压随之升高、VBE 减小，从而抑制 IC 漂移。", formula: "V_B\\approx V_{CC}\\frac{R_{B2}}{R_{B1}+R_{B2}},\\qquad I_E\\approx\\frac{V_B-V_{BE}}{R_E}", variables: ["R_B1、R_B2：基极分压电阻", "R_E：发射极电阻", "V_BE：基极—发射极电压"] },
          { id: "analog-02-s3", title: "直流/交流通路、图解法与失真", importance: "core", sourceStatus: "verified_local", content: "直流通路用于偏置，交流通路用于小信号；电容和电源在两种通路中的等效处理不同。图解法把直流负载线与晶体管输出特性曲线交点作为 Q 点，并用交流负载线检查最大不失真摆幅；Q 点过低易截止失真，过高易饱和失真，不能只看静态电流大小。", formula: "U_{CE}=V_{CC}-I_CR_C,\\qquad U_{om}\\le\\min(U_{CEQ}-U_{CES},\\ I_{CQ}R_L')", variables: ["U_CEQ、I_CQ：静态工作点", "U_CES：饱和压降", "R_L'：交流等效负载"] },
          { id: "analog-02-s4", title: "h 参数等效模型与三种接法", importance: "core", sourceStatus: "verified_local", content: "低频小信号分析只描述 Q 点附近的增量关系。先画交流通路，再用晶体管简化 h 参数等效模型表示输入端电阻和受控集电极电流；以下增益式适用于中频、发射极交流接地的共射电路。共射侧重电压放大，共集侧重缓冲，共基具有低输入电阻。", formula: "A_v\\approx-\\frac{\\beta(R_C\\parallel R_L)}{r_{be}},\\qquad R_i\\approx r_{be}", variables: ["A_v：共射电压增益", "β：共射电流放大系数", "R_C、R_L：集电极与负载电阻", "r_be：晶体管基极—发射极间的动态输入电阻"] },
          { id: "analog-02-s5", title: "场效应管与派生放大电路", importance: "optional", sourceStatus: "verified_local", content: "教材在基本共射、共集、共基之后继续讨论场效应管放大电路、复合管、共射—共基和共集—共基等派生结构，适合作为三种基本接法后的扩展。" }
        ],
        examples: [{ title: "分压偏置 Q 点", prompt: "简化模型中 VCC=10 V，RC=2 kΩ，静态 IC=2 mA，求集电极静态电压。", steps: ["RC 压降为 IC·RC", "2 mA×2 kΩ=4 V", "集电极电压为 VCC-4 V"], answer: "VCQ=6 V。" }],
        experiments: [{ id: "analog-02-exp", title: "共射放大拓扑核对", workbench: "analog", goal: "识别共射电路的偏置支路、输入端、输出端和公共端。", steps: ["在画布上放置 BJT、电阻、电源和接地并按共射结构连线", "标出基极、集电极和发射极", "分别画出直流通路和交流通路", "根据等效模型手算 Q 点与小信号增益"], expected: "得到可检查的共射拓扑、直流通路、交流通路和手算结果。", limitation: "当前模拟核心没有 BJT 或 FET 求解模型，画布不输出晶体管增益、Q 点和削顶波形。" }],
        check: [
          { id: "analog-02-q1", prompt: "静态工作点由哪类分析得到？", options: ["直流通路", "只看输出波形", "傅里叶变换", "真值表"], answer: 0, explanation: "Q 点是无输入时的直流电压和电流。" },
          { id: "analog-02-q2", prompt: "共射放大电路的典型相位关系是？", options: ["同相", "反相", "始终零输出", "随机变化"], answer: 1, explanation: "共射电路的电压输出通常相对输入反相。" }
        ],
        summary: ["先求 Q 点，再在其附近进行小信号分析。", "直流通路和交流通路不能混用。", "基本组态的差异体现在增益、相位和端口特性。"],
        tags: ["静态工作点", "小信号模型", "共射", "放大"]
      },
      {
        id: "analog-04",
        number: "3",
        title: "集成运算放大电路",
        counted: true,
        sourceStatus: "verified_local",
        objectives: ["比较多级放大电路的耦合方式并计算带负载总增益", "分析差分放大电路的差模、共模和共模抑制", "说明电流源、互补输出级和集成运放模型的作用"],
        prerequisites: ["第 2 章基本放大电路", "输入与输出电阻", "晶体管小信号模型"],
        sections: [
          { id: "analog-04-s1", title: "多级放大与耦合", importance: "core", sourceStatus: "verified_local", content: "直接耦合可传递缓慢变化和直流信号，便于集成，但各级 Q 点相互影响并存在零点漂移；阻容耦合隔离直流，变压器耦合便于阻抗变换但不适合低频集成。总增益应由各级带实际负载的增益相乘。", formula: "A_v=A_{v1}A_{v2}\\cdots A_{vn}", variables: ["A_vi：第 i 级带实际负载的电压增益"] },
          { id: "analog-04-s2", title: "差分放大、电流源与有源负载", importance: "core", sourceStatus: "verified_local", content: "差分级可采用双端输入双端输出、双端输入单端输出、单端输入双端输出和单端输入单端输出四种接法。它放大两输入之差并抑制共同变化；镜像、比例和微电流源既提供偏置，也可作有源负载提高差模增益。", formula: "u_d=u_1-u_2,\\qquad u_c=\\frac{u_1+u_2}{2},\\qquad K_{CMR}=\\left|\\frac{A_d}{A_c}\\right|", variables: ["u_d、u_c：差模与共模输入", "A_d、A_c：差模与共模增益", "K_CMR：共模抑制比"] },
          { id: "analog-04-s3", title: "集成运放的组成与输出级", importance: "core", sourceStatus: "verified_local", content: "集成运放通常由差分输入级、中间电压放大级、互补输出级和偏置电路组成。乙类互补输出在零点附近会产生交越失真，甲乙类偏置和准互补结构用于兼顾驱动能力与失真；各级围绕高开环增益、高输入电阻和低输出电阻协同设计。" },
          { id: "analog-04-s4", title: "电压传输特性、零漂与性能指标", importance: "core", sourceStatus: "verified_local", content: "开环电压传输特性只有很窄的线性区，超出后进入正、负饱和区；负反馈把运放约束在线性区。直接耦合使输入失调和温度变化造成零点漂移，因此实际使用还要核对输入失调、共模抑制比、转换速率、输入共模范围和输出摆幅。" },
          { id: "analog-04-s5", title: "运放种类、选择与使用", importance: "optional", sourceStatus: "verified_local", content: "按精度、速度、输入特性、输出驱动和电源条件选择器件，并落实调零、相位补偿、限幅和电源保护。" }
        ],
        examples: [{ title: "差模与共模分解", prompt: "两输入分别为 1.01 V 和 0.99 V，求差模输入与平均共模值。", steps: ["差模为两输入之差", "1.01-0.99=0.02 V", "共模平均值为 (1.01+0.99)/2"], answer: "差模输入 20 mV，共模平均值 1.00 V。" }],
        experiments: [{ id: "analog-04-exp", title: "差模与共模输入核对", workbench: "analog", goal: "用两个独立源和表计核对差模、共模量的定义。", steps: ["放置两个对地独立电压源作为 v1、v2", "设置等幅反向值并计算 vd=v1−v2、vc=(v1+v2)/2", "设置同向等量值并重复计算", "记录两组输入量并与定义核对"], expected: "等幅反向时共模量为零；同向等量时差模量为零。", presetId: "analog-differential-inputs", limitation: "当前模拟核心不支持 BJT、电流镜或运放，不生成差分级增益、输出摆幅或零点漂移结果。" }],
        check: [
          { id: "analog-04-q1", prompt: "直接耦合多级放大电路的典型问题是？", options: ["不能传递直流", "零点漂移会逐级放大", "各级完全独立", "只能输出数字码"], answer: 1, explanation: "直接耦合会把前级静态变化传到后级，因此要处理零点漂移。" },
          { id: "analog-04-q2", prompt: "镜像电流源在运放内部常用于？", options: ["提供偏置电流", "生成数字码", "存储状态", "降低输入电阻"], answer: 0, explanation: "电流源为内部各级提供相对稳定的偏置。" }
        ],
        summary: ["多级放大先处理耦合、负载和零点漂移。", "差分级、电流源和互补输出级构成集成运放的关键单元。", "低频模型与性能指标把内部结构连接到外部应用。"],
        tags: ["多级放大", "差分放大", "电流源", "集成运放"]
      },
      {
        id: "analog-05",
        number: "4",
        title: "放大电路的频率响应",
        counted: true,
        sourceStatus: "verified_local",
        objectives: ["用幅频特性、相频特性和波特图描述频率响应", "说明晶体管高频等效模型中的主要电容效应", "比较单管与多级放大电路的截止频率和带宽"],
        prerequisites: ["第 2 章小信号增益", "电阻、电容和正弦信号"],
        sections: [
          { id: "analog-05-s1", title: "频率响应与波特图", importance: "core", sourceStatus: "verified_local", content: "频率响应说明放大倍数的幅值和相位如何随频率变化。画渐近波特图时先求中频增益，再标出各转折频率；每遇一个一阶零点，幅频斜率增加 20 dB/dec，每遇一个一阶极点，斜率减少 20 dB/dec，最后补相位变化并核对上下限频率。", formula: "A_{v,dB}=20\\log_{10}|A_v|,\\qquad BW=f_H-f_L", variables: ["A_v：电压增益", "A_v,dB：分贝增益", "f_L、f_H：下、上限频率"] },
          { id: "analog-05-s2", title: "晶体管的高频等效模型", importance: "core", sourceStatus: "verified_local", content: "BJT 的混合 π 模型把结电容和跨导纳入小信号分析；高频时这些电容形成附加通路，使增益下降并产生相移。β 截止频率、共基截止频率和特征频率分别刻画不同电流增益下降到规定值的位置。", formula: "f_T\\approx\\beta_0f_\\beta,\\qquad f_\\alpha\\approx(1+\\beta_0)f_\\beta", variables: ["β₀：低频共射电流增益", "f_β、f_α：共射、共基截止频率", "f_T：特征频率"] },
          { id: "analog-05-s3", title: "混合π模型的单向化", importance: "core", sourceStatus: "verified_local", content: "晶体管混合π模型中的基集结电容连接输入与输出回路。通过等效变换把这条双向支路分别等效到输入端和输出端，可得到便于逐级分析的单向化模型；输入端等效电容增大会降低放大电路的上限频率。" },
          { id: "analog-05-s4", title: "单管与多级放大电路的频响", importance: "core", sourceStatus: "verified_local", content: "耦合、旁路电容决定低频响应，器件结电容决定高频响应。低频和高频时间常数法把每个独立电容对应的等效电阻转成拐点估算；多级级联后各级幅频和相频特性相乘，总带宽通常比单级更窄。", formula: "f_c\\approx\\frac{1}{2\\pi R_{eq}C},\\qquad A_v(j\\omega)=\\prod_i A_{vi}(j\\omega)", variables: ["R_eq：从电容端口看到的等效电阻", "C：参与该拐点的电容"] },
          { id: "analog-05-s5", title: "带宽增益积", importance: "optional", sourceStatus: "verified_local", content: "单管共射放大电路提高中频增益时，带宽通常会变窄，增益与带宽的乘积在一定条件下近似不变。设计宽频带放大电路时应选用高频器件，必要时采用共基电路，并同时检查多级级联造成的频带收窄。" }
        ],
        examples: [{ title: "一阶低通截止频率", prompt: "R=10 kΩ、C=10 nF 的一阶 RC 低通网络，求截止频率。", steps: ["使用 f_H=1/(2πRC)", "RC=10^4×10^-8=10^-4 s", "代入得到约 1/(2π×10^-4)"], answer: "截止频率约为 1.59 kHz；放大电路的完整频响还需考虑器件和其他电容。" }],
        experiments: [{ id: "analog-05-exp", title: "一阶 RC 频点观察", workbench: "analog", goal: "用线性 R/C 网络观察输入频率改变时的输出幅值。", steps: ["连接正弦独立源、串联电阻、对地电容和表计", "固定输入幅值并依次设置三个相隔十倍的频率", "记录电容节点的输入输出幅值", "计算三个频点的幅值比"], expected: "得到可复核的一阶 RC 三点测量表；频率升高时电容节点幅值按当前线性模型变化。", presetId: "analog-rc-frequency", limitation: "工作台支持线性 R/C、独立源和表计，不包含 BJT、MOSFET 或运放的完整高频模型。" }],
        check: [
          { id: "analog-05-q1", prompt: "电压增益换算为分贝时使用哪一项？", options: ["10log10|Av|", "20log10|Av|", "Av/20", "20Av"], answer: 1, explanation: "电压幅值比采用 20log10|Av| 表示。" },
          { id: "analog-05-q2", prompt: "多个放大级级联后，总带宽通常怎样变化？", options: ["一定无限增大", "通常比单级更窄", "与各级无关", "始终等于零"], answer: 1, explanation: "各级频率特性相乘，截止附近衰减会叠加。" }
        ],
        summary: ["频率响应同时包含幅值和相位随频率的变化。", "低频端主要受耦合与旁路电容影响，高频端主要受器件电容影响。", "多级放大要把各级频率特性和负载效应一起考虑。"],
        tags: ["频率响应", "波特图", "带宽", "高频模型"]
      },
      {
        id: "analog-06",
        number: "5",
        title: "放大电路中的反馈",
        counted: true,
        sourceStatus: "verified_local",
        objectives: ["判断反馈的存在、极性和组态", "使用闭环增益一般关系", "解释负反馈对增益稳定性和端口性能的影响"],
        prerequisites: ["第 3 章集成运算放大电路", "输入与输出电阻", "基本代数"],
        sections: [
          { id: "analog-06-s1", title: "反馈基本概念", importance: "core", sourceStatus: "verified_local", content: "反馈把输出的一部分送回输入；按极性分正负反馈，按信号性质分直流和交流反馈。" },
          { id: "analog-06-s2", title: "反馈判断", importance: "core", sourceStatus: "verified_local", content: "判断反馈时依次检查反馈通路、直流或交流性质、正负极性、输出取样量和输入比较方式，避免只凭反馈支路位置命名。" },
          { id: "analog-06-s3", title: "四种负反馈组态", importance: "core", sourceStatus: "verified_local", content: "输入端比较方式决定串联或并联，输出端取样量决定电压或电流反馈。电压串联常用作电压放大，电压并联常用作跨阻，电流串联常用作跨导，电流并联常用作电流放大；深度负反馈估算时必须让 A、F 和 A_f 使用同一种输入输出量纲。" },
          { id: "analog-06-s4", title: "闭环增益与性能", importance: "core", sourceStatus: "verified_local", content: "负反馈以环路增益换取闭环稳定性，并降低参数变化和非线性失真对输出的影响。深度负反馈时闭环增益主要由反馈网络决定；输入、输出电阻如何变化则取决于串联/并联和电压/电流组态。", formula: "A_f=\\frac{A}{1+AF},\\qquad |AF|\\gg1\\Rightarrow A_f\\approx\\frac{1}{F}", variables: ["A：基本放大电路增益", "F：反馈系数", "AF：环路增益", "A_f：闭环增益"] },
          { id: "analog-06-s5", title: "稳定性、裕度与补偿", importance: "core", sourceStatus: "verified_local", content: "当环路相位满足正反馈条件且幅值条件也成立时，负反馈放大电路可能产生自激振荡。幅值裕度和相位裕度用于判断电路距离临界稳定状态的余量。教案介绍简单滞后补偿、密勒补偿和 RC 滞后补偿，它们通过改变高频环路特性提高稳定性，但通常会牺牲一部分带宽。", formula: "\\varphi_m=180^\\circ+\\angle AF\\big|_{|AF|=1},\\qquad G_m=-20\\log_{10}|AF|\\big|_{\\angle AF=-180^\\circ}", variables: ["φ_m：相位裕度", "G_m：幅值裕度"] },
          { id: "analog-06-s6", title: "自举与电流反馈运放", importance: "optional", sourceStatus: "verified_local", content: "自举可提高等效输入电阻，电流反馈型运放在带宽与闭环增益关系上不同于电压反馈型运放；这些结构用于拓展，不替代四种基本负反馈组态。" }
        ],
        examples: [{ title: "闭环增益", prompt: "基本增益 A=100，反馈系数 F=0.09，求负反馈闭环增益。", steps: ["计算 AF=9", "分母 1+AF=10", "A_f=100/10"], answer: "闭环增益 A_f=10。" }],
        experiments: [{ id: "analog-06-exp", title: "反馈路径辨认", workbench: "analog", goal: "在运放反馈拓扑中辨认输入、输出、取样和比较位置。", steps: ["放置运放符号、电阻和独立源并连接典型负反馈拓扑", "沿输出到输入的路径标出反馈支路", "判断输出取样量和输入比较方式", "用闭环公式手算反馈前后的增益"], expected: "完成反馈存在性、极性和组态的拓扑判断，并给出闭环增益手算结果。", limitation: "当前模拟核心没有运放或受控源模型，不能求解闭环输出、稳定性或自激振荡。" }],
        check: [
          { id: "analog-06-q1", prompt: "输出电压被取样送回输入属于哪类输出取样？", options: ["电压反馈", "电流反馈", "无反馈", "数字反馈"], answer: 0, explanation: "取样量是输出电压，因此是电压反馈。" },
          { id: "analog-06-q2", prompt: "在负反馈公式中 AF 表示？", options: ["输入电阻", "环路增益", "输出功率", "截止频率"], answer: 1, explanation: "A 与 F 的乘积是环路增益。" }
        ],
        summary: ["反馈判断应按存在性、交直流、组态和极性逐步完成。", "负反馈降低并稳定闭环增益。", "深度负反馈近似必须检查条件。"],
        tags: ["反馈", "负反馈", "闭环增益", "组态"]
      },
      {
        id: "analog-07",
        number: "6",
        title: "信号的运算和处理",
        counted: true,
        sourceStatus: "verified_local",
        objectives: ["使用虚短、虚断分析基本运算电路", "说明模拟乘法器及其典型运算用途", "根据通带、截止频率和阶数分析有源滤波器"],
        prerequisites: ["第 3 章运放模型", "第 5 章负反馈", "基本微积分"],
        sections: [
          { id: "analog-07-s1", title: "理想运放与比例运算", importance: "core", sourceStatus: "verified_local", content: "只有运放处于线性区且存在负反馈时，才能使用虚短和虚断。反相电路以反相端为电流求和节点，同相电路由反馈分压确定闭环增益；计算后还要检查输出是否超出电源允许摆幅。", formula: "u_{O,inv}=-\\frac{R_f}{R_1}u_I,\\qquad u_{O,non}=\\left(1+\\frac{R_f}{R_1}\\right)u_I", variables: ["R_1：输入或接地支路电阻", "R_f：反馈电阻", "u_I、u_O：输入与输出电压"] },
          { id: "analog-07-s2", title: "加减、积分和微分运算", importance: "core", sourceStatus: "verified_local", content: "求和电路把多路输入电流汇入求和节点；积分与微分电路利用电容的电流电压关系实现时间运算。实用积分器在反馈电容并联电阻以限制直流增益，可把方波转换为近似三角波；实用微分器增加限流和带宽限制，避免高频噪声被无限放大。所有结果都要检查输出摆幅与频率范围。" },
          { id: "analog-07-s3", title: "模拟乘法器及其应用", importance: "core", sourceStatus: "verified_local", content: "模拟乘法器的输出与两个输入的乘积成正比；配合运放可实现乘除、平方、开方、调制和解调。" },
          { id: "analog-07-s4", title: "有源滤波电路", importance: "core", sourceStatus: "verified_local", content: "有源滤波器用运放和 R/C 网络实现低通、高通、带通或带阻特性；一阶低通先由电阻比确定通带增益，再由 RC 确定截止频率。二阶和状态变量型电路进一步独立调节截止频率与品质因数，分析时必须写出传递函数再核对阶数。", formula: "H_{LP}(s)=\\frac{A_0}{1+sRC},\\qquad f_H=\\frac{1}{2\\pi RC}", variables: ["A₀：通带闭环增益", "f_H：一阶低通截止频率"] },
          { id: "analog-07-s5", title: "对数、指数与状态变量滤波", importance: "optional", sourceStatus: "verified_local", content: "对数和指数运算电路利用半导体器件的指数伏安特性。状态变量型滤波器由多个运算单元构成，可同时得到低通、带通或高通输出，适合在掌握基本运算和二阶滤波后继续学习。" }
        ],
        examples: [{ title: "反相比例运算", prompt: "理想反相运放 Rin=10 kΩ、Rf=50 kΩ、Vin=0.2 V，求 Vout。", steps: ["闭环增益为 -Rf/Rin", "-50/10=-5", "输出为 -5×0.2 V"], answer: "Vout=-1.0 V，前提是未超出电源允许输出范围。" }],
        experiments: [{ id: "analog-07-exp", title: "反相运算拓扑与手算核对", workbench: "analog", goal: "搭建反相运放的连接关系，并用电阻比手算输出。", steps: ["放置运放符号、10 kΩ 输入电阻和 50 kΩ 反馈电阻", "标出反相端、同相端、求和节点和反馈路径", "按 −Rf/Rin 手算增益和 0.2 V 输入的理论输出", "把反馈电阻改为 20 kΩ 后重新手算"], expected: "两组理论输出分别为 −1.0 V 和 −0.4 V。", limitation: "当前模拟核心没有理想或非理想运放模型，不能求解虚短、饱和、失调、转换速率或输出波形。" }],
        check: [
          { id: "analog-07-q1", prompt: "使用虚短条件前应确认什么？", options: ["运放在线性负反馈状态", "输出一定为零", "两输入端短接", "没有电源"], answer: 0, explanation: "虚短是高增益负反馈线性工作时的近似。" },
          { id: "analog-07-q2", prompt: "有源低通滤波器的主要作用是？", options: ["通过低频并衰减较高频率", "只保存直流电源", "把模拟量变成真值表", "产生无限带宽"], answer: 0, explanation: "低通滤波器保留低频成分，并在截止频率以上逐步衰减。" }
        ],
        summary: ["理想运放规则只适用于线性负反馈工作区。", "比例、加减、积分、微分、乘法和滤波构成模拟运算处理主线。", "所有理论结果都要检查饱和、带宽和器件非理想限制。"],
        tags: ["运放", "模拟运算", "模拟乘法器", "有源滤波"]
      },
      {
        id: "analog-08",
        number: "7",
        title: "波形的发生和信号的转换",
        counted: true,
        sourceStatus: "verified_local",
        objectives: ["判断正弦振荡电路的起振与稳幅条件", "分析电压比较器和非正弦波发生电路", "说明运放信号转换电路的基本关系"],
        prerequisites: ["第 5 章反馈", "第 6 章运放线性应用", "RC 电路基础"],
        sections: [
          { id: "analog-08-s1", title: "正弦波振荡电路", importance: "core", sourceStatus: "verified_local", content: "正弦振荡器由放大、正反馈、选频和稳幅环节组成。分析时先确认直流工作条件，再找满足环路相位为 2kπ 的频率，检查起振幅值条件，最后说明非线性稳幅如何把增长过程限制为稳定输出。", formula: "\\angle A(j\\omega_0)F(j\\omega_0)=2k\\pi,\\qquad |AF|>1\\ (\\text{起振}),\\quad |AF|=1\\ (\\text{稳态})", variables: ["A：放大网络传输系数", "F：反馈与选频网络传输系数", "ω_0：振荡角频率"] },
          { id: "analog-08-s1b", title: "LC 与石英晶体振荡", importance: "core", sourceStatus: "verified_local", content: "变压器反馈、电感三点式和电容三点式振荡器利用 LC 谐振回路选频，适合较高频率；必须依据线圈或电容抽头的同名端判断反馈极性。石英晶体具有很高品质因数，可在串联或并联谐振附近稳定频率，但仍需外部放大和反馈网络满足起振条件。", formula: "f_0\\approx\\frac{1}{2\\pi\\sqrt{LC}}", variables: ["L、C：LC 谐振回路的等效电感与电容"] },
          { id: "analog-08-s2", title: "电压比较器", importance: "core", sourceStatus: "verified_local", content: "单限、滞回、窗口和集成电压比较器把连续输入与阈值比较并输出两种状态；滞回特性可减少阈值附近噪声造成的反复翻转。" },
          { id: "analog-08-s3", title: "非正弦波发生电路", importance: "core", sourceStatus: "verified_local", content: "矩形波、三角波、锯齿波、波形变换和函数发生器利用比较、积分及充放电过程产生或转换波形。" },
          { id: "analog-08-s4", title: "运放信号转换电路", importance: "core", sourceStatus: "verified_local", content: "教材讨论电压—电流、精密整流和电压—频率转换；分析要写出输入量、转换比例、输出范围和极性。" },
          { id: "analog-08-s5", title: "比较器的 Multisim 分析", importance: "optional", sourceStatus: "verified_local", content: "官方教案在电压比较器部分使用 Multisim 分析电压传输特性。仿真用于核对输入越过阈值时的输出翻转和限幅结果，仍需先根据电路连接手算阈值与输出电平。" }
        ],
        examples: [{ title: "RC 桥式振荡频率", prompt: "对称 RC 桥式振荡网络取 R=10 kΩ、C=10 nF，求选频中心频率。", steps: ["使用 f0=1/(2πRC)", "RC=10^-4 s", "代入计算 1/(2π×10^-4)"], answer: "中心频率约为 1.59 kHz；能否起振还要检查环路增益和稳幅环节。" }],
        experiments: [{ id: "analog-08-exp", title: "RC 选频网络观察", workbench: "analog", goal: "观察无源 RC 网络随频率变化的幅值关系。", steps: ["用独立正弦源、电阻和电容搭建 RC 选频支路", "设置三个代表性频率并记录节点幅值", "比较各频点的传输比例", "结合手算结果检查相位与幅值条件"], expected: "得到线性 RC 网络的频点数据，并说明选频网络为何还不能单独形成振荡器。", presetId: "analog-rc-selection", limitation: "当前模拟核心不支持运放、BJT 或 MOSFET，不能模拟起振、稳幅、比较器翻转或非正弦波发生。" }],
        check: [
          { id: "analog-08-q1", prompt: "正弦振荡起振需要同时考虑？", options: ["幅值和相位条件", "真值表和码制", "存储容量和地址", "只有电源大小"], answer: 0, explanation: "正反馈相位条件与足够的环路增益缺一不可。" },
          { id: "analog-08-q2", prompt: "滞回比较器为何比单限比较器更能抑制阈值附近抖动？", options: ["上、下转换阈值不同", "没有电源", "输出始终为零", "只处理数字码"], answer: 0, explanation: "滞回形成两个不同阈值，输入的小幅噪声不易触发反复翻转。" }
        ],
        summary: ["振荡分析必须同时检查环路相位、幅值和稳幅机制。", "比较器和积分器是非正弦波发生与转换的重要单元。", "信号转换电路要同时核对比例、范围、极性和器件限制。"],
        tags: ["振荡", "比较器", "非正弦波", "信号转换"]
      },
      {
        id: "analog-09",
        number: "8",
        title: "功率放大电路",
        counted: true,
        sourceStatus: "verified_local",
        objectives: ["区分功率放大与小信号电压放大的主要指标", "比较甲类、乙类和甲乙类工作方式", "计算互补输出级的最大输出功率、效率和功率管极限参数"],
        prerequisites: ["第 2 章基本放大电路", "第 3 章互补输出级", "功率和效率基本概念"],
        sections: [
          { id: "analog-09-s1", title: "输出功率与效率", importance: "core", sourceStatus: "verified_local", content: "功率放大级面向负载提供较大的电压和电流。先由最大不失真输出幅值求负载功率，再由电源平均电流求直流功率和效率，同时检查每只功率管的最大电流、反向电压与耗散功率。", formula: "P_o=\\frac{U_{om}^2}{2R_L},\\qquad \\eta=\\frac{P_o}{P_{DC}}", variables: ["U_om：输出正弦电压峰值", "R_L：负载电阻", "P_o：交流输出功率", "P_DC：直流电源提供的功率", "η：效率"] },
          { id: "analog-09-s2", title: "甲类、乙类与甲乙类", importance: "core", sourceStatus: "verified_local", content: "甲类器件在整个周期导通，乙类各器件导通半个周期，甲乙类导通超过半个周期。导通角改变静态功耗、效率和交越失真。" },
          { id: "analog-09-s3", title: "变压器、OTL、OCL 与 BTL 输出级", importance: "core", sourceStatus: "verified_local", content: "变压器耦合乙类推挽便于阻抗变换但体积大；OTL 使用单电源和输出耦合电容，OCL 使用双电源省去输出电容，BTL 用两个反相桥臂把负载跨接在差分输出之间。同一电源条件下 BTL 可获得更大的负载电压摆幅；四种结构都需检查交越失真、静态偏置和功率管安全。" },
          { id: "analog-09-s4", title: "功率管极限参数", importance: "core", sourceStatus: "verified_local", content: "功率管的最大集电极电流、反向击穿电压和最大耗散功率共同限制允许工作范围；还要核对结温、散热和安全工作区。" },
          { id: "analog-09-s5", title: "故障与热安全分析", importance: "optional", sourceStatus: "verified_local", content: "功放故障可能同时改变输出波形、静态电流和器件功耗。进一步分析时应先判断故障对功率管安全与负载的影响，再追踪局部信号。" }
        ],
        examples: [{ title: "乙类互补功放效率上限", prompt: "理想乙类互补对称功率放大电路在最大不失真输出时，理论最高效率约为多少？", steps: ["理想乙类每只管导通半个周期", "最大输出时交流负载功率与直流电源功率之比为 π/4", "π/4≈0.785"], answer: "理论最高效率约为 78.5%；实际电路还受管压降、静态偏置和损耗限制。" }],
        experiments: [{ id: "analog-09-exp", title: "纯电阻负载功率核对", workbench: "analog", goal: "用独立电压源和负载电阻验证负载电流与功率关系。", steps: ["连接独立电压源、电流表和较高阻值负载", "记录负载电压与电流", "改接较低阻值负载并再次记录", "按 P=UI 计算两组负载功率"], expected: "同一理想电压下负载电阻减小，电流和负载功率增大。", presetId: "analog-resistive-load", limitation: "当前模拟核心不支持 BJT 或 MOSFET 互补输出级，也不包含效率、交越失真、热效应和安全工作区模型。" }],
        check: [
          { id: "analog-09-q1", prompt: "电压增益高是否等同于负载驱动能力强？", options: ["始终等同", "不等同，还需电流和功率指标", "只要频率高就等同", "只对数字电路等同"], answer: 1, explanation: "功率驱动还取决于输出电流、端口能力和负载。" },
          { id: "analog-09-q2", prompt: "甲乙类互补输出级设置小静态偏置的主要目的是什么？", options: ["减小交越失真", "提高输入电阻到无穷", "生成数字码", "消除电源"], answer: 0, explanation: "小偏置使零点附近两管不同时完全截止，从而减小交越失真。" }
        ],
        summary: ["功率放大同时关注输出功率、效率、失真和器件安全。", "互补输出级通过正负半周分工提高电源利用率。", "散热和安全工作区是功放设计不可省略的约束。"],
        tags: ["功率放大", "互补输出", "效率", "安全工作区"]
      },
      {
        id: "analog-10",
        number: "9",
        title: "直流电源",
        counted: true,
        sourceStatus: "verified_local",
        objectives: ["说明直流电源中整流、滤波和稳压各环节的作用", "分析单相整流和电容滤波的基本波形与指标", "比较线性稳压和开关稳压的工作特点"],
        prerequisites: ["第 1 章二极管", "电容充放电", "负载与功率概念"],
        sections: [
          { id: "analog-10-s1", title: "电源组成与整流", importance: "core", sourceStatus: "verified_local", content: "直流电源通常由变压、整流、滤波和稳压环节组成。分析半波或桥式整流时要逐半周判断二极管导通路径，画出负载波形，再计算平均输出，并按负载电流和反向峰值电压选择器件。", formula: "U_{O(AV)}\\approx0.9U_2\\quad(\\text{理想桥式整流})", variables: ["U_2：变压器副边正弦电压有效值", "U_O(AV)：未滤波整流输出平均值"] },
          { id: "analog-10-s2", title: "滤波与倍压电路", importance: "core", sourceStatus: "verified_local", content: "电容滤波适合较小负载电流，利用峰值附近充电、其余时间向负载放电来减小纹波；电感滤波利用电感抑制电流变化，更适合较大负载电流。倍压整流用二极管和电容在不同半周叠加电压，适合高电压、小电流场合，不能忽略内阻和负载下跌落。" },
          { id: "analog-10-s3", title: "线性稳压电路与性能指标", importance: "core", sourceStatus: "verified_local", content: "稳压管电路和串联型稳压电路通过基准、取样、比较放大、调整和反馈稳定输出；增加放大环节可提高环路增益和稳压能力。三端集成稳压器集成主要环节与保护，扩流或扩压应用仍必须核对功耗、压差和保护器件。", formula: "S_r=\\frac{\\Delta U_O/U_O}{\\Delta U_I/U_I},\\qquad R_o=\\frac{\\Delta U_O}{\\Delta I_O}", variables: ["S_r：稳压系数，绝对值越小越好", "R_o：输出电阻", "纹波电压：输出中残留的交流分量"] },
          { id: "analog-10-s4", title: "降压与升压开关型稳压", importance: "core", sourceStatus: "verified_local", content: "开关型稳压器使调整器件在开关状态工作，并通过储能元件和占空比调节输出。理想 Buck 在连续电流模式下平均输出约为 D·UI，Boost 约为 UI/(1−D)；两者的开关、电感、二极管位置不同，不能只凭输出大小互换。相较线性稳压效率更高，但纹波和电磁干扰处理更复杂。", formula: "U_{O,Buck}\\approx DU_I,\\qquad U_{O,Boost}\\approx\\frac{U_I}{1-D}", variables: ["D：开关占空比", "U_I、U_O：输入、输出平均电压"] },
          { id: "analog-10-s5", title: "三端稳压器及应用", importance: "optional", sourceStatus: "verified_local", content: "官方教案介绍 W7800 系列三端稳压器的基本应用、输出电流扩展和输出电压扩展，并用 W117 讨论可调输出。应用时要核对输入输出压差、负载电流、功耗、保护二极管和稳定电容。" }
        ],
        examples: [{ title: "桥式整流平均电压估算", prompt: "忽略二极管压降，变压器副边电压有效值 U2=12 V，估算桥式整流未滤波时的平均输出电压。", steps: ["桥式整流为全波整流", "理想平均值近似 UO(AV)=0.9U2", "0.9×12=10.8 V"], answer: "平均输出约为 10.8 V；加入滤波、负载和实际二极管后应重新计算。" }],
        experiments: [{ id: "analog-10-exp", title: "半波整流拓扑核对", workbench: "analog", goal: "核对正弦源、二极管和负载的连接方向。", steps: ["放置正弦源、二极管、负载电阻和接地并完成连线", "标出输入正半周时的理论电流方向", "翻转二极管并说明理论上保留的半周变化", "手绘两种方向对应的理论输出波形"], expected: "完成两种二极管方向的拓扑判断和理论波形。", limitation: "当前模拟核心没有二极管和稳压器求解模型，不能生成整流、纹波、稳压或电源安全特性结果。" }],
        check: [
          { id: "analog-10-q1", prompt: "桥式整流相对半波整流的主要特点是什么？", options: ["利用输入的两个半周", "只利用负半周", "输出一定无纹波", "不需要二极管"], answer: 0, explanation: "桥式整流把输入两个半周都转换成同一极性的负载电压。" },
          { id: "analog-10-q2", prompt: "半波整流输出是否已是稳定直流？", options: ["是，完全无纹波", "不是，仍是脉动单向电压", "只输出数字码", "输出恒为零"], answer: 1, explanation: "仅整流未完成滤波和稳压。" }
        ],
        summary: ["整流、滤波和稳压承担不同任务，必须分别分析。", "线性稳压结构简单、噪声较低，开关稳压效率较高但干扰处理更复杂。", "电源设计还要核对负载、纹波、功耗、散热和保护。"],
        tags: ["直流电源", "整流", "滤波", "稳压"]
      },
      {
        id: "analog-11",
        number: "10",
        title: "模拟电子电路读图",
        counted: false,
        sourceStatus: "supplemental_local",
        objectives: ["按功能分块、信号流和直流通路阅读模拟电子电路图", "用基本电路和基本分析方法解释综合电路", "从典型读图案例中提取可复核的判断顺序"],
        prerequisites: ["第 1—9 章基本器件和功能电路", "直流与交流通路", "反馈与信号流向"],
        sections: [
          { id: "analog-11-s1", title: "读图的思路和步骤", importance: "core", sourceStatus: "supplemental_local", content: "先识别电源、地、输入和输出，再按信号流划分功能模块；随后分别检查直流偏置、交流通路、反馈路径和各级接口，最后回到整机功能验证。" },
          { id: "analog-11-s2", title: "基本电路与分析方法回顾", importance: "core", sourceStatus: "supplemental_local", content: "读图不是重新推导全部器件，而是把二极管、放大级、差分级、运放、反馈、功放和电源等基本模块，与静态、动态和频率分析方法对应起来。" },
          { id: "analog-11-s3", title: "低频功率放大与火灾报警案例", importance: "core", sourceStatus: "supplemental_local", content: "低频功率放大和火灾报警案例展示从输入检测、信号放大与比较，到功率驱动或报警输出的功能链路。" },
          { id: "analog-11-s4", title: "自动增益控制与电容测量案例", importance: "core", sourceStatus: "supplemental_local", content: "自动增益控制电路包含输出检测、控制量生成和可控增益闭环；电容测量电路把未知电容转换为便于比较或显示的电压、频率等量。" },
          { id: "analog-11-s5", title: "跨级接口复核", importance: "optional", sourceStatus: "supplemental_local", content: "完成模块识别后，进一步核对级间负载、共地与隔离、反馈极性、器件工作区和电源余量，可用于发现局部正确但整机失效的读图错误。" }
        ],
        examples: [{ title: "综合电路读图顺序", prompt: "面对一张包含传感器、运放、比较器和继电器驱动级的报警电路，应先从哪里开始？", steps: ["标出电源、地、输入传感器和最终执行器", "沿信号流划分调理、比较和驱动模块", "分别检查各模块直流工作条件与接口", "追踪输出回到输入的路径，判断是否存在反馈"], answer: "先建立整机信号链和功能分块，再进入局部计算；不要从任意一个元件孤立地开始。" }],
        experiments: [{ id: "analog-11-exp", title: "综合电路功能分块", workbench: "analog", goal: "在空白画布上按读图步骤复现一个简化信号调理链路，验证元件分组、端口和主干连接。", steps: ["放置信号源、运放符号、二极管、负载和电源/接地", "按输入、调理、比较/转换、输出四段排列并连接主干", "逐段检查输入输出端与电源回路", "保存电路并用文字说明各段功能"], expected: "得到一张可保存、可重新载入且信号流明确的拓扑图，并能按顺序解释每个功能块。", limitation: "工作台不具备原理图识别、自动功能分块或二极管、运放非线性求解能力。" }],
        check: [
          { id: "analog-11-q1", prompt: "阅读综合模拟电路图时，合理的第一步是？", options: ["先算任意电阻", "标出电源、地、输入输出并按信号流分块", "立即运行未知模型", "只看元件数量"], answer: 1, explanation: "先建立供电、端口和功能模块，才能把局部分析放回整机关系。" },
          { id: "analog-11-q2", prompt: "完成局部模块分析后还必须复核什么？", options: ["级间接口、反馈极性和工作范围", "社交分享次数", "文件名长度", "课程日期"], answer: 0, explanation: "模块单独正确并不保证连接后仍满足负载、极性和工作区条件。" }
        ],
        summary: ["读图先看整体信号链，再分析局部基本电路。", "直流通路、交流通路、反馈路径和级间接口要分别核对。", "综合案例的学习证据是能按模块解释功能并指出关键约束。"],
        tags: ["电路读图", "功能分块", "信号流", "综合分析"]
      }
    ]
  };

  // ../codex_projects/personal-workbench-sites/app/data/courses/digital.ts
  var digitalCourse = {
    id: "digital",
    title: "数字电子技术",
    shortTitle: "数电",
    textbook: "阎石《数字电子技术基础》第六版",
    sourceNote: "教材主线为阎石《数字电子技术基础》第六版；第 1–6 章配有分章笔记，第 3、4、6 章另有 SystemVerilog/ModelSim 工程。第 7、8 章以教材为准。",
    role: "把二值信息变成可分析、可组合、可记忆并可控制的逻辑系统。",
    accent: "#9fa6ae",
    chapters: [
      {
        id: "digital-01",
        number: "1",
        title: "数制和码制",
        counted: true,
        sourceStatus: "verified_local",
        objectives: ["完成二、八、十、十六进制之间的转换", "使用补码表达和计算带符号数", "区分数制、码制并解释 BCD 与格雷码的用途"],
        prerequisites: ["整数与小数的位权表示", "基本加减运算"],
        sections: [
          { id: "digital-01-s1", title: "位权与常用数制", importance: "core", sourceStatus: "verified_local", content: "按位权展开数值；二进制、八进制、十进制和十六进制只是同一数量的不同表示。", formula: "N=\\sum_i d_i r^i", variables: ["r：基数", "d_i：第 i 位数字"] },
          { id: "digital-01-s2", title: "数制转换", importance: "core", sourceStatus: "verified_local", content: "整数部分可连续除基取余，小数部分可连续乘基取整；二进制与八、十六进制可按三位或四位分组。" },
          { id: "digital-01-s3", title: "二进制运算与带符号表示", importance: "core", sourceStatus: "verified_local", content: "无符号二进制加减遵循逢二进一、借一当二，乘法由移位和部分积相加构成，除法由比较、减法和移位反复完成。带符号数需区分原码、反码和补码；定长补码把减法统一为加法，但运算前必须确认字长、符号扩展和溢出条件。", formula: "\\text{n位补码范围}:\\quad -2^{n-1}\\le N\\le 2^{n-1}-1", variables: ["n：固定字长", "N：可表示的有符号整数"] },
          { id: "digital-01-s4", title: "常用编码与校验", importance: "core", sourceStatus: "verified_local", content: "8421 BCD 用四位表示一位十进制数；格雷码相邻代码只改变一位，可降低转换瞬间的多位竞争。奇偶校验在数据中增加一位，使全码字中 1 的个数保持偶数或奇数，可检测任意奇数个比特错误，但不能定位错误，也不能保证发现偶数位同时翻转。" },
          { id: "digital-01-s5", title: "低频编码扩展", importance: "optional", sourceStatus: "supplemental_local", content: "ASCII、余 3 码、2421 码和哈夫曼编码可作扩展，但不是后续逻辑电路分析的共同前置。" }
        ],
        examples: [{ title: "十进制转补码", prompt: "用 8 位补码表示 -13。", steps: ["13 的 8 位二进制为 00001101", "逐位取反得到 11110010", "最低位加 1 得到 11110011"], answer: "-13 的 8 位补码为 11110011。" }],
        experiments: [{ id: "digital-01-exp", title: "四位开关数值观察", workbench: "digital", goal: "验证四位二进制从 0000 到 1111 与十六进制 0 到 F 的一一对应。", steps: ["放置四个开关和四个 LED", "依次切换 0000、0101、1010、1111", "记录探针位序和对应数值"], expected: "LED 与探针稳定显示输入位型，四位组合分别对应 0、5、A、F。", limitation: "无独立 HDL 工程；工作台只验证位型与码值。" }],
        check: [
          { id: "digital-01-q1", prompt: "二进制 101101 对应十六进制数是？", options: ["2D", "3A", "5B", "6D"], answer: 0, explanation: "从右向左四位分组为 0010 1101，即 2D。" },
          { id: "digital-01-q2", prompt: "格雷码适合位置编码的主要原因是？", options: ["每位权值相同", "相邻代码只改变一位", "可以直接做十进制加法", "不需要逻辑门"], answer: 1, explanation: "相邻位置只改变一位可减少多位同时翻转造成的瞬态误码。" }
        ],
        summary: ["数制描述数量，码制描述信息的编码规则。", "补码运算必须和固定字长一起理解。", "常用转换和编码是逻辑代数、组合电路的前置。"],
        tags: ["数制", "补码", "BCD", "格雷码"]
      },
      {
        id: "digital-02",
        number: "2",
        title: "逻辑代数基础",
        counted: true,
        sourceStatus: "verified_local",
        objectives: ["写出基本与复合逻辑运算", "在真值表、逻辑式和逻辑图之间转换", "用公式法和卡诺图化简逻辑函数"],
        prerequisites: ["第 1 章二值表示", "集合与代数式的基本操作"],
        sections: [
          { id: "digital-02-s1", title: "基本与复合逻辑", importance: "core", sourceStatus: "verified_local", content: "与、或、非是基本运算；与非、或非、异或和同或由基本运算组合得到。" },
          { id: "digital-02-s2", title: "基本公式与定理", importance: "core", sourceStatus: "verified_local", content: "交换、结合、分配、吸收和德摩根关系用于等价变换。化简时每一步都必须保持真值不变；反演需同时互换与/或以及 0/1，对偶只替换运算和常量而不反演变量。", formula: "\\overline{AB}=\\overline{A}+\\overline{B},\\qquad \\overline{A+B}=\\overline{A}\\,\\overline{B}", variables: ["A、B：逻辑变量", "上横线：逻辑非", "相邻或中点：逻辑与", "+：逻辑或"] },
          { id: "digital-02-s3", title: "逻辑函数表示", importance: "core", sourceStatus: "verified_local", content: "真值表、逻辑表达式和逻辑图描述同一输入输出关系；最小项与最大项构成标准形式。" },
          { id: "digital-02-s4", title: "卡诺图与无关项", importance: "core", sourceStatus: "verified_local", content: "按相邻项合并消去变量；无关项可按有利于化简的方式取 0 或 1，但不能改变约束内行为。" },
          { id: "digital-02-s5", title: "逻辑函数形式变换与多输出共享", importance: "core", sourceStatus: "verified_local", content: "同一逻辑函数可在与—或、或—与、与非—与非、或非—或非等形式间变换。先用两次取反保持函数不变，再用德摩根定理把运算层级整体转换；多输出电路还应保留可共享的公共乘积项，不能只追求单个输出最简。" },
          { id: "digital-02-s6", title: "Q-M 法", importance: "optional", sourceStatus: "supplemental_local", content: "Q-M 法用编码和表格系统合并最小项，适合变量较多、卡诺图不便时使用；主线仍要求能解释每次合并消去哪个变量。" }
        ],
        examples: [{ title: "卡诺图化简", prompt: "化简 F(A,B,C)=Σm(1,3,5,7)。", steps: ["四个最小项都满足 C=1", "在三变量卡诺图中四格可合为一组", "A、B 在组内变化并被消去"], answer: "F=C。" }],
        experiments: [{ id: "digital-02-exp", title: "等价逻辑式验证", workbench: "digital", goal: "用真值表验证德摩根关系 ¬(A·B)=¬A+¬B。", steps: ["搭建与非门支路", "搭建两个非门接或门支路", "遍历 A、B 四种组合并比较输出"], expected: "两条支路在四种输入下输出完全一致。", limitation: "无独立化简实验工程；工作台用真值表逐行核对等价性。" }],
        check: [
          { id: "digital-02-q1", prompt: "A+A·B 化简为？", options: ["A", "B", "A+B", "A·B"], answer: 0, explanation: "由吸收律 A+A·B=A。" },
          { id: "digital-02-q2", prompt: "卡诺图中两个相邻最小项合并后会怎样？", options: ["增加一个变量", "消去一个变化变量", "改变函数真值", "必须引入异或"], answer: 1, explanation: "相邻项仅一位不同，合并后该变化变量被消去。" }
        ],
        summary: ["逻辑代数提供数字电路的统一描述语言。", "卡诺图是本课程主线化简工具。", "化简结果必须保持规定输入范围内的逻辑等价。"],
        tags: ["布尔代数", "卡诺图", "最小项", "德摩根"]
      },
      {
        id: "digital-03",
        number: "3",
        title: "门电路",
        counted: true,
        sourceStatus: "verified_local",
        objectives: ["识别常用门的逻辑符号和真值表", "说明 CMOS 与 TTL 门的基本接口含义", "根据电平和负载判断门电路连接是否合理"],
        prerequisites: ["第 2 章逻辑运算", "二极管、三极管和 MOS 管的开关概念"],
        sections: [
          { id: "digital-03-s1", title: "二极管、三极管与基本门", importance: "core", sourceStatus: "verified_local", content: "先用器件开关状态解释与、或、非的实现，再用真值表检查逻辑功能；器件导通条件决定实际电平与负载能力。" },
          { id: "digital-03-s2", title: "CMOS 门电路", importance: "core", sourceStatus: "verified_local", content: "CMOS 反相器由互补 MOS 管构成，主线包括结构、静态特性、动态特性以及输入端和输出端的正确使用。" },
          { id: "digital-03-s3", title: "TTL 门电路", importance: "core", sourceStatus: "verified_local", content: "TTL 主线从双极型三极管开关特性进入反相器，继续比较静态输入输出特性、动态特性、其他门型和数字集成系列。" },
          { id: "digital-03-s4", title: "逻辑电平与接口", importance: "core", sourceStatus: "verified_local", content: "逻辑 0/1 是允许的电压区间；连接 CMOS、TTL 或不同电平电路时，要同时核对输入阈值、输出电平、电流能力和扇出。" },
          { id: "digital-03-s5", title: "ECL 与 Bi-CMOS", importance: "optional", sourceStatus: "verified_local", content: "ECL 和 Bi-CMOS 用于理解速度、功耗和工艺折中；它们不作为后续组合与时序分析的共同前置。" }
        ],
        examples: [{ title: "用与非门实现非门", prompt: "只用一个二输入与非门实现 Y=¬A。", steps: ["把与非门两个输入端同时接到 A", "门内先得到 A·A=A", "输出取反"], answer: "Y=¬(A·A)=¬A。" }],
        experiments: [{ id: "digital-03-exp", title: "通用门搭建", workbench: "digital", goal: "验证仅用与非门实现非、与、或三种功能。", steps: ["用并接输入实现非门", "在与非输出后再接与非反相得到与门", "按德摩根关系搭建或门", "运行真值表"], expected: "三种搭建分别与标准非、与、或门真值表一致。", limitation: "Appendix_code 提供 inv.sv、gates.sv、and8.sv 与 tristate.sv；工作台不执行 HDL，也不模拟 CMOS/TTL 电气参数。" }],
        check: [
          { id: "digital-03-q1", prompt: "为什么说与非门是通用门？", options: ["它没有延迟", "它能独立构成任意组合逻辑", "它只需一个输入", "它输出模拟量"], answer: 1, explanation: "用与非门可构造非、与、或，进而构造任意组合逻辑。" },
          { id: "digital-03-q2", prompt: "逻辑高电平应理解为？", options: ["唯一固定电压", "器件允许的高电平电压区间", "任意正电压", "始终等于电源电压"], answer: 1, explanation: "数字器件用输入输出电平范围定义逻辑状态。" }
        ],
        summary: ["门电路把逻辑运算落到可连接的器件接口。", "真值表之外还要检查电平、负载和延迟。", "CMOS/TTL 是主线，早期逻辑族作为选择学习。"],
        tags: ["逻辑门", "CMOS", "TTL", "噪声容限"]
      },
      {
        id: "digital-04",
        number: "4",
        title: "组合逻辑电路",
        counted: true,
        sourceStatus: "verified_local",
        objectives: ["按真值表完成组合电路分析和设计", "使用编码器、译码器、数据选择器和加法器", "识别竞争冒险并说明基本处理思路"],
        prerequisites: ["第 2 章逻辑函数化简", "第 3 章门电路"],
        sections: [
          { id: "digital-04-s1", title: "分析与设计流程", importance: "core", sourceStatus: "verified_local", content: "组合电路输出只由当前输入决定；分析从电路到逻辑式和真值表，设计按需求、真值表、化简、实现推进。" },
          { id: "digital-04-s2", title: "编码器与译码器", importance: "core", sourceStatus: "verified_local", content: "编码器把有效输入转换为代码；译码器执行相反映射，并可实现最小项输出。" },
          { id: "digital-04-s3", title: "数据选择与比较", importance: "core", sourceStatus: "verified_local", content: "数据选择器按选择端转发一路输入；数值比较器产生大于、等于、小于关系。" },
          { id: "digital-04-s4", title: "算术电路", importance: "core", sourceStatus: "verified_local", content: "半加器处理两个一位数，全加器还接收低位进位。多位加法器逐级连接全加器；功能核对要同时检查和位与进位，速度分析则要关注进位传播路径。", formula: "S=A\\oplus B\\oplus C_{in},\\qquad C_{out}=AB+C_{in}(A\\oplus B)", variables: ["A、B：本位加数", "C_in：低位输入进位", "S：本位和", "C_out：高位输出进位"] },
          { id: "digital-04-s5", title: "可编程逻辑器件与 HDL", importance: "core", sourceStatus: "verified_local", content: "PLD 用可编程互连和逻辑资源实现组合功能，HDL 则用并行、可综合的描述表达硬件。最小组合模块应明确输入、输出和连续赋值，例如 assign y = (a & b) | c；综合后仍需用真值表或测试平台逐组验证，代码语句的书写顺序不代表门按软件顺序执行。" },
          { id: "digital-04-s6", title: "层次设计与竞争冒险", importance: "optional", sourceStatus: "supplemental_local", content: "层次化设计用已验证模块搭建更大电路；竞争冒险来自不同路径延迟不一致，可通过增加一致项、同步采样或重新分配路径处理。" }
        ],
        examples: [{ title: "一位全加器", prompt: "A=1、B=1、Cin=0 时求和 S 与进位 Cout。", steps: ["三个输入中有两个为 1", "奇偶关系给出 S=0", "至少两个输入为 1，产生进位"], answer: "S=0，Cout=1。" }],
        experiments: [{ id: "digital-04-exp", title: "一位全加器", workbench: "digital", goal: "验证全加器八行真值表和进位关系。", steps: ["放置三个开关作为 A、B、Cin", "用异或、与、或门搭建 S 与 Cout", "连接两个 LED", "运行全部输入组合"], expected: "S=A⊕B⊕Cin；任意两个或三个输入为高时 Cout=1。", presetId: "digital-full-adder", limitation: "Appendix_code 含 fulladder、mux、decoder 及对应测试文件；工作台仅验证逻辑关系，不执行 ModelSim 编译。" }],
        check: [
          { id: "digital-04-q1", prompt: "组合逻辑电路输出由什么决定？", options: ["仅当前输入", "仅上一时刻状态", "时钟频率", "存储单元"], answer: 0, explanation: "理想组合电路没有内部状态，输出由当前输入确定。" },
          { id: "digital-04-q2", prompt: "3-8 译码器有多少个基本输出？", options: ["3", "6", "8", "16"], answer: 2, explanation: "3 位输入共有 2³=8 种组合。" }
        ],
        summary: ["组合电路遵循需求到真值表再到实现的固定流程。", "常用模块可以复用并层次化组合。", "完成逻辑正确性后再检查延迟和冒险。"],
        tags: ["组合逻辑", "译码器", "多路选择器", "加法器"]
      },
      {
        id: "digital-05",
        number: "5",
        title: "半导体存储电路",
        counted: true,
        sourceStatus: "verified_local",
        objectives: ["解释锁存器和触发器保存一位状态的方式", "区分寄存器、RAM 与 ROM 的用途", "用时序波形检查存储电路的状态变化"],
        prerequisites: ["第 3 章门电路", "基本时序波形阅读"],
        sections: [
          { id: "digital-05-s1", title: "SR 锁存器", importance: "core", sourceStatus: "verified_local", content: "交叉耦合门形成反馈并保存状态；使用时必须识别置位、复位、保持和禁用输入组合。" },
          { id: "digital-05-s2", title: "触发器", importance: "core", sourceStatus: "verified_local", content: "D、JK、T 触发器只在规定的有效时钟条件下更新状态。分析时先确认触发沿和异步置位/复位，再把有效沿到来前的输入、现态代入特性方程求次态。", formula: "Q_D^+=D,\\qquad Q_{JK}^+=J\\overline{Q}+\\overline{K}Q,\\qquad Q_T^+=T\\oplus Q", variables: ["Q：有效沿前现态", "Q^+：有效沿后次态", "D、J、K、T：触发器输入"] },
          { id: "digital-05-s3", title: "寄存器", importance: "core", sourceStatus: "verified_local", content: "多个触发器按统一时钟保存多位数据；并行和移位方式决定数据进入、传递和输出。" },
          { id: "digital-05-s4", title: "RAM 与 ROM", importance: "core", sourceStatus: "verified_local", content: "随机存储器按地址读写，SRAM 与 DRAM 的单元结构和刷新要求不同；只读存储器用于保存固定或可编程内容。" },
          { id: "digital-05-s5", title: "容量扩展与逻辑函数实现", importance: "optional", sourceStatus: "verified_local", content: "教材进一步讨论存储器的字扩展、位扩展以及用存储器实现组合逻辑函数，适合在基本读写关系之后选择学习。" }
        ],
        examples: [{ title: "D 触发器状态更新", prompt: "上升沿到来前 D=1，当前 Q=0；上升沿后 Q 为何值？", steps: ["D 触发器只在有效边沿采样", "有效边沿处 D=1", "采样值写入 Q"], answer: "上升沿后 Q=1，并保持到下一次有效更新。" }],
        experiments: [{ id: "digital-05-exp", title: "D 触发器采样", workbench: "digital", goal: "验证 D 触发器只在有效时钟边沿更新输出。", steps: ["放置开关、时钟、D 触发器和 LED", "在两个时钟边沿之间改变 D", "用逻辑分析仪同时观察 D、CLK、Q"], expected: "Q 不跟随边沿之间的 D 变化，只在有效边沿复制 D。", presetId: "digital-d-flipflop", limitation: "latch.sv、flop.sv 提供触发器对照，Modelsim.md 含 RAM/ROM 示例；无独立存储器工程，工作台只验证 D 触发器边沿行为。" }],
        check: [
          { id: "digital-05-q1", prompt: "寄存器保存 8 位数据至少需要几个一位存储单元？", options: ["1", "4", "8", "16"], answer: 2, explanation: "每个一位存储单元保存一位，8 位至少需要 8 个。" },
          { id: "digital-05-q2", prompt: "D 触发器在非有效边沿期间通常怎样？", options: ["持续反相", "保持原状态", "强制清零", "输出高阻"], answer: 1, explanation: "没有有效触发条件时，状态保持。" }
        ],
        summary: ["反馈使组合门获得保存状态的能力。", "触发条件决定何时允许状态更新。", "存储器器件细节是选择学习，基本读写关系是主线。"],
        tags: ["锁存器", "触发器", "寄存器", "存储器"]
      },
      {
        id: "digital-06",
        number: "6",
        title: "时序逻辑电路",
        counted: true,
        sourceStatus: "verified_local",
        objectives: ["根据状态表、状态图和方程分析时序电路", "设计基础计数器与移位寄存器", "用逻辑分析仪核对状态转移"],
        prerequisites: ["第 4 章组合逻辑", "第 5 章触发器"],
        sections: [
          { id: "digital-06-s1", title: "状态描述与分析", importance: "core", sourceStatus: "verified_local", content: "时序电路输出与当前输入和已有状态有关。分析时依次写出触发器驱动方程、次态方程和输出方程，再列状态表、画状态图并按时钟条件核对时序图，不能跳过不可达状态检查。", formula: "Q^+=F(Q,X),\\qquad Y_{Mealy}=G(Q,X),\\qquad Y_{Moore}=G(Q)", variables: ["Q：现态向量", "X：输入向量", "Q^+：次态向量", "Y：输出向量"] },
          { id: "digital-06-s2", title: "移位寄存器与计数器", importance: "core", sourceStatus: "verified_local", content: "移位寄存器按时钟移动数据；计数器按规定状态序列循环，分析时要区分同步、异步结构和有效模值。" },
          { id: "digital-06-s3", title: "顺序脉冲与序列信号", importance: "core", sourceStatus: "verified_local", content: "顺序脉冲发生器依次产生节拍信号，序列信号发生器按状态输出规定码序；两者都可用状态转移统一分析。" },
          { id: "digital-06-s4", title: "同步时序电路设计", importance: "core", sourceStatus: "verified_local", content: "设计从逻辑要求出发，经历状态定义、状态化简与编码、触发器选择、方程求取和自启动检查，再落到电路实现。" },
          { id: "digital-06-s5", title: "可编程逻辑、HDL 与竞争冒险", importance: "optional", sourceStatus: "verified_local", content: "教材包含可编程逻辑和 Verilog HDL 实现，并讨论时序电路中的竞争冒险；计数器、同步器和 FSM 可继续用 HDL 实现。" }
        ],
        examples: [{ title: "三位二进制计数", prompt: "三位加一计数器当前状态为 111，下一状态是什么？", steps: ["三位计数器共有 8 个状态", "111 对应十进制 7", "加一后按模 8 回绕"], answer: "下一状态为 000。" }],
        experiments: [{ id: "digital-06-exp", title: "三位同步计数器", workbench: "digital", goal: "观察 000→111 的状态序列和同步翻转。", steps: ["放置时钟、三位计数器、三个 LED", "将时钟调到 1 Hz", "连接逻辑分析仪", "运行九个上升沿"], expected: "输出按 000、001、010、011、100、101、110、111、000 循环。", presetId: "digital-counter-3bit", limitation: "Appendix_code 含 counter、sync、divideby3FSM；vending_machine 含状态机、消抖和数码管驱动。工作台使用理想逻辑模型。" }],
        check: [
          { id: "digital-06-q1", prompt: "时序逻辑与组合逻辑的关键区别是？", options: ["是否使用二进制", "是否含状态记忆", "是否使用逻辑门", "是否有输入"], answer: 1, explanation: "时序电路具有由存储单元保存的状态。" },
          { id: "digital-06-q2", prompt: "模 10 计数器需要多少个有效状态？", options: ["4", "8", "10", "16"], answer: 2, explanation: "模值就是一个循环内的有效状态数。" }
        ],
        summary: ["状态是时序逻辑的核心。", "分析必须同时考虑组合转移逻辑和触发器时钟条件。", "计数器、寄存器和 FSM 都可用状态转移统一描述。"],
        tags: ["时序逻辑", "计数器", "移位寄存器", "FSM"]
      },
      {
        id: "digital-07",
        number: "7",
        title: "脉冲波形的产生和整形",
        counted: true,
        sourceStatus: "verified_local",
        objectives: ["用周期、频率、脉宽、上升/下降时间和占空比描述矩形脉冲", "区分施密特触发、单稳态和多谐振荡电路的作用", "说明 555 定时器构成整形、延时和振荡电路的基本路径"],
        prerequisites: ["第 3 章门电路的传输延迟概念", "第 5 章触发器", "RC 暂态基础"],
        sections: [
          { id: "digital-07-s1", title: "矩形脉冲参数", importance: "core", sourceStatus: "verified_local", content: "周期 T 与频率 f 互为倒数；还要区分幅度、脉宽、上升时间、下降时间和占空比，不能只用高低电平描述波形。", formula: "f=\\frac{1}{T},\\qquad q=\\frac{t_w}{T}", variables: ["T：脉冲周期", "t_w：脉冲宽度", "q：占空比"] },
          { id: "digital-07-s2", title: "施密特触发电路", importance: "core", sourceStatus: "verified_local", content: "施密特触发电路具有不同的上升与下降转换阈值，并借助正反馈形成陡峭边沿，可用于波形整形和抑制阈值附近的噪声抖动。" },
          { id: "digital-07-s3", title: "单稳态电路", importance: "core", sourceStatus: "verified_local", content: "单稳态电路有稳态和暂稳态；外触发使电路进入暂稳态，保持时间主要由电路参数决定，随后自动回到稳态。" },
          { id: "digital-07-s4", title: "多谐振荡电路", importance: "core", sourceStatus: "verified_local", content: "多谐振荡电路没有稳定状态，依靠反馈与充放电过程自行交替翻转，可连续产生矩形脉冲；教材比较对称、非对称、环形和石英晶体结构。" },
          { id: "digital-07-s5", title: "555 定时器及其应用", importance: "core", sourceStatus: "verified_local", content: "555 定时器内部含三只等值分压电阻、两个比较器、SR 锁存器和放电开关，典型阈值为 1/3VCC 与 2/3VCC。单稳态中电容从 0 充至 2/3VCC 决定暂稳时间；无稳态接法中电容经 RA+RB 充电、经 RB 放电，输出连续翻转。", formula: "t_w\\approx1.1RC,\\qquad f\\approx\\frac{1.44}{(R_A+2R_B)C},\\qquad q\\approx\\frac{R_A+R_B}{R_A+2R_B}", variables: ["t_w：单稳态输出脉宽", "f：无稳态振荡频率", "q：输出高电平占空比"] },
          { id: "digital-07-s6", title: "暂态推导与非理想影响", importance: "optional", sourceStatus: "verified_local", content: "选择学习电容充放电的完整指数暂态推导，以及比较器传播延迟、阈值误差、放电管压降和电容漏电对脉宽、频率与占空比的修正。" }
        ],
        examples: [{ title: "由周期求频率与占空比", prompt: "矩形脉冲周期 T=2 ms，高电平宽度 t_w=0.5 ms，求频率与占空比。", steps: ["把周期换算为 0.002 s", "由 f=1/T 得到 500 Hz", "由 q=t_w/T 得到 0.25"], answer: "频率为 500 Hz，占空比为 25%。" }],
        experiments: [{ id: "digital-07-exp", title: "时钟参数观察", workbench: "digital", goal: "核对时钟频率设置与逻辑分析仪显示周期的一致性。", steps: ["放置时钟和逻辑探针", "设置 1 Hz 后观察两个周期", "改为 2 Hz 并再次测量"], expected: "1 Hz 周期约 1 s，2 Hz 周期约 0.5 s。", limitation: "无对应独立实验工程；工作台没有 RC、阈值或 555 器件模型，只能验证理想时钟参数。" }],
        check: [
          { id: "digital-07-q1", prompt: "周期为 4 ms 的矩形脉冲频率是多少？", options: ["25 Hz", "250 Hz", "400 Hz", "4 kHz"], answer: 1, explanation: "f=1/T=1/0.004=250 Hz。" },
          { id: "digital-07-q2", prompt: "施密特触发电路适合把缓慢、带噪声的边沿整形成矩形脉冲，关键原因是？", options: ["只有一个转换阈值", "具有回差并通过正反馈快速转换", "能够存储多位数据", "输出始终为高阻"], answer: 1, explanation: "不同方向的转换阈值形成回差，正反馈使状态切换迅速。" }
        ],
        summary: ["先用参数定量描述脉冲，再区分整形、延时与自激振荡。", "施密特有回差，单稳态有一个稳态，多谐振荡没有稳态。", "555 可通过不同外接网络实现整形、延时和振荡。"],
        tags: ["脉冲", "施密特", "单稳态", "555"]
      },
      {
        id: "digital-08",
        number: "8",
        title: "数-模和模-数转换",
        counted: true,
        sourceStatus: "verified_local",
        objectives: ["说明 D/A 与 A/D 的转换方向和基本过程", "分析权电阻、倒 T 形电阻和权电流 D/A 的位权叠加", "比较并联比较、逐次逼近和双积分 A/D，并解释取样、保持与量化"],
        prerequisites: ["第 1 章数制与位权", "第 4 章组合逻辑", "模拟电压与运放基础"],
        sections: [
          { id: "digital-08-s1", title: "D/A 电路结构与原理", importance: "core", sourceStatus: "verified_local", content: "D/A 用各位数字码控制支路电流或电压并按二进制权重叠加；教材主线包括权电阻、倒 T 形电阻、权电流和开关树结构。" },
          { id: "digital-08-s2", title: "D/A 精度与速度", importance: "core", sourceStatus: "verified_local", content: "分辨率、偏移误差、增益误差、积分/微分非线性和建立时间分别说明可分辨码阶、实际特性对理想特性的偏差以及输出进入规定误差带所需时间。开关树型 D/A 用译码控制等值支路，减少大范围电阻比，但开关导通电阻和时序偏差仍会影响精度。", formula: "\\text{理想相对分辨率}=\\frac{1}{2^n-1}", variables: ["n：D/A 位数", "建立时间：码字变化后输出进入规定误差带所需时间"] },
          { id: "digital-08-s3", title: "A/D 基本过程与取样保持", importance: "core", sourceStatus: "verified_local", content: "A/D 依次完成取样、保持、量化和编码。取样频率先满足带限信号的采样条件，保持电路再在转换期间维持输入近似不变；n 位量化把满量程划分为 2ⁿ 个代码区间。", formula: "f_s\\ge 2f_{max},\\qquad \\Delta=\\frac{FS}{2^n}", variables: ["f_s：采样频率", "f_max：输入最高有效频率", "FS：满量程范围", "Δ：理想量化间隔", "n：转换位数"] },
          { id: "digital-08-s4", title: "常用 A/D 转换器", importance: "core", sourceStatus: "verified_local", content: "并联比较型速度快但比较器数量多；逐次逼近型逐位试探；双积分型先对输入积分再用基准反向积分，适合重视抗干扰和精度的测量。" },
          { id: "digital-08-s5", title: "A/D 精度与转换速度", importance: "core", sourceStatus: "verified_local", content: "A/D 除分辨率外还要检查量化误差、偏移误差、增益误差、微分/积分非线性、转换时间和最高转换速率。理想均匀量化的量化误差限制在半个量化间隔内；速度指标必须与输入带宽、采样保持时间和接口读取时序一起核对。", formula: "|e_q|\\le\\frac{\\Delta}{2},\\qquad f_{conv,max}\\lesssim\\frac{1}{t_{conv}}", variables: ["e_q：理想量化误差", "Δ：量化间隔", "t_conv：一次转换所需时间", "f_conv,max：理想最高转换速率"] },
          { id: "digital-08-s6", title: "流水线、Σ-Δ 与 V-F 型", importance: "optional", sourceStatus: "verified_local", content: "教材把流水线、Σ-Δ 和 V-F 型列为扩展结构；学习重点是分级转换、过采样噪声整形以及电压到频率再计数的基本思路。" }
        ],
        examples: [{ title: "理想三位 DAC 码值比例", prompt: "若只比较理想满量程比例，三位码 101 对应总量程的多少？", steps: ["101₂=5", "三位共有 2³=8 个等分码阶", "按理想码值比例取 5/8"], answer: "对应理想量程比例 5/8；实际端点定义和电路增益需以具体模型为准。" }],
        experiments: [{ id: "digital-08-exp", title: "三位代码阶梯观察", workbench: "digital", goal: "观察数字码递增形成的离散阶梯并核对代码顺序。", steps: ["放置三位计数器和代码探针", "将时钟设为 1 Hz", "记录 000 到 111 的码值序列", "跳转模拟工作台比较连续信号概念"], expected: "代码按八个离散状态循环。", limitation: "无对应独立实验工程；工作台不求解模拟电压、量化误差、建立时间或采样过程。" }],
        check: [
          { id: "digital-08-q1", prompt: "ADC 的转换方向是？", options: ["数字量到模拟量", "模拟量到数字码", "交流到直流", "串行到并行"], answer: 1, explanation: "ADC 将模拟输入量化并编码为数字码。" },
          { id: "digital-08-q2", prompt: "三位理想量化器有多少个代码状态？", options: ["3", "6", "8", "16"], answer: 2, explanation: "n 位共有 2ⁿ 个代码状态，三位为 8。" }
        ],
        summary: ["D/A 由数字权重叠加得到模拟量，A/D 经过取样、保持、量化和编码得到数字码。", "结构选择要同时比较分辨率、误差、转换速度和电路规模。", "实际转换性能还取决于基准、模拟前端和器件参数。"],
        tags: ["ADC", "DAC", "R-2R", "量化"]
      }
    ]
  };

  // ../codex_projects/personal-workbench-sites/app/data/courses/signals.ts
  var signalsCourse = {
    id: "signals",
    title: "信号与系统",
    shortTitle: "信号与系统",
    textbook: "赵光宙《信号分析与处理》第3版",
    sourceNote: "教材主线为赵光宙《信号分析与处理》第3版；配套课件用于章节复习，开放演示用于数值验证。",
    role: "描述信号、分析系统响应，并连接采样、频谱与滤波。",
    accent: "#c5c9ce",
    chapters: [
      {
        id: "signals-intro",
        number: "绪论",
        title: "信号分析与处理概览",
        counted: false,
        sourceStatus: "verified_local",
        objectives: [
          "区分信号、系统、分析与处理四个基本概念。",
          "按时间、自变量取值和确定性对信号作基本分类。",
          "说清输入信号、处理系统和输出信号之间的关系。"
        ],
        prerequisites: ["函数与坐标图", "复数和正弦量的基础表示"],
        sections: [
          {
            id: "signals-intro-concept",
            title: "信号的概念",
            importance: "core",
            sourceStatus: "verified_local",
            content: "信号是承载信息的物理量或其数学表示。连续时间信号写作 x(t)，离散时间信号写作 x[n]；表示方式不同，但都应明确自变量、幅值和单位。"
          },
          {
            id: "signals-intro-classification",
            title: "信号的分类",
            importance: "core",
            sourceStatus: "verified_local",
            content: "分类时分别检查连续/离散、周期/非周期、确定/随机、能量/功率。不同维度可以同时成立，不能用一个标签代替全部性质。",
            formula: "E=\\int_{-\\infty}^{\\infty}|x(t)|^2\\,dt,\\qquad P=\\lim_{T\\to\\infty}\\frac{1}{2T}\\int_{-T}^{T}|x(t)|^2\\,dt",
            variables: ["E：信号总能量", "P：平均功率", "T：对称观察区间的半长度"]
          },
          {
            id: "signals-intro-analysis-processing",
            title: "信号分析与信号处理",
            importance: "core",
            sourceStatus: "verified_local",
            content: "信号分析回答“信号由什么组成、具有哪些性质”；信号处理回答“怎样把输入变成满足目标的输出”。时域、频域和复频域是互补视角。"
          },
          {
            id: "signals-intro-system",
            title: "信号处理系统",
            importance: "core",
            sourceStatus: "verified_local",
            content: "系统把输入映射为输出，记为 y = T{x}。建模时先写清输入、输出、参数和边界条件，再讨论系统是否线性、时不变、因果和稳定。",
            formula: "y=\\mathcal{T}\\{x\\}",
            variables: ["x：输入信号", "T：系统或处理规则", "y：输出信号"]
          },
          {
            id: "signals-intro-course-context",
            title: "课程定位与应用场景",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "信号分析与处理广泛用于测量、控制、通信和故障诊断，常见任务包括特征提取、滤波、估计与系统响应分析。"
          }
        ],
        examples: [
          {
            title: "判断正弦信号的类别",
            prompt: "判断 x(t)=2cos(4πt) 是连续还是离散、是否周期，并求基波周期和平均功率。",
            steps: [
              "自变量 t 连续，因此它是连续时间信号。",
              "角频率 ω₀=4π rad/s，所以 T₀=2π/ω₀=0.5 s。",
              "正弦信号持续存在，能量发散，但平均功率为 A²/2。"
            ],
            answer: "它是连续时间周期功率信号，基波周期 0.5 s，平均功率 2。"
          }
        ],
        experiments: [
          {
            id: "signals-intro-notebook",
            title: "连续与离散信号观察",
            workbench: "notebook",
            goal: "用同一正弦函数比较连续曲线与离散采样序列，并核对周期。",
            steps: [
              "在连续信号演示中生成 x(t)=2cos(4πt)，显示 0—1.5 s。",
              "以 20 Hz 采样得到 x[n]，同时绘制 stem 图。",
              "分别测量相邻峰值间隔，记录连续时间周期和样点周期。"
            ],
            expected: "连续曲线每 0.5 s 重复；20 Hz 采样时每 10 个样点重复。",
            limitation: "演示用于数值观察，不替代教材中的定义与推导。"
          }
        ],
        check: [
          {
            id: "signals-intro-check-1",
            prompt: "离散时间信号最准确的描述是？",
            options: ["只在离散时刻定义的序列", "幅值只能取整数", "一定来自数字电路", "一定是周期信号"],
            answer: 0,
            explanation: "离散时间描述的是自变量取值离散，幅值不必离散，也不必周期。"
          },
          {
            id: "signals-intro-check-2",
            prompt: "系统关系 y=T{x} 中，T 表示什么？",
            options: ["采样周期", "系统对输入的映射规则", "信号能量", "频率变量"],
            answer: 1,
            explanation: "T 是把输入 x 映射为输出 y 的系统或处理规则。"
          }
        ],
        summary: ["先明确自变量和幅值，再给信号分类。", "分析关注性质与组成，处理关注输入到输出的变换。", "信号、系统和处理目标共同构成后续章节的分析框架。"],
        tags: ["课程导论", "信号分类", "能量与功率", "主线必学"]
      },
      {
        id: "signals-ch1",
        number: "第1章",
        title: "连续信号的分析",
        counted: true,
        sourceStatus: "verified_local",
        objectives: [
          "完成连续信号的时域运算、分解与卷积。",
          "用傅里叶级数和傅里叶变换描述频谱。",
          "用拉普拉斯变换和相关函数解决典型分析问题。"
        ],
        prerequisites: ["绪论中的信号分类", "积分、复数和欧拉公式"],
        sections: [
          {
            id: "signals-ch1-time",
            title: "连续信号的时域描述、运算与分解",
            importance: "core",
            sourceStatus: "verified_local",
            content: "掌握正弦、指数、阶跃、冲激等基本信号，以及平移、反折、尺度变换、微分、积分和卷积。冲激筛选性质使连续信号可写成移位冲激的加权叠加；系统对每个移位冲激的响应一旦已知，线性叠加就把输入分解转成卷积。",
            formula: "y(t)=x(t)*h(t)=\\int_{-\\infty}^{\\infty}x(\\tau)h(t-\\tau)\\,d\\tau",
            variables: ["x(t)：输入", "h(t)：冲激响应", "τ：积分变量", "y(t)：零状态响应"]
          },
          {
            id: "signals-ch1-frequency",
            title: "连续信号的频域分析",
            importance: "core",
            sourceStatus: "verified_local",
            content: "周期信号用傅里叶级数得到离散谱，非周期信号用连续时间傅里叶变换得到连续谱。必须能从定义推出并正确使用九类常用性质：线性、时移、频移、尺度、对称、时域微分/积分、卷积、相乘和帕塞瓦尔（Parseval）关系。性质不是口诀；每次都要核对角频率尺度、符号和积分常数。",
            formula: "\\begin{aligned}x(t-t_0)&\\leftrightarrow e^{-j\\omega t_0}X(j\\omega)\\\\x(t)e^{j\\omega_0t}&\\leftrightarrow X\\!\\left(j(\\omega-\\omega_0)\\right)\\\\x(at)&\\leftrightarrow \\frac1{|a|}X\\!\\left(j\\frac{\\omega}{a}\\right)\\\\\\frac{dx}{dt}&\\leftrightarrow j\\omega X(j\\omega)\\\\x*h&\\leftrightarrow XH,\\quad xh\\leftrightarrow\\frac1{2\\pi}X*H\\\\\\int|x(t)|^2dt&=\\frac1{2\\pi}\\int|X(j\\omega)|^2d\\omega\\end{aligned}",
            variables: ["X(jω)：连续频谱", "t₀：时移量", "ω₀：频移量", "a：时间尺度因子", "帕塞瓦尔关系：时域能量与频域能量相等"]
          },
          {
            id: "signals-ch1-laplace",
            title: "连续信号的复频域分析",
            importance: "core",
            sourceStatus: "verified_local",
            content: "拉普拉斯变换在傅里叶核外加入指数加权，使更多信号可分析。变换结果必须连同收敛域理解，极点位置可辅助判断系统特性。",
            formula: "X(s)=\\int_{0^-}^{\\infty}x(t)e^{-st}\\,dt,\\qquad s=\\sigma+j\\omega",
            variables: ["s：复频率", "σ：指数加权因子", "ω：角频率", "ROC：收敛域"]
          },
          {
            id: "signals-ch1-correlation",
            title: "信号的相关分析",
            importance: "core",
            sourceStatus: "verified_local",
            content: "相关函数衡量两个信号在不同相对时移下的相似程度。归一化相关系数把幅值缩放影响剔除，取值绝对值不超过 1；自相关峰值可用于寻找周期，互相关峰值可用于时延估计。相关定理把相关运算转成一个频谱与另一个频谱共轭的乘积。",
            formula: "\\begin{aligned}R_{xy}(\\tau)&=\\int_{-\\infty}^{\\infty}x(t)y^*(t-\\tau)\\,dt\\\\\\rho_{xy}(\\tau)&=\\frac{R_{xy}(\\tau)}{\\sqrt{R_{xx}(0)R_{yy}(0)}}\\\\\\mathcal F\\{R_{xy}\\}&=X(j\\omega)Y^*(j\\omega)\\end{aligned}",
            variables: ["Rxy：互相关函数", "ρxy：归一化相关系数", "τ：相对时移", "*：复共轭"]
          },
          {
            id: "signals-ch1-advanced",
            title: "复杂推导与 MATLAB 扩展",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "选择学习傅里叶收敛性的长证明、复杂变换性质推导及重复性的 MATLAB 命令细节；主线仍要求能用工具核对卷积与变换结果。"
          }
        ],
        examples: [
          {
            title: "两个单位矩形脉冲的卷积",
            prompt: "令 x(t)=h(t)=1（0≤t≤1），其他时刻为0，求 y(t)=x(t)*h(t)。",
            steps: [
              "卷积值等于区间 [0,1] 与 [t−1,t] 的重叠长度。",
              "0≤t≤1 时重叠长度随 t 增加，y(t)=t。",
              "1<t≤2 时重叠长度随 t 减少，y(t)=2−t；其他时刻无重叠。"
            ],
            answer: "y(t)=0（t<0）；t（0≤t≤1）；2−t（1<t≤2）；0（t>2），波形为峰值1的三角脉冲。"
          },
          {
            title: "时移性质写出频谱",
            prompt: "已知 x(t)↔X(jω)，不用重新积分，写出 x(t−2) 的傅里叶变换。",
            steps: [
              "识别这是时域右移 t₀=2，不改变频谱幅值包络。",
              "套用时移性质 x(t−t₀)↔e^(−jωt₀)X(jω)。",
              "检查指数符号：右移对应负相位斜率。"
            ],
            answer: "x(t−2)↔e^(−j2ω)X(jω)。"
          },
          {
            title: "用 Parseval 核对能量",
            prompt: "x(t)=e^(−at)u(t)，a>0。先在时域求能量，再说明频域积分应得到什么结果。",
            steps: [
              "时域能量为从 0 到 ∞ 的 e^(−2at) 积分。",
              "积分得到 E=1/(2a)。",
              "Parseval 要求 (1/2π)∫|X(jω)|²dω 与该结果相同。"
            ],
            answer: "E=1/(2a)，频域能量积分也必须等于 1/(2a)。"
          }
        ],
        experiments: [
          {
            id: "signals-ch1-convolution",
            title: "数值卷积验证三角脉冲",
            workbench: "notebook",
            goal: "验证矩形脉冲卷积的分段结果、支撑区间和峰值。",
            steps: [
              "用足够小的时间步长生成两个宽度为 1 的单位矩形脉冲。",
              "执行离散近似卷积，并乘以时间步长校正积分尺度。",
              "比较数值曲线与分段解析式，记录最大绝对误差。"
            ],
            expected: "结果支撑在 [0,2]，t=1 处峰值约为1；减小步长后误差下降。",
            limitation: "演示进行数值近似；解析分段式仍是检验依据。"
          }
        ],
        check: [
          {
            id: "signals-ch1-check-1",
            prompt: "时域卷积在连续傅里叶变换下对应什么？",
            options: ["频域相乘", "频域微分", "频域平移", "频域取共轭"],
            answer: 0,
            explanation: "卷积定理给出 x*h ↔ X·H。"
          },
          {
            id: "signals-ch1-check-2",
            prompt: "使用双边拉普拉斯变换描述信号时，除了代数式还必须给出什么？",
            options: ["采样位数", "收敛域", "矩阵阶数", "直流电源"],
            answer: 1,
            explanation: "同一代数式配合不同收敛域可能对应不同信号。"
          },
          {
            id: "signals-ch1-check-3",
            prompt: "x(t)乘以 e^(jω₀t) 后，频谱怎样变化？",
            options: ["整体向右平移 ω₀", "整体向左平移 ω₀", "幅值全部加倍", "变成时域卷积"],
            answer: 0,
            explanation: "频移性质为 x(t)e^(jω₀t)↔X(j(ω−ω₀))。"
          },
          {
            id: "signals-ch1-check-4",
            prompt: "归一化相关系数绝对值的上界是多少？",
            options: ["0", "1", "2π", "由采样率决定"],
            answer: 1,
            explanation: "由柯西—施瓦茨不等式，|ρxy(τ)|≤1。"
          },
          {
            id: "signals-ch1-check-5",
            prompt: "Parseval 关系最直接用于核对哪一项？",
            options: ["时域与频域计算得到的总能量", "采样位数", "系统是否因果", "Z 变换收敛域"],
            answer: 0,
            explanation: "Parseval 把时域平方积分与频域平方积分对应起来。"
          }
        ],
        summary: ["时域用分解与卷积解释信号如何叠加。", "频域把卷积化为乘法，复频域进一步纳入收敛与暂态。", "相关函数用于比较相似性和相对时移。"],
        tags: ["连续信号", "卷积", "傅里叶变换", "拉普拉斯变换", "相关"]
      },
      {
        id: "signals-ch2",
        number: "第2章",
        title: "离散信号的分析",
        counted: true,
        sourceStatus: "verified_local",
        objectives: [
          "解释采样、频谱复制、混叠与理想重建条件。",
          "区分 DFS、DTFT、DFT 和 FFT 的对象与用途。",
          "用 Z 变换分析离散信号和系统。"
        ],
        prerequisites: ["第1章傅里叶分析", "等比数列", "复平面基础"],
        sections: [
          {
            id: "signals-ch2-sampling",
            title: "采样、恢复与采样定理",
            importance: "core",
            sourceStatus: "verified_local",
            content: "时间采样使连续频谱以采样角频率为周期复制。对最高频率为 fmax 的带限信号，采样频率需严格高于 2fmax；工程上还要在采样器前设置模拟抗混叠低通，并为过渡带留裕量。发生混叠后，单靠提高 ADC 位数或数字滤波无法恢复已经重叠的频谱。",
            formula: "f_s>2f_{\\max}",
            variables: ["fs：采样频率", "fmax：信号最高有效频率"]
          },
          {
            id: "signals-ch2-discrete-time",
            title: "离散信号的描述与时域运算",
            importance: "core",
            sourceStatus: "verified_local",
            content: "离散序列用 x[n] 表示，基本运算包括移位、反折、尺度变化、差分、累加和卷积和。注意离散时间尺度变换不一定对所有索引有定义。",
            formula: "y[n]=\\sum_{k=-\\infty}^{\\infty}x[k]h[n-k]",
            variables: ["n：输出序号", "k：求和序号", "h[n]：单位样值响应"]
          },
          {
            id: "signals-ch2-frequency",
            title: "DFS、DTFT、DFT 与 FFT",
            importance: "core",
            sourceStatus: "verified_local",
            content: "DFS 描述周期序列，DTFT 描述一般离散时间序列且频谱连续并以 2π 为周期，DFT 给出有限长序列的有限个频域样点，FFT 则通过蝶形分解高效计算同一个 DFT。截断相当于乘窗，会造成频谱泄漏；DFT 只观察离散频点，真实峰值落在频点之间时会产生栅栏效应。增加记录长度改善频率分辨率，选择窗函数用于权衡主瓣宽度和旁瓣泄漏。",
            formula: "X[k]=\\sum_{n=0}^{N-1}x[n]e^{-j2\\pi kn/N}",
            variables: ["N：DFT 长度", "k：频率索引", "n：时间索引"]
          },
          {
            id: "signals-ch2-z",
            title: "Z 变换与收敛域",
            importance: "core",
            sourceStatus: "verified_local",
            content: "Z 变换把离散序列映射到复平面。极零点和收敛域共同决定反变换、因果性和稳定性；只写有理式而不写收敛域是不完整的。",
            formula: "X(z)=\\sum_{n=-\\infty}^{\\infty}x[n]z^{-n}",
            variables: ["z：复变量", "ROC：级数收敛的 z 平面区域"]
          },
          {
            id: "signals-ch2-fft-advanced",
            title: "FFT 实现优化与计算工具",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "主线已经要求理解 FFT 与 DFT 等价、蝶形分解和 O(NlogN) 复杂度；基2按时间/频率抽取的完整推导、缓存布局、定点缩放和重复 MATLAB 命令列为选择学习。"
          }
        ],
        examples: [
          {
            title: "判断采样后的混叠频率",
            prompt: "用 fs=1000 Hz 采样频率为 900 Hz 的正弦信号。采样序列呈现的最低等效频率是多少？",
            steps: [
              "离散角频率只在模 2π 意义下区分，频率可相差整数倍 fs。",
              "在 [0,fs/2] 内寻找等效频率：|900−1000|=100 Hz。",
              "原信号超过奈奎斯特频率 500 Hz，因此无法由样点判断它原本是 900 Hz。"
            ],
            answer: "样点呈现为 100 Hz；这是混叠，不能仅靠该采样序列恢复原 900 Hz 信号。"
          }
        ],
        experiments: [
          {
            id: "signals-ch2-aliasing",
            title: "采样率改变与混叠",
            workbench: "notebook",
            goal: "直接比较同一正弦信号在满足和不满足采样定理时的样点。",
            steps: [
              "生成 7 Hz 连续正弦参考曲线。",
              "分别以 10 Hz 和 20 Hz 采样，并绘制样点。",
              "对两组样点计算频谱峰值，比较其等效频率。"
            ],
            expected: "10 Hz 采样显示 3 Hz 混叠峰；20 Hz 采样正确显示 7 Hz。",
            limitation: "图形来自数值采样，不代表真实 ADC 的量化、孔径和前端滤波误差。"
          }
        ],
        check: [
          {
            id: "signals-ch2-check-1",
            prompt: "带限到 4 kHz 的信号，以下哪个采样频率满足严格的奈奎斯特条件？",
            options: ["4 kHz", "8 kHz", "10 kHz", "6 kHz"],
            answer: 2,
            explanation: "应满足 fs>2fmax；10 kHz 满足，8 kHz 只等于临界值。"
          },
          {
            id: "signals-ch2-check-2",
            prompt: "DFT 与 FFT 的关系是？",
            options: ["FFT 是另一种变换", "FFT 是高效计算 DFT 的算法", "DFT 只能用于模拟信号", "两者结果单位不同"],
            answer: 1,
            explanation: "FFT 不改变 DFT 的定义，只降低计算量。"
          }
        ],
        summary: ["采样把连续频谱周期复制，间隔不足会混叠。", "DTFT、DFT 和 FFT 分别对应表示、有限采样和高效计算。", "Z 变换必须结合收敛域解释。"],
        tags: ["离散信号", "采样", "DFT", "FFT", "Z变换", "信号处理桥接"]
      },
      {
        id: "signals-ch3",
        number: "第3章",
        title: "信号处理基础",
        counted: true,
        sourceStatus: "verified_local",
        objectives: [
          "判断系统的线性、时不变性、因果性与稳定性。",
          "在时域、频域和复频域求 LTI 系统响应。",
          "理解系统辨识、逆滤波和数字实现的基本限制。"
        ],
        prerequisites: ["第1章卷积与拉普拉斯变换", "第2章离散卷积与Z变换"],
        sections: [
          {
            id: "signals-ch3-properties",
            title: "系统描述与基本性质",
            importance: "core",
            sourceStatus: "verified_local",
            content: "系统性质必须逐项检验。线性要求叠加，时不变要求输入移位只引起同量输出移位；无记忆系统的当前输出只依赖当前输入，因果系统不依赖未来输入，BIBO 稳定系统把有界输入映射为有界输出。可逆性要求存在逆系统使级联后恢复原输入；“线性”“稳定”“可逆”彼此不能互相推出。"
          },
          {
            id: "signals-ch3-lti",
            title: "线性系统的时域、频域与复频域分析",
            importance: "core",
            sourceStatus: "verified_local",
            content: "LTI 系统在时域由冲激响应和卷积描述，在频域由传递函数相乘描述，在复频域可通过极零点和收敛域分析暂态、稳定性与因果性。",
            formula: "Y(s)=X(s)H(s),\\qquad H(s)=\\frac{Y(s)}{X(s)}",
            variables: ["H：系统传递函数", "X：输入变换", "Y：输出变换"]
          },
          {
            id: "signals-ch3-identification",
            title: "系统辨识与逆滤波",
            importance: "core",
            sourceStatus: "verified_local",
            content: "系统辨识由已知输入和测量输出估计系统；逆滤波试图由输出恢复输入。若 H 在关键频率接近零，直接相除会放大噪声，必须检查可逆性和稳健性。"
          },
          {
            id: "signals-ch3-digital-realization",
            title: "数字信号处理的实现与有限字长",
            importance: "core",
            sourceStatus: "verified_local",
            content: "数字实现需要采样、量化、运算和输出。有限字长会引入系数量化、运算舍入和溢出，可能改变极点位置与稳定裕量。"
          },
          {
            id: "signals-ch3-advanced",
            title: "同态解卷积与工具扩展",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "同态解卷积、复杂系统辨识算法和完整 MATLAB 工作流依赖更多数值方法，作为选择学习；主线只要求理解问题定义、病态性和验证方法。"
          }
        ],
        examples: [
          {
            title: "一阶离散系统的冲激响应",
            prompt: "零初始条件下，系统满足 y[n]=x[n]+0.5y[n−1]。求冲激响应并判断因果性和 BIBO 稳定性。",
            steps: [
              "令输入 x[n]=δ[n]，递推得到 h[0]=1、h[1]=0.5、h[2]=0.25。",
              "一般式为 h[n]=(0.5)^n u[n]。",
              "h[n] 在 n<0 为0，所以系统因果；绝对和 Σ(0.5)^n=2 有限，所以稳定。"
            ],
            answer: "h[n]=(0.5)^n u[n]；系统因果且 BIBO 稳定。"
          }
        ],
        experiments: [
          {
            id: "signals-ch3-first-order-lti",
            title: "一阶 LTI 系统的递推与卷积核对",
            workbench: "notebook",
            goal: "用两种算法计算同一输出，验证冲激响应可以完整描述 LTI 系统。",
            steps: [
              "设置 x[n] 为长度 20 的单位阶跃。",
              "按 y[n]=x[n]+0.5y[n−1] 递推计算输出。",
              "再用 h[n]=(0.5)^n u[n] 与 x[n] 卷积，比较前20个样点。"
            ],
            expected: "两种输出在数值误差内一致，并逐步趋近稳态值2。",
            limitation: "实验验证离散模型，不包含传感器噪声和有限字长硬件误差。"
          }
        ],
        check: [
          {
            id: "signals-ch3-check-1",
            prompt: "因果离散 LTI 系统的冲激响应必须满足什么？",
            options: ["h[n]=0，n<0", "h[n]=0，n>0", "Σh[n]=0", "h[n] 必须周期"],
            answer: 0,
            explanation: "因果系统的当前输出不能依赖未来输入，因此 h[n] 在负时间为0。"
          },
          {
            id: "signals-ch3-check-2",
            prompt: "为什么 H 接近零时直接逆滤波容易失败？",
            options: ["会降低采样率", "除以很小的数会显著放大噪声", "会自动变成非线性系统", "会删除所有极点"],
            answer: 1,
            explanation: "逆滤波包含除以 H，小幅噪声会在 H 很小时被放大。"
          }
        ],
        summary: ["系统性质应逐项判断，不能由一个性质推断全部。", "LTI 系统可在时域、频域和复频域使用等价表示。", "逆问题和数字实现都必须考虑噪声与有限精度。"],
        tags: ["系统性质", "LTI", "冲激响应", "系统辨识", "有限字长"]
      },
      {
        id: "signals-ch4",
        number: "第4章",
        title: "滤波器",
        counted: true,
        sourceStatus: "verified_local",
        objectives: [
          "把滤波要求转写为通带、阻带、截止频率和衰减指标。",
          "比较巴特沃思与切比雪夫模拟滤波器的取舍。",
          "区分 IIR 与 FIR 数字滤波器的结构、相位和稳定性特征。"
        ],
        prerequisites: ["第3章传递函数与频率响应", "复数幅值和相位"],
        sections: [
          {
            id: "signals-ch4-specs",
            title: "滤波原理、分类与技术指标",
            importance: "core",
            sourceStatus: "verified_local",
            content: "滤波器按频率选择性改变信号。先根据希望保留的频带区分低通、高通、带通和带阻，再给出通带、阻带、过渡带、允许纹波和最小衰减；不能只说“去掉噪声”而不给可检验指标。"
          },
          {
            id: "signals-ch4-analog",
            title: "模拟滤波器",
            importance: "core",
            sourceStatus: "verified_local",
            content: "巴特沃思响应通带单调且最大平坦，切比雪夫允许纹波以换取更陡过渡。低通原型可经频率变换得到其他类型；RC 有源结构用于电路实现。",
            formula: "|H(j\\omega)|^2=\\frac{1}{1+(\\omega/\\omega_c)^{2N}}",
            variables: ["ωc：巴特沃思截止角频率", "N：滤波器阶数"]
          },
          {
            id: "signals-ch4-iir",
            title: "IIR 数字滤波器",
            importance: "core",
            sourceStatus: "verified_local",
            content: "IIR 使用反馈，通常以较低阶数获得较陡响应，但必须检查极点和稳定性，且一般不能保证严格线性相位。冲激响应不变法通过采样模拟系统冲激响应得到数字极点，可能产生频谱混叠；双线性变换把整个模拟频率轴一一映射到数字单位圆，会产生频率扭曲，因此需要预畸变。",
            formula: "s=\\frac{2}{T}\\frac{1-z^{-1}}{1+z^{-1}},\\qquad \\Omega=\\frac{2}{T}\\tan\\frac{\\omega}{2}",
            variables: ["T：采样周期", "Ω：预畸变后的模拟角频率", "ω：数字角频率"]
          },
          {
            id: "signals-ch4-fir",
            title: "FIR 数字滤波器",
            importance: "core",
            sourceStatus: "verified_local",
            content: "FIR 无反馈时天然 BIBO 稳定，并可通过对称系数获得严格线性相位；代价通常是达到相同过渡带要求所需阶数更高。窗函数法先截取理想无限长冲激响应，再用矩形、Hann、Hamming 或 Blackman 窗控制旁瓣；窗越平滑，通常旁瓣越低但主瓣更宽。",
            formula: "y[n]=\\sum_{k=0}^{M}b_kx[n-k]",
            variables: ["bₖ：FIR 系数", "M：滤波器阶数"]
          },
          {
            id: "signals-ch4-advanced-design",
            title: "高阶推导与自动设计",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "高阶原型推导、结构优化及复杂 MATLAB 自动设计流程列为选择学习；主线实验仍需用幅频响应验证指标，而不是只接受工具给出的阶数。"
          }
        ],
        examples: [
          {
            title: "RC 低通截止频率",
            prompt: "一阶 RC 低通取 R=10 kΩ、C=10 nF，求截止频率，并说明该频率处的幅值比。",
            steps: [
              "时间常数 RC=10⁴×10⁻⁸=10⁻⁴ s。",
              "fc=1/(2πRC)≈1591.5 Hz。",
              "一阶低通在截止频率处 |H|=1/√2。"
            ],
            answer: "截止频率约 1.59 kHz，幅值比约 0.707，对应功率下降一半。"
          }
        ],
        experiments: [
          {
            id: "signals-ch4-moving-average",
            title: "移动平均 FIR 的降噪与频率响应",
            workbench: "notebook",
            goal: "观察 5 点移动平均对高频扰动的抑制，并核对其代价。",
            steps: [
              "生成低频正弦与高频正弦之和。",
              "用 bₖ=1/5（k=0…4）的 FIR 处理输入。",
              "比较处理前后波形和幅频响应，记录高频分量衰减与群延迟。"
            ],
            expected: "高频扰动明显减小；线性相位 FIR 引入 2 个样点的固定延迟。",
            limitation: "演示验证滤波算法，不模拟器件容差。"
          }
        ],
        check: [
          {
            id: "signals-ch4-check-1",
            prompt: "同阶条件下，切比雪夫滤波器相对巴特沃思的典型取舍是？",
            options: ["允许纹波以换取更陡过渡", "完全没有相位", "始终线性相位", "不需要截止频率"],
            answer: 0,
            explanation: "切比雪夫用允许范围内的纹波换取更强的幅频选择性。"
          },
          {
            id: "signals-ch4-check-2",
            prompt: "对称系数 FIR 的突出优点是？",
            options: ["一定最低阶", "可实现严格线性相位", "一定没有延迟", "只能处理模拟信号"],
            answer: 1,
            explanation: "对称或反对称 FIR 系数可形成线性相位，但仍有群延迟。"
          }
        ],
        summary: ["滤波设计从可测指标开始。", "模拟原型在平坦度、纹波和过渡带之间取舍。", "IIR 通常阶数低，FIR 易稳定且可实现线性相位。"],
        tags: ["滤波器", "巴特沃思", "切比雪夫", "IIR", "FIR", "信号处理扩展"]
      },
      {
        id: "signals-ch5",
        number: "第5章",
        title: "随机信号分析与处理基础",
        counted: true,
        sourceStatus: "verified_local",
        objectives: [
          "区分随机变量、随机过程和一次样本函数。",
          "理解均值、相关函数和功率谱密度之间的联系。",
          "概述随机信号通过 LTI 系统及最优线性滤波的基本问题。"
        ],
        prerequisites: ["概率论中的随机变量、期望和方差", "第1章相关分析", "第3章 LTI 系统", "第4章滤波器"],
        sections: [
          {
            id: "signals-ch5-description",
            title: "随机信号的概率结构与数字特征",
            importance: "core",
            sourceStatus: "verified_local",
            content: "随机过程是一族可能的样本函数，一次观测只给出其中一条。严格平稳要求任意有限维联合分布对时间平移不变；宽平稳只要求均值为常数且相关函数仅与时间差有关。各态历经性说明可用足够长的一条样本的时间平均替代集合平均，它比平稳更强，不能由“看起来稳定”直接断言。",
            formula: "R_x(\\tau)=\\operatorname{E}\\{x(t)x^*(t-\\tau)\\}",
            variables: ["E：统计期望", "Rx：自相关函数", "τ：时间差"]
          },
          {
            id: "signals-ch5-spectrum",
            title: "随机信号的频域描述",
            importance: "core",
            sourceStatus: "verified_local",
            content: "功率谱密度描述平均功率随频率的分布；宽平稳过程的自相关函数与功率谱密度构成傅里叶变换对。",
            formula: "S_x(\\omega)=\\mathcal{F}\\{R_x(\\tau)\\}",
            variables: ["Sx：功率谱密度", "F：傅里叶变换"]
          },
          {
            id: "signals-ch5-lti-random",
            title: "随机信号通过线性系统",
            importance: "core",
            sourceStatus: "verified_local",
            content: "宽平稳随机信号通过稳定 LTI 系统后，输出功率谱等于输入功率谱乘以系统幅频响应的平方。",
            formula: "S_y(\\omega)=|H(j\\omega)|^2S_x(\\omega)",
            variables: ["Sx：输入功率谱", "Sy：输出功率谱", "H：系统频率响应"]
          },
          {
            id: "signals-ch5-optimal",
            title: "最优线性滤波概览",
            importance: "core",
            sourceStatus: "verified_local",
            content: "维纳滤波以已知二阶统计量求最小均方误差的稳态线性估计；卡尔曼滤波在状态空间模型中按“预测—校正”递推更新状态与协方差；LMS 等自适应滤波根据瞬时误差在线调整系数。三者分别依赖平稳统计、动态模型或在线数据，不能只按名称互换。"
          },
          {
            id: "signals-ch5-nonstationary",
            title: "非平稳分析与扩展 MATLAB",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "非平稳信号可用时频分析、小波变换和希尔伯特-黄变换观察随时间变化的频率结构；MATLAB 实现列为选择学习。"
          }
        ],
        examples: [
          {
            title: "白噪声通过三点平均器",
            prompt: "零均值独立白噪声方差为9，通过 y[n]=(x[n]+x[n−1]+x[n−2])/3，求输出方差。",
            steps: [
              "三个输入样本独立，因此加权和方差等于各项方差之和。",
              "每个系数为1/3，系数平方和为3×(1/3)²=1/3。",
              "输出方差为9×1/3=3。"
            ],
            answer: "输出均值仍为0，方差为3；三点平均降低了白噪声方差。"
          }
        ],
        experiments: [
          {
            id: "signals-ch5-random-average",
            title: "固定随机种子的方差验证",
            workbench: "notebook",
            goal: "用可复现实验核对白噪声通过三点平均器后的方差变化。",
            steps: [
              "固定随机种子，生成不少于100000个均值0、方差9的独立高斯样本。",
              "应用三点移动平均并舍去起始暂态样本。",
              "计算输入、输出样本均值和方差，与理论值0、9、3比较。"
            ],
            expected: "样本数足够大时，输入方差接近9，输出方差接近3。",
            limitation: "演示用有限样本核对均值和方差，不覆盖随机过程理论及维纳、卡尔曼和自适应滤波推导。"
          }
        ],
        check: [
          {
            id: "signals-ch5-check-1",
            prompt: "宽平稳随机过程的功率谱密度与什么构成傅里叶变换对？",
            options: ["均值", "自相关函数", "概率密度函数", "采样周期"],
            answer: 1,
            explanation: "维纳—辛钦关系把功率谱密度与自相关函数联系起来。"
          },
          {
            id: "signals-ch5-check-2",
            prompt: "稳定 LTI 系统对输入功率谱的作用是？",
            options: ["乘以 |H|²", "乘以 H 的相位", "对频率求导", "必定变成白谱"],
            answer: 0,
            explanation: "输出功率谱满足 Sy=|H|²Sx。"
          }
        ],
        summary: ["随机信号需要用统计量描述，不能由一次样本代表全部性质。", "相关函数和功率谱连接时域统计与频域功率。", "最优滤波围绕估计目标、误差准则和模型更新展开。"],
        tags: ["随机信号", "相关函数", "功率谱", "最优滤波", "非平稳分析"]
      }
    ]
  };

  // ../codex_projects/personal-workbench-sites/app/data/courses/index.ts
  var courses = [signalsCourse, digitalCourse, analogCourse];
  var courseById = Object.fromEntries(courses.map((course) => [course.id, course]));
  return __toCommonJS(index_exports);
})();
