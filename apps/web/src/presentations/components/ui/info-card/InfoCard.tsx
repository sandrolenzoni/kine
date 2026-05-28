import type { ReactNode } from "react";

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string | null;
}

const InfoCard = ({ icon, label, value }: InfoCardProps) => {
  if (value === null) return null;

  return (
    <div className="flex items-center gap-3 bg-neutral-800/50 rounded-lg p-3">
      <div className="text-primary/70">{icon}</div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">{label}</p>
        <p className="text-sm font-medium text-neutral-200">{value}</p>
      </div>
    </div>
  );
};

export { InfoCard };
