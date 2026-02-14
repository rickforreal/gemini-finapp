import { WithdrawalStrategyType } from '@shared';
import { StrategyFunction } from './types';
import { constantDollar } from './constantDollar';
import { percentOfPortfolio } from './percentOfPortfolio';
import { oneOverN } from './oneOverN';
import { vpw } from './vpw';
import { dynamicSwr } from './dynamicSwr';
import { sensibleWithdrawals } from './sensibleWithdrawals';
import { ninetyFivePercent } from './ninetyFivePercent';
import { guytonKlinger } from './guytonKlinger';
import { vanguardDynamic } from './vanguardDynamic';
import { endowment } from './endowment';
import { hebelerAutopilot } from './hebelerAutopilot';
import { capeBased } from './capeBased';

export const strategyRegistry: Record<WithdrawalStrategyType, StrategyFunction> = {
  [WithdrawalStrategyType.CONSTANT_DOLLAR]: constantDollar,
  [WithdrawalStrategyType.PERCENT_OF_PORTFOLIO]: percentOfPortfolio,
  [WithdrawalStrategyType.ONE_OVER_N]: oneOverN,
  [WithdrawalStrategyType.VPW]: vpw,
  [WithdrawalStrategyType.DYNAMIC_SWR]: dynamicSwr,
  [WithdrawalStrategyType.SENSIBLE_WITHDRAWALS]: sensibleWithdrawals,
  [WithdrawalStrategyType.NINETY_FIVE_PERCENT]: ninetyFivePercent,
  [WithdrawalStrategyType.GUYTON_KLINGER]: guytonKlinger,
  [WithdrawalStrategyType.VANGUARD_DYNAMIC]: vanguardDynamic,
  [WithdrawalStrategyType.ENDOWMENT]: endowment,
  [WithdrawalStrategyType.HEBELER_AUTOPILOT]: hebelerAutopilot,
  [WithdrawalStrategyType.CAPE_BASED]: capeBased,
};
