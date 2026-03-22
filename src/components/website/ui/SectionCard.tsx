import type { ReactNode } from "react";

export function SectionCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 ${className}`}>
      {children}
    </section>
  );
}

