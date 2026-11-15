import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BASELINE_HERD_REMAINDER,
  BASELINE_TASK_OFFSET,
  INITIAL_COWS,
  INITIAL_HEALTHCARE_ALERTS,
  INITIAL_INVENTORY,
  INITIAL_TASKS,
} from '../data/sampleData';
import {
  computeHerdStats,
  computeTaskStats,
  deriveStockStatus,
  filterSearchResults,
  generateNextCowId,
  validateNewCowInput,
} from './dashboardCalculations';

test('initial herd stats match exact demonstration specification', () => {
  const stats = computeHerdStats(INITIAL_COWS, BASELINE_HERD_REMAINDER);
  assert.equal(stats.total, 248);
  assert.equal(stats.healthy, 221);
  assert.equal(stats.healthyPercentage, '89.1%');
  assert.equal(stats.underObservation, 15);
  assert.equal(stats.underTreatment, 9);
  assert.equal(stats.critical, 3);
  assert.equal(stats.medicalAttention, 12);
  assert.equal(stats.urgentCases, 3);
});

test('registering a cow updates herd statistics dynamically', () => {
  const updatedCows = [
    ...INITIAL_COWS,
    {
      id: 'SKG050',
      name: 'Kamdhenu',
      breed: 'Gir',
      ageYears: 4,
      gender: 'Cow' as const,
      shed: 'Shed A — Milking & Care',
      healthStatus: 'Healthy' as const,
      lastCheckup: '14 Nov',
      registrationDate: '14 Nov 2026',
      weightKg: 380,
      notes: 'Healthy intake',
      history: [],
    },
  ];
  const stats = computeHerdStats(updatedCows, BASELINE_HERD_REMAINDER);
  assert.equal(stats.total, 249);
  assert.equal(stats.healthy, 222);
});

test('initial task stats match exact Today Operations specification', () => {
  const taskStats = computeTaskStats(INITIAL_TASKS, BASELINE_TASK_OFFSET);
  assert.equal(taskStats.total, 32);
  assert.equal(taskStats.completed, 24);
  assert.equal(taskStats.inProgress, 5);
  assert.equal(taskStats.pending, 3);
  assert.equal(taskStats.completionPercentage, 75);
  assert.equal(taskStats.globalPendingTasks, 18);
  assert.equal(taskStats.dueToday, 7);
});

test('toggling a task to Completed updates progress and pending counts', () => {
  const updatedTasks = INITIAL_TASKS.map((t) =>
    t.id === 'task-4' ? { ...t, status: 'Completed' as const } : t
  );
  const taskStats = computeTaskStats(updatedTasks, BASELINE_TASK_OFFSET);
  assert.equal(taskStats.completed, 25);
  assert.equal(taskStats.inProgress, 4);
  assert.equal(taskStats.completionPercentage, 78);
  assert.equal(taskStats.globalPendingTasks, 17);
  assert.equal(taskStats.dueToday, 6);
});

test('deriveStockStatus returns Available, Low Stock, and Reorder Required accurately', () => {
  assert.equal(deriveStockStatus(450, 300, 150), 'Available');
  assert.equal(deriveStockStatus(280, 350, 150), 'Low Stock');
  assert.equal(deriveStockStatus(35, 60, 40), 'Reorder Required');
});

test('generateNextCowId increments highest SKG ID', () => {
  assert.equal(generateNextCowId(INITIAL_COWS), 'SKG050');
});

test('validateNewCowInput rejects empty fields and duplicate IDs', () => {
  const invalid = validateNewCowInput(
    {
      id: 'SKG014',
      name: '',
      breed: 'Gir',
      ageYears: 5,
      gender: 'Cow',
      shed: 'Shed A — Milking & Care',
      healthStatus: 'Healthy',
      weightKg: 350,
      notes: '',
    },
    INITIAL_COWS
  );
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.id);
});

test('filterSearchResults finds cows, medical alerts, tasks, and inventory', () => {
  const cowResults = filterSearchResults(
    'Lakshmi',
    INITIAL_COWS,
    INITIAL_HEALTHCARE_ALERTS,
    INITIAL_TASKS,
    INITIAL_INVENTORY
  );
  assert.ok(cowResults.some((r) => r.cowId === 'SKG014'));

  const fodderResults = filterSearchResults(
    'Green Fodder',
    INITIAL_COWS,
    INITIAL_HEALTHCARE_ALERTS,
    INITIAL_TASKS,
    INITIAL_INVENTORY
  );
  assert.ok(fodderResults.some((r) => r.kind === 'Inventory'));
});
