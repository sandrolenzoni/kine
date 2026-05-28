import type { TaskStatus } from "@/domain/types/Task.type";

export interface StatusStyle {
  label: string;
  border: string;
  text: string;
  color: string;
  bg: string;
  glow: string;
  badge: string;
}

export const STATUS_STYLES: Record<TaskStatus, StatusStyle> = {
  pending: {
    label: "Pendente",
    border: "border-l-amber-500",
    text: "text-amber-500",
    color: "text-amber-400",
    bg: "bg-amber-500",
    glow: "shadow-amber-500/20",
    badge: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  },
  processing: {
    label: "Processando",
    border: "border-l-blue-500",
    text: "text-blue-500",
    color: "text-sky-400",
    bg: "bg-sky-500",
    glow: "shadow-sky-500/20",
    badge: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  },
  completed: {
    label: "Concluído",
    border: "border-l-success",
    text: "text-success",
    color: "text-emerald-400",
    bg: "bg-emerald-500",
    glow: "shadow-emerald-500/20",
    badge: "bg-green-500/20 text-green-500 border-green-500/30",
  },
  failed: {
    label: "Falhado",
    border: "border-l-red-500",
    text: "text-destructive",
    color: "text-rose-400",
    bg: "bg-rose-500",
    glow: "shadow-rose-500/20",
    badge: "bg-red-500/20 text-red-500 border-red-500/30",
  },
};
