export const createSimulationSlice = (set) => ({
    simulationResults: {
        manual: null,
        monteCarlo: null,
        status: 'idle',
        error: null,
    },
    setSimulationStatus: (status) => set((state) => ({ simulationResults: { ...state.simulationResults, status } })),
    setManualResult: (manual) => set((state) => ({
        simulationResults: {
            ...state.simulationResults,
            manual,
            status: 'complete',
            error: null
        }
    })),
    setSimulationError: (error) => set((state) => ({
        simulationResults: {
            ...state.simulationResults,
            status: 'error',
            error
        }
    })),
});
