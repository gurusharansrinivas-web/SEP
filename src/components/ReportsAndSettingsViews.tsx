import React from 'react';
import { Download, PhoneCall, ShieldCheck, X } from 'lucide-react';
import type { CowRecord } from '../types/gaushala';
import type { HerdStats, TaskStats } from '../utils/dashboardCalculations';

export function ReportsView({
  herdStats,
  taskStats,
  cows,
}: {
  herdStats: HerdStats;
  taskStats: TaskStats;
  cows: CowRecord[];
}) {
  const [exportMessage, setExportMessage] = React.useState('');

  const handleDownloadCsv = () => {
    const header = [
      'Tag ID',
      'Name',
      'Breed',
      'Category',
      'Age (Years)',
      'Weight (kg)',
      'Shed',
      'Health Status',
      'Last Check-up',
    ];
    const rows = cows.map((c) => [
      c.id,
      c.name,
      c.breed,
      c.gender,
      String(c.ageYears),
      String(c.weightKg),
      `"${c.shed}"`,
      c.healthStatus,
      c.lastCheckup,
    ]);
    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sri-krishna-gaushala-sample-herd.csv';
    link.click();
    URL.revokeObjectURL(url);
    setExportMessage('Sample herd CSV downloaded.');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#26352D]">
            Reports &amp; Analytics
          </h1>
          <p className="text-[13.5px] text-[#78857C] mt-0.5">
            Operational summaries compiled from current demonstration records
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadCsv}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#245C43] hover:bg-[#1D4B36] text-white text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4" />
          Export Herd CSV
        </button>
      </div>

      {exportMessage && (
        <div className="bg-[#EEF4EF] border border-[#D3E4D7] text-[#245C43] px-4 py-2.5 rounded-lg text-[13px] font-medium">
          {exportMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2E8DF] rounded-xl p-5">
          <div className="text-[12.5px] text-[#78857C]">Herd Wellness Rate</div>
          <div className="font-display text-3xl font-bold text-[#245C43] mt-1 tabular-nums">
            {herdStats.healthyPercentage}
          </div>
          <p className="text-[12.5px] text-[#4B5A51] mt-2">
            {herdStats.healthy} of {herdStats.total} registered animals in
            healthy condition.
          </p>
        </div>

        <div className="bg-white border border-[#E2E8DF] rounded-xl p-5">
          <div className="text-[12.5px] text-[#78857C]">
            Active Medical Cases
          </div>
          <div className="font-display text-3xl font-bold text-[#B97B18] mt-1 tabular-nums">
            {herdStats.medicalAttention}
          </div>
          <p className="text-[12.5px] text-[#4B5A51] mt-2">
            {herdStats.underTreatment} under treatment and {herdStats.critical}{' '}
            critical priority.
          </p>
        </div>

        <div className="bg-white border border-[#E2E8DF] rounded-xl p-5">
          <div className="text-[12.5px] text-[#78857C]">
            Daily Operations Completion
          </div>
          <div className="font-display text-3xl font-bold text-[#26352D] mt-1 tabular-nums">
            {taskStats.completionPercentage}%
          </div>
          <p className="text-[12.5px] text-[#4B5A51] mt-2">
            {taskStats.completed} of {taskStats.total} scheduled tasks
            completed today.
          </p>
        </div>
      </div>
    </div>
  );
}

export function SettingsView() {
  const [sanctuaryName, setSanctuaryName] = React.useState(
    'Sri Krishna Gaushala'
  );
  const [lowFodderAlertKg, setLowFodderAlertKg] = React.useState('350');
  const [dailyEmailDigest, setDailyEmailDigest] = React.useState(true);
  const [savedBanner, setSavedBanner] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#26352D]">
          Settings
        </h1>
        <p className="text-[13.5px] text-[#78857C] mt-0.5">
          Sanctuary administration preferences and future Firebase data sync
          readiness
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-white border border-[#E2E8DF] rounded-xl p-6 space-y-5"
      >
        <div>
          <label
            htmlFor="settings-org-name"
            className="block text-[13px] font-medium text-[#26352D] mb-1"
          >
            Gaushala Name
          </label>
          <input
            id="settings-org-name"
            type="text"
            value={sanctuaryName}
            onChange={(e) => setSanctuaryName(e.target.value)}
            className="w-full h-10 px-3 text-[13.5px] bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43]"
          />
        </div>

        <div>
          <label
            htmlFor="settings-fodder-threshold"
            className="block text-[13px] font-medium text-[#26352D] mb-1"
          >
            Low Dry Fodder Alert Threshold (kg)
          </label>
          <input
            id="settings-fodder-threshold"
            type="number"
            value={lowFodderAlertKg}
            onChange={(e) => setLowFodderAlertKg(e.target.value)}
            className="w-full sm:w-48 h-10 px-3 text-[13.5px] tabular-nums bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43]"
          />
        </div>

        <div className="flex items-center justify-between gap-4 pt-2 border-t border-[#F0F3EE]">
          <div>
            <div className="text-[13.5px] font-semibold text-[#26352D]">
              Evening Veterinary Summary
            </div>
            <div className="text-[12px] text-[#78857C]">
              Send daily medical and feeding checklist digest at 07:00 PM
            </div>
          </div>
          <input
            id="settings-digest-toggle"
            type="checkbox"
            checked={dailyEmailDigest}
            onChange={(e) => setDailyEmailDigest(e.target.checked)}
            aria-label="Enable evening veterinary summary"
            className="w-4 h-4 accent-[#245C43]"
          />
        </div>

        <div className="bg-[#F6F8F5] rounded-lg p-4 flex items-start gap-3">
          <ShieldCheck
            className="w-5 h-5 text-[#245C43] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="text-[12.5px] text-[#4B5A51]">
            <span className="font-semibold text-[#26352D]">
              Data Source: Local Demonstration State.
            </span>{' '}
            All state models are structured for direct collection binding when
            Firebase Firestore &amp; Authentication are connected in Phase 2.
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="text-[12.5px] font-medium text-[#245C43]">
            {savedBanner ? 'Preferences saved for this session.' : ''}
          </span>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#245C43] hover:bg-[#1D4B36] text-white text-[13px] font-semibold transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}

export function HelpSupportView() {
  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#26352D]">
          Help &amp; Support
        </h1>
        <p className="text-[13.5px] text-[#78857C] mt-0.5">
          Emergency veterinary escalation and daily caretaker protocols
        </p>
      </div>

      <div className="bg-white border border-[#E2E8DF] rounded-xl p-6 space-y-4">
        <h2 className="font-display text-[16px] font-semibold text-[#26352D]">
          Emergency Veterinary Escalation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
          <div className="p-4 rounded-lg bg-[#F6F8F5]">
            <div className="font-semibold text-[#26352D]">
              Dr. Raghavendra Rao (Chief Vet)
            </div>
            <div className="text-[#78857C] mt-0.5">
              Critical trauma &amp; isolation triage
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 font-semibold text-[#245C43] tabular-nums">
              <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
              +91 98450 21409
            </div>
          </div>
          <div className="p-4 rounded-lg bg-[#F6F8F5]">
            <div className="font-semibold text-[#26352D]">
              24/7 Rescue Ambulance Dispatch
            </div>
            <div className="text-[#78857C] mt-0.5">
              Highway &amp; rural intake coordination
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 font-semibold text-[#245C43] tabular-nums">
              <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
              +91 80 2644 9108
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#F0F3EE]">
          <h3 className="text-[14px] font-semibold text-[#26352D] mb-2">
            Standard Operating Guidelines
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-[13px] text-[#4B5A51]">
            <li>
              Every newly rescued cow must remain in Quarantine Bay for 72 hours
              prior to herd integration.
            </li>
            <li>
              Update feeding and water trough inspections immediately after each
              shift.
            </li>
            <li>
              Trigger veterinary reorder requests whenever medicine kits drop
              below 40 units.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ProfileModal({
  open,
  onClose,
  adminAvatarUrl,
}: {
  open: boolean;
  onClose: () => void;
  adminAvatarUrl: string;
}) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-profile-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#26352D]/40 backdrop-blur-[1px]"
    >
      <div className="w-full max-w-md bg-white border border-[#DCE4DA] rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDF1EB]">
          <h2
            id="admin-profile-title"
            className="font-display text-[17px] font-semibold text-[#26352D]"
          >
            Administrator Profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile dialog"
            className="p-1.5 rounded-lg text-[#78857C] hover:text-[#26352D] hover:bg-[#F6F8F5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <img
              src={adminAvatarUrl}
              alt="Arvind Kulkarni"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border border-[#DCE4DA]"
            />
            <div>
              <div className="font-display text-lg font-bold text-[#26352D]">
                Arvind Kulkarni
              </div>
              <div className="text-[13px] text-[#245C43] font-medium">
                Chief Sanctuary Administrator
              </div>
              <div className="text-[12px] text-[#78857C] mt-0.5">
                Sri Krishna Gaushala · Trust Operations
              </div>
            </div>
          </div>

          <dl className="divide-y divide-[#F0F3EE] text-[13px]">
            <div className="py-2.5 flex justify-between gap-2">
              <dt className="text-[#78857C]">Email</dt>
              <dd className="font-medium text-[#26352D]">
                admin@srikrishnagaushala.org
              </dd>
            </div>
            <div className="py-2.5 flex justify-between gap-2">
              <dt className="text-[#78857C]">Access Role</dt>
              <dd className="font-medium text-[#26352D]">
                Full Sanctuary Admin
              </dd>
            </div>
            <div className="py-2.5 flex justify-between gap-2">
              <dt className="text-[#78857C]">Primary Shift</dt>
              <dd className="font-medium text-[#26352D]">
                Morning &amp; Operations Oversight
              </dd>
            </div>
          </dl>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#245C43] hover:bg-[#1D4B36] text-white text-[13px] font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
