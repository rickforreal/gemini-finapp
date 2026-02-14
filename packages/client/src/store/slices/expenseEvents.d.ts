import { StateCreator } from 'zustand';
import { ExpenseEvent } from '@shared/index';
export interface ExpenseEventsSlice {
    expenseEvents: ExpenseEvent[];
    addExpenseEvent: (preset?: Partial<ExpenseEvent>) => void;
    updateExpenseEvent: (id: string, updates: Partial<ExpenseEvent>) => void;
    removeExpenseEvent: (id: string) => void;
}
export declare const createExpenseEventsSlice: StateCreator<ExpenseEventsSlice>;
