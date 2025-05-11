export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: number;
  updatedAt: number;
  dueDate?: number;
}

export interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

export interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  addTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateTask: (
    id: string,
    updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>
  ) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, destination: TaskStatus) => Promise<void>;
}
