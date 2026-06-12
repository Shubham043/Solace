import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Animated count-up hook. Counts from 0 to `end` over `duration` ms.
 * Only starts when `shouldStart` is true (use with Intersection Observer).
 * Uses requestAnimationFrame for smooth 60fps animation.
 */
export function useCountUp(
  end: number,
  duration: number = 2000,
  shouldStart: boolean = false
): number {
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!shouldStart || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number | null = null;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for natural deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(easedProgress * end));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        // Ensure we land on the exact value
        setValue(end);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration, shouldStart]);

  return value;
}

/**
 * Intersection Observer hook for triggering animations on scroll.
 */
export function useInView(
  threshold: number = 0.2,
  triggerOnce: boolean = true
): [React.RefCallback<Element>, boolean] {
  const [inView, setInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<Element | null>(null);

  const setRef = useCallback(
    (node: Element | null) => {
      // Cleanup previous observer
      if (observerRef.current && elementRef.current) {
        observerRef.current.unobserve(elementRef.current);
      }

      if (node) {
        observerRef.current = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setInView(true);
              if (triggerOnce && observerRef.current) {
                observerRef.current.unobserve(node);
              }
            } else if (!triggerOnce) {
              setInView(false);
            }
          },
          { threshold }
        );
        observerRef.current.observe(node);
        elementRef.current = node;
      }
    },
    [threshold, triggerOnce]
  );

  return [setRef, inView];
}

/**
 * Debounce hook — returns debounced value after delay.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Check if user prefers reduced motion.
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}
