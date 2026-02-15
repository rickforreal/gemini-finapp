import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { StatCard } from './StatCard';
import { SimulationMode } from '@shared';

export const SummaryStatsBar: React.FC = () => {
  const { simulationResults, simulationMode, ui } = useAppStore();
  const { manual, monteCarlo, status } = simulationResults;
  const { chartDisplayMode } = ui;

  const activeResult = simulationMode === SimulationMode.MONTE_CARLO ? monteCarlo : manual;
  const cardCount = simulationMode === SimulationMode.MONTE_CARLO ? 9 : 8;

  if (!activeResult || status === 'idle' || status === 'running') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 ${simulationMode === SimulationMode.MONTE_CARLO ? 'xl:grid-cols-9' : 'xl:grid-cols-8'} gap-3 w-full animate-pulse`}>
        {[...Array(cardCount)].map((_, i) => (
          <div key={i} className="h-20 bg-white border border-slate-100 rounded-xl" />
        ))}
      </div>
    );
  }

  const { summary } = activeResult;
  const formatCurrency = (cents: number) => 
    `$${Math.round(cents / 100).toLocaleString()}`;

  const successRate = simulationMode === SimulationMode.MONTE_CARLO 
    ? ((monteCarlo?.probabilityOfSuccess || 0) * 100).toFixed(1) + '%'
    : null;

  // Determine Terminal Value based on display mode
  const terminalValue = chartDisplayMode === 'real' 
    ? summary.endOfHorizon.realEndBalance
    : summary.endOfHorizon.nominalEndBalance;
  
  const terminalLabel = chartDisplayMode === 'real' ? 'Terminal (Real)' : 'Terminal (Nominal)';

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 ${simulationMode === SimulationMode.MONTE_CARLO ? 'xl:grid-cols-9' : 'xl:grid-cols-8'} gap-3 w-full`}>
      <StatCard 
        label="Total Nominal" 
        value={formatCurrency(summary.withdrawals.totalNominal)} 
      />
      <StatCard 
        label="Total Real" 
        value={formatCurrency(summary.withdrawals.totalReal)} 
      />
      <StatCard 
        label="Median" 
        value={formatCurrency(summary.withdrawals.medianMonthlyNominal)} 
      />
      <StatCard 
        label="Mean" 
        value={formatCurrency(summary.withdrawals.meanMonthlyNominal)} 
      />
      <StatCard 
        label="Std. Dev." 
        value={formatCurrency(summary.withdrawals.stdDevMonthlyNominal)} 
      />
      <StatCard 
        label="25th Pct" 
        value={formatCurrency(summary.withdrawals.p25MonthlyNominal)} 
      />
      <StatCard 
        label="75th Pct" 
        value={formatCurrency(summary.withdrawals.p75MonthlyNominal)} 
      />
      <StatCard 
        label={terminalLabel} 
        value={formatCurrency(terminalValue)}
        type="terminal"
        isSuccess={terminalValue > 0}
      />
      {simulationMode === SimulationMode.MONTE_CARLO && (
        <StatCard 
          label="Success Rate" 
          value={successRate || '0%'}
          type="terminal"
          isSuccess={(monteCarlo?.probabilityOfSuccess || 0) >= 0.9}
        />
      )}
    </div>
  );
};
