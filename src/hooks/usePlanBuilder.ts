import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  type PlanId,
  type AddOnId,
  type PromoCode,
} from '../config/pricing';
import {
  type AddOnSelection,
  type PriceBreakdown,
  type PromoResult,
  calculateBreakdown,
  validatePromoCode,
  isPromoStillValid,
} from '../utils/pricing';

export interface PlanBuilderState {
  selectedPlan: PlanId;
  addOns: Record<AddOnId, AddOnSelection>;
  promoInput: string;
  appliedPromo: PromoCode | null;
  promoError: string | null;
  promoSuccess: boolean;
}

const initialAddOns: Record<AddOnId, AddOnSelection> = {
  familySharing: { enabled: false, memberCount: 2 },
  sleepCoaching: { enabled: false },
  premiumStoryPacks: { enabled: false },
};

export function usePlanBuilder() {
  const [state, setState] = useState<PlanBuilderState>({
    selectedPlan: 'monthly',
    addOns: initialAddOns,
    promoInput: '',
    appliedPromo: null,
    promoError: null,
    promoSuccess: false,
  });

  // ── Select Plan ──
  const selectPlan = useCallback((planId: PlanId) => {
    setState((prev) => {
      let { appliedPromo, promoError, promoSuccess } = prev;

      // Re-validate promo when switching plans
      if (appliedPromo) {
        if (!isPromoStillValid(appliedPromo, planId, prev.addOns)) {
          appliedPromo = null;
          promoError = null;
          promoSuccess = false;
        }
      }

      return {
        ...prev,
        selectedPlan: planId,
        appliedPromo,
        promoError,
        promoSuccess,
      };
    });
  }, []);

  // ── Toggle Add-On ──
  const toggleAddOn = useCallback((addOnId: AddOnId) => {
    setState((prev) => {
      const newAddOns = { ...prev.addOns };
      const current = newAddOns[addOnId];
      newAddOns[addOnId] = {
        ...current,
        enabled: !current.enabled,
        // Reset member count when toggling off Family Sharing
        ...(addOnId === 'familySharing' && current.enabled
          ? { memberCount: 2 }
          : {}),
      };

      let { appliedPromo, promoError, promoSuccess } = prev;

      // Re-validate promo when toggling add-ons
      if (appliedPromo) {
        if (!isPromoStillValid(appliedPromo, prev.selectedPlan, newAddOns)) {
          appliedPromo = null;
          promoError = null;
          promoSuccess = false;
        }
      }

      return {
        ...prev,
        addOns: newAddOns,
        appliedPromo,
        promoError,
        promoSuccess,
      };
    });
  }, []);

  // ── Set Member Count ──
  const setMemberCount = useCallback((count: number) => {
    // Clamp to 2-5
    const clamped = Math.max(2, Math.min(5, count));
    setState((prev) => ({
      ...prev,
      addOns: {
        ...prev.addOns,
        familySharing: {
          ...prev.addOns.familySharing,
          memberCount: clamped,
        },
      },
    }));
  }, []);

  // ── Update Promo Input ──
  const setPromoInput = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      promoInput: value,
      // Clear error/success when user types (but don't validate yet)
      promoError: null,
      promoSuccess: false,
    }));
  }, []);

  // ── Apply Promo Code (on submit, not keystroke) ──
  const applyPromo = useCallback(() => {
    setState((prev) => {
      const trimmed = prev.promoInput.trim();

      // Empty/whitespace → inert, no error
      if (trimmed === '') {
        return {
          ...prev,
          appliedPromo: null,
          promoError: null,
          promoSuccess: false,
        };
      }

      const result: PromoResult = validatePromoCode(
        trimmed,
        prev.selectedPlan,
        prev.addOns
      );

      if (result.valid && result.code) {
        return {
          ...prev,
          appliedPromo: result.code,
          promoError: null,
          promoSuccess: true,
        };
      }

      return {
        ...prev,
        appliedPromo: null,
        promoError: result.error || null,
        promoSuccess: false,
      };
    });
  }, []);

  // ── Remove Promo ──
  const removePromo = useCallback(() => {
    setState((prev) => ({
      ...prev,
      promoInput: '',
      appliedPromo: null,
      promoError: null,
      promoSuccess: false,
    }));
  }, []);

  // ── Debounce Promo Input ──
  useEffect(() => {
    const trimmed = state.promoInput.trim();
    if (trimmed === '') {
      if (state.appliedPromo) {
        removePromo();
      }
      return;
    }

    // Don't auto-validate if already matches the applied promo
    if (state.appliedPromo && trimmed.toUpperCase() === state.appliedPromo.code) {
      return;
    }

    const timer = setTimeout(() => {
      applyPromo();
    }, 500);

    return () => clearTimeout(timer);
  }, [state.promoInput, applyPromo, removePromo, state.appliedPromo]);

  // ── Memoised Breakdown ──
  const breakdown: PriceBreakdown = useMemo(
    () =>
      calculateBreakdown(
        state.selectedPlan,
        state.addOns,
        state.appliedPromo
      ),
    [state.selectedPlan, state.addOns, state.appliedPromo]
  );

  return {
    state,
    breakdown,
    selectPlan,
    toggleAddOn,
    setMemberCount,
    setPromoInput,
    applyPromo,
    removePromo,
  };
}
