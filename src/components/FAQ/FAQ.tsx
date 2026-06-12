import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import './FAQ.css';

const faqs = [
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes. Monthly and annual plans cancel from settings; annual is refundable pro-rata in the first 14 days.',
  },
  {
    question: 'Does it work offline?',
    answer:
      'Downloaded stories and soundscapes play offline; insights sync when you reconnect.',
  },
  {
    question: 'What about my data?',
    answer:
      'Sleep data is encrypted and never sold. Export or delete it anytime.',
  },
  {
    question: 'Which devices are supported?',
    answer: 'iOS 15+, Android 10+, and the web player.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes, 7 days, no card required.',
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section className="faq section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">FAQ</span>
          <h2 className="section-title">Questions? We've got answers.</h2>
        </div>

        <motion.div
          className="faq-list"
          role="list"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            const contentId = `faq-content-${i}`;
            const triggerId = `faq-trigger-${i}`;

            return (
              <div
                key={i}
                className={`faq-item ${isOpen ? 'open' : ''}`}
                role="listitem"
              >
                <button
                  id={triggerId}
                  className="faq-trigger"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  type="button"
                >
                  <span>{faq.question}</span>
                  <span className="faq-trigger-icon" aria-hidden="true">
                    <Plus size={20} strokeWidth={2} />
                  </span>
                </button>

                <div
                  id={contentId}
                  className="faq-content-wrapper"
                  role="region"
                  aria-labelledby={triggerId}
                >
                  <div className="faq-content">
                    <p className="faq-answer">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}