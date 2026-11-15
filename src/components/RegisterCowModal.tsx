import React from 'react';
import { X } from 'lucide-react';
import type { CowRecord, HealthStatus, NewCowInput } from '../types/gaushala';
import {
  generateNextCowId,
  validateNewCowInput,
} from '../utils/dashboardCalculations';

interface RegisterCowModalProps {
  open: boolean;
  existingCows: CowRecord[];
  onClose: () => void;
  onSubmit: (newCow: NewCowInput) => void;
}

const BREED_OPTIONS = [
  'Gir',
  'Sahiwal',
  'Tharparkar',
  'Red Sindhi',
  'Kankrej',
  'Ongole',
  'Hallikar',
  'Malnad Gidda',
  'Kangayam',
  'Indigenous Mixed',
];

const SHED_OPTIONS = [
  'Shed A — Milking & Care',
  'Shed B — Young Herd',
  'Shed C — Bulls & Senior Herd',
  'Calf Nursery',
  'Medical Isolation Ward',
  'Medical Recovery Bay',
];

export function RegisterCowModal({
  open,
  existingCows,
  onClose,
  onSubmit,
}: RegisterCowModalProps) {
  const suggestedId = React.useMemo(
    () => generateNextCowId(existingCows),
    [existingCows]
  );

  const [id, setId] = React.useState(suggestedId);
  const [name, setName] = React.useState('');
  const [breed, setBreed] = React.useState('Gir');
  const [gender, setGender] = React.useState<'Cow' | 'Bull' | 'Calf'>('Cow');
  const [ageYears, setAgeYears] = React.useState('4');
  const [weightKg, setWeightKg] = React.useState('360');
  const [shed, setShed] = React.useState(SHED_OPTIONS[0]);
  const [healthStatus, setHealthStatus] =
    React.useState<HealthStatus>('Healthy');
  const [notes, setNotes] = React.useState('');
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof NewCowInput, string>>
  >({});

  React.useEffect(() => {
    if (open) {
      setId(suggestedId);
      setName('');
      setBreed('Gir');
      setGender('Cow');
      setAgeYears('4');
      setWeightKg('360');
      setShed(SHED_OPTIONS[0]);
      setHealthStatus('Healthy');
      setNotes('');
      setErrors({});
    }
  }, [open, suggestedId]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: NewCowInput = {
      id: id.trim().toUpperCase(),
      name: name.trim(),
      breed,
      gender,
      ageYears: Number(ageYears),
      weightKg: Number(weightKg),
      shed,
      healthStatus,
      notes: notes.trim(),
    };

    const result = validateNewCowInput(payload, existingCows);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    onSubmit(payload);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-cow-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#26352D]/40 backdrop-blur-[1px]"
    >
      <div className="w-full max-w-lg bg-white border border-[#DCE4DA] rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDF1EB]">
          <div>
            <h2
              id="register-cow-title"
              className="font-display text-[17px] font-semibold text-[#26352D]"
            >
              Register New Cow
            </h2>
            <p className="text-[12.5px] text-[#78857C]">
              Add an animal record to the Sri Krishna Gaushala registry
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close registration modal"
            className="p-1.5 rounded-lg text-[#78857C] hover:text-[#26352D] hover:bg-[#F6F8F5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="cow-tag-id"
                className="block text-[12.5px] font-medium text-[#26352D] mb-1"
              >
                Cow Tag ID
              </label>
              <input
                id="cow-tag-id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full h-9 px-3 text-[13.5px] font-mono-tabular bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43] focus:ring-2 focus:ring-[#245C43]/15"
              />
              {errors.id && (
                <p className="text-[11.5px] text-[#D95C55] mt-1">{errors.id}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="cow-name-input"
                className="block text-[12.5px] font-medium text-[#26352D] mb-1"
              >
                Cow Name <span className="text-[#D95C55]">*</span>
              </label>
              <input
                id="cow-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kamadhenu"
                className="w-full h-9 px-3 text-[13.5px] bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43] focus:ring-2 focus:ring-[#245C43]/15"
              />
              {errors.name && (
                <p className="text-[11.5px] text-[#D95C55] mt-1">{errors.name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="cow-breed-select"
                className="block text-[12.5px] font-medium text-[#26352D] mb-1"
              >
                Breed
              </label>
              <select
                id="cow-breed-select"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full h-9 px-2.5 text-[13.5px] bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43]"
              >
                {BREED_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="cow-gender-select"
                className="block text-[12.5px] font-medium text-[#26352D] mb-1"
              >
                Category
              </label>
              <select
                id="cow-gender-select"
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value as 'Cow' | 'Bull' | 'Calf')
                }
                className="w-full h-9 px-2.5 text-[13.5px] bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43]"
              >
                <option value="Cow">Cow</option>
                <option value="Bull">Bull</option>
                <option value="Calf">Calf</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="cow-age-input"
                className="block text-[12.5px] font-medium text-[#26352D] mb-1"
              >
                Age (Years)
              </label>
              <input
                id="cow-age-input"
                type="number"
                min={0}
                max={35}
                value={ageYears}
                onChange={(e) => setAgeYears(e.target.value)}
                className="w-full h-9 px-3 text-[13.5px] tabular-nums bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43]"
              />
              {errors.ageYears && (
                <p className="text-[11.5px] text-[#D95C55] mt-1">
                  {errors.ageYears}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="cow-shed-select"
                className="block text-[12.5px] font-medium text-[#26352D] mb-1"
              >
                Assigned Shed
              </label>
              <select
                id="cow-shed-select"
                value={shed}
                onChange={(e) => setShed(e.target.value)}
                className="w-full h-9 px-2.5 text-[13.5px] bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43]"
              >
                {SHED_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="cow-health-select"
                className="block text-[12.5px] font-medium text-[#26352D] mb-1"
              >
                Initial Health Status
              </label>
              <select
                id="cow-health-select"
                value={healthStatus}
                onChange={(e) =>
                  setHealthStatus(e.target.value as HealthStatus)
                }
                className="w-full h-9 px-2.5 text-[13.5px] bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43]"
              >
                <option value="Healthy">Healthy</option>
                <option value="Under Observation">Under Observation</option>
                <option value="Under Treatment">Under Treatment</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="cow-weight-input"
              className="block text-[12.5px] font-medium text-[#26352D] mb-1"
            >
              Weight (kg)
            </label>
            <input
              id="cow-weight-input"
              type="number"
              min={15}
              max={1200}
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full h-9 px-3 text-[13.5px] tabular-nums bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43]"
            />
            {errors.weightKg && (
              <p className="text-[11.5px] text-[#D95C55] mt-1">
                {errors.weightKg}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="cow-notes-input"
              className="block text-[12.5px] font-medium text-[#26352D] mb-1"
            >
              Care &amp; Intake Notes
            </label>
            <textarea
              id="cow-notes-input"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Diet observations, rescue origin, or initial veterinary remarks..."
              className="w-full p-3 text-[13.5px] bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43] focus:ring-2 focus:ring-[#245C43]/15"
            />
          </div>

          <div className="pt-3 border-t border-[#EDF1EB] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-[13px] font-medium text-[#4B5A51] border border-[#DCE4DA] hover:bg-[#F6F8F5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-[#245C43] hover:bg-[#1D4B36] transition-colors"
            >
              Save Cow Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
