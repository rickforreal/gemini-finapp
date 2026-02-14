import { create } from 'zustand';
import { AppMode, SimulationMode } from '@finapp/shared';
export const useAppStore = create((set) => ({
    mode: AppMode.PLANNING,
    simulationMode: SimulationMode.MANUAL,
    setMode: (mode) => set({ mode }),
    setSimulationMode: (simulationMode) => set({ simulationMode }),
    coreParams: {},
    simulationResults: {
        status: 'idle',
        manual: null,
        monteCarlo: null,
    },
}));
