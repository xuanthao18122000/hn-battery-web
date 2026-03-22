"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, LayoutGrid } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  sectionsApi,
  Section,
  SectionDataSourceEnum,
  SectionTypeEnum,
  StatusCommonEnum,
} from "@/lib/api/sections";

function getErrorMessage(error: unknown, fallback: string) {
  const response = (error as { response?: { data?: { message?: string | string[] } } })?.response;
  const message = response?.data?.message;
  if (Array.isArray(message)) {
    return message[0] ?? fallback;
  }
  return message ?? fallback;
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const fetchSections = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await sectionsApi.getList();
      setSections(Array.isArray(data) ? data : []);
    } catch (error: unknown) {
      setError("Không thể tải danh sách block.");
      setSections([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleDelete = async () => {
    if (!selectedSection) return;
    try {
      await sectionsApi.delete(selectedSection.id);
      setShowDeleteModal(false);
      setSelectedSection(null);
      fetchSections();
    } catch (error: unknown) {
      alert(getErrorMessage(error, "Không thể xóa block."));
    }
  };

  return (
    <div className="p-6">
      <AdminPageHeader
        title="Cấu hình block"
        actions={
          <Button variant="default" className="gap-2" asChild>
            <Link href="/admin/sections/new">
              <Plus className="w-4 h-4" />
              Thêm block
            </Link>
          </Button>
        }
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error}
        </div>
      )}

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Đang tải...</div>
        ) : sections.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <LayoutGrid className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Chưa có block nào. Bấm &quot;Thêm block&quot; để tạo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Tên
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Code
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Loại
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Nguồn
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Trang
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Vị trí
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Trạng thái
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Số hàng
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Số mục
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => (
                  <tr
                    key={section.id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {section.name}
                    </td>
                    <td className="py-4 px-4 text-gray-600">{section.code}</td>
                    <td className="py-4 px-4 text-gray-600">
                      {section.type === SectionTypeEnum.POST ? "Bài viết" : "Sản phẩm"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {(section.dataSource ?? SectionDataSourceEnum.MANUAL) ===
                      SectionDataSourceEnum.LATEST
                        ? "Mới nhất"
                        : "Chọn tay"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">{section.page}</td>
                    <td className="py-4 px-4 text-gray-600">
                      {section.position}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={
                          section.status === StatusCommonEnum.ACTIVE
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        {section.status === StatusCommonEnum.ACTIVE
                          ? "Bật"
                          : "Tắt"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {section.type === SectionTypeEnum.PRODUCT
                        ? (section.productRows ?? 2)
                        : "—"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {section.items?.length ?? 0}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/sections/${section.id}`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit className="w-4 h-4" />
                            Sửa
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setSelectedSection(section);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showDeleteModal && selectedSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Xóa block
            </h3>
            <p className="text-gray-600 mb-4">
              Bạn có chắc muốn xóa block &quot;{selectedSection.name}&quot;? Các mục
              cấu hình thủ công trong block cũng sẽ bị gỡ.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedSection(null);
                }}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
