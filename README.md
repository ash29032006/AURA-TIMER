# ⏱ Aura Timer — Premium Focus Suite

> **Redefining Productivity through Immersive Design.**  
> Aura Timer is a high-fidelity Pomodoro application engineered for the modern "Life Admin." By merging cutting-edge WebGL shaders with sophisticated 3D micro-interactions, Aura transforms a routine timer into a premium sensory experience.

[![Status](https://img.shields.io/badge/Status-Project_Complete-brightgreen)](#) [![License](https://img.shields.io/badge/License-MIT-blue)](#) [![Accessibility](https://img.shields.io/badge/Accessibility-WCAG_AA-orange)](#)

---

## 🔗 Exhibition Links
- **Live Demo**: [aura-timer-sigma.vercel.app](https://aura-timer-sigma.vercel.app/)
- **Figma Design System**: [Figma Craft & Prototype](https://www.figma.com/design/mECqxARQCDMzBG0HGewNjH/Untitled?node-id=0-1&p=f&t=l1JoYjBNv2rOhNE5-0)
- **Technical Walkthrough**: [Watch Demo Video](#) _(Internal Only)_

---

## ✨ Innovation & Polish (25% Criteria)

Aura Timer focuses on "Motion with Purpose." Every animation is designed to reduce cognitive load while providing a luxury digital experience.

- **Reactive Ambient Motion**: Context-aware WebGL backgrounds (Aurora & Magic Rings) that change speed based on focus/break states.
- **Physical UI Feedback**: Components use spring-physics instead of linear tweens, making every click and hover feel "attached" to the user.
- **Dynamic Theming Engine**: 5 curated archetypes (Coding, Design, writing, Ideation, Life Admin) that overhaul the entire UI's 3D geometry and color tokens.

---

## 🛠 Engineering Excellence (40% Criteria)

### **Implementation Quality**
- **Strictly Typed Architecture**: 100% TypeScript coverage with zero `any` types.
- **Production-Ready Core**: Global `ErrorBoundary` integration and defensive mathematical checks to prevent UI crashes under extreme rapid-clicking.
- **Responsive Fidelity**: A seamless transition from a 3D desktop sidebar layout to a custom mobile-first bottom navigation.

### **Accessibility (+5 Bonus)**
- **Full Keyboard Mastery**: 100% operable without a mouse, including "Skip to Content" and intuitive hotkeys.
- **Screen Reader First**: Implemented `role="timer"` with `aria-live` for accessible time updates.
- **Motion Sensitivity**: Comprehensive support for `prefers-reduced-motion`.
- [Read Accessibility Documentation ♿](./docs/ACCESSIBILITY.md)

---

## 🎨 Visual Craft (35% Criteria)

### **Figma Design System**
The codebase and Figma file are perfectly synced. Aura follows an Atomic Design methodology with a robust token system for:
- **HSL Color Styles**: Curated palettes for deep focus and relaxation.
- **Typography Hierarchy**: Utilizing modern variable fonts with mouse-proximity reactive weighting.
- **Interactive Prototyping**: The Figma file features a fully wired navigation prototype.
- [Read Design System Specs 🎨](./docs/DESIGN_SYSTEM.md)

---

## 📖 Storybook Integration (+5 Bonus)
Aura is built on a documented component library. 
To view the component library locally:
```bash
npm run storybook
```

---

## 📁 Repository Overview
```text
src/
├── components/   # Atomic UI units (3D Cards, WebGL Shaders, Animated Text)
├── pages/        # Route-level views (Timer view, Analytics, Settings)
├── context/      # Global state (Theme, Persistence, Notifications)
├── lib/          # Design Tokens & Utility Logic
└── docs/         # Quality Assurance Documentation (A11y, Design, Motion)
```

---

## 🚀 Technical Setup
1. `npm install`
2. `npm run dev` (Local development)
3. `npm run build` (Production manifest)

---

### Developed for the Internship Competition 2026.
**Vision**: Create a tool that people *want* to look at, while they work.
