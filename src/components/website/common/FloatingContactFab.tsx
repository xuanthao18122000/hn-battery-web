import Link from "next/link";
import {
  contactHotlineTel,
  socialLinks,
  zaloChatUrl,
} from "@/config/site";

/**
 * 3 nút tròn cố định góc phải dưới: Facebook, Zalo, Gọi điện.
 * Mobile: nằm trên thanh bottom nav (h-14).
 */
export function FloatingContactFab() {
  const telHref = `tel:${contactHotlineTel.replace(/\s/g, "")}`;

  return (
    <div
      className="pointer-events-none fixed bottom-24 right-3 z-[10000] flex flex-col items-center gap-5 md:bottom-6 md:right-5"
      aria-label="Liên hệ nhanh"
    >
      {/* Facebook */}
      <Link
        href={socialLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-[0_0_0_4px_rgba(24,119,242,0.28)] transition-transform hover:scale-105 hover:shadow-[0_0_0_6px_rgba(24,119,242,0.35)] focus-visible:ring-2 focus-visible:ring-[#1877F2] focus-visible:ring-offset-2"
        aria-label="Mở trang Facebook"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px]"
          fill="currentColor"
          aria-hidden
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </Link>

      {/* Zalo */}
      <a
        href={zaloChatUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto flex h-11 w-11 flex-col items-center justify-center rounded-full bg-[#0068FF] px-0.5 text-white shadow-[0_0_0_4px_rgba(0,104,255,0.28)] transition-transform hover:scale-105 hover:shadow-[0_0_0_6px_rgba(0,104,255,0.35)] focus-visible:ring-2 focus-visible:ring-[#0068FF] focus-visible:ring-offset-2"
        aria-label="Chat Zalo"
      >
        <span className="text-[9px] font-bold leading-none tracking-tight">
          Zalo
        </span>
      </a>

      {/* Gọi */}
      <a
        href={telHref}
        className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#E53935] text-white shadow-[0_0_0_4px_rgba(229,57,53,0.28)] transition-transform hover:scale-105 hover:shadow-[0_0_0_6px_rgba(229,57,53,0.35)] focus-visible:ring-2 focus-visible:ring-[#E53935] focus-visible:ring-offset-2"
        aria-label={`Gọi hotline ${contactHotlineTel}`}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>
    </div>
  );
}
