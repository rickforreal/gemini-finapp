import { create } from 'zustand';
import { AppMode, SimulationMode } from '@shared/index';
import { CoreParamsSlice, createCoreParamsSlice } from './slices/coreParams';
import { PortfolioSlice, createPortfolioSlice } from './slices/portfolio';
import { ReturnAssumptionsSlice, createReturnAssumptionsSlice } from './slices/returnAssumptions';
import { SpendingPhasesSlice, createSpendingPhasesSlice } from './slices/spendingPhases';
import { WithdrawalStrategySlice, createWithdrawalStrategySlice } from './slices/withdrawalStrategy';
import { DrawdownStrategySlice, createDrawdownStrategySlice } from './slices/drawdownStrategy';
import { SimulationSlice, createSimulationSlice } from './slices/simulation';
import { UISlice, createUISlice } from './slices/ui';
import { IncomeEventsSlice, createIncomeEventsSlice } from './slices/incomeEvents';
import { ExpenseEventsSlice, createExpenseEventsSlice } from './slices/expenseEvents';

export type AppState = 
  & CoreParamsSlice 
  & PortfolioSlice 
  & ReturnAssumptionsSlice 
  & SpendingPhasesSlice 
  & WithdrawalStrategySlice 
  & DrawdownStrategySlice 
  & SimulationSlice 
  & UISlice
  & IncomeEventsSlice
  & ExpenseEventsSlice
  & {
    mode: AppMode;
    simulationMode: SimulationMode;
    setMode: (mode: AppMode) => void;
    setSimulationMode: (mode: SimulationMode) => void;
  };

export const useAppStore = create<AppState>((...a) => ({
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
