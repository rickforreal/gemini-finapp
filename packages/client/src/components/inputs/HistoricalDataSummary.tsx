import React, { useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import { HistoricalEra } from '@shared';
import { Info, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export const HistoricalDataSummary: React.FC = () => {
  const { monteCarloConfig } = useAppStore();
  const { era } = monteCarloConfig;

  const eraInfo = useMemo(() => {
    switch (era) {
      case HistoricalEra.FULL_HISTORY:
        return { 
          desc: "Uses all available data from July 1926 to present. Captures the Great Depression, WWII, and modern cycles.",
          stats: { stocks: "10.3%", bonds: "5.1%", inflation: "3.0%" } 
        };
      case HistoricalEra.POST_WAR:
        return { 
          desc: "From 1946 onwards. Excludes the Great Depression and focus on the modern globalized economy.",
          stats: { stocks: "11.2%", bonds: "5.4%", inflation: "3.5%" } 
        };
      case HistoricalEra.MODERN_ERA:
        return { 
          desc: "From 1980 onwards. Characterized by declining interest rates and the tech revolution.",
          stats: { stocks: "12.1%", bonds: "6.2%", inflation: "2.9%" } 
        };
      case HistoricalEra.STAGFLATION:
        return { 
          desc: "1966-1982. High inflation and weak stock returns. A 'stress test' era for retirees.",
          stats: { stocks: "6.8%", bonds: "5.8%", inflation: "6.9%" } 
        };
      case HistoricalEra.LOST_DECADE:
        return { 
          desc: "2000-2009. Two major bear markets (Dot-com and GFC). Worst sequence of returns in modern history.",
          stats: { stocks: "-0.9%", bonds: "6.4%", inflation: "2.5%" } 
        };
      default:
        return { desc: "Custom era statistics.", stats: { stocks: "-", bonds: "-", inflation: "-" } };
    }
  }, [era]);

  const StatBox = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
        <Icon size={10} className={color} />
        {label}
      </div>
      <div className="text-sm font-bold text-slate-700">{value}</div>
    </div>
  );

  return (
    <CollapsibleSection title="Historical Data Summary">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
          <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
            {eraInfo.desc}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <StatBox label="Stocks" value={eraInfo.stats.stocks} icon={TrendingUp} color="text-blue-500" />
          <StatBox label="Bonds" value={eraInfo.stats.bonds} icon={ShieldCheck} color="text-emerald-500" />
          <StatBox label="Inflation" value={eraInfo.stats.inflation} icon={Zap} color="text-amber-500" />
        </div>

        <p className="text-[10px] text-slate-400 italic leading-tight">
          * Averages are nominal historical values for the selected period. Monte Carlo samples months randomly with replacement.
        </p>
      </div>
    </CollapsibleSection>
  );
};
