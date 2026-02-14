import { jsx as _jsx } from "react/jsx-runtime";
import { PieChart, Pie, Cell } from 'recharts';
export const DonutChart = ({ data, size = 64, innerRadius = 20, outerRadius = 32, }) => {
    const isEmpty = data.every(d => d.value === 0);
    const chartData = isEmpty ? [{ name: 'empty', value: 1, color: '#f1f5f9' }] : data.filter(d => d.value > 0);
    return (_jsx("div", { style: { width: size, height: size }, className: "flex items-center justify-center", children: _jsx(PieChart, { width: size, height: size, children: _jsx(Pie, { data: chartData, cx: "50%", cy: "50%", innerRadius: innerRadius, outerRadius: outerRadius, paddingAngle: 0, dataKey: "value", isAnimationActive: true, animationDuration: 300, stroke: "none", children: chartData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }) }) }));
};
