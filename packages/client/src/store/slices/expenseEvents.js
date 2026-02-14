export const createExpenseEventsSlice = (set) => ({
    expenseEvents: [],
    addExpenseEvent: (preset) => set((state) => {
        const newEvent = {
            id: crypto.randomUUID(),
            name: preset?.name || 'New Expense',
            amount: preset?.amount || 0,
            startMonth: preset?.startMonth || '2026-01',
            durationMonths: preset?.durationMonths || 1,
            escalation: preset?.escalation || { kind: 'cpiLinked' },
        };
        return { expenseEvents: [...state.expenseEvents, newEvent] };
    }),
    updateExpenseEvent: (id, updates) => set((state) => ({
        expenseEvents: state.expenseEvents.map((e) => e.id === id ? { ...e, ...updates } : e),
    })),
    removeExpenseEvent: (id) => set((state) => ({
        expenseEvents: state.expenseEvents.filter((e) => e.id !== id),
    })),
});
