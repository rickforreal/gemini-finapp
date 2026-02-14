import { StateCreator } from 'zustand';
import { SinglePathResult } from '@shared/domain/simulation';
export interface SimulationSlice {
    simulationResults: {
        manual: SinglePathResult | null;
        monteCarlo: any | null;
        status: 'idle' | 'running' | 'complete' | 'error';
        error: string | null;
    };
    setSimulationStatus: (status: 'idle' | 'running' | 'complete' | 'error') => void;
    setManualResult: (result: SinglePathResult) => void;
    setSimulationError: (error: string | null) => void;
}
export declare const createSimulationSlice: StateCreator<SimulationSlice>;
