import { create } from 'zustand';
import { AppMode, SimulationMode } from '@shared/index';
import { createCoreParamsSlice } from './slices/coreParams';
import { createPortfolioSlice } from './slices/portfolio';
import { createReturnAssumptionsSlice } from './slices/returnAssumptions';
import { createSpendingPhasesSlice } from './slices/spendingPhases';
import { createWithdrawalStrategySlice } from './slices/withdrawalStrategy';
import { createDrawdownStrategySlice } from './slices/drawdownStrategy';
import { createSimulationSlice } from './slices/simulation';
import { createUISlice } from './slices/ui';
import { createIncomeEventsSlice } from './slices/incomeEvents';
import { createExpenseEventsSlice } from './slices/expenseEvents';
export const useAppStore = create((...a) => ({
    mode: AppMode.PLANNING,
    simulationMode: SimulationMode.MANUAL,
    setMode: (mode) => a[0]({ mode }),
    setSimulationMode: (simulationMode) => a[0]({ simulationMode }),
    ...createCoreParamsSlice(...a),
    ...createPortfolioSlice(...a),
    ...createReturnAssumptionsSlice(...a),
    ...createSpendingPhasesSlice(...a),
    ...createWithdrawalStrategySlice(...a),
    ...createDrawdownStrategySlice(...a),
    ...createSimulationSlice(...a),
    ...createUISlice(...a),
    ...createIncomeEventsSlice(...a),
    ...createExpenseEventsSlice(...a),
}));
