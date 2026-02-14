import { describe, it, expect } from 'vitest';
import { runMonteCarlo } from '../../src/engine/monteCarlo';
import { 
  SimulationConfig, 
  SimulationMode, 
  HistoricalEra, 
  WithdrawalStrategyType, 
  AssetClass 
} from '@shared';

describe('MonteCarloRunner', () => {
  const baseConfig: SimulationConfig = {
    mode: SimulationMode.MONTE_CARLO,
    calendar: { startMonth: '2026-01', durationMonths: 480 }, // 40 years
    core: { startingAgeYears: 60, withdrawalsStartMonth: 1 },
    economics: { annualInflationRate: 0.03 },
    portfolio: {
      startingBalances: { [AssetClass.STOCKS]: 100000000, [AssetClass.BONDS]: 0, [AssetClass.CASH]: 0 }, // $1M
      assumptions: { annualExpectedReturn: { stocks: 0.07, bonds: 0.03, cash: 0.02 } }
    },
    spending: { monthlyMinSpend: 0, monthlyMaxSpend: 1000000 },
    withdrawalStrategy: { 
      kind: WithdrawalStrategyType.CONSTANT_DOLLAR, 
      params: { initialWithdrawalRate: 0.04 } 
    },
    drawdownStrategy: { kind: 'bucket', params: { order: [AssetClass.CASH, AssetClass.BONDS, AssetClass.STOCKS] } },
    cashflows: { incomes: [] },
    monteCarlo: { iterations: 100, era: HistoricalEra.FULL_HISTORY, seed: 'test-seed' }
  };

  it('should run deterministic MC simulations with a seed', async () => {
    const result1 = await runMonteCarlo(baseConfig);
    const result2 = await runMonteCarlo(baseConfig);

    expect(result1.probabilityOfSuccess).toBe(result2.probabilityOfSuccess);
    expect(result1.percentiles.p50[119].endBalances.cash).toBe(result2.percentiles.p50[119].endBalances.cash);
  });

  it('should complete 1000 iterations quickly', async () => {
    const config = { 
      ...baseConfig, 
      monteCarlo: { ...baseConfig.monteCarlo!, iterations: 1000 } 
    };
    
    const start = Date.now();
    const result = await runMonteCarlo(config);
    const end = Date.now();
    
    expect(result.iterations).toBe(1000);
    expect(end - start).toBeLessThan(3000); // 3 second target
  });

  it('should return probability of success', async () => {
    const result = await runMonteCarlo(baseConfig);
    expect(result.probabilityOfSuccess).toBeGreaterThan(0.8);
    expect(result.probabilityOfSuccess).toBeLessThan(1.0);
  });
});
