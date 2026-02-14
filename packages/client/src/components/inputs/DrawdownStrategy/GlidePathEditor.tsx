import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { AssetClass } from '@shared/index';
import { NumericInput } from '../../shared/NumericInput';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Plus, X } from 'lucide-react';

export const GlidePathEditor: React.FC = () => {
  const { 
    drawdownStrategy, 
    addGlidePathWaypoint, 
    updateGlidePathWaypoint, 
    removeGlidePathWaypoint 
  } = useAppStore();
  
  const { glidePath } = drawdownStrategy.rebalancing;

  const chartData = glidePath.map(wp => ({
    year: wp.year,
    stocks: Math.round(wp.allocation[AssetClass.STOCKS] * 100),
    bonds: Math.round(wp.allocation[AssetClass.BONDS] * 100),
    cash: Math.round(wp.allocation[AssetClass.CASH] * 100),
  }));

  return (
    <div className="flex flex-col gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <div className="flex flex-col gap-2">
        <div className="flex text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
          <div className="w-12">Year</div>
          <div className="flex-1 text-center">Allocation (S/B/C)</div>
          <div className="w-6"></div>
        </div>

        {glidePath.map((wp, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-12">
              {i === 0 || i === glidePath.length - 1 ? (
                <span className="text-xs font-bold text-slate-600 pl-1">{wp.year}</span>
              ) : (
                <NumericInput
                  value={wp.year}
                  onChange={(val) => updateGlidePathWaypoint(i, { year: val })}
                  className="w-12"
                />
              )}
            </div>
            <div className="flex-1 flex gap-1">
              <NumericInput
                value={wp.allocation[AssetClass.STOCKS]}
                onChange={(val) => updateGlidePathWaypoint(i, { allocation: { ...wp.allocation, [AssetClass.STOCKS]: val } })}
                format="percent"
                className="flex-1"
              />
              <NumericInput
                value={wp.allocation[AssetClass.BONDS]}
                onChange={(val) => updateGlidePathWaypoint(i, { allocation: { ...wp.allocation, [AssetClass.BONDS]: val } })}
                format="percent"
                className="flex-1"
              />
              <NumericInput
                value={wp.allocation[AssetClass.CASH]}
                onChange={(val) => updateGlidePathWaypoint(i, { allocation: { ...wp.allocation, [AssetClass.CASH]: val } })}
                format="percent"
                className="flex-1"
              />
            </div>
            <div className="w-6 flex justify-end">
              {i !== 0 && i !== glidePath.length - 1 && (
                <button 
                  onClick={() => removeGlidePathWaypoint(i)}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {glidePath.length < 10 && (
        <button
          onClick={addGlidePathWaypoint}
          className="flex items-center justify-center gap-1 w-full py-1.5 border border-dashed border-slate-200 rounded text-[11px] font-medium text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all"
        >
          <Plus size={12} />
          Add Waypoint
        </button>
      )}

      <div className="h-24 w-full mt-2 rounded border border-slate-100 bg-white overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="year" hide />
            <YAxis hide domain={[0, 100]} />
            <Area 
              type="monotone" 
              dataKey="stocks" 
              stackId="1" 
              stroke="#4A90D9" 
              fill="#4A90D9" 
              fillOpacity={0.6} 
              isAnimationActive={false}
            />
            <Area 
              type="monotone" 
              dataKey="bonds" 
              stackId="1" 
              stroke="#2EAD8E" 
              fill="#2EAD8E" 
              fillOpacity={0.6}
              isAnimationActive={false}
            />
            <Area 
              type="monotone" 
              dataKey="cash" 
              stackId="1" 
              stroke="#D4A843" 
              fill="#D4A843" 
              fillOpacity={0.6}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
