import { StateCreator } from 'zustand';
import { WithdrawalStrategyType } from '@finapp/shared';
export interface WithdrawalStrategySlice {
    withdrawalStrategy: {
        type: WithdrawalStrategyType;
        params: any;
    };
    setWithdrawalStrategyType: (type: WithdrawalStrategyType) => void;
    updateWithdrawalStrategyParams: (params: any) => void;
}
export declare const createWithdrawalStrategySlice: StateCreator<WithdrawalStrategySlice>;
