import { StateCreator } from 'zustand';
import { SinglePathResult, MonteCarloResult, MonteCarloConfig, HistoricalEra } from '@shared';
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
export declare const createSimulationSlice: StateCreator<SimulationSlice>;
