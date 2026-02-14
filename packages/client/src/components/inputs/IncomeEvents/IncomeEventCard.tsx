import React from 'react';
import { IncomeStream, AssetClass } from '@shared/index';
import { NumericInput } from '../../shared/NumericInput';
import { Dropdown } from '../../shared/Dropdown';
import { MonthYearPicker } from '../../shared/MonthYearPicker';
import { ToggleSwitch } from '../../shared/ToggleSwitch';
import { X, ArrowDownCircle } from 'lucide-react';

interface IncomeEventCardProps {
  event: IncomeStream;
  onUpdate: (id: string, updates: Partial<IncomeStream>) => void;
  onRemove: (id: string) => void;
}

export const IncomeEventCard: React.FC<IncomeEventCardProps> = ({
  event,
  onUpdate,
  onRemove,
}) => {
  const [startY, startM] = event.startMonth.split('-').map(Number);
  const [endY, endM] = (event.endMonth || '').split('-').map(Number);

  const handleDateChange = (field: 'startMonth' | 'endMonth', date: { month: number; year: number }) => {
    onUpdate(event.id, { [field]: `${date.year}-${date.month.toString().padStart(2, '0')}` });
  };

  return (
    <div className="relative flex flex-col gap-4 p-3 bg-white border border-slate-200 rounded-lg shadow-sm border-l-4 border-l-emerald-500">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <ArrowDownCircle size={16} className="text-emerald-500 shrink-0" />
          <input
            type="text"
            value={event.name}
            onChange={(e) => onUpdate(event.id, { name: e.target.value })}
            placeholder="Income name..."
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
        <Dropdown
          label="Deposit Into"
          options={[
            { label: 'Stocks', value: AssetClass.STOCKS },
            { label: 'Bonds', value: AssetClass.BONDS },
            { label: 'Cash', value: AssetClass.CASH },
          ]}
          value={event.depositTo}
          onChange={(val) => onUpdate(event.id, { depositTo: val as AssetClass })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MonthYearPicker
          label={event.cadence.kind === 'oneTime' ? 'Date' : 'Start Date'}
          month={startM}
          year={startY}
          onChange={(date) => handleDateChange('startMonth', date)}
        />
        <Dropdown
          label="Frequency"
          options={[
            { label: 'Monthly', value: 'monthly' },
            { label: 'Annual', value: 'annual' },
            { label: 'One-Time', value: 'oneTime' },
          ]}
          value={event.cadence.kind}
          onChange={(val) => onUpdate(event.id, { cadence: { kind: val as any } })}
        />
      </div>

      {event.cadence.kind !== 'oneTime' && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-50">
          <MonthYearPicker
            label="End Date"
            month={endM || startM}
            year={endY || startY + 10}
            onChange={(date) => handleDateChange('endMonth', date)}
          />
          <div className="flex items-end pb-1">
            <ToggleSwitch
              label="CPI Linked"
              enabled={event.escalation.kind === 'cpiLinked'}
              onChange={(val) => onUpdate(event.id, { escalation: { kind: val ? 'cpiLinked' : 'none' } })}
            />
          </div>
        </div>
      )}
    </div>
  );
};
