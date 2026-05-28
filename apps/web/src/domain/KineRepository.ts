import type { Task } from "./types/Task.type";
import type { Log } from "./types/Log.type";

export interface TaskDetail {
  task: Task;
  logs: Log[];
}

export interface IKineRepository {
  listTasks(): Promise<Task[]>;
  createTask(data: Record<string, unknown>): Promise<Task>;
  getTask(id: number): Promise<TaskDetail>;
  listLogs(): Promise<Log[]>;
  retryTask(id: number): Promise<Task>;
}
