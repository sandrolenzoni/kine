import type {
  TaskCreateSchema,
  TaskPrioritySchema,
  TaskSchema,
  TaskStatusSchema,
  TaskTypeSchema,
} from "../schemas/Task.schema";
import type { z } from "zod";

export type Task = z.infer<typeof TaskSchema>;
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type TaskType = z.infer<typeof TaskTypeSchema>;
export type TaskCreate = z.infer<typeof TaskCreateSchema>;
