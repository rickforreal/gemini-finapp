import { z } from 'zod';
import { AssetClass, WithdrawalStrategyType, SimulationMode, HistoricalEra } from '../constants/enums';

export const MoneySchema = z.number().int();
export const PercentSchema = z.number();
export const MonthKeySchema = z.string().regex(/^\d{4}-\d{2}$/);

export const HistoricalEraSchema = z.nativeEnum(HistoricalEra);

export const MonteCarloConfigSchema = z.object({
  iterations: z.number().int().min(1).max(5000),
  era: HistoricalEraSchema,
  seed: z.string().optional(),
});

export const ReturnAssumptionsSchema = z.object({
  annualExpectedReturn: z.record(z.nativeEnum(AssetClass), PercentSchema),
  annualVolatility: z.record(z.nativeEnum(AssetClass), PercentSchema).optional(),
  annualFeeRate: PercentSchema.optional(),
});

export const EscalationSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('none') }),
  z.object({ kind: z.literal('cpiLinked') }),
  z.object({ kind: z.literal('fixedRate'), annualRate: PercentSchema }),
]);

export const IncomeStreamSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: MoneySchema,
  startMonth: MonthKeySchema,
  endMonth: MonthKeySchema.optional(),
  cadence: z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('oneTime') }),
    z.object({ kind: z.literal('monthly') }),
    z.object({ kind: z.literal('annual'), monthOfYear: z.number().int().min(1).max(12) }),
    z.object({ kind: z.literal('custom'), everyNMonths: z.number().int().min(1) }),
  ]),
  escalation: EscalationSchema,
  depositTo: z.nativeEnum(AssetClass),
});

export const ExpenseEventSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: MoneySchema,
  startMonth: MonthKeySchema,
  durationMonths: z.number().int().min(1),
  escalation: EscalationSchema,
});

export const WithdrawalStrategyConfigSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal(WithdrawalStrategyType.CONSTANT_DOLLAR), params: z.object({ initialWithdrawalRate: PercentSchema }) }),
  z.object({ kind: z.literal(WithdrawalStrategyType.PERCENT_OF_PORTFOLIO), params: z.object({ annualRate: PercentSchema }) }),
  z.object({ kind: z.literal(WithdrawalStrategyType.ONE_OVER_N), params: z.object({ years: z.number() }) }),
  z.object({ kind: z.literal(WithdrawalStrategyType.VPW), params: z.object({ expectedRealReturn: PercentSchema, drawdownTarget: PercentSchema }) }),
  z.object({ kind: z.literal(WithdrawalStrategyType.DYNAMIC_SWR), params: z.object({ expectedRateOfReturn: PercentSchema }) }),
  z.object({ kind: z.literal(WithdrawalStrategyType.SENSIBLE_WITHDRAWALS), params: z.object({ baseWithdrawalRate: PercentSchema, extrasWithdrawalRate: PercentSchema }) }),
  z.object({ kind: z.literal(WithdrawalStrategyType.NINETY_FIVE_PERCENT), params: z.object({ annualWithdrawalRate: PercentSchema, minimumFloor: PercentSchema }) }),
  z.object({ kind: z.literal(WithdrawalStrategyType.GUYTON_KLINGER), params: z.object({ initialWithdrawalRate: PercentSchema, capitalPreservationTrigger: PercentSchema, capitalPreservationCut: PercentSchema, prosperityTrigger: PercentSchema, prosperityRaise: PercentSchema, guardrailsSunset: z.number() }) }),
  z.object({ kind: z.literal(WithdrawalStrategyType.VANGUARD_DYNAMIC), params: z.object({ annualWithdrawalRate: PercentSchema, ceiling: PercentSchema, floor: PercentSchema }) }),
  z.object({ kind: z.literal(WithdrawalStrategyType.ENDOWMENT), params: z.object({ spendingRate: PercentSchema, smoothingWeight: PercentSchema }) }),
  z.object({ kind: z.literal(WithdrawalStrategyType.HEBELER_AUTOPILOT), params: z.object({ initialWithdrawalRate: PercentSchema, pmtExpectedReturn: PercentSchema, priorYearWeight: PercentSchema }) }),
  z.object({ kind: z.literal(WithdrawalStrategyType.CAPE_BASED), params: z.object({ baseWithdrawalRate: PercentSchema, capeWeight: z.number(), startingCAPE: z.number() }) }),
]);

export const DrawdownStrategyConfigSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('bucket'), params: z.object({ order: z.array(z.nativeEnum(AssetClass)) }) }),
  z.object({ kind: z.literal('rebalancing'), params: z.object({
    targetAllocation: z.record(z.nativeEnum(AssetClass), PercentSchema),
    glidePathEnabled: z.boolean(),
    glidePath: z.array(z.object({
      year: z.number(),
      allocation: z.record(z.nativeEnum(AssetClass), PercentSchema),
    })).optional(),
  }) }),
]);

export const SimulationConfigSchema = z.object({
  mode: z.nativeEnum(SimulationMode),
  calendar: z.object({
    startMonth: MonthKeySchema,
    durationMonths: z.number().int().min(1).max(1200),
  }),
  core: z.object({
    startingAgeYears: z.number().int(),
    withdrawalsStartMonth: z.number().int(),
  }),
  economics: z.object({
    annualInflationRate: PercentSchema,
  }),
  portfolio: z.object({
    startingBalances: z.record(z.nativeEnum(AssetClass), MoneySchema),
    assumptions: ReturnAssumptionsSchema,
  }),
  spending: z.object({
    monthlyMinSpend: MoneySchema,
    monthlyMaxSpend: MoneySchema,
    monthlyTargetSpend: MoneySchema.optional(),
  }),
  withdrawalStrategy: WithdrawalStrategyConfigSchema,
  drawdownStrategy: DrawdownStrategyConfigSchema,
  cashflows: z.object({
    incomes: z.array(IncomeStreamSchema),
    expenses: z.array(ExpenseEventSchema).optional(),
  }),
  monteCarlo: MonteCarloConfigSchema.optional(),
});

export const SimulateRequestSchema = z.object({
  config: SimulationConfigSchema,
});
