import React, { useState, useEffect } from 'react';

export interface NumericInputProps {
  label?: string; // Kept in interface for compatibility but won't render
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  format?: 'number' | 'currency' | 'percent';
  helperText?: string;
  disabled?: boolean;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChange,
  min,
  max,
  suffix,
  prefix,
  className = '',
  format = 'number',
  helperText,
  disabled = false,
}) => {
  const [displayValue, setDisplayValue] = useState<string>(value.toString());
  const [isFocused, setIsFocused] = useState(false);
  const [isClamping, setIsClamping] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatValue(value));
    }
  }, [value, isFocused, format]);

  const formatValue = (val: number): string => {
    if (format === 'currency') {
      return val.toLocaleString('en-US');
    }
    if (format === 'percent') {
      return (val * 100).toFixed(1);
    }
    return val.toString();
  };

  const parseValue = (str: string): number => {
    const raw = str.replace(/[^0-9.-]/g, '');
    const num = parseFloat(raw);
    if (isNaN(num)) return value;
    
    if (format === 'percent') {
      return num / 100;
    }
    return num;
  };

  const handleBlur = () => {
    if (disabled) return;
    setIsFocused(false);
    let num = parseValue(displayValue);
    
    let clamped = false;
    if (min !== undefined && num < min) {
      num = min;
      clamped = true;
    }
    if (max !== undefined && num > max) {
      num = max;
      clamped = true;
    }

    if (clamped) {
      setIsClamping(true);
      setTimeout(() => setIsClamping(false), 300);
    }

    onChange(num);
    setDisplayValue(formatValue(num));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    setDisplayValue(e.target.value);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="relative flex items-center">
        {prefix && (
          <span className={`absolute left-2.5 ${disabled ? 'text-slate-300' : 'text-slate-400'} pointer-events-none text-xs font-medium`}>
            {prefix}
          </span>
        )}
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => {
            if (disabled) return;
            setIsFocused(true);
            if (format === 'currency') setDisplayValue(value.toString());
            if (format === 'percent') setDisplayValue((value * 100).toFixed(1));
          }}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleBlur();
          }}
          disabled={disabled}
          className={`
            w-full h-8 px-2 text-xs text-right bg-white border rounded outline-none transition-colors
            ${prefix ? 'pl-6' : ''}
            ${suffix ? 'pr-7' : ''}
            ${disabled ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' : 
              isClamping ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200 focus:border-blue-500'}
          `}
        />
        {suffix && (
          <span className={`absolute right-2.5 ${disabled ? 'text-slate-300' : 'text-slate-400'} pointer-events-none text-[10px]`}>
            {suffix}
          </span>
        )}
      </div>
      {helperText && (
        <span className={`text-[10px] ${disabled ? 'text-slate-300' : 'text-slate-400'} italic`}>
          {helperText}
        </span>
      )}
    </div>
  );
};
