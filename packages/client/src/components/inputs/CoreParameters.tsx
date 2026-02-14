import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import { SliderInput } from '../shared/SliderInput';
import { MonthYearPicker } from '../shared/MonthYearPicker';

export const CoreParameters: React.FC = () => {
  const { 
    coreParams, 
    setStartingAge, 
    setRetirementStartDate, 
    setRetirementDuration, 
    setInflationRate,
    setWithdrawalsStartMonth
  } = useAppStore();

  const { 
    startingAge, 
    retirementStartDate, 
    retirementDuration, 
    inflationRate,
    withdrawalsStartMonth
  } = coreParams;

  const Label = ({ children }: { children: string }) => (
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
      {children}
    </span>
  );

  return (
    <CollapsibleSection title="Core Parameters">
      <div>
        <Label>Starting Age</Label>
        <SliderInput
          label="Starting Age"
          value={startingAge}
          onChange={setStartingAge}
          min={30}
          max={85}
          suffix="yrs"
        />
      </div>
      
      <div>
        <Label>Retirement Starts</Label>
        <MonthYearPicker
          month={retirementStartDate.month}
          year={retirementStartDate.year}
          onChange={setRetirementStartDate}
        />
      </div>

      <div>
        <Label>Duration</Label>
        <SliderInput
          label="Retirement Duration"
          value={retirementDuration}
          onChange={setRetirementDuration}
          min={5}
          max={50}
          suffix="yrs"
          helperText={`${retirementDuration} yrs = ${retirementDuration * 12} months (to age ${startingAge + retirementDuration})`}
        />
      </div>

      <div>
        <Label>Exp. Inflation</Label>
        <SliderInput
          label="Expected Inflation Rate"
          value={inflationRate}
          onChange={setInflationRate}
          min={0}
          max={0.1}
          step={0.001}
          format="percent"
          suffix="%"
          helperText={`$1,000 today ≈ $${Math.round(1000 / Math.pow(1 + inflationRate, retirementDuration)).toLocaleString()} in ${retirementDuration} yrs`}
        />
      </div>

      <div>
        <Label>Withdrawals Begin</Label>
        <SliderInput
          label="Withdrawals Start At"
          value={withdrawalsStartMonth}
          onChange={setWithdrawalsStartMonth}
          min={1}
          max={retirementDuration * 12}
          suffix="mo"
          helperText={`Starts in month ${withdrawalsStartMonth}`}
        />
      </div>
    </CollapsibleSection>
  );
};
