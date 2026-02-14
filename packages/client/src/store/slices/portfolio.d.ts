import { StateCreator } from 'zustand';
import { AssetClass } from '@finapp/shared';
export interface PortfolioSlice {
    portfolio: {
        stocks: number;
        bonds: number;
        cash: number;
    };
    setPortfolioBalance: (asset: AssetClass, balance: number) => void;
}
export declare const createPortfolioSlice: StateCreator<PortfolioSlice>;
