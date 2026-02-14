import { SimulationMode } from '../constants/enums';

export interface SimulationConfig {
  mode: SimulationMode;
  // TODO: Add full config fields in Phase 2
}

export interface SimulationResult {
  requestHash: string;
  generatedAt: string;
  // TODO: Add result fields in Phase 2
}
