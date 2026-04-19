# ♿ Accessibility Audit (WCAG 2.2 AA)

Aura Timer is designed with an "Accessibility-First" mindset, ensuring the premium 3D experience remains usable for everyone.

## 🚀 Key Accessibility Features

### 1. Keyboard Navigation
- **Focus Indicators**: All interactive elements have high-visibility focus rings (`outline-white/40`) to ensure "where am I?" is never a question.
- **Skip Link**: A "Skip to main content" link is available for keyboard users to bypass navigation.
- **Shortcuts**: Global hotkeys (Space, R, S, 1-4) allow full control without a mouse.

### 2. Screen Reader Optimization
- **Semantic HTML**: Proper use of `<main>`, `<nav>`, `<aside>`, `<header>`, and `<section>`.
- **ARIA Live Regions**: The timer uses `role="timer"` and `aria-live="polite"` to announce time remaining at regular intervals.
- **Descriptive Labels**: Every icon-only button (like Play/Pause) includes a descriptive `aria-label`.
- **Tab Order**: Logically structured tab index follows the visual flow of the application.

### 3. Motion & Visuals
- **Reduced Motion**: Respects `prefers-reduced-motion`. All WebGL shaders, 3D tilts, and spring animations are disabled when the user has this preference enabled.
- **Contrast**: Meets WCAG AA contrast ratios for all critical text and navigation elements.
- **High Contrast Support**: Optimized for `forced-colors` mode (Windows High Contrast).

## 🛠 Testing Methodology
- **Automated**: Lighthouse / Axe DevTools.
- **Manual**: macOS VoiceOver testing for screen reader flow.
- **Keyboard-only**: Verified full usage flow without a mouse.

## 📈 Compliance Status
Current Status: **WCAG 2.2 Level AA Compliant**
Target: **WCAG 2.2 Level AAA (Contrast refinement in progress)**
