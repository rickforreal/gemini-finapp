import { SimulationMode } from '@shared';
import { useAppStore } from '../../store/useAppStore';
import { CoreParameters } from '../inputs/CoreParameters';
import { StartingPortfolio } from '../inputs/StartingPortfolio';
import { ReturnAssumptions } from '../inputs/ReturnAssumptions';
import { HistoricalDataSummary } from '../inputs/HistoricalDataSummary';
import { SpendingPhases } from '../inputs/SpendingPhases';
import { WithdrawalStrategy } from '../inputs/WithdrawalStrategy';
import { DrawdownStrategy } from '../inputs/DrawdownStrategy';
import { IncomeEvents } from '../inputs/IncomeEvents/IncomeEvents';
import { ExpenseEvents } from '../inputs/ExpenseEvents/ExpenseEvents';

export const Sidebar: React.FC = () => {
  const { simulationMode } = useAppStore();

  return (
    <aside className="w-80 h-full bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-200 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">F</span>
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">FinApp</h1>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <CoreParameters />
        <StartingPortfolio />
        
        {simulationMode === SimulationMode.MANUAL ? (
          <ReturnAssumptions />
        ) : (
          <HistoricalDataSummary />
        )}

        <SpendingPhases />
        <WithdrawalStrategy />
        <DrawdownStrategy />
        <IncomeEvents />
        <ExpenseEvents />
      </div>
    </aside>
  );
};
