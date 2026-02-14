import { StrategyFunction } from './types';

/**
 * Strategy 6: Sensible Withdrawals
 * Base rate + percentage of prior year real gains.
 */
export const sensibleWithdrawals: StrategyFunction = (context) => {
  const { portfolioValue, previousYearReturn, inflationRate, params } = context;
  const baseRate = params.baseWithdrawalRate || 0.03;
  const extrasRate = params.extrasWithdrawalRate || 0.10;

  const base = portfolioValue * baseRate;
  
  // realGain = Pₜ₋₁ * (rₜ₋₁ - i)
  // We need the portfolio value at the start of the prior year to do this perfectly,
  // but we can approximate or pass it in context.
  // For now, using a simplified model: if return > inflation, take a cut of the 'excess'
  const realGainRate = previousYearReturn - inflationRate;
  const extras = realGainRate > 0 ? (portfolioValue * realGainRate * extrasRate) : 0;

  return base + extras;
};
