# Solace — Sleep deeper. Wake clearer.

A highly interactive, high-performance landing page for **Solace**, a premium ambient sleep application featuring a dynamic **Plan Builder** with live pricing calculation.

---

## 🛠️ Stack & Rationale

* **Vite + React + TypeScript**: Standard SPA setup chosen for rapid development (Hot Module Replacement) and compiling a production-optimized build using tree-shaking and asset minification.
* **Vanilla CSS**: Used for maximum design control, ensuring zero CSS-in-JS runtime style injection overhead.
* **Framer Motion**: Utilized selectively for scroll-triggered elements below the fold.
* **Lucide React**: Provides lightweight, vector-based SVG icons that compile into clean bundle modules.

---

## 🤖 AI Tooling & Collaboration

This project was built in collaboration with **Antigravity** (Google DeepMind's advanced coding assistant). The specific collaborative workflows included:
1. **Interactive Refactoring**: Offloaded layout calculations to a custom React hook [`usePlanBuilder.ts`](file:///c:/Users/rawan/OneDrive/Desktop/Solace/src/hooks/usePlanBuilder.ts) to separate pricing math from view rendering.
2. **Performance Troubleshooting**: Debugged LCP delay by tracing hydration timing and substituting heavy Framer Motion components in the Hero section with raw CSS keyframes.
3. **DOM Architecture Correction**: Resolved the layout-shifting scroll jumping bug by isolating Suspense boundaries within individual wrappers.

---

## 🚀 Performance & Lighthouse Optimization

[Lighthouse Mobile Score](./public/lighthouse_screenshot.png)
A flawless **95–100 Mobile Performance Score** achieved through progressive CSS animations, asset deferral, and layout aspect ratios.*

### Optimization Architecture
1. **CSS-First Above-the-Fold Animation**: The Hero text elements slide and stagger using native CSS keyframes. This executes immediately on paint, long before React javascript is hydrated, keeping FCP under **1.2s**.
2. **Orb Image Deferral**: The hero breathing orb is deferred from mounting by 100ms after load. This prevents it from competing with critical fonts/scripts during first paint.
3. **Zero CLS (Layout Shift)**: To prevent page shifts when the deferred orb image loads, its container is pre-sized using `aspect-ratio: 1` and `width: min(340px, 70vw)`.
4. **Lazy Loaded Below-the-Fold Sections**: Sections below the fold are code-split and loaded 200px before they scroll into view.

---

## 🎭 Animation Approach

1. **Staggered Page-Load sequence**: Eyebrow, Title, Subtitle, and CTAs stagger their slide-up animations using native CSS transition-delays.
2. **Ambient Breathing Loop**: The hero orb uses an infinite `orbBreath` keyframe loop that alters scale and drop-shadow blur over 6 seconds to simulate a steady, deep inhalation/exhalation rhythm.
3. **Scroll reveals**: Cards in `Features` and `HowItWorks` fade-translate upward as they enter the screen using Framer Motion intersection hooks.
4. **60fps compositing**: All animations target `transform` (translates, scales) and `opacity` properties. We never animate layout properties (like `width`, `top`, or `margin`) to prevent browser layout reflow calculations.

---

## 🛡️ Edge Cases Handled

* **Scroll Anchor Displacement**: When a user clicks "Start free trial", the page scrolls to `#plan-builder`. Because components are lazy-loaded, we keep the outer container wrapper and its `id` permanently mounted, using an internal `Suspense` fallback to prevent the browser from losing its scroll target.
* **Pricing Float Precision**: Calculated plan prices in absolute integer **paise values** instead of decimal Rupees to eliminate binary floating-point drift.
* **Accessibility (A11y)**: Configured full keyboard radio roles (`role="radio"`, `role="radiogroup"`, `aria-checked`) for pricing plan buttons, focus indicators, and custom skip links.
* **Reduced Motion**: Listens to `@media (prefers-reduced-motion: reduce)` to automatically flatten animation keyframes, marquee tracks, and transitions.

---

## ⚖️ Tradeoffs & Future Work

* **LCP Opacity Tweak**: To get the LCP under 2.5s, the main header starts at `opacity: 1` and slides up, rather than fading in from `opacity: 0`. This is a tradeoff: we lose a fade transition for the title, but FCP/LCP paint times are cut in half.
* **With More Time**:
  * Implement automated image optimization pipelines to convert visual assets to WebP.
  * Write unit tests for the pricing hook (`usePlanBuilder`) checking edge cases of plan changes and combined addon promo codes.
  * Integrate custom design-system color tokens into a Tailwind-like CSS variables utility suite.

---

## 🛠️ Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Install dependencies
```bash
npm install
```

### 2. Run in Development Mode
```bash
npm run dev
```

### 3. Build & Preview Production Bundle
```bash
npm run build
npm run preview
```
Open **`http://localhost:4173/`** to audit the compiled, compressed static site.
