import { useKineContext } from "@/context/KineContext";
import { type TaskStatus } from "@/domain/types/Task.type";
import { cn } from "@/lib/utils";
import { ListCheck, CheckCircle2, type LucideIcon, Timer, CircleX, CircleSlash, CircleEllipsis, Weight } from "lucide-react";
import { STATUS_STYLES } from "@/lib/status-styles";
import { formatDuration, formatSize } from "@/lib/format-duration";

interface MetricItemProps {
    number: number | string;
    label: string;
    icon: LucideIcon;
    status: TaskStatus | "all" | null;
}

const MetricItem = ({ icon: Icon, number, label, status: s }: MetricItemProps) => {
    const { filterStatus, setFilterStatus } = useKineContext();
    return (
        <div className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-md",
            s === filterStatus && s !== null && "bg-success/15",
            s !== null && "cursor-pointer hover:bg-neutral-800/50",
        )}

            onClick={() => {
                if (s !== null) setFilterStatus(s)
            }}
        >
            <div className={cn(
                "p-2 rounded-lg border transition-colors duration-200",
                s === 'pending' && "border-amber-500/10",
                s === 'completed' && "border-success/10",
                s === 'processing' && "border-blue-500/10",
                s === 'failed' && "border-destructive/10",
                s !== null && s === filterStatus && "bg-success/15",
                s !== null && s !== filterStatus && "hover:bg-neutral-800/50"
            )}>
                <Icon className={cn(
                    "w-5 h-5",
                    s && s !== 'all' && STATUS_STYLES[s as TaskStatus]?.text
                )} />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
                <span className="font-mono text-xl font-medium text-foreground leading-none">{number}</span>
            </div>
        </div>
    )
};

const StatusIndicator = () => (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/50 border border-neutral-800">
        <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
        </span>
        <span className="text-[10px] font-bold text-success uppercase tracking-wider">Sistema Ativo</span>
    </div>
);

const Header = () => {
    const { tasks } = useKineContext();

    const completedCount = tasks?.filter(t => t.status === 'completed').length ?? 0;
    const processingCount = tasks?.filter(t => t.status === 'processing').length ?? 0;
    const failedCount = tasks?.filter(t => t.status === 'failed').length ?? 0;
    const pendingCount = tasks?.filter(t => t.status === 'pending').length ?? 0;

    const tasksWithAvgTime = tasks?.filter(t => t.average_time !== null && t.average_time !== undefined) ?? [];
    const averageTimeMs = tasksWithAvgTime.length > 0
      ? tasksWithAvgTime.reduce((sum, t) => sum + t.average_time!, 0) / tasksWithAvgTime.length
      : 0;
    const averageTime = formatDuration(averageTimeMs) ?? "0ms";

    const totalKb = tasks?.reduce((sum, t) => sum + (t.size_kb ?? 0), 0) ?? 0;
    const totalSizeKb = formatSize(totalKb) ?? "0 KB";


    return (
        <header className="w-full sticky top-0 z-50 px-8 py-5 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center gap-6">
                <h2 className="text-3xl font-heading font-medium tracking-tight text-primary">Kine<span className="text-foreground">GUI</span></h2>
                <div className="h-6 w-px bg-neutral-800" />
                <StatusIndicator />
            </div>

            <div className="flex items-center divide-x divide-neutral-800">
                <MetricItem
                    number={tasks?.length ?? 0}
                    label="Tarefas Totais"
                    icon={ListCheck}
                    status='all'
                />
                <MetricItem
                    number={pendingCount}
                    label="Pendentes"
                    icon={CircleEllipsis}
                    status='pending'
                />
                <MetricItem
                    number={completedCount}
                    label="Concluídas"
                    icon={CheckCircle2}
                    status="completed"
                />
                <MetricItem
                    number={processingCount}
                    label="Em processamento"
                    icon={CircleSlash}
                    status="processing"
                />
                <MetricItem
                    number={failedCount}
                    label="Falhadas"
                    icon={CircleX}
                    status="failed"
                />
                <MetricItem
                    number={averageTime}
                    label="Tempo médio"
                    icon={Timer}
                    status={null}
                />
                <MetricItem
                    number={totalSizeKb}
                    label="Tamanho total"
                    icon={Weight}
                    status={null}
                />

            </div>
        </header>
    );
};

export default Header;