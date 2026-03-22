import type { ReactNode } from "react";

export function KeyValueRow({
  label,
  value,
  className = "",
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 py-2 ${className}`}>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-sm font-semibold text-gray-900 text-right">{value}</div>
    </div>
  );
}

