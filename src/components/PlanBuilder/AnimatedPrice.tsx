import { useEffect, useRef, useState } from 'react';

interface AnimatedPriceProps {
  value: number; // in paise
  className?: string;
}

/**
 * Animated price counter that smoothly transitions between values.
 * Uses integer paise interpolation to avoid float drift.
 * Always settles on the exact final value.
 */
export default function AnimatedPrice({ value, className = '' }: AnimatedPriceProps) {
  const [displayPaise, setDisplayPaise] = useState(value);
  const prevValueRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const startPaise = prevValueRef.current;
    const endPaise = value;
    prevValueRef.current = value;

    if (startPaise === endPaise) return;

    const duration = 400; // ms
    let startTime: number | null = null;

    // Cancel any ongoing animation
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      // Interpolate in integer paise — no float drift
      const currentPaise = Math.round(
        startPaise + (endPaise - startPaise) * easedProgress
      );

      setDisplayPaise(currentPaise);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Always land on the exact value
        setDisplayPaise(endPaise);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value]);

  // Format paise to INR with grouping
  const rupees = displayPaise / 100;
  const formatted = rupees.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <span className={`tabular-nums ${className}`}>
      ₹{formatted}
    </span>
  );
}
