import { motion } from 'framer-motion';
import './HowItWorks.css';

const steps = [
  {
    number: 1,
    title: 'Tell us about your nights.',
    description: 'A two-minute check-in sets your baseline.',
  },
  {
    number: 2,
    title: 'Drift off, guided.',
    description: 'Pick a story, or let Solace choose for you.',
  },
  {
    number: 3,
    title: 'Wake to insight.',
    description: 'See what worked, and what to adjust.',
  },
];

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  }),
};

export default function HowItWorks() {
  return (
    <section className="how-it-works section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">How it works</span>
          <h2 className="section-title">Three steps to better sleep</h2>
          <p className="section-subtitle centered">
            No complicated setup. Just a few minutes before bed, and let Solace
            do the rest.
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="step-card"
              variants={stepVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
            >
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
