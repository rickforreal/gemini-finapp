import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import { PhaseCard } from './SpendingPhases/PhaseCard';
import { Plus } from 'lucide-react';

export const SpendingPhases: React.FC = () => {
  const { spendingPhases, addSpendingPhase, updateSpendingPhase, removeSpendingPhase } = useAppStore();

  return (
    <CollapsibleSection title="Spending Phases">
      <div className="flex flex-col gap-3">
        <p className="text-[11px] text-slate-400 italic">
          Define monthly spending bounds for each phase of retirement. All amounts are in today's dollars and adjust for inflation automatically.
        </p>
        
        <div className="flex flex-col gap-4">
          {spendingPhases.map((phase, index) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              index={index}
              onUpdate={updateSpendingPhase}
              onRemove={removeSpendingPhase}
              canRemove={spendingPhases.length > 1}
              isLast={index === spendingPhases.length - 1}
            />
          ))}
        </div>

        {spendingPhases.length < 4 && (
          <button
            onClick={addSpendingPhase}
            className="flex items-center justify-center gap-2 w-full py-3 border border-dashed border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all text-[13px] font-medium"
          >
            <Plus size={16} />
            Add Phase
          </button>
        )}
      </div>
    </CollapsibleSection>
  );
};
