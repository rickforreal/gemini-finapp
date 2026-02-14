import { StrategyFunction } from './types';

/**
 * Strategy 1: Constant Dollar
 * Withdraws a fixed dollar amount each year (set as a percentage of the initial portfolio),
 * adjusted for inflation annually. The classic "4% Rule."
 * 
 * Year 1: W₁ = P₀ * initialWithdrawalRate
 * Year t > 1: Wₜ = Wₜ₋₁_clamped * (1 + i)
 */
export const constantDollar: StrategyFunction = (context) => {
  const { year, initialPortfolioValue, previousWithdrawal, inflationRate, params } = context;

  if (year === 1) {
    const rate = params.initialWithdrawalRate || 0.04;
    return initialPortfolioValue * rate;
  }

  return previousWithdrawal * (1 + inflationRate);
};
