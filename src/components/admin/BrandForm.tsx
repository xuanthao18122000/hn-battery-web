"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { Save, Wand2, Pencil } from "lucide-react";
import { AdminPageHeader } from "./AdminPageHeader";
import { brandsApi, Brand, CreateBrandDto, UpdateBrandDto } from "@/lib/api/brands";

interface BrandFormProps {
  brandId?: number;
  initialData?: Brand;
}

export default function BrandForm({ brandId, initialData }: BrandFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [slugMode, setSlugMode] = useState<"auto" | "manual">("auto");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logoUrl: "",
    description: "",
    priority: 0,
    status: "active" as "active" | "inactive",
  });

  const isEditMode = !!brandId;

  useEffect(() => {
    if (isEditMode) {
      setSlugMode("manual");
    } else {
      setSlugMode("auto");
    }
  }, [isEditMode]);

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        name: initialData.name,
        slug: initialData.slug,
        logoUrl: initialData.logoUrl || "",
        description: initialData.description || "",
        priority: initialData.priority ?? 0,
        status: initialData.status === 1 ? "active" : "inactive",
      });
    } else if (isEditMode && brandId) {
      loadBrand();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId, initialData, isEditMode]);

  const loadBrand = async () => {
    if (!brandId) return;
    setIsLoading(true);
    try {
      const brand = await brandsApi.getById(brandId);
      setFormData({
        name: brand.name,
        slug: brand.slug,
        logoUrl: brand.logoUrl || "",
        description: brand.description || "",
        priority: brand.priority ?? 0,
        status: brand.status === 1 ? "active" : "inactive",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải thông tin thương hiệu.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const slug = formData.slug || generateSlug(formData.name);
      if (isEditMode && brandId) {
        const data: UpdateBrandDto = {
          name: formData.name,
          slug,
          logoUrl: formData.logoUrl || undefined,
          description: formData.description || undefined,
          priority: formData.priority,
          status: formData.status === "active" ? 1 : -1,
        };
        await brandsApi.update(brandId, data);
      } else {
        const data: CreateBrandDto = {
          name: formData.name,
          slug,
          logoUrl: formData.logoUrl || undefined,
          description: formData.description || undefined,
          priority: formData.priority,
        };
        await brandsApi.create(data);
      }

      router.push("/admin/brands");
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể lưu thương hiệu. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveClick = () => {
    const form = document.querySelector("form");
    if (form) {
      (form as HTMLFormElement).requestSubmit();
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="w-full">
          <Card className="p-6">
            <div className="text-center text-gray-500">Đang tải...</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="w-full">
        <AdminPageHeader
          title={isEditMode ? "Sửa thương hiệu" : "Thêm thương hiệu mới"}
          backHref="/admin/brands"
          actions={
            <Button
              type="button"
              variant="default"
              onClick={handleSaveClick}
              className="flex items-center gap-2"
              disabled={isSaving}
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Đang lưu..." : isEditMode ? "Lưu thay đổi" : "Thêm thương hiệu"}
            </Button>
          }
        />

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên thương hiệu *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setFormData({
                      ...formData,
                      name: newName,
                      slug: slugMode === "auto" ? generateSlug(newName) : formData.slug,
                    });
                  }}
                  placeholder="VD: GS, Đồng Nai, Varta..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <div className="relative">
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="vd: gs, dong-nai, varta..."
                    required
                    disabled={slugMode === "auto"}
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSlugMode("auto");
                        setFormData({ ...formData, slug: generateSlug(formData.name) });
                      }}
                      className={`h-8 w-8 ${
                        slugMode === "auto"
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      }`}
                      title="Tự động tạo slug từ tên"
                    >
                      <Wand2 className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setSlugMode("manual")}
                      className={`h-8 w-8 ${
                        slugMode === "manual"
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      }`}
                      title="Nhập slug thủ công"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {slugMode === "auto"
                    ? "Tự động tạo từ tên thương hiệu"
                    : "Nhập slug thủ công (chỉ chứa a-z, 0-9, dấu gạch ngang)."}
                </p>
              </div>

              <div>
                <FileUpload
                  value={formData.logoUrl}
                  onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                  object="products"
                  objectId={brandId?.toString() || "0"}
                  label="Logo thương hiệu"
                  helperText="Ảnh vuông, nền trong suốt nếu có thể."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link hình (URL)
                </label>
                <Input
                  type="text"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value.trim() })}
                  placeholder="https://example.com/logo.png hoặc đường dẫn ảnh"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Có thể dán link ảnh từ nguồn ngoài. Nếu điền, sẽ dùng link này (có thể ghi đè ảnh đã upload).
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả ngắn về thương hiệu..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Độ ưu tiên
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Số nhỏ hiển thị trước trong danh sách thương hiệu.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <Select
                    value={formData.status}
                    onChange={(value) =>
                      setFormData({ ...formData, status: value as "active" | "inactive" })
                    }
                    options={[
                      { value: "active", label: "Hoạt động" },
                      { value: "inactive", label: "Ngừng hoạt động" },
                    ]}
                  />
                </div>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

