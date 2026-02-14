import { AppMode, SimulationMode } from '@shared/index';
import { CoreParamsSlice } from './slices/coreParams';
import { PortfolioSlice } from './slices/portfolio';
import { ReturnAssumptionsSlice } from './slices/returnAssumptions';
import { SpendingPhasesSlice } from './slices/spendingPhases';
import { WithdrawalStrategySlice } from './slices/withdrawalStrategy';
import { DrawdownStrategySlice } from './slices/drawdownStrategy';
import { SimulationSlice } from './slices/simulation';
import { UISlice } from './slices/ui';
import { IncomeEventsSlice } from './slices/incomeEvents';
import { ExpenseEventsSlice } from './slices/expenseEvents';
export type AppState = CoreParamsSlice & PortfolioSlice & ReturnAssumptionsSlice & SpendingPhasesSlice & WithdrawalStrategySlice & DrawdownStrategySlice & SimulationSlice & UISlice & IncomeEventsSlice & ExpenseEventsSlice & {
    mode: AppMode;
    simulationMode: SimulationMode;
    setMode: (mode: AppMode) => void;
    setSimulationMode: (mode: SimulationMode) => void;
};
export declare const useAppStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AppState>>;
