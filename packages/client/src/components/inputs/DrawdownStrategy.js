import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppStore } from '../../store/useAppStore';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import { SegmentedToggle } from '../shared/SegmentedToggle';
import { Layers, Scale } from 'lucide-react';
import { RebalancingConfig } from './DrawdownStrategy/RebalancingConfig';
export const DrawdownStrategy = () => {
    const { drawdownStrategy, setDrawdownStrategyType } = useAppStore();
    const { type, bucketOrder } = drawdownStrategy;
    return (_jsx(CollapsibleSection, { title: "Asset Drawdown Strategy", children: _jsxs("div", { className: "flex flex-col gap-4", children: [_jsx("p", { className: "text-[11px] text-slate-400 italic", children: "Determines which asset classes are drawn from when making withdrawals." }), _jsx(SegmentedToggle, { options: [
                        { label: 'Bucket', value: 'bucket', icon: _jsx(Layers, { size: 14 }) },
                        { label: 'Rebalancing', value: 'rebalancing', icon: _jsx(Scale, { size: 14 }) },
                    ], value: type, onChange: (val) => setDrawdownStrategyType(val), className: "w-full" }), _jsx("div", { className: "bg-slate-50 border border-slate-100 rounded-md p-4", children: type === 'bucket' ? (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("span", { className: "text-[11px] font-medium text-slate-500 uppercase tracking-wider", children: "Priority Order" }), _jsx("div", { className: "flex flex-col gap-2", children: bucketOrder.map((asset, i) => (_jsxs("div", { className: "flex items-center gap-3 p-2 bg-white border border-slate-200 rounded shadow-sm", children: [_jsx("span", { className: "text-[10px] font-bold text-slate-400 w-4", children: i + 1 }), _jsx("span", { className: "text-xs font-medium text-slate-600 capitalize", children: asset })] }, asset))) }), _jsxs("p", { className: "text-[10px] text-slate-400 italic mt-1", children: ["Drag to reorder coming in Phase 7. Currently: ", bucketOrder.join(' → ')] })] })) : (_jsx(RebalancingConfig, {})) })] }) }));
};
