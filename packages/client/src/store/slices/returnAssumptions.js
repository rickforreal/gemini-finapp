export const createReturnAssumptionsSlice = (set) => ({
    returnAssumptions: {
        stocks: { expectedReturn: 0.08, stdDev: 0.15 },
        bonds: { expectedReturn: 0.04, stdDev: 0.05 },
        cash: { expectedReturn: 0.02, stdDev: 0.01 },
    },
    setReturnAssumption: (asset, field, value) => set((state) => ({
        returnAssumptions: {
            ...state.returnAssumptions,
            [asset]: { ...state.returnAssumptions[asset], [field]: value },
        },
    })),
});
