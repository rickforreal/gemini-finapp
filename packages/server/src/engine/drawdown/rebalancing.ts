import { AssetClass } from '@shared/constants/enums';
import { DrawdownResult } from './bucket';

/**
 * Drawdown Strategy B: Rebalancing
 * Sourced to move the portfolio toward target allocation.
 */
export function rebalancingDrawdown(
  amount: number,
  balances: Record<AssetClass, number>,
  targetAllocation: Record<AssetClass, number>
): DrawdownResult {
  const totalPortfolio = Object.values(balances).reduce((a, b) => a + b, 0);
  const deductions: Record<AssetClass, number> = {
    [AssetClass.STOCKS]: 0,
    [AssetClass.BONDS]: 0,
    [AssetClass.CASH]: 0,
  };

  if (totalPortfolio === 0) {
    return { deductions, shortfall: amount };
  }

  // Step 1: Adjust targets if any asset class is depleted
  const activeTargets = { ...targetAllocation };
  let activeTargetSum = 0;
  for (const asset of [AssetClass.STOCKS, AssetClass.BONDS, AssetClass.CASH]) {
    if (balances[asset] <= 0) {
      activeTargets[asset] = 0;
    }
    activeTargetSum += activeTargets[asset];
  }

  // Normalize if sum > 0, otherwise target remains 0
  if (activeTargetSum > 0) {
    for (const asset of [AssetClass.STOCKS, AssetClass.BONDS, AssetClass.CASH]) {
      activeTargets[asset] = activeTargets[asset] / activeTargetSum;
    }
  }

  // Step 2: Calculate overweight amounts
  const overweight: Record<AssetClass, number> = {
    [AssetClass.STOCKS]: 0,
    [AssetClass.BONDS]: 0,
    [AssetClass.CASH]: 0,
  };
  let totalOverweight = 0;

  for (const asset of [AssetClass.STOCKS, AssetClass.BONDS, AssetClass.CASH]) {
    const targetDollars = totalPortfolio * activeTargets[asset];
    overweight[asset] = Math.max(0, balances[asset] - targetDollars);
    totalOverweight += overweight[asset];
  }

  // Step 3: Source from overweight classes proportionally
  let remaining = amount;
  if (totalOverweight > 0) {
    const sourcingFromOverweight = Math.min(remaining, totalOverweight);
    for (const asset of [AssetClass.STOCKS, AssetClass.BONDS, AssetClass.CASH]) {
      const deduction = sourcingFromOverweight * (overweight[asset] / totalOverweight);
      deductions[asset] = deduction;
      balances[asset] -= deduction;
      remaining -= deduction;
    }
  }

  // Step 4: If still remaining, distribute remainder proportionally to active targets
  if (remaining > 0 && activeTargetSum > 0) {
    for (const asset of [AssetClass.STOCKS, AssetClass.BONDS, AssetClass.CASH]) {
      if (balances[asset] > 0) {
        const deduction = Math.min(balances[asset], remaining * activeTargets[asset]);
        deductions[asset] += deduction;
        balances[asset] -= deduction;
        remaining -= deduction;
      }
    }
  }

  // Step 5: Final fallback for any remaining shortfall (last stand)
  if (remaining > 0) {
    for (const asset of [AssetClass.STOCKS, AssetClass.BONDS, AssetClass.CASH]) {
      const deduction = Math.min(balances[asset], remaining);
      deductions[asset] += deduction;
      balances[asset] -= deduction;
      remaining -= deduction;
      if (remaining <= 0) break;
    }
  }

  return {
    deductions,
    shortfall: Math.max(0, remaining),
  };
}
