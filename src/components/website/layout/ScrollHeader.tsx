"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const ScrollHeader = ({ children }: { children: React.ReactNode }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-md",
        isScrolled ? "shadow-md" : ""
      )}
    >
      {children}
    </header>
  );
};

