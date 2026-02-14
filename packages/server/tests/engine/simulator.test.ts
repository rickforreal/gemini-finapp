import { describe, it, expect } from 'vitest';
import { simulateRetirement, MonthlyReturns } from '../../src/engine/simulator';
import { AssetClass, WithdrawalStrategyType } from '@shared';
import { SimulationConfig } from '@shared';

describe('simulator', () => {
  const config: SimulationConfig = {
    calendar: {
      startMonth: '2026-01',
      durationMonths: 24,
    },
    core: {
      startingAgeYears: 60,
      withdrawalsStartMonth: 1,
    },
    economics: {
      annualInflationRate: 0.03,
    },
    portfolio: {
      startingBalances: {
        [AssetClass.STOCKS]: 100000000, // $1M
        [AssetClass.BONDS]: 0,
        [AssetClass.CASH]: 0,
      },
      assumptions: {
        annualExpectedReturn: {
          [AssetClass.STOCKS]: 0, // No returns for simple test
          [AssetClass.BONDS]: 0,
          [AssetClass.CASH]: 0,
        }
      }
    },
    spending: {
      monthlyMinSpend: 0,
      monthlyMaxSpend: 100000000, // No limits
    },
    withdrawalStrategy: {
      kind: WithdrawalStrategyType.CONSTANT_DOLLAR,
      params: { initialWithdrawalRate: 0.04 }
    },
    drawdownStrategy: {
      kind: 'bucket',
      params: { order: [AssetClass.STOCKS, AssetClass.BONDS, AssetClass.CASH] }
    },
    cashflows: {
      incomes: []
    }
  };

  const zeroReturns: MonthlyReturns[] = Array(24).fill({
    [AssetClass.STOCKS]: 0,
    [AssetClass.BONDS]: 0,
    [AssetClass.CASH]: 0,
  } as MonthlyReturns);

  it('should run a basic 2-year simulation with correct withdrawals', () => {
    const result = simulateRetirement(config, zeroReturns);
    
    // Year 1: 4% of $1M = $40,000 annual = $3,333.33... monthly
    // Math.round(4000000 / 12) = 333333 cents
    expect(result.rows[0].withdrawals.nominalTotal).toBe(333333);
    
    // Year 2: $40,000 * 1.03 = $41,200 annual = $3,433.33... monthly
    // Math.round(4120000 / 12) = 343333 cents
    expect(result.rows[12].withdrawals.nominalTotal).toBe(343333);
    
    expect(result.rows.length).toBe(24);
  });
});
