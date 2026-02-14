export enum AssetClass {
  STOCKS = 'stocks',
  BONDS = 'bonds',
  CASH = 'cash'
}

export enum WithdrawalStrategyType {
  CONSTANT_DOLLAR = 'constant-dollar',
  PERCENT_OF_PORTFOLIO = 'percent-of-portfolio',
  ONE_OVER_N = 'one-over-n',
  VPW = 'vpw',
  DYNAMIC_SWR = 'dynamic-swr',
  SENSIBLE_WITHDRAWALS = 'sensible-withdrawals',
  NINETY_FIVE_PERCENT = 'ninety-five-percent',
  GUYTON_KLINGER = 'guyton-klinger',
  VANGUARD_DYNAMIC = 'vanguard-dynamic',
  ENDOWMENT = 'endowment',
  HEBELER_AUTOPILOT = 'hebeler-autopilot',
  CAPE_BASED = 'cape-based'
}

export enum SimulationMode {
  MANUAL = 'manual',
  MONTE_CARLO = 'monte-carlo'
}

export enum AppMode {
  PLANNING = 'planning',
  TRACKING = 'tracking'
}

export enum HistoricalEra {
  FULL_HISTORY = 'full-history',
  POST_WAR = 'post-war',
  MODERN_ERA = 'modern-era',
  STAGFLATION = 'stagflation',
  LOW_YIELD = 'low-yield',
  GFC_RECOVERY = 'gfc-recovery',
  DOT_COM_CRASH = 'dot-com-crash',
  LOST_DECADE = 'lost-decade'
}
