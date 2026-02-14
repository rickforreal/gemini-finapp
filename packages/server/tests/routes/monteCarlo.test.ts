import { describe, it, expect, beforeEach } from 'vitest';
import { buildApp } from '../../src/app';
import { 
  SimulationMode, 
  HistoricalEra, 
  WithdrawalStrategyType, 
  AssetClass 
} from '@shared';

describe('Monte Carlo API Integration', () => {
  let app: any;

  beforeEach(() => {
    app = buildApp();
  });

  it('should return Monte Carlo results for valid request', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/simulate',
      payload: {
        config: {
          mode: SimulationMode.MONTE_CARLO,
          calendar: { startMonth: '2026-01', durationMonths: 120 },
          core: { startingAgeYears: 65, withdrawalsStartMonth: 1 },
          economics: { annualInflationRate: 0.03 },
          portfolio: {
            startingBalances: { [AssetClass.STOCKS]: 100000000, [AssetClass.BONDS]: 0, [AssetClass.CASH]: 0 },
            assumptions: { annualExpectedReturn: { [AssetClass.STOCKS]: 0.07, [AssetClass.BONDS]: 0.03, [AssetClass.CASH]: 0.02 } }
          },
          spending: { monthlyMinSpend: 0, monthlyMaxSpend: 1000000 },
          withdrawalStrategy: { 
            kind: WithdrawalStrategyType.CONSTANT_DOLLAR, 
            params: { initialWithdrawalRate: 0.04 } 
          },
          drawdownStrategy: { kind: 'bucket', params: { order: [AssetClass.CASH, AssetClass.BONDS, AssetClass.STOCKS] } },
          cashflows: { incomes: [] },
          monteCarlo: { iterations: 10, era: HistoricalEra.FULL_HISTORY }
        }
      }
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.kind).toBe('monte-carlo');
    expect(body.probabilityOfSuccess).toBeDefined();
    expect(body.percentiles).toBeDefined();
    expect(body.percentiles.p50).toHaveLength(120);
  });
});
