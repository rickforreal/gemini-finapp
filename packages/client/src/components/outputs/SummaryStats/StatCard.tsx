import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  type?: 'default' | 'terminal';
  isSuccess?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  type = 'default',
  isSuccess,
}) => {
  const isTerminal = type === 'terminal';
  const textColor = isTerminal 
    ? (isSuccess ? 'text-emerald-600' : 'text-rose-600')
    : 'text-slate-900';

  return (
    <div className="flex flex-col gap-1 p-4 bg-white border border-slate-200 rounded-xl shadow-sm min-w-[140px] flex-1">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
        {label}
      </span>
      <span className={`text-xl font-bold ${textColor} tracking-tight tabular-nums`}>
        {value}
      </span>
    </div>
  );
};
