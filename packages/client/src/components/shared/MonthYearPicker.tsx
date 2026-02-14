import React from 'react';

interface MonthYearPickerProps {
  label?: string;
  month: number;
  year: number;
  onChange: (date: { month: number; year: number }) => void;
  className?: string;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  label,
  month,
  year,
  onChange,
  className = '',
}) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-slate-600 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <select
          value={month}
          onChange={(e) => onChange({ month: parseInt(e.target.value), year })}
          className="flex-1 h-8 px-1 text-xs bg-white border border-slate-200 rounded outline-none focus:border-blue-500 appearance-none cursor-pointer"
        >
          {months.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={year}
          onChange={(e) => onChange({ month, year: parseInt(e.target.value) })}
          className="w-16 h-8 px-1 text-xs bg-white border border-slate-200 rounded outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
};
