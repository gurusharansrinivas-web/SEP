import React from 'react';
import { CheckCircle2, Circle, Minus, Phone, Plus } from 'lucide-react';
import type {
  FeedingSchedule,
  InventoryItem,
  RescueRecord,
  StaffMember,
} from '../types/gaushala';
import { deriveStockStatus } from '../utils/dashboardCalculations';
import { StockStatusLabel } from './InventoryOverview';

export function FeedingView({
  schedules,
  onToggleFeeding,
}: {
  schedules: FeedingSchedule[];
  onToggleFeeding: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#26352D]">
          Feeding &amp; Nutrition
        </h1>
        <p className="text-[13.5px] text-[#78857C] mt-0.5">
          Daily ration plans across sheds, nursery, and recovery wards
        </p>
      </div>

      <div className="bg-white border border-[#E2E8DF] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8EDE6] bg-[#FAFBF9] text-[12px] font-semibold text-[#78857C]">
                <th className="py-3 px-5">Meal Slot</th>
                <th className="py-3 px-4">Shed / Group</th>
                <th className="py-3 px-4">Fodder &amp; Supplement Mix</th>
                <th className="py-3 px-4 text-right">Ration</th>
                <th className="py-3 px-4">Caretaker</th>
                <th className="py-3 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F3EE] text-[13.5px]">
              {schedules.map((item) => (
                <tr key={item.id} className="hover:bg-[#F6F8F5] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-[#26352D] whitespace-nowrap">
                    {item.mealSlot}{' '}
                    <span className="text-[12px] font-normal text-[#78857C] tabular-nums">
                      · {item.time}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#4B5A51]">{item.shed}</td>
                  <td className="py-3.5 px-4 text-[#26352D]">{item.fodderMix}</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-[#26352D] tabular-nums whitespace-nowrap">
                    {item.quantityKg} kg
                  </td>
                  <td className="py-3.5 px-4 text-[#4B5A51]">{item.caretaker}</td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onToggleFeeding(item.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[12px] font-semibold transition-colors ${
                        item.completed
                          ? 'bg-[#EEF4EF] text-[#245C43] border-[#D3E4D7]'
                          : 'bg-white text-[#5B675F] border-[#DCE4DA] hover:bg-[#F6F8F5]'
                      }`}
                    >
                      {item.completed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5" />
                          Mark Fed
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function InventoryView({
  items,
  onAdjustStock,
}: {
  items: InventoryItem[];
  onAdjustStock: (itemId: string, delta: number) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#26352D]">
          Inventory Management
        </h1>
        <p className="text-[13.5px] text-[#78857C] mt-0.5">
          Monitor green fodder, dry fodder, veterinary medicines, and care supplies
        </p>
      </div>

      <div className="bg-white border border-[#E2E8DF] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8EDE6] bg-[#FAFBF9] text-[12px] font-semibold text-[#78857C]">
                <th className="py-3 px-5">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Current Stock</th>
                <th className="py-3 px-4 text-right">Low Threshold</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Update Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F3EE] text-[13.5px]">
              {items.map((item) => {
                const status = deriveStockStatus(
                  item.quantity,
                  item.lowThreshold,
                  item.reorderThreshold
                );
                const step = item.unit === 'kg' ? 25 : 5;
                return (
                  <tr key={item.id} className="hover:bg-[#F6F8F5] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-[#26352D]">{item.name}</div>
                      <div className="text-[11.5px] text-[#78857C]">
                        Last updated {item.lastUpdated}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#4B5A51]">{item.category}</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-[#26352D] tabular-nums">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#78857C] tabular-nums">
                      {item.lowThreshold} {item.unit}
                    </td>
                    <td className="py-3.5 px-4">
                      <StockStatusLabel status={status} />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onAdjustStock(item.id, -step)}
                          aria-label={`Decrease ${item.name} by ${step} ${item.unit}`}
                          className="w-8 h-8 rounded-lg border border-[#DCE4DA] bg-white hover:bg-[#F6F8F5] flex items-center justify-center text-[#26352D]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onAdjustStock(item.id, step)}
                          aria-label={`Increase ${item.name} by ${step} ${item.unit}`}
                          className="w-8 h-8 rounded-lg border border-[#DCE4DA] bg-white hover:bg-[#F6F8F5] flex items-center justify-center text-[#26352D]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function StaffView({
  staff,
  onToggleDuty,
}: {
  staff: StaffMember[];
  onToggleDuty: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#26352D]">
          Staff Management
        </h1>
        <p className="text-[13.5px] text-[#78857C] mt-0.5">
          Veterinary team, caretakers, and daily shift responsibilities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {staff.map((member) => (
          <div
            key={member.id}
            className="bg-white border border-[#E2E8DF] rounded-xl p-5 flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-display text-[15.5px] font-semibold text-[#26352D]">
                    {member.name}
                  </h2>
                  <p className="text-[12.5px] text-[#245C43] font-medium">
                    {member.role}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleDuty(member.id)}
                  className={`px-2.5 py-1 rounded-md text-[11.5px] font-semibold border transition-colors ${
                    member.onDuty
                      ? 'bg-[#EEF4EF] text-[#245C43] border-[#D3E4D7]'
                      : 'bg-[#F3F5F2] text-[#78857C] border-[#DCE2DA]'
                  }`}
                >
                  {member.onDuty ? 'On Duty' : 'Off Shift'}
                </button>
              </div>

              <dl className="mt-4 space-y-2 text-[12.5px]">
                <div className="flex justify-between gap-2">
                  <dt className="text-[#78857C]">Shift</dt>
                  <dd className="text-[#26352D] font-medium text-right">
                    {member.shift}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#78857C]">Responsibility</dt>
                  <dd className="text-[#26352D] font-medium text-right">
                    {member.assignedShed}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="pt-3 border-t border-[#F0F3EE] flex items-center gap-2 text-[12.5px] text-[#4B5A51] tabular-nums">
              <Phone className="w-3.5 h-3.5 text-[#78857C]" aria-hidden="true" />
              <span>{member.phone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RescueView({
  rescues,
  onSelectCow,
}: {
  rescues: RescueRecord[];
  onSelectCow: (cowId: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#26352D]">
          Rescue Records
        </h1>
        <p className="text-[13.5px] text-[#78857C] mt-0.5">
          Intake documentation and veterinary triage for rescued cattle
        </p>
      </div>

      <div className="bg-white border border-[#E2E8DF] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8EDE6] bg-[#FAFBF9] text-[12px] font-semibold text-[#78857C]">
                <th className="py-3 px-5">Intake Date</th>
                <th className="py-3 px-4">Tag ID &amp; Name</th>
                <th className="py-3 px-4">Rescue Location</th>
                <th className="py-3 px-4">Condition at Intake</th>
                <th className="py-3 px-4">Reported By</th>
                <th className="py-3 px-5 text-right">Triage Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F3EE] text-[13.5px]">
              {rescues.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => onSelectCow(r.animalTagId)}
                  className="hover:bg-[#F6F8F5] transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-5 text-[#78857C] tabular-nums whitespace-nowrap">
                    {r.rescueDate}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#26352D] whitespace-nowrap">
                    <span className="font-mono-tabular text-[#245C43] mr-1.5">
                      {r.animalTagId}
                    </span>
                    {r.animalName}
                  </td>
                  <td className="py-3.5 px-4 text-[#4B5A51]">{r.location}</td>
                  <td className="py-3.5 px-4 text-[#26352D]">
                    {r.conditionAtIntake}
                  </td>
                  <td className="py-3.5 px-4 text-[#78857C]">{r.reportedBy}</td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-md text-[12px] font-semibold border ${
                        r.triageStatus === 'Cleared to Herd'
                          ? 'bg-[#EEF4EF] text-[#245C43] border-[#D3E4D7]'
                          : 'bg-[#FDF6E9] text-[#A2680B] border-[#F3DFB8]'
                      }`}
                    >
                      {r.triageStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
