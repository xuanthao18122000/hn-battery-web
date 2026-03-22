"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { brandsApi, CreateBrandDto } from "@/lib/api/brands";
import { Upload, X } from "lucide-react";
import * as XLSX from "xlsx";

interface BrandImportModalProps {
  open: boolean;
  onClose: () => void;
  onImported: () => Promise<void> | void;
}

export function BrandImportModal({ open, onClose, onImported }: BrandImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importPreview, setImportPreview] = useState<CreateBrandDto[]>([]);
  const [importError, setImportError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError("");
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const items: CreateBrandDto[] = json
        .map((row) => {
          const name = String(row.name || row.Name || "").trim();
          if (!name) return null;
          const slug = String(row.slug || row.Slug || "").trim();
          const logoUrl = String(row.logoUrl || row.LogoUrl || row.logo || "").trim() || undefined;
          const description = String(row.description || row.Description || "").trim() || undefined;
          const priorityRaw = row.priority ?? row.Priority ?? 0;
          const priority =
            typeof priorityRaw === "number"
              ? priorityRaw
              : parseInt(String(priorityRaw), 10) || 0;

          const item: CreateBrandDto = {
            name,
            slug:
              slug ||
              name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/Đ/g, "D")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, ""),
            logoUrl,
            description,
            priority,
          };
          return item;
        })
        .filter(Boolean) as CreateBrandDto[];

      if (items.length === 0) {
        setImportError("File import không có dữ liệu hợp lệ (thiếu cột name).");
      } else {
        setImportPreview(items);
      }
    } catch (err: any) {
      setImportError(
        err?.response?.data?.message ||
          "Không thể đọc file. Vui lòng kiểm tra định dạng Excel."
      );
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleConfirmImport = async () => {
    if (importPreview.length === 0) {
      setImportError("Chưa có dữ liệu để import. Vui lòng chọn file Excel trước.");
      return;
    }
    setIsSubmitting(true);
    setImportError("");
    try {
      await brandsApi.createBulks(importPreview);
      await onImported();
      handleClose();
    } catch (err: any) {
      setImportError(
        err?.response?.data?.message ||
          "Không thể import danh sách thương hiệu. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setImportPreview([]);
    setImportError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/25 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Import thương hiệu từ Excel
          </h2>
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" />
              Chọn file Excel
            </Button>
            <p className="text-xs text-gray-500">
              Hỗ trợ .xlsx, .xls, .csv với cột:{" "}
              <strong>name, slug, logoUrl, description, priority</strong>.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileChange}
          />

          {importError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {importError}
            </div>
          )}

          {importPreview.length > 0 && (
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-700">
                Xem trước ({importPreview.length}) thương hiệu sẽ import
              </div>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">
                        Tên
                      </th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">
                        Slug
                      </th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">
                        Logo URL
                      </th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">
                        Ưu tiên
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {importPreview.map((item, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-50 last:border-b-0"
                      >
                        <td className="py-2 px-3 text-gray-900">{item.name}</td>
                        <td className="py-2 px-3 text-gray-600">{item.slug}</td>
                        <td className="py-2 px-3 text-gray-600 truncate max-w-[220px]">
                          {item.logoUrl || "—"}
                        </td>
                        <td className="py-2 px-3 text-gray-600">
                          {item.priority ?? 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleConfirmImport}
            disabled={isSubmitting || importPreview.length === 0}
            className="flex items-center gap-2"
          >
            {isSubmitting ? "Đang import..." : "Xác nhận import"}
          </Button>
        </div>
      </div>
    </div>
  );
}

