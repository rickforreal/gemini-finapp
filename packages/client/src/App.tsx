import React from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { CommandBar } from './components/layout/CommandBar';
import { SummaryStatsBar } from './components/outputs/SummaryStats/SummaryStatsBar';
import { PortfolioChart } from './components/outputs/PortfolioChart/PortfolioChart';
import { DetailTable } from './components/outputs/DetailTable/DetailTable';
import { useAppStore } from './store/useAppStore';

const App: React.FC = () => {
  const { simulationResults } = useAppStore();
  const { manual, status } = simulationResults;

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-900">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <CommandBar />

        {/* Output Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="w-full flex flex-col gap-8 pb-12">
            <SummaryStatsBar />
            
            {status === 'idle' ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Ready to Simulate</h3>
                <p className="text-slate-400 text-center max-w-sm">
                  Configure your retirement parameters in the sidebar and click <strong className="text-slate-600">Run Simulation</strong> to see your financial forecast.
                </p>
              </div>
            ) : status === 'running' ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center min-h-[500px] animate-pulse">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Calculating simulation...</p>
              </div>
            ) : (
              <>
                <PortfolioChart />
                <DetailTable />
              </>
            )}

            {!manual && status !== 'idle' && status !== 'running' && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-sm">
                <p className="font-bold mb-1">Simulation Error</p>
                <p>{simulationResults.error || 'There was an error running the simulation. Please check your inputs and try again.'}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
