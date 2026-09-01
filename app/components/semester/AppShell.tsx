import type { ReactNode } from "react";
import { themeLabels, type ThemePreference } from "../../lib/theme";
import { Icon, type IconName } from "../Icons";

export interface NavigationItem {
  id: string;
  label: string;
  mobileLabel: string;
  icon: IconName;
  mobile?: boolean;
}

export interface SearchResult {
  id: string;
  kind: "course" | "chapter" | "section" | "experiment";
  title: string;
  meta: string;
  route: string;
}

interface AppShellProps {
  activeNavigationId: string;
  navigation: readonly NavigationItem[];
  searchQuery: string;
  searchResults: readonly SearchResult[];
  saveLabel: string;
  themePreference: ThemePreference;
  onNavigate: (id: string) => void;
  onSearchChange: (query: string) => void;
  onSearchSelect: (result: SearchResult) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onThemePreferenceCycle: () => void;
  children: ReactNode;
}

const themeIcons: Record<ThemePreference, IconName> = {
  system: "monitor",
  dark: "moon",
  light: "sun",
};

export function AppShell({ activeNavigationId, navigation, searchQuery, searchResults, saveLabel, themePreference, onNavigate, onSearchChange, onSearchSelect, onExport, onImport, onThemePreferenceCycle, children }: AppShellProps) {
  return <div className="semester-app">
    <aside className="app-sidebar">
      <button className="brand-lockup" type="button" onClick={() => onNavigate("dashboard")} aria-label="返回课程首页"><span className="brand-chip"><Icon name="chip" size={26} /></span><span><strong>个人电子工作台</strong><small>按教材章节推进</small></span></button>
      <nav className="sidebar-nav" aria-label="一级导航">{navigation.map((item) => <button className={activeNavigationId === item.id ? "nav-item is-active" : "nav-item"} key={item.id} type="button" onClick={() => onNavigate(item.id)} aria-current={activeNavigationId === item.id ? "page" : undefined}><Icon name={item.icon} size={21} /><span>{item.label}</span></button>)}</nav>
      <div className="sidebar-foot"><span className="save-dot" aria-hidden="true" /><span>{saveLabel}</span><small>课程与电路仅保存在当前浏览器</small></div>
    </aside>
    <div className="app-stage">
      <header className="topbar">
        <button className="mobile-brand" type="button" onClick={() => onNavigate("dashboard")}>个人电子工作台</button>
        <div className="global-search"><Icon name="search" size={19} /><label className="sr-only" htmlFor="global-study-search">全局搜索</label><input id="global-study-search" type="search" placeholder="搜索课程、章节、知识讲解或实验" value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} autoComplete="off" />{searchQuery.trim() ? <div className="search-results" role="listbox" aria-label="搜索结果">{searchResults.length ? searchResults.map((result) => <button key={`${result.kind}-${result.id}`} type="button" onClick={() => onSearchSelect(result)}><span>{result.title}</span><small>{result.meta}</small></button>) : <p>没有匹配内容</p>}</div> : null}</div>
        <div className="data-actions"><button className="secondary-button theme-toggle" type="button" onClick={onThemePreferenceCycle} aria-label={`外观模式：${themeLabels[themePreference]}。点击切换`} title={`外观模式：${themeLabels[themePreference]}`}><Icon name={themeIcons[themePreference]} size={18} /><span>{themeLabels[themePreference]}</span></button><label className="secondary-button file-button"><Icon name="upload" size={18} /><span>导入 JSON</span><input type="file" accept="application/json,.json" onChange={(event) => { const file = event.target.files?.[0]; if (file) onImport(file); event.target.value = ""; }} /></label><button className="secondary-button" type="button" onClick={onExport}><Icon name="download" size={18} /><span>导出 JSON</span></button></div>
      </header>
      <main className="main-content">{children}</main>
    </div>
    <nav className="mobile-nav" aria-label="移动端课程导航">{navigation.filter((item) => item.mobile !== false).map((item) => <button key={item.id} className={activeNavigationId === item.id ? "is-active" : ""} type="button" onClick={() => onNavigate(item.id)} aria-current={activeNavigationId === item.id ? "page" : undefined}><Icon name={item.icon} size={22} /><span>{item.mobileLabel}</span></button>)}</nav>
  </div>;
}
