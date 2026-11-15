import React from 'react';
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { HealthStatus } from '../types/gaushala';
import type { HerdStats } from '../utils/dashboardCalculations';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PopulationOverviewProps {
  herdStats: HerdStats;
  onSelectHealthCategory: (status: HealthStatus) => void;
}

export function PopulationOverview({
  herdStats,
  onSelectHealthCategory,
}: PopulationOverviewProps) {
  const chartData = React.useMemo(
    () => ({
      labels: herdStats.breakdown.map((b) => b.label),
      datasets: [
        {
          data: herdStats.breakdown.map((b) => b.count),
          backgroundColor: herdStats.breakdown.map((b) => b.color),
          borderColor: '#FFFFFF',
          borderWidth: 2,
          hoverOffset: 5,
        },
      ],
    }),
    [herdStats]
  );

  const chartOptions: ChartOptions<'doughnut'> = React.useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: '#26352D',
          titleColor: '#FFFFFF',
          bodyColor: '#F6F8F5',
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => {
              const value = Number(ctx.raw) || 0;
              const pct =
                herdStats.total > 0
                  ? ((value / herdStats.total) * 100).toFixed(1)
                  : '0.0';
              return ` ${ctx.label}: ${value} cows (${pct}%)`;
            },
          },
        },
      },
    }),
    [herdStats.total]
  );

  return (
    <section
      aria-labelledby="population-overview-heading"
      className="bg-white border border-[#E2E8DF] rounded-xl p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <div>
          <h2
            id="population-overview-heading"
            className="font-display text-[17px] font-semibold text-[#26352D]"
          >
            Cow Population Overview
          </h2>
          <p className="text-[12.5px] text-[#78857C] mt-0.5">
            Live health distribution across all registered sanctuary animals
          </p>
        </div>
        <span className="text-[12px] text-[#78857C] tabular-nums">
          {herdStats.total} Total Registered
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Doughnut Chart */}
        <div className="md:col-span-5 flex items-center justify-center">
          <div className="relative w-52 h-52" data-testid="population-doughnut">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-display text-2xl font-bold text-[#26352D] tabular-nums">
                {herdStats.total}
              </span>
              <span className="text-[11.5px] text-[#78857C]">Total Herd</span>
            </div>
          </div>
        </div>

        {/* Compact Color-Coded Category Summary */}
        <div className="md:col-span-7 divide-y divide-[#F0F3EE]">
          {herdStats.breakdown.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelectHealthCategory(item.label)}
              className="w-full py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-4 hover:bg-[#F6F8F5] px-2 -mx-2 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span className="text-[13.5px] font-medium text-[#26352D] truncate">
                  {item.label}
                </span>
              </div>

              <div className="flex items-center gap-4 shrink-0 tabular-nums">
                <span className="text-[14px] font-semibold text-[#26352D]">
                  {item.count}
                </span>
                <span className="text-[12.5px] text-[#78857C] w-12 text-right">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
