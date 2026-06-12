import './Testimonials.css';

const testimonials = [
  {
    quote:
      "Three weeks in, I slept through the night for the first time in years.",
    author: 'Aanya R.',
    location: 'Bengaluru',
  },
  {
    quote:
      "The wind-down ritual is the only bedtime habit that ever stuck.",
    author: 'Daniel M.',
    location: 'London',
  },
  {
    quote:
      "I stopped doom-scrolling at midnight. That alone was worth it.",
    author: 'Priya S.',
    location: 'Mumbai',
  },
];

// Duplicate for seamless loop
const duplicatedTestimonials = [...testimonials, ...testimonials];

export default function Testimonials() {
  return (
    <section className="testimonials section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Testimonials</span>
          <h2 className="section-title">Loved by sleepers everywhere</h2>
          <p className="section-subtitle centered">
            Real stories from people who transformed their nights with Solace.
          </p>
        </div>
      </div>

      <div className="testimonials-track-wrapper">
        <div
          className="testimonials-track"
          aria-label="Testimonials carousel"
          role="marquee"
        >
          {duplicatedTestimonials.map((t, i) => (
            <div
              key={i}
              className="testimonial-card"
              tabIndex={0}
              aria-label={`Testimonial from ${t.author}`}
            >
              <div className="testimonial-stars" aria-hidden="true">
                ★★★★★
              </div>
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <strong>{t.author}</strong>, {t.location}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
