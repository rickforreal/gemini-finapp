import { StrategyFunction } from './types';

/**
 * Strategy 3: 1/N
 * Divides the current portfolio value by the number of remaining years.
 * Wₜ = Pₜ / nₜ
 */
export const oneOverN: StrategyFunction = (context) => {
  const { portfolioValue, remainingYears } = context;
  return remainingYears > 0 ? portfolioValue / remainingYears : portfolioValue;
};
