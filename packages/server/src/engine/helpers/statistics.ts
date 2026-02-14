/**
 * Statistical utility functions.
 */

/**
 * Calculates the mean of an array of numbers.
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculates the standard deviation of an array of numbers.
 */
export function calculateStdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = calculateMean(values);
  const squareDiffs = values.map(val => Math.pow(val - mean, 2));
  return Math.sqrt(calculateMean(squareDiffs));
}

/**
 * Calculates a specific percentile of an array of numbers.
 * Uses the linear interpolation method (R7 in some contexts).
 */
export function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;
  if (percentile <= 0) return Math.min(...values);
  if (percentile >= 100) return Math.max(...values);

  const sorted = [...values].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  if (upper >= sorted.length) return sorted[lower];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Calculates median (50th percentile).
 */
export function calculateMedian(values: number[]): number {
  return calculatePercentile(values, 50);
}
