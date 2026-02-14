import React, { useState, useRef } from 'react';
import { WithdrawalStrategyType } from '@shared/index';
import { Info } from 'lucide-react';

interface StrategyTooltipProps {
  type: WithdrawalStrategyType;
}

export const StrategyTooltip: React.FC<StrategyTooltipProps> = ({ type }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [top, setTop] = useState(0);
  const iconRef = useRef<HTMLDivElement>(null);

  const contentMap: Record<WithdrawalStrategyType, { summary: string; howItWorks: string; tradeoff: string }> = {
    [WithdrawalStrategyType.CONSTANT_DOLLAR]: {
      summary: "Withdraws a fixed inflation-adjusted amount each year.",
      howItWorks: "The first year's withdrawal is a percentage of your starting portfolio. Each subsequent year, that dollar amount increases by inflation — regardless of how your portfolio performs. Also known as the '4% Rule' when using a 4% rate.",
      tradeoff: "Trade-off: Maximum income stability, but ignores market conditions. Poor early returns can deplete the portfolio."
    },
    [WithdrawalStrategyType.PERCENT_OF_PORTFOLIO]: {
      summary: "Withdraws a fixed percentage of the current portfolio each year.",
      howItWorks: "Your withdrawal tracks the portfolio directly — it rises when markets are up and falls when markets are down. The portfolio can never be fully depleted (the withdrawal shrinks proportionally).",
      tradeoff: "Trade-off: Portfolio never hits zero, but income can swing dramatically year-to-year."
    },
    [WithdrawalStrategyType.ONE_OVER_N]: {
      summary: "Divides the portfolio by the number of remaining years.",
      howItWorks: "In year 1 of a 40-year retirement, you withdraw 1/40 of the portfolio. In the final year, you withdraw everything remaining. Withdrawal rates naturally increase over time.",
      tradeoff: "Trade-off: Simple and systematic, but late-retirement withdrawals can be very large or very small depending on market performance."
    },
    [WithdrawalStrategyType.VPW]: {
      summary: "Uses a financial formula (PMT) to calculate optimal withdrawals based on remaining time and expected returns.",
      howItWorks: "Developed by the Bogleheads community. The withdrawal percentage increases each year as the remaining horizon shortens, ensuring the portfolio is fully (or partially) spent. Adapts to actual portfolio performance each year.",
      tradeoff: "Trade-off: Never depletes prematurely, but income can vary significantly. Designed to bring portfolio to ~$0 at the end."
    },
    [WithdrawalStrategyType.DYNAMIC_SWR]: {
      summary: "Continuously recalculates an annuity-like withdrawal based on current balance and remaining years.",
      howItWorks: "Uses a present-value formula incorporating expected returns and inflation to determine how much you can withdraw each year while fully exhausting the portfolio by the end of retirement.",
      tradeoff: "Trade-off: Responsive to market conditions and ensures full spend-down. Income varies with portfolio performance."
    },
    [WithdrawalStrategyType.SENSIBLE_WITHDRAWALS]: {
      summary: "A conservative base withdrawal plus a bonus from good years' gains.",
      howItWorks: "Each year, you take a base percentage of the portfolio for essentials. On top of that, if the portfolio had positive real gains the prior year, you take an additional percentage of those gains for discretionary spending.",
      tradeoff: "Trade-off: Downside protection (base is always available), but total income fluctuates. The 'extras' can be $0 in bad years."
    },
    [WithdrawalStrategyType.NINETY_FIVE_PERCENT]: {
      summary: "Percentage of portfolio, but you never cut spending more than 5% in a single year.",
      howItWorks: "Each year, calculate the standard percentage withdrawal. If it's less than 95% of last year's withdrawal, take 95% of last year's instead. Upward adjustments are unrestricted.",
      tradeoff: "Trade-off: Smooths downward shocks, but the floor can cause higher-than-sustainable withdrawals during prolonged downturns."
    },
    [WithdrawalStrategyType.GUYTON_KLINGER]: {
      summary: "Inflation-adjusted withdrawals with guardrail rules that trigger spending cuts or raises.",
      howItWorks: "Starts like Constant Dollar (inflation-adjusted), but applies four decision rules: freeze inflation adjustments after negative return years, cut spending 10% if your withdrawal rate drifts too high, and raise spending 10% if it drops too low.",
      tradeoff: "Trade-off: Higher initial withdrawal rate than Constant Dollar (~5.2%), but requires accepting occasional spending cuts. Guardrails sunset near end of retirement."
    },
    [WithdrawalStrategyType.VANGUARD_DYNAMIC]: {
      summary: "Percentage of portfolio, constrained by a ceiling and floor on year-over-year changes.",
      howItWorks: "Each year, calculate a percentage of the current portfolio. But the actual withdrawal can't increase more than the ceiling % or decrease more than the floor % from last year's spending. This smooths income while staying responsive to markets.",
      tradeoff: "Trade-off: More stable than pure Percent of Portfolio, more responsive than Constant Dollar. Requires choosing appropriate ceiling/floor values."
    },
    [WithdrawalStrategyType.ENDOWMENT]: {
      summary: "Blends prior year's spending with current portfolio value for a smoothed withdrawal.",
      howItWorks: "Each year, the withdrawal is a weighted average: part based on last year's withdrawal (adjusted for inflation) and part based on a fresh percentage of the current portfolio. Higher smoothing weight = more stable, less responsive.",
      tradeoff: "Trade-off: Gradual response to market changes. Very stable income in the short term, but may lag behind in both upturns and downturns."
    },
    [WithdrawalStrategyType.HEBELER_AUTOPILOT]: {
      summary: "Blends prior year's withdrawal with a PMT-calculated withdrawal for smooth, market-responsive income.",
      howItWorks: "Each year, combine 75% of last year's inflation-adjusted withdrawal with 25% of the withdrawal calculated by the PMT formula (which accounts for remaining years and expected returns). Created by financial advisor Henry K. Hebeler.",
      tradeoff: "Trade-off: Smoothed income that gently responds to market conditions. Tends to preserve capital well but may underspend in strong markets."
    },
    [WithdrawalStrategyType.CAPE_BASED]: {
      summary: "Adjusts withdrawals based on stock market valuation using the CAPE ratio.",
      howItWorks: "Withdrawal rate = a base rate + a valuation-sensitive component (weight / CAPE). When markets are expensive (high CAPE), you withdraw less. When markets are cheap (low CAPE), you withdraw more. This counters the tendency to overspend in bubbles.",
      tradeoff: "Trade-off: Theoretically sound valuation-awareness, but requires a CAPE input and assumes mean reversion. Income varies with market valuation."
    },
  };

  const content = contentMap[type];

  const handleMouseEnter = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      // Position it exactly to the right of the sidebar (sidebar is 320px)
      setTop(rect.top);
      setIsVisible(true);
    }
  };

  return (
    <div className="inline-block ml-2 leading-none" ref={iconRef}>
      <Info 
        size={14} 
        className={`text-slate-400 hover:text-blue-600 transition-colors cursor-help ${isVisible ? 'text-blue-600' : ''}`} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
      />
      {isVisible && (
        <div 
          className="fixed w-80 p-5 bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[9999] pointer-events-none transition-all border-l-4 border-l-blue-500"
          style={{ 
            left: '336px', // Sidebar (320px) + gap (16px)
            top: `${top}px`,
            transform: 'translateY(-20%)'
          }}
        >
          <div className="flex flex-col gap-3">
            <p className="text-[14px] font-bold text-slate-900 leading-tight">
              {content.summary}
            </p>
            <p className="text-[12px] text-slate-600 leading-relaxed">
              {content.howItWorks}
            </p>
            <p className="text-[11px] text-slate-400 italic font-medium pt-1 border-t border-slate-50">
              {content.tradeoff}
            </p>
          </div>
          {/* Visual pointer back to the icon */}
          <div className="absolute top-4 -left-2 w-4 h-4 bg-white border-l border-t border-slate-200 rotate-[315deg]" />
        </div>
      )}
    </div>
  );
};
