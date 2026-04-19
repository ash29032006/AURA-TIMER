# 🎬 Animation Architecture

Aura Timer uses a layered animation strategy to achieve a "premium" feel while maintaining 60FPS performance across devices.

## 🛠 Technology Stack
- **Framer Motion 12**: Spring physics-based UI transitions and layout animations.
- **Three.js / OGL**: WebGL vertex and fragment shaders for background ambient motion.
* **Canvas API**: High-performance particle systems.

## 🌊 Animation Layers

### 1. Ambient WebGL (Background)
- **SoftAurora (OGL)**: A custom fragment shader using 3D Perlin noise to simulate a flowing aurora borealis.
- **MagicRings (Three.js)**: A procedural ring generator that reacts to mouse proximity with subtle parallax.

### 2. Physical UI (Interactions)
- **TiltCard**: Uses `useSpring` and `useTransform` to rotate elements based on relative mouse position, creating a 3D "glass" lift effect.
- **MagneticButton**: A "sticky" interaction where buttons pull toward the cursor, easing the click target.
- **SpotlightCard**: Dynamic radial gradients that follow the cursor to highlight content.

### 3. State Transitions
- **PageTransitions**: Standardized fade/slide/blur variants used for all route changes.
- **LayoutID Transitions**: Shared element transitions for navigation indicators and active tabs.

## ⚡ Performance Optimization
- **Hardware Acceleration**: All UI animations use `transform` and `opacity` to avoid layout thrashing.
- **Passive Listeners**: Mouse events are optimized for low-latency tracking.
- **Reduced Motion Support**: Hooked into `prefers-reduced-motion` to strip all heavy motion for sensitive users.
