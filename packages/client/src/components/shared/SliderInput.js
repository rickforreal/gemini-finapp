import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NumericInput } from './NumericInput';
export const SliderInput = ({ value, onChange, min, max, step = 1, suffix, prefix, format, helperText, }) => {
    return (_jsxs("div", { className: "flex flex-col gap-1.5 w-full py-1", children: [_jsxs("div", { className: "flex items-center gap-3 w-full", children: [_jsx("input", { type: "range", min: min, max: max, step: step, value: value, onInput: (e) => onChange(e.currentTarget.valueAsNumber), onChange: (e) => onChange(e.currentTarget.valueAsNumber), className: "flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 block" }), _jsx("div", { className: "w-20 shrink-0", children: _jsx(NumericInput, { value: value, onChange: onChange, min: min, max: max, suffix: suffix, prefix: prefix, format: format }) })] }), helperText && (_jsx("span", { className: "text-[10px] text-slate-400 italic leading-tight", children: helperText }))] }));
};
