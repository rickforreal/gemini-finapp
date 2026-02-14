import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
export const SegmentedToggle = ({ options, value, onChange, className = '', size = 'md', }) => {
    return (_jsx("div", { className: `
        inline-flex p-1 bg-slate-100 rounded-full
        ${size === 'sm' ? 'h-8' : 'h-9'}
        ${className}
      `, children: options.map((option) => {
            const isActive = option.value === value;
            return (_jsxs("button", { onClick: () => onChange(option.value), className: `
              flex items-center justify-center gap-2 px-4 rounded-full text-xs font-medium transition-all duration-200
              ${isActive
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'}
              ${size === 'sm' ? 'px-3' : 'px-4'}
            `, children: [option.icon, option.label] }, option.value));
        }) }));
};
