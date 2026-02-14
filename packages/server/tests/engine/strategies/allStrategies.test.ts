import { describe, it, expect } from 'vitest';
import { strategyRegistry } from '../../../src/engine/strategies';
import { WithdrawalStrategyType } from '@shared/constants/enums';
import { StrategyContext } from '../../../src/engine/strategies/types';

describe('Withdrawal Strategies', () => {
  const baseContext: StrategyContext = {
    year: 1,
    portfolioValue: 100000000, // $1M
    initialPortfolioValue: 100000000,
    previousWithdrawal: 0,
    previousYearReturn: 0.05,
    remainingYears: 30,
    inflationRate: 0.03,
    params: {}
  };

  it('Constant Dollar: should inflate Year 2', () => {
    const fn = strategyRegistry[WithdrawalStrategyType.CONSTANT_DOLLAR];
    const w1 = fn({ ...baseContext, year: 1, params: { initialWithdrawalRate: 0.04 } });
    expect(w1).toBe(4000000);
    const w2 = fn({ ...baseContext, year: 2, previousWithdrawal: w1 });
    expect(w2).toBe(4120000);
  });

  it('Percent of Portfolio: should track current portfolio', () => {
    const fn = strategyRegistry[WithdrawalStrategyType.PERCENT_OF_PORTFOLIO];
    const w = fn({ ...baseContext, portfolioValue: 80000000, params: { annualRate: 0.05 } });
    expect(w).toBe(4000000);
  });

  it('1/N: should divide by remaining years', () => {
    const fn = strategyRegistry[WithdrawalStrategyType.ONE_OVER_N];
    const w = fn({ ...baseContext, remainingYears: 20 });
    expect(w).toBe(5000000);
  });

  it('VPW: should calculate via PMT', () => {
    const fn = strategyRegistry[WithdrawalStrategyType.VPW];
    const w = fn({ ...baseContext, params: { expectedRealReturn: 0.03, drawdownTarget: 1.0 } });
    // PMT(0.03, 30, 1000000, 0) is ~51019
    expect(Math.round(w / 100)).toBe(51019);
  });

  it('Guyton-Klinger: should calculate Year 1 correctly', () => {
    const fn = strategyRegistry[WithdrawalStrategyType.GUYTON_KLINGER];
    const w = fn({ ...baseContext, year: 1, params: { initialWithdrawalRate: 0.052 } });
    expect(w).toBe(5200000);
  });

  it('Endowment: should blend prior and current', () => {
    const fn = strategyRegistry[WithdrawalStrategyType.ENDOWMENT];
    const w = fn({ 
      ...baseContext, 
      year: 2, 
      previousWithdrawal: 5000000, 
      portfolioValue: 100000000,
      params: { spendingRate: 0.05, smoothingWeight: 0.70 }
    });
    // 0.70 * (5000000 * 1.03) + 0.30 * (100000000 * 0.05)
    // 0.70 * 5150000 + 0.30 * 5000000
    // 3605000 + 1500000 = 5105000
    expect(w).toBe(5105000);
  });

  it('CAPE-Based: should adjust by CAPE', () => {
    const fn = strategyRegistry[WithdrawalStrategyType.CAPE_BASED];
    const w = fn({ 
      ...baseContext, 
      params: { baseWithdrawalRate: 0.015, capeWeight: 0.5, startingCAPE: 20.0 } 
    });
    // 0.015 + (0.5 / 20) = 0.015 + 0.025 = 0.04
    expect(w).toBe(4000000);
  });
});
