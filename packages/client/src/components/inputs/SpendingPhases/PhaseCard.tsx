import React from 'react';
import { SpendingPhase } from '../../../store/slices/spendingPhases';
import { NumericInput } from '../../shared/NumericInput';
import { X } from 'lucide-react';

interface PhaseCardProps {
  phase: SpendingPhase;
  index: number;
  onUpdate: (id: string, updates: Partial<SpendingPhase>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
  isLast: boolean;
}

export const PhaseCard: React.FC<PhaseCardProps> = ({
  phase,
  index,
  onUpdate,
  onRemove,
  canRemove,
  isLast,
}) => {
  const accentColors = ['#6366f1', '#10b981', '#f43f5e', '#94a3b8'];
  const accentColor = accentColors[index % accentColors.length];

  return (
    <div 
      className="relative flex flex-col gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg transition-all"
      style={{ borderLeftWidth: '4px', borderLeftColor: accentColor }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div 
            className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: accentColor }}
          >
            {index + 1}
          </div>
          <input
            type="text"
            value={phase.name}
            onChange={(e) => onUpdate(phase.id, { name: e.target.value })}
            className="bg-transparent text-[13px] font-semibold text-slate-700 outline-none hover:bg-slate-100 px-1 rounded transition-colors"
          />
        </div>
        {canRemove && (
          <button 
            onClick={() => onRemove(phase.id)}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Start Year</span>
          <span className="text-sm font-medium text-slate-600">Year {phase.startYear}</span>
        </div>
        <div className="w-4 flex justify-center">
          <span className="text-slate-300">→</span>
        </div>
        <div className="flex-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">End Year</span>
          {isLast ? (
            <span className="text-sm font-medium text-slate-600">End</span>
          ) : (
            <NumericInput
              value={phase.endYear}
              onChange={(val) => onUpdate(phase.id, { endYear: val })}
              className="w-full"
            />
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <NumericInput
            label="Min / Month"
            value={phase.minMonthlySpend / 100}
            onChange={(val) => onUpdate(phase.id, { minMonthlySpend: val * 100 })}
            format="currency"
            prefix="$"
          />
        </div>
        <div className="flex-1">
          <NumericInput
            label="Max / Month"
            value={phase.maxMonthlySpend / 100}
            onChange={(val) => onUpdate(phase.id, { maxMonthlySpend: val * 100 })}
            format="currency"
            prefix="$"
          />
        </div>
      </div>
    </div>
  );
};
