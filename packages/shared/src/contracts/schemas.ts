import { z } from 'zod';
import { AssetClass, WithdrawalStrategyType } from '../constants/enums';

export const MonthKeySchema = z.string().regex(/^\d{4}-\d{2}$/);

export const MoneySchema = z.number().int();

export const PercentSchema = z.number();

export const ReturnAssumptionsSchema = z.object({
  annualExpectedReturn: z.record(z.nativeEnum(AssetClass), PercentSchema),
  annualVolatility: z.record(z.nativeEnum(AssetClass), PercentSchema).optional(),
  annualFeeRate: PercentSchema.optional(),
});

export const SpendingPolicySchema = z.object({
  monthlyMinSpend: MoneySchema,
  monthlyMaxSpend: MoneySchema,
  monthlyTargetSpend: MoneySchema.optional(),
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

export const CadenceSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('oneTime') }),
  z.object({ kind: z.literal('monthly') }),
  z.object({ kind: z.literal('annual'), monthOfYear: z.number().min(1).max(12) }),
  z.object({ kind: z.literal('custom'), everyNMonths: z.number().min(1) }),
]);

export const EscalationSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('none') }),
  z.object({ kind: z.literal('cpiLinked') }),
  z.object({ kind: z.literal('fixedRate'), annualRate: PercentSchema }),
]);

export const IncomeStreamSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  amount: MoneySchema,
  startMonth: MonthKeySchema,
  endMonth: MonthKeySchema.optional(),
  cadence: CadenceSchema,
  escalation: EscalationSchema,
  depositTo: z.nativeEnum(AssetClass),
});

export const ExpenseEventSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  amount: MoneySchema,
  startMonth: MonthKeySchema,
  durationMonths: z.number().min(1),
  escalation: EscalationSchema,
});

export const SimulationConfigSchema = z.object({
  calendar: z.object({
    startMonth: MonthKeySchema,
    durationMonths: z.number().min(1).max(1200),
  }),
  core: z.object({
    startingAgeYears: z.number().min(0).max(120),
    withdrawalsStartMonth: z.number().min(1).max(1200),
  }),
  economics: z.object({
    annualInflationRate: PercentSchema,
  }),
  portfolio: z.object({
    startingBalances: z.record(z.nativeEnum(AssetClass), MoneySchema),
    assumptions: ReturnAssumptionsSchema,
  }),
  spending: SpendingPolicySchema,
  withdrawalStrategy: WithdrawalStrategyConfigSchema,
  drawdownStrategy: DrawdownStrategyConfigSchema,
  cashflows: z.object({
    incomes: z.array(IncomeStreamSchema),
    expenses: z.array(ExpenseEventSchema).optional(),
  }),
});

export const SimulateRequestSchema = z.object({
  config: SimulationConfigSchema,
  // tracking is optional for Phase 2
  tracking: z.object({
    actualsByMonth: z.record(MonthKeySchema, z.any()),
  }).optional(),
  mode: z.enum(['planning', 'tracking']),
  options: z.object({
    seed: z.number().optional(),
    includeRows: z.boolean().optional(),
    includeReal: z.boolean().optional(),
  }).optional(),
});
