import { StrategyFunction } from './types';

/**
 * Strategy 10: Endowment Strategy
 * Weighted average of prior spending and current portfolio.
 */
export const endowment: StrategyFunction = (context) => {
  const { portfolioValue, previousWithdrawal, inflationRate, params } = context;
  const rate = params.spendingRate || 0.05;
  const weight = params.smoothingWeight || 0.70;

  const priorComponent = previousWithdrawal * (1 + inflationRate);
  const newComponent = portfolioValue * rate;

  return (weight * priorComponent) + ((1 - weight) * newComponent);
};
