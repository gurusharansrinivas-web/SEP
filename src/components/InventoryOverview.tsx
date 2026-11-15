import React from 'react';
import { AlertCircle, ArrowUpRight, CheckCircle2, Minus, Package, Plus } from 'lucide-react';
import type { InventoryItem, StockStatus } from '../types/gaushala';
import { deriveStockStatus } from '../utils/dashboardCalculations';

interface InventoryOverviewProps {
  items: InventoryItem[];
  onAdjustStock: (itemId: string, delta: number) => void;
  onManageInventory: () => void;
}

export function StockStatusLabel({ status }: { status: StockStatus }) {
  if (status === 'Available') {
    return (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#245C43]">
        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
        Available
      </span>
    );
  }
  if (status === 'Low Stock') {
    return (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#B97B18]">
        <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
        Low Stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#D95C55]">
      <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
      Reorder Required
    </span>
  );
}

export function InventoryOverview({
  items,
  onAdjustStock,
  onManageInventory,
}: InventoryOverviewProps) {
  const overviewItems = items.filter((item) => item.featuredOnOverview).slice(0, 3);

  return (
    <section
      aria-labelledby="inventory-overview-heading"
      className="bg-white border border-[#E2E8DF] rounded-xl p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h2
            id="inventory-overview-heading"
            className="font-display text-[17px] font-semibold text-[#26352D]"
          >
            Inventory Overview
          </h2>
          <p className="text-[12.5px] text-[#78857C] mt-0.5">
            Fodder reserves and essential veterinary supplies
          </p>
        </div>

        <button
          type="button"
          onClick={onManageInventory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold text-[#245C43] bg-[#EEF4EF] hover:bg-[#E1ECE3] transition-colors whitespace-nowrap shrink-0"
        >
          <span>Manage Inventory</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {overviewItems.map((item) => {
          const status = deriveStockStatus(
            item.quantity,
            item.lowThreshold,
            item.reorderThreshold
          );
          const step = item.unit === 'kg' ? 25 : 5;
          const borderClass =
            status === 'Reorder Required'
              ? 'border-[#F3CECC] bg-[#FFFDFC]'
              : status === 'Low Stock'
              ? 'border-[#F3DFB8] bg-[#FFFDF9]'
              : 'border-[#E6ECE3] bg-[#F9FBF9]';

          return (
            <div
              key={item.id}
              className={`rounded-xl border p-4 flex flex-col justify-between gap-3 ${borderClass}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold text-[#26352D] truncate">
                    {item.name}
                  </div>
                  <div className="text-[11.5px] text-[#78857C] mt-0.5">
                    {item.category} · Updated {item.lastUpdated}
                  </div>
                </div>
                <Package className="w-4 h-4 text-[#78857C] shrink-0 mt-0.5" aria-hidden="true" />
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <div className="font-display text-[22px] font-bold text-[#26352D] tabular-nums">
                  {item.quantity}{' '}
                  <span className="text-[13px] font-medium text-[#78857C]">
                    {item.unit}
                  </span>
                </div>
                <StockStatusLabel status={status} />
              </div>

              <div className="pt-2.5 border-t border-[#E6ECE3]/80 flex items-center justify-between gap-2">
                <span className="text-[11.5px] text-[#78857C]">Quick adjust</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onAdjustStock(item.id, -step)}
                    aria-label={`Decrease ${item.name} by ${step} ${item.unit}`}
                    className="w-7 h-7 rounded-md border border-[#DCE4DA] bg-white hover:bg-[#F6F8F5] flex items-center justify-center text-[#26352D] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onAdjustStock(item.id, step)}
                    aria-label={`Increase ${item.name} by ${step} ${item.unit}`}
                    className="w-7 h-7 rounded-md border border-[#DCE4DA] bg-white hover:bg-[#F6F8F5] flex items-center justify-center text-[#26352D] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
