import { StateCreator } from 'zustand';
import { IncomeStream, AssetClass } from '@shared/index';

export interface IncomeEventsSlice {
  incomeEvents: IncomeStream[];
  addIncomeEvent: (preset?: Partial<IncomeStream>) => void;
  updateIncomeEvent: (id: string, updates: Partial<IncomeStream>) => void;
  removeIncomeEvent: (id: string) => void;
}

export const createIncomeEventsSlice: StateCreator<IncomeEventsSlice> = (set) => ({
  incomeEvents: [],
  addIncomeEvent: (preset) =>
    set((state) => {
      const newEvent: IncomeStream = {
        id: crypto.randomUUID(),
        name: preset?.name || 'New Income',
        amount: preset?.amount || 0,
        startMonth: preset?.startMonth || '2026-01',
        endMonth: preset?.endMonth,
        cadence: preset?.cadence || { kind: 'monthly' },
        escalation: preset?.escalation || { kind: 'cpiLinked' },
        depositTo: preset?.depositTo || AssetClass.CASH,
      };
      return { incomeEvents: [...state.incomeEvents, newEvent] };
    }),
  updateIncomeEvent: (id, updates) =>
    set((state) => ({
      incomeEvents: state.incomeEvents.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),
  removeIncomeEvent: (id) =>
    set((state) => ({
      incomeEvents: state.incomeEvents.filter((e) => e.id !== id),
    })),
});
