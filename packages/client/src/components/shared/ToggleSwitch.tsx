import React from 'react';

interface ToggleSwitchProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  helperText?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  enabled,
  onChange,
  helperText,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-medium text-slate-600">
          {label}
        </label>
        <button
          onClick={() => onChange(!enabled)}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${enabled ? 'bg-blue-600' : 'bg-slate-200'}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${enabled ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
      {helperText && (
        <span className="text-[10px] text-slate-400">
          {helperText}
        </span>
      )}
    </div>
  );
};
