import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

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

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 64,
  innerRadius = 20,
  outerRadius = 32,
}) => {
  const isEmpty = data.every(d => d.value === 0);
  const chartData = isEmpty ? [{ name: 'empty', value: 1, color: '#f1f5f9' }] : data.filter(d => d.value > 0);

  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      <PieChart width={size} height={size}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={0}
          dataKey="value"
          isAnimationActive={true}
          animationDuration={300}
          stroke="none"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
};
