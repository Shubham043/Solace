import { motion } from 'framer-motion';
import './FooterCTA.css';

const ctaVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
};

export default function FooterCTA() {
  return (
    <>
      <section className="footer-cta section">
        <div className="container">
          <motion.div
            className="footer-cta-inner"
            variants={ctaVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="footer-cta-title">
              Tonight could be the best sleep you've had in months.
            </h2>
            <a href="#plan-builder" className="btn btn-primary">
              Start your free trial
            </a>
          </motion.div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <p className="footer-text">
            <span className="footer-brand">Solace</span> is a fictional product
            created for demonstration purposes. All content is illustrative.
          </p>
        </div>
      </footer>
    </>
  );
}
