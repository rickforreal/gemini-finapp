import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const StatCard = ({ label, value, type = 'default', isSuccess, }) => {
    const isTerminal = type === 'terminal';
    const textColor = isTerminal
        ? (isSuccess ? 'text-emerald-600' : 'text-rose-600')
        : 'text-slate-900';
    return (_jsxs("div", { className: "flex flex-col gap-1 p-4 bg-white border border-slate-200 rounded-xl shadow-sm min-w-[140px] flex-1", children: [_jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none", children: label }), _jsx("span", { className: `text-xl font-bold ${textColor} tracking-tight tabular-nums`, children: value })] }));
};
