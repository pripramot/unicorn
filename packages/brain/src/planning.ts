/**
 * Task Planner - Hierarchical Task Planning
 *
 * Creates and manages execution plans for complex tasks,
 * breaking them into sub-tasks with dependency tracking.
 */

export type PlanStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

export interface Task {
  id: string;
  name: string;
  description: string;
  status: PlanStatus;
  priority: number;
  dependencies: string[];
  subtasks: Task[];
  result?: string;
  createdAt: number;
  completedAt?: number;
}

export interface Plan {
  id: string;
  name: string;
  goal: string;
  tasks: Task[];
  status: PlanStatus;
  createdAt: number;
  updatedAt: number;
}

export class TaskPlanner {
  private plans: Map<string, Plan> = new Map();

  /**
   * Create a new execution plan from a goal description.
   */
  createPlan(name: string, goal: string, taskDescriptions: string[]): Plan {
    const planId = `plan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = Date.now();

    const tasks: Task[] = taskDescriptions.map((desc, index) => ({
      id: `task_${planId}_${index}`,
      name: `Task ${index + 1}`,
      description: desc,
      status: 'pending' as PlanStatus,
      priority: index + 1,
      dependencies: index > 0 ? [`task_${planId}_${index - 1}`] : [],
      subtasks: [],
      createdAt: now,
    }));

    const plan: Plan = {
      id: planId,
      name,
      goal,
      tasks,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    this.plans.set(planId, plan);
    return plan;
  }

  /**
   * Update the status of a specific task within a plan.
   */
  updateTaskStatus(planId: string, taskId: string, status: PlanStatus, result?: string): boolean {
    const plan = this.plans.get(planId);
    if (!plan) return false;

    const task = this.findTask(plan.tasks, taskId);
    if (!task) return false;

    task.status = status;
    if (result) task.result = result;
    if (status === 'completed' || status === 'failed') {
      task.completedAt = Date.now();
    }

    // Update plan status based on task statuses
    plan.status = this.computePlanStatus(plan.tasks);
    plan.updatedAt = Date.now();

    return true;
  }

  /**
   * Get the next executable tasks (tasks with all dependencies met).
   */
  getNextTasks(planId: string): Task[] {
    const plan = this.plans.get(planId);
    if (!plan) return [];

    return plan.tasks.filter(task => {
      if (task.status !== 'pending') return false;
      return task.dependencies.every(depId => {
        const dep = this.findTask(plan.tasks, depId);
        return dep?.status === 'completed';
      });
    });
  }

  /**
   * Get a plan by ID.
   */
  getPlan(planId: string): Plan | undefined {
    return this.plans.get(planId);
  }

  /**
   * List all plans.
   */
  listPlans(): Plan[] {
    return Array.from(this.plans.values());
  }

  private findTask(tasks: Task[], taskId: string): Task | undefined {
    for (const task of tasks) {
      if (task.id === taskId) return task;
      const found = this.findTask(task.subtasks, taskId);
      if (found) return found;
    }
    return undefined;
  }

  private computePlanStatus(tasks: Task[]): PlanStatus {
    if (tasks.every(t => t.status === 'completed')) return 'completed';
    if (tasks.some(t => t.status === 'failed')) return 'failed';
    if (tasks.some(t => t.status === 'in_progress')) return 'in_progress';
    return 'pending';
  }
}
