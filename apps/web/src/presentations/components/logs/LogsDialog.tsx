import { useListLogs } from "../../hooks/useListLogs";
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
import { LogItem } from "./LogItem";
import { FileText } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state/LoadingState";
import { ErrorState } from "@/components/ui/error-state/ErrorState";

interface LogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LogsDialog = ({ open, onOpenChange }: LogsDialogProps) => {
  const { data: logs, isLoading, error } = useListLogs();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl bg-neutral-900/95 p-0 gap-0 border-neutral-800/50 shadow-xl shadow-neutral-950/50 overflow-hidden">
        <AlertDialogHeader className="p-6 pb-4 border-b border-neutral-800/50">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <AlertDialogTitle className="text-xl font-semibold tracking-tight">
              Logs do Sistema
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-neutral-400 text-sm">
            Histórico completo de transições de status de todas as tarefas.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6">
            {isLoading ? (
              <LoadingState height="h-48" message="Carregando logs..." />
            ) : error ? (
              <ErrorState height="h-48" message="Erro ao carregar logs" />
            ) : !logs || logs.length === 0 ? (
              <p className="text-sm text-neutral-500 italic text-center py-12">
                Nenhum log encontrado.
              </p>
            ) : (
              <div className="space-y-0">
                {logs.map((log, index) => (
                  <LogItem
                    key={log.id ?? index}
                    log={log}
                    isLast={index === logs.length - 1}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <AlertDialogFooter className="p-4 border-t border-neutral-800/50">
          <AlertDialogCancel size='sm' onClick={() => onOpenChange(false)}>
            Fechar
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog >
  );
};

export { LogsDialog };
