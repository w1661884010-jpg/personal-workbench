import { courseById } from "../../data/semester";
import { Icon } from "../Icons";

interface ConnectionsViewProps {
  onOpenCourse: (courseId: string) => void;
}
const flowNodes = [
  { id: "source", title: "信号产生", detail: "传感器、电源扰动或物理过程产生连续时间信号。", courseId: "signals", course: "信号与系统" },
  { id: "conditioning", title: "模拟电路调理", detail: "用偏置、放大和滤波把微弱信号送入 ADC 合适量程。", courseId: "analog", course: "模拟电子技术" },
  { id: "sampling", title: "采样与数字化", detail: "按奈奎斯特条件选择采样率，并用抗混叠滤波器限制带宽。", courseId: "signals", course: "信号与系统 + 模拟电子技术" },
  { id: "logic", title: "数字逻辑处理", detail: "比较、译码、计数与状态机对离散数据作确定性处理。", courseId: "digital", course: "数字电子技术" },
  { id: "output", title: "输出控制", detail: "数字逻辑产生使能、时序或 PWM，驱动后级执行与显示。", courseId: "digital", course: "数字电子技术" },
] as const;

export function ConnectionsView({ onOpenCourse }: ConnectionsViewProps) {
  return (
    <div className="connections-page page-enter">
      <header className="page-heading">
        <div><h1>三门课程如何连接</h1><p>从真实信号到输出动作，三门课不是三条平行线，而是一条完整工程链路。</p></div>
      </header>

      <section className="signal-chain" aria-label="信号处理流程图">
        {flowNodes.map((node, index) => (
          <div className="chain-segment" key={node.id}>
            <button type="button" className={`chain-node node-${node.id}`} onClick={() => onOpenCourse(node.courseId)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Icon name={node.id === "source" ? "wave" : node.id === "conditioning" ? "input" : node.id === "sampling" ? "timer" : node.id === "logic" ? "chip" : "output"} size={26} />
              <strong>{node.title}</strong>
              <p>{node.detail}</p>
              <small>{node.course}</small>
            </button>
            {index < flowNodes.length - 1 ? <div className="chain-arrow" aria-hidden="true"><span /><Icon name="arrow" size={20} /></div> : null}
          </div>
        ))}
      </section>

      <section className="course-role-grid">
        {["signals", "analog", "digital"].map((courseId, index) => {
          const course = courseById[courseId];
          const details = [
            "定义信号、系统和频谱语言，解释 LTI 响应、卷积、变换与采样边界。它回答“信号包含什么，经过系统会怎样”。",
            "处理连续电压与电流：偏置、放大、反馈、带宽和抗混叠。它回答“怎样把真实信号变成可测、可采的信号”。",
            "处理离散逻辑与状态：门电路、组合逻辑、触发器、计数器和寄存器。它回答“采样后如何可靠决策并控制输出”。",
          ];
          return (
            <article key={courseId} style={{ borderTopColor: course.color }}>
              <span className="role-index">0{index + 1}</span>
              <h2>{course.title}</h2>
              <p>{details[index]}</p>
              <button type="button" onClick={() => onOpenCourse(courseId)}>查看课程路线 <Icon name="arrow" size={16} /></button>
            </article>
          );
        })}
      </section>

      <section className="chain-example">
        <div><h2>把链路落到一个最小例子</h2><p>温度传感器输出微弱电压 → 运放调理到 ADC 量程 → 低通限制带宽 → ADC 采样 → 比较器逻辑判断阈值 → 计数器维持报警时长 → 输出驱动 LED。</p></div>
        <code>sensor → op-amp → LPF → ADC → comparator → counter → LED</code>
      </section>
    </div>
  );
}
