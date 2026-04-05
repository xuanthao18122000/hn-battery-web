"use client";

import { useEffect, useRef } from "react";

export function ClearFromCategoryCookie() {
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    try {
      document.cookie = "fromCategory=; Path=/; Max-Age=0; SameSite=Lax";
    } catch {}
  }, []);

  return null;
}

