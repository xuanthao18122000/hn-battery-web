"use client";

import { Button } from "@/components/ui/button";

export interface PaginationProps {
  /** Trang hiện tại (bắt đầu từ 1) */
  currentPage: number;
  /** Tổng số trang */
  totalPages: number;
  /** Tổng số bản ghi */
  total: number;
  /** Số bản ghi mỗi trang */
  itemsPerPage: number;
  /** Callback khi đổi trang */
  onPageChange: (page: number) => void;
  /** Tên đối tượng hiển thị ở dòng thông tin, ví dụ: "thương hiệu", "sản phẩm" */
  itemLabel?: string;
  /** Số nút trang tối đa hiển thị ở giữa (mặc định 5) */
  maxVisiblePages?: number;
  /** Ẩn phần tử nếu chỉ có 1 trang (mặc định true) */
  hideOnSinglePage?: boolean;
  className?: string;
}

/**
 * Thanh phân trang dùng chung cho mọi bảng danh sách trong admin.
 * Hiển thị thông tin "Hiển thị X-Y trong tổng số Z" + nút Trước/Sau + các nút trang.
 */
export function Pagination({
  currentPage,
  totalPages,
  total,
  itemsPerPage,
  onPageChange,
  itemLabel = "bản ghi",
  maxVisiblePages = 5,
  hideOnSinglePage = true,
  className = "",
}: PaginationProps) {
  if (hideOnSinglePage && totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, total);

  const pageNumbers = getVisiblePages(currentPage, totalPages, maxVisiblePages);

  return (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border-t border-gray-100 ${className}`}
    >
      <div className="text-sm text-gray-600">
        Hiển thị {total === 0 ? 0 : startIndex + 1}-{endIndex} trong tổng số{" "}
        {total} {itemLabel}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
        >
          Trước
        </Button>
        <div className="flex items-center gap-1">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
        >
          Sau
        </Button>
      </div>
    </div>
  );
}

function getVisiblePages(
  currentPage: number,
  totalPages: number,
  maxVisible: number,
): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const half = Math.floor(maxVisible / 2);
  let start = currentPage - half;
  let end = currentPage + half;
  if (start < 1) {
    start = 1;
    end = maxVisible;
  }
  if (end > totalPages) {
    end = totalPages;
    start = totalPages - maxVisible + 1;
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
