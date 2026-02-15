import seedrandom from 'seedrandom';
import { 
  SimulationConfig, 
  MonteCarloResult, 
  MonthRow, 
  SummaryStats,
  AssetClass
} from '@shared';
import { loadHistoricalData, filterDataByEra } from './historicalData';
import { simulateRetirement } from './simulator';
import { calculatePercentile, calculateMean, calculateMedian, calculateStdDev } from './helpers/statistics';
import { roundToCents } from './helpers/rounding';

export async function runMonteCarlo(config: SimulationConfig): Promise<MonteCarloResult> {
  const mcConfig = config.monteCarlo!;
  const iterations = mcConfig.iterations;
  const rng = seedrandom(mcConfig.seed || Math.random().toString());
  
  const allHistoricalData = loadHistoricalData();
  const filteredData = filterDataByEra(allHistoricalData, mcConfig.era);

  if (filteredData.length === 0) {
    throw new Error(`No historical data found for era: ${mcConfig.era}`);
  }

  const durationMonths = config.calendar.durationMonths;
  const terminalValues = new Float64Array(iterations);
  let successes = 0;

  // Pre-allocate typed arrays for all metrics needed for the table/chart
  const allStartBalances = new Float64Array(iterations * durationMonths);
  const allEndBalances = new Float64Array(iterations * durationMonths);
  const allNominalWithdrawals = new Float64Array(iterations * durationMonths);
  const allRealWithdrawals = new Float64Array(iterations * durationMonths);
  const allNominalChanges = new Float64Array(iterations * durationMonths);
  const allIncomeTotals = new Float64Array(iterations * durationMonths);
  const allExpenseTotals = new Float64Array(iterations * durationMonths);

  for (let i = 0; i < iterations; i++) {
    const sampledReturns = [];
    const sampledCapes = [];
    
    for (let m = 0; m < durationMonths; m++) {
      const randomIndex = Math.floor(rng() * filteredData.length);
      const sampledMonth = filteredData[randomIndex];
      sampledReturns.push(sampledMonth.returns);
      sampledCapes.push(sampledMonth.cape || 0);
    }

    const pathResult = simulateRetirement(
      config,
      sampledReturns,
      '',
      'manual',
      sampledCapes
    );

    const rows = pathResult.rows;
    for (let m = 0; m < durationMonths; m++) {
      const row = rows[m];
      const idx = i * durationMonths + m;
      
      const totalStart = row.startBalances.stocks + row.startBalances.bonds + row.startBalances.cash;
      const totalEnd = row.endBalances.stocks + row.endBalances.bonds + row.endBalances.cash;
      
      allStartBalances[idx] = totalStart;
      allEndBalances[idx] = totalEnd;
      allNominalWithdrawals[idx] = row.withdrawals.nominalTotal;
      allRealWithdrawals[idx] = row.withdrawals.realTotal;
      allNominalChanges[idx] = row.movement.nominalChange;
      allIncomeTotals[idx] = row.cashflows.incomeTotal;
      allExpenseTotals[idx] = row.cashflows.expenseTotal;
    }

    const terminalValue = pathResult.summary.endOfHorizon.nominalEndBalance;
    terminalValues[i] = terminalValue;
    if (terminalValue > 0) {
      successes++;
    }
  }

  // Calculate Percentile Curves
  const ps = [5, 10, 25, 50, 75, 90, 95];
  const percentileResults: Record<string, MonthRow[]> = {};
  
  for (const p of ps) {
    percentileResults[`p${p}`] = [];
  }

  const firstPathMonthNames = loadHistoricalData().slice(0, durationMonths).map((_, i) => {
    return addMonthsToKey(config.calendar.startMonth, i);
  });

  // Reusable buffers for monthly percentile calculation
  const monthStartBalances = new Float64Array(iterations);
  const monthEndBalances = new Float64Array(iterations);
  const monthNominalWithdrawals = new Float64Array(iterations);
  const monthRealWithdrawals = new Float64Array(iterations);
  const monthNominalChanges = new Float64Array(iterations);
  const monthIncomeTotals = new Float64Array(iterations);
  const monthExpenseTotals = new Float64Array(iterations);

  for (let m = 0; m < durationMonths; m++) {
    for (let i = 0; i < iterations; i++) {
      const idx = i * durationMonths + m;
      monthStartBalances[i] = allStartBalances[idx];
      monthEndBalances[i] = allEndBalances[idx];
      monthNominalWithdrawals[i] = allNominalWithdrawals[idx];
      monthRealWithdrawals[i] = allRealWithdrawals[idx];
      monthNominalChanges[i] = allNominalChanges[idx];
      monthIncomeTotals[i] = allIncomeTotals[idx];
      monthExpenseTotals[i] = allExpenseTotals[idx];
    }

    for (const p of ps) {
      const pStart = calculatePercentile(Array.from(monthStartBalances), p);
      const pEnd = calculatePercentile(Array.from(monthEndBalances), p);
      const pNominalChange = calculatePercentile(Array.from(monthNominalChanges), p);
      
      // Calculate derived percent change for the synthetic path
      const pPercentChange = pStart > 0 ? pNominalChange / pStart : 0;

      percentileResults[`p${p}`].push({
        month: firstPathMonthNames[m],
        // Put totals in CASH for simplicity in asset columns (or handle splitting later)
        // Table mainly looks at totals or specific asset columns. 
        // For synthetic paths, asset breakdown is tricky. 
        // We'll zero stocks/bonds and put total in cash to ensure total matches.
        startBalances: { [AssetClass.STOCKS]: 0, [AssetClass.BONDS]: 0, [AssetClass.CASH]: pStart },
        endBalances: { [AssetClass.STOCKS]: 0, [AssetClass.BONDS]: 0, [AssetClass.CASH]: pEnd },
        movement: { 
          nominalChange: pNominalChange,
          percentChange: pPercentChange 
        },
        cashflows: { 
          incomeTotal: calculatePercentile(Array.from(monthIncomeTotals), p), 
          expenseTotal: calculatePercentile(Array.from(monthExpenseTotals), p) 
        },
        withdrawals: {
          byAsset: { [AssetClass.STOCKS]: 0, [AssetClass.BONDS]: 0, [AssetClass.CASH]: 0 },
          nominalTotal: calculatePercentile(Array.from(monthNominalWithdrawals), p),
          realTotal: calculatePercentile(Array.from(monthRealWithdrawals), p)
        }
      });
    }
  }

  const p50 = percentileResults.p50;
  const monthlyNominals = p50.map(r => r.withdrawals.nominalTotal);
  const annualInflation = config.economics.annualInflationRate;
  
  const summary: SummaryStats = {
    endOfHorizon: {
      nominalEndBalance: p50[p50.length - 1].endBalances.cash,
      realEndBalance: roundToCents(p50[p50.length - 1].endBalances.cash / Math.pow(1 + annualInflation, Math.floor(durationMonths / 12))),
    },
    withdrawals: {
      totalNominal: p50.reduce((sum, r) => sum + r.withdrawals.nominalTotal, 0),
      totalReal: p50.reduce((sum, r) => sum + r.withdrawals.realTotal, 0),
      meanMonthlyNominal: roundToCents(calculateMean(monthlyNominals)),
      medianMonthlyNominal: roundToCents(calculateMedian(monthlyNominals)),
      stdDevMonthlyNominal: roundToCents(calculateStdDev(monthlyNominals)),
      p25MonthlyNominal: roundToCents(calculatePercentile(monthlyNominals, 25)),
      p75MonthlyNominal: roundToCents(calculatePercentile(monthlyNominals, 75)),
    }
  };

  return {
    kind: 'monte-carlo',
    requestHash: '',
    generatedAt: new Date().toISOString(),
    iterations,
    probabilityOfSuccess: successes / iterations,
    summary,
    percentiles: percentileResults as any,
    terminalValues: Array.from(terminalValues),
  };
}

function addMonthsToKey(startKey: string, monthsToAdd: number): string {
  const [yearStr, monthStr] = startKey.split('-');
  let year = parseInt(yearStr);
  let month = parseInt(monthStr);

  month += monthsToAdd;
  while (month > 12) {
    month -= 12;
    year += 1;
  }
  
  return `${year}-${month.toString().padStart(2, '0')}`;
}
