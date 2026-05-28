import { z } from "zod";
import { TaskStatusSchema } from "./Task.schema";

export const LogSchema = z.object({
  id: z.number().nullable().optional(),
  task_id: z.number(),
  from_status: TaskStatusSchema,
  to_status: TaskStatusSchema,
  details: z.union([z.record(z.any()), z.array(z.any())]).default({}),
  created_at: z.string().datetime().nullable().optional(),
  updated_at: z.string().datetime().nullable().optional(),
  deleted_at: z.string().datetime().nullable().optional(),
});
