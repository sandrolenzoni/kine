import type { z } from "zod";
import type { LogSchema } from "../schemas/Log.schema";

export type Log = z.infer<typeof LogSchema>;
