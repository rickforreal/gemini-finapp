import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppStore } from '../../../store/useAppStore';
import { CollapsibleSection } from '../../shared/CollapsibleSection';
import { ExpenseEventCard } from './ExpenseEventCard';
import { Plus, Upload } from 'lucide-react';
export const ExpenseEvents = () => {
    const { expenseEvents, addExpenseEvent, updateExpenseEvent, removeExpenseEvent } = useAppStore();
    const presets = [
        { name: 'New Roof', amount: 3500000, durationMonths: 1, escalation: { kind: 'none' } },
        { name: 'Long-Term Care', amount: 400000, durationMonths: 120, escalation: { kind: 'cpiLinked' } },
        { name: 'World Cruise', amount: 5000000, durationMonths: 1, escalation: { kind: 'none' } },
    ];
    return (_jsx(CollapsibleSection, { title: "Large Expenses", children: _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("p", { className: "text-[11px] text-slate-400 italic", children: "Define irregular or planned large expenses that will be drawn from your portfolio." }), _jsx("div", { className: "flex flex-col gap-4", children: expenseEvents.map((event) => (_jsx(ExpenseEventCard, { event: event, onUpdate: updateExpenseEvent, onRemove: removeExpenseEvent }, event.id))) }), expenseEvents.length === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50", children: [_jsx(Upload, { size: 24, className: "text-slate-200 mb-2" }), _jsx("span", { className: "text-xs text-slate-400", children: "No expenses defined" })] })), _jsxs("div", { className: "flex flex-col gap-2 mt-2", children: [_jsxs("button", { onClick: () => addExpenseEvent(), className: "flex items-center justify-center gap-2 w-full py-2 border border-slate-200 rounded-lg text-slate-500 hover:text-red-600 hover:border-red-200 transition-all text-xs font-medium bg-white", children: [_jsx(Plus, { size: 14 }), "Custom Expense"] }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: presets.map(preset => (_jsxs("button", { onClick: () => addExpenseEvent(preset), className: "text-[10px] py-1.5 px-2 bg-rose-50 text-rose-700 rounded border border-rose-100 hover:bg-rose-100 transition-colors text-left font-medium", children: ["+ ", preset.name] }, preset.name))) })] })] }) }));
};
