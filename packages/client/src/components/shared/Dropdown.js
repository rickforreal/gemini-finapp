import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Dropdown = ({ label, options, value, onChange, className = '', }) => {
    return (_jsxs("div", { className: `flex flex-col gap-1 ${className}`, children: [label && (_jsx("label", { className: "text-xs font-medium text-slate-600 uppercase tracking-wider", children: label })), _jsx("select", { value: value, onChange: (e) => onChange(e.target.value), className: "h-8 px-2 text-xs bg-white border border-slate-200 rounded outline-none focus:border-blue-500 appearance-none cursor-pointer", style: {
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.2em 1.2em',
                    paddingRight: '2rem',
                }, children: options.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value))) })] }));
};
