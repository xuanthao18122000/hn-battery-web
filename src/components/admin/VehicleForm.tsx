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
import { vehiclesApi, Vehicle, CreateVehicleDto, UpdateVehicleDto, VehicleTypeEnum } from "@/lib/api/vehicles";

interface VehicleFormProps {
  vehicleId?: number;
  initialData?: Vehicle;
}

export default function VehicleForm({ vehicleId, initialData }: VehicleFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [slugMode, setSlugMode] = useState<"auto" | "manual">("auto");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    type: 1 as number, // 1 = Moto, 2 = Ô tô
    imageUrl: "",
    description: "",
    priority: 0,
    status: "active" as "active" | "inactive",
  });

  const isEditMode = !!vehicleId;

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
        type: initialData.type ?? VehicleTypeEnum.MOTO,
        imageUrl: initialData.imageUrl || "",
        description: initialData.description || "",
        priority: initialData.priority ?? 0,
        status: initialData.status === 1 ? "active" : "inactive",
      });
    } else if (isEditMode && vehicleId) {
      loadVehicle();
    }
  }, [vehicleId, initialData, isEditMode]);

  const loadVehicle = async () => {
    if (!vehicleId) return;
    setIsLoading(true);
    try {
      const vehicle = await vehiclesApi.getById(vehicleId);
      setFormData({
        name: vehicle.name,
        slug: vehicle.slug,
        type: vehicle.type ?? VehicleTypeEnum.MOTO,
        imageUrl: vehicle.imageUrl || "",
        description: vehicle.description || "",
        priority: vehicle.priority ?? 0,
        status: vehicle.status === 1 ? "active" : "inactive",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải thông tin xe.");
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
      if (isEditMode && vehicleId) {
        const data: UpdateVehicleDto = {
          name: formData.name,
          slug,
          type: formData.type,
          imageUrl: formData.imageUrl || undefined,
          description: formData.description || undefined,
          priority: formData.priority,
          status: formData.status === "active" ? 1 : -1,
        };
        await vehiclesApi.update(vehicleId, data);
      } else {
        const data: CreateVehicleDto = {
          name: formData.name,
          slug,
          type: formData.type,
          imageUrl: formData.imageUrl || undefined,
          description: formData.description || undefined,
          priority: formData.priority,
          status: formData.status === "active" ? 1 : -1,
        };
        await vehiclesApi.create(data);
      }

      router.push("/admin/vehicles");
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể lưu xe. Vui lòng thử lại.");
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
        <div className="max-w-4xl w-full">
          <Card className="p-6">
            <div className="text-center text-gray-500">Đang tải...</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="w-full max-w-3xl">
        <AdminPageHeader
          title={isEditMode ? "Sửa dòng xe" : "Thêm dòng xe mới"}
          backHref="/admin/vehicles"
          actions={
            <Button
              type="button"
              variant="default"
              onClick={handleSaveClick}
              className="flex items-center gap-2"
              disabled={isSaving}
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Đang lưu..." : isEditMode ? "Lưu thay đổi" : "Thêm xe"}
            </Button>
          }
        />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên xe *</label>
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
                  placeholder="VD: Honda City, Toyota Vios..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <div className="relative">
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="vd: honda-city, toyota-vios..."
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
                    ? "Tự động tạo từ tên xe"
                    : "Nhập slug thủ công (a-z, 0-9, dấu gạch ngang)."}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại xe</label>
                <Select
                  value={formData.type === VehicleTypeEnum.CAR ? "car" : "moto"}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      type: value === "car" ? VehicleTypeEnum.CAR : VehicleTypeEnum.MOTO,
                    })
                  }
                  options={[
                    { value: "moto", label: "Xe máy (Moto)" },
                    { value: "car", label: "Ô tô" },
                  ]}
                />
              </div>

              <div>
                <FileUpload
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  object="vehicles"
                  objectId={vehicleId?.toString() || "new"}
                  label="Ảnh đại diện"
                  helperText="Ảnh đại diện cho dòng xe."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả ngắn về dòng xe..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Độ ưu tiên</label>
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
                  <p className="text-xs text-gray-500 mt-1">Số nhỏ hiển thị trước.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
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
