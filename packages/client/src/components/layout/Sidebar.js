import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
export const Sidebar = () => {
    const { simulationMode } = useAppStore();
    return (_jsxs("aside", { className: "w-80 h-full bg-white border-r border-slate-200 flex flex-col shrink-0", children: [_jsxs("div", { className: "p-4 border-b border-slate-200 flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-lg", children: "F" }) }), _jsx("h1", { className: "text-xl font-bold text-slate-800 tracking-tight", children: "FinApp" })] }), _jsxs("div", { className: "flex-1 overflow-y-auto scrollbar-hide", children: [_jsx(CoreParameters, {}), _jsx(StartingPortfolio, {}), simulationMode === SimulationMode.MANUAL ? (_jsx(ReturnAssumptions, {})) : (_jsx(HistoricalDataSummary, {})), _jsx(SpendingPhases, {}), _jsx(WithdrawalStrategy, {}), _jsx(DrawdownStrategy, {}), _jsx(IncomeEvents, {}), _jsx(ExpenseEvents, {})] })] }));
};
