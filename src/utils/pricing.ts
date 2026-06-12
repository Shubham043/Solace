// ─── Pricing Calculation Utilities ──────────────────────────────────────
// All math operates on integer PAISE to avoid floating-point drift.

import {
  type PlanId,
  type AddOnId,
  type PromoCode,
  PLANS,
  ADD_ONS,
  PROMO_CODES,
  UNRECOGNISED_CODE_MESSAGE,
} from '../config/pricing';

export interface AddOnSelection {
  enabled: boolean;
  memberCount?: number;
}

export interface PriceLineItem {
  label: string;
  paise: number;
  isDiscount?: boolean;
  isSavings?: boolean;
}

export interface PromoResult {
  valid: boolean;
  code?: PromoCode;
  error?: string;
}

export interface PriceBreakdown {
  items: PriceLineItem[];
  subtotalPaise: number;
  discountPaise: number;
  totalPaise: number;
  savingsPaise: number;
  savingsPercent: number;
  billingLabel: string;
}

/**
 * Get the add-on price in paise for a given billing cycle.
 * Monthly: monthlyPaise as-is
 * Annual: monthlyPaise × 10 (2 months free)
 * Lifetime: monthlyPaise × 24 (one-time)
 */
export function getAddOnPriceForCycle(
  addOnId: AddOnId,
  planId: PlanId,
  memberCount: number = 1
): number {
  const addOn = ADD_ONS[addOnId];
  let basePaise = addOn.monthlyPaise;

  // Family Sharing scales with member count
  if (addOn.hasMembers) {
    basePaise = addOn.monthlyPaise * memberCount;
  }

  switch (planId) {
    case 'monthly':
      return basePaise;
    case 'annual':
      return basePaise * 10;
    case 'lifetime':
      return basePaise * 24;
    default:
      return basePaise;
  }
}

/**
 * Calculate the equivalent monthly cost if user were on Monthly plan.
 * Used for "You save" calculations.
 */
function getMonthlyEquivalentPaise(
  addOns: Record<AddOnId, AddOnSelection>
): number {
  const baseMonthlyCost = PLANS.monthly.paise * 12; // annual equivalent of monthly

  let addonMonthlyCost = 0;
  for (const [id, selection] of Object.entries(addOns)) {
    if (selection.enabled) {
      const addOn = ADD_ONS[id as AddOnId];
      let base = addOn.monthlyPaise;
      if (addOn.hasMembers && selection.memberCount) {
        base = addOn.monthlyPaise * selection.memberCount;
      }
      addonMonthlyCost += base * 12;
    }
  }

  return baseMonthlyCost + addonMonthlyCost;
}

/**
 * Validate a promo code against the current plan/add-on configuration.
 */
export function validatePromoCode(
  rawCode: string,
  planId: PlanId,
  addOns: Record<AddOnId, AddOnSelection>
): PromoResult {
  const trimmed = rawCode.trim().toUpperCase();

  // Empty/whitespace → inert, no error
  if (trimmed === '') {
    return { valid: false };
  }

  const promo = PROMO_CODES[trimmed];

  // Unknown code
  if (!promo) {
    return { valid: false, error: UNRECOGNISED_CODE_MESSAGE };
  }

  // Expired code
  if (promo.type === 'expired') {
    return { valid: false, error: promo.errorMessages.expired };
  }

  // WELCOME20: check plan compatibility
  if (promo.validPlans && !promo.validPlans.includes(planId)) {
    return { valid: false, error: promo.errorMessages.invalidPlan };
  }

  // FAMILY50: check target addon is enabled
  if (promo.type === 'percentage_addon' && promo.targetAddon) {
    if (!addOns[promo.targetAddon]?.enabled) {
      return { valid: false, error: promo.errorMessages.missingAddon };
    }
  }

  return { valid: true, code: promo };
}

/**
 * Check if the currently applied promo is still valid after state changes.
 * Used when switching plans or toggling add-ons.
 */
export function isPromoStillValid(
  promo: PromoCode,
  planId: PlanId,
  addOns: Record<AddOnId, AddOnSelection>
): boolean {
  if (promo.validPlans && !promo.validPlans.includes(planId)) {
    return false;
  }
  if (promo.type === 'percentage_addon' && promo.targetAddon) {
    if (!addOns[promo.targetAddon]?.enabled) {
      return false;
    }
  }
  return true;
}

/**
 * Build a complete price breakdown with all line items.
 */
export function calculateBreakdown(
  planId: PlanId,
  addOns: Record<AddOnId, AddOnSelection>,
  appliedPromo: PromoCode | null
): PriceBreakdown {
  const plan = PLANS[planId];
  const items: PriceLineItem[] = [];

  // Base plan
  items.push({
    label: `${plan.label} Plan`,
    paise: plan.paise,
  });

  // Add-ons
  let totalAddonPaise = 0;
  let familySharingPaise = 0;

  for (const [id, selection] of Object.entries(addOns)) {
    if (selection.enabled) {
      const addOnId = id as AddOnId;
      const addOn = ADD_ONS[addOnId];
      const memberCount = selection.memberCount || 1;
      const price = getAddOnPriceForCycle(addOnId, planId, memberCount);

      const label = addOn.hasMembers
        ? `${addOn.label} (${memberCount} members)`
        : addOn.label;

      items.push({ label, paise: price });
      totalAddonPaise += price;

      if (addOnId === 'familySharing') {
        familySharingPaise = price;
      }
    }
  }

  const subtotalPaise = plan.paise + totalAddonPaise;

  // Calculate discount
  let discountPaise = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percentage_all') {
      discountPaise = Math.round(subtotalPaise * (appliedPromo.discount / 100));
    } else if (appliedPromo.type === 'percentage_addon' && appliedPromo.targetAddon) {
      discountPaise = Math.round(familySharingPaise * (appliedPromo.discount / 100));
    }

    if (discountPaise > 0) {
      items.push({
        label: `Promo: ${appliedPromo.code} (−${appliedPromo.discount}%)`,
        paise: -discountPaise,
        isDiscount: true,
      });
    }
  }

  const totalPaise = subtotalPaise - discountPaise;

  // Calculate savings (compare against monthly equivalent)
  let savingsPaise = 0;
  if (planId === 'annual') {
    const monthlyEquiv = getMonthlyEquivalentPaise(addOns);
    const annualActual = subtotalPaise;
    savingsPaise = monthlyEquiv - annualActual + discountPaise;
  } else if (discountPaise > 0) {
    savingsPaise = discountPaise;
  }

  const savingsPercent = savingsPaise > 0 && subtotalPaise > 0
    ? Math.round((savingsPaise / (totalPaise + savingsPaise)) * 100)
    : 0;

  // Billing label
  let billingLabel: string;
  switch (planId) {
    case 'monthly':
      billingLabel = `Billed ₹${formatINR(totalPaise)} / month`;
      break;
    case 'annual':
      billingLabel = `Billed ₹${formatINR(totalPaise)} / year`;
      break;
    case 'lifetime':
      billingLabel = 'One-time payment';
      break;
  }

  return {
    items,
    subtotalPaise,
    discountPaise,
    totalPaise,
    savingsPaise,
    savingsPercent,
    billingLabel,
  };
}

/**
 * Format paise as INR with proper grouping: ₹14,999 not ₹14999
 * Returns the formatted string WITHOUT the ₹ symbol (caller adds it).
 */
export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return rupees.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Format paise to rupees number (for animated counter).
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}
