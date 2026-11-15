import React from 'react';
import { Calendar, MapPin, Stethoscope, X } from 'lucide-react';
import type { CowRecord, HealthStatus } from '../types/gaushala';

interface CowDetailDrawerProps {
  cow: CowRecord | null;
  onClose: () => void;
  onUpdateCowHealth: (
    cowId: string,
    newStatus: HealthStatus,
    note: string
  ) => void;
}

export function HealthStatusLabel({ status }: { status: HealthStatus }) {
  const styles: Record<HealthStatus, string> = {
    Healthy: 'bg-[#EEF4EF] text-[#245C43] border-[#D3E4D7]',
    'Under Observation': 'bg-[#F3F6F3] text-[#4A6852] border-[#D8E2D8]',
    'Under Treatment': 'bg-[#FDF6E9] text-[#A2680B] border-[#F3DFB8]',
    Critical: 'bg-[#FDF1F0] text-[#B93832] border-[#F5D0CD]',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[12px] font-semibold border ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export function CowDetailDrawer({
  cow,
  onClose,
  onUpdateCowHealth,
}: CowDetailDrawerProps) {
  const [selectedStatus, setSelectedStatus] = React.useState<HealthStatus>(
    cow?.healthStatus ?? 'Healthy'
  );
  const [checkupNote, setCheckupNote] = React.useState('');

  React.useEffect(() => {
    if (cow) {
      setSelectedStatus(cow.healthStatus);
      setCheckupNote('');
    }
  }, [cow]);

  if (!cow) return null;

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCowHealth(
      cow.id,
      selectedStatus,
      checkupNote.trim() || `Health status updated to ${selectedStatus}.`
    );
    setCheckupNote('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cow-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-[#26352D]/35 backdrop-blur-[1px]"
    >
      <div className="w-full max-w-md bg-white h-full border-l border-[#DCE4DA] shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EDF1EB] flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-tabular text-[12.5px] font-semibold text-[#245C43]">
                {cow.id}
              </span>
              <span aria-hidden="true" className="text-[#78857C]">
                ·
              </span>
              <span className="text-[12.5px] text-[#78857C]">{cow.breed}</span>
            </div>
            <h2
              id="cow-drawer-title"
              className="font-display text-xl font-bold text-[#26352D] mt-0.5"
            >
              {cow.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close animal details"
            className="p-1.5 rounded-lg text-[#78857C] hover:text-[#26352D] hover:bg-[#F6F8F5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status + Specs */}
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#F0F3EE]">
            <HealthStatusLabel status={cow.healthStatus} />
            <span className="text-[12.5px] text-[#78857C] tabular-nums">
              Last check-up: {cow.lastCheckup}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-[13px]">
            <div>
              <dt className="text-[#78857C] text-[12px]">Category &amp; Age</dt>
              <dd className="font-semibold text-[#26352D] mt-0.5 tabular-nums">
                {cow.gender} · {cow.ageYears} years
              </dd>
            </div>
            <div>
              <dt className="text-[#78857C] text-[12px]">Body Weight</dt>
              <dd className="font-semibold text-[#26352D] mt-0.5 tabular-nums">
                {cow.weightKg} kg
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[#78857C] text-[12px] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                Assigned Shed
              </dt>
              <dd className="font-semibold text-[#26352D] mt-0.5">
                {cow.shed}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[#78857C] text-[12px] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                Registered Since
              </dt>
              <dd className="font-medium text-[#26352D] mt-0.5 tabular-nums">
                {cow.registrationDate}
              </dd>
            </div>
          </dl>

          <div>
            <h3 className="text-[13px] font-semibold text-[#26352D] mb-1.5">
              Care Notes
            </h3>
            <p className="text-[13px] text-[#4B5A51] bg-[#F6F8F5] rounded-lg p-3.5 leading-relaxed">
              {cow.notes || 'No special care remarks recorded.'}
            </p>
          </div>

          {/* Update Health Form */}
          <form
            onSubmit={handleSaveUpdate}
            className="pt-4 border-t border-[#EDF1EB] space-y-3"
          >
            <h3 className="text-[13.5px] font-semibold text-[#26352D] flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-[#245C43]" aria-hidden="true" />
              Log Check-up / Update Status
            </h3>

            <div>
              <label
                htmlFor="drawer-health-status"
                className="block text-[12px] font-medium text-[#78857C] mb-1"
              >
                Health Status
              </label>
              <select
                id="drawer-health-status"
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as HealthStatus)
                }
                className="w-full h-9 px-3 text-[13.5px] bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43]"
              >
                <option value="Healthy">Healthy</option>
                <option value="Under Observation">Under Observation</option>
                <option value="Under Treatment">Under Treatment</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="drawer-checkup-note"
                className="block text-[12px] font-medium text-[#78857C] mb-1"
              >
                Veterinary Observation Note
              </label>
              <textarea
                id="drawer-checkup-note"
                rows={2}
                value={checkupNote}
                onChange={(e) => setCheckupNote(e.target.value)}
                placeholder="Enter treatment administered or recovery progress..."
                className="w-full p-2.5 text-[13px] bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg bg-[#245C43] hover:bg-[#1D4B36] text-white text-[13px] font-semibold transition-colors"
            >
              Update Medical Record
            </button>
          </form>

          {/* Medical History */}
          <div className="pt-4 border-t border-[#EDF1EB]">
            <h3 className="text-[13.5px] font-semibold text-[#26352D] mb-3">
              Medical History
            </h3>
            {cow.history.length > 0 ? (
              <ul className="space-y-3">
                {cow.history.map((entry) => (
                  <li
                    key={entry.id}
                    className="text-[12.5px] pb-3 border-b border-[#F0F3EE] last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between gap-2 font-medium text-[#26352D]">
                      <span>{entry.veterinarian}</span>
                      <span className="text-[11.5px] text-[#78857C] tabular-nums">
                        {entry.date}
                      </span>
                    </div>
                    <p className="text-[#4B5A51] mt-1">{entry.note}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12.5px] text-[#78857C]">
                No prior medical incidents recorded.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
