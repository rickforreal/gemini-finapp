import { 
  SimulationConfig, 
  SinglePathResult, 
  MonthRow, 
  AssetClass, 
  Money, 
  MonthKey
} from '@shared';
import { strategyRegistry } from './strategies';
import { bucketDrawdown } from './drawdown/bucket';
import { rebalancingDrawdown } from './drawdown/rebalancing';
import { roundToCents } from './helpers/rounding';
import { 
  calculateMean, 
  calculateMedian, 
  calculateStdDev, 
  calculatePercentile 
} from './helpers/statistics';

export type MonthlyReturns = Record<AssetClass, number>;

export function simulateRetirement(
  config: SimulationConfig,
  returns: MonthlyReturns[],
  requestHash: string = '',
  kind: 'manual' | 'deterministic' = 'manual',
  capeRatios?: number[]
): SinglePathResult {
  const { calendar, economics, portfolio, spending, withdrawalStrategy } = config;
  const { durationMonths, startMonth } = calendar;
  const { annualInflationRate } = economics;
  
  const balances: Record<AssetClass, Money> = { ...portfolio.startingBalances };
  const initialPortfolioValue = Object.values(balances).reduce((a, b) => a + b, 0);
  
  const rows: MonthRow[] = [];
  let previousWithdrawalClamped = 0;
  let annualWithdrawalClamped = 0;
  let previousYearReturn = portfolio.assumptions.annualExpectedReturn.stocks; // Seed with expected stocks return
  
  for (let m = 0; m < durationMonths; m++) {
    const year = Math.floor(m / 12) + 1;
    const isStartOfYear = m % 12 === 0;
    
    // Calculate previous year return if we just finished a year
    if (isStartOfYear && m > 0) {
      const priorYearRows = rows.slice(m - 12, m);
      const yearReturn = priorYearRows.reduce((prod, row) => prod * (1 + row.movement.percentChange), 1) - 1;
      previousYearReturn = yearReturn;
    }

    const monthKey = addMonthsToKey(startMonth, m);

    const startBalances = { ...balances } as Record<AssetClass, Money>;
    const portfolioAtStartOfMonth = Object.values(balances).reduce((a, b) => a + b, 0);

    // 1. Apply market returns
    const monthlyReturns = returns[m];
    let nominalChange = 0;
    for (const asset of [AssetClass.STOCKS, AssetClass.BONDS, AssetClass.CASH]) {
      const change = balances[asset] * monthlyReturns[asset];
      balances[asset] += change;
      nominalChange += change;
    }
    
    // Round balances after returns
    for (const asset of [AssetClass.STOCKS, AssetClass.BONDS, AssetClass.CASH]) {
      balances[asset] = roundToCents(balances[asset]);
    }

    // 2. Process Income Events
    let incomeTotal = 0;
    const incomeById: Record<string, number> = {};
    if (config.cashflows.incomes) {
      for (const income of config.cashflows.incomes) {
        if (shouldFireEvent(income, monthKey)) {
          let amount = income.amount;
          if (income.escalation.kind === 'cpiLinked') {
            amount = amount * Math.pow(1 + annualInflationRate, year - 1);
          } else if (income.escalation.kind === 'fixedRate') {
            amount = amount * Math.pow(1 + income.escalation.annualRate, year - 1);
          }
          
          const roundedAmount = roundToCents(amount);
          balances[income.depositTo] += roundedAmount;
          incomeTotal += roundedAmount;
          incomeById[income.id] = roundedAmount;
        }
      }
    }

    // 3. Annual Withdrawal Calculation (at start of year)
    if (isStartOfYear) {
      const strategyFn = strategyRegistry[withdrawalStrategy.kind];
      const context = {
        year,
        portfolioValue: Object.values(balances).reduce((a, b) => a + b, 0),
        initialPortfolioValue,
        previousWithdrawal: previousWithdrawalClamped,
        previousYearReturn,
        remainingYears: Math.ceil((durationMonths - m) / 12),
        inflationRate: annualInflationRate,
        params: withdrawalStrategy.params,
        capeRatio: capeRatios ? capeRatios[m] : undefined,
      };
      
      const annualWithdrawal = strategyFn(context);
      
      // Spending Phase Clamping
      const inflationFactor = Math.pow(1 + annualInflationRate, year - 1);
      const minAnnual = spending.monthlyMinSpend * 12 * inflationFactor;
      const maxAnnual = spending.monthlyMaxSpend * 12 * inflationFactor;
      
      annualWithdrawalClamped = Math.min(Math.max(annualWithdrawal, minAnnual), maxAnnual);
      previousWithdrawalClamped = annualWithdrawalClamped;
    }

    // 4. Monthly Withdrawal Application
    const monthlyWithdrawalTarget = roundToCents(annualWithdrawalClamped / 12);
    let deductions: Record<AssetClass, number> = { stocks: 0, bonds: 0, cash: 0 };
    
    const currentMonthIndex = m + 1; // 1-based index
    if (currentMonthIndex >= config.core.withdrawalsStartMonth) {
       if (config.drawdownStrategy.kind === 'bucket') {
         const result = bucketDrawdown(
           monthlyWithdrawalTarget,
           balances,
           config.drawdownStrategy.params.order
         );
         deductions = result.deductions;
       } else {
         const targetAlloc = config.drawdownStrategy.params.glidePathEnabled && config.drawdownStrategy.params.glidePath
           ? interpolateGlidePath(year, config.drawdownStrategy.params.glidePath)
           : config.drawdownStrategy.params.targetAllocation;
           
         const result = rebalancingDrawdown(
           monthlyWithdrawalTarget,
           balances,
           targetAlloc
         );
         deductions = result.deductions;
       }
    }

    // 5. Process Expense Events
    let expenseTotal = 0;
    const expenseById: Record<string, number> = {};
    if (config.cashflows.expenses) {
      for (const expense of config.cashflows.expenses) {
        if (shouldFireExpense(expense, monthKey)) {
          let amount = expense.amount;
          if (expense.escalation.kind === 'cpiLinked') {
            amount = amount * Math.pow(1 + annualInflationRate, year - 1);
          } else if (expense.escalation.kind === 'fixedRate') {
            amount = amount * Math.pow(1 + expense.escalation.annualRate, year - 1);
          }
          
          const roundedAmount = roundToCents(amount);
          // Expenses follow same drawdown strategy as regular withdrawals for now
          // or we could source specifically. Requirement says "source from asset class or follow strategy"
          // Simplifying to "follow strategy" for Phase 7 implementation
          const result = config.drawdownStrategy.kind === 'bucket'
            ? bucketDrawdown(roundedAmount, balances, config.drawdownStrategy.params.order)
            : rebalancingDrawdown(roundedAmount, balances, config.drawdownStrategy.params.targetAllocation); // Using static target for simplicity in expense fallback
            
          expenseTotal += (roundedAmount - result.shortfall);
          expenseById[expense.id] = (roundedAmount - result.shortfall);
        }
      }
    }

    const nominalWithdrawalTotal = Object.values(deductions).reduce((a, b) => a + b, 0);
    const realWithdrawalTotal = nominalWithdrawalTotal / Math.pow(1 + annualInflationRate, year - 1);

    const endBalances = { ...balances } as Record<AssetClass, Money>;

    rows.push({
      month: monthKey,
      startBalances,
      movement: {
        nominalChange: roundToCents(nominalChange),
        percentChange: portfolioAtStartOfMonth > 0 ? nominalChange / portfolioAtStartOfMonth : 0,
      },
      cashflows: {
        incomeTotal,
        expenseTotal,
        incomeById,
        expenseById,
      },
      withdrawals: {
        byAsset: deductions,
        nominalTotal: nominalWithdrawalTotal,
        realTotal: roundToCents(realWithdrawalTotal),
      },
      endBalances,
    });
  }

  // Calculate Summary Stats
  const finalRow = rows[rows.length - 1];
  const totalNominalWithdrawal = rows.reduce((sum, r) => sum + r.withdrawals.nominalTotal, 0);
  const totalRealWithdrawal = rows.reduce((sum, r) => sum + r.withdrawals.realTotal, 0);
  const monthlyNominals = rows.map(r => r.withdrawals.nominalTotal);

  const summary = {
    endOfHorizon: {
      nominalEndBalance: (Object.values(finalRow.endBalances) as number[]).reduce((a, b) => a + b, 0),
      realEndBalance: roundToCents((Object.values(finalRow.endBalances) as number[]).reduce((a, b) => a + b, 0) / Math.pow(1 + annualInflationRate, Math.floor(durationMonths / 12))),
    },
    withdrawals: {
      totalNominal: totalNominalWithdrawal,
      totalReal: totalRealWithdrawal,
      meanMonthlyNominal: roundToCents(calculateMean(monthlyNominals)),
      medianMonthlyNominal: roundToCents(calculateMedian(monthlyNominals)),
      stdDevMonthlyNominal: roundToCents(calculateStdDev(monthlyNominals)),
      p25MonthlyNominal: roundToCents(calculatePercentile(monthlyNominals, 25)),
      p75MonthlyNominal: roundToCents(calculatePercentile(monthlyNominals, 75)),
    }
  };

  return {
    kind,
    requestHash,
    generatedAt: new Date().toISOString(),
    rows,
    summary,
  };
}

