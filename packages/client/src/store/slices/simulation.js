import { HistoricalEra } from '@shared';
export const createSimulationSlice = (set) => ({
    simulationResults: {
        manual: null,
        monteCarlo: null,
        status: 'idle',
        error: null,
    },
    monteCarloConfig: {
        iterations: 1000,
        era: HistoricalEra.FULL_HISTORY,
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
    setMonteCarloResult: (monteCarlo) => set((state) => ({
        simulationResults: {
            ...state.simulationResults,
            monteCarlo,
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
    setMonteCarloConfig: (config) => set((state) => ({
        monteCarloConfig: { ...state.monteCarloConfig, ...config }
    })),
    setHistoricalEra: (era) => set((state) => ({
        monteCarloConfig: { ...state.monteCarloConfig, era }
    })),
});
