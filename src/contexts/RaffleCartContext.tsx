"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import type { Raffle } from "@/lib/types";
import { getBonusTicketsForQuantity, getNextTierProgress } from "@/lib/bonus";

type State = {
  raffle: Raffle | null;
  packageQty: Record<string, number>;
  stepperTickets: number;
};

const STEP_UP = 10;
const STEP_DOWN = 5;

function minStepperFor(raffle: Raffle | null): number {
  if (!raffle) return 0;
  return Math.max(1, Math.floor(raffle.minTickets));
}

const initialState: State = {
  raffle: null,
  packageQty: {},
  stepperTickets: 0,
};

type Action =
  | { type: "SET_RAFFLE"; raffle: Raffle }
  | { type: "CLEAR_RAFFLE" }
  | { type: "SET_PACKAGE_QTY"; packageId: string; qty: number }
  | { type: "INC_PACKAGE"; packageId: string }
  | { type: "DEC_PACKAGE"; packageId: string }
  | { type: "INC_STEPPER" }
  | { type: "DEC_STEPPER" }
  | { type: "ADD_STEPPER"; amount: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_RAFFLE": {
      if (state.raffle?.slug === action.raffle.slug) {
        return { ...state, raffle: action.raffle };
      }
      const min = minStepperFor(action.raffle);
      return {
        raffle: action.raffle,
        packageQty: {},
        stepperTickets: min,
      };
    }
    case "CLEAR_RAFFLE":
      return {
        raffle: null,
        packageQty: {},
        stepperTickets: 0,
      };
    case "SET_PACKAGE_QTY": {
      const q = Math.max(0, Math.floor(action.qty));
      const next = { ...state.packageQty };
      if (q === 0) delete next[action.packageId];
      else next[action.packageId] = q;
      return { ...state, packageQty: next };
    }
    case "INC_PACKAGE": {
      const current = state.packageQty[action.packageId] ?? 0;
      return {
        ...state,
        packageQty: {
          ...state.packageQty,
          [action.packageId]: current + 1,
        },
      };
    }
    case "DEC_PACKAGE": {
      const current = state.packageQty[action.packageId] ?? 0;
      const next = Math.max(0, current - 1);
      const pq = { ...state.packageQty };
      if (next === 0) delete pq[action.packageId];
      else pq[action.packageId] = next;
      return { ...state, packageQty: pq };
    }
    case "INC_STEPPER":
      return {
        ...state,
        stepperTickets: state.stepperTickets + STEP_UP,
      };
    case "DEC_STEPPER": {
      const min = minStepperFor(state.raffle);
      return {
        ...state,
        stepperTickets: Math.max(min, state.stepperTickets - STEP_DOWN),
      };
    }
    case "ADD_STEPPER": {
      const add = Math.max(0, Math.floor(action.amount));
      return {
        ...state,
        stepperTickets: state.stepperTickets + add,
      };
    }
    default:
      return state;
  }
}

/** Preço por bilhete na barra = valor unitário da rifa (`priceCents`). */
function unitCentsFor(raffle: Raffle): number {
  return Math.max(1, raffle.priceCents);
}

function computeCartTotals(
  raffle: Raffle,
  packageQty: Record<string, number>,
  stepperTickets: number,
) {
  let packageTickets = 0;
  let packagePriceCents = 0;
  let packageBonusTickets = 0;
  for (const [id, q] of Object.entries(packageQty)) {
    if (q <= 0) continue;
    const p = raffle.packages.find((x) => x.id === id);
    if (!p) continue;
    packageTickets += p.tickets * q;
    packagePriceCents += p.priceCents * q;
    packageBonusTickets += q * (p.extraBonusPerPack ?? 0);
  }
  const u = unitCentsFor(raffle);
  const stepperPriceCents = stepperTickets * u;
  const totalTickets = packageTickets + stepperTickets;
  const totalPriceCents = packagePriceCents + stepperPriceCents;

  const tierBonusTickets = getBonusTicketsForQuantity(totalTickets);
  const bonusTickets = tierBonusTickets + packageBonusTickets;
  const nextTier = getNextTierProgress(totalTickets);
  const popularPackageId =
    raffle.packages.find((p) => p.mostPopular)?.id ?? raffle.packages[0]?.id ?? "";

  return {
    packageTickets,
    stepperTickets,
    totalTickets,
    totalPriceCents,
    bonusTickets,
    tierBonusTickets,
    packageBonusTickets,
    nextTier,
    unitCents: u,
    popularPackageId,
  };
}

