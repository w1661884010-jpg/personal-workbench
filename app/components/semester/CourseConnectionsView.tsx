import type { CourseDefinition } from "../../lib/course-model";
import { Icon } from "../Icons";

const flowNodes = [
  { id: "source", title: "信号产生", detail: "物理过程或传感器产生连续时间信号。", courseId: "signals", course: "信号与系统" },
  { id: "conditioning", title: "模拟电路调理", detail: "偏置、放大和滤波把信号调整到可采范围。", courseId: "analog", course: "模拟电子技术" },
  { id: "sampling", title: "采样与数字化", detail: "限制带宽，选择采样率，并把幅值量化编码。", courseId: "signals", course: "信号与系统 + 模拟电子技术" },
  { id: "logic", title: "数字逻辑处理", detail: "组合逻辑和时序逻辑完成判断、记忆与计数。", courseId: "digital", course: "数字电子技术" },
  { id: "output", title: "输出控制", detail: "逻辑结果驱动显示、使能信号或执行器接口。", courseId: "digital", course: "数字电子技术" },
] as const;

export function CourseConnectionsView({ courses, onOpenCourse }: { courses: readonly CourseDefinition[]; onOpenCourse: (courseId: CourseDefinition["id"]) => void }) {
  return <div className="connections-page page-enter"><header className="page-heading"><div><h1>三门课程如何连接</h1><p>信号产生 → 模拟调理 → 采样与数字化 → 数字逻辑处理 → 输出控制。</p></div></header><section className="signal-chain" aria-label="信号处理流程图">{flowNodes.map((node, index) => <div className="chain-segment" key={node.id}><button type="button" className={`chain-node node-${node.id}`} onClick={() => onOpenCourse(node.courseId)}><span>{String(index + 1).padStart(2, "0")}</span><Icon name={node.id === "source" ? "wave" : node.id === "conditioning" ? "input" : node.id === "sampling" ? "timer" : node.id === "logic" ? "chip" : "output"} size={26} /><strong>{node.title}</strong><p>{node.detail}</p><small>{node.course}</small></button>{index < flowNodes.length - 1 ? <div className="chain-arrow" aria-hidden="true"><span /><Icon name="arrow" size={20} /></div> : null}</div>)}</section><section className="course-role-grid">{courses.map((course, index) => <article key={course.id} style={{ borderTopColor: course.accent }}><span className="role-index">0{index + 1}</span><h2>{course.title}</h2><p>{course.role}</p><button type="button" onClick={() => onOpenCourse(course.id)}>查看教材路线 <Icon name="arrow" size={16} /></button></article>)}</section></div>;
}
