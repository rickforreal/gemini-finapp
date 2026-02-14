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

  // We only need to store the specific fields we care about for percentile calculation
  // to save memory and reduce GC pressure.
  const allEndBalances = new Float64Array(iterations * durationMonths);
  const allNominalWithdrawals = new Float64Array(iterations * durationMonths);
  const allRealWithdrawals = new Float64Array(iterations * durationMonths);

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
      const totalEnd = row.endBalances.stocks + row.endBalances.bonds + row.endBalances.cash;
      allEndBalances[i * durationMonths + m] = totalEnd;
      allNominalWithdrawals[i * durationMonths + m] = row.withdrawals.nominalTotal;
      allRealWithdrawals[i * durationMonths + m] = row.withdrawals.realTotal;
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
    // This is just to get the month keys correctly
    return addMonthsToKey(config.calendar.startMonth, i);
  });

  for (let m = 0; m < durationMonths; m++) {
    const monthEndBalances = new Float64Array(iterations);
    const monthNominalWithdrawals = new Float64Array(iterations);
    const monthRealWithdrawals = new Float64Array(iterations);

    for (let i = 0; i < iterations; i++) {
      monthEndBalances[i] = allEndBalances[i * durationMonths + m];
      monthNominalWithdrawals[i] = allNominalWithdrawals[i * durationMonths + m];
      monthRealWithdrawals[i] = allRealWithdrawals[i * durationMonths + m];
    }

    for (const p of ps) {
      percentileResults[`p${p}`].push({
        month: firstPathMonthNames[m],
        startBalances: { [AssetClass.STOCKS]: 0, [AssetClass.BONDS]: 0, [AssetClass.CASH]: 0 },
        endBalances: { [AssetClass.STOCKS]: 0, [AssetClass.BONDS]: 0, [AssetClass.CASH]: calculatePercentile(Array.from(monthEndBalances), p) },
        movement: { nominalChange: 0, percentChange: 0 },
        cashflows: { incomeTotal: 0, expenseTotal: 0 },
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
