import { useEffect, useRef } from 'react';
import { useInView } from '../../hooks/useAnimations';
import './TrustStrip.css';

interface StatConfig {
  value: number;
  suffix: string;
  prefix: string;
  label: string;
}

const stats: StatConfig[] = [
  { value: 12, suffix: 'M', prefix: '', label: 'nights guided' },
  { value: 47, suffix: ' min', prefix: '+', label: 'average extra sleep per night' },
  { value: 48, suffix: '★', prefix: '4.', label: 'App Store rating' },
  { value: 92, suffix: '%', prefix: '', label: 'fall asleep faster in week one' },
];

function StatPill({ stat }: { stat: StatConfig }) {
  const [inViewRef, inView] = useInView(0.3, true);
  const valRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current || !valRef.current) return;
    hasAnimated.current = true;

    const valEl = valRef.current;
    let startTime: number | null = null;
    const duration = 2000;
    const end = stat.value;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(easedProgress * end);

      // Format display
      let displayValue: string;
      if (stat.prefix === '4.') {
        displayValue = `${stat.prefix}${currentVal}${stat.suffix}`;
      } else if (stat.suffix === 'M') {
        const decimal = (currentVal / 10).toFixed(1);
        displayValue = `${stat.prefix}${decimal}${stat.suffix}`;
      } else {
        displayValue = `${stat.prefix}${currentVal}${stat.suffix}`;
      }

      valEl.textContent = displayValue;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Final format
        let finalValue: string;
        if (stat.prefix === '4.') {
          finalValue = `${stat.prefix}${end}${stat.suffix}`;
        } else if (stat.suffix === 'M') {
          finalValue = `${stat.prefix}${(end / 10).toFixed(1)}${stat.suffix}`;
        } else {
          finalValue = `${stat.prefix}${end}${stat.suffix}`;
        }
        valEl.textContent = finalValue;
      }
    };

    requestAnimationFrame(animate);
  }, [inView, stat]);

  // Initial text content
  const initialValue = stat.prefix === '4.'
    ? `${stat.prefix}0${stat.suffix}`
    : stat.suffix === 'M'
      ? `${stat.prefix}0.0${stat.suffix}`
      : `${stat.prefix}0${stat.suffix}`;

  return (
    <div className="trust-pill" ref={inViewRef}>
      <div className="trust-value" ref={valRef}>{initialValue}</div>
      <div className="trust-label">{stat.label}</div>
    </div>
  );
}

export default function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Key statistics">
      <div className="container">
        <div className="trust-grid">
          {stats.map((stat, i) => (
            <StatPill key={i} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
