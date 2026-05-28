import { cn } from "@/lib/utils";
import { Task, TaskStatus } from "../../../../domain/types/Task.type";
import { FileText, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRetryTask } from "../../../hooks/useRetryTask";
import { STATUS_STYLES } from "@/lib/status-styles";
import { formatDuration, formatSize } from "@/lib/format-duration";
import { Badge } from "@/components/ui/badge";

const TaskItem = ({ task, onClick }: { task: Task; onClick?: () => void }) => {
  const { mutate: retryTask, isPending: isRetrying } = useRetryTask();
  const styles = STATUS_STYLES[task.status];
  return (
    <div
      key={task.id}
      onClick={onClick}
      className={cn(
        "bg-neutral-700/15 rounded-md border border-neutral-600/25 py-3 px-6 border-l-5 flex  gap-3 items-center",
        styles.border,
        "hover:shadow-2xl cursor-pointer transition-all",
      )}
    >
      <div className="flex flex-col flex-1 gap-4">
        <div className="justify-between flex">
          <span className="text-muted-foreground text-sm">
            {task.task_code}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex gap-5">
              <Badge
                variant="default"
                className={cn(
                  "border border-neutral-500/15 px-2 py-1 rounded-md",
                )}
              >
                {task.type}
              </Badge>
              <Badge
                variant="default"
                className={cn(
                  "border border-neutral-500/15 px-2 py-1 rounded-md",
                  STATUS_STYLES[task.status as TaskStatus]?.text,
                )}
              >
                {styles.label}
              </Badge>
            </div>
            {task.status === "failed" && (
              <Button
                variant="ghost-destructive"
                size="sm"
                disabled={isRetrying}
                onClick={(e) => {
                  e.stopPropagation();
                  retryTask(task.id!);
                }}
              >
                <RotateCcw
                  className={`w-3 h-3 ${isRetrying ? "animate-spin" : ""}`}
                />
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-1 gap-5 justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg">
              {task.name ?? `Task #${task.task_code}`}
            </h3>
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            {task.size_kb != null && (
              <span className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                {formatSize(task.size_kb)}
              </span>
            )}
            {task.average_time != null && (
              <span className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatDuration(task.average_time)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { TaskItem };
