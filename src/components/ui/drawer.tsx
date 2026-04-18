"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

/** Cao hơn Header (z-[9999]) / MobileBottomBar (z-[9998]) / overlay menu */
const DRAWER_OVERLAY_Z = "z-[100000]";
const DRAWER_CONTENT_Z = "z-[100001]";

/** Breakpoint `md` của Tailwind = 768px. Dưới ngưỡng này dùng bottom-sheet (vaul). */
const DESKTOP_MEDIA = "(min-width: 768px)";

/** Keyframes dùng riêng cho modal desktop — Tailwind v4 không có plugin animate-in. */
const DESKTOP_MODAL_KEYFRAMES = `
@keyframes drawer-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes drawer-slide-up {
  from { opacity: 0; transform: translate(-50%, calc(-50% + 40px)); }
  to { opacity: 1; transform: translate(-50%, -50%); }
}
`;

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(DESKTOP_MEDIA);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
};

/** Context truyền open/onOpenChange xuống DrawerContent để render modal desktop. */
type DrawerCtx = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};
const DrawerContext = React.createContext<DrawerCtx | null>(null);

const Drawer = ({
  shouldScaleBackground = false,
  open,
  onOpenChange,
  defaultOpen,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => {
  // Hỗ trợ controlled + uncontrolled
  const [internalOpen, setInternalOpen] = React.useState(!!defaultOpen);
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? !!open : internalOpen;
  const handleChange = React.useCallback(
    (v: boolean) => {
      if (!isControlled) setInternalOpen(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange],
  );

  return (
    <DrawerContext.Provider
      value={{ open: currentOpen, onOpenChange: handleChange }}
    >
      <DrawerPrimitive.Root
        shouldScaleBackground={shouldScaleBackground}
        open={currentOpen}
        onOpenChange={handleChange}
        defaultOpen={defaultOpen}
        {...props}
      >
        {children}
      </DrawerPrimitive.Root>
    </DrawerContext.Provider>
  );
};
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 bg-black/40",
      DRAWER_OVERLAY_Z,
      className
    )}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

type DrawerContentProps = React.ComponentPropsWithoutRef<
  typeof DrawerPrimitive.Content
> & {
  /** Chỉ còn `bottom` — mobile bottom-sheet, desktop (md+) modal ở giữa. */
  variant?: "bottom";
};

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(({ className, children, ...props }, ref) => {
  const isDesktop = useIsDesktop();
  const ctx = React.useContext(DrawerContext);

  // DESKTOP: Tự render modal center qua portal — tránh stacking context của parent che header.
  if (isDesktop) {
    if (!ctx?.open) return null;
    if (typeof document === "undefined") return null;
    return createPortal(
      <>
        <style>{DESKTOP_MODAL_KEYFRAMES}</style>
        <div
          className={cn(
            DRAWER_OVERLAY_Z,
            "fixed inset-0 bg-black/40 animate-[drawer-fade-in_180ms_ease-out]",
          )}
          onClick={() => ctx.onOpenChange?.(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              DRAWER_CONTENT_Z,
              "fixed left-1/2 top-1/2 flex flex-col bg-white outline-none",
              "w-[min(92vw,520px)] max-h-[min(85vh,720px)] rounded-lg border border-gray-200 shadow-xl",
              "animate-[drawer-slide-up_260ms_cubic-bezier(0.32,0.72,0,1)_forwards]",
              className
            )}
          >
            {children}
          </div>
        </div>
      </>,
      document.body,
    );
  }

  // MOBILE: vẫn dùng vaul bottom-sheet
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          DRAWER_CONTENT_Z,
          "flex flex-col bg-white outline-none",
          "fixed inset-x-0 bottom-0 left-0 right-0 mt-20 max-h-[min(92vh,880px)] w-full rounded-t-lg border border-gray-200 shadow-xl",
          className
        )}
        {...props}
      >
        <DrawerPrimitive.Handle className="mx-auto mb-1 mt-2 h-1 w-10 shrink-0 rounded-sm bg-gray-300" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
});
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "grid gap-1.5 px-4 pb-2 pt-1 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "mt-auto flex flex-col gap-2 border-t border-gray-100 p-4",
      className
    )}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-gray-900",
      className
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
