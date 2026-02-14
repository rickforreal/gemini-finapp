export const createPortfolioSlice = (set) => ({
    portfolio: {
        stocks: 100000000, // $1M
        bonds: 25000000, // $250k
        cash: 10000000, // $100k
    },
    setPortfolioBalance: (asset, balance) => set((state) => ({
        portfolio: { ...state.portfolio, [asset]: balance },
    })),
});
