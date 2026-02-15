import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppStore } from '../../../store/useAppStore';
import { StatCard } from './StatCard';
import { SimulationMode } from '@shared';
export const SummaryStatsBar = () => {
    const { simulationResults, simulationMode } = useAppStore();
    const { manual, monteCarlo, status } = simulationResults;
    const activeResult = simulationMode === SimulationMode.MONTE_CARLO ? monteCarlo : manual;
    const hasResult = activeResult && (status === 'complete' || status === 'error');
    // We show 9 cards in Manual (Nominal/Real for both Drawdown and Terminal)
    // We show 10 cards in MC (includes Success Rate)
    const cardCount = simulationMode === SimulationMode.MONTE_CARLO ? 10 : 9;
    if (status === 'running' || !hasResult) {
        return (_jsx("div", { className: `grid grid-cols-2 md:grid-cols-4 ${simulationMode === SimulationMode.MONTE_CARLO ? 'xl:grid-cols-10' : 'xl:grid-cols-9'} gap-3 w-full animate-pulse`, children: [...Array(cardCount)].map((_, i) => (_jsx("div", { className: "h-20 bg-white border border-slate-100 rounded-xl" }, i))) }));
    }
    const { summary } = activeResult;
    const formatCurrency = (cents) => `$${Math.round(cents / 100).toLocaleString()}`;
    const successRate = simulationMode === SimulationMode.MONTE_CARLO
        ? ((monteCarlo?.probabilityOfSuccess || 0) * 100).toFixed(1) + '%'
        : null;
    return (_jsxs("div", { className: `grid grid-cols-2 md:grid-cols-4 ${simulationMode === SimulationMode.MONTE_CARLO ? 'xl:grid-cols-10' : 'xl:grid-cols-9'} gap-3 w-full`, children: [_jsx(StatCard, { label: "Total Nominal", value: formatCurrency(summary.withdrawals.totalNominal) }), _jsx(StatCard, { label: "Total Real", value: formatCurrency(summary.withdrawals.totalReal) }), _jsx(StatCard, { label: "Median", value: formatCurrency(summary.withdrawals.medianMonthlyNominal) }), _jsx(StatCard, { label: "Mean", value: formatCurrency(summary.withdrawals.meanMonthlyNominal) }), _jsx(StatCard, { label: "Std. Dev.", value: formatCurrency(summary.withdrawals.stdDevMonthlyNominal) }), _jsx(StatCard, { label: "25th Pct", value: formatCurrency(summary.withdrawals.p25MonthlyNominal) }), _jsx(StatCard, { label: "75th Pct", value: formatCurrency(summary.withdrawals.p75MonthlyNominal) }), _jsx(StatCard, { label: "Terminal (Nom)", value: formatCurrency(summary.endOfHorizon.nominalEndBalance), type: "terminal", isSuccess: summary.endOfHorizon.nominalEndBalance > 0 }), _jsx(StatCard, { label: "Terminal (Real)", value: formatCurrency(summary.endOfHorizon.realEndBalance), type: "terminal", isSuccess: summary.endOfHorizon.realEndBalance > 0 }), simulationMode === SimulationMode.MONTE_CARLO && (_jsx(StatCard, { label: "Success Rate", value: successRate || '0%', type: "terminal", isSuccess: (monteCarlo?.probabilityOfSuccess || 0) >= 0.9 }))] }));
};
