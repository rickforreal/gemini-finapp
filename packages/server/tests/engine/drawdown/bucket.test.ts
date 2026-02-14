import { describe, it, expect } from 'vitest';
import { bucketDrawdown } from '../../../src/engine/drawdown/bucket';
import { AssetClass } from '@shared/constants/enums';

describe('bucketDrawdown', () => {
  it('should deplete asset classes in order', () => {
    const balances = {
      [AssetClass.STOCKS]: 500000,
      [AssetClass.BONDS]: 300000,
      [AssetClass.CASH]: 200000,
    };
    const order = [AssetClass.CASH, AssetClass.BONDS, AssetClass.STOCKS];
    
    // Withdraw $300,000
    const result = bucketDrawdown(300000, balances, order);
    
    expect(result.deductions[AssetClass.CASH]).toBe(200000);
    expect(result.deductions[AssetClass.BONDS]).toBe(100000);
    expect(result.deductions[AssetClass.STOCKS]).toBe(0);
    expect(result.shortfall).toBe(0);
    
    expect(balances[AssetClass.CASH]).toBe(0);
    expect(balances[AssetClass.BONDS]).toBe(200000);
    expect(balances[AssetClass.STOCKS]).toBe(500000);
  });

  it('should record shortfall when all assets are depleted', () => {
    const balances = {
      [AssetClass.STOCKS]: 100,
      [AssetClass.BONDS]: 100,
      [AssetClass.CASH]: 100,
    };
    const order = [AssetClass.CASH, AssetClass.BONDS, AssetClass.STOCKS];
    
    const result = bucketDrawdown(500, balances, order);
    
    expect(result.shortfall).toBe(200);
    expect(balances[AssetClass.CASH]).toBe(0);
    expect(balances[AssetClass.BONDS]).toBe(0);
    expect(balances[AssetClass.STOCKS]).toBe(0);
  });
});
