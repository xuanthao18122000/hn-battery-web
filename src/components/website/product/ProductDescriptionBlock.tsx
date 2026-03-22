"use client";

import React, { useLayoutEffect, useRef, useState } from "react";

interface ProductDescriptionBlockProps {
  descriptionHtml?: string | null;
  title?: string;
  /** Chiều cao tối đa (px) khi đang thu gọn */
  collapsedMaxHeightPx?: number;
  expandLabel?: string;
  collapseLabel?: string;
}

export default function ProductDescriptionBlock({
  descriptionHtml,
  title = "Chi tiết sản phẩm",
  collapsedMaxHeightPx = 400,
  expandLabel = "Xem thêm",
  collapseLabel = "Thu gọn",
}: ProductDescriptionBlockProps) {
  const [expanded, setExpanded] = useState(false);
  /** null = đang đo; true = nội dung dài hơn collapsedMaxHeightPx; false = không cần nút */
  const [clampNeeded, setClampNeeded] = useState<boolean | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    setExpanded(false);
    setClampNeeded(null);
  }, [descriptionHtml]);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el || expanded) return;

    const measure = () => {
      setClampNeeded(el.scrollHeight > el.clientHeight + 2);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [descriptionHtml, expanded, collapsedMaxHeightPx]);

  if (!descriptionHtml) return null;

  const applyClamp = !expanded && clampNeeded !== false;
  const showFade = !expanded && clampNeeded === true;
  const showToggle =
    (clampNeeded === true || expanded) && clampNeeded !== false;

  const editorClassName =
    "content-editor text-base text-gray-700 leading-[1.65] \
                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-blue-900 [&_h2]:mt-8 [&_h2]:mb-3 \
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-5 [&_h3]:mb-3 \
                    [&_img]:mx-auto [&_img]:block [&_img]:max-w-full \
                    [&_figure]:mx-auto [&_figure]:text-center \
                    [&_.aligncenter]:mx-auto [&_.aligncenter]:block \
                    [&_.wp-caption]:text-center [&_.wp-caption]:mx-auto \
                    [&_p]:mb-4 [&_p]:text-justify \
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul_li]:mb-2 \
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol_li]:mb-2 \
                    [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-[14px] \
                    [&_table_td]:p-2 [&_table_td]:border [&_table_td]:border-gray-200 [&_table_td]:align-middle \
                    [&_table_th]:p-2 [&_table_th]:border [&_table_th]:border-gray-200 [&_table_th]:bg-gray-100 [&_table_th]:font-semibold \
                    [&_table_td:first-child]:font-semibold [&_table_td:first-child]:text-gray-900 [&_table_td:first-child]:w-1/3 [&_table_td:first-child]:bg-gray-50 \
                    [&_table_tr:nth-child(even)_td]:bg-gray-50/50 \
                    [&_a]:text-blue-600 [&_a]:hover:text-blue-800 [&_a]:underline \
                    [&_strong]:font-bold [&_strong]:text-gray-900 \
                    [&_b]:font-bold [&_b]:text-gray-900";

  return (
    <div
      className="mt-6 p-4 lg:p-6 bg-white rounded-lg border border-gray-200 shadow-sm [content-visibility:auto] [contain-intrinsic-size:auto_600px]"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase border-b pb-3">
        {title}
      </h2>
      <div className="relative">
        <div
          ref={contentRef}
          style={
            applyClamp
              ? {
                  maxHeight: collapsedMaxHeightPx,
                  overflow: "hidden",
                }
              : undefined
          }
          className={editorClassName}
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
        {showFade && (
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white via-white/95 to-transparent"
            aria-hidden
          />
        )}
      </div>
      {showToggle && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
            className="text-sm font-semibold text-accent hover:text-accent/90 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
          >
            {expanded ? collapseLabel : expandLabel}
          </button>
        </div>
      )}
    </div>
  );
}
