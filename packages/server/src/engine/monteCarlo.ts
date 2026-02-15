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

  // Pre-allocate buffers for every numeric field in MonthRow to build a complete synthetic path
  const buf = (size: number) => new Float64Array(size);
  
  const allS_Start = buf(iterations * durationMonths);
  const allB_Start = buf(iterations * durationMonths);
  const allC_Start = buf(iterations * durationMonths);
  
  const allS_End = buf(iterations * durationMonths);
  const allB_End = buf(iterations * durationMonths);
  const allC_End = buf(iterations * durationMonths);
  
  const allS_Wdrl = buf(iterations * durationMonths);
  const allB_Wdrl = buf(iterations * durationMonths);
  const allC_Wdrl = buf(iterations * durationMonths);
  
  const allNominalWdrl = buf(iterations * durationMonths);
  const allRealWdrl = buf(iterations * durationMonths);
  const allNominalChange = buf(iterations * durationMonths);
  const allIncomeTotal = buf(iterations * durationMonths);
  const allExpenseTotal = buf(iterations * durationMonths);

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
      const r = rows[m];
      const idx = i * durationMonths + m;
      
      allS_Start[idx] = r.startBalances.stocks;
      allB_Start[idx] = r.startBalances.bonds;
      allC_Start[idx] = r.startBalances.cash;
      
      allS_End[idx] = r.endBalances.stocks;
      allB_End[idx] = r.endBalances.bonds;
      allC_End[idx] = r.endBalances.cash;
      
      allS_Wdrl[idx] = r.withdrawals.byAsset.stocks;
      allB_Wdrl[idx] = r.withdrawals.byAsset.bonds;
      allC_Wdrl[idx] = r.withdrawals.byAsset.cash;

      allNominalWdrl[idx] = r.withdrawals.nominalTotal;
      allRealWdrl[idx] = r.withdrawals.realTotal;
      allNominalChange[idx] = r.movement.nominalChange;
      allIncomeTotal[idx] = r.cashflows.incomeTotal;
      allExpenseTotal[idx] = r.cashflows.expenseTotal;
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
  for (const p of ps) percentileResults[`p${p}`] = [];

  const startMonthKey = config.calendar.startMonth;
  const monthKeys = Array.from({ length: durationMonths }, (_, i) => addMonthsToKey(startMonthKey, i));

  // Reusable buffers for monthly percentile calculation
  const mS_Start = buf(iterations);
  const mB_Start = buf(iterations);
  const mC_Start = buf(iterations);
  const mS_End = buf(iterations);
  const mB_End = buf(iterations);
  const mC_End = buf(iterations);
  const mS_Wdrl = buf(iterations);
  const mB_Wdrl = buf(iterations);
  const mC_Wdrl = buf(iterations);
  const mNomWdrl = buf(iterations);
  const mRealWdrl = buf(iterations);
  const mNomChg = buf(iterations);
  const mInc = buf(iterations);
  const mExp = buf(iterations);

  for (let m = 0; m < durationMonths; m++) {
    for (let i = 0; i < iterations; i++) {
      const idx = i * durationMonths + m;
      mS_Start[i] = allS_Start[idx];
      mB_Start[i] = allB_Start[idx];
      mC_Start[i] = allC_Start[idx];
      mS_End[i] = allS_End[idx];
      mB_End[i] = allB_End[idx];
      mC_End[i] = allC_End[idx];
      mS_Wdrl[i] = allS_Wdrl[idx];
      mB_Wdrl[i] = allB_Wdrl[idx];
      mC_Wdrl[i] = allC_Wdrl[idx];
      mNomWdrl[i] = allNominalWdrl[idx];
      mRealWdrl[i] = allRealWdrl[idx];
      mNomChg[i] = allNominalChange[idx];
      mInc[i] = allIncomeTotal[idx];
      mExp[i] = allExpenseTotal[idx];
    }

    for (const p of ps) {
      const pS_Start = calculatePercentile(Array.from(mS_Start), p);
      const pB_Start = calculatePercentile(Array.from(mB_Start), p);
      const pC_Start = calculatePercentile(Array.from(mC_Start), p);
      const pTotalStart = pS_Start + pB_Start + pC_Start;

      const pS_End = calculatePercentile(Array.from(mS_End), p);
      const pB_End = calculatePercentile(Array.from(mB_End), p);
      const pC_End = calculatePercentile(Array.from(mC_End), p);

      const pNomChg = calculatePercentile(Array.from(mNomChg), p);

      percentileResults[`p${p}`].push({
        month: monthKeys[m],
        startBalances: { [AssetClass.STOCKS]: pS_Start, [AssetClass.BONDS]: pB_Start, [AssetClass.CASH]: pC_Start },
        endBalances: { [AssetClass.STOCKS]: pS_End, [AssetClass.BONDS]: pB_End, [AssetClass.CASH]: pC_End },
        movement: { 
          nominalChange: pNomChg,
          percentChange: pTotalStart > 0 ? pNomChg / pTotalStart : 0 
        },
        cashflows: { 
          incomeTotal: calculatePercentile(Array.from(mInc), p), 
          expenseTotal: calculatePercentile(Array.from(mExp), p) 
        },
        withdrawals: {
          byAsset: { 
            [AssetClass.STOCKS]: calculatePercentile(Array.from(mS_Wdrl), p), 
            [AssetClass.BONDS]: calculatePercentile(Array.from(mB_Wdrl), p), 
            [AssetClass.CASH]: calculatePercentile(Array.from(mC_Wdrl), p) 
          },
          nominalTotal: calculatePercentile(Array.from(mNomWdrl), p),
          realTotal: calculatePercentile(Array.from(mRealWdrl), p)
        }
      });
    }
  }

  const p50 = percentileResults.p50;
  const monthlyNominals = p50.map(r => r.withdrawals.nominalTotal);
  const annualInflation = config.economics.annualInflationRate;
  
  const finalRow = p50[p50.length - 1];
  const finalTotal = finalRow.endBalances.stocks + finalRow.endBalances.bonds + finalRow.endBalances.cash;

  const summary: SummaryStats = {
    endOfHorizon: {
      nominalEndBalance: finalTotal,
      realEndBalance: roundToCents(finalTotal / Math.pow(1 + annualInflation, durationMonths / 12)),
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
