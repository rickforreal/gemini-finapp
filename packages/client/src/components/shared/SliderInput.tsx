import React from 'react';
import { NumericInput } from './NumericInput';

interface SliderInputProps {
  label: string; // Passed but only used for accessibility/reference
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  prefix?: string;
  format?: 'number' | 'currency' | 'percent';
  helperText?: string;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  prefix,
  format,
  helperText,
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full py-1">
      <div className="flex items-center gap-3 w-full">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onInput={(e) => onChange(e.currentTarget.valueAsNumber)}
          onChange={(e) => onChange(e.currentTarget.valueAsNumber)}
          className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 block"
        />
        <div className="w-20 shrink-0">
          <NumericInput
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            suffix={suffix}
            prefix={prefix}
            format={format}
          />
        </div>
      </div>
      {helperText && (
        <span className="text-[10px] text-slate-400 italic leading-tight">
          {helperText}
        </span>
      )}
    </div>
  );
};
