import { StrategyFunction } from './types';

/**
 * Strategy 5: Dynamic SWR
 * Annuitizes the portfolio based on expected return and inflation.
 */
export const dynamicSwr: StrategyFunction = (context) => {
  const { portfolioValue, remainingYears, inflationRate, params } = context;
  const roi = params.expectedRateOfReturn || 0.06;
  const inf = inflationRate;

  if (roi === inf) {
    return portfolioValue / remainingYears;
  }

  return portfolioValue * (roi - inf) / (1 - Math.pow((1 + inf) / (1 + roi), remainingYears));
};
