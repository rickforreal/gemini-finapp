import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { WithdrawalStrategyType } from '@shared/index';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import { Dropdown } from '../shared/Dropdown';
import { StrategyParams } from './WithdrawalStrategy/StrategyParams';
import { StrategyTooltip } from './WithdrawalStrategy/StrategyTooltip';

export const WithdrawalStrategy: React.FC = () => {
  const { withdrawalStrategy, setWithdrawalStrategyType } = useAppStore();
  const { type } = withdrawalStrategy;

  const strategyOptions = [
    { label: 'Constant Dollar', value: WithdrawalStrategyType.CONSTANT_DOLLAR },
    { label: 'Percent of Portfolio', value: WithdrawalStrategyType.PERCENT_OF_PORTFOLIO },
    { label: '1/N', value: WithdrawalStrategyType.ONE_OVER_N },
    { label: 'VPW', value: WithdrawalStrategyType.VPW },
    { label: 'Dynamic SWR', value: WithdrawalStrategyType.DYNAMIC_SWR },
    { label: 'Sensible Withdrawals', value: WithdrawalStrategyType.SENSIBLE_WITHDRAWALS },
    { label: '95% Rule', value: WithdrawalStrategyType.NINETY_FIVE_PERCENT },
    { label: 'Guyton-Klinger', value: WithdrawalStrategyType.GUYTON_KLINGER },
    { label: 'Vanguard Dynamic', value: WithdrawalStrategyType.VANGUARD_DYNAMIC },
    { label: 'Endowment', value: WithdrawalStrategyType.ENDOWMENT },
    { label: 'Hebeler Autopilot', value: WithdrawalStrategyType.HEBELER_AUTOPILOT },
    { label: 'CAPE-Based', value: WithdrawalStrategyType.CAPE_BASED },
  ];

  return (
    <CollapsibleSection title="Withdrawal Strategy">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <label className="text-xs font-medium text-slate-600 uppercase tracking-wider">
              Strategy
            </label>
            <StrategyTooltip type={type} />
          </div>
          <Dropdown
            options={strategyOptions}
            value={type}
            onChange={(val) => setWithdrawalStrategyType(val as WithdrawalStrategyType)}
          />
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-md p-4">
          <StrategyParams />
        </div>
      </div>
    </CollapsibleSection>
  );
};
