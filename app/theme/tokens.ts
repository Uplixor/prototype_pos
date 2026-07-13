/**
 * Design tokens — Precision Commerce (Stitch).
 * Values map to CSS custom properties in app.css.
 */

export const colors = {
  primary: {
    DEFAULT: "var(--color-primary)",
    foreground: "var(--color-primary-foreground)",
    hover: "var(--color-primary-hover)",
    muted: "var(--color-primary-muted)",
  },
  chart: {
    revenue: "var(--color-chart-revenue)",
    profit: "var(--color-chart-profit)",
    inventory: "var(--color-chart-inventory)",
    returns: "var(--color-chart-returns)",
    expenses: "var(--color-chart-expenses)",
    series: [
      "var(--color-chart-revenue)",
      "var(--color-chart-2)",
      "var(--color-chart-3)",
      "var(--color-chart-4)",
      "var(--color-chart-profit)",
    ],
  },
  status: {
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    danger: "var(--color-danger)",
    info: "var(--color-info)",
  },
} as const;

export const spacing = {
  unit: 8,
  page: "var(--spacing-page)",
  section: "var(--spacing-section)",
  stack: "var(--spacing-stack)",
  inline: "var(--spacing-inline)",
} as const;

export const radius = {
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
} as const;

export const motion = {
  duration: {
    fast: 150,
    base: 200,
    slow: 300,
  },
  easing: {
    default: "cubic-bezier(0.2, 0, 0, 1)",
  },
} as const;

export const density = {
  compact: "compact",
  comfortable: "comfortable",
  spacious: "spacious",
} as const;

export type Density = (typeof density)[keyof typeof density];

export const zIndex = {
  dropdown: 50,
  sticky: 40,
  overlay: 50,
  modal: 100,
  toast: 110,
  command: 120,
} as const;

export const layout = {
  sidebarWidth: 256,
  sidebarCollapsedWidth: 56,
  topbarHeight: 48,
  drawerWidth: {
    sm: 400,
    md: 520,
    lg: 640,
  },
} as const;
