import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { AssetClass } from '@shared/index';
import { NumericInput } from '../../shared/NumericInput';
import { ToggleSwitch } from '../../shared/ToggleSwitch';
import { GlidePathEditor } from './GlidePathEditor';

export const RebalancingConfig: React.FC = () => {
  const { drawdownStrategy, updateRebalancingAllocation, setGlidePathEnabled } = useAppStore();
  const { rebalancing } = drawdownStrategy;
  const { targetAllocation, glidePathEnabled } = rebalancing;

  const total = (targetAllocation[AssetClass.STOCKS] + targetAllocation[AssetClass.BONDS] + targetAllocation[AssetClass.CASH]);
  const isValid = Math.abs(total - 1) < 0.001;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
          Target Allocation
        </span>
        
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#4A90D9]" />
              <span className="text-[13px] font-medium text-slate-600">Stocks</span>
            </div>
            <NumericInput
              value={targetAllocation[AssetClass.STOCKS]}
              onChange={(val) => updateRebalancingAllocation({ ...targetAllocation, [AssetClass.STOCKS]: val })}
              format="percent"
              suffix="%"
              disabled={glidePathEnabled}
              className="w-20"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#2EAD8E]" />
              <span className="text-[13px] font-medium text-slate-600">Bonds</span>
            </div>
            <NumericInput
              value={targetAllocation[AssetClass.BONDS]}
              onChange={(val) => updateRebalancingAllocation({ ...targetAllocation, [AssetClass.BONDS]: val })}
              format="percent"
              suffix="%"
              disabled={glidePathEnabled}
              className="w-20"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#D4A843]" />
              <span className="text-[13px] font-medium text-slate-600">Cash</span>
            </div>
            <NumericInput
              value={targetAllocation[AssetClass.CASH]}
              onChange={(val) => updateRebalancingAllocation({ ...targetAllocation, [AssetClass.CASH]: val })}
              format="percent"
              suffix="%"
              disabled={glidePathEnabled}
              className="w-20"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-100">
            <div style={{ width: `${targetAllocation[AssetClass.STOCKS] * 100}%`, backgroundColor: '#4A90D9' }} />
            <div style={{ width: `${targetAllocation[AssetClass.BONDS] * 100}%`, backgroundColor: '#2EAD8E' }} />
            <div style={{ width: `${targetAllocation[AssetClass.CASH] * 100}%`, backgroundColor: '#D4A843' }} />
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-[10px] font-bold ${isValid ? 'text-emerald-600' : 'text-rose-600'}`}>
              Total: {Math.round(total * 100)}% {isValid ? '✓' : '(must be 100%)'}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <ToggleSwitch
          label="Enable Glide Path"
          enabled={glidePathEnabled}
          onChange={setGlidePathEnabled}
          helperText="Shift allocation over time"
        />
        
        {glidePathEnabled && (
          <div className="mt-4">
            <GlidePathEditor />
          </div>
        )}
      </div>
    </div>
  );
};
