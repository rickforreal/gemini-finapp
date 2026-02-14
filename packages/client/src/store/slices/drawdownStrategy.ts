import { StateCreator } from 'zustand';
import { AssetClass } from '@finapp/shared';

export interface DrawdownStrategySlice {
  drawdownStrategy: {
    type: 'bucket' | 'rebalancing';
    bucketOrder: AssetClass[];
    rebalancing: {
      targetAllocation: Record<AssetClass, number>;
      glidePathEnabled: boolean;
      glidePath: { year: number; allocation: Record<AssetClass, number> }[];
    };
  };
  setDrawdownStrategyType: (type: 'bucket' | 'rebalancing') => void;
  setBucketOrder: (order: AssetClass[]) => void;
  updateRebalancingAllocation: (allocation: Record<AssetClass, number>) => void;
  setGlidePathEnabled: (enabled: boolean) => void;
  addGlidePathWaypoint: () => void;
  updateGlidePathWaypoint: (index: number, waypoint: Partial<{ year: number; allocation: Record<AssetClass, number> }>) => void;
  removeGlidePathWaypoint: (index: number) => void;
}

export const createDrawdownStrategySlice: StateCreator<DrawdownStrategySlice> = (
  set
) => ({
  drawdownStrategy: {
    type: 'bucket',
    bucketOrder: [AssetClass.CASH, AssetClass.BONDS, AssetClass.STOCKS],
    rebalancing: {
      targetAllocation: {
        [AssetClass.STOCKS]: 0.7,
        [AssetClass.BONDS]: 0.25,
        [AssetClass.CASH]: 0.05,
      },
      glidePathEnabled: false,
      glidePath: [
        { year: 1, allocation: { [AssetClass.STOCKS]: 0.7, [AssetClass.BONDS]: 0.25, [AssetClass.CASH]: 0.05 } },
        { year: 40, allocation: { [AssetClass.STOCKS]: 0.4, [AssetClass.BONDS]: 0.4, [AssetClass.CASH]: 0.2 } },
      ],
    },
  },
  setDrawdownStrategyType: (type) =>
    set((state) => ({ drawdownStrategy: { ...state.drawdownStrategy, type } })),
  setBucketOrder: (bucketOrder) =>
    set((state) => ({ drawdownStrategy: { ...state.drawdownStrategy, bucketOrder } })),
  updateRebalancingAllocation: (targetAllocation) =>
    set((state) => ({
      drawdownStrategy: {
        ...state.drawdownStrategy,
        rebalancing: { 
          ...state.drawdownStrategy.rebalancing, 
          targetAllocation,
          // Sync first waypoint
          glidePath: state.drawdownStrategy.rebalancing.glidePath.map((wp, i) => 
            i === 0 ? { ...wp, allocation: targetAllocation } : wp
          )
        },
      },
    })),
  setGlidePathEnabled: (glidePathEnabled) =>
    set((state) => ({
      drawdownStrategy: {
        ...state.drawdownStrategy,
        rebalancing: { ...state.drawdownStrategy.rebalancing, glidePathEnabled },
      },
    })),
  addGlidePathWaypoint: () =>
    set((state) => {
      const { glidePath } = state.drawdownStrategy.rebalancing;
      if (glidePath.length >= 10) return state;
      
      const last = glidePath[glidePath.length - 1];
      const prev = glidePath[glidePath.length - 2];
      const newYear = Math.round(prev.year + (last.year - prev.year) / 2);
      
      const newWaypoint = { 
        year: newYear, 
        allocation: { ...last.allocation } 
      };
      
      const newPath = [...glidePath.slice(0, -1), newWaypoint, last].sort((a, b) => a.year - b.year);
      
      return {
        drawdownStrategy: {
          ...state.drawdownStrategy,
          rebalancing: { ...state.drawdownStrategy.rebalancing, glidePath: newPath }
        }
      };
    }),
  updateGlidePathWaypoint: (index, updates) =>
    set((state) => {
      const newPath = [...state.drawdownStrategy.rebalancing.glidePath];
      newPath[index] = { ...newPath[index], ...updates as any };
      
      return {
        drawdownStrategy: {
          ...state.drawdownStrategy,
          rebalancing: { 
            ...state.drawdownStrategy.rebalancing, 
            glidePath: newPath,
            // Sync first waypoint to targetAllocation
            targetAllocation: index === 0 ? newPath[0].allocation : state.drawdownStrategy.rebalancing.targetAllocation
          }
        }
      };
    }),
  removeGlidePathWaypoint: (index) =>
    set((state) => {
      const { glidePath } = state.drawdownStrategy.rebalancing;
      if (glidePath.length <= 2) return state;
      const newPath = glidePath.filter((_, i) => i !== index);
      return {
        drawdownStrategy: {
          ...state.drawdownStrategy,
          rebalancing: { ...state.drawdownStrategy.rebalancing, glidePath: newPath }
        }
      };
    }),
});
