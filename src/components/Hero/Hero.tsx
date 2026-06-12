import { useState, useEffect } from 'react';
import './Hero.css';

export default function Hero() {
  const [loadOrb, setLoadOrb] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadOrb(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero-content">
          <span className="hero-eyebrow animate-fade-in-up delay-1">
            Sleep reimagined
          </span>

          <h1 className="hero-title animate-slide-up delay-2">
            Sleep deeper.
            <br />
            Wake clearer.
          </h1>

          <p className="hero-subtitle animate-fade-in-up delay-3">
            Adaptive soundscapes, guided wind-downs, and 500+ sleep stories
            that learn your night and adjust in real time.
          </p>

          <div className="hero-actions animate-fade-in-up delay-4">
            <a href="#plan-builder" className="btn btn-primary">
              Start free trial
            </a>
            <a href="#how-it-works" className="btn btn-ghost">
              See how it works
            </a>
          </div>

          <div className={`hero-orb-wrapper ${loadOrb ? 'animate-scale-in' : ''}`} style={{ opacity: loadOrb ? 1 : 0 }}>
            <div className="hero-orb-glow" />
            {loadOrb && (
              <img
                src="/solace-hero-orb.svg"
                alt="Solace ambient breathing orb"
                width="340"
                height="340"
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
