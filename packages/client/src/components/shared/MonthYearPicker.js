import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const MonthYearPicker = ({ label, month, year, onChange, className = '', }) => {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return (_jsxs("div", { className: `flex flex-col gap-1 ${className}`, children: [label && (_jsx("label", { className: "text-xs font-medium text-slate-600 uppercase tracking-wider", children: label })), _jsxs("div", { className: "flex gap-2", children: [_jsx("select", { value: month, onChange: (e) => onChange({ month: parseInt(e.target.value), year }), className: "flex-1 h-8 px-1 text-xs bg-white border border-slate-200 rounded outline-none focus:border-blue-500 appearance-none cursor-pointer", children: months.map((m, i) => (_jsx("option", { value: i + 1, children: m }, m))) }), _jsx("input", { type: "number", value: year, onChange: (e) => onChange({ month, year: parseInt(e.target.value) }), className: "w-16 h-8 px-1 text-xs bg-white border border-slate-200 rounded outline-none focus:border-blue-500" })] })] }));
};
