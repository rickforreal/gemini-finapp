import { SimulationMode } from '../constants/enums';
export interface SimulationConfig {
    mode: SimulationMode;
}
export interface SimulationResult {
    requestHash: string;
    generatedAt: string;
}
