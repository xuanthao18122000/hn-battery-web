"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AdminPageHeaderProps {
  /** Tiêu đề trang (bên trái) */
  title: React.ReactNode;
  /** Mô tả ngắn dưới tiêu đề (tùy chọn) */
  description?: React.ReactNode;
  /** Link nút "Quay lại". Nếu không truyền thì không hiển thị nút Back */
  backHref?: string;
  /** Nhãn nút Back, mặc định "Quay lại" */
  backLabel?: string;
  /** Nội dung bên phải (nút Lưu, Thêm..., v.v.) — hiển thị trước nút Back */
  actions?: React.ReactNode;
}

/**
 * Header chuẩn cho các trang admin: tiêu đề trái, actions + nút Quay lại phải.
 * Dùng thống nhất cho trang sửa/thêm/danh sách.
 */
export function AdminPageHeader({
  title,
  description,
  backHref,
  backLabel = "Quay lại",
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6 bg-white p-4 rounded-lg border border-gray-100">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description != null && (
          <p className="text-gray-600 text-sm mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        {backHref != null && (
          <Button variant="outline" className="gap-2" asChild>
            <Link href={backHref}>
              <ArrowLeft className="w-4 h-4" />
              {backLabel}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
