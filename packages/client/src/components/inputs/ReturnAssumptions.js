import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppStore } from '../../store/useAppStore';
import { AssetClass, SimulationMode } from '@shared/index';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import { NumericInput } from '../shared/NumericInput';
export const ReturnAssumptions = () => {
    const { simulationMode, returnAssumptions, setReturnAssumption } = useAppStore();
    if (simulationMode !== SimulationMode.MANUAL) {
        return (_jsx(CollapsibleSection, { title: "Return Assumptions", children: _jsx("div", { className: "bg-slate-50 border border-slate-100 rounded-md p-3 text-[11px] text-slate-500 italic", children: "Return assumptions are derived from historical data in Monte Carlo mode." }) }));
    }
    const assets = [
        { key: AssetClass.STOCKS, label: 'Stocks', color: '#4A90D9' },
        { key: AssetClass.BONDS, label: 'Bonds', color: '#2EAD8E' },
        { key: AssetClass.CASH, label: 'Cash', color: '#D4A843' },
    ];
    return (_jsx(CollapsibleSection, { title: "Return Assumptions", children: _jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-[-8px]", children: [_jsx("div", { className: "flex-1", children: "Asset" }), _jsx("div", { className: "w-20 text-center", children: "Exp. Return" }), _jsx("div", { className: "w-20 text-center ml-2", children: "Std. Dev." })] }), assets.map((asset) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "flex-1 flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full", style: { backgroundColor: asset.color } }), _jsx("span", { className: "text-[13px] font-medium text-slate-600", children: asset.label })] }), _jsx(NumericInput, { value: returnAssumptions[asset.key].expectedReturn, onChange: (val) => setReturnAssumption(asset.key, 'expectedReturn', val), format: "percent", suffix: "%", className: "w-20" }), _jsx(NumericInput, { value: returnAssumptions[asset.key].stdDev, onChange: (val) => setReturnAssumption(asset.key, 'stdDev', val), format: "percent", suffix: "%", className: "w-20 ml-2" })] }, asset.key))), _jsxs("div", { className: "mt-2 pt-4 border-t border-slate-50 flex flex-col gap-2", children: [_jsx("span", { className: "text-[11px] font-medium text-slate-500 italic", children: "Historical reference (approximate):" }), _jsxs("div", { className: "grid grid-cols-1 gap-1 text-[10px] text-slate-400", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "US Stocks:" }), _jsx("span", { children: "~10% return, ~15% std. dev." })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "US Bonds:" }), _jsx("span", { children: "~5% return, ~4% std. dev." })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Cash/T-Bills:" }), _jsx("span", { children: "~3% return, ~1% std. dev." })] })] })] })] }) }));
};
