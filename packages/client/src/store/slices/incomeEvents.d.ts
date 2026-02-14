import { StateCreator } from 'zustand';
import { IncomeStream } from '@shared/index';
export interface IncomeEventsSlice {
    incomeEvents: IncomeStream[];
    addIncomeEvent: (preset?: Partial<IncomeStream>) => void;
    updateIncomeEvent: (id: string, updates: Partial<IncomeStream>) => void;
    removeIncomeEvent: (id: string) => void;
}
export declare const createIncomeEventsSlice: StateCreator<IncomeEventsSlice>;
