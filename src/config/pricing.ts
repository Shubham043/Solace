// ─── Pricing Configuration ───────────────────────────────────────────────
// All prices in PAISE (integer) to avoid floating-point drift.
// 1 Rupee = 100 Paise

export type PlanId = 'monthly' | 'annual' | 'lifetime';
export type AddOnId = 'familySharing' | 'sleepCoaching' | 'premiumStoryPacks';
export type PromoCodeId = 'WELCOME20' | 'FAMILY50' | 'SLEEP100';

export interface Plan {
  id: PlanId;
  label: string;
  paise: number;
  cycle: 'month' | 'year' | 'one-time';
  badge?: string;
}

export interface AddOn {
  id: AddOnId;
  label: string;
  description: string;
  monthlyPaise: number;
  hasMembers?: boolean;
  minMembers?: number;
  maxMembers?: number;
}

export interface PromoCode {
  code: string;
  type: 'percentage_all' | 'percentage_addon' | 'expired';
  discount: number; // percentage (e.g., 20 for 20%)
  targetAddon?: AddOnId;
  validPlans?: PlanId[];
  errorMessages: {
    invalidPlan?: string;
    missingAddon?: string;
    expired?: string;
  };
}

export const PLANS: Record<PlanId, Plan> = {
  monthly: {
    id: 'monthly',
    label: 'Monthly',
    paise: 49900,
    cycle: 'month',
  },
  annual: {
    id: 'annual',
    label: 'Annual',
    paise: 399900,
    cycle: 'year',
    badge: 'Save 33%',
  },
  lifetime: {
    id: 'lifetime',
    label: 'Lifetime',
    paise: 1499900,
    cycle: 'one-time',
  },
};

export const ADD_ONS: Record<AddOnId, AddOn> = {
  familySharing: {
    id: 'familySharing',
    label: 'Family Sharing',
    description: 'Share your plan with family members',
    monthlyPaise: 19900,
    hasMembers: true,
    minMembers: 2,
    maxMembers: 5,
  },
  sleepCoaching: {
    id: 'sleepCoaching',
    label: '1:1 Sleep Coaching',
    description: 'Personal coaching sessions',
    monthlyPaise: 99900,
  },
  premiumStoryPacks: {
    id: 'premiumStoryPacks',
    label: 'Premium Story Packs',
    description: 'Exclusive narrated sleep stories',
    monthlyPaise: 14900,
  },
};

export const PROMO_CODES: Record<string, PromoCode> = {
  WELCOME20: {
    code: 'WELCOME20',
    type: 'percentage_all',
    discount: 20,
    validPlans: ['monthly', 'annual'],
    errorMessages: {
      invalidPlan: "WELCOME20 doesn't apply to Lifetime plans.",
    },
  },
  FAMILY50: {
    code: 'FAMILY50',
    type: 'percentage_addon',
    discount: 50,
    targetAddon: 'familySharing',
    errorMessages: {
      missingAddon: 'Add Family Sharing to use FAMILY50.',
    },
  },
  SLEEP100: {
    code: 'SLEEP100',
    type: 'expired',
    discount: 0,
    errorMessages: {
      expired: 'This code has expired.',
    },
  },
};

export const UNRECOGNISED_CODE_MESSAGE = "We don't recognise that code.";
