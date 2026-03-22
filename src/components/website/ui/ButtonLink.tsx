import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors";
  const styles =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary/90"
      : "bg-white text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}

