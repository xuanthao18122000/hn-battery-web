"use client";

export interface TableSkeletonProps {
  /** Số cột trong bảng */
  columns: number;
  /** Số hàng skeleton hiển thị (mặc định 8) */
  rows?: number;
}

/**
 * Skeleton loader cho bảng danh sách trong admin.
 * Dùng thay thế dòng "Đang tải..." khi fetch list.
 */
export function TableSkeleton({ columns, rows = 8 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx} className="border-b border-gray-50">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td key={colIdx} className="py-4 px-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
