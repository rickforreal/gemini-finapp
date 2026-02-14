# Tasks

## Phase 1: Foundation

**Goal:** The monorepo compiles, dev servers start, and the client renders a shell layout that communicates with the server.

- [x] P1-T1: Initialize npm workspaces and root package structure
- [x] P1-T2: Scaffold `@shared` package
- [x] P1-T3: Scaffold `@server` package with Fastify
- [x] P1-T4: Scaffold `@client` package with Vite + React + Tailwind
- [x] P1-T5: Set up Zustand store scaffold
- [x] P1-T6: Configure monorepo tooling and scripts
- [x] P1-T7: Verify client-server communication

## Phase 2: Simulation Engine Core

**Goal:** The server can run a complete retirement simulation for the Constant Dollar strategy with Bucket drawdown, and return correct results via the API.

- [x] P2-T1: Implement `roundToCents` and `pmt` helpers
- [x] P2-T2: Implement `inflation` and `returns` helpers
- [x] P2-T3: Implement Constant Dollar withdrawal strategy
- [x] P2-T4: Implement Bucket drawdown strategy
- [x] P2-T5: Implement core `simulateRetirement` loop in `simulator.ts`
- [x] P2-T6: Create Zod schemas for `SimulateRequest` and `SimulateResponse`
- [x] P2-T7: Implement `POST /api/v1/simulate` route
- [x] P2-T8: Verify Phase 2 DoD (Tests and direct API calls)

## Phase 3: Input Panel

**Goal:** Every sidebar section renders correctly with all its controls, and every input change updates the Zustand store.

- [x] P3-T1: Build shared input components (`NumericInput`, `CurrencyInput`, `PercentInput`, etc.)
- [x] P3-T2: Implement `CoreParameters` section and wire to store
- [x] P3-T3: Implement `StartingPortfolio` section with `DonutChart`
- [x] P3-T4: Implement `ReturnAssumptions` section (Manual mode only)
- [x] P3-T5: Implement `SpendingPhases` section with cascade logic
- [x] P3-T6: Implement `WithdrawalStrategy` and `DrawdownStrategy` sections
- [x] P3-T7: Build `CommandBar` with mode toggles and Run button
- [x] P3-T8: Verify input-to-store reactivity for all controls

## Phase 4: Output — Chart & Stats

**Goal:** Simulation results are visualized. The user can click Run Simulation and see a portfolio chart and summary statistics.

- [x] P4-T1: Build `SummaryStatsBar` and `StatCard` components
- [x] P4-T2: Implement `PortfolioChart` using Recharts (Line/Area)
- [x] P4-T3: Implement `ChartTooltip` and crosshair
- [x] P4-T4: Build `RealNominalToggle` and `AssetClassToggle` logic
- [x] P4-T5: Build `ZoomPanControls` (Range Selector)
- [x] P4-T6: Wire "Run Simulation" button to API and update store
- [x] P4-T7: Add loading states and empty states for output area
- [x] P4-T8: Verify Phase 4 DoD (Chart renders, stats update on run)

## Phase 5: Output — Detail Table

**Goal:** Simulation results are browsable in a detailed table with monthly and annual views, column toggling, and sorting.

- [x] P5-T1: Install TanStack Table and Virtual dependencies
- [x] P5-T2: Define `DetailTable` structure and columns
- [x] P5-T3: Implement Monthly/Annual toggle logic in store/selector
- [x] P5-T4: Implement Asset Class columns toggle
- [x] P5-T5: Implement row virtualization for large monthly datasets
- [x] P5-T6: Add column sorting and sticky headers
- [x] P5-T7: Add Period column horizontal stickiness
- [x] P5-T8: Verify Phase 5 DoD (Table scrolls smoothly, sorting works)

## Phase 6: All Withdrawal Strategies

**Goal:** All 12 withdrawal strategies are implemented, tested, and selectable in the UI with their strategy-specific parameter panels.

- [x] P6-T1: Implement all 11 remaining withdrawal strategies in the engine
- [x] P6-T2: Implement `StrategyParams` component for dynamic parameter inputs
- [x] P6-T3: Build `StrategyTooltip` with descriptions for each strategy
- [x] P6-T4: Create test suite for all 12 strategies (Unit tests)
- [x] P6-T5: Verify Phase 6 DoD (All strategies produce correct results)

## Phase 7: Drawdown & Events

**Goal:** The Rebalancing drawdown strategy works, income and expense events are configurable in the UI and processed by the engine, and the glide path editor is functional.

- [x] P7-T1: Implement Rebalancing drawdown algorithm in the engine
- [x] P7-T2: Implement income and expense event processing in the simulation loop
- [x] P7-T3: Build `IncomeEvents` and `ExpenseEvents` UI components
- [x] P7-T4: Implement `RebalancingConfig` and `GlidePathEditor` UI
- [x] P7-T5: Add inflation adjustment and recurrence logic for events
- [x] P7-T6: Verify Phase 7 DoD (Events affect portfolio, rebalancing works)

## Phase 8: Monte Carlo

**Goal:** Monte Carlo simulation mode is fully functional — historical data drives 1,000 simulations, confidence bands render on the chart, and probability of success is displayed.

- [x] P8-T1: Implement `HistoricalDataReader` in the engine
- [x] P8-T2: Implement `MonteCarloRunner` with sampling and percentile logic
- [x] P8-T3: Extend `/api/v1/simulate` to support Monte Carlo results
- [x] P8-T4: Build `HistoricalEraSelector` and MC-specific UI components
- [x] P8-T5: Implement `ConfidenceBands` in the portfolio chart
- [x] P8-T6: Add `ProbabilityOfSuccess` stat card logic and thresholds
- [x] P8-T7: Verify Phase 8 DoD (1,000 runs < 3s, bands render correctly)
