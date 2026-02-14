import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { CollapsibleSection } from '../../shared/CollapsibleSection';
import { IncomeEventCard } from './IncomeEventCard';
import { Plus, Download } from 'lucide-react';
import { AssetClass } from '@shared/index';

export const IncomeEvents: React.FC = () => {
  const { incomeEvents, addIncomeEvent, updateIncomeEvent, removeIncomeEvent } = useAppStore();

  const presets = [
    { name: 'Social Security', amount: 250000, depositTo: AssetClass.CASH, cadence: { kind: 'monthly' }, escalation: { kind: 'cpiLinked' } },
    { name: 'Pension', amount: 150000, depositTo: AssetClass.CASH, cadence: { kind: 'monthly' }, escalation: { kind: 'none' } },
    { name: 'Rental Income', amount: 100000, depositTo: AssetClass.CASH, cadence: { kind: 'monthly' }, escalation: { kind: 'fixedRate', annualRate: 0.02 } },
  ];

  return (
    <CollapsibleSection title="Additional Income">
      <div className="flex flex-col gap-3">
        <p className="text-[11px] text-slate-400 italic">
          Define income sources that add funds to your portfolio during retirement.
        </p>
        
        <div className="flex flex-col gap-4">
          {incomeEvents.map((event) => (
            <IncomeEventCard
              key={event.id}
              event={event}
              onUpdate={updateIncomeEvent}
              onRemove={removeIncomeEvent}
            />
          ))}
        </div>

        {incomeEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
            <Download size={24} className="text-slate-200 mb-2" />
            <span className="text-xs text-slate-400">No income events defined</span>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={() => addIncomeEvent()}
            className="flex items-center justify-center gap-2 w-full py-2 border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all text-xs font-medium bg-white"
          >
            <Plus size={14} />
            Custom Income
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            {presets.map(preset => (
              <button
                key={preset.name}
                onClick={() => addIncomeEvent(preset as any)}
                className="text-[10px] py-1.5 px-2 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 hover:bg-emerald-100 transition-colors text-left font-medium"
              >
                + {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};
