import { describe, it, expect } from 'vitest';
import { constantDollar } from '../../../src/engine/strategies/constantDollar';

describe('constantDollar', () => {
  const baseContext = {
    initialPortfolioValue: 100000000, // $1M in cents
    previousWithdrawal: 0,
    inflationRate: 0.03,
    remainingYears: 30,
    previousYearReturn: 0.05,
    portfolioValue: 100000000,
    params: { initialWithdrawalRate: 0.04 }
  };

  it('should return portfolio * rate in Year 1', () => {
    const result = constantDollar({ ...baseContext, year: 1 });
    expect(result).toBe(4000000); // 4% of $1M is $40k
  });

  it('should inflate the previous withdrawal in Year 2+', () => {
    const previousWithdrawal = 4000000;
    const result = constantDollar({ 
      ...baseContext, 
      year: 2, 
      previousWithdrawal 
    });
    expect(result).toBe(4000000 * 1.03); // $41,200
  });

  it('should handle zero portfolio in Year 1', () => {
    const result = constantDollar({ 
      ...baseContext, 
      year: 1, 
      initialPortfolioValue: 0 
    });
    expect(result).toBe(0);
  });
});
