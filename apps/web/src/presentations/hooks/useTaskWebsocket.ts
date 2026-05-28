import { useEffect } from "react";
import { echo } from "../../lib/echo";
import { queryClient } from "../../lib/react-query";

const useTaskWebsocket = (viewingTaskId: number | null = null) => {
  useEffect(() => {
    const channel = echo.channel("tasks");

    channel.listen("TaskStatusChanged", (e: { task: { id: number; status: string } }) => {
      queryClient.setQueryData(["tasks"], (old: unknown[] | undefined) => {
        if (!old) return old;
        return old.map((t: Record<string, unknown>) =>
          t.id === e.task.id ? { ...t, status: e.task.status } : t
        );
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    return () => {
      channel.stopListening("TaskStatusChanged");
      echo.leave("tasks");
    };
  }, []);

  useEffect(() => {
    if (viewingTaskId === null) return;

    const id = viewingTaskId;
    const channel = echo.channel(`tasks.${id}`);

    channel.listen(".TaskStepExecuted", () => {
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    });

    channel.listen("TaskStatusChanged", (e: { task: { id: number; status: string } }) => {
      queryClient.setQueryData(["task", id], (old: { task: Record<string, unknown>; logs: unknown[] } | undefined) => {
        if (!old) return old;
        return { ...old, task: { ...old.task, status: e.task.status } };
      });
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    });

    return () => {
      channel.stopListening(".TaskStepExecuted");
      channel.stopListening("TaskStatusChanged");
      echo.leave(`tasks.${id}`);
    };
  }, [viewingTaskId]);
};

export { useTaskWebsocket };
