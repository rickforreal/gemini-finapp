import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AppMode, SimulationMode, AssetClass } from '@shared/index';
import { SegmentedToggle } from '../shared/SegmentedToggle';
import { Play, LineChart, BarChart } from 'lucide-react';

export const CommandBar: React.FC = () => {
  const { 
    mode, 
    setMode, 
    simulationMode, 
    setSimulationMode,
    simulationResults,
    setSimulationStatus,
    setManualResult,
    setSimulationError
  } = useAppStore();

  const handleRun = async () => {
    setSimulationStatus('running');
    
    const { 
      incomeEvents, 
      expenseEvents,
      coreParams,
      portfolio,
      returnAssumptions,
      spendingPhases,
      withdrawalStrategy,
      drawdownStrategy,
      mode
    } = useAppStore.getState();

    // Map return assumptions from store format to API format
    const annualExpectedReturn = {
      [AssetClass.STOCKS]: returnAssumptions.stocks.expectedReturn,
      [AssetClass.BONDS]: returnAssumptions.bonds.expectedReturn,
      [AssetClass.CASH]: returnAssumptions.cash.expectedReturn,
    };

    const annualVolatility = {
      [AssetClass.STOCKS]: returnAssumptions.stocks.stdDev,
      [AssetClass.BONDS]: returnAssumptions.bonds.stdDev,
      [AssetClass.CASH]: returnAssumptions.cash.stdDev,
    };

    const request = {
      mode,
      config: {
        calendar: {
          startMonth: `${coreParams.retirementStartDate.year}-${coreParams.retirementStartDate.month.toString().padStart(2, '0')}`,
          durationMonths: coreParams.retirementDuration * 12,
        },
        core: {
          startingAgeYears: coreParams.startingAge,
          withdrawalsStartMonth: coreParams.withdrawalsStartMonth,
        },
        economics: {
          annualInflationRate: coreParams.inflationRate,
        },
        portfolio: {
          startingBalances: portfolio,
          assumptions: {
            annualExpectedReturn,
            annualVolatility,
          },
        },
        spending: {
          monthlyMinSpend: spendingPhases[0].minMonthlySpend,
          monthlyMaxSpend: spendingPhases[0].maxMonthlySpend,
        },
        withdrawalStrategy: {
          kind: withdrawalStrategy.type,
          params: withdrawalStrategy.params,
        },
        drawdownStrategy: drawdownStrategy.type === 'bucket' 
          ? {
              kind: 'bucket',
              params: { order: drawdownStrategy.bucketOrder }
            }
          : {
              kind: 'rebalancing',
              params: drawdownStrategy.rebalancing
            },
        cashflows: {
          incomes: incomeEvents,
          expenses: expenseEvents,
        },
      },
    };

    console.log('Sending Simulation Request:', request);

    try {
      const response = await fetch('/api/v1/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Simulation API Error:', errorData);
        const message = errorData.error?.message || 'Simulation failed';
        const details = errorData.error?.details ? `: ${errorData.error.details.map((d: any) => `${d.path} ${d.message}`).join(', ')}` : '';
        throw new Error(`${message}${details}`);
      }
      
      const result = await response.json();
      setManualResult(result);
    } catch (error: any) {
      console.error(error);
      setSimulationError(error.message);
      // Reset to idle after 5 seconds to allow retry
      setTimeout(() => setSimulationStatus('idle'), 5000);
    }
  };

  const getButtonContent = () => {
    if (simulationResults.status === 'running') return 'Running...';
    if (simulationResults.status === 'error') return 'Error - Try Again';
    return 'Run Simulation';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-8">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">View Mode</span>
          <SegmentedToggle
            options={[
              { label: 'Planning', value: AppMode.PLANNING },
              { label: 'Tracking', value: AppMode.TRACKING },
            ]}
            value={mode}
            onChange={setMode}
            size="sm"
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Simulation Type</span>
          <SegmentedToggle
            options={[
              { label: 'Manual', value: SimulationMode.MANUAL, icon: <LineChart size={14} /> },
              { label: 'Monte Carlo', value: SimulationMode.MONTE_CARLO, icon: <BarChart size={14} /> },
            ]}
            value={simulationMode}
            onChange={setSimulationMode}
            size="sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleRun}
          disabled={simulationResults.status === 'running'}
          className={`
            flex items-center gap-2 px-6 h-10 rounded-lg text-sm font-bold transition-all
            ${simulationResults.status === 'running' 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : simulationResults.status === 'error'
              ? 'bg-red-100 text-red-600 border border-red-200'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-[0.98]'}
          `}
        >
          <Play size={16} fill="currentColor" />
          {getButtonContent()}
        </button>
      </div>
    </header>
  );
};
