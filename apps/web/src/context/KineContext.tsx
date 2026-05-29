import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { Task, TaskStatus } from "../domain/types/Task.type";
import type { Log } from "../domain/types/Log.type";

type TaskFilterStatus = TaskStatus | "all" | null;

interface KineContextValue {
  tasks: Task[] | undefined;
  logs: Log[] | undefined;

  setTasks: (tasks: Task[]) => void;
  setLogs: (logs: Log[]) => void;

  setFilterStatus: (status: TaskFilterStatus) => void;
  filterStatus: TaskFilterStatus;

  search: string;
  setSearch: (text: string) => void;

}

const KineContext = createContext<KineContextValue | null>(null);

const useKineContext = () => {
  const context = useContext(KineContext);
  if (!context) {
    throw new Error("useKineContext must be used within a KineProvider");
  }
  return context;
};

interface KineProviderProps {
  children: ReactNode;
}

const KineProvider = ({ children }: KineProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [filterStatus, setFilterStatus] = useState<TaskFilterStatus>(null);
  const [search, setSearch] = useState<string>("");

  return (
    <KineContext.Provider value={{ tasks, logs, setTasks, setLogs, filterStatus, setFilterStatus, search, setSearch }}>
      {children}
    </KineContext.Provider>
  );
};

export { KineProvider, useKineContext };
