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
        intro: true,
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
        intro: true,
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
          "完成连续信号的时域运算、冲激分解与卷积计算。",
          "用傅里叶级数与傅里叶变换描述频谱，并正确套用九类常用性质。",
          "用拉普拉斯变换（连同收敛域）与相关函数解决典型分析问题。"
        ],
        prerequisites: ["绪论中的信号分类", "积分、复数和欧拉公式"],
        sourceRef: [
          "课件_第2章-时域分析.pdf",
          "课件_第2章-频域分析.pdf",
          "课件_第2章-傅立叶变换性质.pdf",
          "个人笔记/03_整理摘要/01_信号与系统主线.md",
          "开放讲义（spatialaudio）：continuous_signals、fourier_transform、laplace_transform",
          "开放讲义（Typst）：lti、fourier_series、ct_fourier_transform、laplace"
        ],
        connections: [
          { to: "signals-intro", kind: "prereq", why: "信号的四类划分决定本章只处理确定性的连续信号；能量与功率的定义也是后文判据的基础。" },
          { to: "signals-ch2", kind: "next", why: "把时间轴离散化后，时域、频域、复频域三套工具逐一搬到离散域，成为序列、DTFT 与 Z 变换。" },
          { to: "signals-ch3", kind: "next", why: "卷积与变换是描述 LTI 系统的语言，第 3 章用它讨论系统性质、辨识与实现。" },
          { to: "signals-ch5", kind: "next", why: "把本章确定信号的相关分析推广到统计意义，就是第 5 章的自相关函数与功率谱密度。" },
          { to: "analog-05", kind: "cross", why: "模电第 4 章的频率响应与波特图，就是本章幅频、相频特性的工程画法。" },
          { to: "analog-10", kind: "cross", why: "直流电源的整流与滤波直接使用频谱搬移和卷积的分析结论。" },
          { to: "digital-08", kind: "cross", why: "数-模与模-数转换把采样、量化做成硬件，是本章频域结论的落地。" }
        ],
        sections: [
          {
            id: "signals-ch1-time-basic",
            group: "第一节 连续信号的时域描述和分析",
            title: "基本信号：正弦、复指数与取样信号",
            importance: "core",
            sourceStatus: "verified_local",
            content: "上一章按确定性与连续性给信号分了类，从这一节开始进入实际计算。时域分析的第一步是准备零件：把常用波形归到少数几个基本信号上——正弦、复指数、取样信号（sinc）。零件少，才有统一的运算规则；而后面频域分析里的傅里叶级数与傅里叶变换，用的基函数也正是复指数。",
            detail: [
              "复指数信号 x(t)=e^(jω₀t) 是这一节的核心。由欧拉公式 e^(jθ)=cosθ+jsinθ，它同时装着余弦与正弦：e^(jω₀t)=cos ω₀t + j sin ω₀t。把 e^(jω₀t) 看成复平面上长度不变、以角频率 ω₀ 匀速旋转的单位向量，它的实部是余弦、虚部是正弦——“相位”因此有了几何含义：相位就是那个转角。一般复指数再乘上 e^(σt) 的幅度包络，就能同时描述“振荡”与“增长、衰减”两种行为。",
              "取样信号 sinc(x)=sin(πx)/(πx) 在 x=0 处取极限值 1，在非零整数点处为零，两侧按 1/x 衰减。它不是硬凑出来的函数：宽度为 τ 的矩形脉冲，其频谱正是一个 sinc，主瓣第一个零点落在 f=1/τ。脉宽越窄，零点越远、频谱越宽——这条“时宽与带宽成反比”的结论在第二节会反复用到。"
            ],
            points: [
              "正弦由幅度、角频率、初相三者唯一确定；相位是更本质的量，幅度只决定“多大”",
              "欧拉公式是复指数与正弦之间的双向字典：e^(jθ)=cosθ+jsinθ",
              "复指数 e^(jω₀t) 的几何图像是匀速旋转的单位向量，实部、虚部分别是余弦与正弦",
              "sinc(x)=sin(πx)/(πx)：x=0 处为 1，非零整数点为零，正是矩形脉冲的频谱形状"
            ],
            pitfalls: [
              "角频率 ω 与频率 f 混用：ω=2πf，相差一个 2π；把“50 Hz”写成 ω=50 是常见错误",
              "记错 sinc 的尺度约定：sin(πx)/(πx) 的零点是所有非零整数，而 sin x/x 的零点在 π 的整数倍"
            ],
            links: [
              { to: "signals-ch1-time-singular", why: "正弦与复指数属于“普通信号”，下一节补上阶跃与冲激这类奇异信号" },
              { to: "signals-ch1-frequency", why: "傅里叶级数与傅里叶变换的基函数就是复指数，这一节是它的语言基础" }
            ],
            formula: "\\begin{aligned}e^{j\\theta}&=\\cos\\theta+j\\sin\\theta\\\\[2pt]\\cos\\theta&=\\tfrac{1}{2}\\left(e^{j\\theta}+e^{-j\\theta}\\right)\\\\[2pt]\\sin\\theta&=\\tfrac{1}{2j}\\left(e^{j\\theta}-e^{-j\\theta}\\right)\\\\[2pt]\\operatorname{sinc}(x)&=\\frac{\\sin\\pi x}{\\pi x}\\end{aligned}",
            variables: [
              "θ：相位角，弧度制；复指数里取 θ=ω₀t",
              "j：虚数单位，j²=−1",
              "ω₀：角频率（rad/s），与频率的关系是 ω₀=2πf",
              "sinc(x)=sin(πx)/(πx)：x=0 处取极限值 1，非零整数点为零（sin x/x 的写法零点在 π 的整数倍）"
            ]
          },
          {
            id: "signals-ch1-time-singular",
            group: "第一节 连续信号的时域描述和分析",
            title: "奇异信号：阶跃、冲激与冲激偶",
            importance: "core",
            sourceStatus: "verified_local",
            content: "普通信号都有值可算，但有两类情况用普通函数描述不了：开关一合，信号从 0 跳到 1；一个理想化的瞬时作用，在某一时刻“冲”了一下，其余时刻为零。这就是奇异信号。它们不是数学游戏——阶跃用来表示“从某时刻开始”，冲激用来表示“瞬间作用”，后面的卷积、采样与系统冲激响应都建立在它们之上。",
            detail: [
              "奇异信号由“取极限”引入：宽度 τ、高度 1/τ 的矩形脉冲，当 τ→0 时面积恒为 1，其极限就是单位冲激 δ(t)；同理，阶跃可看作斜升信号斜率趋于无穷的极限。冲激最实用的定义是筛选性质：∫x(t)δ(t−t₀)dt=x(t₀)，它把函数在 t₀ 处的值“筛”出来。面积定义、脉冲极限、筛选性质三种说法等价，做题时按方便选用。冲激是偶函数 δ(t)=δ(−t)；带尺度时要保证面积守恒，因此 δ(at)=δ(t)/|a|（除的是 |a|，不是 a）。再求一次导得到冲激偶 δ′(t)，它的抽样性质带一个负号：∫x(t)δ′(t−t₀)dt=−x′(t₀)。",
              "阶跃、冲激与斜升之间有完整的微积分链：du(t)/dt=δ(t)，dδ(t)/dt=δ′(t)；反过来 ∫δ(τ)dτ=u(t)，∫u(τ)dτ 得到斜升信号。含跳变的信号求导时要专门处理跳变点：x(t)=u(t)−u(t−1) 的导数不是 0，而是 δ(t)−δ(t−1)——跳变幅度为 1 对应强度为 1 的冲激；若跳变幅度是 A，冲激强度就是 A，符号由向上跳还是向下跳决定。"
            ],
            points: [
              "奇异信号由普通信号取极限得到；冲激的面积（强度）恒为 1",
              "筛选性质 ∫x(t)δ(t−t₀)dt=x(t₀) 是冲激最有用的性质",
              "冲激是偶函数；δ(at)=δ(t)/|a|，尺度因子必须取绝对值",
              "微积分链：du/dt=δ、dδ/dt=δ′；反向 ∫δ=u、∫u=斜升"
            ],
            pitfalls: [
              "把 δ(t) 想成“在 0 点取无穷大、别处为 0 的函数”：它不是一个普通函数，只有放进积分里才有意义",
              "对含跳变的信号求导时漏掉冲激项：跳变幅度 A 对应强度 A 的冲激，方向和大小都要跟着跳变走"
            ],
            links: [
              { to: "signals-ch1-time-basic", why: "奇异信号是普通信号取极限的结果，两者合起来才是完整的信号零件箱" },
              { to: "signals-ch1-time-decomposition", why: "筛选性质正是“任意信号＝移位冲激加权叠加”的直接依据" }
            ],
            formula: "\\begin{aligned}\\int_{-\\infty}^{\\infty}x(t)\\,\\delta(t-t_0)\\,dt&=x(t_0)\\\\[2pt]\\delta(at)&=\\frac{1}{|a|}\\,\\delta(t),\\qquad a\\neq 0\\\\[2pt]\\delta(-t)&=\\delta(t)\\\\[2pt]\\frac{d}{dt}u(t)&=\\delta(t)\\\\[2pt]\\int_{-\\infty}^{t}\\delta(\\tau)\\,d\\tau&=u(t)\\\\[2pt]\\int_{-\\infty}^{\\infty}x(t)\\,\\delta'(t-t_0)\\,dt&=-x'(t_0)\\end{aligned}",
            variables: [
              "δ(t)：单位冲激，∫_{−∞}^{∞}δ(t)dt=1（面积为 1，称强度）",
              "t₀：冲激所在时刻",
              "a：时间尺度因子，a≠0；尺度后必须除以 |a| 才能保持面积不变",
              "u(t)：单位阶跃，t<0 时为 0、t>0 时为 1",
              "δ′(t)：冲激偶，抽样性质带负号，作用在 x′(t₀) 上"
            ]
          },
          {
            id: "signals-ch1-time-ops",
            group: "第一节 连续信号的时域描述和分析",
            title: "时域基本运算：平移、翻转、尺度",
            importance: "core",
            sourceStatus: "verified_local",
            content: "有了信号，还要能对它做操作。基本运算只有三种：平移（把波形整体左右挪）、翻转（关于纵轴镜像）、尺度变换（把时间轴压缩或拉伸），再加上叠加与相乘两个逐点运算。它们单独看都很简单，难点在组合时的顺序——而后面卷积里的“翻转—平移”，正是这两种运算的连用。",
            detail: [
              "三种运算都作用在自变量上，作用对象是 t 而不是 x：x(t−t₀) 是右移 t₀（延迟），x(t+t₀) 是左移；x(−t) 关于纵轴翻转；x(at) 在 a>1 时把时间轴压缩 a 倍，波形变窄。组合时顺序会影响结果，记法上要分清 x(at−b) 与 x(a(t−b))：前者是先把 x(t) 右移 b 再做 a 倍压缩，后者是先压缩 a 倍再右移 b，两者相差 a 倍时移。判断准则很简单——用具体数值验算：若 x(t) 的某个特征点在 t=1，那么 x(2t−2) 中该特征点出现在 2t−2=1 即 t=1.5 处。",
              "以 x(t)=t·[u(t)−u(t−1)]（0≤t≤1 上的斜升）为例：x(2t) 把区间压到 0≤t≤0.5；x(t−1) 把区间挪到 1≤t≤2；x(2−t) 先关于纵轴翻转，再右移 2，落到 1≤t≤2 且方向反转。起点、终点、峰值三个特征点各验算一次，基本可以排除顺序错误。"
            ],
            points: [
              "平移改的是“什么时候开始”，翻转改的是“时间方向”，尺度改的是“时间快慢”",
              "x(t−t₀) 右移（延迟），x(t+t₀) 左移（超前）",
              "x(at) 在 a>1 时压缩时间轴、波形变窄，0<a<1 时拉伸",
              "组合运算先看是 x(at−b) 还是 x(a(t−b))，再用特征点回代验证"
            ],
            pitfalls: [
              "把 x(2t−2) 读成“先压缩 2 倍、再右移 2”（那会得到 x(2t−4)）：正确读法是“先右移 2 再压缩 2”，或等价的“先压缩 2 再右移 1”",
              "只改函数表达式而忘了同步改定义域，画图时区间整体错位"
            ],
            links: [
              { to: "signals-ch1-time-basic", why: "三种运算都作用在基本信号的自变量上" },
              { to: "signals-ch1-time-composite", why: "下一节把三种运算组合起来，固化成一套不会出错的流程" }
            ],
            formula: "x(at-b)=x\\Big(a\\Big(t-\\frac{b}{a}\\Big)\\Big),\\qquad a\\neq 0",
            variables: [
              "x(t−t₀)：右移 t₀（延迟）；x(t+t₀)：左移 t₀（超前）",
              "x(−t)：关于纵轴翻转，只改时间方向",
              "x(at)：|a|>1 时时间轴压缩 |a| 倍（波形变窄），0<|a|<1 时拉伸",
              "x(at−b)：先右移 b、再压缩 a 倍；等价于先压缩 a 倍、再右移 b/a",
              "x(a(t−b))：先压缩 a 倍、再右移 b——与 x(at−b) 不是同一个波形，不要混用"
            ]
          },
          {
            id: "signals-ch1-time-composite",
            group: "第一节 连续信号的时域描述和分析",
            title: "混合运算与波形变换",
            importance: "core",
            sourceStatus: "verified_local",
            content: "三种基本运算单独做都不难，但作业与工程里出现的是它们的组合：给一个分段波形 x(t)，要求画出 x(−2t+1) 或写出它的表达式。课件用连续九页例题反复练这一件事，可见它是本章的基本功。这一节把它固化成一套固定流程，并给出一个不靠运气的自检方法。",
            detail: [
              "固定流程四步：① 把目标式写成标准形式 a(t−b)，读出压缩倍数 a 与平移量 b；② 选定一种顺序（先平移后尺度，或先尺度后平移），全程不再更换；③ 让原信号的每个关键点 t_i 满足“目标式中的自变量 = t_i”，解出新位置；④ 按新位置连线，并单独检查定义域的两个端点。自检方法：取原信号的两个端点加一个拐点共三个特征点回代验算，三点都对上，顺序基本不会错。",
              "设 x(t) 在 0≤t≤1 上为 1、其余时刻为 0，求 x(2−t)。目标式写成 x(−(t−2))，即“先翻转、再右移 2”：先翻转得 x(−t)，非零区间由 [0,1] 变为 [−1,0]；再把 x(−t) 整体右移 2（把 t 换成 t−2）得 x(−(t−2))=x(2−t)，区间随之移到 [1,2]。交叉验证：直接解不等式 0≤2−t≤1，同样得到 1≤t≤2。于是 y(t)=x(2−t) 在 1≤t≤2 上为 1，其余为 0——原来的 [0,1] 被镜像到 [1,2]。注意顺序不能颠倒：若先右移 2 得 x(t−2)（支撑 [2,3]），再关于纵轴翻转，得到的是 x(−t−2)（支撑 [−3,−2]），并不是 x(2−t)。"
            ],
            points: [
              "混合运算先把目标式化成 x(a(t−b)) 的标准形，读出 a 与 b 再动手",
              "全程只用一种顺序，中途换顺序必错",
              "关键点回代法：让新自变量等于原关键点位置，解出新位置",
              "定义域端点必须跟着一起变换，不能只换函数值"
            ],
            pitfalls: [
              "平移用一套规则、缩放又换另一套，两种顺序混着做",
              "只核对了峰值点，漏查区间端点，结果区间整体偏移"
            ],
            links: [
              { to: "signals-ch1-time-ops", why: "本节是三种基本运算的组合练习" },
              { to: "signals-ch1-time-convolution", why: "卷积里的“翻转—平移”就是同一套操作，这里练熟后面才不卡" }
            ]
          },
          {
            id: "signals-ch1-time-convolution",
            group: "第一节 连续信号的时域描述和分析",
            title: "卷积运算：定义、图解五步与物理意义",
            importance: "core",
            sourceStatus: "verified_local",
            content: "前面几节都在处理单个信号，卷积第一次把两个信号合起来，定义是一个积分：y(t)=∫x(τ)h(t−τ)dτ。式子本身不难，难在两件事——怎么算，以及算出来代表什么。课件用十页讲它：定义与交换律、求解步骤、两个矩形脉冲、方波与衰减指数，最后落到物理意义。",
            detail: [
              "图解五步（课件原文的顺序）：改变自变量 → 翻转 → 平移 → 相乘 → 积分，并注意积分限。具体做法是把 x(t)、h(t) 都改写成以 τ 为自变量的函数；把其中一个（例如 h）关于纵轴翻转成 h(−τ)；整体右移 t 得 h(t−τ)；与 x(τ) 相乘得到被积函数；最后对 τ 积分。积分上下限由两个信号“重叠”的 τ 区间决定，所以必须按 t 的取值分段讨论——t 落在不同区间时重叠区间端点不同，这正是分段结果的来源。卷积满足交换律 x*h=h*x，也满足结合律与分配律。",
              "两个宽度都是 1、高度都是 1 的矩形脉冲卷积：t<0 时无重叠，y=0；0≤t≤1 时重叠长度为 t，y=t；1<t≤2 时重叠长度为 2−t，y=2−t；t>2 时为 0。结果是底宽 2、峰值 1 的三角形。峰值的一般规则是 min(w₁,w₂)——它由较窄的那个脉冲决定；而卷积曲线的总面积等于两个脉冲面积之积 w₁w₂（单位高度时就是 w₁w₂）。本例外形上两条数值都等于 1，纯属等宽等高的巧合，不能把“峰值 = 面积之积”当成规则：取 w₁=1、w₂=3，峰值仍是 1，而总面积是 3。再看冲激：x(t)*δ(t−t₀)=x(t−t₀)，与冲激卷积只是把信号平移到冲激所在的位置——这条恒等式是下一节“信号分解”的直接结果，也是冲激响应 h(t) 能描述整个系统的原因。"
            ],
            points: [
              "卷积定义 y(t)=∫x(τ)h(t−τ)dτ，满足交换律、结合律、分配律",
              "图解五步：改变自变量 → 翻转 → 平移 → 相乘 → 积分，积分限由重叠区间决定",
              "结果必须按 t 分段讨论，分段点由两个信号定义域端点的组合决定",
              "x(t)*δ(t−t₀)=x(t−t₀)：与移位冲激卷积只是平移"
            ],
            pitfalls: [
              "把卷积当成“两个函数逐点相乘”：卷积要对所有 τ 加权叠加再积分，逐点相乘是频域那一侧的操作",
              "漏掉“翻转”这一步，把 h(t−τ) 直接写成 h(τ−t)，导致积分限取反、结果的支撑区间整体错位"
            ],
            links: [
              { to: "signals-ch1-time-composite", why: "卷积的翻转与平移，就是上一节练的波形操作" },
              { to: "signals-ch1-time-decomposition", why: "为什么能这样定义卷积？下一节用冲激分解给出理由" },
              { to: "signals-ch5", why: "相关运算与卷积只差“是否翻转其中一个信号”，它属于随机信号一章" }
            ],
            formula: "y(t)=x(t)*h(t)=\\int_{-\\infty}^{\\infty}x(\\tau)h(t-\\tau)\\,d\\tau",
            variables: ["x(t)：输入", "h(t)：冲激响应", "τ：积分变量", "y(t)：零状态响应"]
          },
          {
            id: "signals-ch1-time-decomposition",
            group: "第一节 连续信号的时域描述和分析",
            title: "信号的分解：冲激分解与正交分解",
            importance: "core",
            sourceStatus: "verified_local",
            content: "卷积已经会用，但还有一个更根本的问题没回答：为什么系统的输出可以写成输入与冲激响应的卷积？课件把“信号的分解”排在卷积之后，正是为了让这个问题有落点。答案只有两步——任意信号都能写成移位冲激的加权叠加，而系统又是线性时不变的。两步一合，卷积就从“一个积分定义”变成了“必然结果”。",
            detail: [
              "第一步是冲激分解，它就是筛选性质的另一种写法：x(t)=∫x(τ)δ(t−τ)dτ。把 t 看作观察时刻、τ 看作扫描变量，任意信号都被写成无穷多个移位冲激的加权和，权重恰好是 x(τ)。第二步用系统性质：设系统对 δ(t) 的响应是 h(t)，由时不变性，对 δ(t−τ) 的响应是 h(t−τ)；由线性（齐次性加可加性），权重 x(τ) 原样传递、各项直接叠加，于是 y(t)=∫x(τ)h(t−τ)dτ。这就是卷积积分的来历。它同时说明了两件事：h(t) 能完整描述一个 LTI 系统；卷积不是人为约定的运算，而是“分解—求响应—叠加”三步的缩写。",
              "用这套逻辑复查两条已知结论：取 x(t)=δ(t−t₀)，分解式中只有 τ=t₀ 处权重非零，输出就是 h(t−t₀)，与“冲激卷积等于平移”一致；取输入为阶跃 u(t)（即冲激的积分和），由线性得输出是 h(t) 的积分，这就是“阶跃响应” g(t)=∫_{−∞}^{t}h(τ)dτ（对因果系统积分从 0⁻ 起算）。注意区分两个方向：g(t) 是把“输入取成 u(t)”时系统的输出；而“冲激响应本身就是 u(t) 的系统”，它对任意输入 x 的输出才是 x 的滑动积分。所以只要知道 h(t)，任意输入下的输出都能算——这就是“冲激响应完全描述 LTI 系统”的含义。另一条分解思路是正交分解：把信号拆成互不干扰的分量，后面频域分析用的复指数就是一组正交基。"
            ],
            points: [
              "冲激分解 x(t)=∫x(τ)δ(t−τ)dτ 是筛选性质的另一种写法",
              "卷积的来历：冲激分解 + 时不变（负责移位）+ 线性（负责加权叠加）",
              "h(t)、阶跃响应 g(t)=∫_{−∞}^{t}h(τ)dτ 与系统函数是同一件事的三种说法",
              "正交分解把信号拆成互不干扰的分量，频域分析用的复指数正是正交基"
            ],
            pitfalls: [
              "把“信号的分解”当成数学技巧，看不出它才是卷积定义的来源：会背卷积公式，却答不出“为什么是卷积”",
              "把线性与时不变的作用搞混：移位靠时不变，加权叠加靠线性，缺任何一条卷积都不成立"
            ],
            links: [
              { to: "signals-ch1-time-convolution", why: "本节给上一节的卷积公式补上理由" },
              { to: "signals-ch3-properties", why: "第3章把“h(t) 完全描述系统”推广成因果性、稳定性判据与系统函数" }
            ],
            formula: "x(t)=\\int_{-\\infty}^{\\infty}x(\\tau)\\,\\delta(t-\\tau)\\,d\\tau\\quad\\Longrightarrow\\quad y(t)=\\int_{-\\infty}^{\\infty}x(\\tau)\\,h(t-\\tau)\\,d\\tau\\;,\\qquad g(t)=\\int_{-\\infty}^{t}h(\\tau)\\,d\\tau",
            variables: [
              "x(τ)：分解系数，等于输入在 τ 时刻的取值",
              "δ(t−τ)：移位单位冲激（基函数）",
              "h(t)：系统对 δ(t) 的响应，即冲激响应",
              "y(t)：零状态响应",
              "g(t)=∫_{−∞}^{t}h(τ)dτ：阶跃响应（输入取 u(t) 时的输出）；因果系统积分从 0⁻ 起算"
            ]
          },
          {
            id: "signals-ch1-frequency",
            group: "第二节 连续信号的频域分析",
            title: "连续信号的频域分析",
            importance: "core",
            sourceStatus: "verified_local",
            content: "时域卷积要算积分，遇到多级系统会迅速变复杂。频域分析换一条路：把信号投影到不同频率的复指数上，看它由哪些频率成分构成、各占多大比例。周期信号用傅里叶级数得到离散谱，非周期信号用连续时间傅里叶变换得到连续谱——后者可以看作周期趋于无穷时前者的极限。变换本身只是积分，真正省力的是变换性质。",
            detail: [
              "性质表不是口诀，每条都对应一个可核对的量纲或符号：时移只改相位、不改幅值，因为延迟并不改变各频率成分的大小；频移把整个频谱搬运 ω₀，是调制与混频的数学形式；尺度变换 x(at) 同时压缩时宽、展宽带宽并乘 1/|a|，体现时宽与带宽的反比关系；时域微分乘 jω，说明高频成分对快变化更敏感。动手前先核对三件事：横轴用 f 还是 ω、指数符号约定是不是 e^(−jωt)、以及 1/2π 落在正变换还是反变换。",
              "矩形脉冲是最好用的标尺：宽度 T、高度 1 的矩形，频谱是 sinc 形，主瓣第一个零点在 f=1/T。T=1 ms 时零点在 1 kHz；把宽度压到 0.1 ms，零点推到 10 kHz——脉冲越窄，频谱越宽。这解释了为什么短促的干扰会覆盖很宽的频带，也预告了第 2 章采样定理中“时域乘脉冲串＝频域频谱搬移”的用法。"
            ],
            points: [
              "周期信号→离散谱（傅里叶级数），非周期信号→连续谱（傅里叶变换）",
              "时移改相位、频移搬频谱、尺度变换压缩时宽并展宽带宽",
              "时域卷积↔频域相乘，时域相乘↔频域卷积（带 1/2π 系数）",
              "Parseval：时域总能量等于频域总能量，是检查变换结果最省事的工具"
            ],
            pitfalls: [
              "把 f 与 ω 混用：两者相差 2π，谱图横轴必须说清是哪一个",
              "漏掉 1/2π：卷积定理与 Parseval 的常数取决于正变换的定义，混用两套约定必然出错",
              "以为时移会改变频谱形状：时移只旋转相位，幅值谱完全不变"
            ],
            links: [
              { to: "signals-ch2-dtft", why: "把连续频谱沿频率轴周期延拓，就得到离散时间傅里叶变换" },
              { to: "signals-ch2-sampling", why: "频谱不重叠的条件（采样定理）正是建立在本节的频谱搬移之上" },
              { to: "analog-05", why: "模电第 4 章把幅频、相频特性画成波特图，是本节的工程画法" }
            ],
            formula: "\\begin{aligned}x(t-t_0)&\\leftrightarrow e^{-j\\omega t_0}X(j\\omega)\\\\x(t)e^{j\\omega_0t}&\\leftrightarrow X\\!\\left(j(\\omega-\\omega_0)\\right)\\\\x(at)&\\leftrightarrow \\frac1{|a|}X\\!\\left(j\\frac{\\omega}{a}\\right)\\\\\\frac{dx}{dt}&\\leftrightarrow j\\omega X(j\\omega)\\\\x*h&\\leftrightarrow XH,\\quad xh\\leftrightarrow\\frac1{2\\pi}X*H\\\\\\int|x(t)|^2dt&=\\frac1{2\\pi}\\int|X(j\\omega)|^2d\\omega\\end{aligned}",
            variables: ["X(jω)：连续频谱", "t₀：时移量", "ω₀：频移量", "a：时间尺度因子", "帕塞瓦尔关系：时域能量与频域能量相等"]
          },
          {
            id: "signals-ch1-laplace",
            group: "第三节 连续信号的复频域分析",
            title: "连续信号的复频域分析",
            importance: "core",
            sourceStatus: "verified_local",
            content: "绝对可积是傅里叶积分收敛的一个充分条件，不是必要条件：像 e^(at)u(t)（a>0）这类随 t 增长的信号确实没有普通意义下的频谱，但 δ(t)、u(t)、cos ω₀t 这些信号虽然不是绝对可积，仍可用广义函数（冲激谱）写出它们的傅里叶变换。含初始条件的电路方程则连广义函数也不便处理，于是引入拉普拉斯变换：在傅里叶核 e^(−jωt) 上再乘一个实指数因子 e^(−σt)，把 s=σ+jω 当作复频率，只要 σ 取得足够大，增长信号也能被压住而收敛。代价是变换结果必须连同收敛域一起给出。",
            detail: [
              "收敛域 ROC 是使积分绝对收敛的 σ 范围，它是变换的一部分而不是附带说明：同一个代数式配上不同收敛域，对应完全不同的时间信号。例如 1/(s−a) 在 ROC 为 Re{s}>a（极点右侧）时对应右边信号 e^(at)u(t)，在 Re{s}<a（极点左侧）时对应左边信号 −e^(at)u(−t)。能出现“左边信号”与两种 ROC，前提是这里用的是双边变换；单边变换（积分下限 0⁻）只覆盖 t≥0 的部分，不能用来区分左边信号，它的主场是含初始条件的微分方程。极点给出 ROC 的边界，零极点图能读出因果性、稳定性与振荡频率。傅里叶变换只是 s=jω 这条轴上的一刀切片——当且仅当 ROC 包含虚轴时这一刀才落在收敛域内。",
              "x(t)=e^(−2t)u(t) 的拉普拉斯变换是 1/(s+2)，极点在 s=−2，ROC 为 Re{s}>−2。由于 ROC 包含虚轴（σ=0 落在 −2 右侧），它的傅里叶变换存在，就是 X(jω)=1/(jω+2)。把指数换成 e^(2t)u(t)，极点移到 s=2，ROC 变成 Re{s}>2 不再包含虚轴，傅里叶变换不存在——这正是“增长信号没有频谱”的复频域说法。反过来，左边信号也能有傅里叶变换：x(t)=e^(3t)u(−t) 的极点在 s=3，ROC 为 Re{s}<3，虽然极点在右半平面，但 σ=0<3，虚轴仍在收敛域内，傅里叶变换存在且等于 1/(3−jω)。所以判据是“ROC 是否含虚轴”，不是“极点在不在左半平面”。"
            ],
            points: [
              "拉普拉斯变换＝傅里叶变换＋指数加权，s=σ+jω 把频率推广为复频率",
              "变换式与收敛域必须成对出现，缺一不可",
              "极点决定 ROC 的边界与波形形态；ROC 是否含虚轴决定傅里叶变换是否存在",
              "含初始条件的微分方程经拉普拉斯变换直接变成代数方程，初值自动进入解"
            ],
            pitfalls: [
              "只写 X(s) 不写收敛域：这是本章最常见的失分点",
              "把 s=jω 无条件代入当作傅里叶变换：只有 ROC 包含虚轴时这一步才成立"
            ],
            links: [
              { to: "signals-ch1-frequency", why: "沿虚轴取值即回到傅里叶变换，两者是同一套工具的两种取值方式" },
              { to: "signals-ch2-z", why: "Z 变换是拉普拉斯变换在离散域的对应物，映射关系为 z=e^(sT)" },
              { to: "signals-ch3-complex", why: "因果系统的稳定性要求 H(s) 的极点全部落在左半平面；一般情形要看 ROC 是否包含虚轴" }
            ],
            formula: "X(s)=\\int_{-\\infty}^{\\infty}x(t)e^{-st}\\,dt,\\qquad s=\\sigma+j\\omega",
            variables: [
              "s：复频率，s=σ+jω",
              "σ：指数加权因子（实部），决定 ROC",
              "ω：角频率（虚部）",
              "ROC：使积分绝对收敛的 σ 范围，必须与 X(s) 一起给出",
              "单边形式：积分下限取 0⁻，只覆盖 t≥0，用于含初始条件的微分方程，不用于区分左边信号"
            ]
          },
          {
            id: "signals-ch1-correlation",
            group: "第四节 信号的相关分析",
            title: "信号的相关分析",
            importance: "core",
            sourceStatus: "verified_local",
            content: "前面几节处理的是“一个信号自己”：它的频率成分、它的各种变换。这一节转向“两个信号之间”——在不同相对时移下它们有多像。相关函数就是这种相似度的度量：把其中一个信号平移 τ 后与另一个相乘再积分，越像则积分值越大。它回答的是工程上最常问的一句话：这段接收信号里有没有我认识的那个波形，它在什么位置。",
            detail: [
              "相关的定义是 R_xy(τ)=∫_{−∞}^{∞}x(t)y*(t−τ)dt：把 y 平移 τ 后与 x 逐点相乘再积分，τ 取遍所有值就得到整条相关函数。它与卷积只差一步——卷积要把其中一个信号反折，相关不反折，所以 R_xy(τ) 就是 x(τ) 与 y*(−τ) 的卷积，在频域对应 R_xy ↔ X(jω)Y*(jω)。相关定理把“找最像的时移”变成一次乘法加一次反变换，雷达测距、声呐定向、通信同步都在用它。换下标时要连共轭和符号一起换：R_yx(τ)=R_xy*(−τ)；实信号才退化成 R_yx(τ)=R_xy(−τ)。归一化相关系数 ρ_xy(τ) 用两个信号在零时移处的自相关值作分母，剔除幅值缩放的影响，由柯西—施瓦茨不等式保证 |ρ_xy(τ)|≤1，能量信号的自相关还满足 |R_xx(τ)|≤R_xx(0)：等于 1 表示完全线性相关，等于 0 表示正交。",
              "x(t)=sin(2πt) 与 y(t)=sin(2π(t−0.25)) 都是周期信号，能量无限，上面那个从 −∞ 积到 +∞ 的定义会发散，必须改用“一个周期内的时间平均”（功率相关）R_xy(τ)=(1/T)∫_{0}^{T}x(t)y*(t−τ)dt。代入本定义直接积分得 R_xy(τ)=0.5cos[2π(τ+0.25)]：峰值出现在 τ=−0.25+kT（T=1 s，k 为整数），即 R_xy(−0.25)=+0.5、R_xy(+0.25)=−0.5。这里要特别留意符号——按本定义，峰值所在的时移与 y 相对 x 的延迟符号相反：y 比 x 滞后 0.25 s，峰值却落在 τ=−0.25 s；若改用 R_yx(τ) 定义，峰值才出现在 +0.25 s。所以报告时延之前，必须先说清用的是哪一个定义。峰值也不唯一：相关函数以 T 为周期重复，τ=−0.25+kT 全取同一个峰值，用相关测时延必须把搜索范围限制在一个周期以内。",
              "相关之所以能从噪声里捞出已知波形，靠的是“期望为零”而不是“数值处处为零”：设 n(t) 是零均值且与 x(t) 不相关的噪声，则它与 x 的互相关期望 E[R_xn(τ)] 在所有时延处都等于零——不只是 τ≠0 处。用有限长数据估计时，样本互相关会留下残差；残差随记录长度下降，但不保证在任何时延上都接近零，也不随 τ 增大而系统变小。实际做法是把“接收信号＋噪声”与已知波形做互相关：信号分量在正确时延处形成一个高出残差的峰，记录越长峰越突出。"
            ],
            points: [
              "相关＝平移后相乘再积分，衡量两个信号在不同时移下的相似度",
              "相关与卷积只差“是否反折”：R_xy(τ) 是 x 与 y*(−τ) 的卷积，频域上是 X 乘 Y 的共轭",
              "按 R_xy(τ)=平均[x(t)y*(t−τ)] 定义，峰值时移与“y 相对 x 的延迟”符号相反（滞后 0.25 s ⇒ 峰值在 τ=−0.25 s）",
              "换下标要连共轭和符号一起换：R_yx(τ)=R_xy*(−τ)（实信号才写成 R_xy(−τ)）",
              "归一化相关系数满足 |ρ|≤1：1 为完全相关，0 为正交",
              "周期信号能量无限，要用时间平均的功率相关；峰值按周期重复，测时延须先限定在一个周期内"
            ],
            pitfalls: [
              "把相关的 τ 符号记反：R_xy(τ)=平均[x(t)y*(t−τ)] 的峰值出现在“延迟量”的相反数处（延迟 +0.25 s → 峰值在 τ=−0.25 s）；换下标时复信号是 R_yx(τ)=R_xy*(−τ)，不能写成 R_xy(−τ)",
              "对周期信号直接套能量型相关积分：积分发散，必须改用时间平均的功率相关；而且峰值每周期重复，不限定搜索范围就会差出整数个周期",
              "把“互相关期望为零”当成“样本互相关处处为零”：零均值且与信号不相关的噪声，其互相关期望在所有时延处为零，但有限数据估计一定有残差",
              "直接用互相关峰值高度比较不同信号：必须先归一化，否则能量大的信号天然占优"
            ],
            links: [
              { to: "signals-ch5-description", why: "确定信号的相关概念推广到随机信号，就是自相关函数与功率谱密度" },
              { to: "signals-ch4-specs", why: "匹配滤波（相关检测）是已知波形加噪声下的最优检测，与滤波器指标同源" }
            ],
            formula: "\\begin{aligned}R_{xy}(\\tau)&=\\int_{-\\infty}^{\\infty}x(t)y^*(t-\\tau)\\,dt\\\\\\rho_{xy}(\\tau)&=\\frac{R_{xy}(\\tau)}{\\sqrt{R_{xx}(0)R_{yy}(0)}}\\\\\\mathcal F\\{R_{xy}\\}&=X(j\\omega)Y^*(j\\omega)\\end{aligned}",
            variables: ["Rxy：互相关函数", "ρxy：归一化相关系数", "τ：相对时移", "*：复共轭"]
          },
          {
            id: "signals-ch1-advanced",
            group: "第五节 应用MATLAB的连续信号分析",
            title: "复杂推导与 MATLAB 扩展",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "这一节把主线略过的推导补齐，并给出可复算的工具路径。需要知道的边界是：傅里叶级数的收敛性（狄利克雷条件、吉布斯现象）、变换性质的严格推导、拉普拉斯变换的初值与终值定理，各有前提，不能无条件套用。主线只要求你能用工具核对结果，推导按需选读。",
            detail: [
              "吉布斯现象是一种“不一致收敛”现象：部分和在跳变点附近的最大偏差不随项数消失，而这并不否定满足狄利克雷条件时级数在每一点的逐点收敛——逐点收敛仍然成立，只是收敛在跳变附近不一致。对 ±1 方波（跳变量 2），以最高奇次谐波 N 的部分和测量，过冲随 N 增大趋于跳变量的约 8.95%；有限项的过冲必须具体计算，不能一概断言大于或小于该极限（本例 N=1、3、5 分别约为 13.66%、10.02%、9.42%，都高于渐近值）。这也解释了理想低通滤波器的阶跃响应为什么会有振铃，以及实际滤波器为什么要在过渡带陡峭程度与过冲之间做取舍。",
              "复算路径：用符号计算核对变换对与性质，用数值卷积核对分段结果。核对前先固定尺度约定（横轴用 f 还是 ω、1/2π 放在哪一侧），再逐项比对。工具给出的曲线只能作旁证，解析分段式仍是判据——数值误差会掩盖符号与常数错误。"
            ],
            points: [
              "狄利克雷条件是傅里叶级数收敛的充分条件，不满足时逐点收敛可能失效",
              "吉布斯过冲的渐近极限约为跳变幅度的 8.95%（N→∞，N 为最高奇次谐波）；有限项的值需具体计算，不能一概断言小于该极限",
              "终值定理要求 sX(s) 的极点全部位于开左半平面（等价说法：X(s) 允许在 s=0 有一阶极点，其余极点都在左半平面），否则结论无效",
              "工具用于核对，解析式用于判定"
            ],
            pitfalls: [
              "用终值定理求振荡或发散信号的“终值”：极点不在允许区域时定理不成立",
              "把吉布斯过冲当成程序缺陷：它是级数截断的数学后果"
            ],
            links: [
              { to: "signals-ch4-specs", why: "过渡带与过冲的取舍，就是滤波器指标之间的权衡" }
            ],
          }
        ],
        examples: [
          {
            title: "两个正弦叠加后还是周期信号吗",
            prompt: "x(t)=cos(2πt)+cos(3t)（t 以秒计），判断它是否为周期信号；若是，求基波周期。",
            steps: [
              "cos(2πt) 的角频率 ω₁=2π，周期 T₁=2π/ω₁=1 s。",
              "cos(3t) 的角频率 ω₂=3，周期 T₂=2π/3 s。",
              "两周期之比 T₁/T₂=3/(2π) 是无理数，不存在能同时容纳整数个 T₁ 与 T₂ 的公共周期。"
            ],
            answer: "不是周期信号。两个分量的周期之比为无理数时，叠加结果不再周期；若换成 cos(4πt)（T=0.5 s），比值 2:1 为有理数，合成周期就是 1 s。"
          },
          {
            title: "含跳变信号的导数",
            prompt: "x(t)=2u(t)−3u(t−2)，求 dx/dt。",
            steps: [
              "先看波形：t<0 时 x=0；0≤t<2 时 x=2；t≥2 时 x=2−3=−1。",
              "t=0 处向上跳变 2，对应强度 +2 的冲激。",
              "t=2 处从 2 跳到 −1，向下跳变 3，对应强度 −3 的冲激。"
            ],
            answer: "dx/dt=2δ(t)−3δ(t−2)。平坦段导数为 0，只有跳变点留下冲激，强度等于跳变幅度、符号由跳变方向决定。"
          },
          {
            title: "用特征点回代定位变换后的峰值",
            prompt: "已知 x(t) 在 t=2 处有一个峰值，求 y(t)=x(3−2t) 的峰值位置。",
            steps: [
              "把自变量写成标准形：3−2t=−2(t−1.5)，读出压缩倍数 |a|=2、翻转。",
              "令新自变量等于原峰值位置：3−2t=2。",
              "解得 t=0.5。"
            ],
            answer: "峰值移到 t=0.5。同时因 |a|=2>1 且 a<0，波形在时间轴上压缩 2 倍并左右翻转。"
          },
          {
            title: "矩形脉冲的镜像变换",
            prompt: "x(t)=1（0≤t≤1），其他时刻为 0。求 y(t)=x(2−t) 的非零区间。",
            steps: [
              "把目标式写成标准形：2−t=−(t−2)，即“先翻转、再右移 2”。",
              "先翻转：x(−t) 的非零区间由 [0,1] 变到 [−1,0]。",
              "再右移 2（t 换成 t−2）：区间移到 [1,2]，即 x(−(t−2))=x(2−t)。",
              "交叉验证：直接解 0≤2−t≤1，同样得到 1≤t≤2。"
            ],
            answer: "y(t)=1 当 1≤t≤2，其他时刻为 0——原来的 [0,1] 被镜像到 [1,2]，区间长度不变而位置对称。反过来先右移再翻转只会得到 x(−t−2)（支撑 [−3,−2]），是错的。"
          },
          {
            title: "与冲激、阶跃卷积分别得到什么",
            prompt: "设 y(t)=x(t)*h(t)。当 h(t)=δ(t−1) 与 h(t)=u(t) 时，y(t) 分别是什么？",
            steps: [
              "与移位冲激卷积：y(t)=x(t)*δ(t−1)=x(t−1)，只是把输入整体右移 1。",
              "与阶跃卷积：y(t)=∫x(τ)u(t−τ)dτ，而 u(t−τ) 在 τ≤t 时为 1、τ>t 时为 0，于是积分上限收缩到 t。",
              "所以 y(t)=∫_{−∞}^{t}x(τ)dτ，即输入到当前时刻为止的累积（滑动积分）。"
            ],
            answer: "h=δ(t−1) 时 y(t)=x(t−1)；h=u(t) 时 y(t)=∫_{−∞}^{t}x(τ)dτ，是输入 x 的滑动积分。注意这只是“冲激响应为 u(t) 的系统对任意输入 x 的输出”，不要把 ∫x 叫做阶跃响应——该系统的阶跃响应是输入取 u(t) 时的输出 (u*u)(t)=t·u(t)。"
          },
          {
            title: "由冲激响应求阶跃响应",
            prompt: "某 LTI 系统的冲激响应 h(t)=e^(−2t)u(t)。用分解与线性求它的阶跃响应 g(t)。",
            steps: [
              "把阶跃写成冲激的积分：u(t)=∫_{−∞}^{t}δ(τ)dτ。",
              "积分是线性运算，由线性与时不变性，输出等于 h 的同样积分。",
              "g(t)=∫_{0}^{t}e^(−2τ)dτ=(1−e^(−2t))/2，t≥0（t<0 时积分为 0）。"
            ],
            answer: "g(t)=((1−e^(−2t))/2)·u(t)。t→∞ 时终值 1/2，正好等于 h(t) 曲线下的总面积。"
          },
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
          },
          {
            title: "判断拉普拉斯变换能否退化为傅里叶变换",
            prompt: "x(t)=e^(3t)u(−t)（只在 t<0 存在的左边信号，用双边拉普拉斯变换），写出 X(s)、收敛域，并判断它的傅里叶变换是否存在。",
            steps: [
              "只在 t<0 上积分：X(s)=∫_{−∞}^{0} e^(3t)·e^(−st) dt，把两个指数合并得 ∫_{−∞}^{0} e^((3−s)t) dt。",
              "积分收敛要求 Re(3−s)>0，即 Re{s}<3；在此收敛域下 X(s)=1/(3−s)=−1/(s−3)，极点在 s=3，收敛域位于极点左侧。",
              "收敛域 Re{s}<3 包含虚轴（σ=0<3），所以 s=jω 可以代入：傅里叶变换存在。"
            ],
            answer: "X(s)=1/(3−s)，收敛域 Re{s}<3，包含虚轴，因此傅里叶变换存在：X(jω)=1/(3−jω)。这里 X(s)=−1/(s−3) 与左边信号 −e^(3t)u(−t) 对应；信号在 t→−∞ 时按 e^(3t) 衰减到 0，是有界的。"
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
          },
          {
            id: "signals-ch1-check-6",
            prompt: "同一代数式 X(s)=1/(s−3)，若收敛域取 Re{s}<3，它对应的时域信号是：",
            options: ["右边信号 e^(3t)u(t)", "左边信号 −e^(3t)u(−t)", "双边信号", "不含指数因子的常数"],
            answer: 1,
            explanation: "收敛域在极点左侧对应左边信号；同一个代数式在 Re{s}>3 时才是 e^(3t)u(t)。"
          },
          {
            id: "signals-ch1-check-7",
            prompt: "相关与卷积在运算上的区别是：",
            options: ["相关不反折其中一个信号，卷积要反折", "相关只在频域做", "卷积不需要积分", "两者完全相同"],
            answer: 0,
            explanation: "卷积含反折步骤，相关不含；这正是 R_xy(τ)=x(τ)*y*(−τ) 中多出一个共轭反折的原因。"
          },
          {
            id: "signals-ch1-check-8",
            prompt: "正弦信号 cos(2π·50t) 的频率与角频率分别是：",
            options: ["50 Hz 与 100π rad/s", "100π Hz 与 50 rad/s", "50 Hz 与 50 rad/s", "两者数值相同"],
            answer: 0,
            explanation: "一般式 cos(ωt) 中 ω=2π·50=100π rad/s，对应频率 f=ω/2π=50 Hz。"
          },
          {
            id: "signals-ch1-check-9",
            prompt: "δ(2t) 等于：",
            options: ["2δ(t)", "δ(t)", "δ(t)/2", "无法确定"],
            answer: 2,
            explanation: "δ(at)=δ(t)/|a|：时间轴压缩 2 倍后，为保持面积为 1，冲激强度必须减半。"
          },
          {
            id: "signals-ch1-check-10",
            prompt: "x(2t−2) 相当于对 x(t) 做的操作是：",
            options: ["先右移 2 再压缩 2 倍", "先右移 2 再拉伸 2 倍", "先左移 2 再压缩 2 倍", "先压缩 2 倍再右移 2"],
            answer: 0,
            explanation: "x(2t−2)=x(2(t−1))：等价于“先右移 2 再压缩 2”，或“先压缩 2 再右移 1”；若先压缩再右移 2，得到的是 x(2t−4)。"
          },
          {
            id: "signals-ch1-check-11",
            prompt: "若 x(t) 只在 0≤t≤1 上非零，则 x(2−t) 的非零区间是：",
            options: ["0≤t≤1", "1≤t≤2", "−1≤t≤0", "2≤t≤3"],
            answer: 1,
            explanation: "令 0≤2−t≤1 直接解得 1≤t≤2。等价的操作顺序是先翻转得 [−1,0]，再右移 2；若先右移 2 得 [2,3] 再翻转，得到的是 x(−t−2)，支撑 [−3,−2]。"
          },
          {
            id: "signals-ch1-check-12",
            prompt: "x(t)*δ(t−t₀) 的结果是：",
            options: ["x(t)", "x(t−t₀)", "x(t₀)", "x(t)·δ(t−t₀)"],
            answer: 1,
            explanation: "与移位冲激卷积只把信号平移到 t₀ 处，这也是“冲激响应能描述整个系统”的起点。"
          },
          {
            id: "signals-ch1-check-13",
            prompt: "卷积积分 y(t)=∫x(τ)h(t−τ)dτ 成立，依赖系统的哪两条性质？",
            options: ["线性与时不变", "因果与稳定", "无记忆与可逆", "周期性与对称性"],
            answer: 0,
            explanation: "移位靠时不变（δ(t−τ)→h(t−τ)），加权叠加靠线性；缺任何一条都不能写成卷积。"
          }
        ],
        summary: [
          "时域用冲激分解与卷积解释信号如何通过系统：分解—求响应—叠加。",
          "频域把卷积化为乘法，复频域把可分析范围扩到增长信号与初始条件，代价是必须写明收敛域。",
          "相关函数比较两个信号在不同时移下的相似度，峰值位置给出周期或时延。",
          "选工具的次序：先看信号是否绝对可积，再看是否需要初始条件，最后看问题是否涉及时移比较。"
        ],
        tags: ["连续信号", "卷积", "傅里叶变换", "拉普拉斯变换", "相关"]
      },
      {
        id: "signals-ch2",
        number: "第2章",
        title: "离散信号的分析",
        counted: true,
        sourceStatus: "verified_local",
        objectives: [
          "解释采样模型、频谱复制、混叠与理想重建条件。",
          "区分 DFS、DTFT、DFT 与 FFT 各自处理的对象与用途，并说明它们的联系。",
          "用 Z 变换（含收敛域）分析离散序列与离散系统。",
          "用可复算的工具命令验证离散卷积、频谱与 Z 变换的解析结论。"
        ],
        prerequisites: ["第1章傅里叶级数与傅里叶变换", "等比数列求和", "复平面与单位圆"],
        sourceRef: [
          "课件_第3章-离散信号分析.pdf",
          "课件_第3章-频域分析.pdf",
          "课件_第3章-Z变换.pdf",
          "课件_第3章-DFTFFT.pdf",
          "课件_第3章-FFT.pdf",
          "个人笔记/03_整理摘要/02_采样混叠与采样定理.md",
          "个人笔记/03_整理摘要/03_傅里叶变换与FFT.md",
          "开放讲义（spatialaudio）：sampling、discrete_signals、discrete_time_fourier_transform、discrete_fourier_transform、z_transform",
          "开放讲义（Typst）：sampling、dt_fourier_transform"
        ],
        connections: [
          { to: "signals-ch1", kind: "prereq", why: "连续信号的时域、频域与复频域三套工具是本章每个概念的对照物：采样把连续频谱周期化，DTFT 是连续 FT 的离散对应，Z 变换是拉普拉斯变换的离散对应。" },
          { to: "signals-ch3", kind: "next", why: "第3章用系统的语言统一时域、频域与 z 域分析；本章的卷积和与 Z 变换就是那三套方法的离散工具。" },
          { to: "signals-ch4", kind: "next", why: "数字滤波器的设计（IIR/FIR）直接建立在本章的 DFT、FFT 与 Z 变换之上。" },
          { to: "digital-08", kind: "cross", why: "模-数转换器把采样、量化与编码做成硬件：本章给出采样率与混叠的判据，数电第 8 章给出电路实现。" },
          { to: "digital-01", kind: "cross", why: "量化后的样点要变成二进制码字，编码与数制规则见数电第 1 章。" },
          { to: "signals-ch5", kind: "cross", why: "随机信号的功率谱估计用的正是本章的 DFT/FFT 与相关运算。" }
        ],
        sections: [
          {
            id: "signals-ch2-sampling",
            group: "第一节 离散信号的时域描述和分析",
            title: "信号的采样和恢复",
            importance: "core",
            sourceStatus: "verified_local",
            content: "上一章把连续信号放在时域、频域和复频域里看了一遍，这一节开始把它送进数字世界。采样的动作很简单：以等间隔 T 在时刻 nT 上取 x_c(t) 的值，得到序列 x[n]=x_c(nT)。但它对频谱做了什么并不直观——采样不是近似取点，而是在频域把原频谱以采样角频率 Ω_s=2π/T 为周期整份复制。理解这一步，后面采样定理、混叠与重建才有落点。",
            detail: [
              "把采样写成连续信号与冲激串相乘最容易看清频域后果：p(t)=Σδ(t−nT)，x_s(t)=x_c(t)·p(t)。时域相乘对应频域卷积，而冲激串的频谱仍是间隔 Ω_s 的冲激串，于是 X_s(jΩ)=(1/T)·Σ X_c(j(Ω−kΩ_s))——原频谱被搬移到每个 kΩ_s 上叠加，形成周期延拓。注意每一份副本的幅度被乘了 1/T，量纲从谱密度变成离散样点的谱。",
              "恢复是采样的逆过程：只要各份副本互不重叠且都在折叠频率 Ω_s/2 之内，用一个理想低通（截止 Ω_s/2、增益 T）就能截出原来那一份。理想低通对应的时域冲激响应是 sinc，所以重建就是给每个样点配一个以它为中心的 sinc 并叠加。工程上用零阶保持（DAC 的实际行为）代替理想插值：它简单可实现，但等效于给频谱乘上 sinc 包络，高频被压低，因此实际电路后面还要补一级重建滤波。"
            ],
            points: [
              "采样 = 连续信号与冲激串相乘，样点值就是 x[n]=x_c(nT)",
              "频域后果是频谱以 Ω_s=2π/T 为周期整份复制，每份幅度乘 1/T",
              "恢复 = 用理想低通截出 Ω_s/2 以内的一份；时域等价于 sinc 插值",
              "零阶保持实现简单，但引入 sinc 包络失真，需要后级重建滤波补偿"
            ],
            pitfalls: [
              "把采样理解成“隔一段时间记一个数”、与频谱无关：采样的全部后果都在频域的周期延拓上",
              "忘了副本幅度带 1/T：比较连续谱与离散谱的数值时，量纲与幅度都要换算"
            ],
            links: [
              { to: "signals-ch2-sampling-time", why: "副本不重叠的条件就是下一节的时域采样定理" },
              { to: "signals-ch1-frequency", why: "用到的“时域相乘＝频域卷积”与冲激串频谱来自第1章的性质表" }
            ],
            formula: "\\begin{aligned}p(t)&=\\sum_{n=-\\infty}^{\\infty}\\delta(t-nT)\\\\[2pt]x_s(t)&=x_c(t)\\,p(t)\\\\[2pt]X_s(j\\Omega)&=\\frac{1}{T}\\sum_{k}X_c\\big(j(\\Omega-k\\Omega_s)\\big)\\end{aligned}",
            variables: [
              "T：采样间隔（s），Ω_s=2π/T 为采样角频率",
              "p(t)：冲激串，间距为 T",
              "x_c(t)：被采样的连续信号；x_s(t) 为采样后的冲激串信号",
              "X_c(jΩ)：原连续频谱；X_s(jΩ) 为采样后频谱（周期延拓）"
            ]
          },
          {
            id: "signals-ch2-sampling-time",
            group: "第一节 离散信号的时域描述和分析",
            title: "时域采样定理",
            importance: "core",
            sourceStatus: "verified_local",
            content: "上一节的频谱复制图给出一个明确的边界：只要相邻副本不重叠，原频谱就能被完整截出。把“不重叠”写成采样率与信号带宽的不等式，就是时域采样定理。它是本章所有数字处理的前提，也是工程上唯一无法用后续数字手段补救的错误来源。",
            detail: [
              "设 x_c(t) 带限于最高频率 f_max（即 |f|>f_max 时频谱为零）。周期延拓后相邻副本的间隔是 f_s=1/T，不重叠要求 f_s>2f_max；f_s/2 称为折叠频率。唯一恢复的条件要写成严格不等式：等号 f_s=2f_max 并不够——取 x_c(t)=sin(2πf_max t)，在 t=nT=n/(2f_max) 处样点为 sin(πn)≡0，与“全零信号”给出完全相同的样点，仅凭样点无法判断原信号是哪一个。要恢复，还要排除这类恰好落在折叠频率上的端点分量（等价于要求信号能量集中在 |f|<f_s/2 之内）。",
              "一旦 f_s<2f_max，超过折叠频率的分量不会消失，而是折叠到低频：f_s=100 Hz 采样时，99 Hz、101 Hz 与 1 Hz 的余弦都给出同一组样点；换成正弦则 99 Hz 与 101 Hz 的样点符号相反（分别等价于 −1 Hz 与 +1 Hz）——折叠保留的是频率的绝对值，相位会随落在第几条折叠带而改变。混叠是确定性折叠而不是随机噪声，换一个采样率，折叠后的位置会跟着变——这既是判别混叠的方法，也说明它一旦发生就无法由该组样点挽回。工程做法固定为三步：采样之前用模拟抗混叠低通把 f_max 压到 f_s/2 以内、采样率给滤波器留过渡带余量、采样之后不再指望数字滤波补救。"
            ],
            points: [
              "唯一恢复的条件是严格不等式 f_s>2f_max；等号处存在 sin(2πf_max t) 这类反例（样点全零）",
              "f_s/2 是折叠频率；超过它的分量会折叠到低频，保留的是频率绝对值",
              "折叠改变相位：f_s=100 Hz 时 99 Hz 与 101 Hz 的余弦样点相同，正弦样点符号相反",
              "抗混叠滤波器必须在采样器之前，采样率要给它的过渡带留余量"
            ],
            pitfalls: [
              "把 f_s≥2f_max 当成唯一恢复的充分条件：等号处端点频谱信号会失效，必须排除该情形",
              "只按 2f_max 机械取采样率，不给抗混叠滤波器的过渡带留余量"
            ],
            links: [
              { to: "signals-ch2-sampling", why: "定理是上一节频谱不重叠条件的直接写法" },
              { to: "signals-ch2-sampling-freq", why: "下一节给出与时域采样定理对偶的频域版本" }
            ],
            formula: "f_s>2f_{\\max},\\qquad f_s=\\frac{1}{T}",
            variables: [
              "f_s：采样频率（Hz），等于 1/T",
              "f_max：信号的最高有效频率（带宽上限）",
              "f_s/2：折叠频率（奈奎斯特频率）",
              "2f_max：奈奎斯特率；等号不保证唯一恢复，须排除折叠频率上的端点分量"
            ]
          },
          {
            id: "signals-ch2-sampling-freq",
            group: "第一节 离散信号的时域描述和分析",
            title: "频域采样定理",
            importance: "core",
            sourceStatus: "verified_local",
            content: "时域采样定理说的是“时域取样、频域周期化”，把两个域互换就得到本节的对偶结论：频域取样、时域周期化。它回答的是另一个方向的可行性问题——能不能用有限个频域样点完整表示一个时域序列。答案同样是“只要不重叠就行”，只不过这次的限制落在时域长度上。",
            detail: [
              "对长度为 N 的有限长序列 x[n]（n=0,…,N−1），把它的 DTFT X(e^{jω}) 在 ω=2πk/N 上等间隔取样，得到 N 个值 X[k]。频域采样定理指出：这 N 个样点可以唯一恢复原序列，方式是 x[n]=(1/N)Σ X[k]e^{j2πkn/N}。道理与上一节对偶：频域取样使时域周期延拓，x_N[n]=Σ_r x[n+rN]，原序列如果正好落在一个周期以内，延拓时就不会相互重叠。注意唯一恢复是有前提的——必须已知序列长度 N 与它的支撑位置，否则同一组频域样点对应的是那条周期求和序列，而不是任意一个长度 N 的片段。",
              "序列长度超过 N 却硬用 N 个频点表示时，得到的是周期求和 x_N[n] 的样点：时域上首尾相互叠加，超出周期的部分折回到开头。这与“截断”不是一回事——fft(x,N) 在 N 小于数据长度时直接丢掉尾部，结果只保留前 N 个样点；而频域取样对应的是循环叠加。两者数值一般不同（例如 [1,2,3,4] 取 2 点频域样本对应 [1+3, 2+4]=[4,6]，截断则得到 [1,2]）。这组“时域长度 N ↔ 频域样点数 N”的对应关系，正是下一节离散傅里叶变换的定义来源。"
            ],
            points: [
              "频域采样定理是时域采样定理的对偶：频域取样 ⇒ 时域周期求和 x_N[n]=Σ_r x[n+rN]",
              "长度 N 的有限长序列可由 N 个等间隔频域样点唯一恢复，但前提是已知长度与支撑位置",
              "长度超过 N 时得到的是周期求和（首尾叠加），它与“截断掉尾部”是两件事，数值一般不同",
              "DFT 的定义正是取 DTFT 一个周期内的 N 个等间隔样点"
            ],
            pitfalls: [
              "把两个采样定理混为一谈：一个是“时域取样、频域周期化、限制带宽”，另一个是“频域取样、时域周期化、限制长度”",
              "把频域取样的时域后果说成“截断误差”：周期求和会把超出周期的部分折回叠加，截断只是丢尾，两者结果不同",
              "以为频域多取几个点就能提高分辨率：样点变密只改变观察密度，真正的分辨率由记录长度决定"
            ],
            links: [
              { to: "signals-ch2-sampling-time", why: "本节是它的对偶版本，放在一起记最省力" },
              { to: "signals-ch2-dft", why: "DFT 就是本节结论的直接实现" }
            ],
            formula: "\\begin{aligned}X[k]&=X(e^{j\\omega})\\Big|_{\\omega=2\\pi k/N}\\\\[2pt]x[n]&=\\frac{1}{N}\\sum_{k=0}^{N-1}X[k]e^{j2\\pi kn/N}\\end{aligned}",
            variables: [
              "N：序列长度，也是频域取样点数",
              "X(e^{jω})：序列的 DTFT（连续、以 2π 为周期）",
              "X[k]：第 k 个频域样点，取样间隔 2π/N",
              "n：时域序号，取 0,…,N−1"
            ]
          },
          {
            id: "signals-ch2-discrete-desc",
            group: "第一节 离散信号的时域描述和分析",
            title: "离散信号的描述",
            importance: "core",
            sourceStatus: "verified_local",
            content: "前面三节解决“怎么得到序列”，从这一节开始处理“序列本身长什么样”。离散序列 x[n] 只在整数序号上有定义，这个区别看起来只是记号，但它带来两条连续世界没有的规则：尺度变换不能随意取非整数倍，周期性的判据也从“频率之比”变成“整数比”。",
            detail: [
              "基本序列先备齐：单位样值 δ[n]（n=0 时为 1，其余为 0）、单位阶跃 u[n]、实指数 a^n、复指数 e^{jω₀n}、正弦与矩形序列。与连续情形最大的不同在于 δ[n] 是普通函数：它有确定的值 1，不是极限意义上的冲激，但同样具备筛选性质 Σx[n]δ[n−k]=x[k]，而这条性质正是卷积和的出发点。",
              "周期性要单独判断。连续正弦 cos(ωt) 对任何 ω 都周期，而离散复指数 e^{jω₀n} 只有满足 ω₀N=2πk（N、k 为整数）时才周期，等价说法是 ω₀/(2π)=k/N 必须是有理数。例如 cos(2n) 的 ω₀=2，2/(2π)=1/π 是无理数，它不是周期序列。另两条常用指标：能量 E=Σ|x[n]|² 有限则为能量序列；功率用长时间平均定义，P=lim_{K→∞}(1/(2K+1))Σ_{n=−K}^{K}|x[n]|²，当该极限存在且有限（非零）时称功率序列。对周期序列，这个长时间平均退化为一个周期内的平均 (1/N)Σ_{n=0}^{N−1}|x[n]|²，所以周期平均只是周期序列的简化算法，不是功率的一般定义。"
            ],
            points: [
              "离散序列只在整数序号上有定义，记为 x[n]",
              "单位样值 δ[n] 是普通函数（δ[0]=1），并有筛选性质 Σx[n]δ[n−k]=x[k]",
              "e^{jω₀n} 周期 ⟺ ω₀/(2π) 为有理数；cos(2n) 不是周期序列",
              "周期序列属功率序列；能量有限的序列属能量序列"
            ],
            pitfalls: [
              "照搬连续结论，认为任何离散正弦都是周期的：必须检验 ω₀/(2π) 是否为有理数",
              "把 δ[n] 当成连续冲激 δ(t)：它没有“面积为 1”的说法，就是取值为 1 的一个样点"
            ],
            links: [
              { to: "signals-ch2-discrete-time", why: "下一节把这些基本序列拿去做运算" },
              { to: "signals-ch1-time-basic", why: "与第1章的基本信号一一对照，能看出离散与连续的分界" }
            ],
            formula: "\\delta[n]=\\begin{cases}1,&n=0\\\\0,&n\\neq0\\end{cases},\\qquad \\sum_{n}x[n]\\delta[n-k]=x[k]",
            variables: [
              "n：整数序号（无量纲）",
              "δ[n]：单位样值序列",
              "u[n]：单位阶跃序列（n≥0 时为 1）",
              "e^{jω₀n}：复指数序列，ω₀ 为数字角频率（rad）"
            ]
          },
          {
            id: "signals-ch2-discrete-time",
            group: "第一节 离散信号的时域描述和分析",
            title: "离散信号的时域运算",
            importance: "core",
            sourceStatus: "verified_local",
            content: "有了基本序列，还要能对它们做操作。移位、反折、加乘与连续情形一样，但“尺度变换”和“微积分”这两件事在离散域必须改写：时间轴只有整数格点，抽取与插零取代了压缩与拉伸，差分与累加取代了微分与积分。这一节把工具备齐，最后落到离散卷积和。",
            detail: [
              "逐点运算与连续一致：移位 x[n−n₀] 右移 n₀、反折 x[−n]、相加与相乘按序号逐点做。反折只是把序号取负，样点一个不少、信息不丢，是一一对应的可逆运算——它不属于抽取。真正的抽取是整数倍 M>1 的下采样 y[n]=x[Mn]：只保留每 M 个样点中的一个，对任意序列一般不可逆。它可逆的例外情形是序列事先已被限带到 |ω|<π/M：此时抽取后的频谱副本不重叠，可以用插值重建原序列。抽取之前必须先抗混叠（把带宽压到新的折叠频率以内），否则照样混叠。",
              "上采样（插零）是另一件事：x_u[n]=x[n/L]（n 为 L 的整数倍）而其余位置取 0——它只是把样点拉开、中间补零，频谱被压缩到 |ω|<π/L 并产生镜像，因此插零之后还要接一个低通插值滤波器，才得到真正意义上的“插值”。差分与累加是微积分的离散对应：一阶后向差分 x[n]−x[n−1] 对应微分，累加 Σ_{k=−∞}^{n}x[k] 对应积分，两者互为逆运算（差去常数）。卷积和把两个序列合起来：y[n]=Σ_{k}x[k]h[n−k]，步骤与连续卷积相同（改元、翻转、平移、相乘、求和），区别主要是求和代替积分；结果同样可以按 n 的区间分段写出，只是分段点是整数而不是连续区间。它满足交换律、结合律与分配律，并满足 x[n]*δ[n−n₀]=x[n−n₀]。"
            ],
            points: [
              "反折 x[−n] 是一一对应的可逆运算，不是抽取；抽取指整数倍 M>1 的下采样 x[Mn]",
              "抽取对任意序列一般不可逆；若序列已限带到 |ω|<π/M，抽取后可插值重建",
              "插零 x_u[n]=x[n/L]（整除处）其余为 0，之后必须接低通插值滤波器才成为插值",
              "差分对应微分、累加对应积分；卷积和用求和代替积分，结果仍可按整数区间分段"
            ],
            pitfalls: [
              "把反折当成“丢点的尺度变换”：反折不丢样点，丢点的是整数倍抽取",
              "对 x[Mn] 直接套用连续尺度变换的结论：抽取一般不可逆，除非序列事先限带",
              "把插零当插值：插零只在整除位置保留原值、其余位置为 0，必须再接插值滤波"
            ],
            links: [
              { to: "signals-ch2-discrete-desc", why: "运算作用在上一节的基本序列上" },
              { to: "signals-ch3-time", why: "卷积和是第3章描述离散 LTI 系统的语言" }
            ],
            formula: "y[n]=\\sum_{k=-\\infty}^{\\infty}x[k]\\,h[n-k]",
            variables: [
              "x[n]：输入序列",
              "h[n]：单位样值响应",
              "k：求和序号",
              "y[n]：零状态响应（卷积和）"
            ]
          },
          {
            id: "signals-ch2-dfs",
            group: "第二节 离散信号的频域分析",
            title: "周期序列的频域分析（DFS）",
            importance: "core",
            sourceStatus: "verified_local",
            content: "第一节末的卷积和是时域工具，从这一节起换到频域。周期序列的频域表示叫离散傅里叶级数（DFS）：它把周期序列拆成有限个谐波，而谐波个数正好等于序列的周期。这个“有限”是离散域独有的性质——连续周期信号的谐波是无穷多个。",
            detail: [
              "设 x[n] 以 N 为周期，DFS 把它写成 N 个复指数之和：x[n]=Σ_{k=0}^{N-1}a_k e^{j2πkn/N}，系数 a_k=(1/N)Σ_{n=0}^{N-1}x[n]e^{−j2πkn/N}。两式的求和都只有 N 项，因为 e^{j2πkn/N} 对 k 以 N 为周期——k 和 k+N 给出同一个基函数。于是“频谱”只在 N 个频点上取值，而且这 N 个值自身也是以 N 为周期的。",
              "与连续 FS 对照记忆：连续的谐波频率 kω₀ 无限延伸、系数随 k 衰减；离散的谐波只有 N 个、系数以 N 为周期重复。原因还是采样——频域周期化之后，一个周期以外的频谱只是重复，没有新信息。实序列还有共轭对称 a_k=a*_{−k}，因此幅度谱关于 k=N/2 对称，实际只需一半数据。"
            ],
            points: [
              "以 N 为周期的序列，DFS 只用 N 个谐波即可完全表示",
              "系数 a_k 也以 N 为周期：k 与 k+N 是同一个基函数",
              "与连续 FS 的差别：连续有无穷多条谐波且系数衰减，离散只有 N 条且循环重复",
              "实序列满足 a_k=a*_{−k}，幅度谱关于 N/2 对称，只需一半数据"
            ],
            pitfalls: [
              "把 DFS 的求和写成无穷级数：周期序列的谐波数等于周期 N，是有限项",
              "忽略系数的周期性，在 k>N 处继续按连续 FS 的衰减规律外推"
            ],
            links: [
              { to: "signals-ch2-sampling-time", why: "谐波只有 N 个，正是采样造成的频域周期化" },
              { to: "signals-ch2-dtft", why: "让周期趋于无穷，DFS 就过渡到下一节的 DTFT" }
            ],
            formula: "\\begin{aligned}a_k&=\\frac{1}{N}\\sum_{n=0}^{N-1}x[n]e^{-j2\\pi kn/N}\\\\[2pt]x[n]&=\\sum_{k=0}^{N-1}a_k e^{j2\\pi kn/N}\\end{aligned}",
            variables: [
              "N：序列的周期（整数）",
              "a_k：第 k 次谐波系数，以 N 为周期",
              "n：时域序号；k：谐波序号",
              "e^{j2πkn/N}：第 k 个谐波基函数"
            ]
          },
          {
            id: "signals-ch2-dtft",
            group: "第二节 离散信号的频域分析",
            title: "非周期序列的频域分析（DTFT）",
            importance: "core",
            sourceStatus: "verified_local",
            content: "周期序列用 N 条谱线表示，非周期序列则需要连续谱——这就是离散时间傅里叶变换（DTFT）。它与第1章的连续时间傅里叶变换形式相似，但频谱有两处结构性差别：以 2π 为周期、而且是数字角频率 ω 的函数。这两点都直接来自“时域是离散的”这一前提。",
            detail: [
              "定义是 X(e^{jω})=Σ_{n=−∞}^{∞}x[n]e^{−jωn}，反变换是 x[n]=(1/2π)∫_{2π}X(e^{jω})e^{jωn}dω。因为 e^{−jωn} 对 ω 以 2π 为周期，X(e^{jω}) 必然以 2π 为周期；而时域离散使求和而不是积分，所以只要序列绝对可和（Σ|x[n]|<∞）级数就收敛。这两个特征与连续 FT 正好对偶：时域离散 ⇒ 频域周期，时域周期 ⇒ 频域离散。",
              "它与第1章的关系可以一句话概括：对连续信号采样，其频谱被周期化，X_s(jΩ)=(1/T)ΣX_c(j(Ω−kΩ_s))；把频率按 ω=ΩT 归一化到数字角频率，取其中一个周期，就得到 DTFT。因此 ω=π 对应的物理频率是 f_s/2（折叠频率），ω=2π 对应 f_s。换算时记住 ω 是无量纲的 rad，物理频率要乘 f_s/(2π)。"
            ],
            points: [
              "DTFT 定义 X(e^{jω})=Σx[n]e^{−jωn}；绝对可和是它绝对收敛的充分条件，不是必要条件",
              "频谱以 2π 为周期、关于 ω 连续；周期来自时域离散",
              "时域离散 ⇒ 频域周期；时域周期 ⇒ 频域离散（与连续情形对偶）",
              "ω=π 对应折叠频率 f_s/2；物理频率 = ω·f_s/(2π)"
            ],
            pitfalls: [
              "把 ω 当成物理角频率：DTFT 的 ω 是归一化数字角频率，换算成赫兹要乘 f_s/(2π)",
              "只在 0–2π 之外讨论频谱：DTFT 以 2π 为周期，区间之外只是重复"
            ],
            links: [
              { to: "signals-ch1-frequency", why: "DTFT 就是连续频谱在一个周期内的归一化版本" },
              { to: "signals-ch2-dft", why: "把 DTFT 在一个周期内等间隔取样，就得到 DFT" }
            ],
            formula: "\\begin{aligned}X(e^{j\\omega})&=\\sum_{n=-\\infty}^{\\infty}x[n]e^{-j\\omega n}\\\\[2pt]x[n]&=\\frac{1}{2\\pi}\\int_{2\\pi}X(e^{j\\omega})e^{j\\omega n}\\,d\\omega\\end{aligned}",
            variables: [
              "ω：数字角频率（rad），以 2π 为周期",
              "X(e^{jω})：DTFT，连续且周期",
              "n：整数序号",
              "积分区间 2π：任意一个完整周期即可"
            ]
          },
          {
            id: "signals-ch2-dft",
            group: "第二节 离散信号的频域分析",
            title: "离散傅里叶变换（DFT）",
            importance: "core",
            sourceStatus: "verified_local",
            content: "DTFT 的频谱是连续函数，计算机存不下也算不完。要在机器上做频谱分析，必须把频率也离散化——这就是离散傅里叶变换（DFT）：对长度为 N 的有限长序列，在 DTFT 的一个周期内等间隔取 N 个点。它同时是第一节频域采样定理的直接实现，也是下一节 FFT 要加速的那个对象。",
            detail: [
              "定义是 X[k]=Σ_{n=0}^{N-1}x[n]e^{−j2πkn/N}，k=0,…,N−1；反变换 x[n]=(1/N)Σ_{k=0}^{N-1}X[k]e^{j2πkn/N}。X[k] 就是 X(e^{jω}) 在 ω=2πk/N 上的样点，因此频域网格间距是 Δf=f_s/N_fft（N_fft 为变换点数），能观察到的最高频率是 f_s/2（对应 k=N_fft/2）。网格间距不等于分辨能力——能否分开两个靠近的频率，由记录时长 T_rec=L/f_s（L 为实际数据点数）与窗函数主瓣宽度决定，补零只把网格加密。",
              "DFT 隐含周期性：正反变换的指数都以 N 为周期，等价于把序列和频谱都当作周期为 N 的循环序列。这带来两个必须知道的后果。其一是循环卷积：时域循环卷积对应频域相乘，要得到线性卷积的结果必须补零到长度 ≥ N₁+N₂−1。其二是截断效应：对长信号取 N 点相当于乘矩形窗，频谱被窗函数的谱“涂抹”，形成泄漏（旁瓣）与栅栏效应（只看得到离散频点，真实峰值落在频点之间时读数偏低）。增加 N 提高分辨率，换窗函数只改变泄漏与主瓣宽度的折中，两者不能互相替代。"
            ],
            points: [
              "DFT 是 DTFT 在一个周期内的 N 个等间隔样点，X[k]=Σx[n]e^{−j2πkn/N}",
              "频域网格间距 Δf=f_s/N_fft；可观察的最高频率是 f_s/2（k=N_fft/2）",
              "DFT 隐含 N 周期：时域循环卷积 ↔ 频域相乘，线性卷积需补零到 ≥N₁+N₂−1",
              "截断带来泄漏与栅栏效应：加长记录提高分辨率，换窗只改泄漏与主瓣的折中"
            ],
            pitfalls: [
              "用 DFT 直接算线性卷积而忘记补零：得到的是循环卷积，尾部会绕回开头",
              "把栅栏效应当成“频率不存在”：峰落在两个频点之间时被摊平，增加 N 或换窗才能改善"
            ],
            links: [
              { to: "signals-ch2-sampling-freq", why: "频域采样定理说明了为什么 N 个频点足够表示长度 N 的序列" },
              { to: "signals-ch2-fft-idea", why: "下一节讨论如何把 DFT 的计算量降下来" }
            ],
            formula: "X[k]=\\sum_{n=0}^{N-1}x[n]e^{-j2\\pi kn/N},\\qquad k=0,1,\\dots,N-1",
            variables: [
              "N：变换长度（数据点数）",
              "k：频率序号，对应频率 f_k=k·f_s/N",
              "n：时间序号",
              "Δf=f_s/N_fft：频域网格间距；分辨能力另由记录时长 T_rec=L/f_s 决定"
            ]
          },
          {
            id: "signals-ch2-fft-idea",
            group: "第三节 快速傅里叶变换（FFT）",
            title: "快速傅里叶变换的基本思路",
            importance: "core",
            sourceStatus: "verified_local",
            content: "DFT 的定义是 N 次乘法求和，算全部 N 个频点就是 O(N²) 次运算。N=1024 时约一百万次，N=10⁶ 时是一万亿次——直接算频谱分析根本没法用。FFT 不是新的变换，而是利用旋转因子的对称性和周期性，把同一个 DFT 算得更快。这一节只讲思路，下一节给算法。",
            detail: [
              "记旋转因子 W_N=e^{−j2π/N}，则 X[k]=Σx[n]W_N^{kn}。W_N 有三条性质可用：周期性 W_N^{k+N}=W_N^k、对称性 W_N^{k+N/2}=−W_N^k、可约性 W_N^{kn}=W_{N/m}^{kn/m}。周期性说明只有 N 个不同的旋转因子，对称性说明一半的值只是另一半取负，可约性说明大问题能拆成小问题——这三条就是全部加速空间的来源。",
              "具体做法是分治：把 N 点 DFT 按序号奇偶拆成两个 N/2 点 DFT，再合并。这样每层把运算量减半、共 log₂N 层，总复杂度从 O(N²) 降到 O(N log₂N)。N=1024 时约 10⁴ 量级，比直接计算快两个数量级。代价是基本算法要求 N 为 2 的幂（基2算法），实际使用中通常把数据补零到最近的 2 的幂——注意补零不增加信息量，它只是让算法可用并让频点更密。"
            ],
            points: [
              "DFT 直接计算是 O(N²)；FFT 用分治把它降到 O(N log₂N)",
              "加速只来自旋转因子 W_N 的周期性、对称性与可约性",
              "基2算法要求 N 为 2 的幂，通常补零到最近的 2 的幂",
              "补零不增加信息量：分辨率仍由有效记录长度决定"
            ],
            pitfalls: [
              "把 FFT 当成一种新的变换：它与 DFT 结果完全一致，只改变计算量",
              "以为补零能提高分辨率：补零只让频点更密，不增加可分辨的频率间隔"
            ],
            links: [
              { to: "signals-ch2-dft", why: "FFT 算的就是上一节定义的 DFT" },
              { to: "signals-ch2-fft-radix2", why: "下一节给出按时间抽取的基2蝶形算法" }
            ],
            formula: "W_N=e^{-j2\\pi/N},\\qquad X[k]=\\sum_{n=0}^{N-1}x[n]W_N^{kn}",
            variables: [
              "W_N：旋转因子（twiddle factor）",
              "N：变换长度",
              "周期性：W_N^{k+N}=W_N^{k}",
              "对称性：W_N^{k+N/2}=−W_N^{k}"
            ]
          },
          {
            id: "signals-ch2-fft-radix2",
            group: "第三节 快速傅里叶变换（FFT）",
            title: "基2FFT算法",
            importance: "core",
            sourceStatus: "verified_local",
            content: "这一节把上一节的分治思路写成具体算法，取按时间抽取（DIT）的基2形式。它是所有 FFT 教材的公共起点，也是理解“为什么快”“为什么要求 N 是 2 的幂”“为什么需要位倒序”的最短路径。",
            detail: [
              "把 x[n] 按 n 的奇偶分成两组：偶序号 x[2r] 与奇序号 x[2r+1]，各自做 N/2 点 DFT，记为 E[k] 与 O[k]。代入定义并用 W_N^{2kr}=W_{N/2}^{kr} 化简，得到蝶形关系 X[k]=E[k]+W_N^k O[k] 与 X[k+N/2]=E[k]−W_N^k O[k]，k=0,…,N/2−1。一次复数乘法加两次加减就出一对输出，这就是“蝶形”名字的来源。",
              "把同样的拆分递归下去，共 log₂N 层，每层 N/2 个蝶形，总运算量约 (N/2)log₂N 次复数乘法，即 O(N log₂N)。因为每层都按奇偶重新分组，输入序列的实际访问顺序是位倒序（bit-reversal），就地计算时通常先把输入按位倒序重排，再逐层蝶形。如果 N 不是 2 的幂，可以用混合基或补零。补零后算的是补零序列的 DFT，它只在与原网格重合的那些频点上等于原值，其余频点是插值：例如数据长度 L=300、补到 N_fft=1024 时，只有 k=0、75、150、225 四处与 300 点网格重合；只有 N_fft 是 L 的整数倍（如 256 补到 1024）时，原来的全部频点才都落在新网格上。"
            ],
            points: [
              "按时间抽取：奇偶分组后 E[k]、O[k] 由蝶形合并成 X[k] 与 X[k+N/2]",
              "蝶形核心：X[k]=E[k]+W_N^k O[k]，X[k+N/2]=E[k]−W_N^k O[k]",
              "共 log₂N 层，每层 N/2 个蝶形，总复杂度 O(N log₂N)",
              "就地计算需要位倒序重排输入；补零只在网格重合处保留原值，其余频点是插值"
            ],
            pitfalls: [
              "把位倒序当成算法错误：它是按奇偶递归分组的必然结果，重排后结果不变",
              "认为补零后的 N 点 DFT 等于原序列的 N 点 DFT：只有原来的频点值相同，中间频点是插值"
            ],
            links: [
              { to: "signals-ch2-fft-idea", why: "蝶形就是上一节分治思路的具体形式" },
              { to: "signals-ch2-fft-apps", why: "下一节说明算出来之后怎么用" }
            ],
            formula: "\\begin{aligned}X[k]&=E[k]+W_N^{k}O[k]\\\\[2pt]X[k+N/2]&=E[k]-W_N^{k}O[k]\\end{aligned}",
            variables: [
              "E[k]、O[k]：偶序号与奇序号子序列的 N/2 点 DFT",
              "W_N^{k}：旋转因子",
              "k=0,1,…,N/2−1",
              "N：2 的幂（基2算法的前提）"
            ]
          },
          {
            id: "signals-ch2-fft-apps",
            group: "第三节 快速傅里叶变换（FFT）",
            title: "FFT的应用",
            importance: "core",
            sourceStatus: "verified_local",
            content: "会算 FFT 不等于会用它。最常见的两类用法是用它做快速卷积和做频谱分析，此外还有相关、调制识别、滤波器组等。两类的参数选择规则不同，选错的后果也不同——前者要注意补零长度，后者要注意分辨率、泄漏与栅栏效应。这一节把两条用法和对应的检查项列清楚。",
            detail: [
              "快速卷积：两个长度分别为 N₁、N₂ 的序列，线性卷积长度是 N₁+N₂−1。把两者都补零到 N ≥ N₁+N₂−1，做 N 点 FFT、频域相乘、再 IFFT，就得到线性卷积结果。这样做的代价从 O(N₁N₂) 降到 O(N log₂N)，序列越长越划算。若数据是分块到来的（实时处理），用重叠相加法或重叠保留法把长序列切成块，块间用 FFT 卷积再拼起来，避免只做循环卷积导致尾部绕回。",
              "频谱分析：先定采样率 f_s（按奈奎斯特率留余量），再由需要的分辨能力反推记录时长 T_rec≈1/Δf 与数据点数 L=f_s·T_rec，最后把点数补到 2 的幂做 FFT。读数时记住三条：谱线间隔是 Δf，可观察上限是 f_s/2，加窗会同时加宽主瓣并压低旁瓣——矩形窗主瓣最窄但旁瓣最高，汉宁窗旁瓣低但主瓣宽，选窗是折中而不是“越好越好”。若要比较不同长度记录的幅度，还要按窗函数的相干增益做归一化。"
            ],
            points: [
              "快速卷积：补零到 N≥N₁+N₂−1 再做 N 点 FFT 相乘，得到的是线性卷积",
              "实时分块用重叠相加或重叠保留，避免循环卷积的尾部绕回",
              "频谱分析先定 f_s，再由 Δf 反推记录时长 T_rec≈1/Δf 与数据点数 L=f_s·T_rec，最后补零到 2 的幂",
              "加窗是主瓣宽度与旁瓣高度的折中；比较幅度要按窗的相干增益归一化"
            ],
            pitfalls: [
              "补零长度不足就做频域相乘：得到循环卷积，结果尾部绕回开头",
              "把 Δf 当成“加窗能改善的量”：分辨率的物理下限由记录时间 T=N/f_s 决定，加窗不能突破"
            ],
            links: [
              { to: "signals-ch2-fft-radix2", why: "用到的就是上一节的快速算法" },
              { to: "signals-ch4-fir", why: "快速卷积是 FIR 滤波的一种高效实现方式" }
            ],
            formula: "\\Delta f=\\frac{f_s}{N_{fft}},\\qquad T_{rec}=\\frac{L}{f_s},\\qquad N_{fft}\\ge N_1+N_2-1",
            variables: [
              "Δf=fs/N_fft：频域网格间距（Hz）",
              "T_rec=L/fs：记录时长（s）；分辨能力由它与窗主瓣宽度决定",
              "L：实际数据点数；N_fft：FFT 点数（补零后常取 2 的幂）",
              "N₁、N₂：参与卷积的两个序列长度"
            ]
          },
          {
            id: "signals-ch2-z",
            group: "第四节 离散信号的z域分析",
            title: "离散信号的Z变换",
            importance: "core",
            sourceStatus: "verified_local",
            content: "DTFT 的收敛性条件里，绝对可和是一个充分条件（不是必要条件）——指数增长序列在通常意义下没有 DTFT，含初始条件的差分方程也不好处理——这与第1章傅里叶变换遇到的困境完全对应。解法也对应：在变换核上加一个实指数权重 r^{−n}，把频率推广成复变量 z，就得到 Z 变换。它是离散域的拉普拉斯变换。",
            detail: [
              "定义是 X(z)=Σ_{n=−∞}^{∞}x[n]z^{−n}，其中 z 为复变量。级数收敛的 z 取值集合称为收敛域（ROC）。常用变换对要连同收敛域一起记：δ[n]↔1（全平面）、a^n u[n]↔1/(1−az^{−1})（|z|>|a|）、−a^n u[−n−1]↔1/(1−az^{−1})（|z|<|a|）。最后两对说明关键的一点：同一个代数式配上不同收敛域，对应完全不同的序列。",
              "反变换有三条路：留数法（围线积分）、部分分式展开配合已知变换对、幂级数展开（长除法）。工程上最常用部分分式：先把 X(z)/z 展开成一次分式之和，再逐项查表，同时按收敛域决定每一项取右边还是左边序列。与拉普拉斯对照，z 平面的单位圆对应 s 平面的虚轴；ROC 含单位圆可保证 DTFT 绝对收敛，但这不是“一切意义下 DTFT 存在”的充要条件——下一节展开。"
            ],
            points: [
              "Z 变换 X(z)=Σx[n]z^{−n}，是离散域的拉普拉斯变换",
              "收敛域 ROC 是变换的组成部分，必须与代数式一起给出",
              "同一代数式配不同 ROC 对应不同序列：如 1/(1−az^{−1}) 在 |z|>|a| 与 |z|<|a| 下分别是右边与左边序列",
              "反变换常用部分分式展开查表，按 ROC 决定每一项取左边还是右边"
            ],
            pitfalls: [
              "只写 X(z) 不写收敛域：这是本章与第1章拉普拉斯一节共同的最高频失分点",
              "直接用幂级数长除法求反变换而不检查 ROC：得到的只是某一个收敛域下的那一支"
            ],
            links: [
              { to: "signals-ch2-z-relations", why: "下一节把 Z 变换与拉普拉斯、DTFT、DFT 连起来" },
              { to: "signals-ch1-laplace", why: "两者是同一套思想在连续与离散域的两次出现" }
            ],
            formula: "X(z)=\\sum_{n=-\\infty}^{\\infty}x[n]z^{-n},\\qquad z\\in\\mathrm{ROC}",
            variables: [
              "z：复变量，z=re^{jω}；ω 为数字角频率（rad）",
              "ROC：使级数收敛的 z 平面区域",
              "a^n u[n] ↔ 1/(1−az^{−1})，ROC 为 |z|>|a|",
              "单位圆 |z|=1：ROC 含它可保证 DTFT 绝对收敛（充分条件）"
            ]
          },
          {
            id: "signals-ch2-z-relations",
            group: "第四节 离散信号的z域分析",
            title: "Z变换与其他变换之间的关系",
            importance: "core",
            sourceStatus: "verified_local",
            content: "本章到这里已经出现五套变换：连续侧的傅里叶变换与拉普拉斯变换，离散侧的 DTFT、DFT 与 Z 变换。它们不是并列的五件事，而是两套坐标下的同一件事。这一节用映射关系把它们串成一张图，也是复习本章最有效的方式。",
            detail: [
              "Z 变换与拉普拉斯：z=e^{sT} 联系的是“采样冲激串的拉普拉斯变换”与“序列的 Z 变换”——把 x_s(t)=Σx[n]δ(t−nT) 做拉普拉斯变换得 Σx[n]e^{−snT}，令 z=e^{sT} 正是 X(z)。它不是把原连续信号 x_c(t) 的拉普拉斯表达式直接换变量：x_c(t)=e^{−t}u(t) 的变换是 1/(s+1)，采样后序列的 Z 变换是 1/(1−e^{−T}z^{−1})，用 s=ln(z)/T 代入 1/(s+1) 并不等于它。映射性质：s 左半平面（σ<0）映到单位圆内（|z|<1），虚轴 σ=0 映到单位圆；每条宽 2π/T 的横带都多对一地映到 z 平面去掉原点的部分，z=0 不能由任何有限的 s 到达。判断稳定性不需要“选哪条横带”，判据只看极点是否落在单位圆内。",
              "Z 变换与 DTFT：把 z 取在单位圆上，z=e^{jω}，Z 变换退化为 DTFT。收敛域包含单位圆可以保证 DTFT 绝对收敛，但这是充分条件，不是“一切意义下 DTFT 存在”的充要条件——周期序列的 ROC 不含单位圆，却仍有广义（冲激串）谱。注意区分两个频率记号：ω 是数字角频率（rad，以 2π 为周期），连续角频率 Ω=ω/T 才是 rad/s。DFT 再进一步：它是 DTFT 在一个周期内等间隔取的 N 个点，即单位圆上的 N 等分点 z=e^{j2πk/N}。四者关系可排成一条链：拉普拉斯 → (z=e^{sT}) → Z 变换 → (单位圆) → DTFT → (N 点等角采样) → DFT。稳定性判据只适用于因果、有理的 LTI 输入输出系统：极点全在单位圆内就 BIBO 稳定；一般情形仍要看 ROC，零极点图本身不能替代 ROC。"
            ],
            points: [
              "z=e^{sT} 联系的是采样冲激串的拉普拉斯变换与序列的 Z 变换，不是原连续信号变换式的变量替换",
              "左半平面 ↔ 单位圆内，虚轴 ↔ 单位圆；横带多对一映到非零 z 平面，z=0 不由有限 s 到达",
              "ROC 含单位圆 ⇒ DTFT 绝对收敛（充分条件）；周期序列用广义谱，不适用这条判据",
              "数字角频率 ω 与连续角频率 Ω 相差因子 T：Ω=ω/T",
              "因果、有理 LTI 系统：极点全在单位圆内即 BIBO 稳定；一般情形看 ROC，零极点图不能替代 ROC"
            ],
            pitfalls: [
              "用 s=ln(z)/T 代入原连续信号的拉普拉斯表达式，声称得到了 Z 变换",
              "把“ROC 含单位圆”当成 DTFT 存在的充要条件：它只保证绝对收敛，周期序列要用广义谱",
              "只看零极点图判断稳定性而不看 ROC，或对非因果、非有理系统直接套用“极点都在单位圆内”"
            ],
            links: [
              { to: "signals-ch2-z", why: "本节是上一节 ROC 概念的自然延伸" },
              { to: "signals-ch3-complex", why: "第3章用单位圆与极点位置统一讨论离散系统的因果性与稳定性" }
            ],
            formula: "z=e^{sT},\\qquad z=e^{j\\omega}\\ (\\text{单位圆}),\\qquad z_k=e^{j2\\pi k/N}",
            variables: [
              "s=σ+jΩ：连续复频率，Ω 为连续角频率（rad/s）；T：采样间隔",
              "z=e^{sT}：采样冲激串的拉普拉斯变换到 Z 变换的映射（多对一，不取 z=0）",
              "|z|=1：单位圆，对应 σ=0 的虚轴",
              "ω：数字角频率（rad），与 Ω 的关系为 Ω=ω/T",
              "z_k=e^{j2πk/N}：DFT 用的 N 等分点"
            ]
          },
          {
            id: "signals-ch2-matlab-desc",
            group: "第五节 应用MATLAB的离散信号分析",
            title: "利用MATLAB进行离散信号描述",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "这一节开始把前四节的解析结论交给工具复算。目标不是学会用软件，而是让工具替你做两件事：把序列画出来确认它是不是你以为的那个序列，以及用数值结果去核对解析结论。每个小节都给“命令要点 + 一个可验证的数值结论 + 与解析式的对照”。",
            detail: [
              "命令要点：用 n=0:N-1 显式建立序号向量（不要依赖数组下标从 1 开始的默认约定），用 stem(n,x) 画离散序列（plot 会连成折线，看起来像连续信号，是常见误用）；单位样值可以直接构造 x=[1 zeros(1,N-1)]，阶跃用 x=(n>=0)，复指数用 exp(1j*w0*n)。画周期序列前先算 ω₀/(2π) 是否为有理数。",
              "验证点：取 ω₀=2（即 cos(2n)），用 n=0:200 画图会看到波形并不重复，与解析判据“ω₀/(2π)=1/π 为无理数、不是周期序列”一致；再把 ω₀ 换成 π/8（π/8/(2π)=1/16 为有理数，周期 N=16），图上每 16 点重复一次，可以直接数出来。这一步把“离散正弦不一定周期”从公式变成可看见的事实。"
            ],
            points: [
              "序号向量必须显式建立：stem(n,x) 而不是 stem(x)",
              "画离散序列用 stem，用 plot 会连成折线造成误读",
              "复指数写成 exp(1j*w0*n)：i、j 虽是内置虚数单位，但常被同名循环变量覆盖，用 1j 最稳",
              "验证点：ω₀=2 不周期，ω₀=π/8 的周期为 16"
            ],
            pitfalls: [
              "用 plot 画离散序列后判断“信号是连续的”",
              "用数组下标当序号：MATLAB 下标从 1 开始，与 x[n] 的 n=0 起点错位"
            ],
            links: [
              { to: "signals-ch2-discrete-desc", why: "本节的验证点就是那一节的周期性判据" },
              { to: "signals-ch2-matlab-convolution", why: "下一步用同样的方式验证时域运算" }
            ]
          },
          {
            id: "signals-ch2-matlab-convolution",
            group: "第五节 应用MATLAB的离散信号分析",
            title: "离散卷积的计算",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "卷积和是本章第一个需要动手算的东西，也最适合用工具核对。这一节用 conv 把第一节的卷积和结果复算一遍，并特别关注两件事：结果的序号范围怎么定，以及它和 FFT 快速卷积的差别在哪里。",
            detail: [
              "命令要点：y=conv(x,h) 返回的是长度为 N₁+N₂−1 的线性卷积，但只有数值、不带时间信息——序号范围是两者的起点之和到终点之和。如果 x、h 的起点分别是 n1、n2，则 y 的起点是 n1+n2，画图时要用 ny=(n1+n2):(n1+n2+length(y)-1) 重新对齐，否则整条曲线会平移错位。要算循环卷积则用 ifft(fft(x).*fft(h))，两者在补零长度足够时结果一致。",
              "验证点：取 x=[1 1 1 1]（宽度 4 的矩形）与 h=[1 1]（宽度 2），conv 得到 [1 2 2 2 1]，长度 4+2−1=5，峰值 2 = min(4,2)，总和 8 = 4×2——与第一节“峰值取较短者、总面积等于两者面积之积”的结论逐条对上。再用频域路径核对：yf=ifft(fft(x,8).*fft(h,8))，前 5 点应与 conv 结果一致（容差 1e-10），后 3 点应近零。注意两条路径的数组长度必须相同——fft(x,8) 与 fft(h,8) 都补到 8 点才能逐个相乘；写成 fft([x zeros(1,3)]) 只有 7 点，与另一个 7 点数组虽然也能相乘，但那是 7 点循环卷积，与 8 点补零的含义不同。"
            ],
            points: [
              "conv 给线性卷积，长度 N₁+N₂−1，但不含序号信息，必须自己对齐起点",
              "补零后用 ifft(fft(x,8).*fft(h,8)) 得到同样的线性卷积：前 5 点等于 conv 结果，后 3 点近零",
              "验证点：x=[1 1 1 1]、h=[1 1] → [1 2 2 2 1]，峰值 2=min(4,2)，总和 8=4×2",
              "对比 conv 与 FFT 两条路径的误差，应落在机器精度量级"
            ],
            pitfalls: [
              "拿到 conv 的结果直接当 y[n] 画图：序号起点没对齐，整体平移错位",
              "补零长度不足就用 FFT 相乘：得到循环卷积，尾部绕回开头"
            ],
            links: [
              { to: "signals-ch2-discrete-time", why: "本节的验证对象就是那一节的卷积和" },
              { to: "signals-ch2-matlab-fft", why: "下一节把 FFT 路径展开" }
            ]
          },
          {
            id: "signals-ch2-matlab-spectrum",
            group: "第五节 应用MATLAB的离散信号分析",
            title: "离散信号的频域分析",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "频谱分析最容易“图很好看但读错”。这一节把读图的三条规则固化成可执行的步骤，并用一个已知答案的例子检查自己是否读对：给定采样率与信号频率，横轴换算出来的峰值必须落在预期位置上。",
            detail: [
              "命令要点：X=fft(x) 之后必须自己构造频率轴 f=(0:N-1)*(fs/N)；只看前一半 f(1:N/2+1)（对应 0 到 f_s/2），取 abs(X) 得幅度谱；若要看单边幅度谱，只有实序列才能这样构造：先除以 N，再把非直流分量乘 2；偶数 N 时直流分量与 k=N/2（奈奎斯特）都不翻倍，奇数 N 没有奈奎斯特端点。加窗后要按所用窗的相干增益归一化。窗口用 x=x.*hann(N)'，注意加窗后幅度与分辨率都会变，比较不同窗的结果前先统一归一化。",
              "验证点：取 fs=1000 Hz、x=cos(2π·100·t)，N=1000 点，fft 后峰值应出现在 k=100 处，换算成 f=100 Hz；把 N 改成 100（记录时间 0.1 s），分辨率降到 10 Hz，峰仍然读得到 100 Hz，但相邻频点间距从 1 Hz 变成 10 Hz——直接演示 Δf=f_s/N。再把信号频率改成 105 Hz，在 N=100 时峰值会摊到 100 与 110 两点上，这就是栅栏效应。"
            ],
            points: [
              "频率轴必须自己构造：f=(0:N-1)*(fs/N)，只看前一半",
              "单边幅度谱只对实序列成立：除 N 后非直流乘 2；偶数 N 时直流与 k=N/2 都不翻倍",
              "验证点：fs=1000、N=1000、100 Hz → 峰值在 k=100；N=100 时 Δf 变为 10 Hz",
              "105 Hz 在 N=100 时摊到相邻两点：栅栏效应的直接演示"
            ],
            pitfalls: [
              "不构造频率轴，直接把 fft 结果的下标当频率读数",
              "把整段 abs(X) 都当正频率读：后一半按频率轴的映射对应 0 到 −f_s/2 的负频，它与前半段共轭对称，不是更高的频率"
            ],
            links: [
              { to: "signals-ch2-dft", why: "读图规则都来自 DFT 的定义与参数约定" },
              { to: "signals-ch2-matlab-desc", why: "与第一节的序列观察配合，构成完整的“看时域再读频域”流程" }
            ]
          },
          {
            id: "signals-ch2-matlab-fft",
            group: "第五节 应用MATLAB的离散信号分析",
            title: "快速傅里叶变换",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "MATLAB 里 fft 就是 FFT，没有单独的“快速”开关——这一点本身就说明 FFT 与 DFT 的关系。这一节用两点验证把第三节的结论落地：复杂度差异有多大，以及补零到底改变了什么。",
            detail: [
              "命令要点：fft(x) 与 fft(x, N) 的区别在第二个参数——后者把序列补零或截断到 N 点。nfft=2^nextpow2(length(x)) 是常用写法，先把点数补到 2 的幂再变换。要比较直接 DFT 与 FFT 的耗时，可用 tic/toc 包住 fft(x) 与手写的双重循环 DFT，取 N=512 与 N=4096 两组看数量级差别。注意两点：fft 的实现不要求 N 是 2 的幂（库会按长度选择分解方式，素数长度也能算），而且实测耗时比不等于运算量比——缓存、向量化与库实现都会影响结果，所以只作量级验证，不要用具体倍数下结论。",
              "验证点：其一，补零不增加信息——数据长度 L=256、补零到 N_fft=1024 时，1024 是 256 的整数倍，原有 256 个频点全部落在新网格上，用容差（如 1e-10）比较应当一致；多出来的频点是插值（图形更光滑但峰宽不变）。若 L 与 N_fft 不是整数倍关系，就只有部分频点重合——例如 L=300 补到 1024 时只有 k=0、75、150、225 四处重合。其二，分辨率由有效记录长度决定——把同一个信号分别用 0.05 s 与 0.5 s 的记录长度做 FFT（都补零到相同点数），后者能把相隔更近的两个频率分开，前者不能。这两点合起来说明：补零改善的是显示密度，不是分辨能力。"
            ],
            points: [
              "fft(x, N) 的第二个参数是补零或截断到 N 点；常用 nfft=2^nextpow2(length(x))",
              "验证点一：L=256 补到 1024（整数倍）时原频点全重合，可用容差比较；L 与 N_fft 非整数倍时只有部分重合",
              "验证点二：记录长度从 0.05 s 增到 0.5 s 才能分开更近的两个频率",
              "fft 不要求 N 为 2 的幂；实测耗时比不等于运算量比，只作 O(N log N) 对 O(N²) 的量级验证"
            ],
            pitfalls: [
              "以为 fft(x, 4096) 让分辨率提高了 16 倍：补零只让频点更密，可分辨间隔未变",
              "把补零后的谱与原始谱逐点比较：只有落在新网格上的原有频点才应一致，其余是插值"
            ],
            links: [
              { to: "signals-ch2-fft-radix2", why: "fft 内部就是那一节的蝶形分解" },
              { to: "signals-ch2-matlab-z", why: "下一节换到 z 域做同样的对照" }
            ]
          },
          {
            id: "signals-ch2-matlab-z",
            group: "第五节 应用MATLAB的离散信号分析",
            title: "离散信号Z变换",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "Z 变换的工具支持分两条路：数值上围绕有理式做零极点、留数与差分方程的工作；符号计算则用 Symbolic Math Toolbox 的 ztrans/iztrans。要注意 ztrans 采用的是单边定义（求和从 n=0 起），因此不能用它去验证需要双边才能区分的左序列与收敛域。两条路合起来说明：工程上真正使用的是 X(z) 的有理式结构，而不是变换定义本身。",
            detail: [
              "命令要点：把 X(z)=B(z)/A(z) 写成 z^{−1} 的降幂系数向量 b、a，然后 zplane(b,a) 画零极点图、tf2zp 求零点极点增益、residuez(b,a) 做部分分式展开（返回留数、极点与直接项）。差分方程用 filter(b,a,x) 求响应、impz 求单位样值响应、freqz 求频率响应。符号计算可用 Symbolic Math Toolbox 的 ztrans/iztrans（单边定义），双边问题仍要自己用部分分式加收敛域判断，再用上面的数值函数核对。",
              "验证点：取 b=[1]、a=[1 -0.5]，即 H(z)=1/(1−0.5z^{−1})。zplane 显示单极点 z=0.5 在单位圆内，据上一节的判据该系统因果且稳定；impz 给出 0.5^n，与解析式一致；freqz(1,[1 -0.5],[0 pi]) 显式指定两个端点频点，幅频响应在 ω=0 处为 1/(1−0.5)=2，在 ω=π 处为 1/(1+0.5)≈0.667，与把 z=±1 代入 H(z) 一致。这三条把“极点在单位圆内 ⇒ 稳定”“单位圆上取值 ⇒ 频率响应”从口诀变成可读的数。"
            ],
            points: [
              "Z 变换的工具围绕有理式：zplane 看零极点、residuez 做部分分式、freqz 求频响",
              "差分方程用 filter / impz 求响应，与解析推得的 h[n] 对照",
              "验证点：H(z)=1/(1−0.5z^{−1}) → 极点 0.5 在单位圆内，稳定；h[n]=0.5^n",
              "freqz(1,[1 -0.5],[0 pi]) 显式取端点：读数应等于把 z=±1 代入 H(z)"
            ],
            pitfalls: [
              "系数向量顺序写错：b、a 按 [b0,b1,…] 对应 z^0、z^{−1}、… 依次排列，不是 z 的正幂降序",
              "只画零极点图不看单位圆：稳定与否取决于极点相对单位圆的位置，不是相对原点"
            ],
            links: [
              { to: "signals-ch2-z-relations", why: "本节的每一条验证都对应那一节的映射与稳定性判据" },
              { to: "signals-ch2-z", why: "部分分式与 ROC 的判定在那两节已经讲清，这里只做数值复核" }
            ]
          }
        ],
        examples: [
          {
            title: "采样后频谱复制了几份",
            prompt: "x_c(t) 带限到 200 Hz，用 fs=1000 Hz 采样。折叠频率是多少？0–500 Hz 内能看到原频谱的几份副本？",
            steps: [
              "频域副本的间隔等于采样频率 fs=1000 Hz。",
              "折叠频率是 fs/2=500 Hz。",
              "原频谱只占 0–200 Hz，相邻副本中心相距 1000 Hz，因此 0–500 Hz 内只有中心在 0 的那一份。"
            ],
            answer: "折叠频率 500 Hz；0–500 Hz 内只有一份副本，因为 fs>2fmax 时副本互不重叠。"
          },
          {
            title: "判断采样后的混叠频率",
            prompt: "用 fs=1000 Hz 采样频率为 900 Hz 的正弦信号。采样序列呈现的最低等效频率是多少？",
            steps: [
              "离散角频率只在模 2π 意义下区分，频率可相差整数倍 fs。",
              "在 [0,fs/2] 内寻找等效频率：|900−1000|=100 Hz。",
              "原信号超过奈奎斯特频率 500 Hz，因此无法由样点判断它原本是 900 Hz。"
            ],
            answer: "样点呈现为 100 Hz；这是混叠，不能仅靠该采样序列恢复原 900 Hz 信号。"
          },
          {
            title: "频域采样点数够不够",
            prompt: "序列 x[n] 在 n=0,…,15 上非零（长度 16）。若只取 DTFT 的 12 个等间隔样点，能否唯一恢复 x[n]？",
            steps: [
              "频域采样定理要求取样点数不少于序列长度，否则时域周期延拓会重叠。",
              "本例长度 16>12，延拓周期 12 小于序列长度。",
              "结果是时域首尾相互叠加（越界混叠），丢掉的部分无法由这 12 个频点恢复。"
            ],
            answer: "不能。需要至少 16 个等间隔频域样点；12 点会造成时域首尾混叠。"
          },
          {
            title: "判断离散正弦是否周期",
            prompt: "判断 x[n]=cos(2n) 与 y[n]=cos(πn/8) 是否为周期序列，是则求周期。",
            steps: [
              "判据是 ω₀/(2π) 是否为有理数。",
              "对 x[n]：ω₀=2，2/(2π)=1/π 是无理数，故非周期。",
              "对 y[n]：ω₀=π/8，(π/8)/(2π)=1/16 是有理数；N=16 时 ω₀N=2π，故周期为 16。"
            ],
            answer: "cos(2n) 不是周期序列；cos(πn/8) 是周期序列，周期 N=16。"
          },
          {
            title: "抽取前的限带要求",
            prompt: "把采样率 48 kHz 的语音降到 16 kHz，直接抽取 3 倍可以吗？需要什么前提？",
            steps: [
              "抽取 3 倍后新的采样率是 16 kHz，新折叠频率是 8 kHz。",
              "原信号若含 8 kHz 以上的分量，抽取后会折叠进 0–8 kHz，且不可逆。",
              "因此必须先做数字低通把带宽限制在 8 kHz 以内（留过渡带余量），再抽取。"
            ],
            answer: "不可以直接抽；必须先抗混叠限带到 8 kHz 以内，再抽取 3 倍。"
          },
          {
            title: "求周期序列的 DFS 系数",
            prompt: "x[n] 以 N=4 为周期，一个周期内 x[0]=1、x[1]=1、x[2]=0、x[3]=0。求 a_0 与 a_2。",
            steps: [
              "a_k=(1/N)Σx[n]e^{−j2πkn/4}，N=4。",
              "a_0=(1/4)(1+1+0+0)=1/2。",
              "a_2=(1/4)(1·e^0+1·e^{−jπ}+0+0)=(1/4)(1−1)=0。"
            ],
            answer: "a_0=1/2（直流分量），a_2=0；系数以 N=4 为周期重复。"
          },
          {
            title: "由采样率换算 DTFT 的频率轴",
            prompt: "某系统采样率 fs=8 kHz。DTFT 中 ω=0.5π 对应的物理频率是多少？ω=π 呢？",
            steps: [
              "换算关系是 f=ω·fs/(2π)。",
              "ω=0.5π 时 f=0.5π×8000/(2π)=2000 Hz。",
              "ω=π 时 f=π×8000/(2π)=4000 Hz=fs/2，正是折叠频率。"
            ],
            answer: "ω=0.5π 对应 2 kHz；ω=π 对应 4 kHz（折叠频率）。"
          },
          {
            title: "DFT 的分辨率与最高频率",
            prompt: "以 fs=8000 Hz 采样，取 N=1024 点作 DFT。频率分辨率与可观察的最高频率各是多少？",
            steps: [
              "分辨率 Δf=fs/N=8000/1024≈7.8 Hz。",
              "k=0 对应直流，k=N/2=512 对应 fs/2=4000 Hz。",
              "k>N/2 的部分对应负频率，不是更高的正频率。"
            ],
            answer: "Δf≈7.8 Hz；可观察最高频率 4 kHz。"
          },
          {
            title: "FFT 与直接 DFT 的计算量对比",
            prompt: "N=1024 时，直接计算 DFT 与基2 FFT 的复数乘法量级各是多少？",
            steps: [
              "直接 DFT 约 N²=1024²≈1.05×10⁶ 次。",
              "基2 FFT 约 (N/2)log₂N=512×10=5.1×10³ 次。",
              "两者相差约两个数量级，与 N/log₂N 同量级。"
            ],
            answer: "约 10⁶ 对 5×10³ 次，相差约两个数量级。"
          },
          {
            title: "补零到 2 的幂改变了什么",
            prompt: "x 长度为 300，直接做 fft(x,1024)。与 fft(x) 相比，哪些频点的值是同一个谱的样点？",
            steps: [
              "fft(x,1024) 等于把 x 补零到 1024 点后做 DFT。",
              "只有两条网格重合的频点才等于原值：L=300 与 N_fft=1024 的重合条件是 k·1024 能被 300 整除。",
              "解出重合点只有 k=0、75、150、225 四处（分别对应 1024 点网格上的 0、256、512、768）。",
              "其余频点是同一条连续谱上的插值，分辨率并未提高。"
            ],
            answer: "只有 k=0、75、150、225 这四处（对应 1024 点网格的 0、256、512、768）与原 300 点 DFT 相同；其余是插值。"
          },
          {
            title: "蝶形合并两个 4 点 DFT",
            prompt: "已知偶数子序列 DFT 为 E[k]、奇数子序列为 O[k]。用蝶形写出 8 点 DFT 的 X[0] 与 X[4]。",
            steps: [
              "蝶形关系：X[k]=E[k]+W_8^k·O[k]，X[k+4]=E[k]−W_8^k·O[k]。",
              "取 k=0：W_8^0=1，故 X[0]=E[0]+O[0]。",
              "X[4]=X[0+4]=E[0]−O[0]。"
            ],
            answer: "X[0]=E[0]+O[0]，X[4]=E[0]−O[0]；一次加法加一次减法出一对输出。"
          },
          {
            title: "FFT 做线性卷积的补零长度",
            prompt: "x 长 100，h 长 30。用 FFT 求线性卷积，最少要多少点？取多少最省事？",
            steps: [
              "线性卷积长度 N₁+N₂−1=100+30−1=129。",
              "FFT 点数不小于 129，否则得到循环卷积、尾部绕回。",
              "取 2 的幂 256 可用基2算法，最省事。"
            ],
            answer: "最少 129 点；实践上取 256。"
          },
          {
            title: "同一代数式的两种收敛域",
            prompt: "X(z)=1/(1−0.5z^{−1})。分别取 ROC 为 |z|>0.5 与 |z|<0.5，写出对应的序列。",
            steps: [
              "查表：a^n u[n]↔1/(1−az^{−1})，ROC 为 |z|>|a|。",
              "取 |z|>0.5 得右边序列 x[n]=0.5^n u[n]。",
              "取 |z|<0.5 得左边序列 x[n]=−0.5^n u[−n−1]。"
            ],
            answer: "|z|>0.5 → 0.5^n u[n]；|z|<0.5 → −0.5^n u[−n−1]。同一代数式、不同 ROC、不同信号。"
          },
          {
            title: "判断离散系统的因果性与稳定性",
            prompt: "H(z)=1/(1−0.8z^{−1})，ROC 取 |z|>0.8。判断因果性与稳定性。",
            steps: [
              "ROC 是极点 0.8 外侧的圆外区域，对应右边序列，故因果。",
              "ROC |z|>0.8 包含单位圆（|z|=1>0.8）。",
              "因果且 ROC 含单位圆 ⇒ 极点全在单位圆内 ⇒ BIBO 稳定。"
            ],
            answer: "因果且稳定；判据是极点 0.8 落在单位圆内。"
          },
          {
            title: "用 stem 观察离散正弦的周期性",
            prompt: "画 n=0:200 上的 cos(2n) 与 cos(πn/8)，如何从图上确认周期性判据？",
            steps: [
              "序号向量 n=0:200，序列 x=cos(2*n)、y=cos(pi/8*n)。",
              "stem(n,x) 看不出重复；stem(n,y) 每隔 16 点重复一次。",
              "与判据对照：2/(2π)=1/π 无理数不周期；(π/8)/(2π)=1/16 有理数、周期 16。"
            ],
            answer: "cos(2n) 的图不重复、cos(πn/8) 每 16 点重复，与解析判据一致。"
          },
          {
            title: "conv 的结果怎么对齐序号",
            prompt: "x 在 n=0…3 上为 1，h 在 n=0…1 上为 1。求卷积并写出结果的序号范围。",
            steps: [
              "y=conv(x,h) 得到 [1 2 2 2 1]，长度 4+2−1=5。",
              "序号起点为两者起点之和 0+0=0，终点为终点之和 3+1=4。",
              "若直接按 y 的下标画图会把起点当成 1，整体错位。"
            ],
            answer: "y=[1 2 2 2 1]，定义在 n=0…4；峰值 2=min(4,2)，总和 8=4×2。"
          },
          {
            title: "读单边幅度谱",
            prompt: "fs=1000 Hz、N=1000 点，x 为 100 Hz 余弦。fft 后峰值在哪个 k？单边幅度谱读数约多少？",
            steps: [
              "频率轴 f=(0:N-1)*(fs/N)，间隔 1 Hz，故 100 Hz 对应 k=100。",
              "单边幅度谱要乘 2 除 N（直流除外）。",
              "幅度为 1 的余弦在 k=100 处读数约为 1。"
            ],
            answer: "峰值在 k=100（f=100 Hz），单边幅度谱约为 1。"
          },
          {
            title: "freqz 与解析频响对照",
            prompt: "H(z)=1/(1−0.5z^{−1})。用 freqz 读 ω=0 与 ω=π 的幅度，并与解析值比较。",
            steps: [
              "ω=0 对应 z=1：|H|=1/|1−0.5|=2。",
              "ω=π 对应 z=−1：|H|=1/|1+0.5|≈0.667。",
              "freqz([1],[1 -0.5]) 在这两点给出同样的数；极点 0.5 在单位圆内，响应有界。"
            ],
            answer: "ω=0 处 2、ω=π 处约 0.667，与把 z=±1 代入 H(z) 完全一致。"
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
            prompt: "采样在频域的效果是：",
            options: ["把频谱压缩到 fs/2 以内", "把频谱以 fs 为周期整份复制", "把频谱取共轭", "什么都不改变"],
            answer: 1,
            explanation: "时域乘冲激串 ⇒ 频域周期延拓：X_s(jΩ)=(1/T)ΣX_c(j(Ω−kΩ_s))，副本间隔为 Ω_s。"
          },
          {
            id: "signals-ch2-check-2",
            prompt: "信号带限于 B（且 B<fs/2）时，能正确重建原信号的滤波器是：",
            options: ["只能是截止 fs/2 的理想低通", "截止频率取在 B 与 fs−B 之间的理想低通", "截止 fs 的理想高通", "任意低通都行"],
            answer: 1,
            explanation: "只要截止频率 fc 满足 B<fc<fs−B，就只截出原频谱那一份、挡住相邻副本；fc=fs/2 是其中最常用的选择，但不是唯一可行值。"
          },
          {
            id: "signals-ch2-check-3",
            prompt: "带限到 4 kHz 的信号，以下哪个采样频率满足严格的奈奎斯特条件？",
            options: ["4 kHz", "8 kHz", "10 kHz", "6 kHz"],
            answer: 2,
            explanation: "临界值是 2fmax=8 kHz；工程上取严格大于并给抗混叠滤波器留过渡带，故 10 kHz 才是稳妥选择。"
          },
          {
            id: "signals-ch2-check-4",
            prompt: "抗混叠滤波器应该放在：",
            options: ["ADC 之后", "ADC 之前", "数字滤波器内部", "重建滤波之后"],
            answer: 1,
            explanation: "混叠发生在采样那一刻，只有采样之前的模拟低通才能阻止高频折叠；采样之后无法分离已折叠的分量。"
          },
          {
            id: "signals-ch2-check-5",
            prompt: "频域采样定理对应的时域后果是：",
            options: ["时域混叠", "时域周期延拓", "时域取共轭", "时域不变"],
            answer: 1,
            explanation: "与时域采样定理对偶：频域取样 ⇒ 时域以取样点数为周期延拓；序列长度超过该周期就发生越界混叠。"
          },
          {
            id: "signals-ch2-check-6",
            prompt: "长度 16 的有限长序列，至少需要多少个等间隔频域样点才能唯一恢复？",
            options: ["8", "12", "16", "32"],
            answer: 2,
            explanation: "取样点数不得少于序列长度，否则时域延拓周期小于长度，首尾重叠。"
          },
          {
            id: "signals-ch2-check-7",
            prompt: "x[n]=cos(2n) 是否为周期序列？",
            options: ["是，周期为 2π", "是，周期为 2", "不是，ω₀/(2π) 为无理数", "不是，离散正弦都不周期"],
            answer: 2,
            explanation: "离散复指数周期 ⟺ ω₀/(2π) 为有理数；2/(2π)=1/π 为无理数，故不周期。"
          },
          {
            id: "signals-ch2-check-8",
            prompt: "单位样值序列 δ[n] 的性质是：",
            options: ["面积为 1 的冲激", "δ[0]=1 的普通序列，并有筛选性质", "恒为 0", "只在 n=∞ 处非零"],
            answer: 1,
            explanation: "离散的 δ[n] 有确定取值（n=0 时为 1），不是极限意义上的冲激；筛选性质 Σx[n]δ[n−k]=x[k] 是卷积和的出发点。"
          },
          {
            id: "signals-ch2-check-9",
            prompt: "整数倍抽取 y[n]=x[Mn]（M 为大于 1 的整数）的可逆性是：",
            options: ["总是可逆", "对任意序列一般不可逆；若序列已限带到 |ω|<π/M 则可插值重建", "只在 M=2 时不可逆", "与反折 x[−n] 等价"],
            answer: 1,
            explanation: "抽取只保留每 M 个样点中的一个，任意序列丢失的信息无法找回；但若序列事先限带到 |ω|<π/M，抽取后频谱副本不重叠，可以用插值滤波重建。"
          },
          {
            id: "signals-ch2-check-10",
            prompt: "卷积和与连续卷积在运算上的区别是：",
            options: ["不用翻转", "用求和代替积分", "不需要平移", "结果一定是周期序列"],
            answer: 1,
            explanation: "步骤完全相同（改元、翻转、平移、相乘、相加），只是积分换成求和，结果是逐点序列而非分段函数。"
          },
          {
            id: "signals-ch2-check-11",
            prompt: "以 N 为周期的序列，DFS 需要用多少条谐波才能完全表示？",
            options: ["无穷多条", "N/2 条", "N 条", "2N 条"],
            answer: 2,
            explanation: "基函数 e^{j2πkn/N} 对 k 以 N 为周期，k 与 k+N 是同一个谐波；系数也以 N 为周期。"
          },
          {
            id: "signals-ch2-check-12",
            prompt: "DTFT 的频谱特征是：",
            options: ["离散且周期", "连续且以 2π 为周期", "连续且非周期", "离散且非周期"],
            answer: 1,
            explanation: "时域离散 ⇒ 频域周期；时域非周期 ⇒ 频域连续。两者互为对偶。"
          },
          {
            id: "signals-ch2-check-13",
            prompt: "采样率 fs=8 kHz 时，DTFT 中 ω=π 对应的物理频率是：",
            options: ["8 kHz", "4 kHz", "2 kHz", "π kHz"],
            answer: 1,
            explanation: "f=ω·fs/(2π)，ω=π 时 f=fs/2=4 kHz，即折叠频率。"
          },
          {
            id: "signals-ch2-check-14",
            prompt: "DFT 与 DTFT 的关系是：",
            options: ["两者是同一个函数", "DFT 是 DTFT 在一个周期内的 N 个等间隔样点", "DTFT 是 DFT 的快速算法", "两者频率轴不同但取样点相同"],
            answer: 1,
            explanation: "X[k] 就是 X(e^{jω}) 在 ω=2πk/N 上的取值；频域网格间距为 fs/N_fft，而分辨能力由记录时长决定。"
          },
          {
            id: "signals-ch2-check-15",
            prompt: "用 FFT 计算两个序列的线性卷积时，必须：",
            options: ["直接频域相乘", "补零到 N≥N₁+N₂−1 再相乘", "只保留前 N 点", "先做反折"],
            answer: 1,
            explanation: "不补零得到的是循环卷积，结果尾部会绕回开头。"
          },
          {
            id: "signals-ch2-check-16",
            prompt: "DFT 与 FFT 的关系是？",
            options: ["FFT 是另一种变换", "FFT 是高效计算 DFT 的算法", "DFT 只能用于模拟信号", "两者结果单位不同"],
            answer: 1,
            explanation: "FFT 不改变 DFT 的定义，只把计算量从 O(N²) 降到 O(N log₂N)。"
          },
          {
            id: "signals-ch2-check-17",
            prompt: "基2 FFT 蝶形运算的两条输出是：",
            options: ["E[k]+O[k] 与 E[k]−O[k]", "E[k]+W_N^k O[k] 与 E[k]−W_N^k O[k]", "E[k]·O[k] 与 E[k]/O[k]", "E[k] 与 O[k]"],
            answer: 1,
            explanation: "X[k]=E[k]+W_N^k O[k]，X[k+N/2]=E[k]−W_N^k O[k]；旋转因子作用在奇数支路。"
          },
          {
            id: "signals-ch2-check-18",
            prompt: "频谱分析中，频率分辨率最终由什么决定？",
            options: ["补零点数", "窗函数类型", "记录时长 T_rec=L/fs", "FFT 算法"],
            answer: 2,
            explanation: "分辨能力由记录时长 T_rec=L/fs（L 为数据点数）与窗主瓣宽度共同决定：补零只加密网格，换窗改变主瓣与旁瓣的折中，都不能突破记录时长的物理下限。"
          },
          {
            id: "signals-ch2-check-19",
            prompt: "写出 X(z)=1/(1−az^{−1}) 却不写收敛域，问题是：",
            options: ["没有问题", "同一代数式在不同 ROC 下对应不同序列", "缺一个常数因子", "收敛域只影响幅度"],
            answer: 1,
            explanation: "ROC 为 |z|>|a| 时对应 a^n u[n]，|z|<|a| 时对应 −a^n u[−n−1]；不写 ROC 就没有确定的序列。"
          },
          {
            id: "signals-ch2-check-20",
            prompt: "因果离散系统 BIBO 稳定的判据是：",
            options: ["极点全在左半平面", "极点全在单位圆内", "ROC 含虚轴", "零点全在单位圆内"],
            answer: 1,
            explanation: "z 平面的单位圆对应 s 平面的虚轴；因果系统要求 ROC 在最外极点之外，再加“含单位圆”即得极点全在圆内。"
          },
          {
            id: "signals-ch2-check-21",
            prompt: "Z 变换与拉普拉斯变换之间的映射关系是：",
            options: ["z=sT", "z=e^{sT}", "z=1/s", "z=ln(sT)"],
            answer: 1,
            explanation: "z=e^{sT} 联系的是采样冲激串的拉普拉斯变换与序列的 Z 变换：左半平面映到单位圆内，虚轴映到单位圆；映射是多对一的，每条宽 2π/T 的横带都映到 z 平面去掉原点的部分。"
          }
        ],
        summary: [
          "采样把连续频谱以 fs 为周期整份复制；副本不重叠的条件 f_s≥2f_max 就是时域采样定理。",
          "频域采样定理是它的对偶：N 个频点足以表示长度 N 的序列，这也正是 DFT 的定义来源。",
          "DFS 用 N 条谐波表示周期序列，DTFT 用连续周期谱表示非周期序列，DFT 是 DTFT 的 N 点采样。",
          "FFT 不改变 DFT 的定义，只把计算量降到 O(N log₂N)；分辨率的物理下限由记录时间决定。",
          "Z 变换是离散域的拉普拉斯变换，必须连同收敛域解释；单位圆与极点位置决定了 DTFT 是否存在以及系统是否稳定。"
        ],
        tags: ["离散信号", "采样", "DFT", "FFT", "Z变换", "信号处理桥接"]
      },
      {
        id: "signals-ch3",
        number: "第3章",
        title: "信号处理基础",
        counted: true,
        sourceStatus: "verified_local",
        objectives: [
          "逐项判断系统的线性、时不变性、因果性、无记忆性、BIBO 稳定性与可逆性。",
          "区分零输入、零状态与全响应，并在时域、频域、复频域三种方法间互相核对。",
          "说明系统辨识与逆滤波各自需要什么条件，并能指出不可实现的反例。",
          "描述数字信号处理的实现链路，并给出有限字长下量化误差的成立条件。"
        ],
        prerequisites: ["第1章卷积与拉普拉斯变换", "第2章离散卷积与Z变换"],
        sourceRef: [
          "教材第三章 信号处理基础（p190–259）",
          "课件_第4章-信号处理基础.pdf",
          "个人笔记/03_整理摘要/01_信号与系统主线.md",
          "开放讲义（spatialaudio）：systems_properties、systems_time_domain、systems_spectral_domain",
          "开放讲义（Typst）：lti"
        ],
        connections: [
          { to: "signals-ch2", kind: "prereq", why: "卷积和、Z 变换与收敛域是本章描述离散系统的工具；没有它们无法写出系统函数。" },
          { to: "signals-ch1", kind: "prereq", why: "连续侧同样需要卷积、拉普拉斯变换与极零点概念，本章把它们统一到“系统”这个对象上。" },
          { to: "signals-ch4", kind: "next", why: "滤波器就是被指标约束的 LTI 系统：本章给出判据，第4章用它们设计具体滤波器。" },
          { to: "signals-ch5", kind: "next", why: "把 LTI 系统的结论用到随机输入上，就是第5章的功率谱与最优滤波" },
          { to: "analog-06", kind: "cross", why: "模电第 5 章的负反馈与稳定性判据，是本章“极点位置决定稳定性”在电路上的实现。" },
          { to: "digital-08", kind: "cross", why: "数字信号处理的实现链路（采样—量化—运算—输出）在数电第 8 章落到转换器与电路。" }
        ],
        sections: [
          {
            id: "signals-ch3-desc",
            group: "第一节 系统及其性质",
            title: "系统的描述",
            importance: "core",
            sourceStatus: "verified_local",
            content: "前两章把信号本身讲透了，从这一章起补上“信号经过什么”。系统就是把输入映射为输出的规则，记作 y=T{x}。描述同一个系统有四条路径：框图、输入输出方程、冲激响应、系统函数。四条路径互为翻译，做题时先看已知条件落在哪一条上，再决定用哪一种。",
            detail: [
              "方程是第一条路。连续系统写成常系数线性微分方程，离散系统写成差分方程 y[n]=−Σa_k y[n−k]+Σb_k x[n−k]。方程阶数决定了需要几个初始条件才能定解：一阶差分方程要 y[−1]，二阶要 y[−1]、y[−2]。方程右边只含输入的项给出零状态响应的来源，左边带输出的项决定系统自身的动态。",
              "冲激响应与系统函数是第二条路。线性时不变（LTI）系统的 h(t) 或 h[n] 是系统的“指纹”：只要知道它，任意输入下的零状态响应都能用卷积算出来。对两边做变换就得到系统函数 H(s)=Y(s)/X(s) 或 H(z)=Y(z)/X(z)，它把卷积变成乘法。这里有一个必须记住的前提——H=Y/X 只在零状态下成立；含初始条件时，输出里多出与输入无关的零输入分量，这个比值不再是系统函数。"
            ],
            points: [
              "系统是映射 y=T{x}，描述方式有框图、方程、冲激响应、系统函数四条",
              "差分/微分方程的阶数决定需要几个初始条件",
              "LTI 系统的冲激响应 h 是完整指纹：任意输入的零状态响应 = x*h",
              "H=Y/X 只在零状态下成立；含初始条件时该比值不是系统函数"
            ],
            pitfalls: [
              "在非零初始条件下把 Y/X 直接当作系统函数：零输入分量会让这个比值随输入和初值改变",
              "把方程阶数与初始条件个数脱钩：n 阶方程需要 n 个初始条件才能定解"
            ],
            links: [
              { to: "signals-ch3-properties", why: "下一节逐项检验这些描述背后的系统性质" },
              { to: "signals-ch2-discrete-time", why: "离散系统的卷积和与差分方程都建立在第2章的时域运算上" }
            ],
            formula: "y[n]=-\\sum_{k=1}^{N}a_k y[n-k]+\\sum_{k=0}^{M}b_k x[n-k]",
            variables: [
              "x：输入；y：输出",
              "a_k、b_k：常系数（线性时不变的前提）",
              "N：方程阶数，也是所需初始条件的个数",
              "零状态条件下的系统函数 H(z)=Y(z)/X(z)"
            ]
          },
          {
            id: "signals-ch3-properties",
            group: "第一节 系统及其性质",
            title: "系统的性质",
            importance: "core",
            sourceStatus: "verified_local",
            content: "系统的性质必须逐项检验，不能由一个性质推断另一个。六个性质各有明确的判据：线性（齐次＋可加）、时不变（输入移位只引起同量输出移位）、无记忆（当前输出只依赖当前输入）、因果（不依赖未来输入）、BIBO 稳定（有界输入必有有界输出）、可逆（存在逆系统使级联为恒等）。",
            detail: [
              "两个反例最能说明“逐项判断”的必要。其一 y[n]=n·x[n]：它满足线性和无记忆，也是因果的，但含显式时间系数所以时变；更关键的是取 x[n]≡1（有界），输出 y[n]=n 在 n 遍历全部整数时无界，因此不是 BIBO 稳定。其二 y[n]=(x[n])²：它不是线性（T{2x}=4y≠2T{x}），但时不变、因果、无记忆，且 |x|≤1 时 |y|≤1，是 BIBO 稳定的。可见“线性”“稳定”“因果”“可逆”彼此不能互推。",
              "对 LTI 系统，几条判据可以化简：因果 ⟺ h[n]=0（n<0）；BIBO 稳定 ⟺ Σ|h[n]|<∞（连续情形为 ∫|h(t)|dt<∞）；可逆则要求存在 h_inv 使 h*h_inv=δ。稳定与可逆是两件事：稳定系统可以有零点在关键频率上，使逆系统不可实现或不可稳定实现——这正是下一节解卷积要处理的问题。"
            ],
            points: [
              "线性要求同时满足齐次性与可加性，只满足一条不算线性",
              "y[n]=n·x[n]：线性、无记忆、因果，但时变且非 BIBO 稳定（取 x≡1 得 y=n 无界）",
              "y[n]=x[n]²：非线性，但时不变、因果、无记忆且 BIBO 稳定",
              "LTI 判据：因果 ⟺ n<0 时 h[n]=0；BIBO 稳定 ⟺ Σ|h[n]|<∞"
            ],
            pitfalls: [
              "由“线性”推出“稳定”，或由“因果”推出“无记忆”：这四条性质彼此独立，必须逐条验证",
              "检查 BIBO 稳定时只在有限范围内取 n：y[n]=n·x[n] 要看出无界，必须让 n 遍历无界整数集"
            ],
            links: [
              { to: "signals-ch3-desc", why: "性质检验的对象就是上一节描述的方程与冲激响应" },
              { to: "signals-ch3-complex", why: "复频域把稳定性判据化成极点位置，便于快速判断" }
            ],
            formula: "\\text{BIBO 稳定}\\iff\\sum_{n=-\\infty}^{\\infty}|h[n]|<\\infty",
            variables: [
              "h[n]：单位样值响应",
              "因果（LTI）：n<0 时 h[n]=0",
              "可逆：存在 h_inv 使 h*h_inv=δ[n]",
              "两个反例：y=n·x（非稳定）、y=x²（非线性但稳定）"
            ]
          },
          {
            id: "signals-ch3-time",
            group: "第二节 信号的线性系统处理",
            title: "时域法分析",
            importance: "core",
            sourceStatus: "verified_local",
            content: "性质确定之后就要算响应。时域法有两条等价的路：解差分/微分方程（可分离出初始条件的影响），或用卷积（只给零状态响应）。把两者合起来，才得到完整的输出——这是本节最重要的区分：零输入响应、零状态响应、全响应。",
            detail: [
              "零输入响应由初始状态单独产生（令输入为零），零状态响应由输入单独产生（令初始状态为零），全响应是两者之和。对因果 LTI 系统，零状态响应等于输入与冲激响应的卷积；零输入响应则取决于方程的特征根与初值。固定样例 y[n]=x[n]+0.5y[n−1]（特征根 0.5）：初始静止时输入单位阶跃，输出为 y[n]=2(1−0.5^(n+1))，即从 1 单调升到稳态 2；h[n]=0.5^n u[n]。",
              "只要初值非零，输出就多出一项。取 y[−1]=1、输入仍为单位阶跃，则零输入分量为 0.5^(n+1)（n≥0），与零状态分量 2(1−0.5^(n+1)) 叠加得全响应 2−0.5^(n+1)。这组数字说明：同一系统同一输入，初值不同结果就不同，而差值正是零输入分量。时域法的优点是能看清每个分量的来源；缺点是卷积要按区间分段，计算量大。"
            ],
            points: [
              "全响应 = 零输入响应 + 零状态响应，两者必须分开算再相加",
              "零状态响应 = x*h；零输入响应由特征根与初值决定",
              "样例 y[n]=x[n]+0.5y[n−1]：h[n]=0.5^n u[n]，阶跃响应 2(1−0.5^(n+1))→2",
              "y[−1]=1 时零输入分量为 0.5^(n+1)，全响应为 2−0.5^(n+1)"
            ],
            pitfalls: [
              "把卷积结果直接当全响应：卷积只给零状态部分，初值非零时必须再加零输入分量",
              "把递推得到的数值序列当成解析解：递推只能给有限项，结论仍需解析式或与卷积互相印证"
            ],
            links: [
              { to: "signals-ch3-properties", why: "因果与稳定判据决定了卷积是否收敛、能否递推" },
              { to: "signals-ch3-frequency", why: "同一响应用频域法计算往往更快，下一节给出对照" }
            ],
            formula: "y[n]=\\underbrace{\\sum_{k}h[k]x[n-k]}_{\\text{零状态}}+\\underbrace{y_{zi}[n]}_{\\text{零输入}}",
            variables: [
              "h[n]=0.5^n u[n]：样例系统的单位样值响应",
              "阶跃响应：2(1−0.5^(n+1))，稳态值 2",
              "y_zi[n]：零输入响应；y[−1]=1 时为 0.5^(n+1)",
              "全响应 = 零状态 + 零输入"
            ]
          },
          {
            id: "signals-ch3-frequency",
            group: "第二节 信号的线性系统处理",
            title: "频域法分析",
            importance: "core",
            sourceStatus: "verified_local",
            content: "时域卷积难算，频域把它变成乘法。对 LTI 系统，输入复指数 e^{jωn} 时输出仍是同频复指数，只乘一个与时间无关的系数 H(e^{jω})——这就是频率响应。它决定各频率分量被放大、衰减还是移相，也解释了为什么滤波器可以“按频率挑选信号”。",
            detail: [
              "正弦稳态是频率响应最直观的用法：输入 A cos(ω₀n+φ) 时，稳态输出为 A|H(e^{jω₀})|cos(ω₀n+φ+∠H(e^{jω₀}))——幅度乘幅频特性、相位加相频特性。注意这里说的是稳态：瞬态分量由系统极点决定，会随时间衰减（极点须在单位圆内），与输入无关。",
              "频域法有一条前提常被忽略：Y=HX 只在零状态下无条件成立。含初始条件时，变换后的方程里多出与初始状态有关的项，输出是“零状态响应 + 零输入响应的变换”，不能简单写成乘积。此外，无失真传输要求 |H| 为常数、相位为 −ωn₀ 的线性相位，这是滤波器设计要逼近的目标，也是第4章处理相位问题的起点。"
            ],
            points: [
              "复指数是 LTI 系统的特征函数：输入 e^{jωn} 时输出为 H(e^{jω})e^{jωn}",
              "正弦稳态：幅度乘 |H|、相位加 ∠H，瞬态由极点决定并随时间衰减",
              "Y=HX 只在零状态下无条件成立",
              "无失真传输要求幅频为常数、相频为线性（−ωn₀）"
            ],
            pitfalls: [
              "把稳态结论套到含初始条件的问题上：此时输出里还有零输入分量，不能用 H 直接相乘",
              "以为幅频为常数就无失真：相位非线性同样会造成波形失真"
            ],
            links: [
              { to: "signals-ch3-time", why: "与时域法互为对照：卷积在频域就是相乘" },
              { to: "signals-ch4-specs", why: "第4章把幅频、相频要求翻译成滤波器指标" }
            ],
            formula: "Y(e^{j\\omega})=H(e^{j\\omega})X(e^{j\\omega})\\quad(\\text{零状态})",
            variables: [
              "H(e^{jω})：频率响应，含幅频 |H| 与相频 ∠H",
              "正弦稳态输出：A|H|cos(ω₀n+φ+∠H)",
              "无失真条件：|H| 为常数且 ∠H=−ωn₀",
              "零状态前提：含初值时需另加零输入分量"
            ]
          },
          {
            id: "signals-ch3-complex",
            group: "第二节 信号的线性系统处理",
            title: "复频域分析",
            importance: "core",
            sourceStatus: "verified_local",
            content: "频域法只处理零状态，复频域法把初始条件一并纳入：对微分/差分方程做拉普拉斯或 Z 变换，微分与差分变成代数运算，初值自动进入方程，解出 Y 后一次反变换即可。代价是必须同时跟踪收敛域，收益是极零点结构直接给出因果性与稳定性。",
            detail: [
              "对差分方程两边取单边 Z 变换，移位项会带出初始条件：Z{y[n−1]}=z^{−1}Y(z)+y[−1]。于是 Y(z)=H(z)X(z)+（初值项），乘积只对应零状态部分。解出 Y(z) 后按收敛域做部分分式反变换，就同时得到零状态与零输入两个分量——与第二节时域法的分解完全对应。",
              "极零点给出判据：因果系统要求 ROC 在最外极点之外；BIBO 稳定要求 ROC 含单位圆（连续情形为含虚轴）；两者合并，因果且稳定 ⟺ 全部极点落在单位圆内（连续：左半平面）。零点位置则影响逆系统的可实现性——下一节会用 H(z)=1−2z^{−1} 说明零点在圆外时逆向不可稳定实现的后果。"
            ],
            points: [
              "单边变换把初始条件带进方程：Z{y[n−1]}=z^{−1}Y(z)+y[−1]",
              "Y(z)=H(z)X(z)+初值项：乘积只对应零状态响应",
              "因果 ⟺ ROC 在最外极点之外；稳定 ⟺ ROC 含单位圆",
              "因果且稳定 ⟺ 极点全在单位圆内（连续系统为左半平面）"
            ],
            pitfalls: [
              "解出 Y(z) 就反变换而不看收敛域：同一代数式会对应不同的时间序列",
              "把极点判据用到非因果系统上：“极点都在单位圆内”只在因果前提下等价于稳定"
            ],
            links: [
              { to: "signals-ch3-frequency", why: "把 z 取在单位圆上即回到频率响应" },
              { to: "signals-ch2-z-relations", why: "收敛域与极点判据在第2章已经建立，这里是系统层面的应用" }
            ],
            formula: "Z\\{y[n-1]\\}=z^{-1}Y(z)+y[-1]",
            variables: [
              "Y(z)、X(z)：输出与输入的 Z 变换（单边）",
              "y[−1]：初始条件，进入变换式",
              "H(z)=Y(z)/X(z)：零状态系统函数",
              "因果稳定：极点全在单位圆内，ROC 含单位圆"
            ]
          },
          {
            id: "signals-ch3-identification",
            group: "第三节 解卷积（逆滤波与系统辨识）",
            title: "系统辨识问题",
            importance: "core",
            sourceStatus: "verified_local",
            content: "前面都是“已知系统求输出”，这一节反过来：已知输入和测得的输出，估计系统。写成式子就是 H=Y/X。看起来只是除法，但实际能不能做、做得准不准，取决于激励是否足够丰富、测量里有多少噪声、以及 H 在哪些频率上接近零。",
            detail: [
              "首先是激励条件。若输入只含少数几个频率（例如一个正弦），输出里也只有那些频率的信息，H 在其余频率上完全未知——这叫激励不足。要辨识一个系统，输入必须在关心的频段内都有能量（持续激励），常用白噪声或扫频信号。工程上把这类“输入能否激发全部模态”的要求写在实验设计里，而不是事后补救。",
              "其次是噪声与病态。以 Y/X 估计 H 时，分母在 X 小的频点上会把噪声放大：哪怕测量噪声很小，在 X→0 处估计值也会发散。常用对策是改在相关域做估计（H≈S_xy/S_xx，噪声与输入不相关时偏差更小），或在分母上加正则项抑制小信噪比频点。辨识的目标是“在关心的频段内给出可用的模型”，不是逐点复现测量。"
            ],
            points: [
              "系统辨识 = 由已知输入与测得输出估计 H，基本关系 H=Y/X（零状态）",
              "输入必须在关心频段内持续激励，否则部分频段的 H 无法观测",
              "小分母放大噪声：X 接近零的频点估计会发散",
              "改用相关域估计（S_xy/S_xx）或加正则项，可显著改善小信噪比频点"
            ],
            pitfalls: [
              "用单频正弦激励去辨识宽带系统：未被激励的频段没有任何信息，估出来的是猜测",
              "把逐点相除的结果直接当模型：噪声与小分母会让频响出现尖峰毛刺，必须做平滑或正则化"
            ],
            links: [
              { to: "signals-ch3-inverse", why: "辨识的反问题是逆滤波，两者共用同一组条件" },
              { to: "signals-ch3-matlab-identification", why: "第五节的 MATLAB 小节给出可执行的辨识流程" }
            ],
            formula: "H(z)=\\frac{Y(z)}{X(z)}\\quad(\\text{零状态}),\\qquad \\hat H\\approx\\frac{S_{xy}}{S_{xx}}",
            variables: [
              "S_xx：输入自功率谱；S_xy：输入输出互功率谱",
              "持续激励：输入在关心频段内均有能量",
              "正则项：抑制小分母放大噪声",
              "建模目标是关心频段内可用，不追求逐点复现"
            ]
          },
          {
            id: "signals-ch3-inverse",
            group: "第三节 解卷积（逆滤波与系统辨识）",
            title: "逆滤波问题",
            importance: "core",
            sourceStatus: "verified_local",
            content: "逆滤波是辨识的镜像：已知系统与输出，要恢复输入，形式上 X=Y/H。分母变成 H 之后，H 的零点成为逆系统的极点——它们落在哪里，决定逆系统能不能因果稳定地实现。这一节用一个小例子说明：原系统稳定不等于逆系统可用。",
            detail: [
              "取 H(z)=1−2z^{−1}。它是有限长冲激响应（h[0]=1、h[1]=−2、其余为零），显然 BIBO 稳定。它的因果逆是 H_inv(z)=1/(1−2z^{−1})，极点在 z=2——单位圆外，因此这个因果逆不稳定；输入为单位阶跃时递推 y[n]=x[n]+2y[n−1] 按 2^(n+1) 增长（n=39 时约 1.1×10¹²）；输入为冲激时 h[n]=2^n，n=39 时约 5.5×10¹¹。两种输入都说明因果逆不满足 BIBO 稳定。也就是说，虽然 H(z) 处处非零、逐点相除在代数上可行，但恢复出的输入会被噪声以同样速率放大，实际不可用。",
              "可用的逆系统要满足两条：ROC 含单位圆（不放大噪声的可实现性）且逆系统本身稳定。若 H 的零点是“最小相位”的（全在单位圆内），因果稳定逆容易构造；零点在圆外时，只能取非因果逆、或先把系统分解成最小相位部分加全通部分再分别处理。工程上更常见的做法不是严格求逆，而是在目标上加约束做正则化反卷积——牺牲一点分辨率换取噪声不爆炸。"
            ],
            points: [
              "逆滤波 X=Y/H：H 的零点成为逆系统的极点，位置决定可实现性",
              "H(z)=1−2z^{−1} 本身 FIR 稳定，但因果逆 1/(1−2z^{−1}) 因极点在 z=2 而不稳定",
              "“H 处处非零”只保证代数上可除，不保证逆系统可稳定实现",
              "零点在单位圆内（最小相位）时因果稳定逆易得；否则需非因果逆、最小相位分解或正则化"
            ],
            pitfalls: [
              "以“H 不为零就能除”判断逆滤波可行：还要看零点位置与噪声放大",
              "忽略正则化的必要：严格求逆会把测量噪声按 1/|H| 放大，结果常常比原输出更不可用"
            ],
            links: [
              { to: "signals-ch3-identification", why: "辨识与逆滤波是同一组条件的两面" },
              { to: "signals-ch3-finite-word", why: "逆滤波放大的噪声与有限字长的舍入误差会叠加" }
            ],
            formula: "H_{inv}(z)=\\frac{1}{H(z)}=\\frac{1}{1-2z^{-1}},\\qquad \\text{极点 }z=2",
            variables: [
              "H(z)=1−2z^{−1}：FIR 系统，零点 z=2、全零点系统",
              "因果逆的极点 z=2：在单位圆外 ⇒ 不稳定",
              "最小相位：零点全在单位圆内，因果稳定逆可实现",
              "正则化反卷积：用可控的偏差换取噪声不放大"
            ]
          },
          {
            id: "signals-ch3-homomorphic",
            group: "第三节 解卷积（逆滤波与系统辨识）",
            title: "同态系统解卷积",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "前两节的解卷积都在线性框架里做，遇到“卷积混合”信号（如声道与激励的卷积）时，直接求逆往往既不稳定也不稳健。同态处理换一个思路：用非线性变换把卷积变成相加，在变换域做线性滤波，再变回来。本小节只讲思路与边界，不展开算法细节。",
            detail: [
              "关键在于找到一个把卷积化为加法的域。Z 变换先把卷积变成相乘：Z{x*h}=X(z)H(z)；再取复对数，相乘变成相加：log X+log H。于是“解卷积”退化为“在复倒谱域做线性滤波”。这条链成立的前提是变换与对数在相应收敛域内都有定义，而相位卷绕正是实际实现中最麻烦的一环。",
              "边界要写清楚：同态解卷积不是万能的。它要求两个分量在倒谱域可分（例如一个集中在低倒谱、另一个周期性出现），噪声与模型误差同样会让结果退化；此外它并不保证唯一性——不同的相位约定会给出不同结果。因此本小节列为选择学习，主线只要求说明问题定义、处理思路与失效条件，能说清什么时候该用逆滤波、什么时候该用同态方法即可。"
            ],
            points: [
              "同态处理的核心：找一个域，把卷积变成相加",
              "链条：Z 变换（卷积→相乘）→ 复对数（相乘→相加）→ 线性滤波 → 反变换",
              "前提是两分量在倒谱域可分；相位卷绕是实现难点",
              "它不保证唯一，也不能修复噪声与模型误差——主线只要求讲清定义与失效条件"
            ],
            pitfalls: [
              "把同态解卷积当成比逆滤波“更强的万能方法”：它只是换了可分离性的假设",
              "忽略相位卷绕：直接对主值取对数会带来 2π 跳变，反变换后结果错位"
            ],
            links: [
              { to: "signals-ch3-inverse", why: "同态方法是逆滤波在病态场合的替代路线" },
              { to: "signals-ch3-matlab-identification", why: "MATLAB 小节只保留可复算的部分，不铺开算法" }
            ]
          },
          {
            id: "signals-ch3-dsp-features",
            group: "第四节 数字信号处理技术",
            title: "数字信号处理的特点",
            importance: "core",
            sourceStatus: "verified_local",
            content: "前面三节都是原理，这一节转向实现。数字信号处理把连续信号变成序列后，用程序或硬件完成运算，优点是精度可控、可重复、便于存储与算法升级；代价是引入采样与量化两道不可逆关口，而且必须在有限字长下工作。",
            detail: [
              "先看优势：数字系统可以做线性相位、可以做任意精度的系数、可以把同一段算法复用到不同采样率；滤波器的“指标”由程序决定，不需要换元件，改一个系数就等于换一个滤波器。批量生产时一致性好，调试可以离线复现——这些都是模拟电路难以做到的。",
              "再看代价。采样引入混叠（第2章已给出判据），量化把连续取值变成有限个电平，两者都在信号进入算法之前发生且不可逆；算法本身还要在有限字长下完成加乘与存储，于是出现系数量化误差、运算舍入误差，以及加法溢出。数字处理的正确姿势是：先把采样率与字长选够，再谈算法优化——顺序颠倒会白做工。"
            ],
            points: [
              "数字处理的优势：精度与参数可控、可复用、可离线复现、便于算法升级",
              "两道不可逆关口在算法之前：采样（混叠）与量化（量化噪声）",
              "算法在有限字长下运行，引入系数量化、舍入与溢出",
              "正确顺序是先定采样率与字长，再优化算法"
            ],
            pitfalls: [
              "把数字处理当成“精度无限”：字长与采样率是硬约束，选小了后面无法补救",
              "只在算法层面优化而忽略前端：混叠一旦发生，任何数字算法都无法恢复"
            ],
            links: [
              { to: "signals-ch2-sampling-time", why: "采样这一步的判据在第2章已经给出" },
              { to: "signals-ch3-finite-word", why: "下一节专门量化有限字长带来的误差" }
            ]
          },
          {
            id: "signals-ch3-dsp-impl",
            group: "第四节 数字信号处理技术",
            title: "数字信号处理的实现",
            importance: "core",
            sourceStatus: "verified_local",
            content: "实现链路可以画成一条固定的线：模拟前端 → 抗混叠滤波 → 采样保持 → 量化编码 → 数字运算 → 输出（DAC 与重建滤波）。链路上每一环都可能成为瓶颈，而运算环节的实现形态主要有三种：通用处理器、专用 DSP、可编程逻辑。",
            detail: [
              "三种形态各有取舍。通用处理器（PC/手机 CPU）灵活、开发快，适合中等实时性与复杂算法；专用 DSP 有单周期乘加与地址生成单元，适合固定算法的实时滤波；FPGA 可以做成全并行流水线，时延确定、吞吐最高，代价是开发周期与功耗。选型看的是“实时性要求 × 算法复杂度 × 产量”，不是越专用越好。",
              "实现时还要记住两件事。其一，量化与编码在链路里是独立一环：ADC 的位数决定量化步长 Δ，直接决定下一节要算的量化误差界。其二，数字运算的中间结果需要比输入更宽的字长（乘加会增长位宽），否则会在累加处溢出；定点实现里通常要预留保护位并设计饱和策略，而不是让结果回绕。"
            ],
            points: [
              "链路：模拟前端 → 抗混叠滤波 → 采样保持 → 量化编码 → 数字运算 → DAC 与重建滤波",
              "实现形态三种：通用处理器（灵活）、DSP（实时滤波）、FPGA（并行、时延确定）",
              "选型依据是实时性 × 复杂度 × 产量",
              "乘加会增长位宽，定点实现要预留保护位并设计饱和策略"
            ],
            pitfalls: [
              "把重建滤波当成可选：DAC 的零阶保持会在频谱上留下 sinc 包络与镜像，必须滤除",
              "定点累加不留保护位：溢出导致的回绕会让结果符号翻转，比噪声严重得多"
            ],
            links: [
              { to: "signals-ch3-dsp-features", why: "上一节说明为什么必须在有限字长下实现" },
              { to: "digital-08", why: "转换器与编码的电路实现见数电第 8 章" }
            ]
          },
          {
            id: "signals-ch3-finite-word",
            group: "第四节 数字信号处理技术",
            title: "有限字长的影响",
            importance: "core",
            sourceStatus: "verified_local",
            content: "有限字长带来三类误差：系数量化（滤波器系数不能精确表示，极点位置偏移）、运算舍入（每次乘加都舍入，噪声在递归结构里累积）、以及溢出（结果超出表示范围）。这一节给出量化误差的定量界，并强调它的成立条件。",
            detail: [
              "舍入量化模型：把步长 Δ 的均匀量化写成 Q(x)=Δ·round(x/Δ)。只要不发生溢出，误差满足 |Q(x)−x|≤Δ/2——这是确定性的界，对每个样本都成立，不需要任何统计假设。位数每增加 1 位，Δ 减半，误差上界也随之减半（约 6 dB）。",
              "常被引用为“量化噪声功率 Δ²/12”的结论则需要额外前提：误差在 [−Δ/2,Δ/2] 上均匀分布、与信号不相关、各样本互不相关，且不溢出。只有这些条件大致满足时，才能把它当作白噪声来估算信噪比；对正弦等规则信号、或误差与信号强相关时，量化误差是确定性的失真（谐波），用 Δ²/12 会给出错误的乐观估计。系数量化则要单独看：它直接移动极点，窄带或高阶滤波器的极点可能被推到单位圆外，因此实现前应检查量化后的极点半径。"
            ],
            points: [
              "舍入量化 Q(x)=Δ·round(x/Δ)：无溢出时 |Q(x)−x|≤Δ/2（确定性界，不含统计假设）",
              "位数每加 1 位，Δ 与误差上界各减半（约 6 dB）",
              "Δ²/12 只在误差均匀分布、与信号及样本互不相关且不溢出的假设下才是噪声功率",
              "系数量化直接移动极点：高阶/窄带滤波器要复核量化后极点是否仍在单位圆内"
            ],
            pitfalls: [
              "把 Δ²/12 当成无条件的噪声定律：规则信号下误差是确定性谐波失真，估计会过于乐观",
              "只算运算舍入而忽略系数量化：后者改变极点位置，可能直接把稳定系统变成不稳定"
            ],
            links: [
              { to: "signals-ch3-complex", why: "极点位置的判据来自复频域分析，这里用它检查量化后的系统" },
              { to: "signals-ch4-iir", why: "IIR 滤波器对系数量化最敏感，第4章会再次遇到这个问题" }
            ],
            formula: "Q(x)=\\Delta\\,\\mathrm{round}\\!\\left(\\frac{x}{\\Delta}\\right),\\qquad |Q(x)-x|\\le\\frac{\\Delta}{2}",
            variables: [
              "Δ：量化步长（满量程/2^位数）",
              "界 |Q(x)−x|≤Δ/2：无溢出时对每个样本成立",
              "Δ²/12：误差均匀、不相关、不溢出时的噪声功率估计",
              "系数量化：使极点偏移，需复核极点半径"
            ]
          },
          {
            id: "signals-ch3-matlab-time",
            group: "第五节 应用MATLAB的信号处理",
            title: "利用MATLAB的时域分析",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "第五节把前四节的结论交给工具复算，每个小节给出“命令要点 + 一个可验证的数值结论 + 与解析式的对照”。时域这一节围绕同一个样例系统 y[n]=x[n]+0.5y[n−1] 展开，用三条路径互相印证：递推、卷积、解析式。",
            detail: [
              "命令要点：filter(b,a,x) 按差分方程递推，b=[1]、a=[1 -0.5] 对应 y[n]=x[n]+0.5y[n−1]；conv(x,h) 给卷积；impz(b,a,N) 直接给单位样值响应；stepz(b,a,N) 给阶跃响应。三者应给出同一组数。注意 filter 的初始条件通过 zi 传入，它是延迟单元的内部状态，不直接等同于 y[−1] 这类方程初值——零状态递推时用 filtic(b,a,Y0,X0) 把方程初值换算成 zi 再传入。",
              "验证点：令 x 为单位阶跃的前 20 点，filter 递推得到 1、1.5、1.75、…；conv(ones(1,20),0.5.^(0:19)) 的前若干点与之相同；解析式 2(1−0.5.^(n+1)) 在同样点上一致（容差 1e-12）。三者在 n=19 处都已非常接近稳态 2。对照结束时要说明：这里输入是无限阶跃的前 20 点，若把输入改成只有前 20 点非零的矩形，则停输入后输出会按 0.5^n 衰减到 0，不会停在 2。"
            ],
            points: [
              "filter(b,a,x) 递推、conv(x,h) 卷积、impz/stepz 直接给响应，三条路径应一致",
              "filter 的 zi 是延迟单元内部状态，不是方程初值；用 filtic 换算",
              "验证点：阶跃前 20 点 → 1、1.5、1.75、…，与 2(1−0.5^(n+1)) 一致（容差 1e-12）",
              "输入若是 20 点矩形，停输入后输出按 0.5^n 衰减，不会停在 2"
            ],
            pitfalls: [
              "把 zi 当成 y[−1] 直接传入：两者量纲与含义都不同，须经 filtic 换算",
              "把“阶跃的前 20 点”当成“20 点矩形”：前者输入仍在继续，后者停输入后输出会衰减"
            ],
            links: [
              { to: "signals-ch3-time", why: "本节的验证点就是那一节的样例系统" },
              { to: "signals-ch3-matlab-frequency", why: "下一节换到频域核对同一个系统" }
            ]
          },
          {
            id: "signals-ch3-matlab-frequency",
            group: "第五节 应用MATLAB的信号处理",
            title: "利用MATLAB的频域分析",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "频域这一节核对两件事：频率响应怎么读，以及它与时域响应是否自洽。仍然用同一个样例系统，这样每一步都能和上一节的结果对上。",
            detail: [
              "命令要点：freqz(b,a,w) 在指定频点 w 上求频率响应，工程上常显式给端点 freqz(b,a,[0 pi])；fft 用于有限长序列的频谱估计，读图前必须自己构造频率轴（见第2章第五节）。要观察稳态正弦响应，可先用 filter 运行足够长的时间取后段，再与 |H| 和 ∠H 的预测比较。",
              "验证点：对 H(z)=1/(1−0.5z^{−1})，freqz 在 ω=0 给出 2、在 ω=π 给出 1/1.5≈0.6667，与把 z=1、z=−1 代入 H(z) 完全一致；这与时域稳态值 2 也对应（直流增益 = 阶跃响应的稳态值）。反过来说，如果时域稳态值不等于 H(1)，说明要么递推还没到稳态，要么零输入分量仍在——这是最省事的自检。"
            ],
            points: [
              "freqz(b,a,[0 pi]) 显式取端点，读数可与 z=1、z=−1 代入 H(z) 对照",
              "样例题：H(1)=2、H(−1)=1/1.5≈0.6667",
              "直流增益 = 阶跃响应稳态值：时域与频域结果必须自洽",
              "对有限长数据做频谱估计时要自己构造频率轴，并只看前一半",
              "稳态正弦响应 = 幅度乘 |H|、相位加 ∠H（瞬态衰减后才成立）"
            ],
            pitfalls: [
              "把 fft 的下标当频率读：必须先构造 f=(0:N-1)*(fs/N) 并只看前一半",
              "用还没到稳态的递推结果与 |H| 比较：瞬态分量会让两者对不上"
            ],
            links: [
              { to: "signals-ch3-frequency", why: "本节的对照就是那一节的频率响应结论" },
              { to: "signals-ch2-matlab-spectrum", why: "读频谱的规则在第2章第五节已经固定，这里只做系统层面的核对" }
            ]
          },
          {
            id: "signals-ch3-matlab-complex",
            group: "第五节 应用MATLAB的信号处理",
            title: "利用MATLAB的复频域分析",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "复频域这一节核对极点与稳定性：把系统函数写成有理式，画出零极点，检查极点是否都在单位圆内，并用部分分式把响应拆成振型之和。这是把“极点位置决定稳定性”从口诀变成可读数的最后一步。",
            detail: [
              "命令要点：zplane(b,a) 画零极点与单位圆；tf2zp 求零点极点增益；residuez(b,a) 做部分分式展开，返回留数、极点与直接项；filter 与 impz 给出响应用于对照。连续系统对应 tf2zp/roots 与 residue，并把“单位圆内”换成“左半平面”。",
              "验证点：样例 H(z)=1/(1−0.5z^{−1}) 的极点是 z=0.5（单位圆内 ⇒ 因果且稳定），residuez 给出留数 1、极点 0.5，对应 h[n]=0.5^n；而 H(z)=1/(1−2z^{−1}) 的极点是 z=2（圆外），其因果递推在不加输入时也会由初值按 2^n 增长——这正是上一节逆滤波反例在复频域的样子。两例对照，把“极点位置—响应形态—稳定性”三者一次串起来。"
            ],
            points: [
              "zplane 画零极点与单位圆；tf2zp 求零极点增益；residuez 做部分分式",
              "样例 H=1/(1−0.5z^{−1})：极点 0.5 在圆内 ⇒ 因果稳定，h[n]=0.5^n",
              "反例 H=1/(1−2z^{−1})：极点 2 在圆外 ⇒ 因果递推按 2^n（冲激）或 2^(n+1)（阶跃）增长",
              "连续系统把“单位圆内”换成“左半平面”，函数换成 residue/roots"
            ],
            pitfalls: [
              "只画零极点不看 ROC：判稳的前提是因果，非因果系统要用 ROC 判断",
              "把 residuez 的输出顺序记错：返回的是留数、极点、直接项三个向量，逐项对应"
            ],
            links: [
              { to: "signals-ch3-complex", why: "本节的读数规则来自那一节的极零点判据" },
              { to: "signals-ch3-inverse", why: "极点 2 的反例正是逆滤波不稳定的复频域表述" }
            ]
          },
          {
            id: "signals-ch3-matlab-identification",
            group: "第五节 应用MATLAB的信号处理",
            title: "利用MATLAB的系统辨识",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "最后一节把辨识与逆滤波做成可执行的流程：先产生持续激励的输入、用已知系统生成输出、再由数据估回模型，并检查估计误差；然后做一次逆滤波，观察噪声在小分母频点被放大、以及正则化如何改善。",
            detail: [
              "命令要点：用 randn 产生白噪声作为持续激励；用 filter 由已知 b、a 生成输出；估计可走频域（S_xy./S_xx，配合 cpsd 与 pwelch 或直接 fft 相除后平滑）或时域最小二乘。系统辨识工具箱提供 tfest/n4sid 等函数，但纯基础函数即可完成教学规模的辨识。逆滤波一侧，直接相除与加正则项（分母加一个小的 ε）两种做法要并排比较。",
              "验证点：已知 H(z)=1−2z^{−1} 时，用白噪声辨识能在全频段复现 |H|；但把同一 H 用于逆滤波去恢复输入，噪声在 |H| 小的频点被放大，恢复信号的信噪比显著低于原输出。加入正则项后误差不再爆炸，代价是高频段出现系统性偏差。结论要落到文字上：逆滤波的可用性由 H 的零点位置与信噪比共同决定，不是“能除就能恢复”。"
            ],
            points: [
              "辨识流程：持续激励输入 → 由已知系统生成输出 → 由数据估回模型 → 检查误差",
              "频域估计用 S_xy/S_xx，时域可用最小二乘；工具箱的函数只是封装",
              "逆滤波对照实验：直接相除 vs 加正则项，看噪声放大与偏差的取舍",
              "结论：逆滤波可行性取决于 H 的零点位置与信噪比，不是“能除就能恢复”"
            ],
            pitfalls: [
              "用单频或直流输入做辨识：未被激励的频段估不出来，得到的模型只在个别频点可信",
              "只看时域波形判断逆滤波效果：噪声放大在波形上不明显，要看频域的信噪比与误差谱"
            ],
            links: [
              { to: "signals-ch3-identification", why: "本节的流程实现那一节的条件" },
              { to: "signals-ch3-inverse", why: "逆滤波的正则化对照来自那一节的结论" }
            ]
          }
        ],
        examples: [
          {
            title: "由差分方程写出系统函数",
            prompt: "系统满足 y[n]=x[n]−0.5y[n−1]+0.25y[n−2]。写出 H(z)，并说明需要几个初始条件。",
            steps: [
              "两边取零状态 Z 变换：Y(z)=X(z)−0.5z^{−1}Y(z)+0.25z^{−2}Y(z)。",
              "移项得 Y(z)(1+0.5z^{−1}−0.25z^{−2})=X(z)，故 H(z)=1/(1+0.5z^{−1}−0.25z^{−2})。",
              "方程阶数为 2，因此定解需要 y[−1] 与 y[−2] 两个初始条件。"
            ],
            answer: "H(z)=1/(1+0.5z^{−1}−0.25z^{−2})（零状态）；需要 2 个初始条件。"
          },
          {
            title: "逐项检验两个系统",
            prompt: "判断 y[n]=n·x[n] 与 y[n]=(x[n])² 的线性、时不变、因果、无记忆与 BIBO 稳定性。",
            steps: [
              "y=n·x：满足齐次与可加，故线性；系数含 n，故时变；输出只依赖当前输入，故无记忆且因果。",
              "取有界输入 x[n]≡1，输出 y[n]=n 在 n 遍历全部整数时无界，故非 BIBO 稳定。",
              "y=x²：T{2x}=4y≠2T{x}，故非线性；时不变、因果、无记忆。",
              "|x|≤1 时 |y|≤1，任一界 M 的输入给出界 M²，故 BIBO 稳定。"
            ],
            answer: "y=n·x：线性、时变、无记忆、因果、非稳定；y=x²：非线性、时不变、因果、无记忆、稳定。"
          },
          {
            title: "一阶离散系统的全响应",
            prompt: "y[n]=x[n]+0.5y[n−1]，输入为单位阶跃，初值 y[−1]=1。求零状态、零输入与全响应。",
            steps: [
              "冲激响应 h[n]=0.5^n u[n]，零状态响应 = u*h = 2(1−0.5^(n+1))。",
              "零输入响应由 y[−1]=1 递推：y_zi[n]=0.5^(n+1)（n≥0）。",
              "全响应 = 2(1−0.5^(n+1))+0.5^(n+1) = 2−0.5^(n+1)。"
            ],
            answer: "零状态 2(1−0.5^(n+1))，零输入 0.5^(n+1)，全响应 2−0.5^(n+1)（n≥0）。"
          },
          {
            title: "由频率响应读稳态输出",
            prompt: "系统 H(z)=1/(1−0.5z^{−1})，输入 x[n]=cos(0.5πn)。求稳态输出。",
            steps: [
              "代入 z^{−1}=e^{−j0.5π}=−j：H=1/(1+0.5j)=0.8−0.4j。",
              "幅值 |H|=1/√(1+0.25)=0.894，相位 ∠H=−arctan(0.5)=−0.4636 rad。",
              "稳态输出为 0.894cos(0.5πn−0.4636)。"
            ],
            answer: "0.894cos(0.5πn−0.4636)（幅度乘 |H|、相位加 ∠H；瞬态分量已衰减）。用递推拟合可核对：A=0.8944、φ=−0.4636。"
          },
          {
            title: "复频域解含初值的差分方程",
            prompt: "y[n]=x[n]+0.5y[n−1]，x[n]=u[n]，y[−1]=1。用单边 Z 变换求 Y(z)。",
            steps: [
              "取单边变换：Y(z)=X(z)+0.5(z^{−1}Y(z)+y[−1])。",
              "代入 X(z)=1/(1−z^{−1})、y[−1]=1，得 Y(z)(1−0.5z^{−1})=1/(1−z^{−1})+0.5。",
              "整理得 Y(z)=[1/(1−z^{−1})+0.5]/(1−0.5z^{−1})；极点 z=1（输入）与 z=0.5（系统）。"
            ],
            answer: "Y(z)=[1/(1−z^{−1})+0.5]/(1−0.5z^{−1})，极点 1 与 0.5；0.5 在单位圆内故瞬态衰减，稳态由 z=1 的极点给出。"
          },
          {
            title: "辨识的激励条件",
            prompt: "用 x[n]=cos(0.1πn) 去辨识一个未知系统。能辨识出什么？缺什么？",
            steps: [
              "单一正弦只在 ω=±0.1π 有能量。",
              "输出只在这两个频点携带系统信息，H 在其余频点完全未知。",
              "需要改用宽带激励（白噪声、扫频或多频叠加），使关心频段内都有能量。"
            ],
            answer: "只能得到 ω=0.1π 附近的 H 值；其余频段不可辨识，必须换成持续激励输入。"
          },
          {
            title: "判断逆系统能否稳定实现",
            prompt: "H(z)=1−2z^{−1}。判断原系统与它的因果逆的稳定性。",
            steps: [
              "H 的冲激响应只有 h[0]=1、h[1]=−2，绝对和有限，故 BIBO 稳定。",
              "因果逆 H_inv=1/(1−2z^{−1}) 的极点在 z=2，位于单位圆外。",
              "因果系统极点不在单位圆内 ⇒ 不稳定；递推 y[n]=x[n]+2y[n−1] 在有界输入下按 2^n 发散（n=39 时约 1.1×10¹²）。"
            ],
            answer: "原系统稳定，因果逆不稳定；H 处处非零只说明代数上可除，不代表逆系统可实现。"
          },
          {
            title: "同态解卷积的适用性",
            prompt: "为什么同态解卷积不能替代一般的逆滤波？",
            steps: [
              "它把卷积变成相加的前提是复对数有定义且相位不卷绕。",
              "它要求两个分量在倒谱域可分，这一假设不总成立。",
              "结果还依赖相位约定，不保证唯一；噪声与模型误差同样会让它退化。"
            ],
            answer: "它换了假设（倒谱可分）而不是消除病态；实现要处理相位卷绕，且不保证唯一。"
          },
          {
            title: "数字处理的代价",
            prompt: "把模拟滤波器直接改成数字实现，哪些误差是新引入的？哪些是原来就有的？",
            steps: [
              "采样引入混叠，量化引入量化误差——这两项是数字实现新引入的，且发生在算法之前。",
              "运算舍入与系数量化是有限字长带来的，属于实现误差。",
              "元件容差与温漂是模拟电路原有的误差，数字实现换成系数精度问题后显著减小。"
            ],
            answer: "新增采样（混叠）与量化误差、运算舍入与系数量化；模拟侧的元件容差与漂移则被替换掉。"
          },
          {
            title: "定点实现要不要留保护位",
            prompt: "16 位定点的二阶 IIR，累加两个 16 位乘积会不会溢出？如何避免回绕？",
            steps: [
              "两个 16 位定点相乘得到约 32 位的结果，累加还会继续增长。",
              "若中间结果按 16 位截断，超出范围时回绕会导致符号翻转，比舍入噪声严重。",
              "做法是保留保护位（累加器加宽）并对输出饱和处理，而不是让高位自然丢弃。"
            ],
            answer: "会溢出；应加宽累加器（保护位）并使用饱和而非回绕。"
          },
          {
            title: "量化误差界的成立条件",
            prompt: "Δ=0.1 V，输入是幅度 5 V 的正弦。能否直接估计量化信噪比？误差上界是多少？",
            steps: [
              "无溢出时确定性界 |Q(x)−x|≤Δ/2=0.05 V，对每个样本都成立。",
              "Δ²/12 需要误差均匀分布、与信号不相关、样本间不相关等假设。",
              "对规则正弦，量化误差与信号强相关，表现为谐波失真，此时用 Δ²/12 估计信噪比会偏乐观。"
            ],
            answer: "确定性上界 0.05 V；Δ²/12 的噪声模型对规则正弦不成立，需实际计算谐波失真。"
          },
          {
            title: "三条路径核对同一响应",
            prompt: "y[n]=x[n]+0.5y[n−1]，x 为单位阶跃前 20 点。用 filter 与解析式各算 y[0]、y[3]，并说明如何再核对一次。",
            steps: [
              "解析式：y[0]=2(1−0.5)=1；y[3]=2(1−0.5⁴)=1.875。",
              "filter([1],[1 -0.5],ones(1,20)) 给出的前四项为 1、1.5、1.75、1.875，与解析式一致。",
              "再用 conv(ones(1,20),0.5.^(0:19)) 交叉核对，三者应在 1e-12 内一致。"
            ],
            answer: "y[0]=1、y[3]=1.875；用 conv 作第三条独立路径核对。"
          },
          {
            title: "直流增益与稳态值互相校验",
            prompt: "某系统阶跃响应的稳态值是 2.5，而 freqz 在 ω=0 读出 2.0。问题出在哪？",
            steps: [
              "对稳定系统，直流增益 H(1) 应等于阶跃响应的稳态值。",
              "两者不等，最可能是递推还没到稳态（瞬态未衰减完）。",
              "另一种可能是记录还没到稳态：稳态值 2.5 是渐近稳定系统的稳态，而稳定系统的零输入分量必然衰减到 0，不可能造成持久偏差；若两点读数确实不等，应检查 a、b 系数是否填错或两者不是同一系统。"
            ],
            answer: "先延长仿真时间确认是否到稳态；若仍不等，检查是否混入了零输入分量。"
          },
          {
            title: "极点位置与稳定性对照",
            prompt: "H(z)=1/(1−0.5z^{−1}) 与 H(z)=1/(1−2z^{−1}) 的因果实现，稳定性差别在哪？",
            steps: [
              "前者极点 0.5，在单位圆内，因果且稳定，h[n]=0.5^n。",
              "后者极点 2，在单位圆外，因果递推按 2^n 增长，不稳定。",
              "zplane 画出两者即可直接读出差别：判据是极点相对单位圆的位置。"
            ],
            answer: "极点 0.5 → 稳定；极点 2 → 不稳定。残差项都是 1，差别只在极点。"
          },
          {
            title: "辨识与逆滤波的对照实验",
            prompt: "已知 H(z)=1−2z^{−1}，用白噪声做实验。辨识和逆滤波各会得到什么结果？",
            steps: [
              "辨识：白噪声在全频段有能量，S_xy/S_xx 能复现 |H|（1−2z^{−1} 的幅频）。",
              "逆滤波：X=Y/H 在 |H| 小的频点把噪声放大，恢复信号信噪比明显下降。",
              "加正则项（分母加小 ε）后误差不再爆炸，代价是高频段出现系统性偏差。"
            ],
            answer: "辨识可行；逆滤波不可用（噪声放大）。这正是“能辨识 ≠ 能求逆”的具体对照。"
          }
        ],
        experiments: [
          {
            id: "signals-ch3-first-order-lti",
            title: "一阶 LTI 系统的递推与卷积核对",
            workbench: "notebook",
            goal: "用两种算法计算同一输出，验证冲激响应可以完整描述 LTI 系统。",
            steps: [
              "取输入为单位阶跃 u[n]，观察它的前 20 点。",
              "按 y[n]=x[n]+0.5y[n−1] 递推计算输出。",
              "再用 h[n]=(0.5)^n u[n] 与同一输入卷积，比较前 20 个样点。"
            ],
            expected: "两种输出在前 20 点内数值一致，并逐步趋近稳态值 2。注意这里输入是仍在继续的单位阶跃；若把输入改成只有前 20 点非零的矩形，则停止输入后输出会按 0.5^n 衰减到 0，不会停在 2。",
            limitation: "实验验证离散模型，不包含传感器噪声和有限字长硬件误差。"
          }
        ],
        check: [
          {
            id: "signals-ch3-check-1",
            prompt: "y[n]=n·x[n] 是否为 BIBO 稳定系统？",
            options: ["稳定，因为线性", "稳定，因为无记忆", "不稳定，取有界输入 x≡1 时 y[n]=n 无界", "无法判断"],
            answer: 2,
            explanation: "BIBO 稳定性与线性、无记忆无关。取 x[n]≡1（有界），y[n]=n 在 n 遍历全部整数时无界，故不稳定。"
          },
          {
            id: "signals-ch3-check-2",
            prompt: "y[n]=(x[n])² 的性质是？",
            options: ["线性且稳定", "非线性但时不变、因果且 BIBO 稳定", "线性但不稳定", "非线性且不稳定"],
            answer: 1,
            explanation: "T{2x}=4y≠2T{x}，故非线性；其余性质成立，且 |x|≤M 时 |y|≤M²，BIBO 稳定。"
          },
          {
            id: "signals-ch3-check-3",
            prompt: "因果离散 LTI 系统的冲激响应必须满足什么？",
            options: ["h[n]=0，n<0", "h[n]=0，n>0", "Σh[n]=0", "h[n] 必须周期"],
            answer: 0,
            explanation: "因果系统的当前输出不能依赖未来输入，因此 h[n] 在负时间为 0。"
          },
          {
            id: "signals-ch3-check-4",
            prompt: "全响应与两个分量的关系是？",
            options: ["全响应 = 零状态响应", "全响应 = 零输入响应 + 零状态响应", "全响应 = 冲激响应", "三者互不相干"],
            answer: 1,
            explanation: "零输入响应由初值产生、零状态响应由输入产生，两者叠加才是全响应；卷积只给后者。"
          },
          {
            id: "signals-ch3-check-5",
            prompt: "y[n]=x[n]+0.5y[n−1] 在初始静止、输入为单位阶跃时的稳态值是？",
            options: ["0.5", "1", "2", "发散"],
            answer: 2,
            explanation: "阶跃响应为 2(1−0.5^(n+1))，n→∞ 时趋于 2；这也等于直流增益 H(1)=1/(1−0.5)=2。"
          },
          {
            id: "signals-ch3-check-6",
            prompt: "Y=HX 无条件成立的前提是？",
            options: ["输入必须是正弦", "系统必须因果", "零状态（初始条件为零）", "系统必须稳定"],
            answer: 2,
            explanation: "含初始条件时，变换后的方程多出与初值有关的项，输出里含零输入分量，不能再写成乘积。"
          },
          {
            id: "signals-ch3-check-7",
            prompt: "LTI 系统对输入 A cos(ω₀n+φ) 的稳态输出是？",
            options: ["A cos(ω₀n+φ)", "A|H|cos(ω₀n+φ+∠H)", "|H|cos(ω₀n)", "A/H·cos(ω₀n)"],
            answer: 1,
            explanation: "复指数是特征函数：幅度乘 |H(e^{jω₀})|、相位加 ∠H(e^{jω₀})；瞬态分量已衰减。"
          },
          {
            id: "signals-ch3-check-8",
            prompt: "单边 Z 变换中 Z{y[n−1]} 等于？",
            options: ["z^{−1}Y(z)", "z^{−1}Y(z)+y[−1]", "zY(z)−y[0]", "Y(z)−y[−1]"],
            answer: 1,
            explanation: "单边变换的移位性质会把初始条件带出来，这正是复频域法能处理初值的原因。"
          },
          {
            id: "signals-ch3-check-9",
            prompt: "因果离散系统 BIBO 稳定的复频域判据是？",
            options: ["极点全在左半平面", "极点全在单位圆内", "零点全在单位圆内", "极点全在单位圆外"],
            answer: 1,
            explanation: "因果要求 ROC 在最外极点之外，稳定要求 ROC 含单位圆，两者合并即极点全在单位圆内。"
          },
          {
            id: "signals-ch3-check-10",
            prompt: "做系统辨识时，输入应满足什么？",
            options: ["用单频正弦即可", "在关心频段内持续激励", "必须是直流", "幅度越小越好"],
            answer: 1,
            explanation: "单频输入只激发个别频点，其余频段的 H 无从观测；应使用白噪声、扫频等多频激励。"
          },
          {
            id: "signals-ch3-check-11",
            prompt: "为什么 H 接近零时直接逆滤波容易失败？",
            options: ["会降低采样率", "除以很小的数会显著放大噪声", "会自动变成非线性系统", "会删除所有极点"],
            answer: 1,
            explanation: "逆滤波包含除以 H，小幅噪声会在 |H| 很小时被放大；可改用相关域估计或加正则项。"
          },
          {
            id: "signals-ch3-check-12",
            prompt: "H(z)=1−2z^{−1} 的因果逆系统是否稳定？",
            options: ["稳定，因为原系统是 FIR", "稳定，因为 H 处处非零", "不稳定，因果逆的极点在 z=2（单位圆外）", "无法判断"],
            answer: 2,
            explanation: "H 的零点 z=2 成为逆系统的极点；极点在单位圆外，因果实现不稳定（按 2^n 发散）。"
          },
          {
            id: "signals-ch3-check-13",
            prompt: "同态解卷积把卷积变成相加，靠的是？",
            options: ["时域反折", "复对数（在变换域取 log）", "提高采样率", "加窗"],
            answer: 1,
            explanation: "Z 变换把卷积变相乘，复对数把相乘变相加；难点在相位卷绕与倒谱可分性假设。"
          },
          {
            id: "signals-ch3-check-14",
            prompt: "数字信号处理中，发生在算法之前且不可逆的两道关口是？",
            options: ["滤波与增益", "采样（混叠）与量化（量化误差）", "FFT 与 IFFT", "缓存与调度"],
            answer: 1,
            explanation: "两者都在信号进入算法前完成：混叠与量化误差无法由后续数字处理恢复。"
          },
          {
            id: "signals-ch3-check-15",
            prompt: "定点实现中，累加结果超范围时最危险的处理方式是？",
            options: ["饱和处理", "加宽累加器", "自然回绕（丢弃高位）", "降低采样率"],
            answer: 2,
            explanation: "回绕会让符号翻转，误差远大于舍入；应加宽累加器（保护位）并对输出饱和。"
          },
          {
            id: "signals-ch3-check-16",
            prompt: "舍入量化 Q(x)=Δ·round(x/Δ) 在无溢出时的误差满足？",
            options: ["|Q(x)−x|≤Δ", "|Q(x)−x|≤Δ/2", "误差恒为 Δ²/12", "误差与 Δ 无关"],
            answer: 1,
            explanation: "最近取整的误差不超过半个步长，这是确定性界；Δ²/12 另需均匀、不相关等统计假设。"
          },
          {
            id: "signals-ch3-check-17",
            prompt: "对规则正弦信号，用量化噪声功率 Δ²/12 估计信噪比的问题是？",
            options: ["没有影响", "误差与信号强相关，实际是谐波失真，估计偏乐观", "Δ²/12 只适用于正弦", "应当把 Δ²/12 加倍"],
            answer: 1,
            explanation: "Δ²/12 假设误差均匀分布且与信号、样本都不相关；规则信号下该假设不成立。"
          },
          {
            id: "signals-ch3-check-18",
            prompt: "MATLAB 中 filter(b,a,x) 的初始条件 zi 与方程初值 y[−1] 的关系是？",
            options: ["完全等同", "zi 是延迟单元的内部状态，需用 filtic 由方程初值换算", "zi 必须为零", "zi 只对连续系统有定义"],
            answer: 1,
            explanation: "zi 表示延迟单元的内部状态，与差分方程的初值不是同一个量，需经 filtic 换算后再传入。",
          }
        ],
        summary: [
          "系统性质逐项检验：线性、时不变、因果、无记忆、BIBO 稳定、可逆彼此不可互推（y=n·x 与 y=x² 是两个反例）。",
          "全响应 = 零输入 + 零状态；卷积只给零状态，Y=HX 也只在零状态下无条件成立。",
          "时域、频域、复频域是同一系统的三种等价描述：卷积↔相乘↔极零点与 ROC。",
          "系统辨识要求持续激励；逆滤波要求 H 的零点位置合适，否则噪声按 1/|H| 放大。",
          "数字实现新增采样与量化两道不可逆关口；量化误差界 |Q−x|≤Δ/2 是确定性的，Δ²/12 另有假设。"
        ],
        tags: ["系统性质", "LTI", "零输入零状态", "冲激响应", "频率响应", "系统辨识", "逆滤波", "有限字长", "量化误差"]
      },
      {
        id: "signals-ch4",
        number: "第4章",
        title: "滤波器",
        counted: true,
        sourceStatus: "verified_local",
        objectives: [
          "把“去掉噪声”这类模糊要求转写成可检验的通带、阻带与衰减指标。",
          "由指标计算巴特沃思/切比雪夫滤波器的阶数，并说明两者的取舍。",
          "用频率变换把低通原型改造成高通、带通与带阻。",
          "区分 IIR 与 FIR 的结构、稳定性与相位特征，并说明两种设计法的误差来源。"
        ],
        prerequisites: ["第3章频率响应与极点稳定性", "复数幅值和相位", "分贝的定义"],
        sourceRef: [
          "教材第四章 滤波器（p261–320）",
          "课件_第5章-滤波器.pdf",
          "个人笔记/03_整理摘要/04_滤波器设计要点.md",
          "开放讲义（spatialaudio）：filters、analog_filters、digital_filters、bilinear_transform"
        ],
        connections: [
          { to: "signals-ch3", kind: "prereq", why: "滤波器就是被指标约束的 LTI 系统：判据（因果、稳定、频率响应）全部来自第3章。" },
          { to: "signals-ch2", kind: "prereq", why: "数字滤波器的设计要在离散域完成，DFT/FFT 与 Z 变换是验证工具。" },
          { to: "signals-ch5", kind: "next", why: "随机信号通过线性系统时，输出的功率谱等于输入功率谱乘 |H|²——滤波器的效果要用统计语言描述。" },
          { to: "analog-06", kind: "cross", why: "RC 有源滤波器与运放实现的电路细节见模电第 5、6 章。" },
          { to: "digital-08", kind: "cross", why: "数字滤波器的定点实现、系数量化与溢出处理落在数电的转换器与数字系统部分。" }
        ],
        sections: [
          {
            id: "signals-ch4-basics",
            group: "第一节 滤波器概述",
            title: "滤波及滤波器的基本原理",
            importance: "core",
            sourceStatus: "verified_local",
            content: "滤波的本质是“按频率取舍”：把输入分解成不同频率的分量，对需要保留的频段给以（近似）恒定的增益和线性相位，对需要抑制的频段给以足够小的增益。判断一个滤波器好不好，不看电路复杂不复杂，而看它的幅频特性在关心的频段上是否满足事先写下的数字指标。",
            detail: [
              "从频域看，滤波就是给频谱乘一个窗函数形状的传输函数：Y(jΩ)=H(jΩ)X(jΩ)。理想低通在 |Ω|<Ωc 内让 H=1、之外为 0，但它的冲激响应是 sinc，非因果且无限长——物理上无法实现，只能逼近。因此实际滤波器必须接受三件事：通带不绝对平坦、阻带不绝对为零、通带到阻带之间有过渡带。这三件事构成了下一节全部指标的来源。",
              "从时域看，滤波是加权求和（FIR）或加权求和加反馈（IIR）。同一个幅频指标可以用不同的时域结构实现，它们的差别落在相位与实现代价上：对称系数的 FIR 可以做到严格线性相位（各频率延迟相同，波形不失真），代价是阶数高；IIR 用反馈换低阶数，但相位一般非线性，且必须检查极点是否都在稳定区域。选择哪一类，取决于任务更在意波形保真还是运算量。"
            ],
            points: [
              "滤波 = 频域乘传输函数：Y(jΩ)=H(jΩ)X(jΩ)",
              "理想低通非因果、冲激响应无限长，不能物理实现，只能逼近",
              "实际滤波器必然有三项妥协：通带波动、阻带残余、过渡带宽度",
              "FIR 可严格线性相位但阶数高；IIR 阶数低但相位非线性且需查稳定性"
            ],
            pitfalls: [
              "把“理想滤波器”当作可以实现的指标下发给设计者：它要求无限长非因果冲激响应",
              "只比较幅频响应而忽略相位：线性相位对波形保真常常比幅频平坦更关键"
            ],
            links: [
              { to: "signals-ch3-frequency", why: "滤波器的全部判据都建立在频率响应与无失真传输条件上" },
              { to: "signals-ch4-specs", why: "下一节把这里的妥协量化成可检验的指标" }
            ],
            formula: "Y(j\\Omega)=H(j\\Omega)X(j\\Omega)",
            variables: [
              "H(jΩ)：滤波器（系统）的传输函数",
              "X、Y：输入与输出的频谱",
              "理想低通：|H|=1（|Ω|<Ωc）、0（其余）——非因果且无限长",
              "线性相位：各频率分量延迟相同，波形不失真"
            ]
          },
          {
            id: "signals-ch4-classify",
            group: "第一节 滤波器概述",
            title: "滤波器的分类",
            importance: "core",
            sourceStatus: "verified_local",
            content: "分类是为了选型。最常用的分类维度有四组：按通过频带分低通/高通/带通/带阻；按实现介质分模拟与数字；按冲激响应长度分 IIR 与 FIR；按对相位的要求分最小相位、线性相位与任意相位。同一组指标落在不同类别上，设计路线完全不同。",
            detail: [
              "按频带分类是所有滤波器的公共语言，四种基本类型可以互相转换：把低通原型的频率轴做倒数变换得到高通，做两个低通的差得到带通（中心频率与带宽），做两个低通的和或差得到带阻。因此下一节的巴特沃思与切比雪夫只需要研究低通原型，其他类型靠频率变换得到——这也是教材把“模拟滤波器的频率变换”单独列一节的用意。",
              "按介质与结构分类决定实现方式。模拟滤波器用电感电容或 RC+运放实现，速度快、无需采样，但元件容差与温漂会影响指标；数字滤波器在采样之后用程序实现，指标由系数决定、可精确复现，但受采样率与字长限制。IIR 与 FIR 的划分则直接决定设计方法：IIR 常借模拟原型加变换（双线性/冲激不变），FIR 常用窗函数或等波纹逼近。选型顺序建议是：先定频带与指标，再定模拟/数字，最后在 IIR 与 FIR 之间按相位与算力取舍。"
            ],
            points: [
              "按频带：低通、高通、带通、带阻——四类可由低通原型经频率变换互相得到",
              "按介质：模拟（无采样、受元件容差影响）与数字（指标可精确复现、受采样率与字长限制）",
              "按冲激响应：IIR（有反馈、阶数低、相位非线性）与 FIR（无反馈、可严格线性相位、阶数高）",
              "选型顺序：先频带与指标 → 再模拟/数字 → 最后 IIR/FIR 按相位与算力取舍"
            ],
            pitfalls: [
              "一上来就选电路或算法，而不先把频带与指标写清楚：后面所有取舍都失去依据",
              "把“数字滤波器”等同于“更好的滤波器”：采样率与字长选错时数字实现可能不如模拟方案"
            ],
            links: [
              { to: "signals-ch4-basics", why: "分类的依据来自上一节的频域取舍" },
              { to: "signals-ch4-analog-transform", why: "四种频带的互相转换在第二节第四节展开" }
            ]
          },
          {
            id: "signals-ch4-specs",
            group: "第一节 滤波器概述",
            title: "滤波器的技术要求",
            importance: "core",
            sourceStatus: "verified_local",
            content: "指标必须写成数字，才能设计也能验收。一组完整指标包含四项：通带边界与通带内允许的最大衰减 Ap、阻带边界与阻带内要求的最小衰减 As、以及两者之间允许的过渡带宽度；对相位有要求时再加一条群延迟波动。指标写得越松，所需阶数越低。",
            detail: [
              "衰减用分贝表示：A(Ω)=−20lg|H(jΩ)|。通带指标写“|Ω|≤Ωp 时 A≤Ap”，阻带写“|Ω|≥Ωs 时 A≥As”，Ωp 与 Ωs 之间是过渡带，不作要求。这样写的好处是每一项都能在幅频曲线上量出来：Ap 决定通带能有多“平”，As 决定阻带能压多低，Ωs/Ωp 决定过渡带有多陡——三者共同决定阶数，缺一项就设计不出来。",
              "指标之间是可以互换的。把 As 从 40 dB 放松到 30 dB，或把 Ωs/Ωp 从 2 缩小到 1.5，所需阶数都会明显下降；反之要更陡、更干净的过渡带，就要更高的阶数、更多的运算或元件。工程上先把“必须满足”的硬指标与“希望达到”的软指标分开，再用阶数与成本去换其中的软指标——这是滤波器设计里最常见的决策。"
            ],
            points: [
              "衰减定义 A(Ω)=−20lg|H(jΩ)|；通带写 A≤Ap，阻带写 A≥As，之间是过渡带",
              "完整指标四项：Ωp/Ap、Ωs/As（再加相位要求时补群延迟波动）",
              "Ωs/Ωp 决定过渡带陡度；与 Ap、As 一起决定所需阶数",
              "指标可互换：放松 As 或缩小 Ωs/Ωp 都能降低阶数与实现成本"
            ],
            pitfalls: [
              "只说“滤掉高频噪声”而不给 Ωs 与 As：无法算出阶数，也无法验收",
              "把过渡带当成可以随便设定的余量：它直接决定阶数与运算量，是成本的主要来源"
            ],
            links: [
              { to: "signals-ch4-classify", why: "指标要写在确定的频带类型上才有意义" },
              { to: "signals-ch4-butterworth", why: "下一节用巴特沃思把指标换算成阶数" }
            ],
            formula: "A(\\Omega)=-20\\lg|H(j\\Omega)|",
            variables: [
              "Ap：通带内允许的最大衰减（dB）",
              "As：阻带内要求的最小衰减（dB）",
              "Ωp、Ωs：通带与阻带的边界角频率",
              "Ωs/Ωp：过渡带陡度的度量，与 Ap、As 共同决定阶数"
            ]
          },
          {
            id: "signals-ch4-analog-overview",
            group: "第二节 模拟滤波器",
            title: "模拟滤波器概述",
            importance: "core",
            sourceStatus: "verified_local",
            content: "模拟滤波器用有理传输函数 H(s)=B(s)/A(s) 描述，设计问题就是选一组极点（必要时加点零点）去逼近理想的矩形幅频特性。逼近方式不同，就得到不同族系：巴特沃思追求通带最大平坦，切比雪夫允许纹波换陡度，椭圆函数在通带阻带都允许纹波以换取最陡过渡。",
            detail: [
              "为什么用有理函数：集总元件电路的传输函数必然是 s 的有理式，而且物理可实现（因果、稳定）要求极点都在左半平面。于是“设计滤波器”等价于“在左半平面摆放极点、在合适位置摆放零点”。零点的作用很直观——把零点放在虚轴上就能让该频率的增益为零（陷波），放在无穷远则得到全极点（低通/高通）响应。",
              "逼近的策略可以理解为“把误差放在哪里”。巴特沃思把全部误差堆在过渡带与阻带（通带内最平）；切比雪夫把误差均匀摊在通带内（等波纹），于是过渡带更陡；椭圆函数两边都摊，过渡带最陡但阻带也有纹波。同一组指标下，阶数顺序是巴特沃思 > 切比雪夫 > 椭圆，而相位线性度与实现难度大致相反。教材选前两种作为主线，正是因为它们的解析式最简洁、手册数据最完整。"
            ],
            points: [
              "模拟滤波器用有理传输函数描述，物理可实现要求极点全在左半平面",
              "零点位置决定特性：虚轴零点给陷波，无穷远零点给全极点低通/高通",
              "逼近策略＝把误差放在哪里：巴特沃思最平、切比雪夫通带等波纹、椭圆两边都波纹",
              "同指标下阶数：巴特沃思 > 切比雪夫 > 椭圆；相位线性度大致相反"
            ],
            pitfalls: [
              "把逼近误差当成计算误差：通带纹波与阻带残余是设计选择，不是精度不够",
              "忽略零点的作用：只会摆极点就做不出陷波与椭圆型响应"
            ],
            links: [
              { to: "signals-ch3-complex", why: "极点位置与稳定性的判据来自第3章复频域分析" },
              { to: "signals-ch4-butterworth", why: "下一节给出最常用的全极点逼近" }
            ]
          },
          {
            id: "signals-ch4-butterworth",
            group: "第二节 模拟滤波器",
            title: "巴特沃思低通滤波器",
            importance: "core",
            sourceStatus: "verified_local",
            content: "巴特沃思低通的幅频特性是 |H(jΩ)|²=1/(1+(Ω/Ωc)^{2N})。它有三个便于手算的性质：通带内最大平坦（前 2N−1 阶导数在 Ω=0 处为零）、幅频随 Ω 单调下降、无论阶数多少在 Ω=Ωc 处恒为 −3.0103 dB。设计流程就是由 Ap、As 与 Ωs/Ωp 解出所需阶数 N。",
            detail: [
              "阶数公式由两个边界条件联立得到：在 Ωp 处要求衰减不超过 Ap，在 Ωs 处要求衰减不少于 As，两式相除消去 Ωc，得 N ≥ lg[(10^{As/10}−1)/(10^{Ap/10}−1)] / (2 lg(Ωs/Ωp))，取不小于该值的最小整数。算例：Ap=1 dB、As=40 dB、Ωs/Ωp=2 时 N ≥ 7.6185，取 N=8；代回校验，N=8 在 Ωs 处的衰减为 42.297 dB，满足 ≥40 dB 的要求。",
              "阶数确定后由“Ωp 处衰减恰好为 Ap”反求 Ωc——Ap 小于 3.0103 dB 时 Ωc 略大于 Ωp（只有 Ap 恰好等于 3.0103 dB 时二者才重合），再由极点公式得到 H(s)。巴特沃思的极点在 s 平面上均匀分布在半径为 Ωc 的左半圆上，共轭成对出现，因此分母可写成实系数二次因式的乘积。这套结构的优点是参数敏感度低、便于级联；缺点是过渡带最缓——同样的指标，它需要的阶数在三族里最高。"
            ],
            points: [
              "巴特沃思幅频：|H(jΩ)|²=1/(1+(Ω/Ωc)^{2N})，通带最大平坦、随 Ω 单调下降",
              "任意阶数在 Ω=Ωc 处恒为 −3.0103 dB（|H|=0.7071）",
              "阶数公式 N ≥ lg[(10^{As/10}−1)/(10^{Ap/10}−1)]/(2 lg(Ωs/Ωp))，取最小整数",
              "算例：Ap=1 dB、As=40 dB、Ωs/Ωp=2 → N≥7.6185 取 N=8，校验 Ωs 处 42.297 dB（Ωc 由 Ωp 处恰为 Ap 确定，不是直接取 Ωc=Ωp）"
            ],
            pitfalls: [
              "把 Ωc 当成“阻带起点”：Ωc 是 −3 dB 点，阻带边界要由 As 另行确定",
              "算完阶数不代回校验：取整后应复核通带与阻带是否同时满足"
            ],
            links: [
              { to: "signals-ch4-specs", why: "阶数公式的两个条件是上一节的指标" },
              { to: "signals-ch4-chebyshev", why: "下一节用允许纹波换取更低的阶数" }
            ],
            formula: "|H(j\\Omega)|^2=\\frac{1}{1+(\\Omega/\\Omega_c)^{2N}}",
            variables: [
              "N：阶数（由 Ap、As、Ωs/Ωp 决定）",
              "Ωc：−3.0103 dB 截止角频率",
              "Ω=Ωc 时 |H|=1/√2，与 N 无关",
              "极点：半径 Ωc 的左半圆上均匀分布，共轭成对"
            ]
          },
          {
            id: "signals-ch4-chebyshev",
            group: "第二节 模拟滤波器",
            title: "切比雪夫低通滤波器",
            importance: "core",
            sourceStatus: "verified_local",
            content: "切比雪夫低通的幅频特性是 |H(jΩ)|²=1/(1+ε²T_N²(Ω/Ωc))，其中 T_N 是 N 阶切比雪夫多项式。它把误差均匀摊在通带内，形成等波纹，换来比同阶巴特沃思更陡的过渡带——代价是通带不再平坦，且相位非线性更明显。",
            detail: [
              "切比雪夫多项式在 |x|≤1 时满足 T_N(x)=cos(N·arccos x)，在 [−1,1] 内等幅振荡于 ±1；在 |x|>1 时 T_N(x)=cosh(N·arcosh x) 快速增长。这两段行为正好对应滤波器的两个频段：通带内 |H| 在 1 与 1/√(1+ε²) 之间等波纹起伏，阻带内则快速下降。纹波量由 ε 唯一决定：Ap=10lg(1+ε²)，即 ε=√(10^{Ap/10}−1)。Ap=1 dB 时 ε=0.5088，通带内 |H| 在 0.8913 与 1.0000 之间起伏，在 Ω=Ωc 处恰好为 −1.0000 dB。",
              "阶数公式与巴特沃思不同形：切比雪夫要用反双曲余弦，N ≥ arcosh√[(10^{As/10}−1)/(10^{Ap/10}−1)] / arcosh(Ωs/Ωp)，取不小于该值的最小整数。注意不能照搬巴特沃思的 lg/(2lg) 形式——那会得到明显偏高的阶数。算例：Ap=1 dB、As=40 dB、Ωs/Ωp=2 时分子为 arcosh(√38619)=5.9737、分母为 arcosh(2)=1.31696，得 N≥4.536 取 N=5，而同一指标下巴特沃思需要 8 阶。选择哪一种取决于任务：如果通带内不允许起伏（例如需要精确的幅度测量），必须用巴特沃思；如果可以接受通带内的等波纹（例如只要信噪比达标），切比雪夫用更少阶数就能达到同样的阻带衰减。还有第三种选择——椭圆函数滤波器，它在通带与阻带都允许纹波，过渡带最陡，本节只作为对照提及。"
            ],
            points: [
              "切比雪夫幅频：|H(jΩ)|²=1/(1+ε²T_N²(Ω/Ωc))，N 阶切比雪夫多项式",
              "|x|≤1 时 T_N=cos(N arccos x) 等幅振荡 → 通带等波纹；|x|>1 时按 cosh 快速增长 → 阻带陡降",
              "纹波由 ε 决定：Ap=10lg(1+ε²)，即 ε=√(10^{Ap/10}−1)；Ap=1 dB 时 ε=0.5088",
              "同指标下阶数低于巴特沃思：算例中切比雪夫 N=5 vs 巴特沃思 N=8（切比雪夫用 arcosh 公式，不能用 lg/(2lg)）"
            ],
            pitfalls: [
              "把切比雪夫的通带纹波当误差：它是设计允许的等波纹，验收时要看是否落在 Ap 以内",
              "记错 ε 与 Ap 的关系：ε 由通带纹波唯一确定，不能随意取大取小"
            ],
            links: [
              { to: "signals-ch4-butterworth", why: "两者用同一组指标，比较的是阶数与平坦度" },
              { to: "signals-ch4-analog-transform", why: "两者都只提供低通原型，其他频带靠变换" }
            ],
            formula: "|H(j\\Omega)|^2=\\frac{1}{1+\\varepsilon^2T_N^2(\\Omega/\\Omega_c)}",
            variables: [
              "ε：通带纹波参数，ε=√(10^{Ap/10}−1)",
              "T_N：N 阶切比雪夫多项式",
              "通带内 |H| ∈ [1/√(1+ε²), 1]（等波纹）",
              "Ap=1 dB ⇒ ε=0.5088，Ωc 处 −1.0000 dB"
            ]
          },
          {
            id: "signals-ch4-analog-transform",
            group: "第二节 模拟滤波器",
            title: "模拟滤波器的频率变换",
            importance: "core",
            sourceStatus: "verified_local",
            content: "归一化低通原型只有一套设计数据，其余频带全部靠频率变换得到。变换的做法是把原型中的复频率 s 用一个 s 的有理函数替换：低通到高通用 s→Ωp/s，低通到带通用把 s 换成含中心频率与带宽的二次式。变换后原来满足指标的原型，仍严格对应新的指标。",
            detail: [
              "低通到高通是最简单的一例：把 s 换成 Ωp/s，则原型在 Ω 处的响应被搬到 Ωp/Ω 处。原型的通带 0≤Ω≤Ωp 映射为 Ωp/Ω≥Ωp……即高频段保留，低频段被抑制，得到高通。同时原型的 Ω=0（直流最大平坦点）被映到 Ω=∞，因此高通在无穷远仍保持平坦。这个“倒频率轴”的观点可以直接用来核对变换后的指标：原型阻带边界 Ωs 应映到高通的通带边界。",
              "低通到带通与带阻用二次变换，把一个频率点映成一对频率点，因此需要两个参数：中心频率 Ω0 与带宽 B。变换后的滤波器阶数是原型的两倍（每个原型极点生成一对共轭极点）。工程上还有一步“归一化”：先把指标折算成 Ωp=1 rad/s 的原型指标（这一步只做频率缩放），查表得到原型，再做频率变换与去归一化——这样一套表格能覆盖全部四种频带，也是教材把频率变换单独列节的原因。"
            ],
            points: [
              "四种频带都从归一化低通原型经频率变换得到：低通原型是唯一的“设计数据源”",
              "低通→高通：s→Ωp/s（倒频率轴，直流平坦点映到无穷远）",
              "低通→带通/带阻：二次变换，需中心频率 Ω0 与带宽 B，阶数变为原型的两倍",
              "流程：指标归一化 → 查原型 → 频率变换 → 去归一化"
            ],
            pitfalls: [
              "变换后不重新核对指标：原型的 Ωs 映到哪里，必须逐项对应检查",
              "忘记带通/带阻阶数翻倍：算出的阶数与实际极点数量会对不上"
            ],
            links: [
              { to: "signals-ch4-butterworth", why: "变换的输入就是巴特沃思或切比雪夫低通原型" },
              { to: "signals-ch4-rc-active", why: "变换得到的传输函数要靠电路结构实现" }
            ],
            formula: "s\\rightarrow\\frac{\\Omega_p}{s}\\ (\\text{高通}),\\qquad s\\rightarrow\\frac{s^2+\\Omega_0^2}{Bs}\\ (\\text{带通})",
            variables: [
              "Ωp：原型通带边界（归一化后为 1 rad/s）",
              "Ω0：带通/带阻的中心频率；B：带宽",
              "低通→高通：频率轴取倒数",
              "带通/带阻：阶数变为原型的 2 倍"
            ]
          },
          {
            id: "signals-ch4-rc-active",
            group: "第二节 模拟滤波器",
            title: "RC 有源滤波器",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "有了传输函数还要落到电路。低频段用电感体积大、损耗高，工程上更常用电阻电容加运算放大器（RC 有源）实现：一阶节用一节 RC 加运放缓冲，二阶节（如 Sallen-Key、多重反馈）用两只电阻两只电容加一只运放。高阶滤波器由一阶、二阶节级联而成。",
            detail: [
              "级联的关键是“每一节对应一对共轭极点”。巴特沃思或切比雪夫分母可分解为实系数二次因式之积，每个因式就是一个二阶节的传递函数，其 Q 值由极点位置决定。低 Q 节容易实现，高 Q 节对元件容差最敏感——这也是高阶滤波器里最需要留意的地方：理论指标满足，实际元件偏差会让高 Q 节的峰值偏移甚至引起通带波动超限。",
              "一阶 RC 的截止频率是 fc=1/(2πRC)，在 fc 处 |H|=1/√2。有源结构则通过反馈把 Q 值做得比无源 RC 高得多，从而在同样元件值下获得更陡的过渡带与更接近理论的响应。设计时的顺序通常是：指标 → 阶数与极点 → 分解为二阶节 → 分配 Q 与 ω0 → 选拓扑与元件值 → 用蒙特卡洛或敏感度分析核对容差影响。"
            ],
            points: [
              "RC 有源结构避免电感：一阶 RC + 运放缓冲，二阶节用 Sallen-Key 或多重反馈",
              "高阶滤波器 = 一阶/二阶节级联，每节对应分母里的一对共轭极点",
              "一阶 RC：fc=1/(2πRC)，截止处 |H|=1/√2",
              "高 Q 节对元件容差最敏感，是实际指标超标的主要来源"
            ],
            pitfalls: [
              "只算理论传输函数不做容差分析：高 Q 节的峰值会随元件偏差明显移动",
              "把运放当理想器件：增益带宽积有限会限制高频节的实际响应"
            ],
            links: [
              { to: "signals-ch4-analog-transform", why: "级联的每一节都来自变换后的传输函数分解" },
              { to: "signals-ch4-matlab-analog", why: "MATLAB 小节给出从指标到元件值的复算路径" }
            ],
            formula: "f_c=\\frac{1}{2\\pi RC}",
            variables: [
              "R、C：一节 RC 的电阻与电容",
              "fc：一阶低通的 −3 dB 截止频率",
              "Q：二阶节的品质因数，由极点位置决定",
              "高 Q 节：对元件容差最敏感"
            ]
          },
          {
            id: "signals-ch4-digital-overview",
            group: "第三节 数字滤波器",
            title: "数字滤波器概述",
            importance: "core",
            sourceStatus: "verified_local",
            content: "数字滤波器是对采样序列做运算的系统，用差分方程与系统函数 H(z) 描述。它有两种基本结构：只有前馈（无反馈）的 FIR，和有反馈的 IIR。设计问题因此变成：先有模拟原型或理想频率响应，再把它“翻译”成 H(z) 的系数。",
            detail: [
              "数字域多出两件模拟域没有的事。第一是周期性与折叠：H(e^{jω}) 以 2π 为周期，只在一个周期内有意义，因此指标必须写在 0≤ω≤π 内，且设计前要确定采样率——模拟指标 Ωp、Ωs 要按 ω=ΩT 折算成数字指标 ωp、ωs。第二是字长：系数与运算都在有限精度下进行，IIR 的反馈会把舍入误差累积，FIR 则没有这个问题。",
              "从模拟原型到数字滤波器的两条常用路径是冲激响应不变法与双线性变换法。前者的思路是“采样冲激响应”，实现简单、时域逼近好，但模拟频谱的周期延拓会带来混叠，只适合高频衰减足够快的低通与带通；后者把整个模拟虚轴一一映射到单位圆上，从根本上消除了混叠，代价是频率轴被非线性压缩（扭曲），因此必须先把关键频率预畸变。两条路径的共同点是：设计完成后都要回到数字频域逐项验收指标。"
            ],
            points: [
              "数字滤波器用差分方程与 H(z) 描述，结构分 FIR（无反馈）与 IIR（有反馈）",
              "H(e^{jω}) 以 2π 为周期，指标写在 0≤ω≤π，设计前需由 ω=ΩT 折算",
              "两条设计路径：冲激响应不变法（有混叠）与双线性变换法（无混叠但有频率扭曲）",
              "有限字长下 IIR 的舍入误差会在反馈环内累积，FIR 无此问题"
            ],
            pitfalls: [
              "把模拟指标直接当数字指标：必须先按采样率折算，否则 ω 的位置会整体偏移",
              "对高通或带阻使用冲激响应不变法：混叠会让高频段的指标完全失效"
            ],
            links: [
              { to: "signals-ch4-analog-overview", why: "两种设计法都以模拟原型为起点" },
              { to: "signals-ch4-iir", why: "下一节展开有反馈结构的实现与稳定性" }
            ]
          },
          {
            id: "signals-ch4-iir",
            group: "第三节 数字滤波器",
            title: "IIR 数字滤波器",
            importance: "core",
            sourceStatus: "verified_local",
            content: "IIR 数字滤波器带反馈，H(z)=B(z)/A(z)，通常由模拟原型经变换得到。它的优势是用较低阶数获得较陡的过渡带；代价是三条必须核对的约束：极点必须在单位圆内、一般不能保证线性相位、有限字长下存在极限环与噪声累积的风险。",
            detail: [
              "冲激响应不变法：令 h[n]=T·h_a(nT)，则数字极点 z=e^{s_kT} 由模拟极点映射而来。映射把左半平面映到单位圆内，因此原型稳定则数字滤波器稳定。问题是时域采样对应频域周期延拓，若模拟响应在折叠频率以上衰减不够，混叠就会破坏阻带指标——所以它不适合高通与带阻，只适合带限的低通/带通。",
              "双线性变换法：s=(2/T)(1−z^{−1})/(1+z^{−1})。它把整条模拟虚轴一一映到单位圆上（Ω 从 −∞ 到 +∞ 对应 ω 从 −π 到 π），因此完全没有混叠，适用任何频带；代价是频率映射非线性：Ω=(2/T)tan(ω/2)，高端频率被压缩。补偿办法是预畸变——把每一个关键数字频率按 ω=2arctan(ΩT/2) 折算成模拟频率去设计原型，设计完再变换回来，这样关键点（通带边界、阻带边界）就能精确落位。本节算例：T=1 ms、ωp=0.4π 时预畸变得 Ωp=1453.085 rad/s，回代精确得到 0.4π（往返误差 <1e−12）。"
            ],
            points: [
              "IIR：H(z)=B(z)/A(z)，带反馈，阶数低但相位一般非线性，必须核对极点",
              "冲激响应不变法：z=e^{s_kT}，稳定原型给出稳定数字滤波器，但有频谱混叠，不适合高通/带阻",
              "双线性变换：s=(2/T)(1−z^{−1})/(1+z^{−1})，虚轴一一映到单位圆，无混叠但有频率扭曲",
              "预畸变：Ω=(2/T)tan(ω/2) 及其反变换 ω=2arctan(ΩT/2)，用于让关键频率精确落位"
            ],
            pitfalls: [
              "对高通/带阻用冲激响应不变法：混叠会直接破坏阻带指标",
              "用双线性变换却不做预畸变：通带与阻带边界会整体偏移，指标对不上"
            ],
            links: [
              { to: "signals-ch4-digital-overview", why: "两种设计路径在上一节已经列出，这里是具体公式" },
              { to: "signals-ch4-fir", why: "下一节给出无反馈、可严格线性相位的替代方案" }
            ],
            formula: "s=\\frac{2}{T}\\frac{1-z^{-1}}{1+z^{-1}},\\qquad \\Omega=\\frac{2}{T}\\tan\\frac{\\omega}{2}",
            variables: [
              "T：采样周期",
              "Ω：模拟角频率；ω：数字角频率",
              "预畸变：Ω=(2/T)tan(ω/2)；反变换 ω=2arctan(ΩT/2)",
              "冲激响应不变法：数字极点 z=e^{s_kT}，存在混叠"
            ]
          },
          {
            id: "signals-ch4-fir",
            group: "第三节 数字滤波器",
            title: "FIR 数字滤波器",
            importance: "core",
            sourceStatus: "verified_local",
            content: "FIR 数字滤波器是有限长冲激响应，没有反馈：y[n]=Σb_k x[n−k]。它天然 BIBO 稳定，且在系数对称（或反对称）时可获得严格线性相位，因此在对波形保真要求高的场合是首选。代价是达到同样过渡带陡度通常需要更高阶数，运算量更大。",
            detail: [
              "线性相位的条件很具体：h[n]=h[M−n]（偶对称）或 h[n]=−h[M−n]（奇对称），M 为阶数。满足时群延迟恒为 M/2 个样点，所有频率分量延迟相同，波形不失真。这也解释了为什么线性相位 FIR 的阶数常取偶数或奇数要按类型区分：不同对称性与 M 的奇偶组合，只能实现特定频带类型（例如奇对称且 M 为偶数只适合微分器与希尔伯特变换器）。",
              "最常用的设计法是窗函数法：先写出理想滤波器的无限长冲激响应 h_d[n]（低通时是 sinc），再乘一个有限长窗并移位到因果。矩形窗主瓣最窄但旁瓣最高（第一旁瓣约 −13 dB），会造成通带波动与阻带残余；Hann、Hamming、Blackman 等窗通过平滑两端显著降低旁瓣，代价是主瓣变宽——过渡带随之变宽，要达到同样指标就要更长（阶数更高）。窗函数法的优点是简单、可预测（过渡带宽度与窗长成反比），缺点是不能分别控制通带与阻带误差；等波纹逼近（Parks-McClellan）能做得更好，属于选学内容。"
            ],
            points: [
              "FIR：h[n] 有限长、无反馈，天然 BIBO 稳定",
              "严格线性相位条件：h[n]=±h[M−n]，满足时群延迟恒为 M/2 个样点",
              "窗函数法：理想 sinc × 窗 → 因果有限长；矩形窗旁瓣最高（约 −13 dB），平滑窗旁瓣低但主瓣宽",
              "过渡带宽度与窗长成反比：指标越严，所需阶数越高"
            ],
            pitfalls: [
              "以为对称系数不带来延迟：线性相位意味着固定的群延迟 M/2，不是零延迟",
              "随意选窗：主瓣宽度直接决定过渡带，选错窗会让指标不达标"
            ],
            links: [
              { to: "signals-ch4-iir", why: "与 IIR 对比选型：稳定与线性相位 vs 阶数与运算量" },
              { to: "signals-ch2-fft-apps", why: "FIR 的高效实现常用 FFT 快速卷积" }
            ],
            formula: "y[n]=\\sum_{k=0}^{M}b_kx[n-k],\\qquad h[n]=\\pm h[M-n]",
            variables: [
              "b_k：FIR 系数（= h[k]）",
              "M：阶数；冲激响应长度 M+1",
              "线性相位：群延迟恒为 M/2 个样点",
              "窗函数：主瓣宽度 ↔ 旁瓣高度 的折中"
            ]
          },
          {
            id: "signals-ch4-matlab-analog",
            group: "第四节 应用MATLAB的滤波器设计",
            title: "模拟滤波器设计",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "MATLAB 把模拟滤波器设计的每一步都做成了函数：由指标算阶数、求零极点增益、画出幅频相频、必要时再转成元件值。本节给出的流程强调“算完要回到指标逐项核对”，而不是接受工具给的阶数。",
            detail: [
              "命令要点：buttord/wp/ws 由指标求巴特沃思最小阶数与截止频率；cheb1ord 对应切比雪夫；butter/cheby1 由阶数与截止频率给出零极点增益 [z,p,k]；zp2tf 转成多项式系数；freqs(b,a,w) 在指定模拟频率点上求频率响应。求出的 H(s) 可以用 freqs 扫频，再与指标线比较——这是最直接的验收方式。",
              "验证点：以 Ap=1 dB、As=40 dB、Ωs/Ωp=2 为例，buttord 给出的阶数应为 8（手算 N≥7.6185）；用 freqs 在 Ωp 处读出衰减应 ≤1 dB、在 Ωs 处应 ≥40 dB（N=8 时理论值 42.297 dB）。若把 As 放松到 30 dB，阶数会降到 6——这个对照说明指标与阶数的直接关系。注意所有频率量都要用 rad/s 且与指标同一量纲，混用 Hz 与 rad/s 是最常见的错误。"
            ],
            points: [
              "buttord/cheb1ord 由指标算阶数；butter/cheby1 给零极点增益；freqs 扫频验收",
              "验证点：Ap=1、As=40、Ωs/Ωp=2 → 阶数 8；freqs 在 Ωp 处 ≤1 dB、Ωs 处 ≥40 dB",
              "对照：As 从 40 dB 放松到 30 dB，阶数明显下降",
              "频率量统一用 rad/s，不要与 Hz 混用"
            ],
            pitfalls: [
              "把 Hz 直接传给要求 rad/s 的函数：频率轴整体错 2π 倍",
              "只看工具返回的阶数不复算指标：应在 Ωp、Ωs 两点读衰减确认"
            ],
            links: [
              { to: "signals-ch4-butterworth", why: "本节的每一项读数都对应那一节的公式" },
              { to: "signals-ch4-matlab-digital", why: "下一节把模拟原型变换成数字滤波器" }
            ]
          },
          {
            id: "signals-ch4-matlab-digital",
            group: "第四节 应用MATLAB的滤波器设计",
            title: "数字滤波器设计",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "数字滤波器设计分两条路：由模拟原型变换（IIR）与直接逼近（FIR）。MATLAB 对两条路都有现成函数，但都要求先把数字指标写清楚，并在设计完成后用 freqz 逐点核对。",
            detail: [
              "IIR 路径：butter/cheby1 可以直接接受数字指标（带 's' 参数则按模拟设计），bilinear 与 impinvar 负责两种变换。用双线性变换时要记住 freqz 读出的数字频率与模拟指标之间隔着预畸变关系——若不做预畸变，通带边界会偏移。检验方法是把设计结果的 −3 dB（或 Ap）点与目标 ωp 比较，而不是只看曲线“看起来像低通”。",
              "FIR 路径：fir1 用窗函数法（指定阶数、截止频率与窗），firpm 用等波纹逼近（指定阶数与各带的目标幅值与权重）；freqz 给出频率响应，grpdelay 给出群延迟。验证点：对称系数的 FIR 用 grpdelay 读出的群延迟应恒为 M/2；用 5 点移动平均（b=ones(1,5)/5）时群延迟应为 2 个样点，且在 ω=π/4 处幅度为 0.4828（与理论式 |sin(5ω/2)/(5sin(ω/2))| 一致），直流增益为 1。"
            ],
            points: [
              "IIR：butter/cheby1 + bilinear/impinvar；双线性必须配合预畸变",
              "FIR：fir1（窗函数法）与 firpm（等波纹）；freqz 看幅频、grpdelay 看群延迟",
              "验证点：对称 FIR 的群延迟恒为 M/2；5 点移动平均群延迟 2 样点、|H(e^{jπ/4})|=0.4828、DC 增益 1",
              "验收标准是目标频点上的读数，不是“曲线看起来像”"
            ],
            pitfalls: [
              "用双线性变换却按模拟频率核对：数字频率轴已被 tan 压缩，必须经预畸变折算",
              "只看幅频不看群延迟：FIR 的线性相位优势要由 grpdelay 的平坦度来确认"
            ],
            links: [
              { to: "signals-ch4-iir", why: "IIR 路径的公式与误差来源在那一节" },
              { to: "signals-ch4-fir", why: "FIR 路径的窗函数与线性相位条件在那一节" }
            ]
          }
        ],
        examples: [
          {
            title: "理想低通为什么不能实现",
            prompt: "理想低通在 |Ω|<Ωc 内 |H|=1、之外为 0。为什么说它不能物理实现？",
            steps: [
              "对矩形幅频做反变换，得到冲激响应 h(t)=sin(Ωc t)/(πt)——一个无限长的 sinc。",
              "sinc 对 t<0 不为零，因此系统非因果，违反“输出不能先于输入”。",
              "即使允许延迟，无限长的冲激响应也无法用有限元件或有限阶系统精确实现。"
            ],
            answer: "理想低通的冲激响应是非因果、无限长的 sinc；只能用时延允许的因果系统去逼近，逼近必然带来通带波动、阻带残余与过渡带。"
          },
          {
            title: "先定频带类型",
            prompt: "某采集系统要抑制 50 Hz 工频干扰，同时保留 0.5–40 Hz 的有用信号。应选哪类滤波器？",
            steps: [
              "有用的 0.5–40 Hz 环绕在 50 Hz 两侧，要抑制的是一个窄带而不是低于或高于某频率的全部内容。",
              "低通会把 40 Hz 以上的有用成分一并砍掉，高通会砍掉低频有用成分，都不合适。",
              "应选带阻（陷波）滤波器，中心频率 50 Hz，阻带宽度按工频漂移（如 ±1 Hz）设定。"
            ],
            answer: "带阻/陷波滤波器：中心 50 Hz、阻带 49–51 Hz；通带为 0.5–40 Hz（以及 50 Hz 以上未使用的频段）。题干要求保留 0.5–40 Hz，通带下界是 0.5 Hz 而不是 0 Hz。"
          },
          {
            title: "把要求写成指标",
            prompt: "把“滤掉高频噪声、保留有用信号”写成一组可检验的指标（设采样率 1 kHz，有用信号到 100 Hz）。",
            steps: [
              "定通带：0–100 Hz，允许的最大衰减取 Ap=1 dB（保证幅度测量误差可接受）。",
              "定阻带：从 200 Hz 起，要求最小衰减 As=40 dB（噪声压到 1% 以下）。",
              "过渡带 100–200 Hz 不作要求；如需线性相位再补一条群延迟波动指标。"
            ],
            answer: "Ωp 对应 100 Hz、Ap=1 dB；Ωs 对应 200 Hz、As=40 dB；过渡带 100–200 Hz。四项齐全才算可设计、可验收。"
          },
          {
            title: "三种逼近把误差放在哪里",
            prompt: "同一组指标（Ap=1 dB、As=40 dB），三种逼近的阶数顺序如何？为什么？",
            steps: [
              "巴特沃思通带最平（最大平坦），误差全堆在过渡带与阻带，因此过渡带最缓、阶数最高。",
              "切比雪夫把误差均匀摊在通带内（等波纹），换来更陡的过渡带，阶数更低。",
              "椭圆函数在通带与阻带都允许波纹，过渡带最陡、阶数最低，但相位最差。"
            ],
            answer: "同为满足指标，阶数：巴特沃思 > 切比雪夫 > 椭圆；相位线性度大致相反。"
          },
          {
            title: "由指标算巴特沃思阶数",
            prompt: "设计要求 Ap=1 dB、As=40 dB、Ωs/Ωp=2。求最小阶数与截止角频率位置。",
            steps: [
              "代入 N ≥ lg[(10^{40/10}−1)/(10^{1/10}−1)]/(2 lg 2) = lg(9999/0.2589)/0.6021 = 7.6185。",
              "取不小于该值的最小整数：N=8。",
              "校验：N=8 时在 Ωs 处的衰减为 10lg[1+2^{16}(10^{0.1}−1)] = 42.297 dB ≥ 40 dB，满足要求。"
            ],
            answer: "N=8；Ωc 由“使 Ωp 处衰减恰为 Ap”确定（Ap=1 dB 时 Ωc 略大于 Ωp），此时阻带在 Ωs 处的衰减为 42.297 dB，满足 ≥40 dB。"
          },
          {
            title: "切比雪夫纹波与 ε",
            prompt: "切比雪夫滤波器允许 0.5 dB 通带纹波。求 ε，并说明通带内 |H| 的取值范围。",
            steps: [
              "由 Ap=10lg(1+ε²) 反解：ε=√(10^{0.05}−1)。",
              "10^{0.05}=1.1220，故 ε=√0.1220=0.3493。",
              "通带内 |H| 在 1 与 1/√(1+ε²)=1/√1.1220=0.9441 之间等波纹起伏。"
            ],
            answer: "ε≈0.3493；通带内 |H|∈[0.9441, 1]，对应 −0.5 dB 到 0 dB 的等波纹。"
          },
          {
            title: "由低通原型造高通",
            prompt: "归一化低通原型 Ωp=1 rad/s、阻带边界 Ωs=2 rad/s。用 s→Ωp/s 变换后，高通的通带与阻带边界是什么？",
            steps: [
              "变换把频率 Ω 映到 Ωp/Ω：原型的通带 0≤Ω≤1 映为 Ωp/Ω≥1，即高通通带 |Ω|≥1 rad/s。",
              "原型的阻带 Ω≥2 映为 Ωp/Ω≤0.5，即高通阻带 |Ω|≤0.5 rad/s。",
              "过渡带由原来的 1–2 rad/s 变为 0.5–1 rad/s，宽度与位置都随之改变。"
            ],
            answer: "高通通带 |Ω|≥1 rad/s、阻带 |Ω|≤0.5 rad/s；原型的最大平坦点 Ω=0 映到 Ω=∞，所以高通在无穷远仍平坦。"
          },
          {
            title: "一阶 RC 与二阶节的 Q",
            prompt: "一阶 RC 取 R=10 kΩ、C=10 nF。求截止频率与该点的幅值比；若把它做成二阶节，Q 起什么作用？",
            steps: [
              "时间常数 RC=10⁴×10⁻⁸=10⁻⁴ s。",
              "fc=1/(2πRC)=1/(2π×10⁻⁴)≈1591.5 Hz，该点 |H|=1/√2。",
              "二阶节的 Q 决定极点离虚轴的距离：Q 越大峰越尖、过渡带越陡，但对元件容差也越敏感。"
            ],
            answer: "fc≈1.59 kHz，|H|=0.707；Q 决定二阶节的陡度与敏感度，高阶滤波器里高 Q 节最需要做容差分析。"
          },
          {
            title: "模拟指标折算成数字指标",
            prompt: "采样率 fs=1 kHz，设计要求通带到 100 Hz、阻带从 200 Hz 起。写出数字角频率指标。",
            steps: [
              "数字角频率与物理频率的关系是 ω=2πf/fs。",
              "ωp=2π×100/1000=0.2π rad；ωs=2π×200/1000=0.4π rad。",
              "指标区间为 0≤ω≤π（对应 0 到 fs/2=500 Hz），因此本例未越界。"
            ],
            answer: "ωp=0.2π、ωs=0.4π；设计前必须做这一步折算，否则频率位置会整体偏移。"
          },
          {
            title: "双线性变换的预畸变",
            prompt: "T=1 ms，要求数字通带边界 ωp=0.4π。用双线性变换设计时，模拟原型应在哪个频率上满足通带边界？",
            steps: [
              "预畸变公式 Ω=(2/T)tan(ω/2)。",
              "代入 ω=0.4π：tan(0.2π)=0.7265，Ωp=(2/10⁻³)×0.7265=1453.085 rad/s。",
              "校验往返：ω=2arctan(Ωp T/2)=2arctan(0.7265)=0.4π，精确回到原值。"
            ],
            answer: "模拟原型应在 Ωp=1453.085 rad/s 处满足通带指标；不做预畸变则实际通带边界会偏移。"
          },
          {
            title: "线性相位 FIR 的群延迟",
            prompt: "FIR 滤波器阶数 M=10，系数满足 h[n]=h[10−n]。求群延迟，并说明它是否意味着“没有延迟”。",
            steps: [
              "对称系数保证线性相位，群延迟恒为 M/2。",
              "本例 M/2=5，即所有频率分量统一延迟 5 个样点。",
              "统一延迟不改变波形形状，但确实存在——它不是零延迟，实时系统里这部分时延要计入预算。"
            ],
            answer: "群延迟 5 个样点；线性相位＝各频率延迟相同，不等于无延迟。"
          },
          {
            title: "用 buttord 复核阶数",
            prompt: "用 MATLAB 设计巴特沃思低通：Ap=1 dB、As=40 dB、Ωs/Ωp=2。写出流程，并说明如何验收。",
            steps: [
              "wp=1; ws=2; [N,wc]=buttord(wp,ws,1,40) 返回 N=8（与手算 7.6185 取整一致）。",
              "[z,p,k]=butter(N,wc) 得到零极点增益，zp2tf 转成 b、a。",
              "用 freqs(b,a,[wp ws]) 读两点衰减：wp 处应 ≤1 dB，ws 处应 ≥40 dB（N=8 时理论 42.297 dB）。"
            ],
            answer: "阶数 8；验收方式是在 Ωp、Ωs 两点读衰减并与指标比较，而不是只看曲线形状。"
          },
          {
            title: "5 点移动平均的频率响应与群延迟",
            prompt: "b=[1 1 1 1 1]/5 的 FIR。用 freqz 与 grpdelay 核对：群延迟多少？ω=π/4 处幅度多少？",
            steps: [
              "长度 5 的对称 FIR，群延迟=(5−1)/2=2 个样点。",
              "幅频为 |sin(5ω/2)/(5sin(ω/2))|；代入 ω=π/4 得 0.4828。",
              "DC（ω=0）处极限为 1，即直流增益为 1；freqz(b,1,[0 pi/4]) 可直接读出这两点。"
            ],
            answer: "群延迟 2 样点；|H(e^{jπ/4})|=0.4828；DC 增益 1。"
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
            prompt: "理想低通滤波器不能物理实现的根本原因是？",
            options: ["幅频不是常数", "冲激响应是非因果的无限长 sinc", "阶数太高", "需要数字实现"],
            answer: 1,
            explanation: "矩形幅频反变换得到无限长 sinc，t<0 不为零即非因果；只能逼近，不能精确实现。"
          },
          {
            id: "signals-ch4-check-2",
            prompt: "四种基本频带（低通/高通/带通/带阻）之间的关系是？",
            options: ["必须分别独立设计", "都由归一化低通原型经频率变换得到", "只有低通可实现", "带通不能由低通得到"],
            answer: 1,
            explanation: "低通原型是唯一的设计数据源；高通用 s→Ωp/s，带通/带阻用二次变换，阶数变为两倍。"
          },
          {
            id: "signals-ch4-check-3",
            prompt: "一组完整的滤波器幅频指标应包含？",
            options: ["只要截止频率", "通带边界与 Ap、阻带边界与 As（再加相位要求时补群延迟）", "只要阶数", "只要采样率"],
            answer: 1,
            explanation: "Ωp/Ap 与 Ωs/As 四项缺一不可，过渡带宽度由两者之差决定，共同决定阶数。"
          },
          {
            id: "signals-ch4-check-4",
            prompt: "衰减的定义是？",
            options: ["A=20lg|H|", "A=−20lg|H|", "A=|H|²", "A=1−|H|"],
            answer: 1,
            explanation: "衰减取负的分贝值，因此 |H| 越小 A 越大；通带要求 A≤Ap，阻带要求 A≥As。"
          },
          {
            id: "signals-ch4-check-5",
            prompt: "巴特沃思滤波器在 Ω=Ωc 处的衰减是？",
            options: ["与阶数有关", "恒为 −3.0103 dB", "恒为 −1 dB", "恒为 0 dB"],
            answer: 1,
            explanation: "代入 |H|²=1/(1+1)=1/2，与 N 无关；Ωc 是 −3 dB 点，不是阻带起点。"
          },
          {
            id: "signals-ch4-check-6",
            prompt: "巴特沃思阶数公式 N ≥ lg[(10^{As/10}−1)/(10^{Ap/10}−1)]/(2lg(Ωs/Ωp)) 中，哪个量增大一定会使 N 增大？",
            options: ["Ap 增大", "As 增大", "Ωs/Ωp 减小", "Ωc 增大"],
            answer: 1,
            explanation: "As 越大要求阻带压得越低、N 越大；Ap 放松（增大）或 Ωs/Ωp 减小都会使 N 减小。"
          },
          {
            id: "signals-ch4-check-7",
            prompt: "同阶条件下，切比雪夫滤波器相对巴特沃思的典型取舍是？",
            options: ["允许纹波以换取更陡过渡", "完全没有相位", "始终线性相位", "不需要截止频率"],
            answer: 0,
            explanation: "切比雪夫把误差均匀摊在通带内（等波纹），换取更陡的过渡带；代价是通带不再平坦、相位更差。"
          },
          {
            id: "signals-ch4-check-8",
            prompt: "切比雪夫滤波器的纹波参数 ε 与通带衰减 Ap 的关系是？",
            options: ["ε=Ap", "ε=√(10^{Ap/10}−1)", "ε=10^{Ap/20}", "两者无关"],
            answer: 1,
            explanation: "由 Ap=10lg(1+ε²) 反解得到；Ap=1 dB 时 ε=0.5088，通带 |H| 在 0.8913–1.0000 之间起伏。"
          },
          {
            id: "signals-ch4-check-9",
            prompt: "低通原型到高通的频率变换是？",
            options: ["s→s+Ωp", "s→Ωp/s", "s→s²", "s→s/Ωp"],
            answer: 1,
            explanation: "s→Ωp/s 把频率轴取倒数：原型直流点映到无穷远，因此高通在无穷远保持平坦。"
          },
          {
            id: "signals-ch4-check-10",
            prompt: "由 N 阶低通原型做带通变换后，滤波器的阶数是？",
            options: ["仍是 N", "2N", "N/2", "N²"],
            answer: 1,
            explanation: "二次变换把一个频率点映成一对，每个原型极点生成一对共轭极点，故阶数翻倍。"
          },
          {
            id: "signals-ch4-check-11",
            prompt: "R=10 kΩ、C=10 nF 的一阶 RC 低通，截止频率约为？",
            options: ["159 Hz", "1.59 kHz", "15.9 kHz", "159 kHz"],
            answer: 1,
            explanation: "fc=1/(2πRC)=1/(2π×10⁻⁴)≈1591.5 Hz；该点 |H|=1/√2。"
          },
          {
            id: "signals-ch4-check-12",
            prompt: "模拟通带边界 100 Hz、采样率 1 kHz，对应的数字角频率是？",
            options: ["0.1π", "0.2π", "0.4π", "π"],
            answer: 1,
            explanation: "ω=2πf/fs=2π×100/1000=0.2π rad；数字指标必须落在 0≤ω≤π。"
          },
          {
            id: "signals-ch4-check-13",
            prompt: "冲激响应不变法与双线性变换法的主要差别是？",
            options: ["前者无混叠，后者有混叠", "前者有频谱混叠，后者无混叠但有频率扭曲", "两者完全等价", "后者不能用于低通"],
            answer: 1,
            explanation: "冲激响应不变法对应频域周期延拓（有混叠，不适合高通/带阻）；双线性把虚轴一一映到单位圆（无混叠，但需预畸变）。"
          },
          {
            id: "signals-ch4-check-14",
            prompt: "FIR 获得严格线性相位的条件是？",
            options: ["系数全为正", "h[n]=±h[M−n]（对称或反对称）", "阶数必须为奇数", "必须加窗"],
            answer: 1,
            explanation: "对称（或反对称）系数使群延迟恒为 M/2，所有频率延迟相同；这是 FIR 相对 IIR 的关键优势。"
          },
          {
            id: "signals-ch4-check-15",
            prompt: "FIR 窗函数法中，窗越平滑（如 Blackman 相对矩形窗）通常意味着？",
            options: ["旁瓣更低但主瓣更宽", "主瓣更窄且旁瓣更低", "两者都不变", "阻带衰减变差"],
            answer: 0,
            explanation: "旁瓣低带来更小的阻带残余，主瓣宽导致过渡带变宽，要达到同样指标需要更高阶数。"
          },
          {
            id: "signals-ch4-check-16",
            prompt: "长度 5 的对称 FIR（b=ones(1,5)/5）的群延迟是？",
            options: ["0 样点", "2 样点", "5 样点", "2.5 样点"],
            answer: 1,
            explanation: "群延迟=(M)/2，M 为阶数；长度 5 时 M=4，群延迟 2 个样点。"
          },
          {
            id: "signals-ch4-check-17",
            prompt: "用双线性变换设计数字滤波器时，预畸变的作用是？",
            options: ["消除混叠", "补偿频率轴的非线性压缩，让关键频率精确落位", "提高阶数", "把数字指标变成 Hz"],
            answer: 1,
            explanation: "Ω=(2/T)tan(ω/2)：用该式把数字关键频率折算成模拟频率去设计原型，变换回来即可精确落在目标位置。"
          },
          {
            id: "signals-ch4-check-18",
            prompt: "级联实现高阶滤波器时，哪一类二阶节最需要做容差分析？",
            options: ["低 Q 节", "高 Q 节", "纯电阻节", "所有节敏感度相同"],
            answer: 1,
            explanation: "高 Q 节的极点靠近虚轴，元件偏差会让峰值明显移动，是实际指标超标的主要来源。"
          }
        ],
        summary: [
          "滤波 = 频域乘传输函数；理想滤波器非因果且无限长，实际设计必然在通带波动、阻带残余与过渡带之间妥协。",
          "指标必须写成 Ωp/Ap 与 Ωs/As 四项（加相位要求时补群延迟），四项共同决定阶数。",
          "巴特沃思最大平坦、Ωc 处恒 −3.0103 dB；切比雪夫以通带等波纹换更低阶数（ε=√(10^{Ap/10}−1)）。",
          "四种频带由归一化低通原型经频率变换得到；带通/带阻的阶数是原型的两倍，RC 有源结构用一阶/二阶节级联实现。",
          "数字滤波器两条路径：冲激响应不变法有混叠、双线性变换无混叠但有频率扭曲（须预畸变）。",
          "FIR 无反馈天然稳定且对称系数可严格线性相位（群延迟 M/2），代价是阶数高于 IIR。"
        ],
        tags: ["滤波器", "技术指标", "巴特沃思", "切比雪夫", "频率变换", "RC有源", "IIR", "FIR", "双线性变换", "窗函数"]
      },
      {
        id: "signals-ch5",
        number: "第5章",
        title: "随机信号分析与处理基础",
        counted: true,
        sourceStatus: "verified_local",
        objectives: [
          "区分随机变量、随机过程与一次样本函数，并说明严格平稳与宽平稳的差别。",
          "用均值、相关函数与功率谱密度描述随机信号，并说清各态历经性的用途。",
          "推导并核对随机信号通过连续/离散 LTI 系统后的均值、相关函数与功率谱。",
          "说明维纳、卡尔曼与自适应滤波各自依赖的前提与适用场合。",
          "概述非平稳信号的时频、小波与希尔伯特-黄分析思路与边界。"
        ],
        prerequisites: ["概率论中的随机变量、期望与方差", "第1章相关分析", "第3章 LTI 系统", "第4章滤波器"],
        sourceRef: [
          "教材第五章 随机信号分析与处理基础（p321–399）",
          "课件_第6章-随机信号分析.pdf",
          "个人笔记/03_整理摘要/05_随机信号与最优滤波.md",
          "开放讲义（spatialaudio）：random_signals、stochastic_processes、wiener_filter、kalman_filter"
        ],
        connections: [
          { to: "signals-ch1", kind: "prereq", why: "相关函数与相关定理在第1章已经建立，本章把它们放到统计意义下重新定义。" },
          { to: "signals-ch3", kind: "prereq", why: "随机信号通过线性系统的全部结论都建立在 LTI 系统的卷积与频率响应上。" },
          { to: "signals-ch4", kind: "prereq", why: "维纳滤波与卡尔曼滤波要解决的问题，正是第4章滤波器在“信号与噪声都是随机”时的推广。" },
          { to: "digital-01", kind: "next", why: "本课程至此结束：下一步进入数字电子技术，噪声与量化问题在那里落到电路与逻辑实现。" },
          { to: "digital-08", kind: "cross", why: "量化误差、信噪比与转换器指标在数电第 8 章以电路参数的形式出现。" }
        ],
        sections: [
          {
            id: "signals-ch5-probability",
            group: "第一节 随机信号的描述与分析",
            title: "随机信号及其概率结构",
            importance: "core",
            sourceStatus: "verified_local",
            content: "前面四章处理的信号都有确定表达式，这一章的对象没有：随机信号是一族可能的样本函数，一次观测只给出其中一条。描述它不能靠单条曲线的形状，而要靠概率结构——各阶概率分布，以及由分布导出的数字特征。",
            detail: [
              "概率结构由一族有限维分布函数描述：取定时刻 t₁,…,t_n，它们的联合分布 F(x₁,…,x_n; t₁,…,t_n) 就是随机过程在这组时刻上的“快照”。严格（狭义）平稳要求这族分布对时间平移不变——任意平移后联合分布完全相同，这是很强的要求。宽（广义）平稳只要求两条：均值为常数、自相关函数只依赖时间差 R_x(t₁,t₂)=R_x(τ)，τ=t₁−t₂。工程上绝大部分结论建立在宽平稳上，因为功率谱与相关函数的全部关系只需要二阶矩。",
              "还有两个必须分清的概念。其一是各态历经性：它说的是“用一条足够长的样本做时间平均，能得到集合平均”，这是把理论量变成可测量量的桥梁；但它比平稳更强——平稳过程不一定各态历经（例如每条样本都是一个随机常数）。其二是高斯过程：它的任意有限维分布都是高斯分布，因此只要知道均值与相关函数就完全确定，这也是它在理论推导中被反复使用的原因。"
            ],
            points: [
              "随机过程 = 一族样本函数；一次观测只是其中一条，不能代表全体",
              "概率结构 = 有限维联合分布族；严格平稳要求它对时间平移不变",
              "宽平稳只需两条：均值为常数、R_x(t₁,t₂) 只依赖 τ=t₁−t₂",
              "各态历经性（时间平均=集合平均）比平稳更强；高斯过程由均值与相关函数完全确定"
            ],
            pitfalls: [
              "用一次记录“代表”整个随机过程：样本量不足时统计量本身也是随机的",
              "把平稳与各态历经混为一谈：平稳只约束分布随时间不变，能否用时间平均替代集合平均是另一件事"
            ],
            links: [
              { to: "signals-ch5-description", why: "下一节给出描述随机信号的常用数字特征" },
              { to: "signals-ch1-correlation", why: "确定性信号的相关分析是本章统计相关的来源" }
            ],
            formula: "F(x_1,\\dots,x_n;t_1,\\dots,t_n)",
            variables: [
              "F：有限维联合分布函数（概率结构的完整描述）",
              "严格平稳：F 对时间平移不变",
              "宽平稳：E{x(t)}=常数，R_x(t₁,t₂)=R_x(τ)",
              "各态历经：时间平均 = 集合平均（比平稳更强）"
            ]
          },
          {
            id: "signals-ch5-description",
            group: "第一节 随机信号的描述与分析",
            title: "随机信号在时域的数字特征",
            importance: "core",
            sourceStatus: "verified_local",
            content: "数字特征是把概率结构压缩成几个可测量的数：均值（一阶矩）描述直流分量，方差描述起伏强度，自相关函数（二阶矩）描述不同时刻的相关程度。对宽平稳过程，这三个量都与绝对时间无关；但要用一条样本的时间平均去估计它们，还需要各态历经性——平稳只约束集合平均，本身推不出时间平均可用。",
            detail: [
              "定义与用途：均值 μ_x=E{x(t)}；方差 σ_x²=E{[x(t)−μ_x]²}=R_x(0)−μ_x²，即“总平均功率减去直流功率”；自相关函数 R_x(τ)=E{x(t)x*(t−τ)}，其 τ=0 处取值 R_x(0)=E{|x(t)|²} 就是平均功率。互相关 R_xy(τ)=E{x(t)y*(t−τ)} 描述两个过程的关联，且满足 R_yx(τ)=R_xy*(−τ)。这几条把“随机信号有多强、变化多快、两路信号像不像”都变成了数字。",
              "两条常用性质要记牢：实过程的自相关是偶函数且 |R_x(τ)|≤R_x(0)（τ=0 处取最大）；若过程含周期分量，R_x(τ) 也含同周期分量，因此相关函数可以用来检测被噪声淹没的周期信号——这正是第1章相关分析在统计意义上的延续。协方差函数 C_x(τ)=R_x(τ)−μ_x² 则去掉了直流的影响，描述纯起伏部分的相关性。估计时用有限长记录的时间平均替代集合平均，估计方差随记录长度下降但不会为零，所以“测出来的相关函数”本身也带统计误差。"
            ],
            points: [
              "均值 μ_x 描述直流；方差 σ_x²=R_x(0)−μ_x² 描述起伏，即总功率减直流功率",
              "自相关 R_x(τ)=E{x(t)x*(t−τ)}，R_x(0) 就是平均功率；估计它需要各态历经性，而不只是平稳",
              "实过程：R_x(τ) 为偶函数且 |R_x(τ)|≤R_x(0)；含周期分量时相关函数同周期",
              "互相关满足 R_yx(τ)=R_xy*(−τ)；有限记录的时间平均估计本身带统计误差"
            ],
            pitfalls: [
              "把 R_x(0) 当成方差：R_x(0) 是总平均功率，只有零均值时二者才相等",
              "用有限记录估计相关函数却不给出记录长度：估计的波动程度完全取决于样本量"
            ],
            links: [
              { to: "signals-ch5-probability", why: "这些数字特征都由上一节的分布导出" },
              { to: "signals-ch5-spectrum", why: "自相关函数与功率谱构成傅里叶变换对" }
            ],
            formula: "R_x(\\tau)=\\operatorname{E}\\{x(t)x^*(t-\\tau)\\},\\qquad \\sigma_x^2=R_x(0)-\\mu_x^2",
            variables: [
              "μ_x：均值（直流分量）",
              "R_x(τ)：自相关函数；R_x(0)=E{|x|²} 为平均功率",
              "σ_x²：方差（起伏功率）",
              "R_xy：互相关，满足 R_yx(τ)=R_xy*(−τ)"
            ]
          },
          {
            id: "signals-ch5-spectrum",
            group: "第一节 随机信号的描述与分析",
            title: "随机信号的频域描述与分析",
            importance: "core",
            sourceStatus: "verified_local",
            content: "随机信号没有确定频谱（它的傅里叶变换不存在），但它的平均功率随频率的分布是确定的——这就是功率谱密度 S_x(ω)。维纳—辛钦定理把 S_x(ω) 与自相关函数 R_x(τ) 连成一对傅里叶变换，于是时域统计与频域功率可以互相换算。",
            detail: [
              "为什么是“功率谱”而不是“频谱”：随机信号的每条样本能量无限，频谱密度不存在；但平均功率有限，因此描述的对象是功率在频率上的密度（单位 Hz 或 rad/s 上的功率）。维纳—辛钦关系 S_x(ω)=∫R_x(τ)e^{−jωτ}dτ 与 R_x(τ)=(1/2π)∫S_x(ω)e^{jωτ}dω 是本章使用频率最高的一对式子。由 τ=0 得 R_x(0)=(1/2π)∫S_x(ω)dω：相关函数原点的取值等于功率谱曲线下的总面积——这条恒等式是检验推导与数值结果是否自洽的最快方法。",
              "性质方面：实过程的 S_x(ω) 是实的非负偶函数；白噪声的功率谱为常数，其自相关是 δ 函数（任意两个不同时刻都不相关）。带通过程、窄带过程的谱形与相关函数的包络之间存在对应关系，是通信里“包络检波”“相干时间”等概念的基础。估计功率谱最直接的方法是用周期图（对有限记录做 FFT 后取幅度平方），但周期图是有限长度有偏、渐近无偏而方差恒定的估计——它的根本缺陷是加长记录并不让曲线变平滑，把记录分段平均（Welch 法）才是用偏差换方差的常用折中。"
            ],
            points: [
              "随机信号没有确定频谱，描述对象是功率谱密度 S_x(ω)（单位频率上的平均功率）",
              "维纳—辛钦：S_x(ω) 与 R_x(τ) 互为傅里叶变换对",
              "恒等式 R_x(0)=(1/2π)∫S_x(ω)dω：相关函数原点 = 功率谱总面积（自洽性速检）",
              "实过程 S_x(ω) 为非负偶函数；白噪声谱平坦、自相关为 δ"
            ],
            pitfalls: [
              "把功率谱当成某一条样本的频谱：样本频谱随样本变化，功率谱是统计平均量",
              "直接用周期图当功率谱估计：它方差不随记录长度减小，需要分段平均（Welch）等处理"
            ],
            links: [
              { to: "signals-ch5-description", why: "功率谱与自相关函数是一对变换，必须成对理解" },
              { to: "signals-ch5-lti-continuous", why: "下一节用功率谱给出随机信号通过系统的结论" }
            ],
            formula: "S_x(\\omega)=\\int_{-\\infty}^{\\infty}R_x(\\tau)e^{-j\\omega\\tau}d\\tau",
            variables: [
              "S_x(ω)：功率谱密度（非负、偶函数）",
              "R_x(τ)：自相关函数",
              "R_x(0)=(1/2π)∫S_x(ω)dω：平均功率",
              "白噪声：S_x 为常数，R_x 为 δ"
            ]
          },
          {
            id: "signals-ch5-lti-continuous",
            group: "第二节 随机信号通过线性系统的分析",
            title: "平稳随机信号通过连续系统",
            importance: "core",
            sourceStatus: "verified_local",
            content: "把宽平稳随机信号送进稳定 LTI 系统，输出仍然是宽平稳的，而且三条结论都可以直接从卷积与频率响应推出来：均值乘直流增益、功率谱乘 |H|²、互功率谱乘 H。这三条把“随机”问题化成了确定性系统函数的代数运算，是本章最实用的部分。",
            detail: [
              "推导思路：输出 y(t)=h(t)*x(t)。对均值取期望，E{y}=E{x}∫h(t)dt=μ_x·H(0)——即均值被直流增益缩放。对相关函数做二阶矩运算可得 R_y(τ)=R_x(τ)*h(τ)*h(−τ)，两边取傅里叶变换即得 S_y(ω)=|H(jω)|²S_x(ω)。输入输出之间的互谱为 S_xy(ω)=H*(jω)S_x(ω)，互相关为 R_xy(τ)=R_x(τ)*h*(−τ)。这里出现共轭，是本站互相关定义 R_xy(τ)=E{x(t)y*(t−τ)} 的直接结果——若改用 R_xy(τ)=E{x(t)y(t+τ)} 的定义，共轭就会消失，换教材或换软件前先确认约定。注意 S_y 只与 |H| 有关而与相位无关——这一点很重要：功率谱无法反映系统的相位信息，因此也不能靠输出功率谱辨识一个非最小相位系统。",
              "两条工程推论。第一，白噪声通过系统后，输出功率谱的形状就是 |H(jω)|² 的形状——这正是用白噪声激励测量系统频率响应的原理（配合相关或谱平均抑制估计方差）。第二，输出平均功率 E{|y|²}=R_y(0)=(1/2π)∫|H(jω)|²S_x(ω)dω，它把“输入功率谱有多少落在系统通带内”算成一个积分：窄带系统只放行落在通带内的那部分功率，这是信噪比计算的标准做法。"
            ],
            points: [
              "输出仍宽平稳；均值 E{y}=μ_x·H(0)（乘直流增益）",
              "自相关 R_y(τ)=R_x(τ)*h(τ)*h(−τ)；功率谱 S_y(ω)=|H(jω)|²S_x(ω)",
              "互谱 S_xy(ω)=H*(jω)S_x(ω)、互相关 R_xy(τ)=R_x(τ)*h*(−τ)（按本站 R_xy=E{x(t)y*(t−τ)} 的定义；换定义则共轭消失）",
              "输出平均功率 R_y(0)=(1/2π)∫|H|²S_x dω；白噪声激励下输出谱形状 = |H|²"
            ],
            pitfalls: [
              "以为输出功率谱能反映系统相位：它只依赖 |H|，非最小相位系统无法由输出谱区分",
              "忽略稳定性前提：只有稳定系统（h 绝对可积/绝对可和）上述结论才成立，否则输出可能不平稳"
            ],
            links: [
              { to: "signals-ch5-spectrum", why: "结论的频域形式直接来自功率谱定义" },
              { to: "signals-ch5-lti-discrete", why: "离散系统有完全平行的结论" }
            ],
            formula: "S_y(\\omega)=|H(j\\omega)|^2S_x(\\omega),\\qquad S_{xy}(\\omega)=H^*(j\\omega)S_x(\\omega)",
            variables: [
              "H(jω)：系统频率响应；H(0) 为直流增益",
              "S_x、S_y：输入与输出的功率谱密度",
              "S_xy：输入输出互功率谱（按本站互相关定义带 H 的共轭）",
              "E{|y|²}=(1/2π)∫|H|²S_x dω：输出平均功率"
            ]
          },
          {
            id: "signals-ch5-lti-discrete",
            group: "第二节 随机信号通过线性系统的分析",
            title: "平稳随机信号通过离散系统",
            importance: "core",
            sourceStatus: "verified_local",
            content: "离散情形与连续情形逐条对应：输出均值乘直流增益 H(1)、功率谱乘 |H(e^{jω})|²、相关函数与冲激响应做卷积。差别主要在记号：离散谱以 2π 为周期、通常只画 0≤ω≤π（利用偶对称），但求功率的积分仍要覆盖一个 2π 周期；另外“白噪声”指样本间不相关（各样本独立同分布时更强）。这一节同时给出手算输出方差的简便公式。",
            detail: [
              "核心结论：S_y(e^{jω})=|H(e^{jω})|²S_x(e^{jω})；若输入是方差 σ_x² 的白噪声，则 S_x 为常数 σ_x²，于是输出方差 R_y(0)=(σ_x²/2π)∫|H(e^{jω})|²dω=σ_x²Σ_k|h[k]|²。最后这个式子最好用：白噪声通过任何 FIR 滤波器，输出方差等于输入方差乘以系数平方和。算例：方差 9 的白噪声通过三点移动平均 b=[1/3,1/3,1/3]，Σb²=3×(1/3)²=1/3，输出方差 9×1/3=3（数值验证 3.0053）；通过 5 点移动平均则 Σb²=1/5，输出方差降到 1.8。",
              "离散情形还有一条实用性质：白噪声经线性系统后，输出的自相关函数等于 h 与其自身的（确定性）自相关卷积再乘 σ_x²。因此只要测出输出的相关函数，就能反推系统的冲激响应——这是相关法辨识系统的基础，也解释了为什么伪随机序列（PRBS）激励在工程辨识中这么常见：它接近白噪声，但可以精确复现。"
            ],
            points: [
              "S_y(e^{jω})=|H(e^{jω})|²S_x(e^{jω})；输出均值乘 H(1)",
              "白噪声输入时输出方差 = σ_x²·Σ|h[k]|²（用系数平方和直接算）",
              "算例：σ²=9 经 3 点移动平均 → 方差 3；经 5 点移动平均 → 方差 1.8",
              "输出相关函数 = σ_x²·(h*h_rev)，可用于由相关函数反推冲激响应（相关法辨识）"
            ],
            pitfalls: [
              "把“白噪声”当成“高斯噪声”：白噪声只要求样本间不相关，不必服从高斯分布",
              "用连续公式算离散方差：离散要用 Σ|h[k]|²（系数平方和），不是积分"
            ],
            links: [
              { to: "signals-ch5-lti-continuous", why: "两节的结论逐条对应，可并排记忆" },
              { to: "signals-ch4-digital-overview", why: "数字滤波器对随机输入的输出统计是本章的直接应用" }
            ],
            formula: "\\sigma_y^2=\\sigma_x^2\\sum_{k}|h[k]|^2",
            variables: [
              "σ_x²：输入白噪声方差",
              "h[k]：离散系统冲激响应（FIR 时即系数 b_k）",
              "3 点移动平均：Σh²=1/3 ⇒ σ_y²=3（σ_x²=9）",
              "5 点移动平均：Σh²=1/5 ⇒ σ_y²=1.8"
            ]
          },
          {
            id: "signals-ch5-transient",
            group: "第二节 随机信号通过线性系统的分析",
            title: "过渡过程分析",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "前一节的结论都以“输出已经平稳”为前提。若系统在 t=0 之前没有输入（或初始状态非零），输出在起始阶段并不平稳：均值和方差都是时间的函数，需要经过一段时间才趋于稳态。工程上关心的正是这段过渡有多长、暂态会把方差放大到多少。",
            detail: [
              "为什么会有过渡：随机信号的激励从某一时刻开始，输出是输入与 h 的卷积，而 h 的“记忆”需要时间才展开。以离散情形为例，若输入白噪声在 n≥0 才加入，则 y[n]=Σ_{k=0}^{n}h[k]x[n−k]，求和上限随时间增长；输出方差 σ_y²[n]=σ_x²Σ_{k=0}^{n}h²[k] 单调增加到平稳值 σ_x²Σ_{k=0}^{∞}h²[k]。也就是说，过渡过程的长短由 h 的能量累积速度决定。",
              "工程含义有两条。其一，做仿真或测量时必须丢掉起始的一段（“预热”样本），否则算出的方差系统性偏小——本章实验里“舍去起始暂态样本”就是这个原因。其二，若系统本身是窄带（h 衰减慢），过渡可能长达成百上千个样点，此时用时间平均估计统计量的方差会很大，必须靠加长记录或多段平均来压制。对连续系统同理，时间常数越大，过渡越长。"
            ],
            points: [
              "过渡期的输出不是平稳过程：均值与方差都是时间的函数",
              "离散白噪声输入：σ_y²[n]=σ_x²Σ_{k=0}^{n}h²[k]，单调升到平稳值",
              "过渡长短由 h 的能量累积速度（即系统带宽/时间常数）决定",
              "测量与仿真必须丢弃预热样本，否则方差系统性偏小"
            ],
            pitfalls: [
              "用包含起始暂态的样本估计方差：结果偏小，且偏差随记录长度变化",
              "以为窄带系统“很快”进入平稳：h 衰减慢意味着过渡很长"
            ],
            links: [
              { to: "signals-ch5-lti-discrete", why: "稳态结论是本节 n→∞ 的极限" },
              { to: "signals-ch5-matlab-lti", why: "MATLAB 小节把这个过程画出来并核对" }
            ]
          },
          {
            id: "signals-ch5-wiener",
            group: "第三节 最优线性滤波",
            title: "维纳滤波",
            importance: "core",
            sourceStatus: "verified_local",
            content: "维纳滤波回答的问题是：已知期望信号与实际观测的（二阶）统计量，如何设计一个线性滤波器，使估计的均方误差最小。解的形式很简洁——最优频率响应等于互功率谱除以输入功率谱，但它的前提（平稳、统计量已知）也必须在结论里一并说明。",
            detail: [
              "问题设定：观测 x(t)=s(t)+n(t)，希望用 x 的线性滤波 ŝ(t)=h(t)*x(t) 去逼近 s(t)，准则是最小均方误差 E{(s−ŝ)²}。正交性原理（误差与观测正交）给出维纳—霍夫方程 R_x(τ)*h(τ)=R_xs(−τ)，变换到频域即 H_opt(jω)=S_xs*(jω)/S_x(ω)——共轭同样来自本站的互相关定义 R_xs(τ)=E{x(t)s*(t−τ)}；若把互谱定义成 E{s(t)x*(t−τ)} 的变换，共轭就消失。若信号与噪声不相关，则 S_xs=R_s 的变换（实数）、S_x=S_s+S_n，于是 H_opt=S_s/(S_s+S_n)——这就是最常引用的形式：在信号功率占优的频段给高增益，在噪声占优的频段压低增益，形状由两者的功率比自动决定。",
              "边界必须写清楚。第一，它要求信号与噪声都是宽平稳的，并且已知（或能估计出）各自的功率谱——实际中统计量本身要估计，估计误差会直接进入 H_opt。第二，它是“线性”最优，非线性估计可能更好。第三，它给出的是稳态解，不处理启动阶段；而且若 H_opt 非因果（要求用到未来数据），实际实现需要引入延迟或改用因果维纳解。这些限制正是卡尔曼滤波与自适应滤波出现的动因。"
            ],
            points: [
              "准则：最小均方误差 E{(s−ŝ)²}，解由正交性原理（维纳—霍夫方程）给出",
              "频域解 H_opt(jω)=S_xs*(jω)/S_x(ω)（按本站互相关定义带共轭）；信号噪声不相关时退化为实数形式 H_opt=S_s/(S_s+S_n)",
              "直观含义：按各频段的信噪功率比分配增益",
              "前提：宽平稳 + 已知二阶统计量 + 线性最优 + 稳态解（非因果时需延迟或改因果解）"
            ],
            pitfalls: [
              "把 H_opt=S_s/(S_s+S_n) 当成通用公式：它要求信号与噪声不相关，否则要用互谱 S_xs",
              "忽略统计量需要估计：实际系统的 S_s、S_n 有误差，最优性只在模型意义下成立"
            ],
            links: [
              { to: "signals-ch5-spectrum", why: "维纳解的每一个量都是功率谱" },
              { to: "signals-ch5-kalman", why: "卡尔曼滤波用状态空间模型替代平稳假设" }
            ],
            formula: "H_{opt}(j\\omega)=\\frac{S_{xs}^*(\\omega)}{S_x(\\omega)}=\\frac{S_s}{S_s+S_n}",
            variables: [
              "S_xs：观测与期望信号的互功率谱（按本站互相关定义，公式中取其共轭）",
              "S_x：观测的功率谱；S_s、S_n：信号与噪声的功率谱",
              "不相关时 S_xs 为实，H_opt 退化为 S_s/(S_s+S_n)",
              "准则：最小均方误差（线性、稳态）"
            ]
          },
          {
            id: "signals-ch5-kalman",
            group: "第三节 最优线性滤波",
            title: "卡尔曼滤波",
            importance: "core",
            sourceStatus: "verified_local",
            content: "卡尔曼滤波把待估对象写成状态空间模型，按“预测—校正”两步递推：先用模型把状态与协方差推到下一时刻，再用新观测按增益修正。它不要求信号平稳，也不需要一次性知道全部统计量，只要噪声的协方差已知，因此特别适合动态系统与实时处理。",
            detail: [
              "递推结构（离散线性模型 x_k=Ax_{k−1}+w_{k−1}，z_k=Hx_k+v_k）：预测步 x̂_k⁻=Ax̂_{k−1}、P_k⁻=AP_{k−1}Aᵀ+Q；校正步 K_k=P_k⁻Hᵀ(HP_k⁻Hᵀ+R)⁻¹、x̂_k=x̂_k⁻+K_k(z_k−Hx̂_k⁻)、P_k=(I−K_kH)P_k⁻。关键在于增益 K 由协方差自动算出：观测噪声 R 大则 K 小（更信模型），模型噪声 Q 大则 K 大（更信观测）。这也是它相对固定系数的维纳滤波最本质的差别——增益随时间自适应。",
              "它要成立也需要前提：模型线性、噪声为白噪声且协方差 Q、R 已知、初始状态统计量已知。现实中 Q 与 R 往往靠经验设定，设小了滤波器迟钝、设大了输出抖动，这是工程调试的主要内容。对非线性模型，可用扩展卡尔曼（EKF，局部线性化）或无迹卡尔曼（UKF，sigma 点传播），但此时最优性不再严格成立。"
            ],
            points: [
              "模型：x_k=Ax_{k−1}+w、z_k=Hx_k+v；噪声协方差 Q、R 已知",
              "递推两步：预测（x̂⁻=Ax̂、P⁻=APAᵀ+Q）→ 校正（K=P⁻Hᵀ(HP⁻Hᵀ+R)⁻¹，x̂=x̂⁻+K(z−Hx̂⁻)）",
              "增益由协方差自动决定：R 大更信模型，Q 大更信观测",
              "不要求平稳、可实时递推；EKF/UKF 处理非线性但失去严格最优性"
            ],
            pitfalls: [
              "把 Q、R 当成可以随便取的常数：它们直接决定增益与收敛速度，取值需与真实噪声匹配",
              "对强非线性系统直接套线性卡尔曼：应改用 EKF/UKF，并预期最优性不再严格"
            ],
            links: [
              { to: "signals-ch5-wiener", why: "两者都是最小均方意义下的线性估计，差别在模型与前提" },
              { to: "signals-ch5-adaptive", why: "自适应滤波在连统计量都不知道时在线学习" }
            ],
            formula: "K_k=P_k^-H^{T}(HP_k^-H^{T}+R)^{-1}",
            variables: [
              "x_k：状态向量；z_k：观测向量",
              "A：状态转移矩阵；H：观测矩阵",
              "Q、R：过程噪声与观测噪声协方差",
              "K_k：卡尔曼增益；P_k：状态估计误差协方差"
            ]
          },
          {
            id: "signals-ch5-adaptive",
            group: "第三节 最优线性滤波",
            title: "自适应滤波",
            importance: "core",
            sourceStatus: "verified_local",
            content: "维纳滤波要知道统计量，卡尔曼滤波要知道模型与噪声协方差；当这些都不知道、或者系统随时间变化时，就需要自适应滤波：用当前样本的误差在线调整滤波器系数，让性能逐步逼近最优。LMS 是最简单也最常用的算法。",
            detail: [
              "LMS（最小均方）算法：w[n+1]=w[n]+μ·e[n]·x[n]，其中 e[n]=d[n]−wᵀ[n]x[n] 是瞬时误差，μ 是步长。它的做法是用瞬时误差平方的梯度替代真实均方误差的梯度（后者需要统计期望）。收敛的充分条件是 0<μ<2/(N·P_x)（P_x 为输入功率，N 为抽头数）：μ 太小收敛慢，太大则不收敛或稳态失调变大——步长是自适应滤波里最关键的参数。数值验证：两抽头、输入方差 9、目标系数 [0.8, −0.5]、μ=0.01 时，运行 20 万点后权向量收敛到 [0.796, −0.489]，与目标一致。",
              "与前面两种滤波的关系可以这样排：维纳滤波是“统计量已知时的最优解”，LMS 是“用数据逐步逼近这个解”，卡尔曼滤波则是“有了动态模型时的最优递推解”。三种方法的选择取决于你手上有多少先验信息：有完整统计量用维纳；有动态模型用卡尔曼；都没有就用自适应，并接受收敛时间与稳态失调的折中。RLS（递归最小二乘）用矩阵求逆引理加速收敛，代价是运算量从 O(M) 升到 O(M²)。"
            ],
            points: [
              "LMS 更新式：w[n+1]=w[n]+μ·e[n]·x[n]，e[n]=d[n]−wᵀ[n]x[n]",
              "步长约束 0<μ<2/((M+1)P_x)：太小收敛慢，太大稳态失调大",
              "验证：两抽头、目标 [0.8,−0.5]、μ=0.01、期望信号含方差 0.1 的噪声 → 收敛到 [0.796,−0.489]",
              "三者定位：维纳（统计量已知）→ 自适应（在线学习）→ 卡尔曼（有动态模型）"
            ],
            pitfalls: [
              "把步长调得越大越好：超过约束会让权向量发散，而不是“收敛更快”",
              "用自适应滤波处理快速时变系统而不检查跟踪能力：跟踪速度与稳态失调是一对矛盾"
            ],
            links: [
              { to: "signals-ch5-wiener", why: "LMS 收敛后的均值就是维纳解" },
              { to: "signals-ch5-kalman", why: "有动态模型时卡尔曼通常优于自适应方案" }
            ],
            formula: "w[n+1]=w[n]+\\mu\\,e[n]\\,x[n]",
            variables: [
              "w[n]：第 n 步的滤波器权向量",
              "e[n]=d[n]−wᵀ[n]x[n]：瞬时误差",
              "μ：步长，满足 0<μ<2/((M+1)P_x)",
              "验证：目标 [0.8,−0.5]、含噪期望信号 → 收敛 [0.796,−0.489]"
            ]
          },
          {
            id: "signals-ch5-timefreq",
            group: "第四节 非平稳随机信号的分析",
            title: "时-频域分析",
            importance: "core",
            sourceStatus: "verified_local",
            content: "非平稳信号的频率成分随时间变化，单一功率谱（把整段记录平均）会把这种变化抹平。时频分析的做法是把信号在时间上分段（加窗）再逐段看频谱，用一张“时间—频率”平面描述能量分布。短时傅里叶变换（STFT）是最直接的形式。",
            detail: [
              "STFT 的定义是 X(t,ω)=∫x(τ)w(τ−t)e^{−jωτ}dτ：用窗函数 w 在 t 附近截取一段做傅里叶变换，滑动窗口得到二维分布。它的分辨率受不确定性原理约束：窗越短时间分辨率越高、频率分辨率越低，反之亦然；两者乘积有下界，因此不存在“同时在时间和频率上都任意精确”的分布。工程上取窗长等于希望分辨的最短事件长度，或者让窗长跟随信号变化（自适应窗）。",
              "常用派生方法有三种。谱图（spectrogram）是 |STFT|²，最简单但受窗影响大；维格纳—维莱分布用信号与其共轭的乘积做变换，时频聚集性最好，但对多分量信号会出现交叉项（虚假成分）；科恩类分布通过核函数在聚集性与交叉项之间折中。选择哪一种，取决于信号是单分量还是多分量、是否需要辨别瞬态。本节的目标是能读懂时频图并说明分辨率的来源，不展开核函数设计。"
            ],
            points: [
              "STFT：X(t,ω)=∫x(τ)w(τ−t)e^{−jωτ}dτ，把信号分段加窗后逐段看频谱",
              "分辨率受不确定性原理约束：时间分辨率与频率分辨率不能同时任意高",
              "谱图 = |STFT|²；维格纳—维莱分布聚集性好但有交叉项；科恩类用核函数折中",
              "窗长选择是关键：取希望分辨的最短事件长度，或让窗长自适应"
            ],
            pitfalls: [
              "指望时频图同时给出精确的时间与频率位置：二者受不确定性原理约束，只能折中",
              "把维格纳分布的交叉项当成真实分量：多分量信号下它会出现虚假项，需用核函数抑制"
            ],
            links: [
              { to: "signals-ch5-spectrum", why: "时频分析是功率谱在非平稳情形下的推广" },
              { to: "signals-ch5-wavelet", why: "小波变换用可变尺度替代固定窗长" }
            ],
            formula: "X(t,\\omega)=\\int x(\\tau)w(\\tau-t)e^{-j\\omega\\tau}d\\tau",
            variables: [
              "w：窗函数，决定时间与频率分辨率的折中",
              "X(t,ω)：短时傅里叶变换（二维）",
              "谱图 = |X(t,ω)|²",
              "维格纳—维莱：聚集性好，多分量时有交叉项"
            ]
          },
          {
            id: "signals-ch5-wavelet",
            group: "第四节 非平稳随机信号的分析",
            title: "小波变换分析",
            importance: "core",
            sourceStatus: "verified_local",
            content: "STFT 用一个固定窗长，遇到“低频成分很长、高频成分很短”的信号就不够用。小波变换把固定窗换成可缩放的母小波：低频用长窗（频率分辨率高）、高频用短窗（时间分辨率高），自动实现“高频看细节、低频看趋势”。",
            detail: [
              "连续小波变换的定义是 W(a,b)=(1/√|a|)∫x(t)ψ*((t−b)/a)dt，其中 ψ 是母小波，a 是尺度（与频率成反比），b 是平移。与 STFT 的区别在于：STFT 的基函数频率不同但时宽相同（等带宽），小波的基函数带宽与中心频率成正比（等 Q）——这正是它对非平稳信号更合适的原因。常用母小波有 Morlet、Daubechies、Meyer 等，选择依据是信号的形态与所需的正则性。",
              "离散小波变换（DWT）在 a=2^j、b=k·2^j 的网格上取样，可用滤波器组高效实现：每层把信号分成低通近似与高通细节，再对近似下采样继续分解，形成多分辨率分析。它的优点是变换后系数几乎不相关、能量集中，因而广泛用于去噪（对小系数做阈值收缩）与压缩。边界要写清楚：小波不是“更高级的傅里叶”，它是另一种基——对持续存在的平稳正弦，傅里叶更紧凑；对瞬态与突变，小波更紧凑。"
            ],
            points: [
              "CWT：W(a,b)=(1/√|a|)∫x(t)ψ*((t−b)/a)dt，尺度 a 与频率成反比",
              "与 STFT 的差别：STFT 等带宽，小波等 Q（带宽随中心频率变化）",
              "DWT 在二进网格上取样，用滤波器组实现多分辨率分析（近似+细节，逐层下采样）",
              "小波不是傅里叶的替代：瞬态用小波紧凑，平稳正弦用傅里叶紧凑"
            ],
            pitfalls: [
              "把尺度 a 直接当频率：a 与频率成反比，且需要按母小波的中心频率换算",
              "不加区分地宣称小波总比傅里叶好：两者的紧致性取决于信号是平稳还是瞬态"
            ],
            links: [
              { to: "signals-ch5-timefreq", why: "小波是固定窗长局限的解决方案" },
              { to: "signals-ch5-hht", why: "希尔伯特-黄用数据自适应的基函数，思路更进一步" }
            ],
            formula: "W(a,b)=\\frac{1}{\\sqrt{|a|}}\\int x(t)\\psi^*\\!\\left(\\frac{t-b}{a}\\right)dt",
            variables: [
              "ψ：母小波；a：尺度（与频率成反比）；b：平移",
              "等 Q：小波基的带宽与中心频率成正比",
              "DWT：a=2^j、b=k·2^j 的二进网格，用滤波器组实现",
              "应用：去噪（系数阈值收缩）与压缩"
            ]
          },
          {
            id: "signals-ch5-hht",
            group: "第四节 非平稳随机信号的分析",
            title: "希尔伯特-黄变换分析",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "小波的基函数仍然是事先选定的；希尔伯特-黄变换（HHT）换了个思路——让基函数从数据本身来。它先用经验模态分解（EMD）把信号拆成若干个本征模态函数（IMF），再对每个 IMF 做希尔伯特变换求瞬时频率与瞬时幅度，得到随时间变化的时频分布。",
            detail: [
              "EMD 的过程是迭代筛分：找出信号的局部极大与极小点，用三次样条连成上、下包络，取均值并从原信号中减去，重复到剩余部分满足 IMF 条件（极值点数与过零点数相差不超过一个、且上下包络均值为零）。第一个 IMF 提取完成后，把它从信号中减去，对剩余部分重复，直到余项为单调或足够小。这样得到的 IMF 是按时间尺度从细到粗排布的，等价于自适应地选出了一组基。",
              "HHT 的优势是时频聚集性好、无需先选基；代价同样明确：EMD 没有严格的数学定义与收敛证明，端点效应会使两端出现虚假分量，模态混叠（一个 IMF 里含有尺度差异很大的成分）需要 EEMD、CEEMDAN 等改进方法来缓解，而且结果对噪声与停止准则敏感。因此它的定位是“数据驱动的探索性工具”，结论应当用其他方法交叉验证，而不是当成唯一的定量依据。"
            ],
            points: [
              "HHT = EMD（数据自适应分解）+ 希尔伯特变换（求瞬时频率与幅度）",
              "EMD 用极值包络均值迭代筛分，得到按尺度从细到粗排列的 IMF",
              "优势：基函数来自数据本身，无需预先选择；时频聚集性好",
              "代价：无严格数学证明、端点效应、模态混叠，结果对噪声与参数敏感"
            ],
            pitfalls: [
              "把 IMF 当成物理上真实存在的分量：它只是筛分算法的产物，可能与实际源不对应",
              "忽略端点效应与模态混叠就下结论：需用改进算法并与其他方法交叉验证"
            ],
            links: [
              { to: "signals-ch5-wavelet", why: "HHT 与小波是自适应基与固定基两条路线的对照" },
              { to: "signals-ch5-matlab-hht", why: "MATLAB 小节给出可执行的分解与验证步骤" }
            ]
          },
          {
            id: "signals-ch5-matlab-description",
            group: "第五节 应用MATLAB的随机信号分析、处理",
            title: "随机信号的描述",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "第五节按教材顺序给七个可执行小节，每个都遵循“命令要点 + 可验证数值结论 + 与解析式对照”。第一小节解决最基础的问题：怎么在 MATLAB 里生成可复现的随机信号，并正确地估计它的数字特征。",
            detail: [
              "命令要点：rng(0) 固定种子保证可复现；randn(M,N) 生成标准正态样本，乘 σ 得到所需方差；mean/var 估计均值与方差（注意 var 默认除以 N−1 是无偏估计，与理论定义除以 N 略有差别，样本量大时差异可忽略）；xcorr(x,'biased') 给出有偏自相关估计（除以 N），'unbiased' 除以 N−|k|。生成后先画直方图或做正态性检验，确认样本分布符合假设。",
              "验证点：σ=3、N=2×10⁵ 时，样本均值应落在 0 附近、样本方差应落在 9 附近，但都不会正好等于理论值——这是有限样本的统计波动，不是代码错误。量级可以预先算出来：均值估计的标准差约 σ/√N≈0.0067，因此均值通常落在 ±0.02（约 3σ）内；方差估计的相对标准差约 √(2/N)≈0.32%，对应绝对偏差约 ±0.09。若实测偏差明显超过这个范围，先怀疑随机数发生器的质量（简单线性同余发生器在 2×10⁵ 样本上就可能让方差偏高百分之一点几（本次复算实测偏高 1.7%）），而不是先怀疑公式。教学结论：报统计量时必须同时给出样本量与置信范围。"
            ],
            points: [
              "rng 固定种子保证可复现；randn 生成正态样本，乘 σ 设方差",
              "var 默认无偏（除以 N−1）；xcorr 的 'biased'/'unbiased' 决定是否除以 N",
              "验证点：σ=3、N=2×10⁵ → 均值标准差 ≈σ/√N≈0.0067、方差相对标准差 ≈√(2/N)≈0.32%，实测偏差应落在这个量级内",
              "有限样本必然有波动：均值标准差 ≈σ/√N，方差相对标准差 ≈√(2/N)，报数要带样本量"
            ],
            pitfalls: [
              "不固定随机种子就对比两组统计量：差异里混入了随机性，无法判断结论",
              "把样本统计量当理论值：样本量不足时偏差可能远超直觉"
            ],
            links: [
              { to: "signals-ch5-description", why: "本节估计的就是那一节的均值和方差" },
              { to: "signals-ch5-matlab-spectrum", why: "下一步用同样的样本做谱估计" }
            ]
          },
          {
            id: "signals-ch5-matlab-spectrum",
            group: "第五节 应用MATLAB的随机信号分析、处理",
            title: "随机信号的频谱分析",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "谱估计是本章最容易出错的一步：随机信号的频谱必须用平均来估计，单次 FFT 得到的是周期图，方差极大。这一节给出可直接执行的分段平均（Welch）流程，并用白噪声这一已知答案做对照。",
            detail: [
              "命令要点：pwelch(x,window,noverlap,nfft,fs) 是分段平均的标准入口；periodogram(x) 给单段周期图用于对比；cpsd 估计互功率谱，mscohere 给相干函数。读图时横轴单位要统一（pwelch 默认 rad/sample，给 fs 后为 Hz），纵轴是功率谱密度，比较不同窗长下的曲线能直接看到“方差换偏差”的效果。",
              "验证点：对白噪声，单段周期图的曲线会在真值附近剧烈起伏（起伏幅度不随记录长度减小），而分段平均后的曲线明显平滑并收敛到平坦的 σ²；把信号换成白噪声通过 3 点移动平均滤波器的输出，估计出的谱形状应等于 |sin(3ω/2)/(3sin(ω/2))|²×σ²，在 ω=0.5/1.0/1.5/2.0 处实测比值 0.846/0.488/0.158/0.003 与理论 0.843/0.481/0.145/0.003 逐点吻合。"
            ],
            points: [
              "pwelch 分段平均；periodogram 单段周期图；cpsd/mscohere 用于互谱与相干",
              "单段周期图方差大且不随记录长度减小，分段平均用偏差换方差",
              "验证点：白噪声经 3 点移动平均 → 输出谱形状 = |H|²·σ²",
              "实测比值 0.846/0.488/0.158/0.003 与理论 0.843/0.481/0.145/0.003 吻合"
            ],
            pitfalls: [
              "用单次 FFT 的幅度平方当功率谱：那是周期图，方差极大且不收敛",
              "忽略横轴单位：pwelch 默认 rad/sample，与 Hz 相差 2π 因子"
            ],
            links: [
              { to: "signals-ch5-spectrum", why: "本节的验证对象就是功率谱密度的定义" },
              { to: "signals-ch5-matlab-lti", why: "下一步把同一方法用到系统输出上" }
            ]
          },
          {
            id: "signals-ch5-matlab-lti",
            group: "第五节 应用MATLAB的随机信号分析、处理",
            title: "随机信号通过线性系统分析",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "这一节把第二节的稳态结论做一次完整复算：白噪声 → 线性系统 → 输出，分别用“谱相乘”和“时域仿真”两条独立路径得到输出统计量，并顺带观察过渡过程。",
            detail: [
              "命令要点：filter(b,1,x) 得到输出；pwelch 分别估计输入输出谱，比较 S_y./S_x 与 freqz(b,1,w) 的 |H|²；用 xcorr 估计输出自相关并与理论式对照；画 σ_y²[n]=σ_x²Σ_{k≤n}h²[k] 的累积曲线观察过渡过程何时结束。",
              "验证点（三条互相对照）：其一，输出方差用系数平方和直接算得 σ_x²Σb²——σ²=9 经 3 点移动平均得 3（仿真 3.0053），经 5 点移动平均得 1.8；其二，输出谱与输入谱之比应等于 |H|²，实测在四个频点上与理论吻合（见上一小节数据）；其三，输出均值应等于输入均值乘 H(1)=1（移动平均的直流增益为 1），因此均值不变。三条一致才说明“谱相乘”这套结论在你的数据和参数下真的成立。"
            ],
            points: [
              "路径一：filter 时域仿真得输出方差；路径二：pwelch 估谱后与 |H|² 比较",
              "白噪声输出方差 = σ_x²Σ|h|²：3 点平均 → 3（仿真 3.0053），5 点平均 → 1.8",
              "移动平均直流增益 H(1)=1，因此输出均值不变",
              "过渡过程用 σ_y²[n]=σ_x²Σ_{k≤n}h²[k] 的累积曲线观察"
            ],
            pitfalls: [
              "只做一条路径就下结论：时域仿真与频域谱相乘应当互相印证",
              "忘记丢弃预热样本：过渡期内方差尚未达到稳态值"
            ],
            links: [
              { to: "signals-ch5-lti-discrete", why: "本节的验证对象就是那一节的方差公式" },
              { to: "signals-ch5-transient", why: "过渡过程曲线对应那一节的分析" }
            ]
          },
          {
            id: "signals-ch5-matlab-kalman",
            group: "第五节 应用MATLAB的随机信号分析、处理",
            title: "利用MATLAB的卡尔曼滤波",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "MATLAB 提供两种用法：Control System Toolbox 的 kalman 函数给出稳态增益，或自己写十几行递推实现完整卡尔曼滤波。这一节给出自主实现，因为只有自己写一遍，预测—校正两步与 Q、R 的作用才看得清楚。",
            detail: [
              "命令要点：核心就是五行——预测 x̂⁻=A*x̂、P⁻=A*P*A'+Q；算增益 K=P⁻*H'/(H*P⁻*H'+R)；校正 x̂=x̂⁻+K*(z−H*x̂⁻)、P=(I−K*H)*P⁻。用 randn 生成过程噪声与观测噪声（按 sqrt(Q)、sqrt(R) 缩放），把估计误差与真值一起画出来。",
              "验证点：取一维常值状态（A=1、H=1）、Q=1e−4、R=1，观测噪声标准差为 1 时，卡尔曼输出的方差应显著小于原始观测的方差（理论上稳态增益 K≈0.0099，输出方差约为输入的 1%），且随 R 减小而更贴近观测、随 Q 增大而更贴近模型。把 Q 设得比真实过程噪声小一个数量级，会观察到滤波器跟不上真实变化（滞后）——这正是“Q 设小了迟钝、设大了抖动”的实证。"
            ],
            points: [
              "自写递推五行：预测（x̂⁻、P⁻）→ 增益 K → 校正（x̂、P）",
              "randn 按 sqrt(Q)、sqrt(R) 缩放生成噪声",
              "验证点：A=H=1、Q=1e−4、R=1 → 输出方差约为观测方差的 1%",
              "Q 偏小导致滞后、偏大导致抖动，需与真实噪声量级匹配"
            ],
            pitfalls: [
              "把 Q、R 当成“越大越好”的调参旋钮：它们代表真实噪声协方差，量级错了滤波就失去意义",
              "只画估计曲线不画误差：判断滤波效果要看误差的统计量，而不是曲线“看起来平滑”"
            ],
            links: [
              { to: "signals-ch5-kalman", why: "本节的每一步都对应那一节的递推式" },
              { to: "signals-ch5-matlab-wavelet", why: "下一节换到时频域处理非平稳信号" }
            ]
          },
          {
            id: "signals-ch5-matlab-wavelet",
            group: "第五节 应用MATLAB的随机信号分析、处理",
            title: "利用MATLAB的小波分析",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "小波工具箱提供 cwt、dwt、wavedec 与 wdenoise 等函数。这一节用“带突变的信号 + 去噪”这个典型任务把连续与离散两条路都走一遍，并强调小波去噪的本质是阈值收缩而非简单滤波。",
            detail: [
              "命令要点：新版 cwt(x,fs) 在给定采样率时直接以 Hz 为频率轴（换算在函数内部完成，可用 FrequencyLimits、VoicesPerOctave 控制）；只有旧接口 cwt(x,scales,'wname') 或 scal2frq 才需要自己按母小波中心频率把尺度换算成频率。wavedec(x,3,'db4') 做三层分解，appcoef/detcoef 取近似与细节系数；wdenoise(x) 一键去噪，或手动用 wthresh(c,'s') 对细节系数做软阈值。对比重构前后的波形，检查突变是否被保留。",
              "验证点：构造一个“低频正弦 + 阶跃突变 + 白噪声”的信号，用 wdenoise 处理后计算信噪比改善；同时用同样长度的 FIR 低通滤波做对照，观察滤波器会把阶跃沿变抹圆（因为它是线性时不变、对所有位置一视同仁），而小波阈值去噪能保留突变位置。这个对照说明小波的优势在于“按尺度区分”，而不是“频率选择性更好”。"
            ],
            points: [
              "cwt 画尺度图（注意尺度→频率的换算）；wavedec/appcoef/detcoef 做多分辨率分解",
              "wdenoise 或对细节系数做软阈值收缩完成去噪",
              "验证点：含阶跃的含噪信号，小波去噪保留突变位置，线性低通会把阶跃抹圆",
              "小波的优势在“按尺度区分”而非单纯频率选择性"
            ],
            pitfalls: [
              "把 cwt 的尺度轴直接当频率读：需要按母小波中心频率换算",
              "用线性低通代替小波去噪后声称“效果一样”：突变位置的保真度是二者的关键差别"
            ],
            links: [
              { to: "signals-ch5-wavelet", why: "本节的每个函数对应那一节的一个概念" },
              { to: "signals-ch5-matlab-wigner", why: "下一节给出另一类时频分布" }
            ]
          },
          {
            id: "signals-ch5-matlab-wigner",
            group: "第五节 应用MATLAB的随机信号分析、处理",
            title: "利用MATLAB进行维格纳变换",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "维格纳—维莱分布是聚集性最好的二次型时频分布，代价是多分量信号会出现交叉项。这一节用单分量与双分量两个例子把这个取舍演示出来。",
            detail: [
              "命令要点：MATLAB 的 wvd 提供维格纳—维莱分布与平滑伪 WVD（MathWorks 帮助文档中该函数分别列在小波工具箱与信号处理工具箱的参考页下，版本不同位置可能不同，用前先确认本机 toolbox 路径）；也可按定义自行实现——先取解析信号（hilbert），再对每个时刻计算 x(t+τ/2)x*(t−τ/2) 关于 τ 的傅里叶变换，这样能看清它的二次型结构与交叉项从何而来。单分量时取线性调频（chirp）信号，双分量时把两个不同起止时刻的 chirp 相加。",
              "验证点：单分量 chirp 的维格纳分布应表现为一条清晰的直线（瞬时频率随时间线性变化），且在时频平面上比同参数的谱图更集中；双分量叠加时，在两个分量之间会出现明显的振荡项——它不是任何真实分量，而是交叉项。若把相同的信号交给谱图，交叉项不出现但两条脊线明显变粗。这就是“聚集性 vs 交叉项”的实证对照。"
            ],
            points: [
              "维格纳—维莱分布是二次型分布，单分量聚集性最好",
              "验证点：单分量 chirp 呈清晰直线脊，优于同参数谱图",
              "双分量时出现交叉项（振荡的虚假成分），谱图无交叉项但脊线更粗",
              "取舍：需要高聚集性且分量少时用维格纳，多分量时倾向谱图或加核函数"
            ],
            pitfalls: [
              "把交叉项当成真实分量：它在两个真实分量之间振荡，位置与频率都不对应真实信号",
              "对不同长度的信号直接比较分布图：坐标与归一化方式要先统一"
            ],
            links: [
              { to: "signals-ch5-timefreq", why: "交叉项是那一节提到的核函数设计的动因" },
              { to: "signals-ch5-matlab-hht", why: "下一节给出第三种时频路线" }
            ]
          },
          {
            id: "signals-ch5-matlab-hht",
            group: "第五节 应用MATLAB的随机信号分析、处理",
            title: "利用MATLAB进行希尔伯特-黄变换",
            importance: "optional",
            sourceStatus: "verified_local",
            content: "最后一节把 HHT 走通：用 emd 做经验模态分解，用 hilbert 求每个 IMF 的瞬时频率与包络，画希尔伯特谱。重点在于把 EMD 的不确定性显式检查出来，而不是只看一张漂亮的时频图。",
            detail: [
              "命令要点：imf=emd(x) 得到各阶 IMF；[hs,f,t]=hht(imf,fs) 直接给出希尔伯特谱；对每个 IMF 用 hilbert 求解析信号后取相位差分得瞬时频率。分解前建议先做端点延拓或镜像处理以减轻端点效应，分解后用 imf 的正交性指标（各 IMF 两两乘积之和相对于原信号能量的比例）检查分解质量。",
              "验证点：对一个“两段不同频率拼接”的合成信号，EMD 应把两段分别体现在不同 IMF 或同一 IMF 的不同时间段上，希尔伯特谱能清楚显示频率切换的时刻——这是固定基（傅里叶）做不到的。同时要记录并报告：改变停止准则或加不同强度的噪声，IMF 的个数与形态会变化（模态混叠），因此结论必须与其他方法（如 STFT）交叉验证后再下。"
            ],
            points: [
              "emd 做分解、hht 直接给希尔伯特谱、hilbert 求瞬时频率",
              "验证点：两段不同频率的拼接信号，希尔伯特谱能显示频率切换时刻",
              "必须检查端点效应与模态混叠（改变停止准则/噪声会改变 IMF 个数与形态）",
              "结论要与 STFT 等方法交叉验证后再下"
            ],
            pitfalls: [
              "把 emd 的输出当成唯一分解：停止准则与噪声都会改变结果，需要做敏感性检查",
              "只看希尔伯特谱不看 IMF 本身：模态混叠往往在 IMF 波形上更早暴露"
            ],
            links: [
              { to: "signals-ch5-hht", why: "本节的函数与检查项都来自那一节" },
              { to: "signals-ch5-matlab-description", why: "全部随机信号小节的入口，可从头复习一遍流程" }
            ]
          }
        ],
        examples: [
          {
            title: "判断宽平稳并核对自洽性",
            prompt: "某过程均值恒为 0.5，自相关 R_x(t₁,t₂)=e^{−3|t₁−t₂|}。它是宽平稳的吗？平均功率与方差各是多少？",
            steps: [
              "宽平稳要求均值为常数——本例满足。",
              "自相关只依赖时间差 τ=t₁−t₂——本例满足，故是宽平稳的。",
              "平均功率 R_x(0)=e⁰=1；方差 σ²=R_x(0)−μ²=1−0.25=0.75（非负，自洽）。"
            ],
            answer: "宽平稳；平均功率 1、方差 0.75。顺手用 R_x(0)≥μ² 检查一组统计量是否自洽，是最快的一致性判据。"
          },
          {
            title: "由相关函数求方差",
            prompt: "零均值实过程的自相关 R_x(τ)=9e^{−2|τ|}cos(10τ)。求平均功率与方差。",
            steps: [
              "平均功率即 R_x(0)=9×1×1=9。",
              "零均值时方差等于平均功率，故 σ_x²=9。",
              "R_x 中的 cos(10τ) 说明过程含角频率 10 rad/s 的周期分量。"
            ],
            answer: "平均功率与方差都是 9；相关函数里的 cos 项对应过程的周期成分，可用它检测被噪声淹没的周期信号。"
          },
          {
            title: "由自相关求功率谱",
            prompt: "R_x(τ)=e^{−a|τ|}（a>0）。求 S_x(ω)，并用 R_x(0) 核对总功率。",
            steps: [
              "对 e^{−a|τ|} 做傅里叶变换得 S_x(ω)=2a/(a²+ω²)（洛伦兹型）。",
              "核对：R_x(0)=1；(1/2π)∫2a/(a²+ω²)dω=(1/2π)×2π=1，一致。",
              "频谱在 ω=0 处最大（2/a），随 ω 增大按 1/ω² 衰减——相关函数衰减越快（a 越大），谱越宽。"
            ],
            answer: "S_x(ω)=2a/(a²+ω²)，且 (1/2π)∫S_x dω=R_x(0)=1；相关越快衰减，功率谱越宽。"
          },
          {
            title: "白噪声通过一阶 RC 低通的输出功率",
            prompt: "白噪声功率谱密度为 N₀/2，通过截止角频率 Ωc 的一阶 RC 低通 |H|²=1/(1+(Ω/Ωc)²)。求输出平均功率。",
            steps: [
              "输出功率 = (1/2π)∫|H|²S_x dΩ = (N₀/2)·(1/2π)∫dΩ/(1+(Ω/Ωc)²)。",
              "积分 ∫_{−∞}^{∞}dΩ/(1+(Ω/Ωc)²)=πΩc。",
              "结果 = (N₀/2)·(πΩc/2π)=N₀Ωc/4。"
            ],
            answer: "输出平均功率为 N₀Ωc/4——带宽越宽，放行的噪声功率越多（正比于 Ωc）。"
          },
          {
            title: "白噪声通过移动平均器的方差",
            prompt: "方差为 9 的白噪声分别通过 3 点与 5 点移动平均器，求输出方差。",
            steps: [
              "输出方差 = σ_x²Σ|h[k]|²。",
              "3 点：Σh²=3×(1/3)²=1/3，输出方差 9×1/3=3。",
              "5 点：Σh²=5×(1/5)²=1/5，输出方差 9×1/5=1.8。"
            ],
            answer: "3 点 → 3（仿真 3.0053）；5 点 → 1.8。平均点数越多，噪声压制越强，代价是带宽变窄、延迟变大。"
          },
          {
            title: "过渡过程有多长",
            prompt: "离散一阶系统 h[n]=0.8^n u[n]，输入白噪声方差为 1。求稳态输出方差，并估算需要的预热长度。",
            steps: [
              "稳态方差 = σ_x²Σ_{k=0}^{∞}h²[k]=Σ(0.64)^k=1/(1−0.64)=2.778。",
              "到 n 点为止的累积方差 = (1−0.64^{n+1})/(1−0.64)。",
              "要求累积达到稳态的 99%：1−0.64^{n+1}=0.99 ⇒ 0.64^{n+1}=0.01 ⇒ n+1≈ln0.01/ln0.64≈10.3，故 n≈10。"
            ],
            answer: "稳态方差约 2.78；预热约 10 个样点即可（按 99% 判据）。"
          },
          {
            title: "写出维纳最优滤波器",
            prompt: "信号与噪声不相关，某频段内 S_s=8、S_n=2（同单位）。求该频点的最优增益与信噪比。",
            steps: [
              "不相关时 H_opt=S_s/(S_s+S_n)。",
              "代入得 H_opt=8/10=0.8。",
              "该频点信噪功率比为 8/2=4（约 6 dB），增益 0.8 是信号占比的直接体现。"
            ],
            answer: "H_opt=0.8；信号占比越高增益越接近 1，噪声占优的频段增益趋近 0。"
          },
          {
            title: "卡尔曼增益的稳态值",
            prompt: "一维常值状态（A=1、H=1），Q=10⁻⁴、R=1。求稳态卡尔曼增益与输出方差近似值。",
            steps: [
              "稳态时各量都是常数（P⁻ 为先验/预测协方差、P 为后验/滤波后协方差）：P⁻=P+Q（A=1）、P=P⁻(1−K)、K=P⁻/(P⁻+R)。",
              "消去 P、P⁻ 得稳态标量 Riccati 方程 K²R+QK−Q=0（等价 P²+PQ−RQ=0）；代入 Q=10⁻⁴、R=1 解得 K=(−10⁻⁴+√(10⁻⁸+4×10⁻⁴))/2≈0.00995。",
              "输出方差约为观测方差 R=1 的 K/(1)≈1% 量级。"
            ],
            answer: "稳态增益 K≈0.0099；R 远大于 Q 时滤波器几乎不信观测，输出方差压到观测的约 1%。"
          },
          {
            title: "LMS 收敛到维纳解",
            prompt: "两抽头、输入为方差 9 的白噪声、目标系数 [0.8, −0.5]、步长 μ=0.01。运行足够长后权向量收敛到哪？",
            steps: [
              "LMS 的均值收敛到维纳解 w*=R⁻¹p，本例即目标系数 [0.8, −0.5]。",
              "步长需满足充分条件 0<μ<2/(N·P_x)，N 为抽头数：两抽头时 0<μ<2/(2×9)≈0.111，0.01 在范围内。注意这是充分条件而不是精确的发散阈值。",
              "数值仿真（两抽头、期望信号 d[n]=w*ᵀx[n]+v[n]，v 为零均值噪声，方差 0.1，20 万点）得 w=[0.796, −0.489]：噪声使权向量在目标附近随机游走，若去掉噪声则会精确收敛到 [0.8, −0.5]。"
            ],
            answer: "带噪声时收敛到约 [0.8, −0.5] 附近（实测 [0.796, −0.489]）；无噪声时精确收敛到目标值。步长的充分条件是 μ<2/(N·P_x)=0.111，超过该值才可能发散。"
          },
          {
            title: "STFT 的分辨率折中",
            prompt: "要观察一个持续 5 ms 的瞬态在 1 kHz 附近的位置，采样率 10 kHz。窗长应怎么取？",
            steps: [
              "时间分辨率与窗长同量级，频率分辨率约为 1/窗长。",
              "取窗长≈5 ms（50 个样点）：频率分辨率约 200 Hz，足以分辨 1 kHz 附近的粗结构。",
              "若把窗长减半到 2.5 ms，时间定位更准但频率分辨率降到约 400 Hz，两者不能同时提高。"
            ],
            answer: "窗长取与瞬态时长相当（约 5 ms）；想同时提高时间与频率分辨率做不到——受不确定性原理约束。"
          },
          {
            title: "小波尺度与频率的换算",
            prompt: "用 Morlet 母小波（中心频率约 0.8125 Hz 归一化）分析 ω=125.66 rad/s（20 Hz）的成分，尺度应取多少？",
            steps: [
              "换算关系为 f=a_中心/ (a·Δ)，其中 a_中心 为母小波中心频率，Δ 为采样间隔。",
              "取采样率 100 Hz（Δ=0.01 s）、目标 f=20 Hz：a=0.8125/(20×0.01)=4.06。",
              "即尺度约 4 时对应该频率成分——尺度不是频率，必须换算。"
            ],
            answer: "尺度约 4；尺度与频率成反比，用前必须按母小波中心频率换算。"
          },
          {
            title: "EMD 能否分开频率切换",
            prompt: "信号前 1 s 是 5 Hz 正弦、后 1 s 是 50 Hz 正弦，采样率 500 Hz。EMD 之后能看出切换时刻吗？",
            steps: [
              "EMD 按局部时间尺度筛分：两段的不同尺度会体现为不同 IMF，或同一 IMF 的不同时间段。",
              "对 IMF 做希尔伯特变换求瞬时频率，即可在时间轴上读出频率从 5 Hz 跳到 50 Hz 的位置。",
              "边界提醒：拼接点本身是端点效应的来源之一，分解结果会受停止准则影响，应与 STFT 交叉验证。"
            ],
            answer: "能——这正是 HHT 相对固定基（傅里叶）的优势；但要用 STFT 交叉验证并报告参数敏感性。"
          },
          {
            title: "样本统计量与理论值的差距",
            prompt: "σ=3、N=200000 的白噪声样本，样本均值与方差相对理论值 0 与 9 应有多大偏差才算正常？",
            steps: [
              "均值估计的标准差约为 σ/√N=3/447≈0.0067，故 3σ 范围约 ±0.02。",
              "方差估计的相对标准差约为 √(2/N)≈0.0032，对应绝对偏差约 ±0.09（3σ）。",
              "超出这个范围时应先检查随机数发生器的质量（简单线性同余发生器就可能偏到 3% 量级），而不是先怀疑公式；报统计量必须同时给样本量与置信范围。"
            ],
            answer: "均值约 ±0.02、方差约 ±0.09（3σ 量级）；超出就先查发生器质量。有限样本下统计量本身是随机变量，必须带样本量报告。"
          },
          {
            title: "周期图与分段平均",
            prompt: "同一段白噪声，用单段 FFT 的 |X|² 估计功率谱与用 pwelch 分段平均，结果差别在哪？",
            steps: [
              "单段周期图是渐近无偏但方差恒定的估计：曲线在真值附近剧烈起伏，加长记录不减小起伏。",
              "pwelch 把记录分成多段、分别估计再平均，方差随段数下降，代价是每段变短、频率分辨率下降。",
              "这就是谱估计里“方差换偏差”的标准折中。"
            ],
            answer: "周期图起伏大且不随记录长度收敛；分段平均明显平滑，用分辨率换取方差的降低。"
          },
          {
            title: "三条路径核对同一结论",
            prompt: "方差 9 的白噪声通过 3 点移动平均。用哪三条路径可以互相印证输出方差等于 3？",
            steps: [
              "路径一（系数平方和）：σ_x²Σb²=9×(1/3)=3。",
              "路径二（时域仿真）：filter 后统计样本方差，实测 3.0053。",
              "路径三（频域）：S_y/S_x 应等于 |H|²，且在四个频点上与理论吻合（0.846/0.843 等）。"
            ],
            answer: "系数平方和、时域仿真、频域谱比三条路径一致，才说明结论在你的参数下成立。"
          },
          {
            title: "把 Q 设小了会怎样",
            prompt: "真实过程噪声方差为 10⁻²，但卡尔曼滤波里误设为 10⁻⁴。输出会有什么表现？",
            steps: [
              "Q 偏小意味着滤波器认为模型很准，于是增益 K 偏小、更信模型。",
              "真实状态变化时滤波器跟不上，估计出现系统性滞后（而不是抖动）。",
              "反过来把 Q 设得过大，则增益偏大、输出抖动加剧。"
            ],
            answer: "出现滞后；Q 偏大则抖动。Q、R 应与真实噪声量级匹配，而不是用作“平滑度旋钮”。"
          },
          {
            title: "小波去噪与低通滤波的差别",
            prompt: "含阶跃突变的含噪信号，用小波阈值去噪与用同长度 FIR 低通，结果的关键差别是什么？",
            steps: [
              "FIR 低通是线性时不变，对所有位置一视同仁，阶跃沿会被抹圆（上升时间变长）。",
              "小波阈值收缩按尺度处理：小幅细节系数被压掉，表征突变的系数被保留。",
              "因此小波去噪能保留突变位置，这是“按尺度区分”而非“频率选择性更好”。"
            ],
            answer: "低通会把阶跃抹圆，小波能保留突变位置；二者机理不同，不能互相替代。"
          },
          {
            title: "维格纳分布的交叉项",
            prompt: "两个不同时刻的 chirp 相加后做维格纳—维莱分布，图上多出一条振荡的脊线，它是什么？",
            steps: [
              "维格纳分布是二次型，两分量之和的分布含交叉项（互项）。",
              "交叉项出现在两个真实分量之间，位置与频率都不对应真实信号，且随分量间隔振荡。",
              "改用谱图可避免交叉项，但真实脊线变粗；也可用核函数在两者间折中。"
            ],
            answer: "是交叉项（虚假成分）；多分量场合应换用谱图或加核函数抑制。"
          },
          {
            title: "HHT 的敏感性检查",
            prompt: "同一段信号做两次 EMD，一次默认停止准则、一次加 0.1 强度噪声，IMF 个数不同。哪个是对的？",
            steps: [
              "EMD 没有唯一解：停止准则、端点处理与噪声都会改变筛分过程与 IMF 个数。",
              "加噪（EEMD/CEEMDAN 思路）本就是为了缓解模态混叠，结果不同是正常的。",
              "正确做法是报告参数、做敏感性检查，并与 STFT 等独立方法交叉验证。"
            ],
            answer: "两者都不是“唯一正确”；必须报告参数并交叉验证，不能把某一次分解当成信号的真实成分。"
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
            prompt: "宽平稳随机过程的两个条件是？",
            options: ["均值随时间线性增长", "均值为常数，且自相关只依赖时间差 τ", "分布必须是高斯", "必须是各态历经的"],
            answer: 1,
            explanation: "宽平稳只约束一阶与二阶矩；严格平稳才要求任意有限维分布对时间平移不变，各态历经性又是更强的要求。"
          },
          {
            id: "signals-ch5-check-2",
            prompt: "自相关函数 R_x(0) 的物理含义是？",
            options: ["方差", "平均功率（总功率）", "直流功率", "噪声功率"],
            answer: 1,
            explanation: "R_x(0)=E{|x|²} 是总平均功率；方差 σ²=R_x(0)−μ² 是去掉直流后的起伏功率，零均值时二者才相等。"
          },
          {
            id: "signals-ch5-check-3",
            prompt: "实过程的自相关函数满足？",
            options: ["奇函数且无界", "偶函数且 |R_x(τ)|≤R_x(0)", "恒为常数", "只在 τ=0 有定义"],
            answer: 1,
            explanation: "由定义可直接验证；含周期分量时 R_x(τ) 也含同周期分量，可用于检测被噪声淹没的周期信号。"
          },
          {
            id: "signals-ch5-check-4",
            prompt: "互相关函数满足的关系是？",
            options: ["R_yx(τ)=R_xy(τ)", "R_yx(τ)=R_xy*(−τ)", "R_yx(τ)=−R_xy(τ)", "两者无关"],
            answer: 1,
            explanation: "换下标要连共轭和符号一起换；实信号时才写作 R_xy(−τ)。"
          },
          {
            id: "signals-ch5-check-5",
            prompt: "维纳—辛钦定理说的是？",
            options: ["均值与方差互为变换", "自相关函数与功率谱密度互为傅里叶变换对", "相关函数必为常数", "功率谱必为高斯形"],
            answer: 1,
            explanation: "S_x(ω)=∫R_x(τ)e^{−jωτ}dτ；由 τ=0 得 R_x(0)=(1/2π)∫S_x dω，可用于自洽性速检。"
          },
          {
            id: "signals-ch5-check-6",
            prompt: "为什么随机信号用功率谱而不是频谱描述？",
            options: ["频谱不存在（样本能量无限），而平均功率有限", "功率谱更容易计算", "频谱是复数", "功率谱精度更高"],
            answer: 0,
            explanation: "单条样本的能量无限、频谱密度不存在；但平均功率有限，因此描述对象是功率在频率上的密度。"
          },
          {
            id: "signals-ch5-check-7",
            prompt: "稳定 LTI 系统对输入功率谱的作用是？",
            options: ["乘以 |H|²", "乘以 H 的相位", "对频率求导", "必定变成白谱"],
            answer: 0,
            explanation: "S_y=|H|²S_x；注意它只含幅频信息，不含相位，因此无法据此区分非最小相位系统。"
          },
          {
            id: "signals-ch5-check-8",
            prompt: "输出均值与输入均值的关系是？",
            options: ["相等", "输出均值 = 输入均值 × H(0)", "输出均值恒为 0", "输出均值 = 输入均值 × |H(1)|²"],
            answer: 1,
            explanation: "对卷积取期望即得 μ_y=μ_x∫h dt=μ_x·H(0)，即被直流增益缩放。"
          },
          {
            id: "signals-ch5-check-9",
            prompt: "方差 9 的白噪声通过 3 点移动平均，输出方差是？",
            options: ["9", "3", "1", "1.8"],
            answer: 1,
            explanation: "σ_y²=σ_x²Σh²=9×(3×(1/3)²)=9/3=3；5 点移动平均则为 1.8。"
          },
          {
            id: "signals-ch5-check-10",
            prompt: "白噪声通过线性系统后，输出自相关函数与什么有关？",
            options: ["只与输入均值有关", "等于 σ_x² 乘以 h 与自身的相关（可用于相关法辨识）", "恒为常数", "与 h 无关"],
            answer: 1,
            explanation: "R_y=σ_x²(h*h_rev)，因此可由输出相关函数反推冲激响应——这就是相关法辨识与 PRBS 激励的依据。"
          },
          {
            id: "signals-ch5-check-11",
            prompt: "过渡期内输出方差随时间变化的原因是？",
            options: ["系统不稳定", "求和的冲激响应项数随时间增加：σ_y²[n]=σ_x²Σ_{k≤n}h²[k]", "噪声非白", "采样率变化"],
            answer: 1,
            explanation: "激励从某一时刻开始，h 的能量需要时间才累积完，因此起始段方差不等于稳态值，测量时要丢弃预热样本。"
          },
          {
            id: "signals-ch5-check-12",
            prompt: "维纳滤波的频域最优解是？",
            options: ["H_opt=S_x/S_xs", "H_opt=S_xs*/S_x（信号与噪声不相关时退化为 S_s/(S_s+S_n)）", "H_opt=|H|²", "H_opt=1"],
            answer: 1,
            explanation: "由正交性原理（维纳—霍夫方程）导出；共轭来自本站 R_xs(τ)=E{x(t)s*(t−τ)} 的定义。含义是按各频段的信噪功率比分配增益，不相关时互谱为实、退化为 S_s/(S_s+S_n)。"
          },
          {
            id: "signals-ch5-check-13",
            prompt: "维纳滤波结论成立需要的前提不包括？",
            options: ["信号与噪声宽平稳", "已知二阶统计量", "线性最优、稳态解", "系统必须是非因果的"],
            answer: 3,
            explanation: "非因果只是实现时的问题（需引入延迟或改因果解），不是结论成立的前提。"
          },
          {
            id: "signals-ch5-check-14",
            prompt: "卡尔曼滤波相对维纳滤波最本质的差别是？",
            options: ["不需要观测", "增益由协方差递推自动更新，且不要求平稳", "只能处理标量", "不需要噪声统计"],
            answer: 1,
            explanation: "卡尔曼用状态空间模型按预测—校正递推，增益随 Q、R 与协方差自动变化；维纳用固定系数的稳态解。"
          },
          {
            id: "signals-ch5-check-15",
            prompt: "卡尔曼滤波里把过程噪声协方差 Q 设得远小于真实值，会导致？",
            options: ["输出抖动加剧", "估计出现系统性滞后（更信模型）", "增益变大", "没有影响"],
            answer: 1,
            explanation: "Q 小 ⇒ 增益 K 小 ⇒ 更信模型，真实状态变化时跟不上；Q 过大则相反，输出抖动。"
          },
          {
            id: "signals-ch5-check-16",
            prompt: "LMS 算法的更新式与步长约束是？",
            options: ["w[n+1]=w[n]+μe[n]x[n]，0<μ<2/((M+1)P_x)", "w[n+1]=w[n]−μx[n]，μ 任意", "w[n+1]=w[n]+e[n]，与 μ 无关", "w[n+1]=μw[n]"],
            answer: 0,
            explanation: "步长过小收敛慢，过大则发散；收敛后权向量的均值趋于维纳解。"
          },
          {
            id: "signals-ch5-check-17",
            prompt: "STFT 的时间分辨率与频率分辨率的关系是？",
            options: ["可以同时任意提高", "受不确定性原理约束，二者不能同时提高", "只与采样率有关", "与窗长无关"],
            answer: 1,
            explanation: "窗越短时间分辨率越高、频率分辨率越低；两者乘积有下界，只能按需要折中。"
          },
          {
            id: "signals-ch5-check-18",
            prompt: "小波变换相对 STFT 的关键改进是？",
            options: ["计算更快", "用可缩放母小波实现等 Q 分析（高频短窗、低频长窗）", "没有边界效应", "不需要选择基函数"],
            answer: 1,
            explanation: "STFT 的基函数等带宽，小波的带宽与中心频率成正比，因此对“低频长、高频短”的信号更合适。"
          },
          {
            id: "signals-ch5-check-19",
            prompt: "维格纳—维莱分布的主要缺点是？",
            options: ["分辨率太低", "多分量信号会出现交叉项（虚假成分）", "只能处理平稳信号", "不能数值实现"],
            answer: 1,
            explanation: "它是二次型分布，聚集性最好但含交叉项；可用核函数（科恩类）在聚集性与交叉项之间折中。"
          },
          {
            id: "signals-ch5-check-20",
            prompt: "关于 EMD/HHT 的结论，正确的态度是？",
            options: ["IMF 就是信号的真实物理分量", "EMD 结果唯一且可复现", "EMD 无严格数学证明、受端点效应与模态混叠影响，结论需交叉验证", "HHT 不需要任何参数"],
            answer: 2,
            explanation: "IMF 是筛分算法的产物，随停止准则与噪声变化；应报告参数并与其他方法（如 STFT）交叉验证。"
          }
        ],
        summary: [
          "随机信号由概率结构描述：宽平稳只约束均值与自相关，各态历经性更强但却是“用一条样本估计统计量”的前提。",
          "均值、方差、相关函数是时域数字特征；R_x(0) 是平均功率，σ²=R_x(0)−μ² 是起伏功率。",
          "维纳—辛钦定理把自相关与功率谱连成一对变换，R_x(0)=(1/2π)∫S_x dω 可作自洽性速检。",
          "随机信号通过稳定 LTI 系统：均值乘 H(0)、功率谱乘 |H|²、互谱乘 H；白噪声输入时输出方差 = σ²Σ|h|²。",
          "过渡期内输出不平稳，仿测都要丢弃预热样本。",
          "最优滤波三件套：维纳（统计量已知）、卡尔曼（有动态模型、增益自适应）、自适应 LMS（在线学习，步长受约束）。",
          "非平稳分析三条路线：STFT/谱图（固定窗）、小波（等 Q 自适应尺度）、HHT（数据自适应基，需交叉验证）。"
        ],
        tags: ["随机信号", "平稳性", "各态历经", "相关函数", "功率谱", "维纳滤波", "卡尔曼滤波", "自适应滤波", "时频分析", "小波变换", "希尔伯特-黄"]
      }
    ]
  };

  // ../codex_projects/personal-workbench-sites/app/data/courses/index.ts
  var courses = [signalsCourse, digitalCourse, analogCourse];
  var courseById = Object.fromEntries(courses.map((course) => [course.id, course]));
  return __toCommonJS(index_exports);
})();
