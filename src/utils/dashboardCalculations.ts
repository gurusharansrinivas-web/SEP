import type {
  BaselineCounts,
  CowRecord,
  HealthcareAlert,
  InventoryItem,
  NewCowInput,
  OperationTask,
  StockStatus,
  TaskBaselineOffset,
} from '../types/gaushala';

export interface HerdStats {
  total: number;
  healthy: number;
  healthyPercentage: string;
  underObservation: number;
  underTreatment: number;
  critical: number;
  medicalAttention: number;
  urgentCases: number;
  breakdown: {
    label: 'Healthy' | 'Under Observation' | 'Under Treatment' | 'Critical';
    count: number;
    percentage: number;
    color: string;
  }[];
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  completionPercentage: number;
  globalPendingTasks: number;
  dueToday: number;
}

export interface SearchResultItem {
  id: string;
  kind: 'Cow' | 'Medical Alert' | 'Task' | 'Inventory';
  title: string;
  subtitle: string;
  targetSection: 'cows' | 'healthcare' | 'dashboard' | 'inventory';
  cowId?: string;
}

export function computeHerdStats(
  cows: CowRecord[],
  baselineRemainder: BaselineCounts
): HerdStats {
  const counts: BaselineCounts = {
    Healthy: baselineRemainder.Healthy,
    'Under Observation': baselineRemainder['Under Observation'],
    'Under Treatment': baselineRemainder['Under Treatment'],
    Critical: baselineRemainder.Critical,
  };

  for (const cow of cows) {
    counts[cow.healthStatus] += 1;
  }

  const total =
    counts.Healthy +
    counts['Under Observation'] +
    counts['Under Treatment'] +
    counts.Critical;

  const safeTotal = total > 0 ? total : 1;
  const healthyPctNum = (counts.Healthy / safeTotal) * 100;
  const healthyPercentage = `${healthyPctNum.toFixed(1)}%`;

  const breakdown = [
    {
      label: 'Healthy' as const,
      count: counts.Healthy,
      percentage: Number(((counts.Healthy / safeTotal) * 100).toFixed(1)),
      color: '#245C43',
    },
    {
      label: 'Under Observation' as const,
      count: counts['Under Observation'],
      percentage: Number(
        ((counts['Under Observation'] / safeTotal) * 100).toFixed(1)
      ),
      color: '#8FAF91',
    },
    {
      label: 'Under Treatment' as const,
      count: counts['Under Treatment'],
      percentage: Number(
        ((counts['Under Treatment'] / safeTotal) * 100).toFixed(1)
      ),
      color: '#E5A33D',
    },
    {
      label: 'Critical' as const,
      count: counts.Critical,
      percentage: Number(((counts.Critical / safeTotal) * 100).toFixed(1)),
      color: '#D95C55',
    },
  ];

  return {
    total,
    healthy: counts.Healthy,
    healthyPercentage,
    underObservation: counts['Under Observation'],
    underTreatment: counts['Under Treatment'],
    critical: counts.Critical,
    medicalAttention: counts['Under Treatment'] + counts.Critical,
    urgentCases: counts.Critical,
    breakdown,
  };
}

export function computeTaskStats(
  tasks: OperationTask[],
  baselineOffset: TaskBaselineOffset
): TaskStats {
  let completed = baselineOffset.Completed;
  let inProgress = baselineOffset['In Progress'];
  let pending = baselineOffset.Pending;

  for (const task of tasks) {
    if (task.status === 'Completed') completed += 1;
    else if (task.status === 'In Progress') inProgress += 1;
    else pending += 1;
  }

  const total = completed + inProgress + pending;
  const completionPercentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  // Sanctuary-wide pending tasks include backlog (10) plus active today's non-completed items
  const activeToday = inProgress + pending;
  const globalPendingTasks = 10 + activeToday;
  const dueToday = Math.max(0, activeToday - 1);

  return {
    total,
    completed,
    inProgress,
    pending,
    completionPercentage,
    globalPendingTasks,
    dueToday,
  };
}

export function deriveStockStatus(
  quantity: number,
  lowThreshold: number,
  reorderThreshold: number
): StockStatus {
  if (quantity <= reorderThreshold) {
    return 'Reorder Required';
  }
  if (quantity <= lowThreshold) {
    return 'Low Stock';
  }
  return 'Available';
}

