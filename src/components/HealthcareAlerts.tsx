import React from 'react';
import { ArrowUpRight, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import type { HealthcareAlert, Priority } from '../types/gaushala';

interface HealthcareAlertsProps {
  alerts: HealthcareAlert[];
  onSelectCow: (cowId: string) => void;
  onViewAllMedicalRecords: () => void;
  showAll?: boolean;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority === 'High') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11.5px] font-semibold bg-[#FDF1F0] text-[#B93832] border border-[#F5D0CD]">
        <AlertTriangle className="w-3 h-3" aria-hidden="true" />
        High
      </span>
    );
  }
  if (priority === 'Medium') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11.5px] font-semibold bg-[#FDF6E9] text-[#A2680B] border border-[#F3DFB8]">
        <Clock className="w-3 h-3" aria-hidden="true" />
        Medium
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11.5px] font-semibold bg-[#F3F5F2] text-[#5B675F] border border-[#DCE2DA]">
      <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
      Low
    </span>
  );
}

export function HealthcareAlerts({
  alerts,
  onSelectCow,
  onViewAllMedicalRecords,
  showAll = false,
}: HealthcareAlertsProps) {
  const visibleAlerts = showAll ? alerts : alerts.slice(0, 4);

  return (
    <section
      aria-labelledby="healthcare-alerts-heading"
      className="bg-white border border-[#E2E8DF] rounded-xl p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h2
            id="healthcare-alerts-heading"
            className="font-display text-[17px] font-semibold text-[#26352D]"
          >
            Healthcare &amp; Medical Alerts
          </h2>
          <p className="text-[12.5px] text-[#78857C] mt-0.5">
            Click any animal record to inspect veterinary history
          </p>
        </div>

        {!showAll && (
          <button
            type="button"
            onClick={onViewAllMedicalRecords}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold text-[#245C43] bg-[#EEF4EF] hover:bg-[#E1ECE3] transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <span>View All Medical Records</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Desktop & Tablet Table */}
      <div className="hidden sm:block overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E8EDE6] text-[12px] font-semibold text-[#78857C]">
              <th className="py-2.5 pr-3">Cow ID</th>
              <th className="py-2.5 px-3">Cow Name</th>
              <th className="py-2.5 px-3">Medical Condition</th>
              <th className="py-2.5 px-3">Last Check-up</th>
              <th className="py-2.5 px-3">Next Action</th>
              <th className="py-2.5 pl-3 text-right">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F3EE] text-[13.5px]">
            {visibleAlerts.map((alert) => (
              <tr
                key={alert.id}
                onClick={() => onSelectCow(alert.cowId)}
                className="hover:bg-[#F6F8F5] transition-colors cursor-pointer group"
              >
                <td className="py-3 pr-3 font-mono-tabular text-[12.5px] font-medium text-[#245C43] whitespace-nowrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCow(alert.cowId);
                    }}
                    className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245C43] rounded"
                  >
                    {alert.cowId}
                  </button>
                </td>
                <td className="py-3 px-3 font-semibold text-[#26352D] whitespace-nowrap">
                  {alert.cowName}
                </td>
                <td className="py-3 px-3 text-[#26352D]">{alert.condition}</td>
                <td className="py-3 px-3 text-[#78857C] whitespace-nowrap tabular-nums">
                  {alert.lastCheckup}
                </td>
                <td className="py-3 px-3 text-[#4B5A51]">{alert.nextAction}</td>
                <td className="py-3 pl-3 text-right whitespace-nowrap">
                  <PriorityBadge priority={alert.priority} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Friendly Record Cards */}
      <div className="sm:hidden divide-y divide-[#F0F3EE]">
        {visibleAlerts.map((alert) => (
          <button
            key={alert.id}
            type="button"
            onClick={() => onSelectCow(alert.cowId)}
            className="w-full py-3.5 text-left flex flex-col gap-1.5 hover:bg-[#F6F8F5] transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono-tabular text-[12px] font-semibold text-[#245C43]">
                  {alert.cowId}
                </span>
                <span className="text-[14px] font-semibold text-[#26352D]">
                  {alert.cowName}
                </span>
              </div>
              <PriorityBadge priority={alert.priority} />
            </div>
            <div className="text-[13px] text-[#26352D]">{alert.condition}</div>
            <div className="text-[12px] text-[#78857C] flex items-center gap-1.5">
              <span>{alert.nextAction}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">Checked {alert.lastCheckup}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
