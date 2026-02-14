import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AssetClass, SimulationMode } from '@shared/index';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import { NumericInput } from '../shared/NumericInput';

export const ReturnAssumptions: React.FC = () => {
  const { simulationMode, returnAssumptions, setReturnAssumption } = useAppStore();

  if (simulationMode !== SimulationMode.MANUAL) {
    return (
      <CollapsibleSection title="Return Assumptions">
        <div className="bg-slate-50 border border-slate-100 rounded-md p-3 text-[11px] text-slate-500 italic">
          Return assumptions are derived from historical data in Monte Carlo mode.
        </div>
      </CollapsibleSection>
    );
  }

  const assets = [
    { key: AssetClass.STOCKS, label: 'Stocks', color: '#4A90D9' },
    { key: AssetClass.BONDS, label: 'Bonds', color: '#2EAD8E' },
    { key: AssetClass.CASH, label: 'Cash', color: '#D4A843' },
  ];

  return (
    <CollapsibleSection title="Return Assumptions">
      <div className="flex flex-col gap-4">
        <div className="flex text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-[-8px]">
          <div className="flex-1">Asset</div>
          <div className="w-20 text-center">Exp. Return</div>
          <div className="w-20 text-center ml-2">Std. Dev.</div>
        </div>

        {assets.map((asset) => (
          <div key={asset.key} className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }} />
              <span className="text-[13px] font-medium text-slate-600">{asset.label}</span>
            </div>
            <NumericInput
              value={returnAssumptions[asset.key].expectedReturn}
              onChange={(val) => setReturnAssumption(asset.key, 'expectedReturn', val)}
              format="percent"
              suffix="%"
              className="w-20"
            />
            <NumericInput
              value={returnAssumptions[asset.key].stdDev}
              onChange={(val) => setReturnAssumption(asset.key, 'stdDev', val)}
              format="percent"
              suffix="%"
              className="w-20 ml-2"
            />
          </div>
        ))}

        <div className="mt-2 pt-4 border-t border-slate-50 flex flex-col gap-2">
          <span className="text-[11px] font-medium text-slate-500 italic">Historical reference (approximate):</span>
          <div className="grid grid-cols-1 gap-1 text-[10px] text-slate-400">
            <div className="flex justify-between">
              <span>US Stocks:</span>
              <span>~10% return, ~15% std. dev.</span>
            </div>
            <div className="flex justify-between">
              <span>US Bonds:</span>
              <span>~5% return, ~4% std. dev.</span>
            </div>
            <div className="flex justify-between">
              <span>Cash/T-Bills:</span>
              <span>~3% return, ~1% std. dev.</span>
            </div>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};
