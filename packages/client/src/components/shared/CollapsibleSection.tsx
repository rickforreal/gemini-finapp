import React, { useState, useEffect } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showOverflow, setShowOverflow] = useState(defaultExpanded);

  // Remove overflow-hidden after animation completes to allow tooltips
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => setShowOverflow(true), 200);
      return () => clearTimeout(timer);
    } else {
      setShowOverflow(false);
    }
  }, [isExpanded]);

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group"
      >
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`transition-all duration-200 ease-in-out ${
          showOverflow ? 'overflow-visible' : 'overflow-hidden'
        } ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-6 flex flex-col gap-5">
          {children}
        </div>
      </div>
    </div>
  );
};
