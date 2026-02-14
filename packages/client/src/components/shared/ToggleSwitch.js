import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const ToggleSwitch = ({ label, enabled, onChange, helperText, }) => {
    return (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "text-[13px] font-medium text-slate-600", children: label }), _jsx("button", { onClick: () => onChange(!enabled), className: `
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${enabled ? 'bg-blue-600' : 'bg-slate-200'}
          `, children: _jsx("span", { className: `
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${enabled ? 'translate-x-6' : 'translate-x-1'}
            ` }) })] }), helperText && (_jsx("span", { className: "text-[10px] text-slate-400", children: helperText }))] }));
};
