import React from 'react';
import { Plus } from 'lucide-react';
import type { CowRecord, HealthcareAlert, Priority } from '../types/gaushala';
import { HealthcareAlerts } from './HealthcareAlerts';

interface HealthcareViewProps {
  alerts: HealthcareAlert[];
  cows: CowRecord[];
  onSelectCow: (cowId: string) => void;
  onAddAlert: (alert: Omit<HealthcareAlert, 'id'>) => void;
}

export function HealthcareView({
  alerts,
  cows,
  onSelectCow,
  onAddAlert,
}: HealthcareViewProps) {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [cowId, setCowId] = React.useState(cows[0]?.id ?? 'SKG001');
  const [condition, setCondition] = React.useState('');
  const [nextAction, setNextAction] = React.useState('');
  const [priority, setPriority] = React.useState<Priority>('Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!condition.trim() || !nextAction.trim()) return;
    const matchedCow = cows.find((c) => c.id === cowId);
    onAddAlert({
      cowId,
      cowName: matchedCow?.name ?? 'Sanctuary Cow',
      condition: condition.trim(),
      lastCheckup: '14 Nov',
      nextAction: nextAction.trim(),
      priority,
    });
    setCondition('');
    setNextAction('');
    setPriority('Medium');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#26352D]">
            Healthcare &amp; Veterinary Care
          </h1>
          <p className="text-[13.5px] text-[#78857C] mt-0.5">
            Active medical alerts, vaccination schedules, and clinical follow-ups
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm((prev) => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#245C43] hover:bg-[#1D4B36] text-white text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          Log Medical Alert
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#DCE4DA] rounded-xl p-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div>
            <label
              htmlFor="alert-cow-select"
              className="block text-[12px] font-medium text-[#26352D] mb-1"
            >
              Select Animal
            </label>
            <select
              id="alert-cow-select"
              value={cowId}
              onChange={(e) => setCowId(e.target.value)}
              className="w-full h-9 px-2.5 text-[13px] bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43]"
            >
              {cows.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} · {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="alert-condition-input"
              className="block text-[12px] font-medium text-[#26352D] mb-1"
            >
              Medical Condition
            </label>
            <input
              id="alert-condition-input"
              type="text"
              required
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g. Hoof Trimming Due"
              className="w-full h-9 px-3 text-[13px] bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43]"
            />
          </div>

          <div>
            <label
              htmlFor="alert-action-input"
              className="block text-[12px] font-medium text-[#26352D] mb-1"
            >
              Next Action
            </label>
            <input
              id="alert-action-input"
              type="text"
              required
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="e.g. Vet inspection tomorrow"
              className="w-full h-9 px-3 text-[13px] bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43]"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label
                htmlFor="alert-priority-select"
                className="block text-[12px] font-medium text-[#26352D] mb-1"
              >
                Priority
              </label>
              <select
                id="alert-priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full h-9 px-2.5 text-[13px] bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43]"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <button
              type="submit"
              className="h-9 px-4 rounded-lg bg-[#245C43] hover:bg-[#1D4B36] text-white text-[13px] font-semibold transition-colors shrink-0"
            >
              Add
            </button>
          </div>
        </form>
      )}

      <HealthcareAlerts
        alerts={alerts}
        onSelectCow={onSelectCow}
        onViewAllMedicalRecords={() => {}}
        showAll
      />
    </div>
  );
}
