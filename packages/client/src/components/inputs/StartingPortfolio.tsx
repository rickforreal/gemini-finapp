import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AssetClass } from '@shared/index';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import { NumericInput } from '../shared/NumericInput';
import { DonutChart } from '../shared/DonutChart';

export const StartingPortfolio: React.FC = () => {
  const { portfolio, setPortfolioBalance } = useAppStore();
  const { stocks, bonds, cash } = portfolio;

  const total = stocks + bonds + cash;
  const stocksPct = total > 0 ? (stocks / total) * 100 : 0;
  const bondsPct = total > 0 ? (bonds / total) * 100 : 0;
  const cashPct = total > 0 ? (cash / total) * 100 : 0;

  const chartData = [
    { name: 'Stocks', value: stocks, color: '#4A90D9' },
    { name: 'Bonds', value: bonds, color: '#2EAD8E' },
    { name: 'Cash', value: cash, color: '#D4A843' },
  ];

  const AssetRow = ({ 
    label, 
    value, 
    color, 
    asset 
  }: { 
    label: string; 
    value: number; 
    color: string; 
    asset: AssetClass 
  }) => (
    <div className="flex items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-2 flex-1 truncate">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate">{label}</span>
      </div>
      <div className="w-32 shrink-0">
        <NumericInput
          value={value / 100}
          onChange={(val) => setPortfolioBalance(asset, val * 100)}
          format="currency"
          prefix="$"
        />
      </div>
    </div>
  );

  return (
    <CollapsibleSection title="Starting Portfolio">
      <div className="flex flex-col gap-3">
        <AssetRow label="Stocks" value={stocks} color="#4A90D9" asset={AssetClass.STOCKS} />
        <AssetRow label="Bonds" value={bonds} color="#2EAD8E" asset={AssetClass.BONDS} />
        <AssetRow label="Cash" value={cash} color="#D4A843" asset={AssetClass.CASH} />

        <div className="mt-2 pt-4 border-t border-slate-50 flex items-center gap-6">
          <DonutChart data={chartData} />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-800 tabular-nums">
              Total: ${(total / 100).toLocaleString()}
            </span>
            <div className="flex flex-col gap-0.5 text-[10px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4A90D9] shrink-0" />
                <span className="tabular-nums">Stocks: {stocksPct.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2EAD8E] shrink-0" />
                <span className="tabular-nums">Bonds: {bondsPct.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4A843] shrink-0" />
                <span className="tabular-nums">Cash: {cashPct.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};
