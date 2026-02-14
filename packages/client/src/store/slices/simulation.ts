import { StateCreator } from 'zustand';
import { SinglePathResult } from '@shared/domain/simulation';

export interface SimulationSlice {
  simulationResults: {
    manual: SinglePathResult | null;
    monteCarlo: any | null; // Placeholder
    status: 'idle' | 'running' | 'complete' | 'error';
    error: string | null;
  };
  setSimulationStatus: (status: 'idle' | 'running' | 'complete' | 'error') => void;
  setManualResult: (result: SinglePathResult) => void;
  setSimulationError: (error: string | null) => void;
}

export const createSimulationSlice: StateCreator<SimulationSlice> = (set) => ({
  simulationResults: {
    manual: null,
    monteCarlo: null,
    status: 'idle',
    error: null,
  },
  setSimulationStatus: (status) =>
    set((state) => ({ simulationResults: { ...state.simulationResults, status } })),
  setManualResult: (manual) =>
    set((state) => ({ 
      simulationResults: { 
        ...state.simulationResults, 
        manual, 
        status: 'complete',
        error: null 
      } 
    })),
  setSimulationError: (error) =>
    set((state) => ({ 
      simulationResults: { 
        ...state.simulationResults, 
        status: 'error',
        error 
      } 
    })),
});
