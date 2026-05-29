import type { IKineRepository, TaskDetail } from "../domain/KineRepository";
import { TaskSchema } from "../domain/schemas/Task.schema";
import { LogSchema } from "../domain/schemas/Log.schema";
import type { Task, TaskCreate } from "../domain/types/Task.type";
import type { Log } from "../domain/types/Log.type";
import { client } from "./api/api-client";
import { z } from "zod";

class KineRepository implements IKineRepository {
  async listTasks(): Promise<Task[]> {
    const tasks = await client.get<Task[]>("/api/tasks");
    return z.array(TaskSchema).parse(tasks);
  }

  async createTask(data: TaskCreate): Promise<Task> {
    const task = await client.post<Task>("/api/tasks", data);
    return TaskSchema.parse(task);
  }

  async getTask(id: number): Promise<TaskDetail> {
    const data = await client.get<{ task: unknown; logs: unknown }>(
      `/api/tasks/${id}`,
    );

    return {
      task: TaskSchema.parse(data.task),
      logs: z.array(LogSchema).parse(data.logs),
    };
  }

  async listLogs(): Promise<Log[]> {
    const logs = await client.get<unknown[]>("/api/logs");
    return z.array(LogSchema).parse(logs);
  }

  async retryTask(id: number): Promise<Task> {
    const task = await client.post<Task>(`/api/tasks/${id}/retry`);
    return TaskSchema.parse(task);
  }
}

const kineRepository = new KineRepository();

export { kineRepository };
