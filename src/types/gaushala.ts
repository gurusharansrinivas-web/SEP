export type HealthStatus =
  | 'Healthy'
  | 'Under Observation'
  | 'Under Treatment'
  | 'Critical';

export type Priority = 'High' | 'Medium' | 'Low';

export type TaskStatus = 'Completed' | 'In Progress' | 'Pending';

export type StockStatus = 'Available' | 'Low Stock' | 'Reorder Required';

export type NavSection =
  | 'dashboard'
  | 'cows'
  | 'healthcare'
  | 'feeding'
  | 'inventory'
  | 'staff'
  | 'rescue'
  | 'reports'
  | 'settings'
  | 'help';

export interface MedicalHistoryEntry {
  id: string;
  date: string;
  note: string;
  veterinarian: string;
  statusAfter: HealthStatus;
}

export interface CowRecord {
  id: string;
  name: string;
  breed: string;
  ageYears: number;
  gender: 'Cow' | 'Bull' | 'Calf';
  shed: string;
  healthStatus: HealthStatus;
  lastCheckup: string;
  registrationDate: string;
  weightKg: number;
  notes: string;
  history: MedicalHistoryEntry[];
}

export interface HealthcareAlert {
  id: string;
  cowId: string;
  cowName: string;
  condition: string;
  lastCheckup: string;
  nextAction: string;
  priority: Priority;
  resolved?: boolean;
}

export interface OperationTask {
  id: string;
  title: string;
  shedOrArea: string;
  assignedTo: string;
  scheduledTime: string;
  status: TaskStatus;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Fodder' | 'Medicine' | 'Supplements' | 'Supplies';
  quantity: number;
  unit: string;
  lowThreshold: number;
  reorderThreshold: number;
  lastUpdated: string;
  featuredOnOverview?: boolean;
}

export interface ActivityLog {
  id: string;
  type: 'cow' | 'medical' | 'task' | 'inventory' | 'vaccination';
  description: string;
  user: string;
  timestamp: string;
}

export interface FeedingSchedule {
  id: string;
  shed: string;
  mealSlot: 'Morning' | 'Afternoon' | 'Evening';
  fodderMix: string;
  quantityKg: number;
  time: string;
  caretaker: string;
  completed: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  shift: string;
  assignedShed: string;
  phone: string;
  onDuty: boolean;
}

export interface RescueRecord {
  id: string;
  rescueDate: string;
  location: string;
  animalTagId: string;
  animalName: string;
  conditionAtIntake: string;
  triageStatus: 'Stabilized' | 'Under Quarantine' | 'Cleared to Herd';
  reportedBy: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  read: boolean;
  targetSection: NavSection;
  cowId?: string;
}

export interface BaselineCounts {
  Healthy: number;
  'Under Observation': number;
  'Under Treatment': number;
  Critical: number;
}

export interface TaskBaselineOffset {
  Completed: number;
  'In Progress': number;
  Pending: number;
}

export interface NewCowInput {
  id?: string;
  name: string;
  breed: string;
  ageYears: number;
  gender: 'Cow' | 'Bull' | 'Calf';
  shed: string;
  healthStatus: HealthStatus;
  weightKg: number;
  notes: string;
}
