"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  href: string;
  disableLink?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  onClick?: () => void;
};

/** Category có slug `#` → không dùng Link, giữ nguyên trang. */
export function CategoryNavLink({
  href,
  disableLink,
  className,
  style,
  children,
  onClick,
}: Props) {
  if (disableLink) {
    return (
      <span className={className} style={style} onClick={onClick}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={className} style={style} onClick={onClick}>
      {children}
    </Link>
  );
}
