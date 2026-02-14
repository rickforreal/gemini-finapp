import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { WithdrawalStrategyType } from '@shared/index';
import { NumericInput } from '../../shared/NumericInput';

export const StrategyParams: React.FC = () => {
  const { withdrawalStrategy, updateWithdrawalStrategyParams, portfolio } = useAppStore();
  const { type, params } = withdrawalStrategy;
  
  const totalPortfolio = (portfolio.stocks + portfolio.bonds + portfolio.cash) / 100;

  const formatYearly = (amount: number) => `$${Math.round(amount).toLocaleString()} / year`;
  const formatMonthly = (amount: number) => `$${Math.round(amount / 12).toLocaleString()} / month`;

  switch (type) {
    case WithdrawalStrategyType.CONSTANT_DOLLAR: {
      const cdRate = params.initialWithdrawalRate || 0.04;
      return (
        <div className="flex flex-col gap-3">
          <NumericInput
            label="Initial Withdrawal Rate"
            value={cdRate}
            onChange={(val) => updateWithdrawalStrategyParams({ initialWithdrawalRate: val })}
            format="percent"
            suffix="%"
            min={0.01}
            max={0.1}
          />
          <p className="text-[11px] text-slate-500 font-medium italic">
            = {formatYearly(totalPortfolio * cdRate)} ({formatMonthly(totalPortfolio * cdRate)})
          </p>
        </div>
      );
    }

    case WithdrawalStrategyType.PERCENT_OF_PORTFOLIO: {
      const ppRate = params.annualRate || 0.04;
      return (
        <div className="flex flex-col gap-3">
          <NumericInput
            label="Annual Withdrawal Rate"
            value={ppRate}
            onChange={(val) => updateWithdrawalStrategyParams({ annualRate: val })}
            format="percent"
            suffix="%"
            min={0.01}
            max={0.15}
          />
          <p className="text-[11px] text-slate-500 font-medium italic">
            At current portfolio: {formatYearly(totalPortfolio * ppRate)}
          </p>
        </div>
      );
    }

    case WithdrawalStrategyType.ONE_OVER_N:
      return (
        <div className="flex flex-col gap-3">
          <NumericInput
            label="Total Retirement Years (N)"
            value={params.years || 40}
            onChange={(val) => updateWithdrawalStrategyParams({ years: val })}
            suffix="years"
            min={1}
            max={100}
          />
          <p className="text-xs text-slate-500 leading-relaxed italic">
            Each year's withdrawal is calculated as the current portfolio value divided by the number of remaining years.
          </p>
        </div>
      );

    case WithdrawalStrategyType.VPW:
      return (
        <div className="flex flex-col gap-4">
          <NumericInput
            label="Expected Real Return"
            value={params.expectedRealReturn || 0.03}
            onChange={(val) => updateWithdrawalStrategyParams({ expectedRealReturn: val })}
            format="percent"
            suffix="%"
            min={0}
            max={0.1}
          />
          <NumericInput
            label="Drawdown Target"
            value={params.drawdownTarget || 1.0}
            onChange={(val) => updateWithdrawalStrategyParams({ drawdownTarget: val })}
            format="percent"
            suffix="%"
            min={0.5}
            max={1.0}
          />
        </div>
      );

    case WithdrawalStrategyType.DYNAMIC_SWR:
      return (
        <NumericInput
          label="Expected Rate of Return (Nominal)"
          value={params.expectedRateOfReturn || 0.06}
          onChange={(val) => updateWithdrawalStrategyParams({ expectedRateOfReturn: val })}
          format="percent"
          suffix="%"
          min={0.01}
          max={0.15}
        />
      );

    case WithdrawalStrategyType.SENSIBLE_WITHDRAWALS:
      return (
        <div className="flex flex-col gap-4">
          <NumericInput
            label="Base Withdrawal Rate"
            value={params.baseWithdrawalRate || 0.03}
            onChange={(val) => updateWithdrawalStrategyParams({ baseWithdrawalRate: val })}
            format="percent"
            suffix="%"
            min={0.01}
            max={0.08}
          />
          <NumericInput
            label="Extras Withdrawal Rate"
            value={params.extrasWithdrawalRate || 0.10}
            onChange={(val) => updateWithdrawalStrategyParams({ extrasWithdrawalRate: val })}
            format="percent"
            suffix="%"
            min={0}
            max={0.5}
          />
        </div>
      );

    case WithdrawalStrategyType.NINETY_FIVE_PERCENT:
      return (
        <div className="flex flex-col gap-4">
          <NumericInput
            label="Annual Withdrawal Rate"
            value={params.annualWithdrawalRate || 0.04}
            onChange={(val) => updateWithdrawalStrategyParams({ annualWithdrawalRate: val })}
            format="percent"
            suffix="%"
            min={0.01}
            max={0.1}
          />
          <NumericInput
            label="Minimum Floor (% of Prior Year)"
            value={params.minimumFloor || 0.95}
            onChange={(val) => updateWithdrawalStrategyParams({ minimumFloor: val })}
            format="percent"
            suffix="%"
            min={0.8}
            max={1.0}
          />
        </div>
      );

    case WithdrawalStrategyType.GUYTON_KLINGER:
      return (
        <div className="grid grid-cols-1 gap-4">
          <NumericInput
            label="Initial Withdrawal Rate"
            value={params.initialWithdrawalRate || 0.052}
            onChange={(val) => updateWithdrawalStrategyParams({ initialWithdrawalRate: val })}
            format="percent"
            suffix="%"
            min={0.02}
            max={0.08}
          />
          <div className="grid grid-cols-2 gap-3">
            <NumericInput
              label="Preservation Trigger"
              value={params.capitalPreservationTrigger || 0.20}
              onChange={(val) => updateWithdrawalStrategyParams({ capitalPreservationTrigger: val })}
              format="percent"
              suffix="%"
            />
            <NumericInput
              label="Preservation Cut"
              value={params.capitalPreservationCut || 0.10}
              onChange={(val) => updateWithdrawalStrategyParams({ capitalPreservationCut: val })}
              format="percent"
              suffix="%"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumericInput
              label="Prosperity Trigger"
              value={params.prosperityTrigger || 0.20}
              onChange={(val) => updateWithdrawalStrategyParams({ prosperityTrigger: val })}
              format="percent"
              suffix="%"
            />
            <NumericInput
              label="Prosperity Raise"
              value={params.prosperityRaise || 0.10}
              onChange={(val) => updateWithdrawalStrategyParams({ prosperityRaise: val })}
              format="percent"
              suffix="%"
            />
          </div>
          <NumericInput
            label="Guardrails Sunset (Years)"
            value={params.guardrailsSunset || 15}
            onChange={(val) => updateWithdrawalStrategyParams({ guardrailsSunset: val })}
            suffix="years"
            min={0}
            max={30}
          />
        </div>
      );

    case WithdrawalStrategyType.VANGUARD_DYNAMIC:
      return (
        <div className="flex flex-col gap-4">
          <NumericInput
            label="Annual Withdrawal Rate"
            value={params.annualWithdrawalRate || 0.05}
            onChange={(val) => updateWithdrawalStrategyParams({ annualWithdrawalRate: val })}
            format="percent"
            suffix="%"
            min={0.01}
            max={0.1}
          />
          <div className="grid grid-cols-2 gap-3">
            <NumericInput
              label="Ceiling (Max Increase)"
              value={params.ceiling || 0.05}
              onChange={(val) => updateWithdrawalStrategyParams({ ceiling: val })}
              format="percent"
              suffix="%"
            />
            <NumericInput
              label="Floor (Max Decrease)"
              value={params.floor || 0.025}
              onChange={(val) => updateWithdrawalStrategyParams({ floor: val })}
              format="percent"
              suffix="%"
            />
          </div>
        </div>
      );

    case WithdrawalStrategyType.ENDOWMENT:
      return (
        <div className="flex flex-col gap-4">
          <NumericInput
            label="Spending Rate"
            value={params.spendingRate || 0.05}
            onChange={(val) => updateWithdrawalStrategyParams({ spendingRate: val })}
            format="percent"
            suffix="%"
            min={0.01}
            max={0.1}
          />
          <NumericInput
            label="Smoothing Weight"
            value={params.smoothingWeight || 0.70}
            onChange={(val) => updateWithdrawalStrategyParams({ smoothingWeight: val })}
            format="percent"
            suffix="%"
            min={0}
            max={1.0}
          />
        </div>
      );

    case WithdrawalStrategyType.HEBELER_AUTOPILOT:
      return (
        <div className="flex flex-col gap-4">
          <NumericInput
            label="Initial Withdrawal Rate"
            value={params.initialWithdrawalRate || 0.04}
            onChange={(val) => updateWithdrawalStrategyParams({ initialWithdrawalRate: val })}
            format="percent"
            suffix="%"
            min={0.01}
            max={0.08}
          />
          <NumericInput
            label="PMT Expected Return"
            value={params.pmtExpectedReturn || 0.03}
            onChange={(val) => updateWithdrawalStrategyParams({ pmtExpectedReturn: val })}
            format="percent"
            suffix="%"
            min={0}
            max={0.1}
          />
          <NumericInput
            label="Prior Year Weight"
            value={params.priorYearWeight || 0.75}
            onChange={(val) => updateWithdrawalStrategyParams({ priorYearWeight: val })}
            format="percent"
            suffix="%"
            min={0.5}
            max={0.9}
          />
        </div>
      );

    case WithdrawalStrategyType.CAPE_BASED:
      return (
        <div className="flex flex-col gap-4">
          <NumericInput
            label="Base Withdrawal Rate (a)"
            value={params.baseWithdrawalRate || 0.015}
            onChange={(val) => updateWithdrawalStrategyParams({ baseWithdrawalRate: val })}
            format="percent"
            suffix="%"
            min={0}
            max={0.05}
          />
          <NumericInput
            label="CAPE Weight (b)"
            value={params.capeWeight || 0.5}
            onChange={(val) => updateWithdrawalStrategyParams({ capeWeight: val })}
            min={0}
            max={2.0}
          />
          <NumericInput
            label="Starting CAPE Ratio"
            value={params.startingCAPE || 30.0}
            onChange={(val) => updateWithdrawalStrategyParams({ startingCAPE: val })}
            min={5}
            max={60}
          />
        </div>
      );

    default:
      return null;
  }
};
