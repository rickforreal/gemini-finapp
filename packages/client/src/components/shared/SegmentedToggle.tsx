import React from 'react';

interface SegmentedToggleOption<T> {
  label: string;
  value: T;
  icon?: React.ReactNode;
}

interface SegmentedToggleProps<T> {
  options: SegmentedToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const SegmentedToggle = <T extends string | number>({
  options,
  value,
  onChange,
  className = '',
  size = 'md',
}: SegmentedToggleProps<T>) => {
  return (
    <div
      className={`
        inline-flex p-1 bg-slate-100 rounded-full
        ${size === 'sm' ? 'h-8' : 'h-9'}
        ${className}
      `}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              flex items-center justify-center gap-2 px-4 rounded-full text-xs font-medium transition-all duration-200
              ${
                isActive
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }
              ${size === 'sm' ? 'px-3' : 'px-4'}
            `}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
