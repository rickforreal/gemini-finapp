import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppStore } from '../../store/useAppStore';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import { PhaseCard } from './SpendingPhases/PhaseCard';
import { Plus } from 'lucide-react';
export const SpendingPhases = () => {
    const { spendingPhases, addSpendingPhase, updateSpendingPhase, removeSpendingPhase } = useAppStore();
    return (_jsx(CollapsibleSection, { title: "Spending Phases", children: _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("p", { className: "text-[11px] text-slate-400 italic", children: "Define monthly spending bounds for each phase of retirement. All amounts are in today's dollars and adjust for inflation automatically." }), _jsx("div", { className: "flex flex-col gap-4", children: spendingPhases.map((phase, index) => (_jsx(PhaseCard, { phase: phase, index: index, onUpdate: updateSpendingPhase, onRemove: removeSpendingPhase, canRemove: spendingPhases.length > 1, isLast: index === spendingPhases.length - 1 }, phase.id))) }), spendingPhases.length < 4 && (_jsxs("button", { onClick: addSpendingPhase, className: "flex items-center justify-center gap-2 w-full py-3 border border-dashed border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all text-[13px] font-medium", children: [_jsx(Plus, { size: 16 }), "Add Phase"] }))] }) }));
};
