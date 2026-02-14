import { StrategyFunction } from './types';

/**
 * Strategy 8: Guyton-Klinger
 * Complex rules-based withdrawal with guardrails.
 */
export const guytonKlinger: StrategyFunction = (context) => {
  const { 
    year, 
    portfolioValue, 
    initialPortfolioValue, 
    previousWithdrawal, 
    previousYearReturn, 
    remainingYears, 
    inflationRate, 
    params 
  } = context;

  const iwr = params.initialWithdrawalRate || 0.052;
  const capTrigger = params.capitalPreservationTrigger || 0.20;
  const capCut = params.capitalPreservationCut || 0.10;
  const prosTrigger = params.prosperityTrigger || 0.20;
  const prosRaise = params.prosperityRaise || 0.10;
  const sunsetYears = params.guardrailsSunset || 15;

  const capTriggerRate = iwr * (1 + capTrigger);
  const prosTriggerRate = iwr * (1 - prosTrigger);
  const isSunset = remainingYears <= sunsetYears;

  // Year 1
  if (year === 1) {
    return initialPortfolioValue * iwr;
  }

  // Rule 1: Withdrawal Rule (Inflation Adjustment)
  let withdrawal = previousWithdrawal * (1 + inflationRate);
  const currentRateBeforeAdjust = withdrawal / portfolioValue;
  
  if (previousYearReturn < 0 && currentRateBeforeAdjust > iwr) {
    withdrawal = previousWithdrawal; // Freeze
  }

  // Rule 2: Capital Preservation Rule
  if (!isSunset) {
    const rateAfterRule1 = withdrawal / portfolioValue;
    if (rateAfterRule1 > capTriggerRate) {
      withdrawal = withdrawal * (1 - capCut);
    }
  }

  // Rule 3: Prosperity Rule
  if (!isSunset) {
    const rateAfterRule2 = withdrawal / portfolioValue;
    if (rateAfterRule2 < prosTriggerRate) {
      withdrawal = withdrawal * (1 + prosRaise);
    }
  }

  return withdrawal;
};
