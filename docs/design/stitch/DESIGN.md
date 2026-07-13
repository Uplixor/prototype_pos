---
name: Precision Commerce
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  surface-primary: '#FFFFFF'
  surface-secondary: '#F8FAFC'
  border-subtle: '#E2E8F0'
  border-strong: '#CBD5E1'
  text-heading: '#0F172A'
  text-body: '#334155'
  text-muted: '#64748b'
  status-success: '#10b981'
  status-warning: '#f59e0b'
  status-error: '#ef4444'
  status-info: '#0ea5e9'
typography:
  display-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.02em
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-xs:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-page: 24px
---

## Brand & Style

The design system is a high-performance framework engineered for professional operators in the B2B commerce space. It prioritizes **functional density** and **operational velocity**, drawing inspiration from developer-centric tools and financial interfaces. The aesthetic is "Workhorse Premium"—minimalist, sharp, and intentionally understated to allow complex data to take center stage.

The design movement is **Corporate Modern with Minimalist influences**. It leverages a "UI as a Utility" philosophy, characterized by:
- **High Information Density:** Reducing white space in favor of data visibility, ensuring operators can scan hundreds of rows without excessive scrolling.
- **Keyboard-First Navigation:** Treating the command palette and shortcuts as primary, not secondary, navigation methods.
- **Precision Engineering:** Utilizing thin 1px strokes, rigid grid alignment, and a cold, professional color palette to evoke a sense of reliability and architectural stability.

## Colors

This design system utilizes a **Neutral-Dominant Palette** with strategic indigo accents. The color architecture is designed to minimize eye strain during 8-hour shifts while providing clear visual cues for interactivity and status.

- **Primary Indigo (#4f46e5):** Reserved exclusively for primary actions, focus states, and active navigation markers. It should be used sparingly to maintain its signal strength.
- **Slate/Gray Neutrals:** Form the backbone of the UI. Use `surface-secondary` for sidebars and table headers to create subtle contrast against the `white` primary work surfaces.
- **Semantic Colors:** Status badges for inventory (Low Stock, In-Transit) and orders (Pending, Shipped) use medium-saturation tones with low-opacity backgrounds to ensure text remains legible without overwhelming the data grid.

## Typography

The typographic system is built on **Inter**, chosen for its exceptional legibility at small sizes. The scale is intentionally compact to support high data density.

- **Body Text:** The standard UI text is set at 13px. This is the "sweet spot" for enterprise platforms that require a balance between readability and information volume.
- **Secondary/Utility:** 12px is used for table headers, metadata, and breadcrumbs.
- **Labels:** Use `label-xs` for status badges and small category tags to provide high contrast through uppercase styling and increased letter spacing.
- **Monospace:** Use a monospace font (fallback: Courier Prime) for SKU numbers, tracking IDs, and financial values in tables to ensure vertical alignment of digits.

## Layout & Spacing

The system follows a strict **8px grid** (with a 4px half-step for micro-adjustments). Layouts are designed to be "Fixed-Fluid"—sidebars and drawers have fixed widths to ensure predictability, while the primary data grid scales to fill the viewport.

- **High-Density Tables:** Use 8px vertical padding (sm) for table cells.
- **Drawers:** Slide-out panels should be 400px (standard) or 640px (large) wide, maintaining a consistent 24px internal margin.
- **Sticky Elements:** Table headers and primary page actions are sticky to the top of their respective containers, ensuring "context awareness" even during deep vertical scrolls.
- **Breakpoints:**
  - **Desktop (Default):** 1280px+ (Main operating environment).
  - **Tablet:** 768px - 1279px (Responsive reflow of grid columns).
  - **Mobile:** Not the primary target, but supported via full-width drawer overlays and stacked metrics.

## Elevation & Depth

Elevation in the design system is communicated through **tonal layering** and **refined outlines** rather than aggressive shadows. This keeps the interface "flat" and fast.

- **Tier 0 (Background):** `surface-secondary` (#F8FAFC). Used for the base background of the application.
- **Tier 1 (Surface):** `white` (#FFFFFF). Used for cards, table rows, and primary content areas. Separated by 1px `border-subtle`.
- **Tier 2 (Sticky/Navigation):** Uses a slightly more prominent 1px `border-strong` or a very soft ambient shadow (2px blur, 0.05 opacity) to indicate they sit above the content.
- **Tier 3 (Overlay):** Drawers and Command Palettes use a "Medium Depth" shadow (12px blur, 0.1 opacity) and a backdrop blur (8px) to focus the user's attention while maintaining spatial context.

## Shapes

The shape language is **Soft (0.25rem / 4px)**. This provides a professional, "tooled" look that feels more modern than sharp 90-degree corners but avoids the playfulness of fully rounded "pill" shapes.

- **Primary Components:** Buttons, Input fields, and Checkboxes use a 4px radius.
- **Status Badges:** Use a slightly larger 6px radius or a full pill-shape for distinct visual differentiation from buttons.
- **Cards/Containers:** Use 6px (`rounded-lg`) for external containers to create a "nested" aesthetic when 4px components are placed inside them.

## Components

### Buttons
- **Primary:** Solid Indigo background, white text. 4px radius. Height: 32px (standard) or 28px (compact).
- **Secondary:** White background, 1px `border-strong`, text-body. 
- **Ghost:** No background/border until hover. Used for table row actions.

### Data Tables
- **Header:** `surface-secondary` background, 12px Medium weight text, `border-subtle` bottom stroke.
- **Rows:** 36px minimum height. Hover state uses a 10% indigo tint or `surface-secondary`.
- **Cells:** Monospace for numbers. Truncation with tooltips for long product names.

### Command Palette (Ctrl+K)
- Centered modal. 640px width.
- Search input at the top (no border, large font).
- Results categorized by section (Orders, Customers, Settings).
- Keyboard shortcuts displayed in `mono-sm` on the right side of results.

### Status Badges
- Low-contrast backgrounds (e.g., Shipped = 10% Green background, 100% Green text).
- Compact padding (2px top/bottom, 8px left/right).

### Input Fields
- 1px `border-strong` defaults. Focus state: 1px Indigo border with a 2px Indigo "glow" (ring) at 20% opacity.
- Labels are 12px Medium weight, positioned 4px above the input.