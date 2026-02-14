import { StrategyFunction } from './types';

/**
 * Strategy 7: 95% Rule
 * Percent of portfolio, but never less than 95% of prior year.
 */
export const ninetyFivePercent: StrategyFunction = (context) => {
  const { portfolioValue, previousWithdrawal, params } = context;
  const rate = params.annualWithdrawalRate || 0.04;
  const floor = params.minimumFloor || 0.95;

  const target = portfolioValue * rate;
  const floorAmount = previousWithdrawal * floor;

  return Math.max(target, floorAmount);
};
