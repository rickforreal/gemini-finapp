import { StrategyFunction } from './types';
import { pmt } from '../helpers/pmt';

/**
 * Strategy 11: Hebeler Autopilot II
 * Blends 75% prior year with 25% PMT calculation.
 */
export const hebelerAutopilot: StrategyFunction = (context) => {
  const { 
    year, 
    portfolioValue, 
    initialPortfolioValue, 
    previousWithdrawal, 
    remainingYears, 
    inflationRate, 
    params 
  } = context;

  const iwr = params.initialWithdrawalRate || 0.04;
  const pmtRate = params.pmtExpectedReturn || 0.03;
  const weight = params.priorYearWeight || 0.75;

  if (year === 1) {
    return initialPortfolioValue * iwr;
  }

  // PMT component (real)
  const pmtReal = pmt(pmtRate, remainingYears, portfolioValue, 0);
  // Convert PMT to nominal for current year
  const pmtNominal = pmtReal * Math.pow(1 + inflationRate, year - 1);

  const priorComponent = previousWithdrawal * (1 + inflationRate);

  return (weight * priorComponent) + ((1 - weight) * pmtNominal);
};
