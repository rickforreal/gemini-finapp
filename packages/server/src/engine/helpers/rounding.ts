/**
 * Centralized rounding policy.
 * All intermediate calculations use full floating-point precision.
 * Rounding to integer cents occurs at output boundaries only.
 * Method: Math.round (round half away from zero).
 */
export function roundToCents(value: number): number {
  return Math.round(value);
}
