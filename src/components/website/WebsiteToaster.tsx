"use client";

import { Toaster } from "sonner";

export function WebsiteToaster() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "group rounded-xl border border-gray-200/80 bg-white shadow-lg shadow-gray-900/10 backdrop-blur-sm",
          title: "text-[15px] font-semibold text-gray-900",
          description: "text-sm text-gray-600",
          success: "!border-emerald-200/90 !bg-emerald-50/95",
          error: "!border-red-200/90 !bg-red-50/95",
          closeButton:
            "border-0 bg-white/80 text-gray-500 hover:bg-gray-100 hover:text-gray-800",
        },
      }}
    />
  );
}
