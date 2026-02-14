import { StrategyFunction } from './types';

/**
 * Strategy 2: Percent of Portfolio
 * Withdraws a fixed percentage of the current portfolio value each year.
 * Wₜ = Pₜ * annualWithdrawalRate
 */
export const percentOfPortfolio: StrategyFunction = (context) => {
  const { portfolioValue, params } = context;
  const rate = params.annualRate || 0.04;
  return portfolioValue * rate;
};
