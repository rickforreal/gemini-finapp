export var AssetClass;
(function (AssetClass) {
    AssetClass["STOCKS"] = "stocks";
    AssetClass["BONDS"] = "bonds";
    AssetClass["CASH"] = "cash";
})(AssetClass || (AssetClass = {}));
export var WithdrawalStrategyType;
(function (WithdrawalStrategyType) {
    WithdrawalStrategyType["CONSTANT_DOLLAR"] = "constant-dollar";
    WithdrawalStrategyType["PERCENT_OF_PORTFOLIO"] = "percent-of-portfolio";
    WithdrawalStrategyType["ONE_OVER_N"] = "one-over-n";
    WithdrawalStrategyType["VPW"] = "vpw";
    WithdrawalStrategyType["DYNAMIC_SWR"] = "dynamic-swr";
    WithdrawalStrategyType["SENSIBLE_WITHDRAWALS"] = "sensible-withdrawals";
    WithdrawalStrategyType["NINETY_FIVE_PERCENT"] = "ninety-five-percent";
    WithdrawalStrategyType["GUYTON_KLINGER"] = "guyton-klinger";
    WithdrawalStrategyType["VANGUARD_DYNAMIC"] = "vanguard-dynamic";
    WithdrawalStrategyType["ENDOWMENT"] = "endowment";
    WithdrawalStrategyType["HEBELER_AUTOPILOT"] = "hebeler-autopilot";
    WithdrawalStrategyType["CAPE_BASED"] = "cape-based";
})(WithdrawalStrategyType || (WithdrawalStrategyType = {}));
export var SimulationMode;
(function (SimulationMode) {
    SimulationMode["MANUAL"] = "manual";
    SimulationMode["MONTE_CARLO"] = "monte-carlo";
})(SimulationMode || (SimulationMode = {}));
export var AppMode;
(function (AppMode) {
    AppMode["PLANNING"] = "planning";
    AppMode["TRACKING"] = "tracking";
})(AppMode || (AppMode = {}));
