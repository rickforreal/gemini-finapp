import React from 'react';
import { ExpenseEvent } from '@shared/index';
import { NumericInput } from '../../shared/NumericInput';
import { MonthYearPicker } from '../../shared/MonthYearPicker';
import { ToggleSwitch } from '../../shared/ToggleSwitch';
import { X, ArrowUpCircle } from 'lucide-react';

interface ExpenseEventCardProps {
  event: ExpenseEvent;
  onUpdate: (id: string, updates: Partial<ExpenseEvent>) => void;
  onRemove: (id: string) => void;
}

export const ExpenseEventCard: React.FC<ExpenseEventCardProps> = ({
  event,
  onUpdate,
  onRemove,
}) => {
  const [startY, startM] = event.startMonth.split('-').map(Number);

  const handleDateChange = (date: { month: number; year: number }) => {
    onUpdate(event.id, { startMonth: `${date.year}-${date.month.toString().padStart(2, '0')}` });
  };

  return (
    <div className="relative flex flex-col gap-4 p-3 bg-white border border-slate-200 rounded-lg shadow-sm border-l-4 border-l-rose-500">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <ArrowUpCircle size={16} className="text-rose-500 shrink-0" />
          <input
            type="text"
            value={event.name}
            onChange={(e) => onUpdate(event.id, { name: e.target.value })}
            placeholder="Expense name..."
            className="bg-transparent text-[13px] font-semibold text-slate-700 outline-none hover:bg-slate-50 px-1 rounded transition-colors w-full"
          />
        </div>
        <button 
          onClick={() => onRemove(event.id)}
          className="text-slate-400 hover:text-red-500 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumericInput
          label="Amount"
          value={event.amount / 100}
          onChange={(val) => onUpdate(event.id, { amount: val * 100 })}
          format="currency"
          prefix="$"
        />
        <NumericInput
          label="Duration (Months)"
          value={event.durationMonths}
          onChange={(val) => onUpdate(event.id, { durationMonths: val })}
          min={1}
          max={480}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MonthYearPicker
          label="Start Date"
          month={startM}
          year={startY}
          onChange={handleDateChange}
        />
        <div className="flex items-end pb-1">
          <ToggleSwitch
            label="CPI Linked"
            enabled={event.escalation.kind === 'cpiLinked'}
            onChange={(val) => onUpdate(event.id, { escalation: { kind: val ? 'cpiLinked' : 'none' } })}
          />
        </div>
      </div>
    </div>
  );
};
