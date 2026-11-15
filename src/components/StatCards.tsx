import React from 'react';
import { ClipboardList, HeartPulse, Stethoscope } from 'lucide-react';
import type { HerdStats, TaskStats } from '../utils/dashboardCalculations';
import { CowLineIcon } from './Icons';

interface StatCardsProps {
  herdStats: HerdStats;
  taskStats: TaskStats;
  onNavigateCows: () => void;
  onNavigateHealthcare: () => void;
  onScrollToOperations: () => void;
}

export function StatCards({
  herdStats,
  taskStats,
  onNavigateCows,
  onNavigateHealthcare,
  onScrollToOperations,
}: StatCardsProps) {
  return (
    <section aria-label="Key Sanctuary Statistics">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Cows */}
        <button
          type="button"
          onClick={onNavigateCows}
          className="text-left bg-white border border-[#E2E8DF] rounded-xl p-5 hover:border-[#8FAF91] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245C43] flex flex-col justify-between h-full"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-medium text-[#78857C]">Total Cows</p>
                <p className="font-display text-[30px] font-bold text-[#26352D] tracking-tight mt-1 tabular-nums leading-none">
                  {herdStats.total}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#EEF4EF] text-[#245C43] flex items-center justify-center shrink-0">
                <CowLineIcon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[12.5px] text-[#78857C] mt-2">
              Total registered animals
            </p>
          </div>
          <div className="mt-3.5 pt-3 border-t border-[#F0F3EE] text-[12px] font-semibold text-[#245C43] whitespace-nowrap tabular-nums">
            +{8 + (herdStats.total - 248)} this month
          </div>
        </button>

        {/* Card 2: Healthy Cows */}
        <button
          type="button"
          onClick={onNavigateCows}
          className="text-left bg-white border border-[#E2E8DF] rounded-xl p-5 hover:border-[#8FAF91] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245C43] flex flex-col justify-between h-full"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-medium text-[#78857C]">Healthy Cows</p>
                <p className="font-display text-[30px] font-bold text-[#26352D] tracking-tight mt-1 tabular-nums leading-none">
                  {herdStats.healthy}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#EEF4EF] text-[#245C43] flex items-center justify-center shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[12.5px] text-[#78857C] mt-2">
              Currently marked healthy
            </p>
          </div>
          <div className="mt-3.5 pt-3 border-t border-[#F0F3EE] text-[12px] font-semibold text-[#245C43] whitespace-nowrap tabular-nums">
            {herdStats.healthyPercentage} of registered cows
          </div>
        </button>

        {/* Card 3: Medical Attention */}
        <button
          type="button"
          onClick={onNavigateHealthcare}
          className="text-left bg-white border border-[#E2E8DF] rounded-xl p-5 hover:border-[#E5A33D] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245C43] flex flex-col justify-between h-full"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-medium text-[#78857C]">
                  Medical Attention
                </p>
                <p className="font-display text-[30px] font-bold text-[#26352D] tracking-tight mt-1 tabular-nums leading-none">
                  {herdStats.medicalAttention}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#FDF5E8] text-[#B97B18] flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[12.5px] text-[#78857C] mt-2">
              Cows requiring attention
            </p>
          </div>
          <div className="mt-3.5 pt-3 border-t border-[#F0F3EE] text-[12px] font-semibold text-[#D95C55] whitespace-nowrap tabular-nums">
            {herdStats.urgentCases} urgent cases
          </div>
        </button>

        {/* Card 4: Pending Tasks */}
        <button
          type="button"
          onClick={onScrollToOperations}
          className="text-left bg-white border border-[#E2E8DF] rounded-xl p-5 hover:border-[#E5A33D] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245C43] flex flex-col justify-between h-full"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-medium text-[#78857C]">
                  Pending Tasks
                </p>
                <p className="font-display text-[30px] font-bold text-[#26352D] tracking-tight mt-1 tabular-nums leading-none">
                  {taskStats.globalPendingTasks}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#FDF5E8] text-[#B97B18] flex items-center justify-center shrink-0">
                <ClipboardList className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[12.5px] text-[#78857C] mt-2">
              Tasks awaiting completion
            </p>
          </div>
          <div className="mt-3.5 pt-3 border-t border-[#F0F3EE] text-[12px] font-semibold text-[#B97B18] whitespace-nowrap tabular-nums">
            {taskStats.dueToday} due today
          </div>
        </button>
      </div>
    </section>
  );
}
