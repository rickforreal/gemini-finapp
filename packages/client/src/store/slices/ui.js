export const createUISlice = (set) => ({
    ui: {
        chartDisplayMode: 'real',
        chartBreakdownEnabled: false,
        tableGranularity: 'annual',
        tableAssetColumnsEnabled: false,
        chartZoom: null,
        reforecastStatus: 'idle',
    },
    setChartDisplayMode: (chartDisplayMode) => set((state) => ({ ui: { ...state.ui, chartDisplayMode } })),
    setChartBreakdownEnabled: (chartBreakdownEnabled) => set((state) => ({ ui: { ...state.ui, chartBreakdownEnabled } })),
    setTableGranularity: (tableGranularity) => set((state) => ({ ui: { ...state.ui, tableGranularity } })),
    setTableAssetColumnsEnabled: (tableAssetColumnsEnabled) => set((state) => ({ ui: { ...state.ui, tableAssetColumnsEnabled } })),
    setChartZoom: (chartZoom) => set((state) => ({ ui: { ...state.ui, chartZoom } })),
    setReforecastStatus: (reforecastStatus) => set((state) => ({ ui: { ...state.ui, reforecastStatus } })),
});
