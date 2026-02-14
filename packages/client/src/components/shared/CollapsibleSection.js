import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
export const CollapsibleSection = ({ title, children, defaultExpanded = true, }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const [showOverflow, setShowOverflow] = useState(defaultExpanded);
    // Remove overflow-hidden after animation completes to allow tooltips
    useEffect(() => {
        if (isExpanded) {
            const timer = setTimeout(() => setShowOverflow(true), 200);
            return () => clearTimeout(timer);
        }
        else {
            setShowOverflow(false);
        }
    }, [isExpanded]);
    return (_jsxs("div", { className: "border-b border-slate-100 last:border-b-0", children: [_jsxs("button", { onClick: () => setIsExpanded(!isExpanded), className: "w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group", children: [_jsx("h3", { className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider", children: title }), _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: `h-3 w-3 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }), _jsx("div", { className: `transition-all duration-200 ease-in-out ${showOverflow ? 'overflow-visible' : 'overflow-hidden'} ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`, children: _jsx("div", { className: "px-4 pb-6 flex flex-col gap-5", children: children }) })] }));
};
