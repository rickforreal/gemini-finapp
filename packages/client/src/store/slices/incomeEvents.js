import { AssetClass } from '@shared/index';
export const createIncomeEventsSlice = (set) => ({
    incomeEvents: [],
    addIncomeEvent: (preset) => set((state) => {
        const newEvent = {
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
    updateIncomeEvent: (id, updates) => set((state) => ({
        incomeEvents: state.incomeEvents.map((e) => e.id === id ? { ...e, ...updates } : e),
    })),
    removeIncomeEvent: (id) => set((state) => ({
        incomeEvents: state.incomeEvents.filter((e) => e.id !== id),
    })),
});
