import React from 'react';
import { ArrowUpRight, CheckCircle2, Circle, Clock } from 'lucide-react';
import type { OperationTask, TaskStatus } from '../types/gaushala';
import type { TaskStats } from '../utils/dashboardCalculations';

interface TodaysOperationsProps {
  tasks: OperationTask[];
  taskStats: TaskStats;
  onUpdateTaskStatus: (taskId: string, nextStatus: TaskStatus) => void;
  onViewAllTasks: () => void;
}

const NEXT_STATUS_CYCLE: Record<TaskStatus, TaskStatus> = {
  Pending: 'In Progress',
  'In Progress': 'Completed',
  Completed: 'Pending',
};

function TaskStatusIndicator({ status }: { status: TaskStatus }) {
  if (status === 'Completed') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#245C43]">
        <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
        Completed
      </span>
    );
  }
  if (status === 'In Progress') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#B97B18]">
        <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
        In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#78857C]">
      <Circle className="w-4 h-4 shrink-0" aria-hidden="true" />
      Pending
    </span>
  );
}

export function TodaysOperations({
  tasks,
  taskStats,
  onUpdateTaskStatus,
  onViewAllTasks,
}: TodaysOperationsProps) {
  return (
    <section
      id="todays-operations-section"
      aria-labelledby="todays-operations-heading"
      className="bg-white border border-[#E2E8DF] rounded-xl p-6 flex flex-col"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h2
            id="todays-operations-heading"
            className="font-display text-[17px] font-semibold text-[#26352D]"
          >
            Today&apos;s Operations
          </h2>
          <p className="text-[12.5px] text-[#78857C] mt-0.5">
            Click a task status to cycle progress in real time
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAllTasks}
          className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#245C43] hover:underline whitespace-nowrap shrink-0"
        >
          <span>View All Tasks</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Task Progress Summary */}
      <div className="bg-[#F6F8F5] rounded-xl p-4 mb-5">
        <div className="flex items-baseline justify-between gap-2 mb-2.5">
          <div className="text-[13px] font-semibold text-[#26352D]">
            Shift Progress
          </div>
          <div className="text-[13px] font-semibold text-[#245C43] tabular-nums">
            {taskStats.completionPercentage}% Complete
          </div>
        </div>

        {/* Progress Bar */}
        <div
          role="progressbar"
          aria-valuenow={taskStats.completionPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Daily operations completion"
          className="w-full h-2.5 bg-[#E2E8DF] rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-[#245C43] rounded-full transition-all duration-300"
            style={{ width: `${taskStats.completionPercentage}%` }}
          />
        </div>

        {/* Counts Row */}
        <div className="grid grid-cols-4 gap-2 mt-3.5 pt-3 border-t border-[#E6ECE3] text-center tabular-nums">
          <div>
            <div className="text-[16px] font-bold text-[#26352D]">
              {taskStats.total}
            </div>
            <div className="text-[11px] text-[#78857C]">Total tasks</div>
          </div>
          <div>
            <div className="text-[16px] font-bold text-[#245C43]">
              {taskStats.completed}
            </div>
            <div className="text-[11px] text-[#78857C]">Completed</div>
          </div>
          <div>
            <div className="text-[16px] font-bold text-[#B97B18]">
              {taskStats.inProgress}
            </div>
            <div className="text-[11px] text-[#78857C]">In Progress</div>
          </div>
          <div>
            <div className="text-[16px] font-bold text-[#5B675F]">
              {taskStats.pending}
            </div>
            <div className="text-[11px] text-[#78857C]">Pending</div>
          </div>
        </div>
      </div>

      {/* Daily Activity List */}
      <ul className="divide-y divide-[#F0F3EE] flex-1">
        {tasks.map((task) => {
          const nextStatus = NEXT_STATUS_CYCLE[task.status];
          return (
            <li
              key={task.id}
              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div
                  className={`text-[13.5px] font-medium truncate ${
                    task.status === 'Completed'
                      ? 'text-[#4B5A51]'
                      : 'text-[#26352D]'
                  }`}
                >
                  {task.title}
                </div>
                <div className="text-[11.5px] text-[#78857C] mt-0.5 flex items-center gap-1.5 truncate">
                  <span className="tabular-nums">{task.scheduledTime}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{task.assignedTo}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onUpdateTaskStatus(task.id, nextStatus)}
                aria-label={`Change status of ${task.title} from ${task.status} to ${nextStatus}`}
                className="px-2.5 py-1.5 rounded-lg border border-[#E2E8DF] bg-white hover:bg-[#F6F8F5] transition-colors shrink-0"
              >
                <TaskStatusIndicator status={task.status} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