type CartContextValue = {
  raffle: Raffle | null;
  packageQty: Record<string, number>;
  setRaffle: (r: Raffle) => void;
  clearRaffle: () => void;
  incPackage: (packageId: string) => void;
  decPackage: (packageId: string) => void;
  setPackageQty: (packageId: string, qty: number) => void;
  incStepper: () => void;
  decStepper: () => void;
  addStepper: (amount: number) => void;
  totalTickets: number;
  totalPriceCents: number;
  bonusTickets: number;
  /** Bônus por faixa de quantidade (tiers). */
  tierBonusTickets: number;
  /** Bônus somados dos pacotes (ex.: +10 por High roller). */
  packageBonusTickets: number;
  packageTickets: number;
  stepperTickets: number;
  nextTier: ReturnType<typeof getNextTierProgress>;
  unitCents: number;
  popularPackageId: string;
};

const RaffleCartContext = createContext<CartContextValue | null>(null);

export function RaffleCartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setRaffle = useCallback((raffle: Raffle) => {
    dispatch({ type: "SET_RAFFLE", raffle });
  }, []);

  const clearRaffle = useCallback(() => {
    dispatch({ type: "CLEAR_RAFFLE" });
  }, []);

  const setPackageQty = useCallback((packageId: string, qty: number) => {
    dispatch({ type: "SET_PACKAGE_QTY", packageId, qty });
  }, []);

  const incPackage = useCallback((packageId: string) => {
    dispatch({ type: "INC_PACKAGE", packageId });
  }, []);

  const decPackage = useCallback((packageId: string) => {
    dispatch({ type: "DEC_PACKAGE", packageId });
  }, []);

  const incStepper = useCallback(() => {
    dispatch({ type: "INC_STEPPER" });
  }, []);

  const decStepper = useCallback(() => {
    dispatch({ type: "DEC_STEPPER" });
  }, []);

  const addStepper = useCallback((amount: number) => {
    dispatch({ type: "ADD_STEPPER", amount });
  }, []);

  const computed = useMemo(() => {
    if (!state.raffle) {
      return {
        totalTickets: 0,
        totalPriceCents: 0,
        bonusTickets: 0,
        tierBonusTickets: 0,
        packageBonusTickets: 0,
        packageTickets: 0,
        nextTier: null as ReturnType<typeof getNextTierProgress>,
        unitCents: 0,
        popularPackageId: "",
      };
    }
    const t = computeCartTotals(
      state.raffle,
      state.packageQty,
      state.stepperTickets,
    );
    return {
      totalTickets: t.totalTickets,
      totalPriceCents: t.totalPriceCents,
      bonusTickets: t.bonusTickets,
      tierBonusTickets: t.tierBonusTickets,
      packageBonusTickets: t.packageBonusTickets,
      packageTickets: t.packageTickets,
      nextTier: t.nextTier,
      unitCents: t.unitCents,
      popularPackageId: t.popularPackageId,
    };
  }, [state.raffle, state.packageQty, state.stepperTickets]);

  const value = useMemo<CartContextValue>(
    () => ({
      raffle: state.raffle,
      packageQty: state.packageQty,
      setRaffle,
      clearRaffle,
      incPackage,
      decPackage,
      setPackageQty,
      incStepper,
      decStepper,
      addStepper,
      totalTickets: computed.totalTickets,
      totalPriceCents: computed.totalPriceCents,
      bonusTickets: computed.bonusTickets,
      tierBonusTickets: computed.tierBonusTickets,
      packageBonusTickets: computed.packageBonusTickets,
      packageTickets: computed.packageTickets,
      stepperTickets: state.stepperTickets,
      nextTier: computed.nextTier,
      unitCents: computed.unitCents,
      popularPackageId: computed.popularPackageId,
    }),
    [
      state.raffle,
      state.packageQty,
      state.stepperTickets,
      setRaffle,
      clearRaffle,
      incPackage,
      decPackage,
      setPackageQty,
      incStepper,
      decStepper,
      addStepper,
      computed,
    ],
  );

  return (
    <RaffleCartContext.Provider value={value}>
      {children}
    </RaffleCartContext.Provider>
  );
}

export function useRaffleCart(): CartContextValue {
  const ctx = useContext(RaffleCartContext);
  if (!ctx) {
    throw new Error("useRaffleCart must be used within RaffleCartProvider");
  }
  return ctx;
}
