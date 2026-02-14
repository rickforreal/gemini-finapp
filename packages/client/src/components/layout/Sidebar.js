import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CoreParameters } from '../inputs/CoreParameters';
import { StartingPortfolio } from '../inputs/StartingPortfolio';
import { ReturnAssumptions } from '../inputs/ReturnAssumptions';
import { SpendingPhases } from '../inputs/SpendingPhases';
import { WithdrawalStrategy } from '../inputs/WithdrawalStrategy';
import { DrawdownStrategy } from '../inputs/DrawdownStrategy';
import { IncomeEvents } from '../inputs/IncomeEvents/IncomeEvents';
import { ExpenseEvents } from '../inputs/ExpenseEvents/ExpenseEvents';
export const Sidebar = () => {
    return (_jsxs("aside", { className: "w-80 h-full bg-white border-r border-slate-200 flex flex-col shrink-0", children: [_jsxs("div", { className: "p-4 border-b border-slate-200 flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-lg", children: "F" }) }), _jsx("h1", { className: "text-xl font-bold text-slate-800 tracking-tight", children: "FinApp" })] }), _jsxs("div", { className: "flex-1 overflow-y-auto scrollbar-hide", children: [_jsx(CoreParameters, {}), _jsx(StartingPortfolio, {}), _jsx(ReturnAssumptions, {}), _jsx(SpendingPhases, {}), _jsx(WithdrawalStrategy, {}), _jsx(DrawdownStrategy, {}), _jsx(IncomeEvents, {}), _jsx(ExpenseEvents, {}), _jsx("div", { className: "p-4", children: _jsxs("div", { className: "bg-blue-50 border border-blue-100 rounded-lg p-4", children: [_jsx("h4", { className: "text-xs font-bold text-blue-700 uppercase tracking-wider mb-1", children: "Phase 3: Input Panel" }), _jsx("p", { className: "text-[11px] text-blue-600 leading-relaxed", children: "All sidebar sections are now wired to the store. Change any value to see reactivity in future phases." })] }) })] })] }));
};
