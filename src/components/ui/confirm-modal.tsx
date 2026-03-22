"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DURATION_MS = 200;

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  /** "danger" = nút xác nhận đỏ (xóa), "default" = primary */
  variant?: "danger" | "default";
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Đồng ý",
  cancelText = "Hủy",
  variant = "danger",
}: ConfirmModalProps) {
  const [phase, setPhase] = useState<"entering" | "idle" | "leaving">("entering");
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    setPhase("entering");
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("idle"));
    });
    return () => cancelAnimationFrame(t);
  }, [open]);

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  const startClose = (afterConfirm?: boolean) => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    if (afterConfirm) onConfirm();
    setPhase("leaving");
    leaveTimerRef.current = setTimeout(() => {
      leaveTimerRef.current = null;
      onClose();
    }, DURATION_MS);
  };

  const handleConfirm = () => startClose(true);
  const handleCancel = () => startClose(false);
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    handleCancel();
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open) return null;

  const overlayClasses = cn(
    "fixed inset-0 z-50 bg-black/50 transition-opacity duration-200 ease-out",
    phase === "entering" && "opacity-0",
    phase === "idle" && "opacity-100",
    phase === "leaving" && "opacity-0"
  );

  const panelClasses = cn(
    "relative z-50 w-full max-w-md mx-4 rounded-xl bg-white shadow-xl transition-all duration-200 ease-out",
    phase === "entering" && "opacity-0 scale-95",
    phase === "idle" && "opacity-100 scale-100",
    phase === "leaving" && "opacity-0 scale-95"
  );

  const content = (
    <div
      className={overlayClasses}
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
    >
      <div
        className="min-h-dvh flex items-center justify-center p-4"
        onClick={handleBackdrop}
      >
        <div
          className={panelClasses}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <h2
              id="confirm-modal-title"
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              {title}
            </h2>
            <p
              id="confirm-modal-desc"
              className="text-sm text-gray-600 mb-6"
            >
              {message}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="min-w-[80px]"
              >
                {cancelText}
              </Button>
              <Button
                type="button"
                variant={variant === "danger" ? "destructive" : "default"}
                onClick={handleConfirm}
                className={cn("min-w-[80px]", variant === "danger" && "bg-red-600 hover:bg-red-700 text-white border-0")}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
