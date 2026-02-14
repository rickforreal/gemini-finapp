import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAppStore } from '../../../store/useAppStore';
import { SegmentedToggle } from '../../shared/SegmentedToggle';
import { Landmark, PieChart } from 'lucide-react';
export const PortfolioChart = () => {
    const { simulationResults, ui, setChartDisplayMode, setChartBreakdownEnabled } = useAppStore();
    const { manual, status } = simulationResults;
    const { chartDisplayMode, chartBreakdownEnabled } = ui;
    const data = useMemo(() => {
        if (!manual)
            return [];
        return manual.rows.map((row, index) => ({
            name: row.month,
            monthIndex: index,
            total: chartDisplayMode === 'nominal'
                ? Math.round(Object.values(row.endBalances).reduce((a, b) => a + b, 0) / 100)
                : Math.round(Object.values(row.endBalances).reduce((a, b) => a + b, 0) / (row.withdrawals.nominalTotal / row.withdrawals.realTotal) / 100), // Simple real approx
            // Proper real calculation needs the cumulative inflation from engine
            // For now using the ratio in the row
            stocks: Math.round(row.endBalances.stocks / 100),
            bonds: Math.round(row.endBalances.bonds / 100),
            cash: Math.round(row.endBalances.cash / 100),
        }));
    }, [manual, chartDisplayMode]);
    if (!manual || status === 'idle') {
        return (_jsx("div", { className: "w-full h-[400px] bg-white border border-slate-200 rounded-xl flex items-center justify-center", children: _jsx("p", { className: "text-slate-400", children: "Run simulation to view chart" }) }));
    }
    const formatYAxis = (value) => {
        if (value >= 1000000)
            return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000)
            return `$${(value / 1000).toFixed(0)}k`;
        return `$${value}`;
    };
    return (_jsxs("div", { className: "flex flex-col gap-4 w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("h3", { className: "text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2", children: [_jsx(Landmark, { size: 16, className: "text-blue-600" }), "Portfolio Value Over Time"] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(SegmentedToggle, { size: "sm", options: [
                                    { label: 'Nominal', value: 'nominal' },
                                    { label: 'Real', value: 'real' },
                                ], value: chartDisplayMode, onChange: (val) => setChartDisplayMode(val) }), _jsxs("button", { onClick: () => setChartBreakdownEnabled(!chartBreakdownEnabled), className: `
              flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
              ${chartBreakdownEnabled
                                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                    : 'text-slate-500 hover:bg-slate-50 border border-transparent'}
            `, children: [_jsx(PieChart, { size: 14 }), "Breakdown"] })] })] }), _jsx("div", { className: "w-full min-h-[350px] h-[350px]", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", minHeight: 350, children: chartBreakdownEnabled ? (_jsxs(AreaChart, { data: data, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "colorStocks", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#4A90D9", stopOpacity: 0.1 }), _jsx("stop", { offset: "95%", stopColor: "#4A90D9", stopOpacity: 0 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }), _jsx(XAxis, { dataKey: "name", hide: true }), _jsx(YAxis, { tickFormatter: formatYAxis, tick: { fontSize: 10, fill: '#94a3b8' }, axisLine: false, tickLine: false }), _jsx(Tooltip, { contentStyle: { borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }, formatter: (val) => [`$${val.toLocaleString()}`, ''] }), _jsx(Area, { type: "monotone", dataKey: "stocks", stackId: "1", stroke: "#4A90D9", fill: "#4A90D9", fillOpacity: 0.6 }), _jsx(Area, { type: "monotone", dataKey: "bonds", stackId: "1", stroke: "#2EAD8E", fill: "#2EAD8E", fillOpacity: 0.6 }), _jsx(Area, { type: "monotone", dataKey: "cash", stackId: "1", stroke: "#D4A843", fill: "#D4A843", fillOpacity: 0.6 })] })) : (_jsxs(LineChart, { data: data, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }), _jsx(XAxis, { dataKey: "name", hide: true }), _jsx(YAxis, { tickFormatter: formatYAxis, tick: { fontSize: 10, fill: '#94a3b8' }, axisLine: false, tickLine: false }), _jsx(Tooltip, { contentStyle: { borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }, formatter: (val) => [`$${val.toLocaleString()}`, 'Portfolio'] }), _jsx(Line, { type: "monotone", dataKey: "total", stroke: "#2563eb", strokeWidth: 2, dot: false, activeDot: { r: 4, strokeWidth: 0 } })] })) }) }), _jsxs("div", { className: "flex justify-between text-[10px] text-slate-400 px-12 uppercase tracking-widest font-bold", children: [_jsx("span", { children: "Start of Retirement" }), _jsx("span", { children: "End of Horizon" })] })] }));
};
