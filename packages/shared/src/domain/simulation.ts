import { AssetClass, WithdrawalStrategyType, SimulationMode } from '../constants/enums';
export { AssetClass, WithdrawalStrategyType, SimulationMode };

export type MonthKey = string; // "YYYY-MM"
export type Money = number;    // integer cents
export type Percent = number;  // decimals: 0.04 == 4%

export interface SimulationConfig {
  calendar: {
    startMonth: MonthKey;
    durationMonths: number;
  };
  core: {
    startingAgeYears: number;
    withdrawalsStartMonth: number; // Month index (1-based)
  };
  economics: {
    annualInflationRate: Percent;
  };
  portfolio: {
    startingBalances: Record<AssetClass, Money>;
    assumptions: ReturnAssumptions;
  };
  spending: SpendingPolicy;
  withdrawalStrategy: WithdrawalStrategyConfig;
  drawdownStrategy: DrawdownStrategyConfig;
  cashflows: {
    incomes: IncomeStream[];
    expenses?: ExpenseEvent[];
  };
}

export interface ReturnAssumptions {
  annualExpectedReturn: Record<AssetClass, Percent>;
  annualVolatility?: Partial<Record<AssetClass, Percent>>;
  annualFeeRate?: Percent;
}

export interface SpendingPolicy {
  monthlyMinSpend: Money;
  monthlyMaxSpend: Money;
  monthlyTargetSpend?: Money;
}

export type WithdrawalStrategyConfig =
  | { kind: WithdrawalStrategyType.CONSTANT_DOLLAR; params: { initialWithdrawalRate: Percent } }
  | { kind: WithdrawalStrategyType.PERCENT_OF_PORTFOLIO; params: { annualRate: Percent } }
  | { kind: WithdrawalStrategyType.ONE_OVER_N; params: { years: number } }
  | { kind: WithdrawalStrategyType.VPW; params: { expectedRealReturn: Percent; drawdownTarget: Percent } }
  | { kind: WithdrawalStrategyType.DYNAMIC_SWR; params: { expectedRateOfReturn: Percent } }
  | { kind: WithdrawalStrategyType.SENSIBLE_WITHDRAWALS; params: { baseWithdrawalRate: Percent; extrasWithdrawalRate: Percent } }
  | { kind: WithdrawalStrategyType.NINETY_FIVE_PERCENT; params: { annualWithdrawalRate: Percent; minimumFloor: Percent } }
  | { kind: WithdrawalStrategyType.GUYTON_KLINGER; params: { initialWithdrawalRate: Percent; capitalPreservationTrigger: Percent; capitalPreservationCut: Percent; prosperityTrigger: Percent; prosperityRaise: Percent; guardrailsSunset: number } }
  | { kind: WithdrawalStrategyType.VANGUARD_DYNAMIC; params: { annualWithdrawalRate: Percent; ceiling: Percent; floor: Percent } }
  | { kind: WithdrawalStrategyType.ENDOWMENT; params: { spendingRate: Percent; smoothingWeight: Percent } }
  | { kind: WithdrawalStrategyType.HEBELER_AUTOPILOT; params: { initialWithdrawalRate: Percent; pmtExpectedReturn: Percent; priorYearWeight: Percent } }
  | { kind: WithdrawalStrategyType.CAPE_BASED; params: { baseWithdrawalRate: Percent; capeWeight: number; startingCAPE: number } };

export type DrawdownStrategyConfig =
  | { kind: 'bucket'; params: { order: AssetClass[] } }
  | { kind: 'rebalancing'; params: RebalancingParams };

export interface RebalancingParams {
  targetAllocation: Record<AssetClass, Percent>;
  glidePathEnabled: boolean;
  glidePath?: GlidePathWaypoint[];
}

export interface GlidePathWaypoint {
  year: number;
  allocation: Record<AssetClass, Percent>;
}

export interface IncomeStream {
  id: string;
  name: string;
  amount: Money;
  startMonth: MonthKey;
  endMonth?: MonthKey;
  cadence: Cadence;
  escalation: Escalation;
  depositTo: AssetClass;
}

export interface ExpenseEvent {
  id: string;
  name: string;
  amount: Money;
  startMonth: MonthKey;
  durationMonths: number;
  escalation: Escalation;
}

export type Cadence =
  | { kind: 'oneTime' }
  | { kind: 'monthly' }
  | { kind: 'annual'; monthOfYear: number }
  | { kind: 'custom'; everyNMonths: number };

export type Escalation =
  | { kind: 'none' }
  | { kind: 'cpiLinked' }
  | { kind: 'fixedRate'; annualRate: Percent };

export interface MonthRow {
  month: MonthKey;
  startBalances: Record<AssetClass, Money>;
  movement: {
    nominalChange: Money;
    percentChange: Percent;
  };
  cashflows: {
    incomeTotal: Money;
    expenseTotal: Money;
    incomeById?: Record<string, Money>;
    expenseById?: Record<string, Money>;
  };
  withdrawals: {
    byAsset: Record<AssetClass, Money>;
    nominalTotal: Money;
    realTotal: Money;
  };
  endBalances: Record<AssetClass, Money>;
}

export interface SummaryStats {
  endOfHorizon: {
    nominalEndBalance: Money;
    realEndBalance: Money;
  };
  withdrawals: {
    totalNominal: Money;
    totalReal: Money;
    meanMonthlyNominal: Money;
    medianMonthlyNominal: Money;
    stdDevMonthlyNominal: Money;
    p25MonthlyNominal: Money;
    p75MonthlyNominal: Money;
  };
}

export interface SinglePathResult {
  kind: 'manual' | 'deterministic';
  requestHash: string;
  generatedAt: string;
  rows: MonthRow[];
  summary: SummaryStats;
}
