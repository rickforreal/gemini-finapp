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
import { SimulationMode, MonthRow, MonteCarloResult } from '@shared';
import { Landmark, PieChart } from 'lucide-react';

export const PortfolioChart: React.FC = () => {
  const { 
    simulationResults, 
    ui, 
    setChartDisplayMode, 
    setChartBreakdownEnabled,
    simulationMode,
    coreParams
  } = useAppStore();
  
  const { manual, monteCarlo, status } = simulationResults;
  const { chartDisplayMode, chartBreakdownEnabled } = ui;

  const data = useMemo(() => {
    if (simulationMode === SimulationMode.MANUAL) {
      if (!manual) return [];
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
    } else {
      if (!monteCarlo) return [];
      const mc = monteCarlo as MonteCarloResult;
      const p50 = mc.percentiles.p50;
      return p50.map((row: MonthRow, index: number) => {
        const year = Math.floor(index / 12);
        const inflationFactor = Math.pow(1 + coreParams.inflationRate, year);
        
        const getVal = (pRow: MonthRow) => {
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
    return (
      <div className="w-full h-[400px] bg-white border border-slate-200 rounded-xl flex items-center justify-center">
        <p className="text-slate-400 font-medium">Run simulation to view {simulationMode === SimulationMode.MONTE_CARLO ? 'confidence bands' : 'projection'}</p>
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
          {simulationMode === SimulationMode.MONTE_CARLO ? 'Confidence Intervals (5th - 95th)' : 'Portfolio Value Over Time'}
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
          {simulationMode === SimulationMode.MANUAL && (
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
          )}
        </div>
      </div>

      <div className="w-full min-h-[350px] h-[350px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={350}>
          {simulationMode === SimulationMode.MONTE_CARLO ? (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" hide={true} />
              <YAxis 
                tickFormatter={formatYAxis}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                formatter={(val: number, name: string) => [`$${val.toLocaleString()}`, name.toUpperCase()]}
              />
              {/* Layered confidence bands */}
              <Area type="monotone" dataKey="p95" stroke="none" fill="#2563eb" fillOpacity={0.05} />
              <Area type="monotone" dataKey="p90" stroke="none" fill="#2563eb" fillOpacity={0.1} />
              <Area type="monotone" dataKey="p75" stroke="none" fill="#2563eb" fillOpacity={0.15} />
              <Area type="monotone" dataKey="p50" stroke="#2563eb" strokeWidth={2} fill="#2563eb" fillOpacity={0.2} name="Median (50th)" />
              <Area type="monotone" dataKey="p25" stroke="none" fill="#2563eb" fillOpacity={0.15} />
              <Area type="monotone" dataKey="p10" stroke="none" fill="#2563eb" fillOpacity={0.1} />
              <Area type="monotone" dataKey="p5" stroke="none" fill="#2563eb" fillOpacity={0.05} />
            </AreaChart>
          ) : chartBreakdownEnabled ? (
            <AreaChart data={data}>
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
                formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="stocks" stackId="1" stroke="#4A90D9" fill="#4A90D9" fillOpacity={0.6} name="Stocks" />
              <Area type="monotone" dataKey="bonds" stackId="1" stroke="#2EAD8E" fill="#2EAD8E" fillOpacity={0.6} name="Bonds" />
              <Area type="monotone" dataKey="cash" stackId="1" stroke="#D4A843" fill="#D4A843" fillOpacity={0.6} name="Cash" />
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
