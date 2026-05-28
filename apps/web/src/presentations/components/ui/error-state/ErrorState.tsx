import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  height?: string;
}

const ErrorState = ({ message = "Erro ao carregar", height = "h-64" }: ErrorStateProps) => (
  <div className={`flex ${height} flex-col items-center justify-center gap-2 text-destructive`}>
    <AlertCircle className="w-8 h-8" />
    <span className="text-sm font-medium">{message}</span>
  </div>
);

export { ErrorState };
