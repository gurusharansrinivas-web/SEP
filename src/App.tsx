import React from 'react';
import { Calendar, Info, Plus, Search, X } from 'lucide-react';
import adminAvatarImg from './assets/images/avatar_gaushala_admin_1794726059241.jpg';
import { CowDetailDrawer } from './components/CowDetailDrawer';
import { CowsView } from './components/CowsView';
import { HealthcareAlerts } from './components/HealthcareAlerts';
import { HealthcareView } from './components/HealthcareView';
import { GaushalaEmblem } from './components/Icons';
import { InventoryOverview } from './components/InventoryOverview';
import {
  FeedingView,
  InventoryView,
  RescueView,
  StaffView,
} from './components/OperationsViews';
import { PopulationOverview } from './components/PopulationOverview';
import { RecentActivities } from './components/RecentActivities';
import { RegisterCowModal } from './components/RegisterCowModal';
import {
  HelpSupportView,
  ProfileModal,
  ReportsView,
  SettingsView,
} from './components/ReportsAndSettingsViews';
import { Sidebar } from './components/Sidebar';
import { StatCards } from './components/StatCards';
import { TodaysOperations } from './components/TodaysOperations';
import { TopBar } from './components/TopBar';
import {
  BASELINE_HERD_REMAINDER,
  BASELINE_TASK_OFFSET,
  INITIAL_ACTIVITIES,
  INITIAL_COWS,
  INITIAL_FEEDING_SCHEDULES,
  INITIAL_HEALTHCARE_ALERTS,
  INITIAL_INVENTORY,
  INITIAL_NOTIFICATIONS,
  INITIAL_RESCUES,
  INITIAL_STAFF,
  INITIAL_TASKS,
} from './data/sampleData';
import type {
  ActivityLog,
  CowRecord,
  FeedingSchedule,
  HealthcareAlert,
  HealthStatus,
  InventoryItem,
  NavSection,
  NewCowInput,
  NotificationItem,
  OperationTask,
  StaffMember,
  TaskStatus,
} from './types/gaushala';
import {
  computeHerdStats,
  computeTaskStats,
  filterSearchResults,
  generateNextCowId,
  type SearchResultItem,
} from './utils/dashboardCalculations';

const SECTION_LABELS: Record<NavSection, string> = {
  dashboard: 'Dashboard',
  cows: 'Cow Management',
  healthcare: 'Healthcare',
  feeding: 'Feeding & Nutrition',
  inventory: 'Inventory',
  staff: 'Staff Management',
  rescue: 'Rescue Records',
  reports: 'Reports & Analytics',
  settings: 'Settings',
  help: 'Help & Support',
};

const DISPLAY_DATE = 'Saturday, 14 Nov 2026';

