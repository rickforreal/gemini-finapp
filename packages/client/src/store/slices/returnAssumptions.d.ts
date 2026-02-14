import { StateCreator } from 'zustand';
import { AssetClass } from '@finapp/shared';
export interface ReturnAssumptionsSlice {
    returnAssumptions: {
        stocks: {
            expectedReturn: number;
            stdDev: number;
        };
        bonds: {
            expectedReturn: number;
            stdDev: number;
        };
        cash: {
            expectedReturn: number;
            stdDev: number;
        };
    };
    setReturnAssumption: (asset: AssetClass, field: 'expectedReturn' | 'stdDev', value: number) => void;
}
export declare const createReturnAssumptionsSlice: StateCreator<ReturnAssumptionsSlice>;
