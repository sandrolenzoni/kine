import { z } from "zod";

export const TaskPrioritySchema = z.enum(["high", "default"]);
export const TaskStatusSchema = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
]);
export const TaskTypeSchema = z.enum(["email", "report", "push"]);

export const TaskSchema = z.object({
  id: z.number().nullable().optional(),
  task_code: z.number(),
  name: z.string(),
  payload: z.any(),
  priority: TaskPrioritySchema.default("default"),
  type: TaskTypeSchema.default("email"),
  status: TaskStatusSchema.default("pending"),
  average_time: z.number().nullable().optional(),
  size_kb: z.number().nullable().optional(),
  created_at: z.string().datetime().nullable().optional(),
  updated_at: z.string().datetime().nullable().optional(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const TaskCreateSchema = z.object({
  name: z
    .string("O nome da task é obrigatório")
    .trim()
    .min(1, "Informe o nome da task"),
  priority: TaskPrioritySchema.default("default"),
  type: TaskTypeSchema.default("email"),
  payload: z.any(),
});
