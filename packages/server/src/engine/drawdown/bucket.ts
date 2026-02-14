import { AssetClass } from '@shared/constants/enums';

export interface DrawdownResult {
  deductions: Record<AssetClass, number>;
  shortfall: number;
}

/**
 * Drawdown Strategy A: Bucket
 * Processes withdrawals sequentially through asset classes in priority order.
 */
export function bucketDrawdown(
  amount: number,
  balances: Record<AssetClass, number>,
  order: AssetClass[]
): DrawdownResult {
  const deductions: Record<AssetClass, number> = {
    stocks: 0,
    bonds: 0,
    cash: 0,
  };

  let remaining = amount;

  for (const assetClass of order) {
    const available = balances[assetClass];
    const deduction = Math.min(remaining, available);
    
    deductions[assetClass] = deduction;
    balances[assetClass] -= deduction;
    remaining -= deduction;
    
    if (remaining === 0) {
      break;
    }
  }

  return {
    deductions,
    shortfall: remaining,
  };
}
