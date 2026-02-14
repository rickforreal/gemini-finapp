import { StateCreator } from 'zustand';
import { AssetClass } from '@finapp/shared';

export interface PortfolioSlice {
  portfolio: {
    stocks: number; // integer cents
    bonds: number;  // integer cents
    cash: number;   // integer cents
  };
  setPortfolioBalance: (asset: AssetClass, balance: number) => void;
}

export const createPortfolioSlice: StateCreator<PortfolioSlice> = (set) => ({
  portfolio: {
    stocks: 100000000, // $1M
    bonds: 25000000,   // $250k
    cash: 10000000,    // $100k
  },
  setPortfolioBalance: (asset, balance) =>
    set((state) => ({
      portfolio: { ...state.portfolio, [asset]: balance },
    })),
});
