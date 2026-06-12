import { motion } from 'framer-motion';
import { AudioLines, BookOpen, Moon, Sun } from 'lucide-react';
import './Features.css';

const features = [
  {
    icon: AudioLines,
    title: 'Adaptive Soundscapes',
    description:
      'Audio that shifts with your sleep stage. Never jarring, always just enough.',
  },
  {
    icon: BookOpen,
    title: '500+ Sleep Stories',
    description:
      'Narrated journeys, from rain-soaked forests to slow trains across Europe.',
  },
  {
    icon: Moon,
    title: 'Wind-Down Rituals',
    description:
      'Personalised routines that quietly tell your body the day is done.',
  },
  {
    icon: Sun,
    title: 'Morning Insights',
    description:
      'A gentle read on your night, with one small thing to try tonight.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  }),
};

export default function Features() {
  return (
    <section className="features section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Features</span>
          <h2 className="section-title">Everything you need to sleep better</h2>
          <p className="section-subtitle centered">
            Built around the science of sleep, designed to feel like a gentle
            nudge — not a chore.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="feature-card"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={i}
              >
                <div className="feature-icon">
                  <Icon size={24} strokeWidth={1.8} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
