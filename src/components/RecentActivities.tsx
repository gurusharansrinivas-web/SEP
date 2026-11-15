import React from 'react';
import {
  Boxes,
  CheckSquare,
  PlusCircle,
  Stethoscope,
  Syringe,
} from 'lucide-react';
import type { ActivityLog } from '../types/gaushala';

interface RecentActivitiesProps {
  activities: ActivityLog[];
}

function ActivityIcon({ type }: { type: ActivityLog['type'] }) {
  switch (type) {
    case 'cow':
      return (
        <div className="w-8 h-8 rounded-lg bg-[#EEF4EF] text-[#245C43] flex items-center justify-center shrink-0">
          <PlusCircle className="w-4 h-4" aria-hidden="true" />
        </div>
      );
    case 'medical':
      return (
        <div className="w-8 h-8 rounded-lg bg-[#FDF5E8] text-[#B97B18] flex items-center justify-center shrink-0">
          <Stethoscope className="w-4 h-4" aria-hidden="true" />
        </div>
      );
    case 'task':
      return (
        <div className="w-8 h-8 rounded-lg bg-[#EEF4EF] text-[#245C43] flex items-center justify-center shrink-0">
          <CheckSquare className="w-4 h-4" aria-hidden="true" />
        </div>
      );
    case 'inventory':
      return (
        <div className="w-8 h-8 rounded-lg bg-[#F2F5F2] text-[#4B5A51] flex items-center justify-center shrink-0">
          <Boxes className="w-4 h-4" aria-hidden="true" />
        </div>
      );
    case 'vaccination':
      return (
        <div className="w-8 h-8 rounded-lg bg-[#EEF4EF] text-[#245C43] flex items-center justify-center shrink-0">
          <Syringe className="w-4 h-4" aria-hidden="true" />
        </div>
      );
  }
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <section
      aria-labelledby="recent-activities-heading"
      className="bg-white border border-[#E2E8DF] rounded-xl p-6"
    >
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2
            id="recent-activities-heading"
            className="font-display text-[17px] font-semibold text-[#26352D]"
          >
            Recent Activities
          </h2>
          <p className="text-[12.5px] text-[#78857C] mt-0.5">
            Chronological log of sanctuary updates and staff actions
          </p>
        </div>
      </div>

      <ul className="divide-y divide-[#F0F3EE]">
        {activities.slice(0, 7).map((activity) => (
          <li
            key={activity.id}
            className="py-3 first:pt-0 last:pb-0 flex items-start gap-3"
          >
            <ActivityIcon type={activity.type} />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-medium text-[#26352D] leading-snug">
                {activity.description}
              </p>
              <div className="text-[12px] text-[#78857C] mt-1 flex flex-wrap items-center gap-1.5">
                <span>{activity.user}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{activity.timestamp}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
