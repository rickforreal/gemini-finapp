/**
 * Calculates the periodic payment for an annuity (withdrawal amount).
 * Based on the PMT formula from WITHDRAWAL_STRATEGIES.md Appendix.
 * 
 * @param rate - periodic interest rate (decimal)
 * @param nper - total number of periods
 * @param pv - present value (portfolio balance)
 * @param fv - future value (target residual balance, usually 0 or negative)
 * @returns The positive withdrawal amount per period.
 */
export function pmt(rate: number, nper: number, pv: number, fv: number = 0): number {
  if (rate === 0) {
    return (pv + fv) / nper;
  }

  const pow = Math.pow(1 + rate, nper);
  // Using the absolute value version for withdrawal as per appendix
  return (rate * (pv * pow + fv)) / (pow - 1);
}
