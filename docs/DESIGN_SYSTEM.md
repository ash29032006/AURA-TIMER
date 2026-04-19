# 🎨 Aura Timer — Design System

> A comprehensive design token reference and component library for the Aura Timer application.

---

## Color Tokens

### Base Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#050510` | App background |
| `--foreground` | `#f8fafc` | Primary text |
| `--muted` | `#1e293b` | Muted surfaces |
| `--muted-foreground` | `#94a3b8` | Secondary text |
| `--border` | `#334155` | Default borders |
| `--card` | `#1e293b` | Card backgrounds |
| `--accent` | `#185FA5` | Global accent |

### Theme Color System

Each project theme defines a complete color set:

| Token | Coding | Design | Writing | Ideation | Life Admin |
|-------|--------|--------|---------|----------|------------|
| `primary` | `#22d3ee` | `#f472b6` | `#fbbf24` | `#a78bfa` | `#34d399` |
| `secondary` | `#0891b2` | `#db2777` | `#d97706` | `#7c3aed` | `#059669` |
| `glow` | `rgba(34,211,238,0.6)` | `rgba(244,114,182,0.6)` | `rgba(251,191,36,0.6)` | `rgba(167,139,250,0.6)` | `rgba(52,211,153,0.6)` |
| `gradient` | Cyan→Blue | Pink→Rose | Amber→Orange | Violet→Purple | Emerald→Green |

### Opacity Scale

Used for layered glass effects:

| Level | Value | Usage |
|-------|-------|-------|
| `05` | 5% | Subtle hover backgrounds |
| `10` | 10% | Card backgrounds, borders |
| `15` | 15% | Glassmorphic panels |
| `20` | 20% | Active nav items |
| `30` | 30% | Button borders |
| `40` | 40% | Sub-text, icons |
| `60` | 60% | Labels |
| `80` | 80% | Primary text |

---

## Typography

### Font Stack

| Role | Font Family | Fallback |
|------|-------------|----------|
| **Body** | Inter | system-ui, -apple-system, sans-serif |
| **Display** | Georgia | serif |
| **Monospace** | SF Mono | Fira Code, JetBrains Mono, monospace |
| **Variable** | Roboto Flex | sans-serif |

### Type Scale

| Name | Size | Weight | Letter Spacing | Usage |
|------|------|--------|----------------|-------|
| **Display XL** | `text-7xl` (72px) | extralight (200) | `-0.05em` | Timer digits |
| **Display** | `text-5xl` (48px) | extralight (200) | `-0.05em` | Stat values |
| **Heading 1** | `text-4xl` (36px) | light (300) | `0.025em` | Page titles |
| **Heading 2** | `text-2xl` (24px) | light (300) | `0.025em` | Section headings |
| **Heading 3** | `text-lg` (18px) | light (300) | `0.025em` | Card titles |
| **Label XS** | `text-xs` (12px) | semibold (600) | `0.2em` | Stat labels (uppercase) |
| **Label XXS** | `text-[10px]` | semibold (600) | `0.25em` | Column headers (uppercase) |
| **Body** | `text-sm` (14px) | normal (400) | `0.025em` | Descriptions |
| **Caption** | `text-xs` (12px) | medium (500) | `0.1em` | Deltas, badges |

---

## Spacing

### Base Grid: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `gap-1` | 4px | Tight spacing |
| `gap-2` | 8px | Icon gaps |
| `gap-3` | 12px | Card inner gaps |
| `gap-4` | 16px | Grid gaps |
| `gap-5` | 20px | Card gaps |
| `gap-6` | 24px | Section gaps |
| `gap-8` | 32px | Major sections |
| `gap-12` | 48px | Timer margins |

### Padding

| Size | Value | Usage |
|------|-------|-------|
| `p-1.5` | 6px | Tab container |
| `p-3` | 12px | Dropdown container |
| `p-5` | 20px | Card inner, project cards |
| `p-6` | 24px | Stat cards, chart panels |
| `p-7` | 28px | Sidebar header |
| `p-8` | 32px | Settings sections |
| `p-10` | 40px | Modal content |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-full` | 9999px | Buttons, pills, dots |
| `rounded-3xl` | 24px | Cards, stat panels |
| `rounded-[2rem]` | 32px | Settings sections |
| `rounded-[2.5rem]` | 40px | Modals |
| `rounded-2xl` | 16px | Nav items, inputs |
| `rounded-xl` | 12px | Icon containers, badges |
| `rounded-[3px]` | 3px | Heatmap cells |

---

## Shadows

| Name | Value | Usage |
|------|-------|-------|
| **Card** | `0 8px 32px rgba(0,0,0,0.3)` | Standard cards |
| **Elevated** | `0 20px 60px rgba(0,0,0,0.6)` | Dropdowns, modals |
| **Modal** | `0 30px 60px -15px rgba(0,0,0,0.8)` | Session complete dialog |
| **Nav** | `0 8px 32px 0 rgba(0,0,0,0.6)` | Mobile bottom nav |
| **Glow** | `0 0 20px {theme.primary}20` | Theme-aware glow |
| **Button Active** | `0 0 40px {theme.primary}40` | Play button when active |
| **Inner** | `inset 0 2px 4px rgba(255,255,255,0.2)` | Button depth |

---

## Component Library

### Interactive Components

| Component | Description | Props |
|-----------|-------------|-------|
| **TiltCard** | 3D perspective tilt on hover | `glowColor`, `intensity`, `className` |
| **SpotlightCard** | Mouse-tracking radial spotlight | `spotlightColor`, `className` |
| **MagneticButton** | Button that magnetically follows cursor | `onClick`, `ariaLabel`, `className` |
| **FloatingShape** | Animated CSS 3D shape | `shape`, `color`, `size` |
| **ShinyText** | Traveling shimmer text effect | `text`, `speed`, `color`, `shineColor` |
| **AnimatedCounter** | Spring-animated number transitions | `value`, `suffix`, `decimals` |

### Layout Components

| Component | Description |
|-----------|-------------|
| **Layout** | App shell with sidebar nav, theme background, skip-nav |
| **PageTransition** | Route transition wrapper with fade+slide |
| **Toast / ToastProvider** | Context-based toast notifications |

### WebGL Components

| Component | Technology | Description |
|-----------|------------|-------------|
| **SoftAurora** | OGL | 3D Perlin noise aurora borealis shader |
| **MagicRings** | Three.js | Procedural animated ring shader |

---

## Glassmorphism Recipe

```css
/* Standard glass panel */
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.10);
border-radius: 24px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

/* Enhanced glass with theme glow */
background: linear-gradient(135deg, {primary}15, transparent);
border-color: {primary}30;
box-shadow: 0 0 30px {primary}15;
```

---

## Design Principles

1. **Dark-first** — All designs start from `#050510` background
2. **Themed everything** — Colors, shapes, glows adapt to active project
3. **Glass over solid** — Prefer glassmorphism and transparency over opaque surfaces
4. **Motion with purpose** — Every animation has a functional reason
5. **Typographic hierarchy** — Extreme weight contrast (extralight ↔ semibold)
6. **Generous whitespace** — Let elements breathe with ample padding
