import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
const App = () => {
    useEffect(() => {
        fetch('/api/v1/health')
            .then((res) => res.json())
            .then((data) => console.log('API Health Check:', data))
            .catch((err) => console.error('API Health Check Failed:', err));
    }, []);
    return (_jsxs("div", { className: "flex h-screen w-full bg-slate-50 overflow-hidden", children: [_jsxs("aside", { className: "w-80 h-full bg-white border-r border-slate-200 flex flex-col", children: [_jsx("div", { className: "p-4 border-b border-slate-200", children: _jsx("h1", { className: "text-xl font-bold text-primary", children: "FinApp" }) }), _jsx("div", { className: "flex-1 overflow-y-auto p-4", children: _jsx("p", { className: "text-slate-500 italic", children: "Sidebar inputs coming soon..." }) })] }), _jsxs("main", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsx("header", { className: "h-16 bg-white border-b border-slate-200 flex items-center px-6", children: _jsx("div", { className: "text-slate-500 italic", children: "Command Bar placeholder" }) }), _jsx("div", { className: "flex-1 overflow-y-auto p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsx("h2", { className: "text-2xl font-semibold text-slate-800 mb-6", children: "Output Area" }), _jsx("div", { className: "bg-white rounded-lg border border-slate-200 shadow-sm p-12 flex items-center justify-center min-h-[400px]", children: _jsx("p", { className: "text-slate-400", children: "Configure your parameters and click Run Simulation to generate a projection." }) })] }) })] })] }));
};
export default App;
