import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import Hero from './components/Hero/Hero';
import TrustStrip from './components/TrustStrip/TrustStrip';

// Lazy load below-the-fold components
const Features = lazy(() => import('./components/Features/Features'));
const HowItWorks = lazy(() => import('./components/HowItWorks/HowItWorks'));
const PlanBuilder = lazy(() => import('./components/PlanBuilder/PlanBuilder'));
const Testimonials = lazy(() => import('./components/Testimonials/Testimonials'));
const FAQ = lazy(() => import('./components/FAQ/FAQ'));
const FooterCTA = lazy(() => import('./components/FooterCTA/FooterCTA'));

interface LazySectionProps {
  children: React.ReactNode;
  placeholderHeight: string;
  id?: string;
}

function LazySection({ children, placeholderHeight, id }: LazySectionProps) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const forceLoad = () => {
      setInView(true);
    };

    window.addEventListener('force-lazy-load', forceLoad);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Load 200px before scrolling into view
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('force-lazy-load', forceLoad);
    };
  }, []);

  return (
    <div ref={ref} id={id}>
      {inView ? (
        <Suspense fallback={<div style={{ height: placeholderHeight, opacity: 0 }} />}>
          {children}
        </Suspense>
      ) : (
        <div style={{ height: placeholderHeight, opacity: 0 }} />
      )}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const handleHashClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        // Trigger instant mounting of all dynamic sections before the scroll calculation happens
        window.dispatchEvent(new CustomEvent('force-lazy-load'));
      }
    };

    document.addEventListener('click', handleHashClick);
    return () => document.removeEventListener('click', handleHashClick);
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header>
        <Hero />
      </header>

      <main id="main-content">
        <TrustStrip />
        <LazySection placeholderHeight="900px" id="features">
          <Features />
        </LazySection>
        <LazySection placeholderHeight="650px" id="how-it-works">
          <HowItWorks />
        </LazySection>
        <LazySection placeholderHeight="850px" id="plan-builder">
          <PlanBuilder />
        </LazySection>
        <LazySection placeholderHeight="450px" id="testimonials">
          <Testimonials />
        </LazySection>
        <LazySection placeholderHeight="650px" id="faq">
          <FAQ />
        </LazySection>
        <LazySection placeholderHeight="550px" id="footer-cta">
          <FooterCTA />
        </LazySection>
      </main>
    </>
  );
}
