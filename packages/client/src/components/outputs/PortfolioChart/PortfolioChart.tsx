import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { useAppStore } from '../../../store/useAppStore';
import { SegmentedToggle } from '../../shared/SegmentedToggle';
import { Landmark, PieChart } from 'lucide-react';

export const PortfolioChart: React.FC = () => {
  const { 
    simulationResults, 
    ui, 
    setChartDisplayMode, 
    setChartBreakdownEnabled 
  } = useAppStore();
  
  const { manual, status } = simulationResults;
  const { chartDisplayMode, chartBreakdownEnabled } = ui;

  const data = useMemo(() => {
    if (!manual) return [];
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
    return (
      <div className="w-full h-[400px] bg-white border border-slate-200 rounded-xl flex items-center justify-center">
        <p className="text-slate-400">Run simulation to view chart</p>
      </div>
    );
  }

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Landmark size={16} className="text-blue-600" />
          Portfolio Value Over Time
        </h3>
        
        <div className="flex items-center gap-4">
          <SegmentedToggle
            size="sm"
            options={[
              { label: 'Nominal', value: 'nominal' },
              { label: 'Real', value: 'real' },
            ]}
            value={chartDisplayMode}
            onChange={(val) => setChartDisplayMode(val as 'nominal' | 'real')}
          />
          <button
            onClick={() => setChartBreakdownEnabled(!chartBreakdownEnabled)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
              ${chartBreakdownEnabled 
                ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                : 'text-slate-500 hover:bg-slate-50 border border-transparent'}
            `}
          >
            <PieChart size={14} />
            Breakdown
          </button>
        </div>
      </div>

      <div className="w-full min-h-[350px] h-[350px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={350}>
          {chartBreakdownEnabled ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorStocks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A90D9" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4A90D9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                hide={true}
              />
              <YAxis 
                tickFormatter={formatYAxis}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
              />
              <Area 
                type="monotone" 
                dataKey="stocks" 
                stackId="1" 
                stroke="#4A90D9" 
                fill="#4A90D9" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="bonds" 
                stackId="1" 
                stroke="#2EAD8E" 
                fill="#2EAD8E" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="cash" 
                stackId="1" 
                stroke="#D4A843" 
                fill="#D4A843" 
                fillOpacity={0.6}
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" hide={true} />
              <YAxis 
                tickFormatter={formatYAxis}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(val: number) => [`$${val.toLocaleString()}`, 'Portfolio']}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#2563eb" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 px-12 uppercase tracking-widest font-bold">
        <span>Start of Retirement</span>
        <span>End of Horizon</span>
      </div>
    </div>
  );
};
