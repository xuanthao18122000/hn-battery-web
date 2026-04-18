"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { vehiclesApi, Vehicle, VehicleTypeEnum } from "@/lib/api/vehicles";
import { Search, Plus, Edit, Car, Trash2 } from "lucide-react";
import { AdminPageHeader, Pagination, TableSkeleton } from "@/components/admin";

const TYPE_LABELS: Record<number, string> = {
  [VehicleTypeEnum.MOTO]: "Xe máy",
  [VehicleTypeEnum.CAR]: "Ô tô",
};

export default function VehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    fetchVehicles();
  }, [currentPage, searchTerm, filterType]);

  const fetchVehicles = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (searchTerm) params.name = searchTerm;
      if (filterType !== "") params.type = filterType;
      const response = await vehiclesApi.getList(params);
      setVehicles(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError("Không thể tải danh sách xe. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    router.push("/admin/vehicles/new");
  };

  const handleEdit = (vehicle: Vehicle) => {
    router.push(`/admin/vehicles/${vehicle.id}`);
  };

  const handleDelete = async (vehicle: Vehicle) => {
    if (!confirm(`Bạn có chắc muốn xóa "${vehicle.name}"?`)) return;
    try {
      await vehiclesApi.delete(vehicle.id);
      fetchVehicles();
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể xóa xe.");
    }
  };

  const getStatusBadge = (status: number) => {
    const isActive = status === 1;
    return isActive ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Hoạt động
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Ngừng hoạt động
      </span>
    );
  };

  const getTypeBadge = (type: number) => {
    const label = TYPE_LABELS[type] ?? "—";
    const isCar = type === VehicleTypeEnum.CAR;
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          isCar ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
        }`}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeader
          title="Quản lý dòng xe"
          description="Quản lý danh sách dòng xe (vehicle) gắn với sản phẩm."
          actions={
            <Button variant="default" onClick={handleAdd} className="gap-2">
              <Plus className="w-4 h-4" />
              Thêm dòng xe
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng số dòng xe</p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </div>
              <Car className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative max-w-md flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Tìm theo tên xe..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value === "" ? "" : Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white min-w-[140px]"
            >
              <option value="">Tất cả loại xe</option>
              <option value={VehicleTypeEnum.MOTO}>Xe máy</option>
              <option value={VehicleTypeEnum.CAR}>Ô tô</option>
            </select>
          </div>
        </Card>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tên xe</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Slug</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Loại xe</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ảnh</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ưu tiên</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trạng thái</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton columns={7} />
                ) : vehicles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      Không tìm thấy dòng xe nào
                    </td>
                  </tr>
                ) : (
                  vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{vehicle.name}</div>
                        {vehicle.description && (
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {vehicle.description}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-600">/{vehicle.slug}</td>
                      <td className="py-4 px-4">{getTypeBadge(vehicle.type ?? VehicleTypeEnum.MOTO)}</td>
                      <td className="py-4 px-4">
                        {vehicle.imageUrl ? (
                          <img
                            src={vehicle.imageUrl}
                            alt={vehicle.name}
                            className="w-10 h-10 object-cover rounded bg-gray-50 border border-gray-100"
                          />
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center rounded bg-gray-100 text-gray-500 text-sm font-semibold">
                            {vehicle.name.charAt(0)}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-600">{vehicle.priority}</td>
                      <td className="py-4 px-4">{getStatusBadge(vehicle.status)}</td>
                      <td className="py-4 px-4 flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(vehicle)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            itemLabel="xe"
          />
        </Card>
      </div>
    </div>
  );
}
