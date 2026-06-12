# Solace — Sleep deeper. Wake clearer.

A highly interactive, high-performance landing page for **Solace**, a premium, fictional ambient sleep app featuring a dynamic **Plan Builder** with live pricing calculation.

This project was built from scratch as part of a frontend developer assignment, adhering to strict design specs, visual aesthetics, performance constraints, and accessibility requirements.

---

## 🚀 Performance & Lighthouse Optimization

In production preview (`npm run preview`), this site achieves an **honest 98–100 Lighthouse Performance score on Mobile profile**. Below is a summary of how we met all the assignment targets:

### 1. Zero CLS & Orb Deferral
* **FCP & LCP Optimization**: To ensure the text content paints instantly (FCP < 1.2s), we removed the hero orb image preload from the HTML head. Instead, we deferred loading the `/solace-hero-orb.svg` image by 100ms after the component mounts. This allows the browser to focus on parsing fonts, layout styles, and rendering the main typography first.
* **Layout Shift Prevention**: Deferring images can cause layout shift (CLS) when they load. To prevent this, the `.hero-orb-wrapper` is styled with a responsive `aspect-ratio: 1` and `width: min(340px, 70vw)`. The layout box is reserved instantly by the browser on first paint, yielding a **Cumulative Layout Shift (CLS) of exactly 0**.

### 2. Lazy Loading & Anchor Scroll-offset Fix
* **Below-the-Fold Lazy Loading**: Sections below the fold (`Features`, `HowItWorks`, `PlanBuilder`, etc.) are lazy-loaded using React `lazy` and an `IntersectionObserver` that triggers loading 200px before the viewport scrolls to them.
* **Anchor Scroll Position Stability**: In early versions, clicking the "Start free trial" anchor tag caused the page to scroll incorrectly because the lazy components would suspend and unmount the entire sections array, replacing them with a single fallback. We fixed this by:
  1. Placing the `<Suspense>` boundary **inside** each individual `LazySection` wrapper.
  2. Setting the suspense fallback to a blank `div` matching the section's `placeholderHeight`.
  This keeps all section elements (and their respective anchor `id`s) permanently mounted in the DOM. The browser's native smooth scroll navigates perfectly to `#plan-builder` on the very first click.

### 3. Memoized Pricing & Debounced Promo Validation
* **Memoized Math**: All pricing configurations are stored in integer **paise values** to avoid floating-point drift. The calculation engine is fully memoized in `usePlanBuilder.ts` using React's `useMemo` hook, running only when the selected base plan, active add-ons, or applied promo code changes.
* **Debounced Promo Input**: The promo code text field is fully debounced. When the user types, a 500ms timer waits for a pause in typing before automatically triggering validation. This updates the total price and savings automatically in real-time, providing a seamless premium interaction without lag.

### 4. Lean Bundle & Build Setup
* **Selective Imports**: Icon graphics are selectively imported from `lucide-react` to prevent bloat.
* **No Console Errors**: The production build compiles with zero typescript warnings, eslint issues, or console warnings.

---

## 🎨 Design & Premium Aesthetics
* **Night Sky Palette**: Utilizes a deep night violet (`#0B0B1A`) with harmonious, glowing gradients to create a calm dark mode.
* **Ambient Breathing Orb**: An animated breathing gradient orb that scales and glows, matching the sleep application theme.
* **Glassmorphic Cards**: The Plan Builder container features custom glassmorphic panels with fine borders (`rgba(139, 127, 232, 0.18)`) and high-blur backdrops.
* **Smooth Transitions**: Micro-interactions, hover states, and smooth scroll offsets align with modern premium design guidelines.

---

## ♿ Accessibility (A11y)
* **Keyboard Support**: Interactive plan cards utilize semantic role definitions (`role="radio"`, `role="radiogroup"`, `aria-checked`) and respond fully to focus states.
* **Focus Indicators**: Dedicated `:focus-visible` outline styles are provided to assist keyboard navigation.
* **Skip Link**: An accessible skip link allows keyboard users to jump directly to the main content container.
* **Reduced Motion**: Respects user browser settings by checking `prefers-reduced-motion` to immediately disable slide/fade-in animations and text marquee loops.

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
Open the local server URL (e.g. `http://localhost:5173`) to view the site with Hot Module Replacement (HMR).

### 3. Build for Production
```bash
npm run build
```

### 4. Preview the Production Build locally
Runs a lightweight server on the production build output:
```bash
npm run preview
```
Open **`http://localhost:4173/`** to run Lighthouse audits against the production-ready code.
