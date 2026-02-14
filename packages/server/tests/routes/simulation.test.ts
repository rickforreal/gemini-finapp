import { describe, it, expect, beforeAll } from 'vitest';
import { buildApp } from '../../src/app';
import { AssetClass, WithdrawalStrategyType } from '@shared';

describe('POST /api/v1/simulate', () => {
  let app: any;

  beforeAll(() => {
    app = buildApp();
  });

  it('should return 200 and a valid result for a valid request', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/simulate',
      payload: {
        mode: 'planning',
        config: {
          mode: 'manual',
          calendar: {
            startMonth: '2026-01',
            durationMonths: 12,
          },
          core: {
            startingAgeYears: 60,
            withdrawalsStartMonth: 1,
          },
          economics: {
            annualInflationRate: 0.03,
          },
          portfolio: {
            startingBalances: {
              [AssetClass.STOCKS]: 100000000,
              [AssetClass.BONDS]: 0,
              [AssetClass.CASH]: 0,
            },
            assumptions: {
              annualExpectedReturn: {
                [AssetClass.STOCKS]: 0.07,
                [AssetClass.BONDS]: 0.03,
                [AssetClass.CASH]: 0.01,
              }
            }
          },
          spending: {
            monthlyMinSpend: 400000,
            monthlyMaxSpend: 800000,
          },
          withdrawalStrategy: {
            kind: WithdrawalStrategyType.CONSTANT_DOLLAR,
            params: { initialWithdrawalRate: 0.04 }
          },
          drawdownStrategy: {
            kind: 'bucket',
            params: { order: [AssetClass.CASH, AssetClass.BONDS, AssetClass.STOCKS] }
          },
          cashflows: {
            incomes: []
          }
        }
      }
    });

    expect(response.statusCode).toBe(200);
    const result = JSON.parse(response.body);
    expect(result.kind).toBe('manual');
    expect(result.rows.length).toBe(12);
    expect(result.summary).toBeDefined();
  });

  it('should return 400 for an invalid request', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/simulate',
      payload: {
        mode: 'planning',
        config: {
          // Missing required fields
        }
      }
    });

    expect(response.statusCode).toBe(400);
    const error = JSON.parse(response.body);
    expect(error.error.code).toBe('VALIDATION_ERROR');
  });
});
