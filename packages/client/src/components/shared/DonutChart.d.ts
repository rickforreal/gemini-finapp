import React from 'react';
interface DonutChartData {
    name: string;
    value: number;
    color: string;
}
interface DonutChartProps {
    data: DonutChartData[];
    size?: number;
    innerRadius?: number;
    outerRadius?: number;
}
export declare const DonutChart: React.FC<DonutChartProps>;
export {};
