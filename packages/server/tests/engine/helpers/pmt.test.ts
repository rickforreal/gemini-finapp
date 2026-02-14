import { describe, it, expect } from 'vitest';
import { pmt } from '../../../src/engine/helpers/pmt';

describe('pmt', () => {
  it('should calculate the correct withdrawal for the example in WITHDRAWAL_STRATEGIES.md', () => {
    // PMT(0.03, 30, 1000000, 0) -> $51,019
    const result = pmt(0.03, 30, 1000000, 0);
    expect(Math.round(result)).toBe(51019);
  });

  it('should handle rate = 0 by simple division', () => {
    // (1000000 + 0) / 40 = 25000
    const result = pmt(0, 40, 1000000, 0);
    expect(result).toBe(25000);
  });

  it('should handle a residual future value', () => {
    // If we want to leave $200,000 after 30 years at 3%
    // PMT(0.03, 30, 1000000, -200000)
    const result = pmt(0.03, 30, 1000000, -200000);
    // Calculated: 0.03 * (1000000 * 1.03^30 - 200000) / (1.03^30 - 1)
    // 1.03^30 = 2.42726
    // 0.03 * (2427262 - 200000) / 1.42726
    // 0.03 * 2227262 / 1.42726 = 66817.86 / 1.42726 = 46815.5
    expect(Math.round(result)).toBe(46815);
  });
});