export default function App() {
  const [activeSection, setActiveSection] =
    React.useState<NavSection>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const [cows, setCows] = React.useState<CowRecord[]>(INITIAL_COWS);
  const [alerts, setAlerts] = React.useState<HealthcareAlert[]>(
    INITIAL_HEALTHCARE_ALERTS
  );
  const [tasks, setTasks] = React.useState<OperationTask[]>(INITIAL_TASKS);
  const [inventory, setInventory] =
    React.useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [activities, setActivities] =
    React.useState<ActivityLog[]>(INITIAL_ACTIVITIES);
  const [feedingSchedules, setFeedingSchedules] = React.useState<
    FeedingSchedule[]
  >(INITIAL_FEEDING_SCHEDULES);
  const [staff, setStaff] = React.useState<StaffMember[]>(INITIAL_STAFF);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );

  const [searchQuery, setSearchQuery] = React.useState('');
  const [cowHealthFilter, setCowHealthFilter] = React.useState<
    HealthStatus | 'All'
  >('All');

  const [registerModalOpen, setRegisterModalOpen] = React.useState(false);
  const [selectedCowId, setSelectedCowId] = React.useState<string | null>(null);
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);
  const [tasksModalOpen, setTasksModalOpen] = React.useState(false);
  const [newTaskTitle, setNewTaskTitle] = React.useState('');
  const [loggedOut, setLoggedOut] = React.useState(false);

  const herdStats = React.useMemo(
    () => computeHerdStats(cows, BASELINE_HERD_REMAINDER),
    [cows]
  );

  const taskStats = React.useMemo(
    () => computeTaskStats(tasks, BASELINE_TASK_OFFSET),
    [tasks]
  );

  const searchResults = React.useMemo(
    () => filterSearchResults(searchQuery, cows, alerts, tasks, inventory),
    [searchQuery, cows, alerts, tasks, inventory]
  );

  const selectedCow = React.useMemo(
    () => cows.find((c) => c.id === selectedCowId) ?? null,
    [cows, selectedCowId]
  );

  const appendActivity = React.useCallback(
    (
      type: ActivityLog['type'],
      description: string,
      user = 'Arvind Kulkarni (Admin)'
    ) => {
      setActivities((prev) => [
        {
          id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type,
          description,
          user,
          timestamp: '14 Nov, Just now',
        },
        ...prev,
      ]);
    },
    []
  );

  const handleRegisterCow = (input: NewCowInput) => {
    const newId = input.id?.trim().toUpperCase() || generateNextCowId(cows);
    const created: CowRecord = {
      id: newId,
      name: input.name,
      breed: input.breed,
      ageYears: input.ageYears,
      gender: input.gender,
      shed: input.shed,
      healthStatus: input.healthStatus,
      lastCheckup: '14 Nov',
      registrationDate: '14 Nov 2026',
      weightKg: input.weightKg,
      notes: input.notes || 'Newly registered animal.',
      history: [
        {
          id: `mh-${Date.now()}`,
          date: '14 Nov 2026',
          note: 'Initial registration and intake assessment completed.',
          veterinarian: 'Arvind Kulkarni (Admin)',
          statusAfter: input.healthStatus,
        },
      ],
    };

    setCows((prev) => [created, ...prev]);

    if (
      input.healthStatus === 'Under Treatment' ||
      input.healthStatus === 'Critical'
    ) {
      setAlerts((prev) => [
        {
          id: `ha-${Date.now()}`,
          cowId: newId,
          cowName: input.name,
          condition:
            input.healthStatus === 'Critical'
              ? 'Critical Intake'
              : 'Intake Treatment',
          lastCheckup: '14 Nov',
          nextAction: 'Immediate vet evaluation',
          priority: input.healthStatus === 'Critical' ? 'High' : 'Medium',
        },
        ...prev,
      ]);
    }

    appendActivity('cow', `New cow registered – ${newId}.`);
  };

  const handleUpdateCowHealth = (
    cowId: string,
    newStatus: HealthStatus,
    note: string
  ) => {
    setCows((prev) =>
      prev.map((cow) => {
        if (cow.id !== cowId) return cow;
        return {
          ...cow,
          healthStatus: newStatus,
          lastCheckup: '14 Nov',
          history: [
            {
              id: `mh-${Date.now()}`,
              date: '14 Nov 2026',
              note,
              veterinarian: 'Dr. Raghavendra Rao',
              statusAfter: newStatus,
            },
            ...cow.history,
          ],
        };
      })
    );

    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.cowId !== cowId) return alert;
        return {
          ...alert,
          lastCheckup: '14 Nov',
          priority:
            newStatus === 'Critical'
              ? 'High'
              : newStatus === 'Under Treatment'
              ? 'Medium'
              : 'Low',
        };
      })
    );

    appendActivity(
      'medical',
      `Medical record updated – ${cowId}.`,
      'Dr. Raghavendra Rao'
    );
  };

  const handleUpdateTaskStatus = (taskId: string, nextStatus: TaskStatus) => {
    const target = tasks.find((t) => t.id === taskId);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
    if (target) {
      appendActivity(
        'task',
        `${target.title} marked ${nextStatus.toLowerCase()}.`,
        target.assignedTo
      );
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: OperationTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      shedOrArea: 'General Sanctuary',
      assignedTo: 'Ramesh Yadav',
      scheduledTime: '04:00 PM',
      status: 'Pending',
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle('');
    appendActivity('task', `Added daily task – ${newTask.title}.`);
  };

  const handleAdjustStock = (itemId: string, delta: number) => {
    const target = inventory.find((i) => i.id === itemId);
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const nextQty = Math.max(0, item.quantity + delta);
        return {
          ...item,
          quantity: nextQty,
          lastUpdated: 'Today, Just now',
        };
      })
    );
    if (target) {
      appendActivity(
        'inventory',
        `Inventory updated – ${target.name}.`,
        'Mahesh Verma'
      );
    }
  };

  const handleToggleFeeding = (id: string) => {
    const target = feedingSchedules.find((f) => f.id === id);
    setFeedingSchedules((prev) =>
      prev.map((f) => (f.id === id ? { ...f, completed: !f.completed } : f))
    );
    if (target) {
      appendActivity(
        'task',
        `${target.mealSlot} feeding (${target.shed}) marked ${
          target.completed ? 'pending' : 'completed'
        }.`,
        target.caretaker
      );
    }
  };

  const handleToggleStaffDuty = (id: string) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, onDuty: !s.onDuty } : s))
    );
  };

  const handleAddAlert = (alertInput: Omit<HealthcareAlert, 'id'>) => {
    setAlerts((prev) => [
      { ...alertInput, id: `ha-${Date.now()}` },
      ...prev,
    ]);
    appendActivity(
      'medical',
      `Medical alert logged – ${alertInput.cowId}.`,
      'Dr. Meenakshi Iyer'
    );
  };

  const handleSelectSearchResult = (item: SearchResultItem) => {
    setActiveSection(item.targetSection);
    if (item.cowId) {
      setSelectedCowId(item.cowId);
    }
    setSearchQuery('');
  };

  const handleSelectNotification = (notif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setActiveSection(notif.targetSection);
    if (notif.cowId) {
      setSelectedCowId(notif.cowId);
    }
  };

  if (loggedOut) {
    return (
      <div className="min-h-screen bg-[#F6F8F5] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-[#E2E8DF] rounded-xl p-8 text-center space-y-4">
          <div className="flex justify-center">
            <GaushalaEmblem className="w-12 h-12" />
          </div>
          <h1 className="font-display text-xl font-bold text-[#26352D]">
            Signed Out of Sri Krishna Gaushala
          </h1>
          <p className="text-[13.5px] text-[#78857C]">
            Your administrator session has ended safely. Sign back in to resume
            sanctuary management.
          </p>
          <button
            type="button"
            onClick={() => setLoggedOut(false)}
            className="w-full py-2.5 px-4 rounded-lg bg-[#245C43] hover:bg-[#1D4B36] text-white text-[13.5px] font-semibold transition-colors"
          >
            Return to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8F5] text-[#26352D]">
      <Sidebar
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          if (sec !== 'cows') setCowHealthFilter('All');
        }}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onOpenProfile={() => setProfileModalOpen(true)}
        onLogout={() => setLoggedOut(true)}
        adminAvatarUrl={adminAvatarImg}
      />

      {/* Right Main Area */}
      <div className="lg:pl-[250px] flex flex-col min-h-screen">
        <TopBar
          activeSection={activeSection}
          sectionLabel={SECTION_LABELS[activeSection]}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchResults={searchResults}
          onSelectSearchResult={handleSelectSearchResult}
          notifications={notifications}
          onMarkAllNotificationsRead={() =>
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
          }
          onSelectNotification={handleSelectNotification}
          onSelectSection={setActiveSection}
          onOpenProfile={() => setProfileModalOpen(true)}
          onLogout={() => setLoggedOut(true)}
          adminAvatarUrl={adminAvatarImg}
          formattedDate="14 Nov 2026"
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1440px] w-full mx-auto space-y-6">
          {/* Mobile Search Field */}
          <div className="md:hidden relative">
            <label htmlFor="mobile-dashboard-search" className="sr-only">
              Search cows, records or activities
            </label>
            <Search className="w-4 h-4 text-[#78857C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="mobile-dashboard-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cows, records or activities..."
              className="w-full h-10 pl-9 pr-3 text-[13.5px] bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43]"
            />
            {searchQuery.trim().length > 0 && (
              <div className="mt-1.5 bg-white border border-[#DCE4DA] rounded-xl shadow-lg overflow-hidden">
                {searchResults.length > 0 ? (
                  <ul className="divide-y divide-[#F0F3EE]">
                    {searchResults.map((result) => (
                      <li key={result.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectSearchResult(result)}
                          className="w-full px-3.5 py-2.5 text-left hover:bg-[#F6F8F5] flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-[#26352D] truncate">
                              {result.title}
                            </div>
                            <div className="text-[11.5px] text-[#78857C] truncate">
                              {result.subtitle}
                            </div>
                          </div>
                          <span className="text-[11px] font-medium text-[#245C43] shrink-0">
                            {result.kind}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-3 text-[12.5px] text-[#78857C]">
                    No matching records found.
                  </div>
                )}
              </div>
            )}
          </div>

          {activeSection === 'dashboard' && (
            <>
              {/* Main Dashboard Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl sm:text-[26px] font-bold text-[#26352D] tracking-tight">
                    Good Morning, Administrator
                  </h1>
                  <p className="text-[14px] text-[#78857C] mt-0.5">
                    Here&apos;s what&apos;s happening at Sri Krishna Gaushala today.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#E2E8DF] text-[12.5px] font-medium text-[#4B5A51] tabular-nums">
                    <Calendar
                      className="w-3.5 h-3.5 text-[#78857C]"
                      aria-hidden="true"
                    />
                    <span>{DISPLAY_DATE}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setRegisterModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#245C43] hover:bg-[#1D4B36] text-white text-[13.5px] font-semibold transition-colors whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Register New Cow</span>
                  </button>
                </div>
              </div>

              {/* Sample Data Notice */}
              <div className="bg-white border border-[#DCE4DA] rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-[12.5px] text-[#4B5A51]">
                <Info
                  className="w-4 h-4 text-[#245C43] shrink-0"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-[#26352D]">
                    Demonstration Data:
                  </strong>{' '}
                  Showing sample sanctuary records for evaluation until live
                  Firebase records are connected.
                </span>
              </div>

              {/* Four Statistics Cards */}
              <StatCards
                herdStats={herdStats}
                taskStats={taskStats}
                onNavigateCows={() => {
                  setCowHealthFilter('All');
                  setActiveSection('cows');
                }}
                onNavigateHealthcare={() => setActiveSection('healthcare')}
                onScrollToOperations={() => {
                  document
                    .getElementById('todays-operations-section')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* Analytical & Operational Two-Column Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <div className="xl:col-span-7 space-y-6">
                  <PopulationOverview
                    herdStats={herdStats}
                    onSelectHealthCategory={(status) => {
                      setCowHealthFilter(status);
                      setActiveSection('cows');
                    }}
                  />

                  <HealthcareAlerts
                    alerts={alerts}
                    onSelectCow={(cowId) => setSelectedCowId(cowId)}
                    onViewAllMedicalRecords={() => setActiveSection('healthcare')}
                  />
                </div>

                <div className="xl:col-span-5 space-y-6">
                  <TodaysOperations
                    tasks={tasks.slice(0, 6)}
                    taskStats={taskStats}
                    onUpdateTaskStatus={handleUpdateTaskStatus}
                    onViewAllTasks={() => setTasksModalOpen(true)}
                  />

                  <RecentActivities activities={activities} />
                </div>
              </div>

              {/* Inventory Overview */}
              <InventoryOverview
                items={inventory}
                onAdjustStock={handleAdjustStock}
                onManageInventory={() => setActiveSection('inventory')}
              />
            </>
          )}

          {activeSection === 'cows' && (
            <CowsView
              cows={cows}
              initialHealthFilter={cowHealthFilter}
              onFilterChange={setCowHealthFilter}
              onSelectCow={(cowId) => setSelectedCowId(cowId)}
              onOpenRegisterModal={() => setRegisterModalOpen(true)}
            />
          )}

          {activeSection === 'healthcare' && (
            <HealthcareView
              alerts={alerts}
              cows={cows}
              onSelectCow={(cowId) => setSelectedCowId(cowId)}
              onAddAlert={handleAddAlert}
            />
          )}

          {activeSection === 'feeding' && (
            <FeedingView
              schedules={feedingSchedules}
              onToggleFeeding={handleToggleFeeding}
            />
          )}

          {activeSection === 'inventory' && (
            <InventoryView
              items={inventory}
              onAdjustStock={handleAdjustStock}
            />
          )}

          {activeSection === 'staff' && (
            <StaffView staff={staff} onToggleDuty={handleToggleStaffDuty} />
          )}

          {activeSection === 'rescue' && (
            <RescueView
              rescues={INITIAL_RESCUES}
              onSelectCow={(cowId) => setSelectedCowId(cowId)}
            />
          )}

          {activeSection === 'reports' && (
            <ReportsView
              herdStats={herdStats}
              taskStats={taskStats}
              cows={cows}
            />
          )}

          {activeSection === 'settings' && <SettingsView />}

          {activeSection === 'help' && <HelpSupportView />}
        </main>
      </div>

      {/* Register New Cow Modal */}
      <RegisterCowModal
        open={registerModalOpen}
        existingCows={cows}
        onClose={() => setRegisterModalOpen(false)}
        onSubmit={handleRegisterCow}
      />

      {/* Cow Record Detail Drawer */}
      <CowDetailDrawer
        cow={selectedCow}
        onClose={() => setSelectedCowId(null)}
        onUpdateCowHealth={handleUpdateCowHealth}
      />

      {/* Profile Modal */}
      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        adminAvatarUrl={adminAvatarImg}
      />

      {/* View All Tasks Modal */}
      {tasksModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="all-tasks-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#26352D]/40 backdrop-blur-[1px]"
        >
          <div className="w-full max-w-xl bg-white border border-[#DCE4DA] rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDF1EB]">
              <div>
                <h2
                  id="all-tasks-modal-title"
                  className="font-display text-[17px] font-semibold text-[#26352D]"
                >
                  All Daily Operations Tasks
                </h2>
                <p className="text-[12.5px] text-[#78857C]">
                  {taskStats.completed} of {taskStats.total} shift tasks
                  completed ({taskStats.completionPercentage}%)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTasksModalOpen(false)}
                aria-label="Close tasks modal"
                className="p-1.5 rounded-lg text-[#78857C] hover:text-[#26352D] hover:bg-[#F6F8F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <form onSubmit={handleAddTask} className="flex gap-2">
                <label htmlFor="new-task-title" className="sr-only">
                  Add new operational task
                </label>
                <input
                  id="new-task-title"
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Add a shift task (e.g. Water trough sanitization)..."
                  className="flex-1 h-9 px-3 text-[13px] bg-[#F6F8F5] border border-[#DCE4DA] rounded-lg focus:outline-none focus:bg-white focus:border-[#245C43]"
                />
                <button
                  type="submit"
                  className="px-3.5 h-9 rounded-lg bg-[#245C43] hover:bg-[#1D4B36] text-white text-[13px] font-semibold shrink-0"
                >
                  Add Task
                </button>
              </form>

              <ul className="divide-y divide-[#F0F3EE]">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-semibold text-[#26352D]">
                        {task.title}
                      </div>
                      <div className="text-[12px] text-[#78857C]">
                        {task.shedOrArea} · {task.assignedTo} ·{' '}
                        <span className="tabular-nums">{task.scheduledTime}</span>
                      </div>
                    </div>
                    <select
                      aria-label={`Status for ${task.title}`}
                      value={task.status}
                      onChange={(e) =>
                        handleUpdateTaskStatus(
                          task.id,
                          e.target.value as TaskStatus
                        )
                      }
                      className="h-8 px-2.5 text-[12px] font-semibold bg-white border border-[#DCE4DA] rounded-lg focus:outline-none focus:border-[#245C43]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
