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
              { to: "signals-ch3-lti", why: "第3章把“h(t) 完全描述系统”推广成因果性、稳定性判据与系统函数" }
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
              { to: "signals-ch3-lti", why: "因果系统的稳定性要求 H(s) 的极点全部落在左半平面；一般情形要看 ROC 是否包含虚轴" }
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
              { to: "signals-ch3-lti", why: "卷积和是第3章描述离散 LTI 系统的语言" }
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
              { to: "signals-ch3-lti", why: "第3章用单位圆与极点位置统一讨论离散系统的因果性与稳定性" }
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
          "判断系统的线性、时不变性、因果性与稳定性。",
          "在时域、频域和复频域求 LTI 系统响应。",
          "理解系统辨识、逆滤波和数字实现的基本限制。"
        ],
        prerequisites: ["第1章卷积与拉普拉斯变换", "第2章离散卷积与Z变换"],
        sections: [
          {
            id: "signals-ch3-properties",
            group: "第一节 系统及其性质",
            title: "系统描述与基本性质",
            importance: "core",
            sourceStatus: "verified_local",
            content: "系统性质必须逐项检验。线性要求叠加，时不变要求输入移位只引起同量输出移位；无记忆系统的当前输出只依赖当前输入，因果系统不依赖未来输入，BIBO 稳定系统把有界输入映射为有界输出。可逆性要求存在逆系统使级联后恢复原输入；“线性”“稳定”“可逆”彼此不能互相推出。"
          },
          {
            id: "signals-ch3-lti",
            group: "第二节 信号的线性系统处理",
            title: "线性系统的时域、频域与复频域分析",
            importance: "core",
            sourceStatus: "verified_local",
            content: "LTI 系统在时域由冲激响应和卷积描述，在频域由传递函数相乘描述，在复频域可通过极零点和收敛域分析暂态、稳定性与因果性。",
            formula: "Y(s)=X(s)H(s),\\qquad H(s)=\\frac{Y(s)}{X(s)}",
            variables: ["H：系统传递函数", "X：输入变换", "Y：输出变换"]
          },
          {
            id: "signals-ch3-identification",
            group: "第三节 解卷积（逆滤波与系统辨识）",
            title: "系统辨识与逆滤波",
            importance: "core",
            sourceStatus: "verified_local",
            content: "系统辨识由已知输入和测量输出估计系统；逆滤波试图由输出恢复输入。若 H 在关键频率接近零，直接相除会放大噪声，必须检查可逆性和稳健性。"
          },
          {
            id: "signals-ch3-digital-realization",
            group: "第四节 数字信号处理技术",
            title: "数字信号处理的实现与有限字长",
            importance: "core",
            sourceStatus: "verified_local",
            content: "数字实现需要采样、量化、运算和输出。有限字长会引入系数量化、运算舍入和溢出，可能改变极点位置与稳定裕量。"
          },
          {
            id: "signals-ch3-advanced",
            group: "第五节 应用MATLAB的信号处理",
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
            group: "第一节 滤波器概述",
            title: "滤波原理、分类与技术指标",
            importance: "core",
            sourceStatus: "verified_local",
            content: "滤波器按频率选择性改变信号。先根据希望保留的频带区分低通、高通、带通和带阻，再给出通带、阻带、过渡带、允许纹波和最小衰减；不能只说“去掉噪声”而不给可检验指标。"
          },
          {
            id: "signals-ch4-analog",
            group: "第二节 模拟滤波器",
            title: "模拟滤波器",
            importance: "core",
            sourceStatus: "verified_local",
            content: "巴特沃思响应通带单调且最大平坦，切比雪夫允许纹波以换取更陡过渡。低通原型可经频率变换得到其他类型；RC 有源结构用于电路实现。",
            formula: "|H(j\\omega)|^2=\\frac{1}{1+(\\omega/\\omega_c)^{2N}}",
            variables: ["ωc：巴特沃思截止角频率", "N：滤波器阶数"]
          },
          {
            id: "signals-ch4-iir",
            group: "第三节 数字滤波器",
            title: "IIR 数字滤波器",
            importance: "core",
            sourceStatus: "verified_local",
            content: "IIR 使用反馈，通常以较低阶数获得较陡响应，但必须检查极点和稳定性，且一般不能保证严格线性相位。冲激响应不变法通过采样模拟系统冲激响应得到数字极点，可能产生频谱混叠；双线性变换把整个模拟频率轴一一映射到数字单位圆，会产生频率扭曲，因此需要预畸变。",
            formula: "s=\\frac{2}{T}\\frac{1-z^{-1}}{1+z^{-1}},\\qquad \\Omega=\\frac{2}{T}\\tan\\frac{\\omega}{2}",
            variables: ["T：采样周期", "Ω：预畸变后的模拟角频率", "ω：数字角频率"]
          },
          {
            id: "signals-ch4-fir",
            group: "第三节 数字滤波器",
            title: "FIR 数字滤波器",
            importance: "core",
            sourceStatus: "verified_local",
            content: "FIR 无反馈时天然 BIBO 稳定，并可通过对称系数获得严格线性相位；代价通常是达到相同过渡带要求所需阶数更高。窗函数法先截取理想无限长冲激响应，再用矩形、Hann、Hamming 或 Blackman 窗控制旁瓣；窗越平滑，通常旁瓣越低但主瓣更宽。",
            formula: "y[n]=\\sum_{k=0}^{M}b_kx[n-k]",
            variables: ["bₖ：FIR 系数", "M：滤波器阶数"]
          },
          {
            id: "signals-ch4-advanced-design",
            group: "第四节 应用MATLAB的滤波器设计",
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
            group: "第一节 随机信号的描述与分析",
            title: "随机信号的概率结构与数字特征",
            importance: "core",
            sourceStatus: "verified_local",
            content: "随机过程是一族可能的样本函数，一次观测只给出其中一条。严格平稳要求任意有限维联合分布对时间平移不变；宽平稳只要求均值为常数且相关函数仅与时间差有关。各态历经性说明可用足够长的一条样本的时间平均替代集合平均，它比平稳更强，不能由“看起来稳定”直接断言。",
            formula: "R_x(\\tau)=\\operatorname{E}\\{x(t)x^*(t-\\tau)\\}",
            variables: ["E：统计期望", "Rx：自相关函数", "τ：时间差"]
          },
          {
            id: "signals-ch5-spectrum",
            group: "第一节 随机信号的描述与分析",
            title: "随机信号的频域描述",
            importance: "core",
            sourceStatus: "verified_local",
            content: "功率谱密度描述平均功率随频率的分布；宽平稳过程的自相关函数与功率谱密度构成傅里叶变换对。",
            formula: "S_x(\\omega)=\\mathcal{F}\\{R_x(\\tau)\\}",
            variables: ["Sx：功率谱密度", "F：傅里叶变换"]
          },
          {
            id: "signals-ch5-lti-random",
            group: "第二节 随机信号通过线性系统的分析",
            title: "随机信号通过线性系统",
            importance: "core",
            sourceStatus: "verified_local",
            content: "宽平稳随机信号通过稳定 LTI 系统后，输出功率谱等于输入功率谱乘以系统幅频响应的平方。",
            formula: "S_y(\\omega)=|H(j\\omega)|^2S_x(\\omega)",
            variables: ["Sx：输入功率谱", "Sy：输出功率谱", "H：系统频率响应"]
          },
          {
            id: "signals-ch5-optimal",
            group: "第三节 最优线性滤波",
            title: "最优线性滤波概览",
            importance: "core",
            sourceStatus: "verified_local",
            content: "维纳滤波以已知二阶统计量求最小均方误差的稳态线性估计；卡尔曼滤波在状态空间模型中按“预测—校正”递推更新状态与协方差；LMS 等自适应滤波根据瞬时误差在线调整系数。三者分别依赖平稳统计、动态模型或在线数据，不能只按名称互换。"
          },
          {
            id: "signals-ch5-nonstationary",
            group: "第四节 非平稳随机信号的分析",
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
