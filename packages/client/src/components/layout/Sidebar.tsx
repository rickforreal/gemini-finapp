import React from 'react';
import { CoreParameters } from '../inputs/CoreParameters';
import { StartingPortfolio } from '../inputs/StartingPortfolio';
import { ReturnAssumptions } from '../inputs/ReturnAssumptions';
import { SpendingPhases } from '../inputs/SpendingPhases';
import { WithdrawalStrategy } from '../inputs/WithdrawalStrategy';
import { DrawdownStrategy } from '../inputs/DrawdownStrategy';
import { IncomeEvents } from '../inputs/IncomeEvents/IncomeEvents';
import { ExpenseEvents } from '../inputs/ExpenseEvents/ExpenseEvents';

export const Sidebar: React.FC = () => {
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
        <ReturnAssumptions />
        <SpendingPhases />
        <WithdrawalStrategy />
        <DrawdownStrategy />
        <IncomeEvents />
        <ExpenseEvents />
        <div className="p-4">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Phase 3: Input Panel</h4>
            <p className="text-[11px] text-blue-600 leading-relaxed">
              All sidebar sections are now wired to the store. Change any value to see reactivity in future phases.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
