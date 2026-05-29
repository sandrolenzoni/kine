import { useGetTask } from "../../../hooks/useGetTask";
import { useRetryTask } from "../../../hooks/useRetryTask";
import type { Task, TaskType } from "@/domain/types/Task.type";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogItem } from "../../logs/LogItem";
import {
  Clock,
  Database,
  Package,
  Hash,
  FileText,
  RotateCcw,
  CalendarDays,
  Flag,
  Play,
} from "lucide-react";
import { useMemo, useState } from "react";
import { formatDate } from "@/lib/format-date";
import { STATUS_STYLES } from "@/lib/status-styles";
import { formatDuration } from "@/lib/format-duration";
import { InfoCard } from "@/components/ui/info-card/InfoCard";
import { LoadingState } from "@/components/ui/loading-state/LoadingState";
import { ErrorState } from "@/components/ui/error-state/ErrorState";

interface TaskViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: number | null;
}

const TYPE_LABEL: Record<TaskType, string> = {
  email: "Email",
  report: "Relatório",
  push: "Push",
};

const TaskView = ({ open, onOpenChange, taskId }: TaskViewProps) => {
  const { data, isLoading, error } = useGetTask(taskId);
  const { mutateAsync: retryTask, isPending: isRetrying } = useRetryTask();
  const [retryError, setRetryError] = useState<string | null>(null);

  const task = data?.task;
  const logs = data?.logs ?? [];

  const { statusLogs, stepLogs } = useMemo(() => {
    const sorted = [...logs].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
    return {
      statusLogs: sorted.filter((l) => l.from_status !== l.to_status),
      stepLogs: sorted.filter((l) => l.from_status === l.to_status),
    };
  }, [logs]);

  const finishedLog = [...logs]
    .reverse()
    .find((l) => l.to_status === "completed" || l.to_status === "failed");
  const finishedAt =
    finishedLog?.created_at ??
    (task?.status === "completed" || task?.status === "failed"
      ? task?.updated_at
      : null);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-2xl bg-neutral-900/95 p-0 gap-0 border-neutral-800/50 shadow-xl shadow-neutral-950/50 overflow-hidden">
        {isLoading ? (
          <LoadingState height="h-64" />
        ) : error || !task ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-destructive p-8">
            <p className="text-sm font-medium">
              Erro ao carregar detalhes da tarefa
            </p>
            <AlertDialogCancel onClick={() => onOpenChange(false)}>
              Fechar
            </AlertDialogCancel>
          </div>
        ) : (
          <>
            <AlertDialogHeader className="p-6 pb-4 border-b border-neutral-800/50">
              <div className="flex items-center justify-between">
                <div className="space-y-1 flex-1">
                  <AlertDialogTitle className="flex items-center gap-3">
                    <span className="flex-1 text-2xl font-semibold tracking-tight font-mono">
                      {task.name ?? `Task #${task.task_code}`}
                    </span>
                    <Badge
                      className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 border ${STATUS_STYLES[task.status].badge}`}
                    >
                      {STATUS_STYLES[task.status].label}
                    </Badge>
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-neutral-400 text-sm flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5" />
                    Código: {task.task_code}
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>

            <ScrollArea className="max-h-[60vh]">
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard
                    icon={<Package className="w-4 h-4" />}
                    label="Tipo"
                    value={TYPE_LABEL[task.type]}
                  />
                  <InfoCard
                    icon={<Clock className="w-4 h-4" />}
                    label="Prioridade"
                    value={task.priority === "high" ? "Alta" : "Normal"}
                  />
                  {task.size_kb !== null && task.size_kb !== undefined && (
                    <InfoCard
                      icon={<Database className="w-4 h-4" />}
                      label="Tamanho"
                      value={`${task.size_kb.toFixed(2)} KB`}
                    />
                  )}
                  {task.average_time != null && (
                      <InfoCard
                        icon={<Clock className="w-4 h-4" />}
                        label="Tempo médio"
                        value={formatDuration(task.average_time)}
                      />
                    )}
                  {task.created_at && (
                    <InfoCard
                      icon={<CalendarDays className="w-4 h-4" />}
                      label="Criado em"
                      value={formatDate(task.created_at)}
                    />
                  )}
                  {finishedAt && (
                    <InfoCard
                      icon={<Flag className="w-4 h-4" />}
                      label="Finalizado em"
                      value={formatDate(finishedAt)}
                    />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                    Payload
                  </h4>
                  <pre className="bg-neutral-950 rounded-lg p-4 text-xs font-mono text-neutral-300 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(task.payload, null, 2)}
                  </pre>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    Timeline de Status
                  </h4>
                  {statusLogs.length === 0 ? (
                    <p className="text-sm text-neutral-500 italic">
                      Nenhuma transição de status registrada.
                    </p>
                  ) : (
                    <div className="relative space-y-0">
                      {statusLogs.map((log, index) => (
                        <LogItem
                          key={log.id ?? index}
                          log={log}
                          isLast={index === statusLogs.length - 1}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {stepLogs.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-2">
                      <Play className="w-3.5 h-3.5" />
                      Steps de Execução
                    </h4>
                    <div className="relative space-y-0">
                      {stepLogs.map((log, index) => (
                        <LogItem
                          key={log.id ?? index}
                          log={log}
                          isLast={index === stepLogs.length - 1}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <AlertDialogFooter className="p-4 border-t border-neutral-800/50">
              {task.status === "failed" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isRetrying || !task.id}
                    onClick={async () => {
                      setRetryError(null);
                      try {
                        await retryTask(task.id!);
                        onOpenChange(false);
                      } catch (e) {
                        setRetryError(e instanceof Error ? e.message : "Erro ao reprocessar tarefa");
                      }
                    }}
                  >
                    <RotateCcw
                      className={`w-4 h-4 mr-2 ${isRetrying ? "animate-spin" : ""}`}
                    />
                    Reprocessar
                  </Button>
                  {retryError && (
                    <span className="text-xs text-destructive max-w-[200px] truncate">
                      {retryError}
                    </span>
                  )}
                </div>
              )}
              <AlertDialogCancel size="sm" onClick={() => onOpenChange(false)}>
                Fechar
              </AlertDialogCancel>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { TaskView };
