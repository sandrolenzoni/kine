import { useMemo, useState, useEffect } from "react";
import { useListTaks } from "../../../hooks/useListTaks";
import { ScrollArea } from "../../scroll-area";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Search,
  Plus,
  Logs,
  Inbox,
} from "lucide-react";
import { useTaskWebsocket } from "../../../hooks/useTaskWebsocket";
import { TaskCreate } from "../TaskCreate";
import { TaskView } from "../TaskView/TaskView";
import { LogsDialog } from "../../logs/LogsDialog";
import { TaskItem } from "./TaskItem";
import { useKineContext } from "@/context/KineContext";
import { LoadingState } from "@/components/ui/loading-state/LoadingState";
import { ErrorState } from "@/components/ui/error-state/ErrorState";

const getDeepSearchString = (obj: any): string => {
  if (obj === null || obj === undefined) return '';

  if (typeof obj === 'object') {
    return Object.values(obj).map(getDeepSearchString).join(' ');
  }

  return String(obj);
};

const TaskList = () => {
  const { setTasks, filterStatus, search, setSearch } = useKineContext();
  const { data: tasks, isLoading, error } = useListTaks();
  const [openCreate, setOpenCreate] = useState(false);
  const [openLogs, setOpenLogs] = useState(false);
  const [viewTaskId, setViewTaskId] = useState<number | null>(null);

  useTaskWebsocket(viewTaskId);

  useEffect(() => {
    if (tasks) {
      setTasks(tasks);
    }
  }, [tasks, setTasks]);
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    const searchTerm = search.toLowerCase();

    return tasks.filter((task) => {
      const matchesStatus = !filterStatus || filterStatus === 'all' || task.status === filterStatus;

      const fullSearchString = getDeepSearchString(task).toLowerCase();

      const matchesSearch = fullSearchString.includes(searchTerm);

      return matchesStatus && matchesSearch;
    });
  }, [tasks, filterStatus, search]);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between gap-8">
        <Input
          placeholder="Pesquise a Task por nome, fila ou payload"
          scale="md"
          className="w-full max-w-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          rightIcon={<Search className="w-4 text-neutral-400" />}
        />
        <div className="flex flex-1 justify-end gap-3">
          <Button size="md" onClick={() => setOpenCreate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            TAREFA
          </Button>
          <Button size="md" variant="secondary" onClick={() => setOpenLogs(true)}>
            <Logs className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <TaskCreate open={openCreate} onOpenChange={setOpenCreate} />
      <LogsDialog open={openLogs} onOpenChange={setOpenLogs} />
      <TaskView
        open={viewTaskId !== null}
        onOpenChange={(open) => { if (!open) setViewTaskId(null); }}
        taskId={viewTaskId}
      />

      <ScrollArea className="flex-1">
        {isLoading ? (
          <LoadingState message="Carregando tarefas..." />
        ) : error ? (
          <ErrorState message="Erro ao carregar as tarefas" />
        ) : filteredTasks && filteredTasks.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onClick={() => setViewTaskId(task.id ?? null)}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
            <Inbox className="w-10 h-10 opacity-50" />
            <span className="text-sm font-medium">
              Nenhuma tarefa encontrada
            </span>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export { TaskList };
