import { StrategyFunction } from './types';

/**
 * Strategy 12: CAPE-Based
 * Adjusts withdrawals based on market valuation.
 * Rate = a + (b / CAPE)
 */
export const capeBased: StrategyFunction = (context) => {
  const { portfolioValue, params, capeRatio } = context;
  
  const a = params.baseWithdrawalRate || 0.015;
  const b = params.capeWeight || 0.5;
  // Use passed CAPE or default to starting CAPE
  const currentCape = capeRatio || params.startingCAPE || 30.0;

  const rate = a + (b / currentCape);
  return portfolioValue * rate;
};
