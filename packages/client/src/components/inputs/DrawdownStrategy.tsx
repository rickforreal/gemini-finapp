import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import { SegmentedToggle } from '../shared/SegmentedToggle';
import { Layers, Scale } from 'lucide-react';
import { RebalancingConfig } from './DrawdownStrategy/RebalancingConfig';

export const DrawdownStrategy: React.FC = () => {
  const { drawdownStrategy, setDrawdownStrategyType } = useAppStore();
  const { type, bucketOrder } = drawdownStrategy;

  return (
    <CollapsibleSection title="Asset Drawdown Strategy">
      <div className="flex flex-col gap-4">
        <p className="text-[11px] text-slate-400 italic">
          Determines which asset classes are drawn from when making withdrawals.
        </p>

        <SegmentedToggle
          options={[
            { label: 'Bucket', value: 'bucket', icon: <Layers size={14} /> },
            { label: 'Rebalancing', value: 'rebalancing', icon: <Scale size={14} /> },
          ]}
          value={type}
          onChange={(val) => setDrawdownStrategyType(val as 'bucket' | 'rebalancing')}
          className="w-full"
        />

        <div className="bg-slate-50 border border-slate-100 rounded-md p-4">
          {type === 'bucket' ? (
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Priority Order
              </span>
              <div className="flex flex-col gap-2">
                {bucketOrder.map((asset, i) => (
                  <div 
                    key={asset}
                    className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded shadow-sm"
                  >
                    <span className="text-[10px] font-bold text-slate-400 w-4">{i + 1}</span>
                    <span className="text-xs font-medium text-slate-600 capitalize">{asset}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 italic mt-1">
                Drag to reorder coming in Phase 7. Currently: {bucketOrder.join(' → ')}
              </p>
            </div>
          ) : (
            <RebalancingConfig />
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
};
