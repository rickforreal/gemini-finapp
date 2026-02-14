import { StateCreator } from 'zustand';
import { AssetClass } from '@finapp/shared';
export interface DrawdownStrategySlice {
    drawdownStrategy: {
        type: 'bucket' | 'rebalancing';
        bucketOrder: AssetClass[];
        rebalancing: {
            targetAllocation: Record<AssetClass, number>;
            glidePathEnabled: boolean;
            glidePath: {
                year: number;
                allocation: Record<AssetClass, number>;
            }[];
        };
    };
    setDrawdownStrategyType: (type: 'bucket' | 'rebalancing') => void;
    setBucketOrder: (order: AssetClass[]) => void;
    updateRebalancingAllocation: (allocation: Record<AssetClass, number>) => void;
    setGlidePathEnabled: (enabled: boolean) => void;
    addGlidePathWaypoint: () => void;
    updateGlidePathWaypoint: (index: number, waypoint: Partial<{
        year: number;
        allocation: Record<AssetClass, number>;
    }>) => void;
    removeGlidePathWaypoint: (index: number) => void;
}
export declare const createDrawdownStrategySlice: StateCreator<DrawdownStrategySlice>;
