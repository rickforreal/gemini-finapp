import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppStore } from '../../store/useAppStore';
import { AssetClass } from '@shared/index';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import { NumericInput } from '../shared/NumericInput';
import { DonutChart } from '../shared/DonutChart';
export const StartingPortfolio = () => {
    const { portfolio, setPortfolioBalance } = useAppStore();
    const { stocks, bonds, cash } = portfolio;
    const total = stocks + bonds + cash;
    const stocksPct = total > 0 ? (stocks / total) * 100 : 0;
    const bondsPct = total > 0 ? (bonds / total) * 100 : 0;
    const cashPct = total > 0 ? (cash / total) * 100 : 0;
    const chartData = [
        { name: 'Stocks', value: stocks, color: '#4A90D9' },
        { name: 'Bonds', value: bonds, color: '#2EAD8E' },
        { name: 'Cash', value: cash, color: '#D4A843' },
    ];
    const AssetRow = ({ label, value, color, asset }) => (_jsxs("div", { className: "flex items-center justify-between gap-4 w-full", children: [_jsxs("div", { className: "flex items-center gap-2 flex-1 truncate", children: [_jsx("div", { className: "w-2 h-2 rounded-full shrink-0", style: { backgroundColor: color } }), _jsx("span", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate", children: label })] }), _jsx("div", { className: "w-32 shrink-0", children: _jsx(NumericInput, { value: value / 100, onChange: (val) => setPortfolioBalance(asset, val * 100), format: "currency", prefix: "$" }) })] }));
    return (_jsx(CollapsibleSection, { title: "Starting Portfolio", children: _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(AssetRow, { label: "Stocks", value: stocks, color: "#4A90D9", asset: AssetClass.STOCKS }), _jsx(AssetRow, { label: "Bonds", value: bonds, color: "#2EAD8E", asset: AssetClass.BONDS }), _jsx(AssetRow, { label: "Cash", value: cash, color: "#D4A843", asset: AssetClass.CASH }), _jsxs("div", { className: "mt-2 pt-4 border-t border-slate-50 flex items-center gap-6", children: [_jsx(DonutChart, { data: chartData }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsxs("span", { className: "text-xs font-bold text-slate-800 tabular-nums", children: ["Total: $", (total / 100).toLocaleString()] }), _jsxs("div", { className: "flex flex-col gap-0.5 text-[10px] text-slate-500", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-[#4A90D9] shrink-0" }), _jsxs("span", { className: "tabular-nums", children: ["Stocks: ", stocksPct.toFixed(1), "%"] })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-[#2EAD8E] shrink-0" }), _jsxs("span", { className: "tabular-nums", children: ["Bonds: ", bondsPct.toFixed(1), "%"] })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-[#D4A843] shrink-0" }), _jsxs("span", { className: "tabular-nums", children: ["Cash: ", cashPct.toFixed(1), "%"] })] })] })] })] })] }) }));
};
