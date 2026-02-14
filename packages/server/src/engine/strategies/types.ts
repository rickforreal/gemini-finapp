/**
 * Context provided to every withdrawal strategy.
 */
export interface StrategyContext {
  year: number;
  portfolioValue: number;          // in cents
  initialPortfolioValue: number;   // in cents
  previousWithdrawal: number;      // clamped, in cents
  previousYearReturn: number;      // weighted average decimal
  remainingYears: number;
  inflationRate: number;           // annual decimal
  params: any;                     // strategy-specific params
  capeRatio?: number;
}

/**
 * Type for all withdrawal strategy functions.
 * Returns the gross annual withdrawal in cents.
 */
export type StrategyFunction = (context: StrategyContext) => number;
