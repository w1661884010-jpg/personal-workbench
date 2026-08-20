import type { SVGProps } from "react";

export type IconName =
  | "calendar"
  | "route"
  | "chip"
  | "notebook"
  | "clock"
  | "cloud"
  | "question"
  | "arrow"
  | "check"
  | "circle"
  | "warning"
  | "chevron"
  | "book"
  | "power"
  | "input"
  | "output"
  | "timer"
  | "wave"
  | "download"
  | "upload"
  | "database"
  | "save"
  | "trash"
  | "info"
  | "plus"
  | "close"
  | "search"
  | "menu"
  | "edit";

export function Icon({
  name,
  size = 24,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    ...props,
  };

  const paths: Record<IconName, React.ReactNode> = {
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    route: (
      <>
        <circle cx="6" cy="18" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <path d="M8.5 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3" />
      </>
    ),
    chip: (
      <>
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
        <path d="M10 10h4v4h-4z" />
      </>
    ),
    notebook: (
      <>
        <path d="M6 3h12a2 2 0 0 1 2 2v16H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M8 3v18M11 8h5M11 12h5M11 16h3" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    cloud: (
      <>
        <path d="M7.5 18H18a4 4 0 0 0 .6-7.95A6.5 6.5 0 0 0 6.2 8.4 4.8 4.8 0 0 0 7.5 18Z" />
        <path d="m9.5 12 2 2 4-4" />
      </>
    ),
    question: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.8 9a2.3 2.3 0 1 1 3.7 1.8c-.9.7-1.5 1.1-1.5 2.2M12 17h.01" />
      </>
    ),
    arrow: <path d="M5 12h14M14 7l5 5-5 5" />,
    check: <path d="m5 12 4 4L19 6" />,
    circle: <circle cx="12" cy="12" r="8" />,
    warning: (
      <>
        <path d="M10.2 4.7 2.8 18a2 2 0 0 0 1.8 3h14.8a2 2 0 0 0 1.8-3L13.8 4.7a2 2 0 0 0-3.6 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
    chevron: <path d="m8 10 4 4 4-4" />,
    book: (
      <>
        <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v18H7.5A3.5 3.5 0 0 0 4 23Z" />
        <path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H12v18h4.5A3.5 3.5 0 0 1 20 23Z" />
      </>
    ),
    power: (
      <>
        <path d="M12 3v8" />
        <path d="M7.1 5.7a8 8 0 1 0 9.8 0" />
      </>
    ),
    input: (
      <>
        <path d="M3 12h12M10 7l5 5-5 5" />
        <path d="M17 5h4v14h-4" />
      </>
    ),
    output: (
      <>
        <path d="M21 12H9M14 7l-5 5 5 5" />
        <path d="M7 5H3v14h4" />
      </>
    ),
    timer: (
      <>
        <circle cx="12" cy="13" r="8" />
        <path d="M9 2h6M12 5v3M12 13l3-2" />
      </>
    ),
    wave: <path d="M2 12h3l2-6 4 12 3-9 2 6h6" />,
    download: (
      <>
        <path d="M12 3v12M7 10l5 5 5-5" />
        <path d="M4 20h16" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4M7 9l5-5 5 5" />
        <path d="M4 20h16" />
      </>
    ),
    database: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
      </>
    ),
    save: (
      <>
        <path d="M5 3h12l2 2v16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M7 3v6h8V3M8 21v-7h8v7" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 3h6l1 4H8l1-4ZM7 7l1 14h8l1-14" />
        <path d="M10 11v6M14 11v6" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6M12 7h.01" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m16.5 16.5 4 4" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    edit: (
      <>
        <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" />
        <path d="m13.8 7.7 2.5 2.5" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}
