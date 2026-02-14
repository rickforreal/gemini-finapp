import { StrategyFunction } from './types';

/**
 * Strategy 9: Vanguard Dynamic Spending
 * Corridor-based smoothing.
 */
export const vanguardDynamic: StrategyFunction = (context) => {
  const { portfolioValue, previousWithdrawal, inflationRate, params } = context;
  const rate = params.annualWithdrawalRate || 0.05;
  const ceiling = params.ceiling || 0.05;
  const floor = params.floor || 0.025;

  const target = portfolioValue * rate;
  
  // Ceiling and floor are relative to prior real spending
  const ceilingAmount = previousWithdrawal * (1 + inflationRate) * (1 + ceiling);
  const floorAmount = previousWithdrawal * (1 + inflationRate) * (1 - floor);

  return Math.min(Math.max(target, floorAmount), ceilingAmount);
};