/**
 * Interpolates target allocation for a given year based on glide path waypoints.
 */
function interpolateGlidePath(
  year: number,
  waypoints: { year: number; allocation: Record<AssetClass, number> }[]
): Record<AssetClass, number> {
  if (!waypoints || waypoints.length === 0) return { stocks: 0.7, bonds: 0.25, cash: 0.05 };
  
  // Sort waypoints by year
  const sorted = [...waypoints].sort((a, b) => a.year - b.year);
  
  // Find bracketing waypoints
  let before = sorted[0];
  let after = sorted[sorted.length - 1];
  
  if (year <= before.year) return before.allocation;
  if (year >= after.year) return after.allocation;
  
  for (let i = 0; i < sorted.length - 1; i++) {
    if (year >= sorted[i].year && year <= sorted[i+1].year) {
      before = sorted[i];
      after = sorted[i+1];
      break;
    }
  }
  
  const range = after.year - before.year;
  const progress = (year - before.year) / range;
  
  const target: Record<AssetClass, number> = { stocks: 0, bonds: 0, cash: 0 };
  for (const asset of [AssetClass.STOCKS, AssetClass.BONDS, AssetClass.CASH]) {
    target[asset] = before.allocation[asset] + (after.allocation[asset] - before.allocation[asset]) * progress;
  }
  
  return target;
}

