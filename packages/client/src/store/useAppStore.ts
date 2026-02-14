import { create } from 'zustand';
import { AppMode, SimulationMode } from '@finapp/shared';

interface AppState {
  mode: AppMode;
  simulationMode: SimulationMode;
  setMode: (mode: AppMode) => void;
  setSimulationMode: (mode: SimulationMode) => void;
  
  // Placeholder for future slices
  coreParams: any;
  simulationResults: any;
}

export const useAppStore = create<AppState>((set) => ({
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