export function generateNextCowId(cows: CowRecord[]): string {
  let maxNum = 49;
  for (const cow of cows) {
    const match = cow.id.match(/^SKG(\d+)$/i);
    if (match) {
      const parsed = Number.parseInt(match[1], 10);
      if (!Number.isNaN(parsed) && parsed > maxNum) {
        maxNum = parsed;
      }
    }
  }
  const next = maxNum + 1;
  return `SKG${String(next).padStart(3, '0')}`;
}

export function validateNewCowInput(
  input: NewCowInput,
  existingCows: CowRecord[]
): { valid: boolean; errors: Partial<Record<keyof NewCowInput, string>> } {
  const errors: Partial<Record<keyof NewCowInput, string>> = {};

  if (!input.name.trim()) {
    errors.name = 'Cow name is required.';
  }
  if (!input.breed.trim()) {
    errors.breed = 'Breed is required.';
  }
  if (!input.shed.trim()) {
    errors.shed = 'Assigned shed is required.';
  }
  if (Number.isNaN(input.ageYears) || input.ageYears < 0 || input.ageYears > 35) {
    errors.ageYears = 'Enter a valid age between 0 and 35 years.';
  }
  if (Number.isNaN(input.weightKg) || input.weightKg < 15 || input.weightKg > 1200) {
    errors.weightKg = 'Enter a valid weight between 15 and 1200 kg.';
  }
  if (input.id) {
    const normalized = input.id.trim().toUpperCase();
    if (!/^SKG\d{3,}$/.test(normalized)) {
      errors.id = 'Tag ID must follow format SKG050.';
    } else if (existingCows.some((c) => c.id.toUpperCase() === normalized)) {
      errors.id = `Tag ID ${normalized} is already registered.`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function filterSearchResults(
  query: string,
  cows: CowRecord[],
  alerts: HealthcareAlert[],
  tasks: OperationTask[],
  inventory: InventoryItem[]
): SearchResultItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResultItem[] = [];

  for (const cow of cows) {
    if (
      cow.id.toLowerCase().includes(q) ||
      cow.name.toLowerCase().includes(q) ||
      cow.breed.toLowerCase().includes(q) ||
      cow.shed.toLowerCase().includes(q)
    ) {
      results.push({
        id: `cow-${cow.id}`,
        kind: 'Cow',
        title: `${cow.id} · ${cow.name}`,
        subtitle: `${cow.breed} · ${cow.healthStatus} · ${cow.shed}`,
        targetSection: 'cows',
        cowId: cow.id,
      });
    }
  }

  for (const alert of alerts) {
    if (
      alert.cowId.toLowerCase().includes(q) ||
      alert.cowName.toLowerCase().includes(q) ||
      alert.condition.toLowerCase().includes(q) ||
      alert.nextAction.toLowerCase().includes(q)
    ) {
      results.push({
        id: `alert-${alert.id}`,
        kind: 'Medical Alert',
        title: `${alert.cowId} · ${alert.cowName} (${alert.condition})`,
        subtitle: `${alert.priority} Priority · ${alert.nextAction}`,
        targetSection: 'healthcare',
        cowId: alert.cowId,
      });
    }
  }

  for (const task of tasks) {
    if (
      task.title.toLowerCase().includes(q) ||
      task.assignedTo.toLowerCase().includes(q) ||
      task.shedOrArea.toLowerCase().includes(q)
    ) {
      results.push({
        id: `task-${task.id}`,
        kind: 'Task',
        title: task.title,
        subtitle: `${task.status} · ${task.scheduledTime} · ${task.assignedTo}`,
        targetSection: 'dashboard',
      });
    }
  }

  for (const item of inventory) {
    if (
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    ) {
      results.push({
        id: `inv-${item.id}`,
        kind: 'Inventory',
        title: item.name,
        subtitle: `${item.quantity} ${item.unit} · ${deriveStockStatus(
          item.quantity,
          item.lowThreshold,
          item.reorderThreshold
        )}`,
        targetSection: 'inventory',
      });
    }
  }

  return results.slice(0, 8);
}
