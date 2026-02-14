import { StateCreator } from 'zustand';
export interface SpendingPhase {
    id: string;
    name: string;
    startYear: number;
    endYear: number;
    minMonthlySpend: number;
    maxMonthlySpend: number;
}
export interface SpendingPhasesSlice {
    spendingPhases: SpendingPhase[];
    addSpendingPhase: () => void;
    updateSpendingPhase: (id: string, phase: Partial<SpendingPhase>) => void;
    removeSpendingPhase: (id: string) => void;
}
export declare const createSpendingPhasesSlice: StateCreator<SpendingPhasesSlice>;
