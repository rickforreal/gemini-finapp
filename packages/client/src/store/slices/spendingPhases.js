export const createSpendingPhasesSlice = (set) => ({
    spendingPhases: [
        {
            id: '1',
            name: 'Active Retirement',
            startYear: 1,
            endYear: 40,
            minMonthlySpend: 400000,
            maxMonthlySpend: 800000,
        },
    ],
    addSpendingPhase: () => set((state) => {
        if (state.spendingPhases.length >= 4)
            return state;
        const lastPhase = state.spendingPhases[state.spendingPhases.length - 1];
        const newId = (parseInt(lastPhase.id) + 1).toString();
        // Split the last phase's duration
        const duration = lastPhase.endYear - lastPhase.startYear + 1;
        if (duration <= 1)
            return state; // Cannot split 1-year phase
        const midYear = lastPhase.startYear + Math.floor(duration / 2);
        const oldEndYear = lastPhase.endYear;
        const updatedLastPhase = { ...lastPhase, endYear: midYear - 1 };
        const newPhase = {
            id: newId,
            name: `Phase ${newId}`,
            startYear: midYear,
            endYear: oldEndYear,
            minMonthlySpend: lastPhase.minMonthlySpend,
            maxMonthlySpend: lastPhase.maxMonthlySpend,
        };
        return {
            spendingPhases: [...state.spendingPhases.slice(0, -1), updatedLastPhase, newPhase],
        };
    }),
    updateSpendingPhase: (id, updates) => set((state) => {
        const phases = [...state.spendingPhases];
        const index = phases.findIndex((p) => p.id === id);
        if (index === -1)
            return state;
        phases[index] = { ...phases[index], ...updates };
        // Re-apply contiguous constraints
        for (let i = 0; i < phases.length; i++) {
            if (i === 0)
                phases[i].startYear = 1;
            else
                phases[i].startYear = phases[i - 1].endYear + 1;
            // Ensure endYear is at least startYear
            if (phases[i].endYear < phases[i].startYear) {
                phases[i].endYear = phases[i].startYear;
            }
        }
        return { spendingPhases: phases };
    }),
    removeSpendingPhase: (id) => set((state) => {
        if (state.spendingPhases.length <= 1)
            return state;
        const phases = state.spendingPhases.filter((p) => p.id !== id);
        // Fix last phase endYear
        // This needs access to coreParams for duration, but we'll handle that in update logic
        // or by letting it be fixed in the next loop.
        return { spendingPhases: phases };
    }),
});
