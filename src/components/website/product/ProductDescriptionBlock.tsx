"use client";

import ParseHtmlContent from "@/components/website/ParseHtmlContent";

interface ProductDescriptionBlockProps {
  descriptionHtml?: string | null;
  title?: string;
  /** Chiều cao tối đa (px) khi đang thu gọn */
  collapsedMaxHeightPx?: number;
}

export default function ProductDescriptionBlock({
  descriptionHtml,
  title = "Chi tiết sản phẩm",
  collapsedMaxHeightPx = 400,
}: ProductDescriptionBlockProps) {
  if (!descriptionHtml) return null;

  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4 lg:p-6 [content-visibility:auto] [contain-intrinsic-size:auto_600px]">
      <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase border-b pb-3">
        {title}
      </h2>
      <ParseHtmlContent
        html={descriptionHtml}
        collapsible
        collapsedHeight={collapsedMaxHeightPx}
      />
    </div>
  );
}
