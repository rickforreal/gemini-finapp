import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { StatCard } from './StatCard';
import { SimulationMode } from '@shared/index';

export const SummaryStatsBar: React.FC = () => {
  const { simulationResults, simulationMode } = useAppStore();
  const { manual, status } = simulationResults;

  const cardCount = simulationMode === SimulationMode.MONTE_CARLO ? 9 : 8;

  if (!manual || status === 'idle' || status === 'running') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 w-full animate-pulse">
        {[...Array(cardCount)].map((_, i) => (
          <div key={i} className="h-20 bg-white border border-slate-100 rounded-xl" />
        ))}
      </div>
    );
  }

  const { summary } = manual;
  const formatCurrency = (cents: number) => 
    `$${Math.round(cents / 100).toLocaleString()}`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 w-full">
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
        label="Terminal" 
        value={formatCurrency(summary.endOfHorizon.nominalEndBalance)}
        type="terminal"
        isSuccess={summary.endOfHorizon.nominalEndBalance > 0}
      />
      {simulationMode === SimulationMode.MONTE_CARLO && (
        <StatCard 
          label="Success Rate" 
          value="--" 
        />
      )}
    </div>
  );
};
