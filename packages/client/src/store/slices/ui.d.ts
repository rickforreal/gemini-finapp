import { StateCreator } from 'zustand';
export interface UISlice {
    ui: {
        chartDisplayMode: 'nominal' | 'real';
        chartBreakdownEnabled: boolean;
        tableGranularity: 'monthly' | 'annual';
        tableAssetColumnsEnabled: boolean;
        chartZoom: {
            start: number;
            end: number;
        } | null;
        reforecastStatus: 'idle' | 'pending' | 'complete';
    };
    setChartDisplayMode: (mode: 'nominal' | 'real') => void;
    setChartBreakdownEnabled: (enabled: boolean) => void;
    setTableGranularity: (granularity: 'monthly' | 'annual') => void;
    setTableAssetColumnsEnabled: (enabled: boolean) => void;
    setChartZoom: (zoom: {
        start: number;
        end: number;
    } | null) => void;
    setReforecastStatus: (status: 'idle' | 'pending' | 'complete') => void;
}
export declare const createUISlice: StateCreator<UISlice>;
