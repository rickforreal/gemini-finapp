import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppStore } from '../../../store/useAppStore';
import { StatCard } from './StatCard';
import { SimulationMode } from '@shared/index';
export const SummaryStatsBar = () => {
    const { simulationResults, simulationMode } = useAppStore();
    const { manual, status } = simulationResults;
    const cardCount = simulationMode === SimulationMode.MONTE_CARLO ? 9 : 8;
    if (!manual || status === 'idle' || status === 'running') {
        return (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 w-full animate-pulse", children: [...Array(cardCount)].map((_, i) => (_jsx("div", { className: "h-20 bg-white border border-slate-100 rounded-xl" }, i))) }));
    }
    const { summary } = manual;
    const formatCurrency = (cents) => `$${Math.round(cents / 100).toLocaleString()}`;
    return (_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 w-full", children: [_jsx(StatCard, { label: "Total Nominal", value: formatCurrency(summary.withdrawals.totalNominal) }), _jsx(StatCard, { label: "Total Real", value: formatCurrency(summary.withdrawals.totalReal) }), _jsx(StatCard, { label: "Median", value: formatCurrency(summary.withdrawals.medianMonthlyNominal) }), _jsx(StatCard, { label: "Mean", value: formatCurrency(summary.withdrawals.meanMonthlyNominal) }), _jsx(StatCard, { label: "Std. Dev.", value: formatCurrency(summary.withdrawals.stdDevMonthlyNominal) }), _jsx(StatCard, { label: "25th Pct", value: formatCurrency(summary.withdrawals.p25MonthlyNominal) }), _jsx(StatCard, { label: "75th Pct", value: formatCurrency(summary.withdrawals.p75MonthlyNominal) }), _jsx(StatCard, { label: "Terminal", value: formatCurrency(summary.endOfHorizon.nominalEndBalance), type: "terminal", isSuccess: summary.endOfHorizon.nominalEndBalance > 0 }), simulationMode === SimulationMode.MONTE_CARLO && (_jsx(StatCard, { label: "Success Rate", value: "--" }))] }));
};
