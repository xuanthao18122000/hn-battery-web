import type { ReactNode } from "react";

export function PageShell({
  children,
  className = "",
  maxWidthClassName = "max-w-6xl",
}: {
  children: ReactNode;
  className?: string;
  maxWidthClassName?: string;
}) {
  return (
    <div className={`container mx-auto px-4 ${maxWidthClassName} ${className}`}>
      {children}
    </div>
  );
}

