import { motion } from 'framer-motion';
import { Check, X, Tag, Users, Headphones, BookMarked } from 'lucide-react';
import { usePlanBuilder } from '../../hooks/usePlanBuilder';
import { PLANS, ADD_ONS, type PlanId, type AddOnId } from '../../config/pricing';
import { formatINR } from '../../utils/pricing';
import AnimatedPrice from './AnimatedPrice';
import './PlanBuilder.css';

const planOrder: PlanId[] = ['monthly', 'annual', 'lifetime'];

const addOnIcons = {
  familySharing: Users,
  sleepCoaching: Headphones,
  premiumStoryPacks: BookMarked,
};

const addOnOrder: AddOnId[] = ['familySharing', 'sleepCoaching', 'premiumStoryPacks'];

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
};

export default function PlanBuilder() {
  const {
    state,
    breakdown,
    selectPlan,
    toggleAddOn,
    setMemberCount,
    setPromoInput,
    applyPromo,
    removePromo,
  } = usePlanBuilder();

  const handlePromoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyPromo();
    }
  };

  return (
    <section className="plan-builder section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Pricing</span>
          <h2 className="section-title">Build your perfect plan</h2>
          <p className="section-subtitle centered">
            Start with a base plan, add what you need, and see your total
            update in real time.
          </p>
        </div>

        <motion.div
          className="plan-builder-layout"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* ── Left: Configuration ── */}
          <div className="plan-builder-config">
            {/* Plan Cards */}
            <div className="plan-cards" role="radiogroup" aria-label="Select a plan">
              {planOrder.map((planId) => {
                const plan = PLANS[planId];
                const isSelected = state.selectedPlan === planId;

                return (
                  <button
                    key={planId}
                    className={`plan-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => selectPlan(planId)}
                    role="radio"
                    aria-checked={isSelected}
                    type="button"
                  >
                    {plan.badge && (
                      <span className="plan-card-badge badge badge-success">
                        {plan.badge}
                      </span>
                    )}
                    <div className="plan-card-name">{plan.label}</div>
                    <div className="plan-card-price">
                      ₹{formatINR(plan.paise)}
                    </div>
                    <div className="plan-card-cycle">
                      {plan.cycle === 'month' && '/ month'}
                      {plan.cycle === 'year' && '/ year'}
                      {plan.cycle === 'one-time' && 'one-time'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Add-ons */}
            <div className="addons-section">
              <div className="addons-title">Add-ons</div>

              {addOnOrder.map((addOnId) => {
                const addOn = ADD_ONS[addOnId];
                const selection = state.addOns[addOnId];
                const isActive = selection.enabled;
                const Icon = addOnIcons[addOnId];

                // Display price based on current plan
                let priceLabel: string;
                if (state.selectedPlan === 'lifetime') {
                  const oneTime = addOn.monthlyPaise * 24;
                  priceLabel = `₹${formatINR(oneTime)} one-time`;
                } else if (state.selectedPlan === 'annual') {
                  const annual = addOn.monthlyPaise * 10;
                  priceLabel = `₹${formatINR(annual)} / year`;
                } else {
                  priceLabel = `₹${formatINR(addOn.monthlyPaise)} / mo`;
                }

                // Family sharing shows per-member price
                if (addOn.hasMembers) {
                  priceLabel = `₹${formatINR(addOn.monthlyPaise)} / mo per member`;
                }

                return (
                  <div key={addOnId}>
                    <div
                      className={`addon-item ${isActive ? 'active' : ''}`}
                    >
                      <div className="addon-left">
                        <div className="feature-icon" style={{ width: 38, height: 38, borderRadius: 10, marginBottom: 0 }}>
                          <Icon size={18} strokeWidth={1.8} />
                        </div>
                        <div className="addon-info">
                          <div className="addon-name">{addOn.label}</div>
                          <div className="addon-price">{priceLabel}</div>
                        </div>
                      </div>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => toggleAddOn(addOnId)}
                          aria-label={`Toggle ${addOn.label}`}
                        />
                        <span className="toggle-track" />
                      </label>
                    </div>

                    {/* Family Sharing member stepper */}
                    {addOnId === 'familySharing' && isActive && (
                      <div className="member-stepper">
                        <span className="member-stepper-label">Members</span>
                        <button
                          className="stepper-btn"
                          onClick={() =>
                            setMemberCount((selection.memberCount || 2) - 1)
                          }
                          disabled={(selection.memberCount || 2) <= 2}
                          aria-label="Decrease member count"
                          type="button"
                        >
                          −
                        </button>
                        <span className="stepper-value">
                          {selection.memberCount || 2}
                        </span>
                        <button
                          className="stepper-btn"
                          onClick={() =>
                            setMemberCount((selection.memberCount || 2) + 1)
                          }
                          disabled={(selection.memberCount || 2) >= 5}
                          aria-label="Increase member count"
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Promo Code */}
            <div className="promo-section">
              <div className="addons-title">Promo code</div>
              <div className="promo-input-row">
                <input
                  type="text"
                  className="promo-input"
                  placeholder="Enter code"
                  value={state.promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  onKeyDown={handlePromoKeyDown}
                  aria-label="Promo code"
                  id="promo-code-input"
                />
                <button
                  className="promo-apply-btn"
                  onClick={applyPromo}
                  type="button"
                >
                  Apply
                </button>
              </div>

              {state.promoError && (
                <div className="promo-message error">
                  <X size={14} />
                  {state.promoError}
                </div>
              )}

              {state.promoSuccess && state.appliedPromo && (
                <div className="promo-message success">
                  <Check size={14} />
                  {state.appliedPromo.code} applied!
                  <button
                    className="promo-remove"
                    onClick={removePromo}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Price Breakdown ── */}
          <div className="breakdown-card">
            <div className="breakdown-title">Your plan</div>

            <ul className="breakdown-items">
              {breakdown.items.map((item, i) => (
                <li
                  key={i}
                  className={`breakdown-item ${item.isDiscount ? 'discount' : ''}`}
                >
                  <span className="breakdown-item-label">
                    {item.isDiscount && <Tag size={13} style={{ marginRight: 4, verticalAlign: -1 }} />}
                    {item.label}
                  </span>
                  <span className="breakdown-item-value">
                    {item.paise < 0 ? `−₹${formatINR(Math.abs(item.paise))}` : `₹${formatINR(item.paise)}`}
                  </span>
                </li>
              ))}
            </ul>

            <div className="breakdown-divider" />

            <div className="breakdown-total">
              <span className="breakdown-total-label">Total</span>
              <AnimatedPrice
                value={breakdown.totalPaise}
                className="breakdown-total-value"
              />
            </div>

            <div className="breakdown-billing-label">
              {breakdown.billingLabel}
            </div>

            {breakdown.savingsPaise > 0 && (
              <div className="breakdown-savings">
                🎉 You save ₹{formatINR(breakdown.savingsPaise)} ({breakdown.savingsPercent}%)
              </div>
            )}

            <a href="#" className="btn btn-primary breakdown-cta">
              Start free trial
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}