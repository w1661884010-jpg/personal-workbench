import type { KeyboardEvent } from "react";
import type { SignalPath } from "../../lib/model";
import type { IconName } from "../Icons";
import { Icon } from "../Icons";

const pathIcons: Record<string, IconName> = {
  "power-path": "power",
  "digital-input-path": "input",
  "digital-output-path": "output",
  "timed-output-path": "timer",
  "analog-sampling-path": "wave",
};

const detailSections = [
  { key: "beforeYouStart", title: "先确认", icon: "check" as IconName },
  { key: "keyNodes", title: "关键节点", icon: "chip" as IconName },
  {
    key: "relatedLocations",
    title: "相关位置",
    icon: "route" as IconName,
  },
  { key: "tasks", title: "小任务", icon: "notebook" as IconName },
  {
    key: "commonErrors",
    title: "常见错误与检查",
    icon: "warning" as IconName,
  },
] as const;

type KnowledgeViewProps = {
  paths: SignalPath[];
  selectedPathId: string;
  onSelectPath: (pathId: string) => void;
  onStartTask: (path: SignalPath) => void;
};

export function KnowledgeView({
  paths,
  selectedPathId,
  onSelectPath,
  onStartTask,
}: KnowledgeViewProps) {
  const selected = paths.find((path) => path.id === selectedPathId) ?? paths[0];

  function valuesFor(section: (typeof detailSections)[number]["key"]) {
    if (section === "commonErrors") {
      return selected.commonErrors;
    }
    return selected[section];
  }

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (paths.length === 0) return;

    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % paths.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + paths.length) % paths.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = paths.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    onSelectPath(paths[nextIndex].id);
    const tabs =
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]',
      );
    tabs?.[nextIndex]?.focus();
  }

  return (
    <section className="view" aria-labelledby="knowledge-title">
      <header className="view-header">
        <div>
          <h1 id="knowledge-title" className="view-title compact">
            知识与开发板
          </h1>
          <p className="view-conclusion">
            先看信号怎样走，再回到寄存器与代码
          </p>
        </div>
      </header>

      <div className="knowledge-layout">
        <div className="path-tabs" role="tablist" aria-label="开发板信号路径">
          {paths.map((path, index) => (
            <button
              id={`${path.id}-tab`}
              key={path.id}
              type="button"
              className="path-tab"
              role="tab"
              aria-selected={selected.id === path.id}
              aria-controls={`${path.id}-panel`}
              tabIndex={selected.id === path.id ? 0 : -1}
              onClick={() => onSelectPath(path.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {path.title}
            </button>
          ))}
        </div>

        <article
          id={`${selected.id}-panel`}
          className="signal-panel"
          role="tabpanel"
          aria-labelledby={`${selected.id}-tab`}
        >
          <h2 className="section-label">信号路径：{selected.title}</h2>
          <div className="signal-flow" aria-label={selected.summary}>
            {selected.nodes.map((node, index) => (
              <div key={node.id} style={{ display: "contents" }}>
                <div className="signal-node">
                  <span className="signal-node-icon">
                    <Icon
                      name={
                        index === 0
                          ? pathIcons[selected.id] ?? "chip"
                          : index === selected.nodes.length - 1
                            ? "check"
                            : "chip"
                      }
                      size={27}
                    />
                  </span>
                  <strong>{node.label}</strong>
                  <span>{node.detail}</span>
                </div>
                {index < selected.nodes.length - 1 ? (
                  <span className="signal-arrow" aria-hidden="true">
                    <Icon name="arrow" size={24} />
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="knowledge-note">
            <Icon name="info" size={24} />
            <div>
              <strong>知识要点</strong>
              <p>{selected.knowledgePoints.join("；")}</p>
            </div>
          </div>

          <div className="accordion-list">
            {detailSections.map((section, index) => {
              const values = valuesFor(section.key);
              const summary = values
                .map((item) =>
                  typeof item === "string"
                    ? item
                    : `${item.issue}：${item.check}`,
                )
                .join("；");

              return (
                <details key={section.key} open={index === 0}>
                  <summary>
                    <span className="accordion-title">
                      <Icon name={section.icon} size={19} /> {section.title}
                    </span>
                    <span className="accordion-summary">{summary}</span>
                    <Icon name="chevron" size={18} />
                  </summary>
                  <div className="accordion-body">
                    <ul className="detail-list">
                      {values.map((item) => (
                        <li key={typeof item === "string" ? item : item.issue}>
                          {typeof item === "string"
                            ? item
                            : `${item.issue}：${item.check}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              );
            })}
          </div>

          <div className="knowledge-actions">
            <button
              type="button"
              className="primary-action"
              onClick={() => onStartTask(selected)}
            >
              <Icon name="arrow" size={22} />
              开始这个小任务
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
