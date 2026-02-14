import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppStore } from '../../../store/useAppStore';
import { CollapsibleSection } from '../../shared/CollapsibleSection';
import { IncomeEventCard } from './IncomeEventCard';
import { Plus, Download } from 'lucide-react';
import { AssetClass } from '@shared/index';
export const IncomeEvents = () => {
    const { incomeEvents, addIncomeEvent, updateIncomeEvent, removeIncomeEvent } = useAppStore();
    const presets = [
        { name: 'Social Security', amount: 250000, depositTo: AssetClass.CASH, cadence: { kind: 'monthly' }, escalation: { kind: 'cpiLinked' } },
        { name: 'Pension', amount: 150000, depositTo: AssetClass.CASH, cadence: { kind: 'monthly' }, escalation: { kind: 'none' } },
        { name: 'Rental Income', amount: 100000, depositTo: AssetClass.CASH, cadence: { kind: 'monthly' }, escalation: { kind: 'fixedRate', annualRate: 0.02 } },
    ];
    return (_jsx(CollapsibleSection, { title: "Additional Income", children: _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("p", { className: "text-[11px] text-slate-400 italic", children: "Define income sources that add funds to your portfolio during retirement." }), _jsx("div", { className: "flex flex-col gap-4", children: incomeEvents.map((event) => (_jsx(IncomeEventCard, { event: event, onUpdate: updateIncomeEvent, onRemove: removeIncomeEvent }, event.id))) }), incomeEvents.length === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50", children: [_jsx(Download, { size: 24, className: "text-slate-200 mb-2" }), _jsx("span", { className: "text-xs text-slate-400", children: "No income events defined" })] })), _jsxs("div", { className: "flex flex-col gap-2 mt-2", children: [_jsxs("button", { onClick: () => addIncomeEvent(), className: "flex items-center justify-center gap-2 w-full py-2 border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all text-xs font-medium bg-white", children: [_jsx(Plus, { size: 14 }), "Custom Income"] }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: presets.map(preset => (_jsxs("button", { onClick: () => addIncomeEvent(preset), className: "text-[10px] py-1.5 px-2 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 hover:bg-emerald-100 transition-colors text-left font-medium", children: ["+ ", preset.name] }, preset.name))) })] })] }) }));
};
