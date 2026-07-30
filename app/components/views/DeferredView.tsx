import type { DeferredGroup } from "../../lib/model";
import { Icon } from "../Icons";

type DeferredViewProps = {
  groups: DeferredGroup[];
  reasons: Record<string, string>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReasonChange: (id: string, value: string) => void;
  onSaveReason: (id: string) => void;
  onReturnToday: () => void;
};

export function DeferredView({
  groups,
  reasons,
  selectedId,
  onSelect,
  onReasonChange,
  onSaveReason,
  onReturnToday,
}: DeferredViewProps) {
  return (
    <section className="view" aria-labelledby="deferred-title">
      <header className="view-header">
        <div>
          <h1 id="deferred-title" className="view-title compact">
            以后再学
          </h1>
          <p className="view-conclusion">
            先完成 F28335 基础主线，再回来处理这些主题
          </p>
        </div>
      </header>

      <div className="deferred-groups">
        {groups.map((group) => (
          <section className="deferred-group" key={group.id}>
            <h2>
              <Icon name="clock" size={22} />
              {group.title}
            </h2>
            <div className="deferred-list">
              {group.items.map((item) => {
                const isOpen = selectedId === item.id;
                return (
                  <div className="deferred-row" key={item.id}>
                    <button
                      type="button"
                      className="deferred-row-head"
                      aria-expanded={isOpen}
                      onClick={() => onSelect(item.id)}
                    >
                      <span className="deferred-dot" aria-hidden="true" />
                      <span>{item.title}</span>
                      <span className="deferred-status">
                        已延期 · {isOpen ? "收起" : "写原因"}
                      </span>
                    </button>
                    {isOpen ? (
                      <div className="deferred-note">
                        <label className="field-label" htmlFor={`reason-${item.id}`}>
                          延期原因（可选）
                        </label>
                        <textarea
                          id={`reason-${item.id}`}
                          value={reasons[item.id] ?? item.reason}
                          onChange={(event) =>
                            onReasonChange(item.id, event.target.value)
                          }
                          maxLength={200}
                          placeholder="记录为什么现在不学，便于以后回顾。"
                        />
                        <div className="deferred-note-actions">
                          <button
                            type="button"
                            className="secondary-action"
                            onClick={() => onSaveReason(item.id)}
                          >
                            <Icon name="save" size={18} />
                            记录延期原因
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="deferred-primary">
        <button
          type="button"
          className="primary-action"
          onClick={onReturnToday}
        >
          <Icon name="arrow" size={21} style={{ transform: "rotate(180deg)" }} />
          返回今日学习
        </button>
      </div>
    </section>
  );
}
