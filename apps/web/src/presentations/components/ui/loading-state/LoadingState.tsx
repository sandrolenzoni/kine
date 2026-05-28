import { LoaderCircle } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  height?: string;
}

const LoadingState = ({ message = "Carregando...", height = "h-64" }: LoadingStateProps) => (
  <div className={`flex ${height} flex-col items-center justify-center gap-2 text-primary`}>
    <LoaderCircle className="w-8 h-8 animate-spin" />
    <span className="text-sm font-medium">{message}</span>
  </div>
);

export { LoadingState };
