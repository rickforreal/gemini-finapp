import { AppMode, SimulationMode } from '@finapp/shared';
interface AppState {
    mode: AppMode;
    simulationMode: SimulationMode;
    setMode: (mode: AppMode) => void;
    setSimulationMode: (mode: SimulationMode) => void;
    coreParams: any;
    simulationResults: any;
}
export declare const useAppStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AppState>>;
export {};
