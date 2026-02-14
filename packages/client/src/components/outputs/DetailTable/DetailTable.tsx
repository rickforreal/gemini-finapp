import React, { useMemo, useRef } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useAppStore } from '../../../store/useAppStore';
import { MonthRow, AssetClass, SimulationMode, SinglePathResult, MonteCarloResult } from '@shared';
import { SegmentedToggle } from '../../shared/SegmentedToggle';
import { Table, PieChart as PieChartIcon, ArrowUpDown, ArrowUp, ArrowDown, Maximize2, Minimize2 } from 'lucide-react';

const columnHelper = createColumnHelper<MonthRow>();

export const DetailTable: React.FC = () => {
  const { 
    simulationResults, 
    ui, 
    setTableGranularity, 
    setTableAssetColumnsEnabled,
    setSpreadsheetMode,
    simulationMode
  } = useAppStore();
  
  const { manual, monteCarlo, status } = simulationResults;
  const { tableGranularity, tableAssetColumnsEnabled, spreadsheetMode } = ui;

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const formatCurrency = (cents: number) => 
    `$${Math.round(cents / 100).toLocaleString()}`;

  const data = useMemo(() => {
    const activeResult: SinglePathResult | MonteCarloResult | null = simulationMode === SimulationMode.MONTE_CARLO ? monteCarlo : manual;
    if (!activeResult) return [];
    
    let rows: MonthRow[] = [];
    if (activeResult.kind === 'monte-carlo') {
      rows = activeResult.percentiles.p50;
    } else {
      rows = activeResult.rows;
    }

    if (tableGranularity === 'monthly') return rows;

    // Annual aggregation
    const annualRows: MonthRow[] = [];
    for (let i = 0; i < rows.length; i += 12) {
      const yearMonths = rows.slice(i, i + 12);
      if (yearMonths.length === 0) break;

      const firstMonth = yearMonths[0];
      const lastMonth = yearMonths[yearMonths.length - 1];

      const aggregatedRow: MonthRow = {
        month: `Year ${Math.floor(i / 12) + 1}`,
        startBalances: firstMonth.startBalances,
        endBalances: lastMonth.endBalances,
        movement: {
          nominalChange: yearMonths.reduce((sum: number, m: MonthRow) => sum + m.movement.nominalChange, 0),
          percentChange: yearMonths.reduce((prod: number, m: MonthRow) => prod * (1 + m.movement.percentChange), 1) - 1,
        },
        cashflows: {
          incomeTotal: yearMonths.reduce((sum: number, m: MonthRow) => sum + m.cashflows.incomeTotal, 0),
          expenseTotal: yearMonths.reduce((sum: number, m: MonthRow) => sum + m.cashflows.expenseTotal, 0),
        },
        withdrawals: {
          nominalTotal: yearMonths.reduce((sum: number, m: MonthRow) => sum + m.withdrawals.nominalTotal, 0),
          realTotal: yearMonths.reduce((sum: number, m: MonthRow) => sum + m.withdrawals.realTotal, 0),
          byAsset: {
            [AssetClass.STOCKS]: yearMonths.reduce((sum: number, m: MonthRow) => sum + m.withdrawals.byAsset[AssetClass.STOCKS], 0),
            [AssetClass.BONDS]: yearMonths.reduce((sum: number, m: MonthRow) => sum + m.withdrawals.byAsset[AssetClass.BONDS], 0),
            [AssetClass.CASH]: yearMonths.reduce((sum: number, m: MonthRow) => sum + m.withdrawals.byAsset[AssetClass.CASH], 0),
          }
        }
      };
      annualRows.push(aggregatedRow);
    }
    return annualRows;
  }, [manual, monteCarlo, tableGranularity, simulationMode]);

  const columns = useMemo(() => [
    columnHelper.accessor('month', {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-slate-700 transition-colors w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Period
          {{
            asc: <ArrowUp size={12} />,
            desc: <ArrowDown size={12} />,
          }[column.getIsSorted() as string] ?? <ArrowUpDown size={12} />}
        </button>
      ),
      cell: (info) => <span className="font-bold text-slate-900">{info.getValue()}</span>,
      size: 120,
    }),
    columnHelper.accessor((row) => {
      const activeResult: SinglePathResult | MonteCarloResult | null = simulationMode === SimulationMode.MONTE_CARLO ? monteCarlo : manual;
      const rows = activeResult?.kind === 'monte-carlo' ? activeResult.percentiles.p50 : activeResult?.rows;
      const startAge = useAppStore.getState().coreParams.startingAge;
      const index = (rows as any[])?.findIndex((r: any) => r.month === row.month) ?? -1;
      if (index === -1) {
        const yearMatch = row.month.match(/Year (\d+)/);
        if (yearMatch) return startAge + parseInt(yearMatch[1]) - 1;
        return startAge;
      }
      return startAge + Math.floor(index / 12);
    }, {
      id: 'age',
      header: 'Age',
      cell: (info) => <span className="text-slate-500">{info.getValue()}</span>,
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
        cell: (info) => <span className="text-blue-600">{formatCurrency(info.getValue())}</span>,
        size: 120,
      }),
      columnHelper.accessor('startBalances.bonds', {
        header: 'Bonds',
        cell: (info) => <span className="text-emerald-600">{formatCurrency(info.getValue())}</span>,
        size: 120,
      }),
      columnHelper.accessor('startBalances.cash', {
        header: 'Cash',
        cell: (info) => <span className="text-amber-600">{formatCurrency(info.getValue())}</span>,
        size: 120,
      }),
    ] : []),
    columnHelper.accessor('movement.nominalChange', {
      header: 'Movement ($)',
      cell: (info) => (
        <span className={info.getValue() >= 0 ? 'text-emerald-600' : 'text-rose-600 font-medium'}>
          {info.getValue() >= 0 ? '+' : ''}{formatCurrency(info.getValue())}
        </span>
      ),
      size: 130,
    }),
    columnHelper.accessor('movement.percentChange', {
      header: 'Return (%)',
      cell: (info) => (
        <span className={info.getValue() >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
          {info.getValue() >= 0 ? '+' : ''}{(info.getValue() * 100).toFixed(2)}%
        </span>
      ),
      size: 100,
    }),
    columnHelper.accessor('cashflows.incomeTotal', {
      header: 'Income',
      cell: (info) => info.getValue() > 0 ? (
        <span className="text-emerald-600 font-medium">+{formatCurrency(info.getValue())}</span>
      ) : <span className="text-slate-300">—</span>,
      size: 110,
    }),
    columnHelper.accessor('cashflows.expenseTotal', {
      header: 'Expenses',
      cell: (info) => info.getValue() > 0 ? (
        <span className="text-rose-600 font-medium">-{formatCurrency(info.getValue())}</span>
      ) : <span className="text-slate-300">—</span>,
      size: 110,
    }),
    columnHelper.accessor('withdrawals.nominalTotal', {
      header: 'Withdrawal',
      cell: (info) => <span className="font-medium">{formatCurrency(info.getValue())}</span>,
      size: 120,
    }),
    columnHelper.accessor((row) => Object.values(row.endBalances).reduce((a, b) => a + b, 0), {
      id: 'totalEnd',
      header: 'Portfolio End',
      cell: (info) => <span className="font-bold">{formatCurrency(info.getValue())}</span>,
      size: 140,
    }),
  ], [tableAssetColumnsEnabled, manual, monteCarlo, tableGranularity, simulationMode]);

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

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 40,
    overscan: spreadsheetMode ? rows.length : 10,
    enabled: !spreadsheetMode,
  });

  const activeResult = simulationMode === SimulationMode.MONTE_CARLO ? monteCarlo : manual;
  if (!activeResult || status === 'idle') return null;

  const tableWidth = table.getTotalSize();

  return (
    <div className="flex flex-col gap-4 w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Table size={16} className="text-blue-600" />
            {simulationMode === SimulationMode.MONTE_CARLO ? 'Detail Ledger (Median Path)' : 'Detail Ledger'}
          </h3>
          {simulationMode === SimulationMode.MONTE_CARLO && (
            <p className="text-[10px] text-slate-400 mt-0.5 ml-6 italic">Showing values for the 50th percentile outcome</p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <SegmentedToggle
            size="sm"
            options={[
              { label: 'Annual', value: 'annual' },
              { label: 'Monthly', value: 'monthly' },
            ]}
            value={tableGranularity}
            onChange={(val) => setTableGranularity(val as 'annual' | 'monthly')}
          />
          <button
            onClick={() => setTableAssetColumnsEnabled(!tableAssetColumnsEnabled)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
              ${tableAssetColumnsEnabled 
                ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                : 'text-slate-500 hover:bg-slate-50 border border-transparent'}
            `}
          >
            <PieChartIcon size={14} />
            Show Assets
          </button>
          <button
            onClick={() => setSpreadsheetMode(!spreadsheetMode)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
              ${spreadsheetMode 
                ? 'bg-slate-800 text-white shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 border border-transparent'}
            `}
          >
            {spreadsheetMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            {spreadsheetMode ? 'Compact View' : 'Spreadsheet Mode'}
          </button>
        </div>
      </div>

      <div 
        ref={tableContainerRef}
        className={`w-full overflow-auto border border-slate-100 rounded-lg relative scrollbar-thin scrollbar-thumb-slate-200 ${spreadsheetMode ? 'h-auto' : 'h-[600px]'}`}
      >
        <table className="border-collapse text-left text-xs" style={{ width: tableWidth, minWidth: '100%' }}>
          <thead className="sticky top-0 z-30 bg-slate-50 border-b border-slate-200 shadow-sm">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map((header, index) => (
                  <th 
                    key={header.id}
                    style={{ width: header.getSize(), minWidth: header.getSize() }}
                    className={`
                      px-4 py-3 font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap bg-slate-50 shrink-0
                      ${index === 0 ? 'sticky left-0 z-40 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' : ''}
                    `}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            style={{
              height: spreadsheetMode ? 'auto' : `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
              width: tableWidth,
              minWidth: '100%'
            }}
          >
            {spreadsheetMode ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group flex w-full"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <td 
                      key={cell.id} 
                      style={{ width: cell.column.getSize(), minWidth: cell.column.getSize() }}
                      className={`
                        px-4 py-3 tabular-nums text-slate-600 whitespace-nowrap bg-inherit shrink-0
                        ${index === 0 ? 'sticky left-0 z-20 bg-white group-hover:bg-slate-50 font-bold border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' : ''}
                      `}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <tr
                    key={row.id}
                    data-index={virtualRow.index}
                    ref={(node) => rowVirtualizer.measureElement(node)}
                    className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group flex"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      transform: `translateY(${virtualRow.start}px)`,
                      width: '100%',
                    }}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <td 
                        key={cell.id} 
                        style={{ width: cell.column.getSize(), minWidth: cell.column.getSize() }}
                        className={`
                          px-4 py-3 tabular-nums text-slate-600 whitespace-nowrap bg-inherit shrink-0
                          ${index === 0 ? 'sticky left-0 z-20 bg-white group-hover:bg-slate-50 font-bold border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' : ''}
                        `}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
