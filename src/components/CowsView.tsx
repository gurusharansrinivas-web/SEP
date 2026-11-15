import React from 'react';
import { Plus, Search } from 'lucide-react';
import type { CowRecord, HealthStatus } from '../types/gaushala';
import { HealthStatusLabel } from './CowDetailDrawer';

interface CowsViewProps {
  cows: CowRecord[];
  initialHealthFilter: HealthStatus | 'All';
  onFilterChange: (filter: HealthStatus | 'All') => void;
  onSelectCow: (cowId: string) => void;
  onOpenRegisterModal: () => void;
}

const FILTER_OPTIONS: (HealthStatus | 'All')[] = [
  'All',
  'Healthy',
  'Under Observation',
  'Under Treatment',
  'Critical',
];

export function CowsView({
  cows,
  initialHealthFilter,
  onFilterChange,
  onSelectCow,
  onOpenRegisterModal,
}: CowsViewProps) {
  const [localSearch, setLocalSearch] = React.useState('');

  const filteredCows = React.useMemo(() => {
    const q = localSearch.trim().toLowerCase();
    return cows.filter((cow) => {
      const matchesStatus =
        initialHealthFilter === 'All' ||
        cow.healthStatus === initialHealthFilter;
      const matchesQuery =
        !q ||
        cow.id.toLowerCase().includes(q) ||
        cow.name.toLowerCase().includes(q) ||
        cow.breed.toLowerCase().includes(q) ||
        cow.shed.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [cows, initialHealthFilter, localSearch]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#26352D]">
            Cow Management
          </h1>
          <p className="text-[13.5px] text-[#78857C] mt-0.5">
            Detailed animal registry · Showing {filteredCows.length} of{' '}
            {cows.length} detailed sample records (248 total herd)
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenRegisterModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#245C43] hover:bg-[#1D4B36] text-white text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          Register New Cow
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-[#E2E8DF] rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Filter cows by health status"
          className="flex flex-wrap items-center gap-1 p-1 bg-[#F6F8F5] rounded-lg"
        >
          {FILTER_OPTIONS.map((status) => {
            const active = initialHealthFilter === status;
            return (
              <button
                key={status}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onFilterChange(status)}
                className={`px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-white text-[#245C43] font-semibold shadow-xs border border-[#E2E8DF]'
                    : 'text-[#5B675F] hover:text-[#26352D]'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <label htmlFor="cow-registry-search" className="sr-only">
            Filter cow registry
          </label>
          <Search className="w-4 h-4 text-[#78857C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="cow-registry-search"
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Filter by ID, name, breed or shed..."
            className="w-full h-9 pl-9 pr-3 text-[13px] bg-[#F6F8F5] border border-[#DCE4DA] rounded-lg focus:outline-none focus:bg-white focus:border-[#245C43]"
          />
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white border border-[#E2E8DF] rounded-xl overflow-hidden">
        {filteredCows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8EDE6] bg-[#FAFBF9] text-[12px] font-semibold text-[#78857C]">
                  <th className="py-3 px-5">Tag ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Breed &amp; Type</th>
                  <th className="py-3 px-4">Assigned Shed</th>
                  <th className="py-3 px-4">Age / Weight</th>
                  <th className="py-3 px-4">Last Check-up</th>
                  <th className="py-3 px-5 text-right">Health Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F3EE] text-[13.5px]">
                {filteredCows.map((cow) => (
                  <tr
                    key={cow.id}
                    onClick={() => onSelectCow(cow.id)}
                    className="hover:bg-[#F6F8F5] transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-5 font-mono-tabular text-[12.5px] font-semibold text-[#245C43]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCow(cow.id);
                        }}
                        className="hover:underline"
                      >
                        {cow.id}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#26352D]">
                      {cow.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#4B5A51]">
                      {cow.breed} · {cow.gender}
                    </td>
                    <td className="py-3.5 px-4 text-[#4B5A51]">{cow.shed}</td>
                    <td className="py-3.5 px-4 text-[#78857C] tabular-nums">
                      {cow.ageYears} yrs · {cow.weightKg} kg
                    </td>
                    <td className="py-3.5 px-4 text-[#78857C] tabular-nums">
                      {cow.lastCheckup}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <HealthStatusLabel status={cow.healthStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <p className="text-[14px] font-semibold text-[#26352D]">
              No matching cows found
            </p>
            <p className="text-[13px] text-[#78857C] mt-1">
              Adjust your search filter or register a new animal record.
            </p>
            <button
              type="button"
              onClick={() => {
                setLocalSearch('');
                onFilterChange('All');
              }}
              className="mt-4 px-4 py-2 rounded-lg text-[13px] font-semibold text-[#245C43] bg-[#EEF4EF] hover:bg-[#E1ECE3]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
