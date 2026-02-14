import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAppStore } from '../../../store/useAppStore';
import { SegmentedToggle } from '../../shared/SegmentedToggle';
import { SimulationMode } from '@shared';
import { Landmark, PieChart } from 'lucide-react';
export const PortfolioChart = () => {
    const { simulationResults, ui, setChartDisplayMode, setChartBreakdownEnabled, simulationMode, coreParams } = useAppStore();
    const { manual, monteCarlo, status } = simulationResults;
    const { chartDisplayMode, chartBreakdownEnabled } = ui;
    const data = useMemo(() => {
        if (simulationMode === SimulationMode.MANUAL) {
            if (!manual)
                return [];
            return manual.rows.map((row, index) => {
                const nominalTotal = Object.values(row.endBalances).reduce((a, b) => a + b, 0);
                const year = Math.floor(index / 12);
                const inflationFactor = Math.pow(1 + coreParams.inflationRate, year);
                const realTotal = nominalTotal / inflationFactor;
                return {
                    name: row.month,
                    monthIndex: index,
                    total: chartDisplayMode === 'nominal'
                        ? Math.round(nominalTotal / 100)
                        : Math.round(realTotal / 100),
                    stocks: Math.round(row.endBalances.stocks / 100),
                    bonds: Math.round(row.endBalances.bonds / 100),
                    cash: Math.round(row.endBalances.cash / 100),
                };
            });
        }
        else {
            if (!monteCarlo)
                return [];
            const mc = monteCarlo;
            const p50 = mc.percentiles.p50;
            return p50.map((row, index) => {
                const year = Math.floor(index / 12);
                const inflationFactor = Math.pow(1 + coreParams.inflationRate, year);
                const getVal = (pRow) => {
                    const nominal = Object.values(pRow.endBalances).reduce((a, b) => a + b, 0);
                    return chartDisplayMode === 'nominal'
                        ? Math.round(nominal / 100)
                        : Math.round((nominal / inflationFactor) / 100);
                };
                return {
                    name: row.month,
                    p5: getVal(mc.percentiles.p5[index]),
                    p10: getVal(mc.percentiles.p10[index]),
                    p25: getVal(mc.percentiles.p25[index]),
                    p50: getVal(mc.percentiles.p50[index]),
                    p75: getVal(mc.percentiles.p75[index]),
                    p90: getVal(mc.percentiles.p90[index]),
                    p95: getVal(mc.percentiles.p95[index]),
                };
            });
        }
    }, [manual, monteCarlo, simulationMode, chartDisplayMode, coreParams.inflationRate]);
    if (status === 'idle' || (simulationMode === SimulationMode.MANUAL && !manual) || (simulationMode === SimulationMode.MONTE_CARLO && !monteCarlo)) {
        return (_jsx("div", { className: "w-full h-[400px] bg-white border border-slate-200 rounded-xl flex items-center justify-center", children: _jsxs("p", { className: "text-slate-400 font-medium", children: ["Run simulation to view ", simulationMode === SimulationMode.MONTE_CARLO ? 'confidence bands' : 'projection'] }) }));
    }
    const formatYAxis = (value) => {
        if (value >= 1000000)
            return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000)
            return `$${(value / 1000).toFixed(0)}k`;
        return `$${value}`;
    };
    return (_jsxs("div", { className: "flex flex-col gap-4 w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("h3", { className: "text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2", children: [_jsx(Landmark, { size: 16, className: "text-blue-600" }), simulationMode === SimulationMode.MONTE_CARLO ? 'Confidence Intervals (5th - 95th)' : 'Portfolio Value Over Time'] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(SegmentedToggle, { size: "sm", options: [
                                    { label: 'Nominal', value: 'nominal' },
                                    { label: 'Real', value: 'real' },
                                ], value: chartDisplayMode, onChange: (val) => setChartDisplayMode(val) }), simulationMode === SimulationMode.MANUAL && (_jsxs("button", { onClick: () => setChartBreakdownEnabled(!chartBreakdownEnabled), className: `
                flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                ${chartBreakdownEnabled
                                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                    : 'text-slate-500 hover:bg-slate-50 border border-transparent'}
              `, children: [_jsx(PieChart, { size: 14 }), "Breakdown"] }))] })] }), _jsx("div", { className: "w-full min-h-[350px] h-[350px]", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", minHeight: 350, children: simulationMode === SimulationMode.MONTE_CARLO ? (_jsxs(AreaChart, { data: data, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }), _jsx(XAxis, { dataKey: "name", hide: true }), _jsx(YAxis, { tickFormatter: formatYAxis, tick: { fontSize: 10, fill: '#94a3b8' }, axisLine: false, tickLine: false }), _jsx(Tooltip, { contentStyle: { borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }, labelStyle: { fontWeight: 'bold', marginBottom: '4px' }, formatter: (val, name) => [`$${val.toLocaleString()}`, name.toUpperCase()] }), _jsx(Area, { type: "monotone", dataKey: "p95", stroke: "none", fill: "#2563eb", fillOpacity: 0.05 }), _jsx(Area, { type: "monotone", dataKey: "p90", stroke: "none", fill: "#2563eb", fillOpacity: 0.1 }), _jsx(Area, { type: "monotone", dataKey: "p75", stroke: "none", fill: "#2563eb", fillOpacity: 0.15 }), _jsx(Area, { type: "monotone", dataKey: "p50", stroke: "#2563eb", strokeWidth: 2, fill: "#2563eb", fillOpacity: 0.2, name: "Median (50th)" }), _jsx(Area, { type: "monotone", dataKey: "p25", stroke: "none", fill: "#2563eb", fillOpacity: 0.15 }), _jsx(Area, { type: "monotone", dataKey: "p10", stroke: "none", fill: "#2563eb", fillOpacity: 0.1 }), _jsx(Area, { type: "monotone", dataKey: "p5", stroke: "none", fill: "#2563eb", fillOpacity: 0.05 })] })) : chartBreakdownEnabled ? (_jsxs(AreaChart, { data: data, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }), _jsx(XAxis, { dataKey: "name", hide: true }), _jsx(YAxis, { tickFormatter: formatYAxis, tick: { fontSize: 10, fill: '#94a3b8' }, axisLine: false, tickLine: false }), _jsx(Tooltip, { contentStyle: { borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }, formatter: (val) => [`$${val.toLocaleString()}`, ''] }), _jsx(Area, { type: "monotone", dataKey: "stocks", stackId: "1", stroke: "#4A90D9", fill: "#4A90D9", fillOpacity: 0.6, name: "Stocks" }), _jsx(Area, { type: "monotone", dataKey: "bonds", stackId: "1", stroke: "#2EAD8E", fill: "#2EAD8E", fillOpacity: 0.6, name: "Bonds" }), _jsx(Area, { type: "monotone", dataKey: "cash", stackId: "1", stroke: "#D4A843", fill: "#D4A843", fillOpacity: 0.6, name: "Cash" })] })) : (_jsxs(LineChart, { data: data, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }), _jsx(XAxis, { dataKey: "name", hide: true }), _jsx(YAxis, { tickFormatter: formatYAxis, tick: { fontSize: 10, fill: '#94a3b8' }, axisLine: false, tickLine: false }), _jsx(Tooltip, { contentStyle: { borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }, formatter: (val) => [`$${val.toLocaleString()}`, 'Portfolio'] }), _jsx(Line, { type: "monotone", dataKey: "total", stroke: "#2563eb", strokeWidth: 2, dot: false, activeDot: { r: 4, strokeWidth: 0 } })] })) }) }), _jsxs("div", { className: "flex justify-between text-[10px] text-slate-400 px-12 uppercase tracking-widest font-bold", children: [_jsx("span", { children: "Start of Retirement" }), _jsx("span", { children: "End of Horizon" })] })] }));
};
