import { StateCreator } from 'zustand';
import { 
  SinglePathResult, 
  MonteCarloResult, 
  MonteCarloConfig, 
  HistoricalEra 
} from '@shared';

export interface SimulationSlice {
  simulationResults: {
    manual: SinglePathResult | null;
    monteCarlo: MonteCarloResult | null;
    status: 'idle' | 'running' | 'complete' | 'error';
    error: string | null;
  };
  monteCarloConfig: MonteCarloConfig;
  setSimulationStatus: (status: 'idle' | 'running' | 'complete' | 'error') => void;
  setManualResult: (result: SinglePathResult) => void;
  setMonteCarloResult: (result: MonteCarloResult) => void;
  setSimulationError: (error: string | null) => void;
  setMonteCarloConfig: (config: Partial<MonteCarloConfig>) => void;
  setHistoricalEra: (era: HistoricalEra) => void;
}

export const createSimulationSlice: StateCreator<SimulationSlice> = (set) => ({
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
  setMonteCarloResult: (monteCarlo) =>
    set((state) => ({ 
      simulationResults: { 
        ...state.simulationResults, 
        monteCarlo, 
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
  setMonteCarloConfig: (config) =>
    set((state) => ({
      monteCarloConfig: { ...state.monteCarloConfig, ...config }
    })),
  setHistoricalEra: (era) =>
    set((state) => ({
      monteCarloConfig: { ...state.monteCarloConfig, era }
    })),
});
