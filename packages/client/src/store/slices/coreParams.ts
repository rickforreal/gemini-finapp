import { StateCreator } from 'zustand';

export interface CoreParamsSlice {
  coreParams: {
    startingAge: number;
    withdrawalsStartMonth: number;
    retirementStartDate: { month: number; year: number };
    retirementDuration: number;
    inflationRate: number;
  };
  setStartingAge: (age: number) => void;
  setWithdrawalsStartMonth: (month: number) => void;
  setRetirementStartDate: (date: { month: number; year: number }) => void;
  setRetirementDuration: (years: number) => void;
  setInflationRate: (rate: number) => void;
}

export const createCoreParamsSlice: StateCreator<CoreParamsSlice> = (set) => ({
  coreParams: {
    startingAge: 55,
    withdrawalsStartMonth: 1,
    retirementStartDate: { month: new Date().getMonth() + 1, year: new Date().getFullYear() },
    retirementDuration: 40,
    inflationRate: 0.03,
  },
  setStartingAge: (startingAge) =>
    set((state) => ({ coreParams: { ...state.coreParams, startingAge } })),
  setWithdrawalsStartMonth: (withdrawalsStartMonth) =>
    set((state) => ({ coreParams: { ...state.coreParams, withdrawalsStartMonth } })),
  setRetirementStartDate: (retirementStartDate) =>
    set((state) => ({ coreParams: { ...state.coreParams, retirementStartDate } })),
  setRetirementDuration: (retirementDuration) =>
    set((state) => ({ coreParams: { ...state.coreParams, retirementDuration } })),
  setInflationRate: (inflationRate) =>
    set((state) => ({ coreParams: { ...state.coreParams, inflationRate } })),
});
