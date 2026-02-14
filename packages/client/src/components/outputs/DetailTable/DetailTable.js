import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo, useRef } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useAppStore } from '../../../store/useAppStore';
import { AssetClass } from '@shared/index';
import { SegmentedToggle } from '../../shared/SegmentedToggle';
import { Table, PieChart as PieChartIcon, ArrowUpDown, ArrowUp, ArrowDown, Maximize2, Minimize2 } from 'lucide-react';
const columnHelper = createColumnHelper();
export const DetailTable = () => {
    const { simulationResults, ui, setTableGranularity, setTableAssetColumnsEnabled, setSpreadsheetMode } = useAppStore();
    const { manual, status } = simulationResults;
    const { tableGranularity, tableAssetColumnsEnabled, spreadsheetMode } = ui;
    const [sorting, setSorting] = React.useState([]);
    const formatCurrency = (cents) => `$${Math.round(cents / 100).toLocaleString()}`;
    const data = useMemo(() => {
        if (!manual)
            return [];
        if (tableGranularity === 'monthly')
            return manual.rows;
        // Annual aggregation
        const annualRows = [];
        for (let i = 0; i < manual.rows.length; i += 12) {
            const yearMonths = manual.rows.slice(i, i + 12);
            if (yearMonths.length === 0)
                break;
            const firstMonth = yearMonths[0];
            const lastMonth = yearMonths[yearMonths.length - 1];
            const aggregatedRow = {
                month: `Year ${Math.floor(i / 12) + 1}`,
                startBalances: firstMonth.startBalances,
                endBalances: lastMonth.endBalances,
                movement: {
                    nominalChange: yearMonths.reduce((sum, m) => sum + m.movement.nominalChange, 0),
                    percentChange: yearMonths.reduce((prod, m) => prod * (1 + m.movement.percentChange), 1) - 1,
                },
                cashflows: {
                    incomeTotal: yearMonths.reduce((sum, m) => sum + m.cashflows.incomeTotal, 0),
                    expenseTotal: yearMonths.reduce((sum, m) => sum + m.cashflows.expenseTotal, 0),
                },
                withdrawals: {
                    nominalTotal: yearMonths.reduce((sum, m) => sum + m.withdrawals.nominalTotal, 0),
                    realTotal: yearMonths.reduce((sum, m) => sum + m.withdrawals.realTotal, 0),
                    byAsset: {
                        [AssetClass.STOCKS]: yearMonths.reduce((sum, m) => sum + m.withdrawals.byAsset[AssetClass.STOCKS], 0),
                        [AssetClass.BONDS]: yearMonths.reduce((sum, m) => sum + m.withdrawals.byAsset[AssetClass.BONDS], 0),
                        [AssetClass.CASH]: yearMonths.reduce((sum, m) => sum + m.withdrawals.byAsset[AssetClass.CASH], 0),
                    }
                }
            };
            annualRows.push(aggregatedRow);
        }
        return annualRows;
    }, [manual, tableGranularity]);
    const columns = useMemo(() => [
        columnHelper.accessor('month', {
            header: ({ column }) => (_jsxs("button", { className: "flex items-center gap-1 hover:text-slate-700 transition-colors w-full", onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'), children: ["Period", {
                        asc: _jsx(ArrowUp, { size: 12 }),
                        desc: _jsx(ArrowDown, { size: 12 }),
                    }[column.getIsSorted()] ?? _jsx(ArrowUpDown, { size: 12 })] })),
            cell: (info) => _jsx("span", { className: "font-bold text-slate-900", children: info.getValue() }),
            size: 120,
        }),
        columnHelper.accessor((row) => {
            const startAge = useAppStore.getState().coreParams.startingAge;
            const index = manual?.rows.findIndex(r => r.month === row.month) ?? -1;
            if (index === -1) {
                const yearMatch = row.month.match(/Year (\d+)/);
                if (yearMatch)
                    return startAge + parseInt(yearMatch[1]) - 1;
                return startAge;
            }
            return startAge + Math.floor(index / 12);
        }, {
            id: 'age',
            header: 'Age',
            cell: (info) => _jsx("span", { className: "text-slate-500", children: info.getValue() }),
            size: 60,
        }),
        columnHelper.accessor((row) => Object.values(row.startBalances).reduce((a, b) => a + b, 0), {
            id: 'totalStart',
            header: 'Portfolio Start',
            cell: (info) => formatCurrency(info.getValue()),
            size: 140,
        }),
        ...(tableAssetColumnsEnabled ? [
            columnHelper.accessor('startBalances.stocks', {
                header: 'Stocks',
                cell: (info) => _jsx("span", { className: "text-blue-600", children: formatCurrency(info.getValue()) }),
                size: 120,
            }),
            columnHelper.accessor('startBalances.bonds', {
                header: 'Bonds',
                cell: (info) => _jsx("span", { className: "text-emerald-600", children: formatCurrency(info.getValue()) }),
                size: 120,
            }),
            columnHelper.accessor('startBalances.cash', {
                header: 'Cash',
                cell: (info) => _jsx("span", { className: "text-amber-600", children: formatCurrency(info.getValue()) }),
                size: 120,
            }),
        ] : []),
        columnHelper.accessor('movement.nominalChange', {
            header: 'Movement ($)',
            cell: (info) => (_jsxs("span", { className: info.getValue() >= 0 ? 'text-emerald-600' : 'text-rose-600 font-medium', children: [info.getValue() >= 0 ? '+' : '', formatCurrency(info.getValue())] })),
            size: 130,
        }),
        columnHelper.accessor('movement.percentChange', {
            header: 'Return (%)',
            cell: (info) => (_jsxs("span", { className: info.getValue() >= 0 ? 'text-emerald-600' : 'text-rose-600', children: [info.getValue() >= 0 ? '+' : '', (info.getValue() * 100).toFixed(2), "%"] })),
            size: 100,
        }),
        columnHelper.accessor('cashflows.incomeTotal', {
            header: 'Income',
            cell: (info) => info.getValue() > 0 ? (_jsxs("span", { className: "text-emerald-600 font-medium", children: ["+", formatCurrency(info.getValue())] })) : _jsx("span", { className: "text-slate-300", children: "\u2014" }),
            size: 110,
        }),
        columnHelper.accessor('cashflows.expenseTotal', {
            header: 'Expenses',
            cell: (info) => info.getValue() > 0 ? (_jsxs("span", { className: "text-rose-600 font-medium", children: ["-", formatCurrency(info.getValue())] })) : _jsx("span", { className: "text-slate-300", children: "\u2014" }),
            size: 110,
        }),
        columnHelper.accessor('withdrawals.nominalTotal', {
            header: 'Withdrawal',
            cell: (info) => _jsx("span", { className: "font-medium", children: formatCurrency(info.getValue()) }),
            size: 120,
        }),
        columnHelper.accessor((row) => Object.values(row.endBalances).reduce((a, b) => a + b, 0), {
            id: 'totalEnd',
            header: 'Portfolio End',
            cell: (info) => _jsx("span", { className: "font-bold", children: formatCurrency(info.getValue()) }),
            size: 140,
        }),
    ], [tableAssetColumnsEnabled, manual, tableGranularity]);
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });
    const tableContainerRef = useRef(null);
    const { rows } = table.getRowModel();
    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => 40,
        overscan: spreadsheetMode ? rows.length : 10, // Render all if spreadsheet mode
        enabled: !spreadsheetMode, // Actually disable virtualizer logic if not needed
    });
    if (!manual || status === 'idle')
        return null;
    const tableWidth = table.getTotalSize();
    return (_jsxs("div", { className: `flex flex-col gap-4 w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm overflow-hidden`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("h3", { className: "text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2", children: [_jsx(Table, { size: 16, className: "text-blue-600" }), "Detail Ledger"] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(SegmentedToggle, { size: "sm", options: [
                                    { label: 'Annual', value: 'annual' },
                                    { label: 'Monthly', value: 'monthly' },
                                ], value: tableGranularity, onChange: (val) => setTableGranularity(val) }), _jsxs("button", { onClick: () => setTableAssetColumnsEnabled(!tableAssetColumnsEnabled), className: `
              flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
              ${tableAssetColumnsEnabled
                                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                    : 'text-slate-500 hover:bg-slate-50 border border-transparent'}
            `, children: [_jsx(PieChartIcon, { size: 14 }), "Show Assets"] }), _jsxs("button", { onClick: () => setSpreadsheetMode(!spreadsheetMode), className: `
              flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
              ${spreadsheetMode
                                    ? 'bg-slate-800 text-white shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50 border border-transparent'}
            `, children: [spreadsheetMode ? _jsx(Minimize2, { size: 14 }) : _jsx(Maximize2, { size: 14 }), spreadsheetMode ? 'Compact View' : 'Spreadsheet Mode'] })] })] }), _jsx("div", { ref: tableContainerRef, className: `w-full overflow-auto border border-slate-100 rounded-lg relative scrollbar-thin scrollbar-thumb-slate-200 ${spreadsheetMode ? 'h-auto' : 'h-[600px]'}`, children: _jsxs("table", { className: "border-collapse text-left text-xs", style: { width: tableWidth, minWidth: '100%' }, children: [_jsx("thead", { className: "sticky top-0 z-30 bg-slate-50 border-b border-slate-200 shadow-sm", children: table.getHeaderGroups().map(headerGroup => (_jsx("tr", { className: "flex w-full", children: headerGroup.headers.map((header, index) => (_jsx("th", { style: { width: header.getSize(), minWidth: header.getSize() }, className: `
                      px-4 py-3 font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap bg-slate-50 shrink-0
                      ${index === 0 ? 'sticky left-0 z-40 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' : ''}
                    `, children: flexRender(header.column.columnDef.header, header.getContext()) }, header.id))) }, headerGroup.id))) }), _jsx("tbody", { style: {
                                height: spreadsheetMode ? 'auto' : `${rowVirtualizer.getTotalSize()}px`,
                                position: 'relative',
                                width: tableWidth,
                                minWidth: '100%'
                            }, children: spreadsheetMode ? (
                            // Spreadsheet Mode: Render all rows directly
                            table.getRowModel().rows.map((row) => (_jsx("tr", { className: "hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group flex w-full", children: row.getVisibleCells().map((cell, index) => (_jsx("td", { style: { width: cell.column.getSize(), minWidth: cell.column.getSize() }, className: `
                        px-4 py-3 tabular-nums text-slate-600 whitespace-nowrap bg-inherit shrink-0
                        ${index === 0 ? 'sticky left-0 z-20 bg-white group-hover:bg-slate-50 font-bold border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' : ''}
                      `, children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id)))) : (
                            // Normal Mode: Virtualized rendering
                            rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const row = rows[virtualRow.index];
                                return (_jsx("tr", { "data-index": virtualRow.index, ref: (node) => rowVirtualizer.measureElement(node), className: "hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group flex", style: {
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        transform: `translateY(${virtualRow.start}px)`,
                                        width: '100%',
                                    }, children: row.getVisibleCells().map((cell, index) => (_jsx("td", { style: { width: cell.column.getSize(), minWidth: cell.column.getSize() }, className: `
                          px-4 py-3 tabular-nums text-slate-600 whitespace-nowrap bg-inherit shrink-0
                          ${index === 0 ? 'sticky left-0 z-20 bg-white group-hover:bg-slate-50 font-bold border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' : ''}
                        `, children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id));
                            })) })] }) })] }));
};
