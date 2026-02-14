import { describe, it, expect, beforeEach } from 'vitest';
import { loadHistoricalData, filterDataByEra, getEraRange } from '../../src/engine/historicalData';
import { HistoricalEra } from '@shared';

describe('HistoricalDataReader', () => {
  it('should load historical data from CSV', () => {
    const data = loadHistoricalData();
    expect(data.length).toBeGreaterThan(1000);
    expect(data[0]).toMatchObject({
      year: 1926,
      month: 7,
      returns: expect.any(Object)
    });
    // Check first month returns: Stocks 3.11%, Bonds 0.2963%, Cash 0.22%
    expect(data[0].returns.stocks).toBeCloseTo(0.0311, 4);
    expect(data[0].returns.bonds).toBeCloseTo(0.002963, 6);
    expect(data[0].returns.cash).toBeCloseTo(0.0022, 4);
  });

  it('should filter data by era', () => {
    const data = loadHistoricalData();
    const lostDecade = filterDataByEra(data, HistoricalEra.LOST_DECADE);
    
    // Lost Decade: 2000-2009
    const years = lostDecade.map(m => m.year);
    expect(Math.min(...years)).toBe(2000);
    expect(Math.max(...years)).toBe(2009);
    expect(lostDecade.length).toBe(120);
  });

  it('should return correct era ranges', () => {
    expect(getEraRange(HistoricalEra.DOT_COM_CRASH)).toEqual({ startYear: 2000, endYear: 2002 });
  });
});
