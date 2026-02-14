import React, { useEffect } from 'react';

const App: React.FC = () => {
  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then((data) => console.log('API Health Check:', data))
      .catch((err) => console.error('API Health Check Failed:', err));
  }, []);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Sidebar Placeholder */}
      <aside className="w-80 h-full bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-primary">FinApp</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-slate-500 italic">Sidebar inputs coming soon...</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Command Bar Placeholder */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6">
          <div className="text-slate-500 italic">Command Bar placeholder</div>
        </header>

        {/* Output Area Placeholder */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Output Area</h2>
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 flex items-center justify-center min-h-[400px]">
              <p className="text-slate-400">Configure your parameters and click Run Simulation to generate a projection.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
