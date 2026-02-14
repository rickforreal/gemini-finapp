/**
 * Inflation adjustment utilities.
 */

/**
 * Adjusts a value for inflation over a given number of periods.
 * @param value - Today's dollar value
 * @param annualRate - Annual inflation rate (decimal)
 * @param years - Number of years to adjust for
 */
export function adjustForInflation(value: number, annualRate: number, years: number): number {
  return value * Math.pow(1 + annualRate, years);
}

/**
 * Calculates the monthly inflation rate from an annual rate.
 * monthlyRate = (1 + annualRate)^(1/12) - 1
 */
export function getMonthlyInflationRate(annualRate: number): number {
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

/**
 * Adjusts a value for inflation over a given number of months.
 */
export function adjustForMonthlyInflation(value: number, monthlyRate: number, months: number): number {
  return value * Math.pow(1 + monthlyRate, months);
}
