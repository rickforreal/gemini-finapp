import { StateCreator } from 'zustand';

export interface UISlice {
  ui: {
    chartDisplayMode: 'nominal' | 'real';
    chartBreakdownEnabled: boolean;
    tableGranularity: 'monthly' | 'annual';
    tableAssetColumnsEnabled: boolean;
    chartZoom: { start: number; end: number } | null;
    reforecastStatus: 'idle' | 'pending' | 'complete';
  };
  setChartDisplayMode: (mode: 'nominal' | 'real') => void;
  setChartBreakdownEnabled: (enabled: boolean) => void;
  setTableGranularity: (granularity: 'monthly' | 'annual') => void;
  setTableAssetColumnsEnabled: (enabled: boolean) => void;
  setChartZoom: (zoom: { start: number; end: number } | null) => void;
  setReforecastStatus: (status: 'idle' | 'pending' | 'complete') => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  ui: {
    chartDisplayMode: 'real',
    chartBreakdownEnabled: false,
    tableGranularity: 'annual',
    tableAssetColumnsEnabled: false,
    chartZoom: null,
    reforecastStatus: 'idle',
  },
  setChartDisplayMode: (chartDisplayMode) =>
    set((state) => ({ ui: { ...state.ui, chartDisplayMode } })),
  setChartBreakdownEnabled: (chartBreakdownEnabled) =>
    set((state) => ({ ui: { ...state.ui, chartBreakdownEnabled } })),
  setTableGranularity: (tableGranularity) =>
    set((state) => ({ ui: { ...state.ui, tableGranularity } })),
  setTableAssetColumnsEnabled: (tableAssetColumnsEnabled) =>
    set((state) => ({ ui: { ...state.ui, tableAssetColumnsEnabled } })),
  setChartZoom: (chartZoom) =>
    set((state) => ({ ui: { ...state.ui, chartZoom } })),
  setReforecastStatus: (reforecastStatus) =>
    set((state) => ({ ui: { ...state.ui, reforecastStatus } })),
});
