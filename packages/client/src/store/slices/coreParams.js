export const createCoreParamsSlice = (set) => ({
    coreParams: {
        startingAge: 55,
        withdrawalsStartMonth: 1,
        retirementStartDate: { month: new Date().getMonth() + 1, year: new Date().getFullYear() },
        retirementDuration: 40,
        inflationRate: 0.03,
    },
    setStartingAge: (startingAge) => set((state) => ({ coreParams: { ...state.coreParams, startingAge } })),
    setWithdrawalsStartMonth: (withdrawalsStartMonth) => set((state) => ({ coreParams: { ...state.coreParams, withdrawalsStartMonth } })),
    setRetirementStartDate: (retirementStartDate) => set((state) => ({ coreParams: { ...state.coreParams, retirementStartDate } })),
    setRetirementDuration: (retirementDuration) => set((state) => ({ coreParams: { ...state.coreParams, retirementDuration } })),
    setInflationRate: (inflationRate) => set((state) => ({ coreParams: { ...state.coreParams, inflationRate } })),
});
