/**
 * Return generation utilities.
 */

/**
 * Generates a random number from a normal distribution using Box-Muller transform.
 */
export function randomNormal(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
}

/**
 * Converts annual return parameters to monthly return parameters.
 * Note: sigma_m = sigma_a / sqrt(12) is a common approximation.
 */
export function annualToMonthlyReturns(annualExpectedReturn: number, annualStdDev: number): {
  monthlyMean: number;
  monthlyStdDev: number;
} {
  const monthlyMean = Math.pow(1 + annualExpectedReturn, 1 / 12) - 1;
  const monthlyStdDev = annualStdDev / Math.sqrt(12);
  
  return { monthlyMean, monthlyStdDev };
}

/**
 * Generates a random monthly return based on annual parameters.
 */
export function generateRandomMonthlyReturn(annualExpectedReturn: number, annualStdDev: number): number {
  const { monthlyMean, monthlyStdDev } = annualToMonthlyReturns(annualExpectedReturn, annualStdDev);
  return randomNormal(monthlyMean, monthlyStdDev);
}
