import { WithdrawalStrategyType } from '@finapp/shared';
export const createWithdrawalStrategySlice = (set) => ({
    withdrawalStrategy: {
        type: WithdrawalStrategyType.CONSTANT_DOLLAR,
        params: { initialWithdrawalRate: 0.04 },
    },
    setWithdrawalStrategyType: (type) => set(() => {
        let params = {};
        switch (type) {
            case WithdrawalStrategyType.CONSTANT_DOLLAR:
                params = { initialWithdrawalRate: 0.04 };
                break;
            case WithdrawalStrategyType.PERCENT_OF_PORTFOLIO:
                params = { annualRate: 0.04 };
                break;
            case WithdrawalStrategyType.ONE_OVER_N:
                params = { years: 40 };
                break;
            case WithdrawalStrategyType.VPW:
                params = { expectedRealReturn: 0.03, drawdownTarget: 1.0 };
                break;
            case WithdrawalStrategyType.DYNAMIC_SWR:
                params = { expectedRateOfReturn: 0.06 };
                break;
            case WithdrawalStrategyType.SENSIBLE_WITHDRAWALS:
                params = { baseWithdrawalRate: 0.03, extrasWithdrawalRate: 0.10 };
                break;
            case WithdrawalStrategyType.NINETY_FIVE_PERCENT:
                params = { annualWithdrawalRate: 0.04, minimumFloor: 0.95 };
                break;
            case WithdrawalStrategyType.GUYTON_KLINGER:
                params = {
                    initialWithdrawalRate: 0.052,
                    capitalPreservationTrigger: 0.20,
                    capitalPreservationCut: 0.10,
                    prosperityTrigger: 0.20,
                    prosperityRaise: 0.10,
                    guardrailsSunset: 15
                };
                break;
            case WithdrawalStrategyType.VANGUARD_DYNAMIC:
                params = { annualWithdrawalRate: 0.05, ceiling: 0.05, floor: 0.025 };
                break;
            case WithdrawalStrategyType.ENDOWMENT:
                params = { spendingRate: 0.05, smoothingWeight: 0.70 };
                break;
            case WithdrawalStrategyType.HEBELER_AUTOPILOT:
                params = { initialWithdrawalRate: 0.04, pmtExpectedReturn: 0.03, priorYearWeight: 0.75 };
                break;
            case WithdrawalStrategyType.CAPE_BASED:
                params = { baseWithdrawalRate: 0.015, capeWeight: 0.5, startingCAPE: 30.0 };
                break;
        }
        return { withdrawalStrategy: { type, params } };
    }),
    updateWithdrawalStrategyParams: (params) => set((state) => ({
        withdrawalStrategy: { ...state.withdrawalStrategy, params: { ...state.withdrawalStrategy.params, ...params } },
    })),
});
