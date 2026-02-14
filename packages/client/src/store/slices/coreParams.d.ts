import { StateCreator } from 'zustand';
export interface CoreParamsSlice {
    coreParams: {
        startingAge: number;
        withdrawalsStartMonth: number;
        retirementStartDate: {
            month: number;
            year: number;
        };
        retirementDuration: number;
        inflationRate: number;
    };
    setStartingAge: (age: number) => void;
    setWithdrawalsStartMonth: (month: number) => void;
    setRetirementStartDate: (date: {
        month: number;
        year: number;
    }) => void;
    setRetirementDuration: (years: number) => void;
    setInflationRate: (rate: number) => void;
}
export declare const createCoreParamsSlice: StateCreator<CoreParamsSlice>;
