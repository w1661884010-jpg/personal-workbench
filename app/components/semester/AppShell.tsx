import type { ReactNode } from "react";
import { Icon, type IconName } from "../Icons";

export type SemesterViewId = "dashboard" | "courses" | "knowledge" | "mistakes" | "connections";

export interface NavigationItem {
  id: SemesterViewId;
  label: string;
  mobileLabel: string;
  icon: IconName;
}
export interface SearchResult {
  id: string;
  kind: "course" | "chapter" | "topic";
  title: string;
  meta: string;
  courseId: string;
  topicId?: string;
}

interface AppShellProps {
  activeView: SemesterViewId;
  navigation: readonly NavigationItem[];
  searchQuery: string;
  searchResults: readonly SearchResult[];
  saveLabel: string;
  onNavigate: (view: SemesterViewId) => void;
  onSearchChange: (query: string) => void;
  onSearchSelect: (result: SearchResult) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  children: ReactNode;
}

export function AppShell({
  activeView,
  navigation,
  searchQuery,
  searchResults,
  saveLabel,
  onNavigate,
  onSearchChange,
  onSearchSelect,
  onExport,
  onImport,
  children,
}: AppShellProps) {
  return (
    <div className="semester-app">
      <aside className="app-sidebar">
        <button className="brand-lockup" type="button" onClick={() => onNavigate("dashboard")} aria-label="返回学习总览">
          <span className="brand-chip"><Icon name="chip" size={26} /></span>
          <span><strong>电路自习室</strong><small>本学期 · 第 3 周</small></span>
        </button>
        <nav className="sidebar-nav" aria-label="一级导航">
          {navigation.map((item) => (
            <button
              className={activeView === item.id ? "nav-item is-active" : "nav-item"}
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={activeView === item.id ? "page" : undefined}
            >
              <Icon name={item.icon} size={21} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <span className="save-dot" aria-hidden="true" />
          <span>{saveLabel}</span>
          <small>仅保存在当前浏览器</small>
        </div>
      </aside>

      <div className="app-stage">
        <header className="topbar">
          <button className="mobile-brand" type="button" onClick={() => onNavigate("dashboard")}>电路自习室</button>
          <div className="global-search">
            <Icon name="search" size={19} />
            <label className="sr-only" htmlFor="global-study-search">全局搜索</label>
            <input
              id="global-study-search"
              type="search"
              placeholder="搜索课程、章节或知识点"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              autoComplete="off"
            />
            {searchQuery.trim() ? (
              <div className="search-results" role="listbox" aria-label="搜索结果">
                {searchResults.length ? searchResults.map((result) => (
                  <button key={`${result.kind}-${result.id}`} type="button" onClick={() => onSearchSelect(result)}>
                    <span>{result.title}</span>
                    <small>{result.meta}</small>
                  </button>
                )) : <p>没有匹配的课程、章节或知识点</p>}
              </div>
            ) : null}
          </div>
          <div className="data-actions">
            <label className="secondary-button file-button">
              <Icon name="upload" size={18} />
              <span>导入 JSON</span>
              <input
                type="file"
                accept="application/json,.json"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) onImport(file);
                  event.target.value = "";
                }}
              />
            </label>
            <button className="secondary-button" type="button" onClick={onExport}>
              <Icon name="download" size={18} />
              <span>导出 JSON</span>
            </button>
          </div>
        </header>
        <main className="main-content">{children}</main>
      </div>

      <nav className="mobile-nav" aria-label="移动端一级导航">
        {navigation.map((item) => (
          <button
            key={item.id}
            className={activeView === item.id ? "is-active" : ""}
            type="button"
            onClick={() => onNavigate(item.id)}
            aria-current={activeView === item.id ? "page" : undefined}
          >
            <Icon name={item.icon} size={22} />
            <span>{item.mobileLabel}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
