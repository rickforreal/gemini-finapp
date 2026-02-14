import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
export const NumericInput = ({ value, onChange, min, max, suffix, prefix, className = '', format = 'number', helperText, disabled = false, }) => {
    const [displayValue, setDisplayValue] = useState(value.toString());
    const [isFocused, setIsFocused] = useState(false);
    const [isClamping, setIsClamping] = useState(false);
    useEffect(() => {
        if (!isFocused) {
            setDisplayValue(formatValue(value));
        }
    }, [value, isFocused, format]);
    const formatValue = (val) => {
        if (format === 'currency') {
            return val.toLocaleString('en-US');
        }
        if (format === 'percent') {
            return (val * 100).toFixed(1);
        }
        return val.toString();
    };
    const parseValue = (str) => {
        const raw = str.replace(/[^0-9.-]/g, '');
        const num = parseFloat(raw);
        if (isNaN(num))
            return value;
        if (format === 'percent') {
            return num / 100;
        }
        return num;
    };
    const handleBlur = () => {
        if (disabled)
            return;
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
    const handleChange = (e) => {
        if (disabled)
            return;
        setDisplayValue(e.target.value);
    };
    return (_jsxs("div", { className: `flex flex-col gap-1 ${className}`, children: [_jsxs("div", { className: "relative flex items-center", children: [prefix && (_jsx("span", { className: `absolute left-2.5 ${disabled ? 'text-slate-300' : 'text-slate-400'} pointer-events-none text-xs font-medium`, children: prefix })), _jsx("input", { type: "text", value: displayValue, onChange: handleChange, onFocus: () => {
                            if (disabled)
                                return;
                            setIsFocused(true);
                            if (format === 'currency')
                                setDisplayValue(value.toString());
                            if (format === 'percent')
                                setDisplayValue((value * 100).toFixed(1));
                        }, onBlur: handleBlur, onKeyDown: (e) => {
                            if (e.key === 'Enter')
                                handleBlur();
                        }, disabled: disabled, className: `
            w-full h-8 px-2 text-xs text-right bg-white border rounded outline-none transition-colors
            ${prefix ? 'pl-6' : ''}
            ${suffix ? 'pr-7' : ''}
            ${disabled ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' :
                            isClamping ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200 focus:border-blue-500'}
          ` }), suffix && (_jsx("span", { className: `absolute right-2.5 ${disabled ? 'text-slate-300' : 'text-slate-400'} pointer-events-none text-[10px]`, children: suffix }))] }), helperText && (_jsx("span", { className: `text-[10px] ${disabled ? 'text-slate-300' : 'text-slate-400'} italic`, children: helperText }))] }));
};
