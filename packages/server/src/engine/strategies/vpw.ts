import { StrategyFunction } from './types';
import { pmt } from '../helpers/pmt';

/**
 * Strategy 4: Variable Percentage Withdrawal (VPW)
 * Uses the PMT function to calculate a real withdrawal based on time horizon.
 * Wₜ = PMT(expectedRealReturn, nₜ, Pₜ, -residual)
 */
export const vpw: StrategyFunction = (context) => {
  const { portfolioValue, remainingYears, params } = context;
  const expectedRealReturn = params.expectedRealReturn || 0.03;
  const drawdownTarget = params.drawdownTarget || 1.0;
  
  const residual = (1 - drawdownTarget) * portfolioValue;
  
  // PMT returns a real withdrawal. 
  // The engine loop expects nominal, but VPW is defined in real terms.
  // StrategyContext current year inflation adjustment is handled by the loop if needed,
  // but for the strategy itself we return the absolute amount.
  return pmt(expectedRealReturn, remainingYears, portfolioValue, -residual);
};
