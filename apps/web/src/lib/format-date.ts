import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return null;
  return format(new Date(dateStr), "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
};

export const formatTime = (dateStr: string | null | undefined) => {
  if (!dateStr) return null;
  return format(new Date(dateStr), "HH:mm:ss", { locale: ptBR });
};

export const formatRelative = (dateStr: string | null | undefined) => {
  if (!dateStr) return null;
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ptBR });
};