function shouldFireEvent(income: any, currentMonthKey: string): boolean {
  if (currentMonthKey < income.startMonth) return false;
  if (income.endMonth && currentMonthKey > income.endMonth) return false;

  const diff = monthDiff(income.startMonth, currentMonthKey);

  switch (income.cadence.kind) {
    case 'oneTime':
      return diff === 0;
    case 'monthly':
      return true;
    case 'annual': {
      // monthOfYear is 1-12
      const currentMonth = parseInt(currentMonthKey.split('-')[1]);
      return currentMonth === income.cadence.monthOfYear;
    }
    case 'custom':
      return diff % income.cadence.everyNMonths === 0;
    default:
      return false;
  }
}

function shouldFireExpense(expense: any, currentMonthKey: string): boolean {
  if (currentMonthKey < expense.startMonth) return false;
  
  const diff = monthDiff(expense.startMonth, currentMonthKey);
  return diff >= 0 && diff < expense.durationMonths;
}

function monthDiff(d1: string, d2: string): number {
  const [y1, m1] = d1.split('-').map(Number);
  const [y2, m2] = d2.split('-').map(Number);
  return (y2 - y1) * 12 + (m2 - m1);
}

/**
 * Helper to add months to a MonthKey (YYYY-MM)
 */
function addMonthsToKey(startKey: MonthKey, monthsToAdd: number): MonthKey {
  const [yearStr, monthStr] = startKey.split('-');
  let year = parseInt(yearStr);
  let month = parseInt(monthStr); // 1-12

  month += monthsToAdd;
  while (month > 12) {
    month -= 12;
    year += 1;
  }
  
  return `${year}-${month.toString().padStart(2, '0')}`;
}
