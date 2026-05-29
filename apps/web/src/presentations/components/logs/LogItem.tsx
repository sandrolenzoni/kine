import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronRight, Hash, Clock, AlertTriangle, Play } from "lucide-react";
import type { Log } from "@/domain/types/Log.type";
import { STATUS_STYLES } from "@/lib/status-styles";
import { formatTime } from "@/lib/format-date";

const STEP_STYLE = {
  color: "text-violet-400",
  bg: "bg-violet-500",
  border: "border-l-violet-500/50",
  glow: "shadow-violet-500/20",
};

/** Componente para renderizar detalhes de forma limpa */
const LogDetails = ({ details }: { details: Record<string, any> }) => {
  const entries = Object.entries(details).filter(([k]) => k !== "step");
  if (entries.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 bg-neutral-950/30 p-3 rounded-lg border border-neutral-800/50">
      {entries.map(([k, v]) => (
        <div key={k} className="flex items-center gap-2 truncate text-[11px]">
          <span className="text-neutral-600 uppercase tracking-wider font-semibold">{k}:</span>
          <span className="text-neutral-400 font-mono">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
        </div>
      ))}
    </div>
  );
};

/** Componente para tratar erros e stack trace */
const ErrorSection = ({ error, trace }: { error: string; trace?: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="mt-3 bg-rose-950/10 border border-rose-900/20 rounded-lg p-3">
      <div className="flex items-start gap-2 text-rose-300 text-xs font-medium">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        {error}
      </div>
      {trace && (
        <button onClick={() => setShow(!show)} className="mt-2 text-[10px] text-rose-500/60 flex items-center hover:text-rose-400 transition-colors">
          <ChevronRight size={12} className={cn("transition-transform", show && "rotate-90")} />
          {show ? "Ocultar trace" : "Ver stack trace"}
        </button>
      )}
      {show && <pre className="mt-2 text-[10px] text-rose-400/40 font-mono p-3 bg-black/30 rounded overflow-x-auto">{trace}</pre>}
    </div>
  );
};

export const LogItem = ({ log, isLast }: { log: Log; isLast: boolean }) => {
  const isStep = log.from_status === log.to_status;
  const cfg = isStep
    ? STEP_STYLE
    : STATUS_STYLES[log.to_status as keyof typeof STATUS_STYLES];
  const isError = !isStep && log.to_status === "failed" && log.details?.error;
  const stepName = isStep && log.details?.step;

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0 group">
      <div className="flex flex-col items-center pt-1.5">
        <div className={cn("w-3 h-3 rounded-full shadow-lg z-10", cfg.bg, cfg.glow)} />
        {!isLast && <div className="w-px flex-1 bg-neutral-800 mt-2" />}
      </div>

      <div className={cn("flex-1 bg-neutral-900/20 border-l-4 p-4 rounded-r-lg border-t border-r border-b border-neutral-800 backdrop-blur-sm transition-all hover:bg-neutral-900/40", cfg.border)}>
        <div className="flex justify-between items-start mb-2">
          <h4 className={cn("text-xs font-bold uppercase tracking-widest flex items-center gap-2", cfg.color)}>
            {isStep ? (
              <><Play size={10} className="fill-current" />{stepName ?? "Step"}</>
            ) : (
              cfg.label
            )}
          </h4>
          <div className="flex items-center gap-3 text-[10px] text-neutral-600 font-mono">
            <span className="flex items-center gap-1"><Hash size={10} />{log.task_id}</span>
            <span className="flex items-center gap-1"><Clock size={10} />{formatTime(log.created_at)}</span>
          </div>
        </div>

        {isError ? (
          <ErrorSection error={log.details.error} trace={log.details.trace} />
        ) : (
          log.details && Object.keys(log.details).length > 0 && <LogDetails details={log.details} />
        )}
      </div>
    </div>
  );
};