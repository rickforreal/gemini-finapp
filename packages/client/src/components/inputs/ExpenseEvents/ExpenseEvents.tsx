import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { CollapsibleSection } from '../../shared/CollapsibleSection';
import { ExpenseEventCard } from './ExpenseEventCard';
import { Plus, Upload } from 'lucide-react';

export const ExpenseEvents: React.FC = () => {
  const { expenseEvents, addExpenseEvent, updateExpenseEvent, removeExpenseEvent } = useAppStore();

  const presets = [
    { name: 'New Roof', amount: 3500000, durationMonths: 1, escalation: { kind: 'none' } },
    { name: 'Long-Term Care', amount: 400000, durationMonths: 120, escalation: { kind: 'cpiLinked' } },
    { name: 'World Cruise', amount: 5000000, durationMonths: 1, escalation: { kind: 'none' } },
  ];

  return (
    <CollapsibleSection title="Large Expenses">
      <div className="flex flex-col gap-3">
        <p className="text-[11px] text-slate-400 italic">
          Define irregular or planned large expenses that will be drawn from your portfolio.
        </p>
        
        <div className="flex flex-col gap-4">
          {expenseEvents.map((event) => (
            <ExpenseEventCard
              key={event.id}
              event={event}
              onUpdate={updateExpenseEvent}
              onRemove={removeExpenseEvent}
            />
          ))}
        </div>

        {expenseEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
            <Upload size={24} className="text-slate-200 mb-2" />
            <span className="text-xs text-slate-400">No expenses defined</span>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={() => addExpenseEvent()}
            className="flex items-center justify-center gap-2 w-full py-2 border border-slate-200 rounded-lg text-slate-500 hover:text-red-600 hover:border-red-200 transition-all text-xs font-medium bg-white"
          >
            <Plus size={14} />
            Custom Expense
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            {presets.map(preset => (
              <button
                key={preset.name}
                onClick={() => addExpenseEvent(preset as any)}
                className="text-[10px] py-1.5 px-2 bg-rose-50 text-rose-700 rounded border border-rose-100 hover:bg-rose-100 transition-colors text-left font-medium"
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
